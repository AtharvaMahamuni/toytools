// Content Intelligence Audit — evaluates writing quality, usefulness, SEO coverage,
// topic cluster completeness, and ToyTools style alignment for a real tool's source files.
//
// Usage:
//   tsx scripts/analyze-tool.ts <slug>
//   Example: tsx scripts/analyze-tool.ts base64-encoder-decoder

import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  calculateWritingScore,
  generateWritingFingerprint,
  generateRewriterSuggestions,
} from './writing.js';
import type {
  ContentIntelligenceScore,
  ContentAction,
  FirstPrinciplesCoverage,
  SearchIntentCoverage,
  EntityCoverage,
  TopicClusterResult,
} from '../types/index.js';
import type { WritingScore, WritingFingerprint } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_ROOT = join(ROOT, '..', 'src', 'tools');

function findToolDir(slug: string): string | null {
  // Check direct path first
  const direct = join(SRC_ROOT, slug);
  if (existsSync(direct)) return direct;
  // Search one level deep (category subdirectories)
  try {
    for (const entry of readdirSync(SRC_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const nested = join(SRC_ROOT, entry.name, slug);
        if (existsSync(nested)) return nested;
      }
    }
  } catch {}
  return null;
}

const RULES = JSON.parse(
  readFileSync(join(ROOT, 'config', 'content-intelligence-rules.json'), 'utf-8')
) as CIRules;

interface ToolIntentConfig {
  intents: string[];
  entities: string[];
}

interface CIRules {
  toolIntents: Record<string, ToolIntentConfig>;
  genericIntents: string[];
  genericEntities: string[];
  thinContentPhrases: string[];
  firstPrinciplesKeywords: Record<string, string[]>;
  compositeWeights: Record<string, number>;
}

// ─── Text extraction ──────────────────────────────────────────────────────────

