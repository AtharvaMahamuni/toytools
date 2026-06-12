// Writing Intelligence Engine — analyzes markdown for clarity, readability,
// teaching quality, and alignment with the ToyTools writing philosophy.
//
// Usage:
//   tsx scripts/writing.ts              -- scan all output/<slug>/guide.outline.md
//   tsx scripts/writing.ts <slug>       -- single tool
//   tsx scripts/writing.ts path/to/file.md -- explicit file path

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import type { WritingScore, RewriterSuggestion, WritingFingerprint } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const RULES = JSON.parse(
  readFileSync(join(ROOT, 'config', 'writing-rules.json'), 'utf-8')
) as WritingRules;

interface SentenceLengthConfig {
  ideal_min: number;
  ideal_max: number;
  acceptable_max: number;
  long_max: number;
}

interface ReadabilityConfig {
  excellent_min: number;
  excellent_max: number;
  acceptable_min: number;
}

interface AiTellStructuralConfig {
  maxEmDashes: number;
  maxNotJustCount: number;
  maxBoldPer100Words: number;
  maxTripletRatio: number;
  maxColonHeadingRatio: number;
  minParagraphShapeStdDev: number;
  minParagraphsForShapeCheck: number;
}

interface WritingRules {
  sentenceLength: SentenceLengthConfig;
  maxParagraphSentences: number;
  exampleEveryWords: number;
  readability: ReadabilityConfig;
  minimumQuestionHeadingsPerSection: number;
  minimumExamples: number;
  minWordsForAnalysis: number;
  scoreWeights: Record<string, number>;
  toyToolsStyleCriteria: Record<string, number>;
  jargonWords: string[];
  jargonReplacements: Record<string, string>;
  fluffPhrases: string[];
  boringPhrases: string[];
  hedgingWords: string[];
  transitionWords: string[];
  interestingPatterns: string[];
  mistakeKeywords: string[];
  comparisonKeywords: string[];
  passiveVoicePatterns: string[];
  directAnswerHedgeOpeners: string[];
  aiTellPhrases: string[];
  aiTellStructural: AiTellStructuralConfig;
}

