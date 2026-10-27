// Growth row for one tool. Counts what research.json, the guide, the FAQ, the knowledge
// file, and the widget already contain. It does not blend this total into the research
// engine's finalScore, and it does not quote Reddit text.
//
// Interaction is 1 only when the widget source has a slider, a canvas, or a draggable element.
// "Rare" is a judgment, so this module never emits 2 for interaction. Anything else stays
// blank rather than a zero, because a zero would look like a plain calculator.

export interface GrowthResearch {
  contentGaps: string[];
  competitorHeadings: string[];
  redditQuestions: { topic: string }[];
  redditDemandScore: number;
  dataConfidence: number;
  sampleSize: number;
}

export interface GrowthSources {
  slug: string;
  /** Tool name and SEO title, joined. Compared with question clusters by token, never printed back. */
  title: string;
  research: GrowthResearch | null;
  /** Widget.astro plus one shared widget it imports, or null when there is no widget file. */
  widgetSource: string | null;
  faqSource: string | null;
  knowledgeSource: string | null;
  guideSource: string | null;
}

export interface GrowthCell {
  score: 0 | 1 | 2 | null;
  note: string;
}

export interface GrowthRow {
  slug: string;
  niche: GrowthCell;
  interaction: GrowthCell;
  intent: GrowthCell;
  content: GrowthCell;
  depth: GrowthCell;
  perf: GrowthCell;
  /** Sum of the cells that have a number. Blank cells are left out. */
  total: number;
  priority: 'high' | 'medium' | 'low' | 'incomplete';
  qualityFloor: 'pass' | 'fail';
  floorReasons: string[];
  action: string;
}

const TITLE_STOP = new Set([
  'the', 'and', 'for', 'with', 'your', 'from', 'into', 'online', 'free',
  'how', 'what', 'why', 'when', 'does', 'this', 'that', 'are', 'can', 'you',
]);

const LABEL_STOP = new Set([
  'clear', 'copy', 'paste', 'reset', 'close', 'open', 'share',
  'back', 'next', 'done', 'save', 'cancel', 'submit',
]);

/**
 * research.json is gitignored (`seo-engine/research/processed/*`), so a fresh clone or CI has none
 * and Niche and Intent are blank there. Blank is not zero; regenerate with seo:research, seo:extract.
 */
const NO_RESEARCH = (column: string) =>
  `No research.json (gitignored, so absent on a fresh clone or in CI). ${column} is blank. Run npm run seo:research -- <slug>, then npm run seo:extract -- <slug>.`;

function cell(score: 0 | 1 | 2 | null, note: string): GrowthCell {
  return { score, note };
}

export function tokens(value: string): Set<string> {
  const out = new Set<string>();
  for (const word of value.toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length > 2 && !TITLE_STOP.has(word)) out.add(word);
  }
  return out;
}

function redditUsable(research: GrowthResearch): boolean {
  return research.dataConfidence >= 0.5 && research.sampleSize > 0;
}

/** Shared headings are the crowded part of a SERP. Gaps are the open part. */
export function scoreNiche(research: GrowthResearch | null): GrowthCell {
  if (!research) return cell(null, NO_RESEARCH('Niche'));
  const headings = research.competitorHeadings.length;
  const gaps = research.contentGaps.length;
  if (headings === 0 && gaps === 0) {
    return cell(null, 'The SERP corpus has no shared headings and no gaps. Niche is unscored.');
  }

  let score: 0 | 1 | 2;
  if (headings >= 6 && gaps < headings) score = 0;
  else if (gaps >= 3 && (headings <= 2 || gaps >= headings * 2)) score = 2;
  else score = 1;

  const shape = `${headings} shared headings, ${gaps} content gaps.`;
  if (!redditUsable(research)) {
    return cell(score, `${shape} Reddit demand was not applied. It was not collected, or confidence is below 0.5.`);
  }
  if (score === 1 && research.redditDemandScore >= 60 && gaps >= 1) {
    return cell(2, `${shape} Reddit demand ${research.redditDemandScore} at confidence ${research.dataConfidence} lifts a mixed SERP.`);
  }
  return cell(score, `${shape} Reddit demand ${research.redditDemandScore} at confidence ${research.dataConfidence} does not change the SERP reading.`);
}

/** Title tokens against question-cluster topics. The topics themselves are not repeated. */
export function scoreIntent(title: string, research: GrowthResearch | null): GrowthCell {
  if (!research) return cell(null, NO_RESEARCH('Intent'));
  if (research.redditQuestions.length === 0) {
    return cell(null, 'No question clusters. Intent is unscored.');
  }
  const titleTokens = tokens(title);
  let one = 0;
  let two = 0;
  for (const question of research.redditQuestions) {
    let shared = 0;
    for (const token of tokens(question.topic)) {
      if (titleTokens.has(token)) shared += 1;
    }
    if (shared >= 2) two += 1;
    else if (shared === 1) one += 1;
  }
  if (two > 0) return cell(2, `${two} question clusters share two or more title tokens. ${one} share one.`);
  if (one > 0) return cell(1, `${one} question clusters share one title token. None share two.`);
  return cell(0, 'Question clusters share no title token.');
}