export function extractGuideText(astroContent: string): string {
  return astroContent
    // Strip frontmatter
    .replace(/^---[\s\S]*?---/m, '')
    // Strip <style> blocks
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Strip <script> blocks
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Convert headings (strip span.gold-dot and span aria-hidden)
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
      const text = inner.replace(/<span[^>]*>[\s\S]*?<\/span>/gi, '').replace(/<[^>]+>/g, '').trim();
      return '\n' + '#'.repeat(Number(level)) + ' ' + text + '\n';
    })
    // Convert ReferenceBlock heading to h3
    .replace(/<ReferenceBlock[^>]*heading="([^"]*)"[^>]*>/gi, '\n### $1\n')
    .replace(/<\/ReferenceBlock>/gi, '')
    // Convert paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => '\n' + inner.replace(/<[^>]+>/g, '') + '\n')
    // Convert list items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => '\n- ' + inner.replace(/<[^>]+>/g, '').trim())
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Strip Astro expressions
    .replace(/\{[^}]*\}/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractFaqText(faqContent: string): string {
  const items: string[] = [];

  // Extract question/answer pairs — handles both single and double quotes, multi-line
  const questionRe = /question:\s*['"`]([\s\S]*?)['"`]\s*,/g;
  const answerRe = /answer:\s*['"`]([\s\S]*?)['"`]\s*[,}]/g;

  const questions: string[] = [];
  const answers: string[] = [];

  let m: RegExpExecArray | null;
  while ((m = questionRe.exec(faqContent)) !== null) questions.push(m[1]);
  while ((m = answerRe.exec(faqContent)) !== null) answers.push(m[1]);

  const count = Math.min(questions.length, answers.length);
  for (let i = 0; i < count; i++) {
    items.push(`## ${questions[i]}\n\n${answers[i]}`);
  }

  return items.join('\n\n');
}

// ─── Intelligence modules ─────────────────────────────────────────────────────

export function scoreFirstPrinciples(combinedText: string, rules: CIRules, headings: string[] = []): FirstPrinciplesCoverage {
  const lower = combinedText.toLowerCase();
  const kw = rules.firstPrinciplesKeywords;

  // Heading-based detection — catches descriptive section headings that don't match text keywords.
  // Examples: "How Screen Wake Locks Work" → howItWorks; "Real Examples" / "Common Situations" → examples.
  const howItWorksFromHeading = headings.some(h => /\bhow\b.{0,30}\bworks?\b/i.test(h));
  const examplesFromHeading = headings.some(h =>
    /\breal\s+examples?\b/i.test(h) ||
    /\buse\s+cases?\b/i.test(h) ||
    /\bcommon\s+situations?\b/i.test(h) ||
    /\bwhen\s+(to\s+)?use\b/i.test(h)
  );

  const whatItIs = kw.whatItIs.some(k => lower.includes(k));
  const whyItMatters = kw.whyItMatters.some(k => lower.includes(k));
  const howItWorks = kw.howItWorks.some(k => lower.includes(k)) || howItWorksFromHeading;
  const examples = kw.examples.some(k => lower.includes(k)) || examplesFromHeading;
  const commonMistakes = kw.commonMistakes.some(k => lower.includes(k));
  const comparisons = kw.comparisons.some(k => lower.includes(k));

  const present = [whatItIs, whyItMatters, howItWorks, examples, commonMistakes, comparisons];
  const missing: string[] = [];
  if (!whatItIs) missing.push('What it is');
  if (!whyItMatters) missing.push('Why it matters');
  if (!howItWorks) missing.push('How it works');
  if (!examples) missing.push('Examples');
  if (!commonMistakes) missing.push('Common mistakes');
  if (!comparisons) missing.push('Comparisons or alternatives');

  const score = Math.round((present.filter(Boolean).length / 6) * 100);
  return { whatItIs, whyItMatters, howItWorks, examples, commonMistakes, comparisons, score, missing };
}

export function scoreSearchIntent(
  combinedText: string,
  headings: string[],
  toolSlug: string,
  rules: CIRules
): SearchIntentCoverage {
  const toolConfig = rules.toolIntents[toolSlug];
  const intentList = toolConfig?.intents ?? rules.genericIntents;
  const lower = combinedText.toLowerCase();
  const headingsLower = headings.map(h => h.toLowerCase());

  // Resolve [tool name] placeholder to the human-readable slug name
  const toolName = toolSlug.replace(/-/g, ' ');
  const intents = intentList.map(query => {
    const resolvedQuery = query.replace(/\[tool name\]/gi, toolName);
    // Check if the key terms of this intent appear in headings or text
    const keyTerms = resolvedQuery.toLowerCase()
      .replace(/[?]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['what', 'does', 'with', 'from', 'that', 'this', 'have', 'will'].includes(w));

    const inHeading = headingsLower.some(h => keyTerms.every(t => h.includes(t)));
    const inText = keyTerms.every(t => lower.includes(t));
    return { query: resolvedQuery, covered: inHeading || inText };
  });

  const covered = intents.filter(i => i.covered).length;
  const score = intentList.length > 0 ? Math.round((covered / intentList.length) * 100) : 100;
  const missing = intents.filter(i => !i.covered).map(i => i.query);
  return { intents, score, missing };
}

export function scoreEntityCoverage(
  combinedText: string,
  toolSlug: string,
  rules: CIRules
): EntityCoverage {
  const toolConfig = rules.toolIntents[toolSlug];
  const expected = toolConfig?.entities ?? rules.genericEntities;
  const lower = combinedText.toLowerCase();

  const found = expected.filter(e => lower.includes(e.toLowerCase()));
  const missing = expected.filter(e => !lower.includes(e.toLowerCase()));
  const score = expected.length > 0 ? Math.round((found.length / expected.length) * 100) : 100;
  return { expected, found, missing, score };
}

export function scoreTopicCluster(
  guideContent: string,
  faqContent: string,
  configContent: string
): TopicClusterResult {
  const guideLower = guideContent.toLowerCase();
  const configLower = configContent.toLowerCase();

  const guideLinksToFaq = guideLower.includes('faqhref') || guideLower.includes('faqpreview');
  const faqLinksToGuide = false; // faq.ts answers are plain text, no links by design
  const hasRelatedTools = guideLower.includes('toolcard') || guideLower.includes('related tool') || configLower.includes('related');
  const hasEcosystemLinks = configLower.includes('ecosystem') || guideLower.includes('ecosystem');

  const checks = [guideLinksToFaq, hasRelatedTools, hasEcosystemLinks];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const missing: string[] = [];
  if (!guideLinksToFaq) missing.push('Guide does not link to FAQ');
  if (!hasRelatedTools) missing.push('No related tools section');
  if (!hasEcosystemLinks) missing.push('No ecosystem links');

  return { guideLinksToFaq, faqLinksToGuide, hasRelatedTools, hasEcosystemLinks, score, missing };
}

export function scoreUsefulness(
  fp: WritingFingerprint,
  firstPrinciples: FirstPrinciplesCoverage,
  writingScore: WritingScore
): number {
  const firstPrinciplesWeight = 0.40;
  const exampleWeight = 0.30;
  const mistakeWeight = 0.20;
  const teachingWeight = 0.10;

  // Normalize example count: 1 example = 50pts, 3+ = 100pts
  const exampleScore = Math.min(100, fp.examples * 33);
  // Normalize mistake sections: 1 = 60pts, 2+ = 100pts
  const mistakeScore = fp.commonMistakeSections >= 2 ? 100 : fp.commonMistakeSections === 1 ? 60 : 0;

  return Math.round(
    firstPrinciples.score * firstPrinciplesWeight +
    exampleScore * exampleWeight +
    mistakeScore * mistakeWeight +
    writingScore.teaching * teachingWeight
  );
}

export function scoreSeoCompleteness(
  headings: string[],
  entityCoverage: EntityCoverage,
  searchIntent: SearchIntentCoverage
): number {
  // Question headings: 30% of SEO score
  const questionHeadings = headings.filter(h => h.trim().endsWith('?')).length;
  const questionScore = Math.min(100, questionHeadings * 20);

  return Math.round(
    entityCoverage.score * 0.40 +
    searchIntent.score * 0.40 +
    questionScore * 0.20
  );
}

export function detectThinContent(combinedText: string, rules: CIRules): string[] {
  const lower = combinedText.toLowerCase();
  const found: string[] = [];
  for (const phrase of rules.thinContentPhrases) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(re);
    if (matches) found.push(`"${phrase}" (${matches.length}×)`);
  }
  return found;
}

export function buildActions(
  toolSlug: string,
  writingScore: WritingScore,
  fp: WritingFingerprint,
  firstPrinciples: FirstPrinciplesCoverage,
  searchIntent: SearchIntentCoverage,
  entityCoverage: EntityCoverage,
  topicCluster: TopicClusterResult,
  thinContent: string[]
): ContentAction[] {
  const actions: ContentAction[] = [];

  // High impact — missing first principles
  for (const m of firstPrinciples.missing) {
    actions.push({
      impact: 'high',
      file: 'Guide.astro',
      issue: `Missing first principle: "${m}"`,
      suggestion: `Add coverage for "${m}" within an existing relevant section`,
      scoreGain: 5,
    });
  }

  // High impact — missing search intents
  for (const intent of searchIntent.missing.slice(0, 3)) {
    actions.push({
      impact: 'high',
      file: 'Guide.astro',
      issue: `Search intent not covered: "${intent}"`,
      suggestion: `Address this query in a heading or paragraph — users search for this`,
      scoreGain: 4,
    });
  }

  // High impact — missing entities
  for (const entity of entityCoverage.missing.slice(0, 3)) {
    actions.push({
      impact: 'high',
      file: 'Guide.astro',
      issue: `Entity not mentioned: "${entity}"`,
      suggestion: `Naturally mention "${entity}" in the relevant section`,
      scoreGain: 3,
    });
  }

  // High impact — jargon
  if (writingScore.jargon < 80) {
    actions.push({
      impact: 'high',
      file: 'Guide.astro',
      issue: `Jargon detected in guide prose`,
      suggestion: 'Replace jargon words using the jargonReplacements map in writing-rules.json',
      scoreGain: 3,
    });
  }
  if (fp.jargonCount > 0) {
    actions.push({
      impact: 'high',
      file: 'faq.ts',
      issue: `Jargon in FAQ answers (${fp.jargonCount} occurrences)`,
      suggestion: 'Replace jargon in answer strings',
      scoreGain: 2,
    });
  }

  // High impact — thin content
  if (thinContent.length > 0) {
    actions.push({
      impact: 'high',
      file: 'Guide.astro',
      issue: `Thin content phrases detected: ${thinContent.slice(0, 2).join(', ')}`,
      suggestion: 'Remove generic phrases; replace with specific, factual statements',
      scoreGain: 3,
    });
  }

  // Medium impact — hedging language
  if (fp.hedgingCount > 2) {
    actions.push({
      impact: 'medium',
      file: 'Guide.astro',
      issue: `Hedging language (${fp.hedgingCount} occurrences)`,
      suggestion: 'Replace hedging words ("generally", "typically") with direct statements',
      scoreGain: 2,
    });
  }
  if (fp.hedgingCount > 0) {
    actions.push({
      impact: 'medium',
      file: 'faq.ts',
      issue: `Hedging in FAQ answers`,
      suggestion: 'Replace uncertain language with direct, confident statements',
      scoreGain: 2,
    });
  }

  // Medium impact — passive voice
  if (fp.passiveVoiceCount > 3) {
    actions.push({
      impact: 'medium',
      file: 'Guide.astro',
      issue: `Passive voice (${fp.passiveVoiceCount} occurrences)`,
      suggestion: 'Convert passive constructions to active voice where meaning is preserved',
      scoreGain: 2,
    });
  }

  // Medium impact — topic cluster
  for (const missing of topicCluster.missing) {
    actions.push({
      impact: 'medium',
      file: 'Guide.astro',
      issue: missing,
      suggestion: missing.includes('FAQ') ? 'Ensure FAQPreview component is present in guide' : 'Add related tool reference or ecosystem link',
      scoreGain: 2,
    });
  }

  // Low impact — flow
  if (fp.transitionDensity < 2) {
    actions.push({
      impact: 'low',
      file: 'Guide.astro',
      issue: `Low transition word density (${fp.transitionDensity}/100 words)`,
      suggestion: 'Add transition words (however, therefore, for example) to improve flow',
      scoreGain: 1,
    });
  }

  // Sort: high first, then medium, then low; within tier sort by scoreGain desc
  const order = { high: 0, medium: 1, low: 2 };
  return actions.sort((a, b) =>
    order[a.impact] - order[b.impact] || b.scoreGain - a.scoreGain
  );
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export function calculateContentIntelligenceScore(slug: string): ContentIntelligenceScore {
  const toolDir = findToolDir(slug) ?? join(SRC_ROOT, slug);
  const guidePath = join(toolDir, 'Guide.astro');
  const faqPath = join(toolDir, 'faq.ts');
  const configPath = join(toolDir, 'config.ts');

  const guideContent = existsSync(guidePath) ? readFileSync(guidePath, 'utf-8') : '';
  const faqContent = existsSync(faqPath) ? readFileSync(faqPath, 'utf-8') : '';
  const configContent = existsSync(configPath) ? readFileSync(configPath, 'utf-8') : '';

  const guideText = extractGuideText(guideContent);
  const faqText = extractFaqText(faqContent);
  const combinedText = [guideText, faqText].filter(Boolean).join('\n\n');

  // Heading extraction from guide text (already converted to ## by extractGuideText)
  const headings = guideText
    .split('\n')
    .filter(l => /^#{1,6}\s+/.test(l))
    .map(l => l.replace(/^#{1,6}\s+/, '').trim());

  // Writing engine
  const writingScore = calculateWritingScore(combinedText);
  const fp = generateWritingFingerprint(combinedText);

  // Intelligence modules
  const firstPrinciples = scoreFirstPrinciples(combinedText, RULES, headings);
  const searchIntent = scoreSearchIntent(combinedText, headings, slug, RULES);
  const entityCoverage = scoreEntityCoverage(combinedText, slug, RULES);
  const topicCluster = scoreTopicCluster(guideContent, faqContent, configContent);
  const thinContent = detectThinContent(combinedText, RULES);

  // Derived counts
  const exampleMarkers = [/\bexample:/gi, /\bfor example[,:]?\b/gi, /\binput:/gi, /\boutput:/gi];
  const exampleCount = exampleMarkers.reduce((s, re) => s + (combinedText.match(re)?.length ?? 0), 0);
  const mistakeSectionCount = fp.commonMistakeSections;

  // Category scores
  const usefulness = scoreUsefulness(fp, firstPrinciples, writingScore);
  const seoCompleteness = scoreSeoCompleteness(headings, entityCoverage, searchIntent);
  const topicClusterCompleteness = topicCluster.score;
  const writingQuality = writingScore.score;
  const toyToolsStyleScore = writingScore.toyToolsStyleScore;

  // Composite score
  const w = RULES.compositeWeights;
  const overall = Math.round(
    writingQuality * w.writingQuality +
    usefulness * w.usefulness +
    seoCompleteness * w.seoCompleteness +
    topicClusterCompleteness * w.topicClusterCompleteness +
    toyToolsStyleScore * w.toyToolsStyleScore
  );

  const actions = buildActions(
    slug, writingScore, fp, firstPrinciples, searchIntent,
    entityCoverage, topicCluster, thinContent
  );

  return {
    overall,
    writingQuality,
    usefulness,
    seoCompleteness,
    topicClusterCompleteness,
    toyToolsStyleScore,
    firstPrinciples,
    searchIntent,
    entityCoverage,
    topicCluster,
    exampleCount,
    mistakeSectionCount,
    thinContentFlags: thinContent,
    actions,
  };
}

// ─── Report rendering ─────────────────────────────────────────────────────────

function checkMark(v: boolean): string {
  return v ? '✓' : '✗';
}

function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function renderReport(slug: string, score: ContentIntelligenceScore, fp: WritingFingerprint): string {
  const lines: string[] = [];
  const title = slugToTitle(slug);
  const date = new Date().toISOString().split('T')[0];

  lines.push(`# Content Intelligence Audit — ${title}`);
  lines.push(`_Generated: ${date}_`);
  lines.push('');
  lines.push(`**Overall Score: ${score.overall}/100**`);
  lines.push('');
  lines.push('| Category | Score | Weight |');
  lines.push('|----------|-------|--------|');
  lines.push(`| Usefulness | ${score.usefulness} | 30% |`);
  lines.push(`| Writing Quality | ${score.writingQuality} | 20% |`);
  lines.push(`| SEO Completeness | ${score.seoCompleteness} | 20% |`);
  lines.push(`| Topic Cluster | ${score.topicClusterCompleteness} | 15% |`);
  lines.push(`| ToyTools Style | ${score.toyToolsStyleScore} | 15% |`);
  lines.push('');

  // First Principles
  const fp2 = score.firstPrinciples;
  lines.push('## First Principles Coverage');
  lines.push(
    `${checkMark(fp2.whatItIs)} What it is   ` +
    `${checkMark(fp2.whyItMatters)} Why it matters   ` +
    `${checkMark(fp2.howItWorks)} How it works`
  );
  lines.push(
    `${checkMark(fp2.examples)} Examples   ` +
    `${checkMark(fp2.commonMistakes)} Common mistakes   ` +
    `${checkMark(fp2.comparisons)} Comparisons`
  );
  if (fp2.missing.length > 0) {
    lines.push('');
    lines.push(`Missing: ${fp2.missing.join(', ')}`);
  }
  lines.push('');

  // Search Intent
  lines.push(`## Search Intent Coverage (${score.searchIntent.intents.filter(i => i.covered).length}/${score.searchIntent.intents.length})`);
  for (const intent of score.searchIntent.intents) {
    lines.push(`${checkMark(intent.covered)} ${intent.query}`);
  }
  lines.push('');

  // Entity Coverage
  lines.push(`## Entity Coverage (${score.entityCoverage.found.length}/${score.entityCoverage.expected.length})`);
  if (score.entityCoverage.found.length > 0)
    lines.push(`Found: ${score.entityCoverage.found.join(', ')}`);
  if (score.entityCoverage.missing.length > 0)
    lines.push(`Missing: ${score.entityCoverage.missing.join(', ')}`);
  lines.push('');

  // Topic Cluster
  const tc = score.topicCluster;
  lines.push('## Topic Cluster');
  lines.push(`${checkMark(tc.guideLinksToFaq)} Guide links to FAQ`);
  lines.push(`${checkMark(tc.hasRelatedTools)} Related tools section`);
  lines.push(`${checkMark(tc.hasEcosystemLinks)} Ecosystem links`);
  lines.push('');

  // Thin Content
  if (score.thinContentFlags.length > 0) {
    lines.push('## Thin Content Detected');
    score.thinContentFlags.forEach(f => lines.push(`- ${f}`));
    lines.push('');
  }

  // Writing Fingerprint
  lines.push('## Writing Fingerprint');
  lines.push(
    `avgSentenceLength: ${fp.avgSentenceLength} | transitionDensity: ${fp.transitionDensity}/100 words`
  );
  lines.push(
    `jargonCount: ${fp.jargonCount} | hedgingCount: ${fp.hedgingCount} | passiveVoiceCount: ${fp.passiveVoiceCount}`
  );
  lines.push(
    `examples: ${score.exampleCount} | commonMistakeSections: ${score.mistakeSectionCount}`
  );
  lines.push('');

  // Actions
  if (score.actions.length > 0) {
    lines.push('## Actions');
    lines.push('');

    const high = score.actions.filter(a => a.impact === 'high');
    const medium = score.actions.filter(a => a.impact === 'medium');
    const low = score.actions.filter(a => a.impact === 'low');

    if (high.length > 0) {
      lines.push('### High Impact');
      high.forEach(a => lines.push(`- [${a.file}] ${a.issue} (+${a.scoreGain} pts)\n  → ${a.suggestion}`));
      lines.push('');
    }
    if (medium.length > 0) {
      lines.push('### Medium Impact');
      medium.forEach(a => lines.push(`- [${a.file}] ${a.issue} (+${a.scoreGain} pts)\n  → ${a.suggestion}`));
      lines.push('');
    }
    if (low.length > 0) {
      lines.push('### Low Impact');
      low.forEach(a => lines.push(`- [${a.file}] ${a.issue} (+${a.scoreGain} pts)\n  → ${a.suggestion}`));
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: tsx scripts/analyze-tool.ts <slug>');
    console.error('Example: tsx scripts/analyze-tool.ts base64-encoder-decoder');
    process.exit(1);
  }

  const toolDir = findToolDir(slug);
  if (!toolDir) {
    console.error(`Tool not found: src/tools/${slug}/ (also searched category subdirectories)`);
    process.exit(1);
  }

  console.log(`\n=== Content Intelligence Audit ===\n`);
  console.log(`Tool: ${slug}`);
  console.log(`Analyzing Guide.astro, faq.ts, config.ts...\n`);

  const score = calculateContentIntelligenceScore(slug);
  const combinedText = [
    extractGuideText(existsSync(join(toolDir, 'Guide.astro')) ? readFileSync(join(toolDir, 'Guide.astro'), 'utf-8') : ''),
    extractFaqText(existsSync(join(toolDir, 'faq.ts')) ? readFileSync(join(toolDir, 'faq.ts'), 'utf-8') : ''),
  ].join('\n\n');
  const fp = generateWritingFingerprint(combinedText);

  const REPORTS_DIR = join(ROOT, 'reports');
  mkdirSync(REPORTS_DIR, { recursive: true });

  const mdPath = join(REPORTS_DIR, `tool-content-intelligence-${slug}.md`);
  const jsonPath = join(REPORTS_DIR, `tool-content-intelligence-${slug}.json`);

  writeFileSync(mdPath, renderReport(slug, score, fp));
  writeFileSync(jsonPath, JSON.stringify(score, null, 2));

  console.log(`Overall Score:    ${score.overall}/100`);
  console.log(`Usefulness:       ${score.usefulness}/100`);
  console.log(`Writing Quality:  ${score.writingQuality}/100`);
  console.log(`SEO Completeness: ${score.seoCompleteness}/100`);
  console.log(`Topic Cluster:    ${score.topicClusterCompleteness}/100`);
  console.log(`ToyTools Style:   ${score.toyToolsStyleScore}/100`);
  console.log('');
  console.log(`High impact actions:   ${score.actions.filter(a => a.impact === 'high').length}`);
  console.log(`Medium impact actions: ${score.actions.filter(a => a.impact === 'medium').length}`);
  console.log(`Low impact actions:    ${score.actions.filter(a => a.impact === 'low').length}`);
  console.log('');
  console.log(`Reports:`);
  console.log(`  ${mdPath}`);
  console.log(`  ${jsonPath}\n`);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