// ─── Text helpers ────────────────────────────────────────────────────────────

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '')       // fenced code blocks
    .replace(/`[^`]+`/g, '')              // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')      // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/^#{1,6}\s+.+$/gm, '')       // heading lines (whole line)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/^\s*[-*+]\s+(.+)$/gm, '$1.') // list items → sentences
    .replace(/^\s*\d+\.\s+(.+)$/gm, '$1.') // ordered list items → sentences
    .replace(/^\s*[|].+/gm, '')           // table rows
    .replace(/^\s*>+\s*/gm, '')           // blockquotes
    .replace(/\n{3,}/g, '\n\n')           // collapse excess blank lines
    .trim();
}

function parseSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by whitespace+uppercase or end of string.
  // Avoid splitting on abbreviations like "e.g.", "i.e.", "etc.", decimals, and initials.
  const abbreviated = text
    .replace(/\b(e\.g\.|i\.e\.|etc\.|vs\.|Dr\.|Mr\.|Mrs\.|Ms\.|Jr\.|Sr\.|No\.)\s/gi,
      (m) => m.replace(' ', '\x00'));

  const raw = abbreviated.split(/(?<=[.!?])\s+(?=[A-Z"'])|(?<=[.!?])$/);
  return raw
    .map(s => s.replace(/\x00/g, ' ').trim())
    .filter(s => s.length > 0 && /[a-z]/i.test(s));
}

function parseParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 20 && !/^#{1,6}\s/.test(p));
}

function parseHeadings(md: string): string[] {
  return md
    .split('\n')
    .filter(line => /^#{1,6}\s+/.test(line))
    .map(line => line.replace(/^#{1,6}\s+/, '').trim());
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length === 0) return 0;
  const vowelGroups = clean.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;
  // Silent trailing e
  if (clean.endsWith('e') && clean.length > 2) count = Math.max(1, count - 1);
  return Math.max(1, count);
}

function fleschReadingEase(text: string): number {
  const sentences = parseSentences(text);
  if (sentences.length === 0) return 0;

  const words = text.trim().split(/\s+/).filter(w => /[a-z]/i.test(w));
  if (words.length === 0) return 0;

  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const asl = words.length / sentences.length;
  const asw = syllableCount / words.length;

  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  return Math.max(0, Math.min(100, score));
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Individual scoring rules ─────────────────────────────────────────────────

function scoreSentenceLength(sentences: string[]): { score: number; longSentences: string[] } {
  if (sentences.length === 0) return { score: 100, longSentences: [] };
  const cfg = RULES.sentenceLength;
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const longSentences = sentences.filter((_, i) => lengths[i] > cfg.long_max);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  let score = 100;
  // Penalize per long sentence
  score -= longSentences.length * 10;
  // Penalize if average is outside ideal range
  if (avgLen > cfg.ideal_max && avgLen <= cfg.acceptable_max) score -= 10;
  if (avgLen > cfg.acceptable_max && avgLen <= cfg.long_max) score -= 20;
  if (avgLen > cfg.long_max) score -= 35;

  return { score: clamp(score), longSentences };
}

function scoreParagraphLength(paragraphs: string[]): { score: number; longParas: number } {
  if (paragraphs.length === 0) return { score: 100, longParas: 0 };
  const max = RULES.maxParagraphSentences;
  let longParas = 0;
  for (const para of paragraphs) {
    const sentences = parseSentences(para);
    if (sentences.length > max) longParas++;
  }
  const ratio = longParas / paragraphs.length;
  return { score: clamp(100 - ratio * 80), longParas };
}

function scoreQuestionHeadings(headings: string[]): { score: number; questionCount: number } {
  const questionCount = headings.filter(h => h.trim().endsWith('?')).length;
  if (headings.length === 0) return { score: 0, questionCount: 0 };
  const density = questionCount / headings.length;
  // Ideal: at least 30% of headings are questions
  const score = density >= 0.3 ? 100 : clamp(Math.round(density / 0.3 * 100));
  return { score, questionCount };
}

function scoreExampleDensity(text: string): { score: number; exampleCount: number } {
  const wordCount = countWords(text);
  if (wordCount === 0) return { score: 0, exampleCount: 0 };
  const lower = text.toLowerCase();
  const markers = [
    /\bexample:/gi, /\bfor example[,:]?\b/gi, /\binput:/gi, /\boutput:/gi,
    /\bsample:/gi, /\binstance:/gi,
  ];
  const exampleCount = markers.reduce((sum, re) => sum + (lower.match(re)?.length ?? 0), 0);
  const expectedExamples = Math.max(RULES.minimumExamples, Math.floor(wordCount / RULES.exampleEveryWords));
  const ratio = exampleCount / expectedExamples;
  return { score: clamp(Math.round(ratio * 100)), exampleCount };
}

function scoreDirectAnswers(md: string): { score: number; totalSections: number; directCount: number } {
  const lines = md.split('\n');
  let inSection = false;
  let firstSentence = '';
  let totalSections = 0;
  let directCount = 0;
  const hedgeOpeners = RULES.directAnswerHedgeOpeners.map(h => h.toLowerCase());
  const maxWords = RULES.sentenceLength.acceptable_max;

  for (const line of lines) {
    if (/^#{1,6}\s+/.test(line)) {
      inSection = true;
      firstSentence = '';
      totalSections++;
      continue;
    }
    if (inSection && firstSentence === '' && line.trim().length > 10) {
      firstSentence = line.trim();
      inSection = false;
      const wordCount = firstSentence.split(/\s+/).length;
      const lower = firstSentence.toLowerCase();
      const isHedging = hedgeOpeners.some(h => lower.startsWith(h));
      if (wordCount <= maxWords && !isHedging) directCount++;
    }
  }
  const score = totalSections > 0 ? clamp(Math.round((directCount / totalSections) * 100)) : 100;
  return { score, totalSections, directCount };
}

function scoreJargon(text: string): { score: number; jargonCount: number; found: string[] } {
  const lower = text.toLowerCase();
  const found: string[] = [];
  let total = 0;
  for (const word of RULES.jargonWords) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(re);
    if (matches) {
      total += matches.length;
      found.push(`"${word}" (${matches.length}×)`);
    }
  }
  const wordCount = countWords(text);
  const density = wordCount > 0 ? total / wordCount : 0;
  // 0 jargon = 100, 2% density = 50, 5%+ = 0
  const score = clamp(Math.round(100 - density * 2000));
  return { score, jargonCount: total, found };
}

function scoreFluffAndBoring(text: string): { score: number; fluffCount: number } {
  const lower = text.toLowerCase();
  let count = 0;
  for (const phrase of [...RULES.fluffPhrases, ...RULES.boringPhrases]) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(re);
    if (matches) count += matches.length;
  }
  return { score: clamp(100 - count * 15), fluffCount: count };
}

function scoreTeachingStructure(md: string): { score: number; sectionsWithTeaching: number; totalSections: number } {
  const sections = md.split(/^#{1,3}\s+.+$/gm).filter(s => s.trim().length > 30);
  if (sections.length === 0) return { score: 50, sectionsWithTeaching: 0, totalSections: 0 };

  let sectionsWithTeaching = 0;
  for (const section of sections) {
    const lower = section.toLowerCase();
    const hasDefinition = /\bis\b|\bare\b|\bmeans\b|\brefers to\b/.test(lower);
    const hasExplanation = lower.length > 100;
    const hasExample = /example:|for example|input:|output:|such as/i.test(lower);
    if (hasDefinition && hasExplanation && hasExample) sectionsWithTeaching++;
  }
  const score = clamp(Math.round((sectionsWithTeaching / sections.length) * 100));
  return { score, sectionsWithTeaching, totalSections: sections.length };
}

function scoreReadability(text: string): number {
  const fre = fleschReadingEase(text);
  const cfg = RULES.readability;
  if (fre >= cfg.excellent_min && fre <= cfg.excellent_max) return 100;
  if (fre >= cfg.acceptable_min && fre < cfg.excellent_min) return 75;
  if (fre > cfg.excellent_max) return Math.max(50, 100 - (fre - cfg.excellent_max) * 2);
  return Math.max(0, Math.round((fre / cfg.acceptable_min) * 75));
}

function scoreScannability(md: string, headings: string[], paragraphs: string[]): number {
  const lines = md.split('\n');
  const bulletCount = lines.filter(l => /^\s*[-*+]\s+/.test(l)).length;
  const tableCount = lines.filter(l => /^\s*\|/.test(l)).length;
  const wordCount = countWords(md);

  let score = 0;
  if (headings.length >= 3) score += 25;
  else score += Math.round((headings.length / 3) * 25);

  if (bulletCount >= 5) score += 25;
  else score += Math.round((bulletCount / 5) * 25);

  if (tableCount > 0) score += 10;

  const avgParaWords = paragraphs.length > 0
    ? paragraphs.reduce((sum, p) => sum + countWords(p), 0) / paragraphs.length
    : 0;
  if (avgParaWords > 0 && avgParaWords <= 60) score += 25;
  else if (avgParaWords <= 100) score += 15;
  else if (avgParaWords > 0) score += 5;

  // Bonus for question headings
  const questionHeadings = headings.filter(h => h.endsWith('?')).length;
  if (questionHeadings >= 2) score += 15;
  else if (questionHeadings === 1) score += 8;

  return clamp(score);
}

function scoreRhythm(sentences: string[]): number {
  if (sentences.length < 4) return 70;
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const deviation = stdDev(lengths);
  // Low variance = robotic (bad), high variance = natural (good)
  // Ideal: stdDev of 4–10 words
  if (deviation >= 4 && deviation <= 15) return 100;
  if (deviation >= 2 && deviation < 4) return 75;
  if (deviation >= 1 && deviation < 2) return 50;
  if (deviation > 15) return 85; // very varied, acceptable
  return 30;
}

function scoreHedging(text: string): { score: number; hedgingCount: number; found: string[] } {
  const lower = text.toLowerCase();
  const wordCount = countWords(text);
  const found: string[] = [];
  let total = 0;
  for (const word of RULES.hedgingWords) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(re);
    if (matches) {
      total += matches.length;
      found.push(`"${word}" (${matches.length}×)`);
    }
  }
  const density = wordCount > 0 ? total / wordCount : 0;
  // 0 hedging = 100, 3% density = 40, 5%+ = 0
  const score = clamp(Math.round(100 - density * 2000));
  return { score, hedgingCount: total, found };
}

function scorePassiveVoice(text: string): { score: number; passiveCount: number } {
  const lower = text.toLowerCase();
  let total = 0;
  for (const pattern of RULES.passiveVoicePatterns) {
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(re);
    if (matches) total += matches.length;
  }
  const sentenceCount = parseSentences(text).length;
  const density = sentenceCount > 0 ? total / sentenceCount : 0;
  // 0 passive = 100, 30% sentences passive = 50, 60%+ = 0
  const score = clamp(Math.round(100 - density * 150));
  return { score, passiveCount: total };
}

function scoreFlow(text: string): { score: number; transitionCount: number } {
  const lower = text.toLowerCase();
  const wordCount = countWords(text);
  let total = 0;
  for (const word of RULES.transitionWords) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(re);
    if (matches) total += matches.length;
  }
  // Ideal: ~3–6 transition words per 100 words
  const density = wordCount > 0 ? (total / wordCount) * 100 : 0;
  let score: number;
  if (density >= 3 && density <= 8) score = 100;
  else if (density >= 1 && density < 3) score = clamp(Math.round(density / 3 * 100));
  else if (density > 8 && density <= 12) score = 85; // slightly over-signaled, acceptable
  else if (density > 12) score = 60; // over-signaled
  else score = 20; // very low
  return { score, transitionCount: total };
}

function scoreRepetition(sentences: string[]): { score: number; repetitionPenalty: number } {
  if (sentences.length < 4) return { score: 90, repetitionPenalty: 0 };

  // Check repeated sentence openers (first 2 words)
  const openers = sentences.map(s => s.split(/\s+/).slice(0, 2).join(' ').toLowerCase());
  const openerCounts = new Map<string, number>();
  for (const opener of openers) {
    if (opener.length > 3) openerCounts.set(opener, (openerCounts.get(opener) ?? 0) + 1);
  }
  const repeatedOpeners = [...openerCounts.values()].filter(c => c > 2).length;

  // Check repeated 3-gram phrases
  const words = sentences.join(' ').toLowerCase().split(/\s+/);
  const trigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = words.slice(i, i + 3).join(' ');
    if (!/^(the|a|an|is|was|are|were|it|this|that|and|or|but)/.test(trigram)) {
      trigrams.set(trigram, (trigrams.get(trigram) ?? 0) + 1);
    }
  }
  const repeatedTrigrams = [...trigrams.values()].filter(c => c > 3).length;

  const penalty = repeatedOpeners * 8 + repeatedTrigrams * 5;
  return { score: clamp(100 - penalty), repetitionPenalty: penalty };
}

function scoreInterestingness(text: string, headings: string[]): { score: number; patterns: number } {
  const lower = text.toLowerCase();
  let patternCount = 0;
  for (const pattern of RULES.interestingPatterns) {
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (lower.match(re)) patternCount++;
  }
  // Also reward question headings and comparison sections
  const questionHeadings = headings.filter(h => h.endsWith('?')).length;
  patternCount += Math.min(5, questionHeadings);

  const score = clamp(Math.min(100, patternCount * 12));
  return { score, patterns: patternCount };
}

function scoreMistakeCoverage(text: string, headings: string[]): { score: number; mistakeSections: number } {
  const combined = (text + ' ' + headings.join(' ')).toLowerCase();
  let count = 0;
  for (const keyword of RULES.mistakeKeywords) {
    const re = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (combined.match(re)) count++;
  }
  const mistakeSections = count;
  const score = count >= 2 ? 100 : count === 1 ? 60 : 20;
  return { score, mistakeSections };
}

function scoreComparisonCoverage(text: string, headings: string[]): { score: number; comparisonSections: number } {
  const combined = (text + ' ' + headings.join(' ')).toLowerCase();
  let count = 0;
  for (const keyword of RULES.comparisonKeywords) {
    const re = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (combined.match(re)) count++;
  }
  const comparisonSections = count;
  const score = count >= 2 ? 100 : count === 1 ? 60 : 20;
  return { score, comparisonSections };
}

// "Not just X, it's Y" and its siblings — the single most recognizable
// AI-generated sentence shape. Zero tolerance.
const NOT_JUST_RE = /\b(?:it'?s not just|not just|isn'?t just|not only)\b[^.!?\n]{0,90}?\b(?:but|it'?s|it is|;)/gi;

export interface AiTellResult {
  score: number;
  emDashCount: number;
  phraseCount: number;
  phrasesFound: string[];
  notJustCount: number;
  tripletRatio: number;
  colonHeadingRatio: number;
  paragraphShapeStdDev: number;
  boldPer100Words: number;
}

/**
 * Detects modern AI-generated-text tells the older metrics miss: banned vocab
 * ("delve", "unlock", "seamless"), the "not just X, it's Y" construction,
 * em-dashes (banned outright on this project), rule-of-three overuse,
 * colon-heavy headings ("X: Why Y Matters"), uniform paragraph shapes, and
 * bold-spam. Takes raw markdown because stripMarkdown removes the bold and
 * dash evidence this check needs.
 */
function scoreAiTells(
  markdown: string,
  plainText: string,
  sentences: string[],
  paragraphs: string[],
  headings: string[],
): AiTellResult {
  const cfg = RULES.aiTellStructural;
  const lower = plainText.toLowerCase();
  const wordCount = countWords(plainText);

  const phrasesFound: string[] = [];
  let phraseCount = 0;
  for (const phrase of RULES.aiTellPhrases) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    const matches = lower.match(re);
    if (matches) {
      phraseCount += matches.length;
      phrasesFound.push(`"${phrase}" (${matches.length}×)`);
    }
  }

  // Em-dash (and spaced en-dash used as one). Counted on raw markdown with
  // three exemptions: code (``` fences, `inline`, <code> elements), the
  // educational "(—)" character-display pattern (the HTML-entity guide teaches
  // &mdash; itself), and unspaced en-dashes in numeric ranges ("200–250 words"
  // is correct typography, not an AI tell).
  const noCode = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/<code[^>]*>[\s\S]*?<\/code>/gi, '')
    .replace(/\((?:—|–)\)/g, '');
  const emDashCount = (noCode.match(/—/g) ?? []).length + (noCode.match(/ – /g) ?? []).length;

  const notJustCount = (plainText.match(NOT_JUST_RE) ?? []).length;

  // Rule-of-three: "fast, simple, and private" sentence shapes
  const tripletSentences = sentences.filter(s =>
    /\b[\w'-]+(?:\s+[\w'-]+){0,3},\s+[\w'-]+(?:\s+[\w'-]+){0,3},\s+(?:and|or)\s+[\w'-]+/.test(s),
  ).length;
  const tripletRatio = sentences.length > 0 ? tripletSentences / sentences.length : 0;

  const colonHeadings = headings.filter(h => /.+:\s+.+/.test(h)).length;
  const colonHeadingRatio = headings.length > 0 ? colonHeadings / headings.length : 0;

  // Uniform paragraph shapes: every paragraph the same 2-3 sentence block
  const paraShapes = paragraphs.map(p => parseSentences(p).length);
  const paragraphShapeStdDev = stdDev(paraShapes);

  const boldCount = (noCode.match(/\*\*[^*\n]+\*\*|<strong>/g) ?? []).length;
  const boldPer100Words = wordCount > 0 ? (boldCount / wordCount) * 100 : 0;

  let score = 100;
  score -= phraseCount * 10;
  score -= emDashCount * 15;
  score -= notJustCount * 15;
  if (tripletRatio > cfg.maxTripletRatio) score -= 20;
  if (colonHeadingRatio > cfg.maxColonHeadingRatio) score -= 10;
  if (paragraphs.length >= cfg.minParagraphsForShapeCheck && paragraphShapeStdDev < cfg.minParagraphShapeStdDev) score -= 15;
  if (boldPer100Words > cfg.maxBoldPer100Words) score -= 10;

  return {
    score: clamp(score),
    emDashCount,
    phraseCount,
    phrasesFound,
    notJustCount,
    tripletRatio: Math.round(tripletRatio * 100) / 100,
    colonHeadingRatio: Math.round(colonHeadingRatio * 100) / 100,
    paragraphShapeStdDev: Math.round(paragraphShapeStdDev * 100) / 100,
    boldPer100Words: Math.round(boldPer100Words * 10) / 10,
  };
}

