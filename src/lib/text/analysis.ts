export interface TextAnalysis {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  letters: number;
  spaces: number;
  nonEmptyLines: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

// Punctuation (or symbols) at either end of a whitespace-separated word. Letters, combining marks
// and digits are kept, so "dog." and "dog" are one word while "well-known", "don't", "1,000" and
// "3.14" keep their inner punctuation.
const EDGE_PUNCTUATION = /^[^\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}]+$/gu;

/**
 * The words of `text`, lowercased, using the SAME rule as the headline Words count: split on
 * whitespace, so a hyphenated word, a contraction, or a number like 1,000 or 3.14 is one token. Each
 * piece is then normalized for counting distinct words: punctuation at either end is trimmed and the
 * case is folded. A piece with no letter or digit at all (a lone dash, "...", an emoji) is not a
 * word to list, so it is dropped. Every token comes from exactly one counted word, which is why
 * Unique Words can never exceed Words. Shared by Unique Words, the Word Counter's Top Words and the
 * Word Frequency Counter's table.
 */
export function wordTokens(text: string): string[] {
  const out: string[] = [];
  for (const piece of text.split(/\s+/)) {
    if (!piece) continue;
    const token = piece.replace(EDGE_PUNCTUATION, '').toLowerCase();
    if (token) out.push(token);
  }
  return out;
}

export function analyzeText(text: string): TextAnalysis {
  // Only truly empty input is "nothing". Whitespace-only text still has characters, spaces and
  // lines (three spaces are three characters), it just has no words, sentences or paragraphs.
  if (text === '') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      letters: 0,
      spaces: 0,
      nonEmptyLines: 0,
      readingTime: 0,
      speakingTime: 0,
      uniqueWords: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
    };
  }

  // Whitespace-delimited word count — known limitation: scripts written without
  // spaces (CJK) count a whole run as one word.
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Count sentence-ending punctuation groups (e.g. "..." counts as one).
  // Known limitation: abbreviations ("Dr. Smith.") over-count by one per period.
  const punctuationGroups = (text.match(/[.!?]+/g) ?? []).length;
  const sentences = words === 0 ? 0 : punctuationGroups > 0 ? punctuationGroups : 1;

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const lineArray = text.split('\n');
  const lines = lineArray.length;
  const nonEmptyLines = lineArray.filter(l => l.trim().length > 0).length;

  const readingTime = words === 0 ? 0 : Math.max(1, Math.round(words / 200));
  const speakingTime = words === 0 ? 0 : Math.max(1, Math.round(words / 130));

  // Same tokenizer as the Words count above, so Unique Words <= Words always.
  const uniqueWords = new Set(wordTokens(text)).size;

  const letters = (text.match(/\p{L}/gu) ?? []).length;
  const spaces = (text.match(/ /g) ?? []).length;
  const averageWordLength = words > 0
    ? Math.round((letters / words) * 10) / 10
    : 0;

  const averageSentenceLength = sentences > 0
    ? Math.round((words / sentences) * 10) / 10
    : 0;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    letters,
    spaces,
    nonEmptyLines,
    readingTime,
    speakingTime,
    uniqueWords,
    averageWordLength,
    averageSentenceLength,
  };
}