export function stringField(source: string | null, field: string): string[] {
  if (!source) return [];
  const match = source.match(new RegExp(`${field}\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  const body = match[1] ?? '';
  const values: string[] = [];
  for (const found of body.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g)) {
    const value = found[1] ?? found[2] ?? found[3] ?? '';
    if (value.trim()) values.push(value.trim());
  }
  return values;
}

export function faqAnswers(source: string | null): string[] {
  if (!source) return [];
  const answers: string[] = [];
  for (const found of source.matchAll(/answer\s*:\s*(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`)/g)) {
    const value = found[1] ?? found[2] ?? found[3] ?? '';
    if (value.trim()) answers.push(value.trim());
  }
  return answers;
}

/**
 * The visible prose of a Guide.astro source: frontmatter, script and style blocks, tags and
 * `{expressions}` removed. A raw source always contains a digit (an `<h2>`, a CSS value, an
 * import path), so the numbered-example check has to read the prose, not the file.
 */
export function guideProse(source: string | null): string {
  if (!source) return '';
  return source
    .replace(/^---[\s\S]*?\n---/, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(value: string): number {
  return value.split(/\s+/).filter(Boolean).length;
}

function hasDigit(value: string): boolean {
  return /\d/.test(value);
}

export function scoreDepth(
  faqSource: string | null,
  knowledgeSource: string | null,
  guideSource: string | null,
): GrowthCell {
  const answers = faqAnswers(faqSource);
  const substantive = answers.filter(answer => wordCount(answer) >= 30).length;
  const mistakes = stringField(knowledgeSource, 'commonMistakes');
  const examples = [
    ...stringField(knowledgeSource, 'realWorldUseCases'),
    ...answers,
    guideProse(guideSource),
  ];
  const numbered = examples.some(hasDigit);
  const checks = [
    substantive >= 5,
    mistakes.length >= 1,
    numbered,
  ].filter(Boolean).length;
  const score: 0 | 1 | 2 = checks >= 3 ? 2 : checks === 2 ? 1 : 0;
  return cell(
    score,
    `${substantive} substantive FAQs (30 words or more), ${mistakes.length} common mistakes, ${numbered ? 'a numbered example' : 'no numbered example'}.`,
  );
}

export function controlLabels(widgetSource: string | null): string[] {
  if (!widgetSource) return [];
  const found = new Set<string>();
  const patterns = [
    /aria-label\s*=\s*"([^"]+)"/g,
    /aria-label\s*=\s*'([^']+)'/g,
    /\blabel\s*=\s*"([^"]+)"/g,
    /\blabel\s*:\s*'([^']+)'/g,
    /\blabel\s*:\s*"([^"]+)"/g,
    /placeholder\s*=\s*"([^"]+)"/g,
    /<label[^>]*>\s*([^<]+?)\s*<\/label>/g,
    /<button[^>]*>\s*([^<]+?)\s*<\/button>/g,
    /<summary[^>]*>\s*([^<]+?)\s*<\/summary>/g,
    /<h[1-3][^>]*>\s*([^<]+?)\s*<\/h[1-3]>/g,
  ];
  for (const pattern of patterns) {
    for (const match of widgetSource.matchAll(pattern)) {
      const label = (match[1] ?? '').replace(/\s+/g, ' ').trim();
      const key = label.toLowerCase();
      if (label.length < 4 || LABEL_STOP.has(key)) continue;
      found.add(label);
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b));
}

export function scoreContent(labels: string[], prose: string): GrowthCell {
  if (labels.length === 0) {
    return cell(null, 'No control labels in the widget. Content is unscored.');
  }
  const haystack = prose.toLowerCase();
  const hits = labels.filter(label => haystack.includes(label.toLowerCase()));
  const listed = hits.length > 5
    ? `${hits.slice(0, 5).join(', ')}, and ${hits.length - 5} more`
    : hits.join(', ');
  if (hits.length === 0) {
    return cell(0, `0 of ${labels.length} control labels appear in the guide, FAQ, or knowledge.`);
  }
  if (hits.length >= 3 || hits.length === labels.length) {
    return cell(2, `${hits.length} of ${labels.length} control labels appear in the page text: ${listed}.`);
  }
  return cell(1, `${hits.length} of ${labels.length} control labels appear in the page text: ${listed}.`);
}

