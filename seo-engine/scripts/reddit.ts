/**
 * Reddit Intelligence module.
 *
 * Reddit is an *intent discovery* source, NOT a content source. This module
 * collects post titles and distils them into research signals — questions,
 * pain points, use cases, comparisons, misconceptions, terminology — ranked by
 * how often they recur and how much engagement they draw. It NEVER reproduces,
 * paraphrases, or publishes Reddit prose. Only classified, clustered, normalized
 * phrases and counts flow downstream.
 *
 * Two halves, called by the two pipeline scripts:
 *   collectRedditPosts()    → research.ts  (network; writes raw posts file)
 *   extractRedditResearch() → extract.ts   (pure; merges signals into research.json)
 */

import { fetchJson, fetchSerpResults } from './utils/scraper.js';
import { getCachedData, setCachedData } from './utils/cache.js';
import {
  REDDIT_MAX_POSTS,
  REDDIT_MAX_QUERIES,
  REDDIT_MIN_TITLE_LEN,
  REDDIT_INTENT_AXIS,
  REDDIT_OPPORTUNITY_COUNT,
} from './utils/config.js';
import { normalizeHeading, titleCase } from './utils/text.js';
import { isMeaningful } from './utils/terms.js';
import { COMPARISON_RE, TROUBLESHOOT_RE, DEFINITION_RE } from './utils/scoring.js';
import type {
  CompetitorPage,
  RedditPost,
  RedditResearch,
  RedditSignal,
  QuestionCategory,
} from '../types/index.js';

/* ===========================================================================
 * 1. Query generation
 * ========================================================================= */

/**
 * Reddit-specific search queries from a tool slug. Leads with the subject term,
 * then intent-bearing variants (vs / problem / question) that surface the
 * comparison, pain-point, and question discussions we care about.
 *   "base64-encoder-decoder" → base64, base64 encoder, base64 vs, base64 problem, base64 question
 *   "pomodoro-timer"         → pomodoro, pomodoro timer, pomodoro vs, pomodoro problem, pomodoro question
 */
export function generateRedditQueries(toolSlug: string): string[] {
  const tokens = toolSlug.split('-').filter(Boolean);
  if (tokens.length === 0) return [];
  const subject = tokens[0];

  const queries = new Set<string>();
  queries.add(subject);
  if (tokens[1]) queries.add(`${subject} ${tokens[1]}`);
  queries.add(`${subject} vs`);
  queries.add(`${subject} problem`);
  queries.add(`${subject} question`);

  return Array.from(queries).slice(0, REDDIT_MAX_QUERIES);
}

/* ===========================================================================
 * 2. Collection (network)
 * ========================================================================= */

interface RedditApiChild {
  data: {
    title?: string;
    subreddit?: string;
    permalink?: string;
    score?: number;
    num_comments?: number;
    over_18?: boolean;
    stickied?: boolean;
    author?: string;
    removed_by_category?: string | null;
  };
}
interface RedditApiListing {
  data?: { children?: RedditApiChild[] };
}

/** True for posts we never want as signal: deleted/removed, NSFW, stickied, too short. */
function isLowQualityPost(d: RedditApiChild['data']): boolean {
  if (!d.title || d.title.trim().length < REDDIT_MIN_TITLE_LEN) return true;
  if (d.removed_by_category) return true;
  if (d.author === '[deleted]') return true;
  if (d.over_18) return true;
  if (d.stickied) return true;
  return false;
}

/** Parse "https://www.reddit.com/r/<sub>/..." → "<sub>". */
function subredditFromUrl(url: string): string {
  const m = url.match(/reddit\.com\/r\/([^/]+)/i);
  return m ? m[1] : 'unknown';
}

/**
 * Collects up to REDDIT_MAX_POSTS posts for a tool. Primary path is Reddit's
 * public search JSON (gives score/comments/flags → engagement ranking + spam
 * filtering); if that yields nothing across all queries (block/rate-limit), it
 * falls back to `site:reddit.com` SERP results (titles+URLs only). Cache-first
 * per query. Never throws — returns [] on total failure so the pipeline survives.
 */