function scoreToyToolsStyle(scores: Omit<WritingScore, 'score' | 'toyToolsStyleScore' | 'issues' | 'recommendations'>): number {
  const criteria = RULES.toyToolsStyleCriteria;
  const weighted =
    scores.clarity * criteria.highClarity +
    scores.teaching * criteria.highTeaching +
    scores.examples * criteria.examples +
    scores.mistakeCoverage * criteria.commonMistakes +
    scores.comparisonCoverage * criteria.comparisons +
    scores.jargon * criteria.lowJargon +
    (100 - Math.max(0, 100 - scores.jargon)) * criteria.lowFluff + // reuse jargon as proxy for fluff
    scores.clarity * criteria.directAnswers +
    scores.scannability * criteria.shortParagraphs;

  return clamp(Math.round(weighted));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function calculateWritingScore(markdown: string): WritingScore {
  const plainText = stripMarkdown(markdown);
  const wordCount = countWords(plainText);

  if (wordCount < RULES.minWordsForAnalysis) {
    return {
      score: 0, clarity: 0, readability: 0, scannability: 0, examples: 0,
      teaching: 0, rhythm: 0, jargon: 0, flow: 0, confidence: 0,
      interestingness: 0, repetition: 0, passiveVoice: 0,
      comparisonCoverage: 0, mistakeCoverage: 0, aiTells: 0, toyToolsStyleScore: 0,
      issues: [`Content too sparse (${wordCount} words). Run content generation first.`],
      recommendations: ['Generate full guide content before running writing analysis.'],
    };
  }

  const sentences = parseSentences(plainText);
  const paragraphs = parseParagraphs(plainText);
  const headings = parseHeadings(markdown);

  const sentLen = scoreSentenceLength(sentences);
  const paraLen = scoreParagraphLength(paragraphs);
  const qHeadings = scoreQuestionHeadings(headings);
  const exampleDensity = scoreExampleDensity(plainText);
  const directAnswer = scoreDirectAnswers(markdown);
  const jargonResult = scoreJargon(plainText);
  const fluffResult = scoreFluffAndBoring(plainText);
  const teachingResult = scoreTeachingStructure(markdown);
  const readabilityScore = scoreReadability(plainText);
  const scannabilityScore = scoreScannability(markdown, headings, paragraphs);
  const rhythmScore = scoreRhythm(sentences);
  const hedgingResult = scoreHedging(plainText);
  const passiveResult = scorePassiveVoice(plainText);
  const flowResult = scoreFlow(plainText);
  const repetitionResult = scoreRepetition(sentences);
  const interestingResult = scoreInterestingness(plainText, headings);
  const mistakeResult = scoreMistakeCoverage(plainText, headings);
  const comparisonResult = scoreComparisonCoverage(plainText, headings);
  const aiTellResult = scoreAiTells(markdown, plainText, sentences, paragraphs, headings);

  // Clarity composite: blend of direct answers, low jargon, low fluff, short sentences
  const clarity = clamp(Math.round(
    directAnswer.score * 0.35 +
    jargonResult.score * 0.25 +
    fluffResult.score * 0.20 +
    sentLen.score * 0.20
  ));

  const subScores = {
    clarity,
    readability: readabilityScore,
    scannability: scannabilityScore,
    examples: exampleDensity.score,
    teaching: teachingResult.score,
    rhythm: rhythmScore,
    jargon: jargonResult.score,
    flow: flowResult.score,
    confidence: hedgingResult.score,
    interestingness: interestingResult.score,
    repetition: repetitionResult.score,
    passiveVoice: passiveResult.score,
    comparisonCoverage: comparisonResult.score,
    mistakeCoverage: mistakeResult.score,
    aiTells: aiTellResult.score,
  };

  const weights = RULES.scoreWeights;
  const compositeScore = clamp(Math.round(
    Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (subScores[key as keyof typeof subScores] ?? 0) * weight;
    }, 0)
  ));

  const toyToolsStyleScore = scoreToyToolsStyle(subScores);

  // Build issues
  const issues: string[] = [];
  if (sentLen.longSentences.length > 0)
    issues.push(`${sentLen.longSentences.length} sentence(s) exceed ${RULES.sentenceLength.long_max} words`);
  if (paraLen.longParas > 0)
    issues.push(`${paraLen.longParas} paragraph(s) exceed ${RULES.maxParagraphSentences} sentences`);
  if (jargonResult.found.length > 0)
    issues.push(`Jargon detected: ${jargonResult.found.join(', ')}`);
  if (fluffResult.fluffCount > 0)
    issues.push(`${fluffResult.fluffCount} fluff/boring phrase(s) detected`);
  if (hedgingResult.found.length > 0)
    issues.push(`Hedging language: ${hedgingResult.found.slice(0, 3).join(', ')}`);
  if (passiveResult.passiveCount > 3)
    issues.push(`Passive voice detected (${passiveResult.passiveCount} occurrences)`);
  if (exampleDensity.exampleCount < RULES.minimumExamples)
    issues.push(`Too few examples (${exampleDensity.exampleCount} found)`);
  if (qHeadings.questionCount === 0)
    issues.push('No question-style headings found');
  if (repetitionResult.repetitionPenalty > 20)
    issues.push('Repeated phrases or sentence openers detected');
  if (comparisonResult.comparisonSections === 0)
    issues.push('No comparison coverage found (vs / difference / unlike)');
  if (mistakeResult.mistakeSections === 0)
    issues.push('No common mistake / pitfall sections found');
  if (aiTellResult.emDashCount > 0)
    issues.push(`Em-dash found (${aiTellResult.emDashCount}×): banned on this project, rewrite with a period, comma, or colon`);
  if (aiTellResult.phrasesFound.length > 0)
    issues.push(`AI-tell phrases: ${aiTellResult.phrasesFound.slice(0, 4).join(', ')}`);
  if (aiTellResult.notJustCount > 0)
    issues.push(`"Not just X, it's Y" construction (${aiTellResult.notJustCount}×): the most recognizable AI sentence shape`);
  if (aiTellResult.tripletRatio > RULES.aiTellStructural.maxTripletRatio)
    issues.push(`Rule-of-three overuse: ${Math.round(aiTellResult.tripletRatio * 100)}% of sentences are "A, B, and C" lists`);
  if (paragraphs.length >= RULES.aiTellStructural.minParagraphsForShapeCheck &&
      aiTellResult.paragraphShapeStdDev < RULES.aiTellStructural.minParagraphShapeStdDev)
    issues.push('Uniform paragraph shapes: every paragraph has the same sentence count; vary them');

  // Build recommendations
  const recommendations: string[] = [];
  if (sentLen.longSentences.length > 0)
    recommendations.push('Split sentences longer than 35 words into 2–3 shorter ones');
  if (paraLen.longParas > 0)
    recommendations.push(`Break long paragraphs — aim for ${RULES.maxParagraphSentences} sentences or fewer`);
  if (jargonResult.found.length > 0) {
    const examples = Object.entries(RULES.jargonReplacements).slice(0, 3)
      .map(([k, v]) => `"${k}" → "${v}"`).join(', ');
    recommendations.push(`Replace jargon with simpler words (${examples})`);
  }
  if (hedgingResult.found.length > 0)
    recommendations.push('Replace hedging words with direct, confident statements');
  if (passiveResult.passiveCount > 3)
    recommendations.push('Prefer active voice: "the tool encodes" not "the data is encoded"');
  if (exampleDensity.exampleCount < RULES.minimumExamples)
    recommendations.push('Add at least one practical example with Input/Output');
  if (qHeadings.questionCount === 0)
    recommendations.push('Add question-style headings (e.g. "What is X?" "Why does X happen?")');
  if (flowResult.transitionCount < 3)
    recommendations.push('Use transition words (however, therefore, for example) to improve flow');
  if (comparisonResult.comparisonSections === 0)
    recommendations.push('Add a comparison section (X vs Y, difference between X and Y)');
  if (mistakeResult.mistakeSections === 0)
    recommendations.push('Add a "Common Mistakes" or "Pitfalls" section to help readers avoid errors');
  if (interestingResult.patterns < 3)
    recommendations.push('Add surprising facts, misconceptions to correct, or memorable comparisons');
  if (aiTellResult.score < 100)
    recommendations.push('Remove AI tells: no em-dashes, no "not just X" framing, no banned vocab (delve, unlock, seamless); vary sentence and paragraph shapes');

  return {
    score: compositeScore,
    ...subScores,
    toyToolsStyleScore,
    issues,
    recommendations,
  };
}