export function scoreInteraction(widgetSource: string | null): GrowthCell {
  if (!widgetSource) return cell(null, 'No widget source. Interaction is unscored.');
  const canvas = /<canvas\b/.test(widgetSource);
  const slider = /type\s*=\s*["']range["']/.test(widgetSource);
  const drag = /\bdraggable\s*=\s*["']true["']/.test(widgetSource);
  if (!canvas && !slider && !drag) {
    return cell(null, 'No slider, canvas, or draggable element. Interaction is unscored.');
  }
  const kind = [canvas ? 'canvas' : '', slider ? 'slider' : '', drag ? 'drag' : ''].filter(Boolean).join(', ');
  return cell(1, `Widget has ${kind}. That is some visualization. Rare stays a judgment, so this is not 2.`);
}

function proseOf(sources: GrowthSources): string {
  return [sources.faqSource, sources.knowledgeSource, guideProse(sources.guideSource)].filter(Boolean).join('\n');
}

function floorReasons(sources: GrowthSources, content: GrowthCell): string[] {
  const answers = faqAnswers(sources.faqSource);
  const substantive = answers.filter(answer => wordCount(answer) >= 30).length;
  const mistakes = stringField(sources.knowledgeSource, 'commonMistakes').length;
  const numbered = [
    ...stringField(sources.knowledgeSource, 'realWorldUseCases'),
    ...answers,
    guideProse(sources.guideSource),
  ].some(hasDigit);
  const reasons: string[] = [];
  if (substantive < 5) reasons.push(`${substantive} substantive FAQs. The floor is 5.`);
  if (mistakes < 1) reasons.push('Common mistakes are missing.');
  if (!numbered) reasons.push('No example contains a number.');
  if (content.score === null) reasons.push('No control labels to check against the page text.');
  else if (content.score < 1) reasons.push('The page text does not mention a widget control.');
  return reasons;
}

export function scoreGrowth(sources: GrowthSources): GrowthRow {
  const niche = scoreNiche(sources.research);
  const intent = scoreIntent(sources.title, sources.research);
  const depth = scoreDepth(sources.faqSource, sources.knowledgeSource, sources.guideSource);
  const labels = controlLabels(sources.widgetSource);
  const content = scoreContent(labels, proseOf(sources));
  const interaction = scoreInteraction(sources.widgetSource);
  const perf = cell(0, 'No Search Console export. Performance stays 0.');

  const scored = [niche, interaction, intent, content, depth, perf];
  const total = scored.reduce((sum, item) => sum + (item.score ?? 0), 0);
  const blanks = [
    niche.score === null ? 'niche' : '',
    interaction.score === null ? 'interaction' : '',
    intent.score === null ? 'intent' : '',
    content.score === null ? 'content' : '',
    depth.score === null ? 'depth' : '',
  ].filter(Boolean);

  const reasons = floorReasons(sources, content);
  const qualityFloor = reasons.length === 0 ? 'pass' : 'fail';
  const band = growthBand(total, blanks, qualityFloor);

  return {
    slug: sources.slug,
    niche,
    interaction,
    intent,
    content,
    depth,
    perf,
    total,
    priority: band.priority,
    qualityFloor,
    floorReasons: reasons,
    action: band.action,
  };
}

/** Bands from the growth skill. High (10) needs interaction 2, which scoreGrowth does not assign. */
export function growthBand(
  total: number,
  blanks: string[],
  qualityFloor: 'pass' | 'fail',
): { priority: GrowthRow['priority']; action: string } {
  if (blanks.length > 0) {
    return {
      priority: 'incomplete',
      action: `Score ${blanks.join(', ')} before treating the band as final.`,
    };
  }
  if (total >= 10) {
    return {
      priority: 'high',
      action: qualityFloor === 'pass'
        ? 'Run the seo-content pipeline.'
        : 'High band, and the quality floor still fails. Fix the floor before the seo-content pipeline.',
    };
  }
  if (total >= 7) {
    return {
      priority: 'medium',
      action: 'Improve only if the result can clear the quality floor. Otherwise leave it.',
    };
  }
  return { priority: 'low', action: 'Do not expand this page.' };
}

function show(cellValue: GrowthCell): string {
  return cellValue.score === null ? 'blank' : String(cellValue.score);
}

export function formatGrowthReport(row: GrowthRow): string {
  const lines = [
    `# growth:score ${row.slug}`,
    '',
    '| Tool | Niche | Interaction | Intent | Content | Depth | Perf | Total | Priority | Quality Floor | Action |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    `| ${row.slug} | ${show(row.niche)} | ${show(row.interaction)} | ${show(row.intent)} | ${show(row.content)} | ${show(row.depth)} | ${show(row.perf)} | ${row.total} | ${row.priority} | ${row.qualityFloor} | ${row.action} |`,
    '',
    'Notes',
    `- Niche: ${row.niche.note}`,
    `- Interaction: ${row.interaction.note}`,
    `- Intent: ${row.intent.note}`,
    `- Content: ${row.content.note}`,
    `- Depth: ${row.depth.note}`,
    `- Performance: ${row.perf.note}`,
  ];
  if (row.floorReasons.length > 0) {
    lines.push(`- Quality floor: ${row.floorReasons.join(' ')}`);
  } else {
    lines.push('- Quality floor: passes the counted checks.');
  }
  lines.push('- Total adds only cells that have a number. A blank cell is not a zero. This total is not the research engine finalScore.');
  return lines.join('\n');
}