export async function collectRedditPosts(toolSlug: string): Promise<RedditPost[]> {
  const queries = generateRedditQueries(toolSlug);
  const byUrl = new Map<string, RedditPost>();

  // --- Primary: Reddit search JSON ---
  for (const query of queries) {
    const cacheKey = `reddit:${query}`;
    let posts = getCachedData<RedditPost[]>(cacheKey);

    if (!posts) {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=25&sort=relevance&type=link`;
      const listing = await fetchJson<RedditApiListing>(url);
      const children = listing?.data?.children ?? [];
      posts = [];
      for (const child of children) {
        const d = child.data;
        if (isLowQualityPost(d)) continue;
        posts.push({
          title: d.title!.trim(),
          subreddit: d.subreddit ?? 'unknown',
          url: `https://www.reddit.com${d.permalink ?? ''}`,
          score: d.score,
          comments: d.num_comments,
        });
      }
      if (posts.length > 0) setCachedData(cacheKey, posts);
      console.log(`  [reddit] "${query}": ${posts.length} posts`);
    } else {
      console.log(`  [cache] reddit "${query}"`);
    }

    for (const p of posts) if (!byUrl.has(p.url)) byUrl.set(p.url, p);
  }

  // --- Fallback: site:reddit.com SERP (no engagement data) ---
  if (byUrl.size === 0) {
    console.log('  [reddit] JSON path empty — falling back to site:reddit.com SERP');
    for (const query of queries) {
      let results;
      try {
        results = await fetchSerpResults(`site:reddit.com ${query}`);
      } catch (err) {
        console.warn(`  [warn] reddit SERP "${query}": ${(err as Error).message}`);
        continue;
      }
      for (const r of results) {
        if (!/reddit\.com\/r\//i.test(r.url)) continue;
        if (!r.title || r.title.trim().length < REDDIT_MIN_TITLE_LEN) continue;
        if (!byUrl.has(r.url)) {
          byUrl.set(r.url, {
            title: r.title.trim(),
            subreddit: subredditFromUrl(r.url),
            url: r.url,
            // score/comments intentionally undefined — lowers dataConfidence later.
          });
        }
      }
    }
  }

  // Highest-engagement first, capped.
  return Array.from(byUrl.values())
    .sort((a, b) => postEngagement(b) - postEngagement(a))
    .slice(0, REDDIT_MAX_POSTS);
}

/* ===========================================================================
 * 3. Signal extraction (pure)
 * ========================================================================= */