export function generateRewriterSuggestions(markdown: string): RewriterSuggestion[] {
  const suggestions: RewriterSuggestion[] = [];
  const plainText = stripMarkdown(markdown);
  const sentences = parseSentences(plainText);
  const cfg = RULES.sentenceLength;

  // Suggest jargon replacements
  for (const [jargon, replacement] of Object.entries(RULES.jargonReplacements)) {
    const re = new RegExp(`\\b${jargon}\\b`, 'gi');
    const matchingSentences = sentences.filter(s => re.test(s));
    for (const sentence of matchingSentences.slice(0, 2)) {
      const suggested = sentence.replace(new RegExp(`\\b${jargon}\\b`, 'gi'), replacement);
      if (suggested !== sentence) {
        suggestions.push({ original: sentence, suggested });
      }
    }
  }

  // Suggest splitting long sentences
  const longSentences = sentences.filter(s => s.split(/\s+/).length > cfg.long_max);
  for (const sentence of longSentences.slice(0, 3)) {
    suggestions.push({
      original: sentence,
      suggested: '[Split this sentence into 2–3 shorter sentences for clarity]',
    });
  }

  return suggestions;
}

export function generateWritingFingerprint(markdown: string): WritingFingerprint {
  const plainText = stripMarkdown(markdown);
  const sentences = parseSentences(plainText);
  const paragraphs = parseParagraphs(plainText);
  const headings = parseHeadings(markdown);
  const wordCount = countWords(plainText);

  const avgSentenceLength = sentences.length > 0
    ? sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
    : 0;

  const avgParagraphLength = paragraphs.length > 0
    ? paragraphs.reduce((sum, p) => sum + parseSentences(p).length, 0) / paragraphs.length
    : 0;

  const questionHeadings = headings.filter(h => h.endsWith('?')).length;

  const markers = [/\bexample:/gi, /\bfor example[,:]?\b/gi, /\binput:/gi, /\boutput:/gi];
  const examples = markers.reduce((sum, re) => sum + (plainText.match(re)?.length ?? 0), 0);

  let jargonCount = 0;
  for (const word of RULES.jargonWords) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    jargonCount += plainText.match(re)?.length ?? 0;
  }

  let hedgingCount = 0;
  for (const word of RULES.hedgingWords) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    hedgingCount += plainText.match(re)?.length ?? 0;
  }

  let passiveVoiceCount = 0;
  for (const pattern of RULES.passiveVoicePatterns) {
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    passiveVoiceCount += plainText.match(re)?.length ?? 0;
  }

  const combined = (plainText + ' ' + headings.join(' ')).toLowerCase();
  let comparisonSections = 0;
  for (const kw of RULES.comparisonKeywords) {
    if (combined.includes(kw)) comparisonSections++;
  }

  let commonMistakeSections = 0;
  for (const kw of RULES.mistakeKeywords) {
    const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (combined.match(re)) commonMistakeSections++;
  }

  let transitionCount = 0;
  for (const word of RULES.transitionWords) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    transitionCount += plainText.match(re)?.length ?? 0;
  }
  const transitionDensity = wordCount > 0 ? Math.round((transitionCount / wordCount) * 1000) / 10 : 0;

  const repResult = scoreRepetition(sentences);
  const aiTells = scoreAiTells(markdown, plainText, sentences, paragraphs, headings);

  return {
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgParagraphLength: Math.round(avgParagraphLength * 10) / 10,
    questionHeadings,
    examples,
    jargonCount,
    hedgingCount,
    passiveVoiceCount,
    comparisonSections,
    commonMistakeSections,
    transitionDensity,
    repetitionScore: repResult.score,
    emDashCount: aiTells.emDashCount,
    aiTellPhraseCount: aiTells.phraseCount,
    aiTellPhrasesFound: aiTells.phrasesFound,
    notJustCount: aiTells.notJustCount,
    tripletRatio: aiTells.tripletRatio,
    paragraphShapeStdDev: aiTells.paragraphShapeStdDev,
  };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function renderAuditSection(slug: string, score: WritingScore, fp: WritingFingerprint, suggestions: RewriterSuggestion[]): string[] {
  const lines: string[] = [];
  const title = slugToTitle(slug);

  lines.push(`## ${title}`);
  lines.push('');
  lines.push(`**Writing Score:** ${score.score}/100  |  **ToyTools Style Match:** ${score.toyToolsStyleScore}/100`);
  lines.push('');
  lines.push('| Metric | Score |');
  lines.push('|--------|-------|');
  lines.push(`| Clarity | ${score.clarity} |`);
  lines.push(`| Readability | ${score.readability} |`);
  lines.push(`| Scannability | ${score.scannability} |`);
  lines.push(`| Teaching | ${score.teaching} |`);
  lines.push(`| Examples | ${score.examples} |`);
  lines.push(`| Rhythm | ${score.rhythm} |`);
  lines.push(`| Flow | ${score.flow} |`);
  lines.push(`| Confidence | ${score.confidence} |`);
  lines.push(`| Interestingness | ${score.interestingness} |`);
  lines.push(`| Repetition | ${score.repetition} |`);
  lines.push(`| Passive Voice | ${score.passiveVoice} |`);
  lines.push(`| Comparison Coverage | ${score.comparisonCoverage} |`);
  lines.push(`| Mistake Coverage | ${score.mistakeCoverage} |`);
  lines.push(`| Jargon | ${score.jargon} |`);
  lines.push(`| AI Tells | ${score.aiTells} |`);
  lines.push('');
  lines.push('**Writing Fingerprint:**');
  lines.push(
    `avgSentenceLength: ${fp.avgSentenceLength} | avgParagraphLength: ${fp.avgParagraphLength} sentences`
  );
  lines.push(
    `questionHeadings: ${fp.questionHeadings} | examples: ${fp.examples} | jargonCount: ${fp.jargonCount}`
  );
  lines.push(
    `hedgingCount: ${fp.hedgingCount} | passiveVoiceCount: ${fp.passiveVoiceCount}`
  );
  lines.push(
    `comparisonSections: ${fp.comparisonSections} | commonMistakeSections: ${fp.commonMistakeSections}`
  );
  lines.push(`transitionDensity: ${fp.transitionDensity}/100 words`);
  lines.push(
    `emDashCount: ${fp.emDashCount} | aiTellPhrases: ${fp.aiTellPhraseCount} | notJust: ${fp.notJustCount} | paragraphShapeStdDev: ${fp.paragraphShapeStdDev}`
  );
  lines.push('');

  if (score.issues.length > 0) {
    lines.push('### Issues');
    score.issues.forEach(i => lines.push(`- ${i}`));
    lines.push('');
  }

  if (score.recommendations.length > 0) {
    lines.push('### Recommendations');
    score.recommendations.forEach(r => lines.push(`- ${r}`));
    lines.push('');
  }

  if (suggestions.length > 0) {
    lines.push('### Rewriter Suggestions');
    lines.push('| Original | Suggested |');
    lines.push('|----------|-----------|');
    suggestions.forEach(s => lines.push(`| ${s.original.replace(/\|/g, '\\|')} | ${s.suggested.replace(/\|/g, '\\|')} |`));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  return lines;
}

async function main() {
  const arg = process.argv[2];
  const OUTPUT_DIR = join(ROOT, 'output');
  const REPORTS_DIR = join(ROOT, 'reports');

  mkdirSync(REPORTS_DIR, { recursive: true });

  // Determine which slugs/files to analyze
  let targets: Array<{ slug: string; mdPath: string }> = [];

  if (arg) {
    // Explicit file path?
    if (extname(arg) === '.md' && existsSync(resolve(arg))) {
      targets = [{ slug: arg, mdPath: resolve(arg) }];
    } else {
      // Treat as tool slug
      const mdPath = join(OUTPUT_DIR, arg, 'guide.outline.md');
      if (!existsSync(mdPath)) {
        console.error(`No guide.outline.md found for "${arg}". Run seo:scaffold first.`);
        process.exit(1);
      }
      targets = [{ slug: arg, mdPath }];
    }
  } else {
    // Scan all output directories
    if (!existsSync(OUTPUT_DIR)) {
      console.error('No output/ directory found. Run seo:scaffold first.');
      process.exit(1);
    }
    const slugs = readdirSync(OUTPUT_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const slug of slugs) {
      const mdPath = join(OUTPUT_DIR, slug, 'guide.outline.md');
      if (existsSync(mdPath)) targets.push({ slug, mdPath });
    }

    if (targets.length === 0) {
      console.error('No guide.outline.md files found. Run seo:scaffold first.');
      process.exit(1);
    }
  }

  console.log(`\n=== Writing Intelligence Engine ===\n`);
  console.log(`Analyzing ${targets.length} tool(s)...\n`);

  const date = new Date().toISOString().split('T')[0];
  const reportLines: string[] = [`# Writing Audit — ${date}`, ''];
  let analyzed = 0;

  for (const { slug, mdPath } of targets) {
    const md = readFileSync(mdPath, 'utf-8');
    const wordCount = countWords(stripMarkdown(md));

    if (wordCount < RULES.minWordsForAnalysis) {
      console.log(`  Skipped: ${slug} (${wordCount} words — too sparse for analysis)`);
      continue;
    }

    const score = calculateWritingScore(md);
    const fp = generateWritingFingerprint(md);
    const suggestions = generateRewriterSuggestions(md);

    reportLines.push(...renderAuditSection(slug, score, fp, suggestions));

    console.log(
      `  Analyzed: ${slug} ` +
      `(Score: ${score.score} | Style: ${score.toyToolsStyleScore} | ` +
      `Clarity: ${score.clarity} | Teaching: ${score.teaching})`
    );
    analyzed++;
  }

  const reportPath = join(REPORTS_DIR, 'writing-audit.md');
  writeFileSync(reportPath, reportLines.join('\n'));

  console.log(`\n=== Writing analysis complete ===`);
  console.log(`  Tools analyzed: ${analyzed}`);
  console.log(`  Output: reports/writing-audit.md\n`);
}

// Only run as CLI when this file is the entry point (not imported as a module)
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
