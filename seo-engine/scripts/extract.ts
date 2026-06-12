/**
 * Steps 4-9: Parse HTML, extract entities/questions/intents/gaps, write research.json.
 * Usage: tsx scripts/extract.ts <tool-slug>
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { extractCompetitorPage } from './utils/extractor.js';
import { ENTITY_WEIGHTS, ENTITY_COUNT, GAP_THRESHOLDS, LIMITS, REDDIT_ENTITY_BONUS } from './utils/config.js';
import { normalizeHeading, isJunkHeading, titleCase, dedupeQuestions, cleanQuestion } from './utils/text.js';
import { isMeaningful, isSpecificEntity } from './utils/terms.js';
import { extractRedditResearch } from './reddit.js';
import type { CompetitorPage, RedditPost, RedditResearch, ResearchDocument } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const QUESTION_STARTERS = /^(what|why|how|when|where|can|should|does|is|are|do|which|who)\b/i;

function isQuestion(text: string): boolean {
  const t = text.trim();
  return t.endsWith('?') || QUESTION_STARTERS.test(t);
}

// Intent keyword maps
const PRIMARY_INTENT_SIGNALS: Record<string, string> = {
  tool: 'tool usage', converter: 'tool usage', generator: 'tool usage',
  calculator: 'tool usage', encoder: 'tool usage', decoder: 'tool usage',
  formatter: 'tool usage', validator: 'tool usage', parser: 'tool usage',
  checker: 'tool usage', tester: 'tool usage',
};

const SECONDARY_INTENT_SIGNALS: Record<string, string> = {
  'what is': 'learning', 'guide': 'learning', 'how does': 'learning',
  'tutorial': 'learning', 'overview': 'learning', 'introduction': 'learning',
  'explained': 'learning', 'learn': 'learning',
};

const toolSlug = process.argv[2];
if (!toolSlug) {
  console.error('Usage: tsx scripts/extract.ts <tool-slug>');
  process.exit(1);
}

console.log(`\n=== SEO Extract: ${toolSlug} ===\n`);

const rawDir = join(ROOT, 'research', 'raw', toolSlug);
if (!existsSync(rawDir)) {
  console.error(`Raw research not found. Run: npm run seo:research -- ${toolSlug}`);
  process.exit(1);
}

// Step 4: Parse HTML files
console.log('[4/9] Parsing HTML files...');
const htmlFiles = readdirSync(rawDir).filter(f => f.match(/^result-\d+\.html$/));
if (htmlFiles.length === 0) {
  console.error('No HTML files found in raw directory.');
  process.exit(1);
}

// Read search-results for URLs
let urlMap: Record<string, string> = {};
const searchResultsPath = join(rawDir, 'search-results.json');
if (existsSync(searchResultsPath)) {
  const sr = JSON.parse(readFileSync(searchResultsPath, 'utf-8'));
  (sr.results ?? []).forEach((r: { url: string }, i: number) => {
    urlMap[`result-${i + 1}.html`] = r.url;
  });
}

const competitors: CompetitorPage[] = [];
for (const file of htmlFiles.sort()) {
  const html = readFileSync(join(rawDir, file), 'utf-8');
  const url = urlMap[file] ?? file;
  const page = extractCompetitorPage(html, url);
  competitors.push(page);
  console.log(`  Parsed ${file}: "${page.title.slice(0, 60)}" (${page.wordCount} words)`);
}

// Write competitors.json
const processedDir = join(ROOT, 'research', 'processed', toolSlug);
mkdirSync(processedDir, { recursive: true });
writeFileSync(join(processedDir, 'competitors.json'), JSON.stringify(competitors, null, 2));
console.log(`  Wrote: research/processed/${toolSlug}/competitors.json`);

// Reddit Intelligence — load posts collected by seo:research (if any) and distil
// signals. Absent file → empty research (never an error); competitor analysis
// stands on its own.
const redditPostsPath = join(ROOT, 'research', 'reddit', `${toolSlug}-posts.json`);
let redditPosts: RedditPost[] = [];
if (existsSync(redditPostsPath)) {
  try {
    redditPosts = (JSON.parse(readFileSync(redditPostsPath, 'utf-8')).posts ?? []) as RedditPost[];
  } catch {
    console.warn(`  [warn] Could not parse ${toolSlug}-posts.json — skipping Reddit signals`);
  }
}
const reddit: RedditResearch = extractRedditResearch(redditPosts, competitors);
console.log(`  Reddit: ${redditPosts.length} posts → ${reddit.redditQuestions.length} questions, ` +
  `${reddit.redditPainPoints.length} pain points, ${reddit.redditMisconceptions.length} misconceptions ` +
  `(intent ${reddit.redditIntentScore}, demand ${reddit.redditDemandScore})`);

// Step 5: Entity extraction (deterministic, frequency-weighted)
console.log('\n[5/9] Extracting entities...');

// Domain allowlist rescues tool-topic words the generic-junk filter would drop.
// Sources: slug tokens always; tags/keywords/knowledge concepts from the
// content-graph snapshot when present (optional — run `npm run seo:graph`).
const entityAllowlist = new Set<string>(toolSlug.split('-').filter(t => t.length > 2));
const graphPath = join(ROOT, 'cache', 'content-graph.json');
if (existsSync(graphPath)) {
  try {
    const graphTool = JSON.parse(readFileSync(graphPath, 'utf-8')).tools?.[toolSlug];
    const sources: string[] = [
      ...(graphTool?.tags ?? []),
      ...(graphTool?.keywords ?? []),
      ...(graphTool?.knowledge?.primaryConcepts ?? []),
      ...(graphTool?.knowledge?.keywords ?? []),
    ];
    for (const s of sources) {
      const phrase = s.toLowerCase().trim();
      entityAllowlist.add(phrase);
      phrase.split(/\s+/).forEach(t => t.length > 2 && entityAllowlist.add(t));
    }
  } catch {
    // snapshot unreadable → slug tokens alone still work
  }
}

interface TermScore { term: string; score: number }

const termScores = new Map<string, number>();
// Distinct competitor pages each term appears on (document frequency). A term
// that only appears on one page is almost always a site-specific tagline
// ("Get More Done in Less Time"), not a topic entity — so we gate on this.
const termDocs = new Map<string, Set<number>>();

function record(term: string, weight: number, docId: number): void {
  termScores.set(term, (termScores.get(term) ?? 0) + weight);
  let docs = termDocs.get(term);
  if (!docs) termDocs.set(term, (docs = new Set()));
  docs.add(docId);
}

function scoreTerms(texts: string[], weight: number, docId: number): void {
  for (const text of texts) {
    // Split on punctuation FIRST so bigrams never span a phrase boundary —
    // a title like "Technique 101: Get More Done in Less Time" must not yield
    // the cross-boundary bigram "101 done". Each punctuation-delimited segment
    // is scored independently.
    const segments = text.toLowerCase().split(/[^a-z0-9\s-]+/);
    for (const segment of segments) {
      const meaningful = segment.split(/\s+/).filter(Boolean).filter(isMeaningful);

      // Single terms
      for (const w of meaningful) {
        record(w, weight, docId);
      }

      // Bigrams (within-segment only)
      for (let i = 0; i < meaningful.length - 1; i++) {
        record(`${meaningful[i]} ${meaningful[i + 1]}`, weight * ENTITY_WEIGHTS.bigram, docId);
      }
    }
  }
}

for (let i = 0; i < competitors.length; i++) {
  const c = competitors[i];
  scoreTerms(c.h1, ENTITY_WEIGHTS.h1, i);
  scoreTerms(c.h2, ENTITY_WEIGHTS.h2, i);
  scoreTerms(c.h3, ENTITY_WEIGHTS.h3, i);
  // strong/b extraction was done in extractor but stored in bodyText context;
  // use title and description as proxy for important terms
  scoreTerms([c.title], ENTITY_WEIGHTS.title, i);
  scoreTerms([c.description], ENTITY_WEIGHTS.description, i);
}

// Require terms to appear across multiple pages once the corpus is large enough
// to make that meaningful; fall back to single-page on tiny corpora.
const minEntityDocs = competitors.length >= 3 ? 2 : 1;

const sortedTerms: TermScore[] = Array.from(termScores.entries())
  .filter(([term]) => (termDocs.get(term)?.size ?? 0) >= minEntityDocs)
  .map(([term, score]) => ({ term, score }))
  .sort((a, b) => b.score - a.score);

// Drop single words already covered by a higher-ranked bigram, so the top list
// isn't padded with fragments of a phrase it already contains.
const bigramWords = new Set<string>();
for (const { term } of sortedTerms) {
  if (term.includes(' ')) term.split(' ').forEach(w => bigramWords.add(w));
}

const entities: string[] = [];
for (const { term } of sortedTerms) {
  if (entities.length >= ENTITY_COUNT) break;
  // single word — skip if a bigram already represents it
  if (!term.includes(' ') && bigramWords.has(term)) continue;
  // generic filler ("less time", "actually") never becomes an entity
  if (!isSpecificEntity(term, entityAllowlist)) continue;
  // Title-case for display
  entities.push(term.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
}

// Entity injection [#9]: fold in the vocabulary real users actually use (from
// Reddit terminology) so the entity graph reflects user language — JWT, padding —
// not just competitor SEO jargon. Deduped case-insensitively against existing
// entities; capped with a small bonus over ENTITY_COUNT.
const entityKeys = new Set(entities.map(e => e.toLowerCase()));
for (const term of reddit.redditTerminology) {
  if (entities.length >= ENTITY_COUNT + REDDIT_ENTITY_BONUS) break;
  const key = term.topic.toLowerCase();
  if (entityKeys.has(key)) continue;
  if (!isSpecificEntity(term.topic, entityAllowlist)) continue;
  entityKeys.add(key);
  entities.push(term.topic);
}

console.log(`  Found ${entities.length} entities`);

// Step 6: Question extraction
console.log('\n[6/9] Extracting questions...');

const allHeadings = competitors.flatMap(c => [...c.h2, ...c.h3]);
const allFaqs = competitors.flatMap(c => c.faqQuestions);

// Dedupe exact matches case-insensitively, then collapse semantic near-dupes
// ("What is Base64?" / "What exactly is Base64 encoding?") before capping —
// otherwise the FAQ draft hands the agent the same question three ways.
const seenQuestions = new Set<string>();
const questionCandidates: string[] = [];
for (const q of [...allHeadings, ...allFaqs]) {
  const text = cleanQuestion(q);
  if (!isQuestion(text)) continue;
  const key = text.toLowerCase();
  if (seenQuestions.has(key)) continue;
  seenQuestions.add(key);
  questionCandidates.push(text);
}
const questions = dedupeQuestions(questionCandidates).slice(0, LIMITS.questions);
console.log(`  Found ${questions.length} questions (${questionCandidates.length - questions.length} near-duplicates collapsed)`);

// Step 7: Intent detection
console.log('\n[7/9] Detecting intent...');

const allHeadingsLower = allHeadings.map(h => h.toLowerCase());
let primaryIntent = 'utility';
let secondaryIntent = 'learning';

// First matching signal across all headings wins (settle, don't overwrite).
function detectIntent(signals: Record<string, string>): string | null {
  for (const heading of allHeadingsLower) {
    const hit = Object.keys(signals).find(signal => heading.includes(signal));
    if (hit) return signals[hit];
  }
  return null;
}

primaryIntent = detectIntent(PRIMARY_INTENT_SIGNALS) ?? primaryIntent;

// Tool slug tokens are a strong, direct signal — let them take precedence.
const slugIntent = toolSlug.split('-').map(t => PRIMARY_INTENT_SIGNALS[t]).find(Boolean);
if (slugIntent) primaryIntent = slugIntent;

secondaryIntent = detectIntent(SECONDARY_INTENT_SIGNALS) ?? secondaryIntent;

console.log(`  Primary: ${primaryIntent}, Secondary: ${secondaryIntent}`);

// Step 8: Content gap detection via heading frequency map
console.log('\n[8/9] Detecting content gaps...');

const headingFreq = new Map<string, number>();
const totalPages = competitors.length;

// A heading is on-topic only if it mentions a slug token — this drops
// competitor-product-specific sections ("How to import Todoist tasks",
// "What is Webhook?", "Create an account on Pomofocus") that aren't relevant
// to *our* tool's page.
const slugTokens = toolSlug.split('-').filter(t => t.length > 2);
const isOnTopic = (norm: string) => slugTokens.some(tok => norm.includes(tok));

// Count each normalized heading once per page. Normalizing ("1. ", "Q." and
// punctuation stripped) merges the same section's many phrasings so consensus
// can actually form across sites.
for (const c of competitors) {
  const seen = new Set<string>();
  for (const h of [...c.h2, ...c.h3]) {
    if (isJunkHeading(h)) continue;
    const norm = normalizeHeading(h);
    if (norm && isOnTopic(norm) && !seen.has(norm)) {
      seen.add(norm);
      headingFreq.set(norm, (headingFreq.get(norm) ?? 0) + 1);
    }
  }
}

const competitorHeadings: string[] = [];
const contentGaps: string[] = [];
const relatedTopics: string[] = [];

for (const [heading, count] of headingFreq.entries()) {
  const ratio = count / totalPages;
  const display = titleCase(heading);

  if (ratio >= GAP_THRESHOLDS.mustHave) {
    competitorHeadings.push(display);
  } else if (ratio < GAP_THRESHOLDS.gap && ratio > 0) {
    contentGaps.push(display);
  } else if (count >= 2) {
    relatedTopics.push(display);
  }
}

console.log(`  Must-have headings: ${competitorHeadings.length}`);
console.log(`  Content gaps: ${contentGaps.length}`);
console.log(`  Related topics: ${relatedTopics.length}`);

// Step 9: Assemble and write research.json
console.log('\n[9/9] Writing research.json...');

const competitorFaqs = [...new Set(competitors.flatMap(c => c.faqQuestions))];

const research: ResearchDocument = {
  tool: toolSlug,
  primaryIntent,
  secondaryIntent,
  entities,
  questions,
  contentGaps: contentGaps.slice(0, LIMITS.contentGaps),
  competitorHeadings: competitorHeadings.slice(0, LIMITS.competitorHeadings),
  competitorFaqs,
  relatedTopics: relatedTopics.slice(0, LIMITS.relatedTopics),
  ...reddit,
  generatedAt: new Date().toISOString(),
};

writeFileSync(join(processedDir, 'research.json'), JSON.stringify(research, null, 2));

console.log(`\n=== Extraction complete ===`);
console.log(`  Pages analyzed: ${competitors.length}`);
console.log(`  Entities: ${entities.length}`);
console.log(`  Questions: ${questions.length}`);
console.log(`  Competitor headings: ${competitorHeadings.length}`);
console.log(`  Content gaps: ${contentGaps.length}`);
console.log(`  Competitor FAQs: ${competitorFaqs.length}`);
console.log(`  Output: research/processed/${toolSlug}/research.json\n`);