const PAINPOINT_RE = /\b(problem|issue|broken|error|not working|doesn'?t work|won'?t work|help|confused|stuck|failing|fail(s|ed)?|invalid|wrong)\b/i;
// A misconception asserts a (usually false or skeptical) premise about the tool.
// Two flavours, kept cross-domain because the engine serves tools of every kind:
//   - security/format premises ("is base64 encryption?", "can it secure passwords?")
//   - skepticism/myth premises ("is pomodoro a scam?", "does it really work?")
const MISCONCEPTION_RE = /\b(myth|scam|placebo|pseudoscience|overrated|gimmick|snake oil)\b|\b(is|are|can|does|do|isn'?t)\b.*\b(encrypt(ion|ed)?|secure|security|safe|password|hash(ed|ing)?|compress(ed|ion)?|really work|actually work|even work|legit|worth it|a myth)\b/i;
const USECASE_RE = /\busing\b|\buse case\b|\b(use|used)\s+\w+\s+(for|in|with|to)\b|\bfor\s+\w+|\bin\s+\w+\b/i;
const QUESTION_RE = /^(what|why|how|when|where|can|should|does|is|are|do|which|who)\b/i;

const SECURITY_RE = /\b(encrypt|secure|security|safe|password|hash)\b/i;
const IMPLEMENTATION_RE = /\b(implement|library|api|sdk|code|function|method|in (python|js|javascript|java|c#|php|node|go|rust|ruby))\b/i;
const EXAMPLE_RE = /\b(example|sample|demo)\b/i;

// Generic, content-free clusters to discard.
const GENERIC_CLUSTERS = new Set([
  'help', 'help please', 'please help', 'need advice', 'advice', 'question',
  'questions', 'thoughts', 'anyone', 'newbie', 'beginner', 'quick question',
]);

function isQuestionTitle(t: string): boolean {
  const s = t.trim();
  return s.endsWith('?') || QUESTION_RE.test(s);
}

function postEngagement(p: RedditPost): number {
  return (p.score ?? 0) + (p.comments ?? 0);
}

/** Strip enumerators and trailing punctuation; keep original casing for display. */
function cleanTitle(t: string): string {
  return t
    .replace(/^\s*(q[.):]|\d+[.):])\s*/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[?!.]+$/, '')
    .trim();
}

/**
 * Cluster key that merges near-duplicate phrasings ("what is base64",
 * "what exactly is base64", "can someone explain base64"). Normalizes, drops
 * conversational filler, and lightly singularizes so the same intent collapses
 * to one cluster.
 */
function clusterKey(title: string): string {
  return normalizeHeading(title)
    .replace(/[?!.]+/g, ' ')
    .replace(/\b(exactly|really|actually|even|someone|somebody|anyone|please|just|basically|explain|quick)\b/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
    .join(' ')
    .trim();
}

function isSpamTitle(t: string): boolean {
  if (/^https?:\/\//i.test(t)) return true; // URL-only
  if (!/[a-z0-9]/i.test(t)) return true; // emoji/punctuation only
  return false;
}

interface Item { title: string; engagement: number }

/** Group titles into ranked, deduped clusters → RedditSignal[]. */
function buildSignals(items: Item[]): RedditSignal[] {
  const clusters = new Map<string, { items: Item[]; engagement: number }>();

  for (const it of items) {
    if (isSpamTitle(it.title)) continue;
    const key = clusterKey(it.title);
    if (!key || key.length < 5 || GENERIC_CLUSTERS.has(key)) continue;
    let c = clusters.get(key);
    if (!c) clusters.set(key, (c = { items: [], engagement: 0 }));
    c.items.push(it);
    c.engagement += it.engagement;
  }

  const signals: RedditSignal[] = [];
  for (const c of clusters.values()) {
    const sorted = [...c.items].sort((a, b) => a.title.length - b.title.length);
    signals.push({
      topic: cleanTitle(sorted[0].title),
      frequency: c.items.length,
      engagement: c.engagement,
      examples: sorted.slice(0, 3).map(i => i.title),
    });
  }

  // Rank by engagement, then by how often the intent recurs.
  return signals.sort((a, b) => b.engagement - a.engagement || b.frequency - a.frequency);
}

function categorizeQuestion(topic: string): QuestionCategory {
  if (DEFINITION_RE.test(topic)) return 'definition';
  if (COMPARISON_RE.test(topic)) return 'comparison';
  if (TROUBLESHOOT_RE.test(topic)) return 'troubleshooting';
  if (SECURITY_RE.test(topic)) return 'security';
  if (IMPLEMENTATION_RE.test(topic)) return 'implementation';
  if (EXAMPLE_RE.test(topic)) return 'example';
  return 'usage';
}

/** Recurring meaningful nouns across titles (doc frequency ≥ 2). */
function buildTerminology(posts: RedditPost[]): RedditSignal[] {
  const docCount = new Map<string, number>();
  const engagement = new Map<string, number>();

  for (const p of posts) {
    const seen = new Set<string>();
    const eng = postEngagement(p);
    for (const w of p.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
      if (!isMeaningful(w) || seen.has(w)) continue;
      seen.add(w);
      docCount.set(w, (docCount.get(w) ?? 0) + 1);
      engagement.set(w, (engagement.get(w) ?? 0) + eng);
    }
  }

  return Array.from(docCount.entries())
    .filter(([, n]) => n >= 2)
    .map(([term, n]) => ({
      topic: titleCase(term),
      frequency: n,
      engagement: engagement.get(term) ?? 0,
      examples: [] as string[],
    }))
    .sort((a, b) => b.frequency - a.frequency || b.engagement - a.engagement);
}

const AUDIENCE_RULES: { label: string; re: RegExp }[] = [
  { label: 'developer', re: /(webdev|programming|learnprogramming|javascript|python|node|devops|coding|programmer|engineer|developer)/i },
  { label: 'student', re: /(student|homework|study|college|university|cscareerquestions|learn)/i },
  { label: 'professional', re: /(productivity|getdisciplined|business|career|professional|work)/i },
  { label: 'writer', re: /(writing|marketing|copywriting|blogging|seo|content|writer)/i },
];

function detectAudience(posts: RedditPost[]): string[] {
  const haystack = posts.map(p => `${p.subreddit} ${p.title}`).join(' \n ');
  return AUDIENCE_RULES.filter(r => r.re.test(haystack)).map(r => r.label);
}

/** Build a lowercase blob of competitor coverage to test topic novelty against. */
function competitorBlob(competitors: CompetitorPage[]): string {
  return competitors
    .flatMap(c => [c.title, ...c.h1, ...c.h2, ...c.h3, ...c.faqQuestions])
    .join(' \n ')
    .toLowerCase();
}

/** True when a topic's meaningful words already appear in competitor content. */
function isCovered(topic: string, blob: string): boolean {
  const words = topic.toLowerCase().split(/[^a-z0-9]+/).filter(isMeaningful);
  if (words.length === 0) return true;
  return words.every(w => blob.includes(w));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Turns collected posts into the full Reddit intelligence block. Pure and
 * deterministic — same posts + competitors always yield the same output.
 * `competitors` is used only to award a gap bonus to opportunities competitors
 * don't already cover.
 */
export function extractRedditResearch(
  posts: RedditPost[],
  competitors: CompetitorPage[] = [],
): RedditResearch {
  const empty: RedditResearch = {
    redditQuestions: [],
    redditPainPoints: [],
    redditUseCases: [],
    redditComparisons: [],
    redditTerminology: [],
    redditMisconceptions: [],
    subredditBreakdown: {},
    audienceTypes: [],
    redditDemandScore: 0,
    contentOpportunities: [],
    sampleSize: 0,
    dataConfidence: 0,
    redditIntentScore: 0,
  };
  if (posts.length === 0) return empty;

  // Bucket titles (a title may seed multiple buckets).
  const questionItems: Item[] = [];
  const painItems: Item[] = [];
  const useCaseItems: Item[] = [];
  const comparisonItems: Item[] = [];
  const misconceptionItems: Item[] = [];

  for (const p of posts) {
    const item: Item = { title: p.title, engagement: postEngagement(p) };
    const t = p.title;
    if (COMPARISON_RE.test(t)) comparisonItems.push(item);
    if (MISCONCEPTION_RE.test(t)) misconceptionItems.push(item);
    if (PAINPOINT_RE.test(t)) painItems.push(item);
    if (isQuestionTitle(t)) questionItems.push(item);
    if (!isQuestionTitle(t) && USECASE_RE.test(t)) useCaseItems.push(item);
  }

  const redditQuestions = buildSignals(questionItems).map(s => ({
    ...s,
    category: categorizeQuestion(s.topic),
  }));
  const redditPainPoints = buildSignals(painItems);
  const redditUseCases = buildSignals(useCaseItems);
  const redditComparisons = buildSignals(comparisonItems);
  const redditMisconceptions = buildSignals(misconceptionItems);
  const redditTerminology = buildTerminology(posts);

  // Subreddit breakdown.
  const subredditBreakdown: Record<string, number> = {};
  for (const p of posts) {
    subredditBreakdown[p.subreddit] = (subredditBreakdown[p.subreddit] ?? 0) + 1;
  }

  const audienceTypes = detectAudience(posts);

  // --- redditIntentScore: +20 per non-empty intent axis ---
  const axes = [redditQuestions, redditPainPoints, redditUseCases, redditComparisons, redditMisconceptions];
  const redditIntentScore = Math.min(100, axes.filter(a => a.length > 0).length * REDDIT_INTENT_AXIS);

  // --- redditDemandScore: blend volume, engagement, breadth, pain ---
  const sampleSize = posts.length;
  const totalEngagement = posts.reduce((s, p) => s + postEngagement(p), 0);
  const uniqueDiscussions = redditQuestions.length + redditComparisons.length + redditPainPoints.length;
  const fScore = Math.min(40, sampleSize * 2);
  const eScore = Math.min(30, Math.log10(totalEngagement + 1) * 10);
  const bScore = Math.min(20, uniqueDiscussions * 2);
  const pScore = Math.min(10, (redditPainPoints.length + redditMisconceptions.length) * 2);
  const redditDemandScore = Math.round(Math.min(100, fScore + eScore + bScore + pScore));

  // --- contentOpportunities: comparisons + misconceptions + top questions,
  //     scored by frequency + engagement + competitor-gap bonus ---
  const blob = competitorBlob(competitors);
  const candidates = [...redditComparisons, ...redditMisconceptions, ...redditQuestions.slice(0, 8)];
  const maxFreq = Math.max(1, ...candidates.map(c => c.frequency));
  const maxEng = Math.max(1, ...candidates.map(c => c.engagement));
  const oppByTopic = new Map<string, number>();
  for (const c of candidates) {
    const score = Math.round(
      (c.frequency / maxFreq) * 40 +
        (c.engagement / maxEng) * 40 +
        (isCovered(c.topic, blob) ? 0 : 20),
    );
    // Keep the highest score if the same topic appears in multiple buckets.
    if (!oppByTopic.has(c.topic) || score > oppByTopic.get(c.topic)!) {
      oppByTopic.set(c.topic, score);
    }
  }
  const contentOpportunities = Array.from(oppByTopic, ([topic, score]) => ({ topic, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, REDDIT_OPPORTUNITY_COUNT);

  // --- dataConfidence: scales with sample size; halved when engagement data is
  //     absent (SERP fallback path) so weak samples don't drive strong claims ---
  const hasEngagement = posts.some(p => p.score !== undefined);
  let dataConfidence = Math.min(1, sampleSize / REDDIT_MAX_POSTS);
  if (!hasEngagement) dataConfidence *= 0.5;

  return {
    redditQuestions,
    redditPainPoints,
    redditUseCases,
    redditComparisons,
    redditTerminology,
    redditMisconceptions,
    subredditBreakdown,
    audienceTypes,
    redditDemandScore,
    contentOpportunities,
    sampleSize,
    dataConfidence: round2(dataConfidence),
    redditIntentScore,
  };
}
