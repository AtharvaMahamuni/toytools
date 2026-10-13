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

// Word separators inside a whitespace-separated chunk: en dash, em dash and horizontal bar
// ("dog—tired" is two words), and a comma that is not between two digits ("red,green" is two
// words, "1,000" stays one). A hyphen-minus is not a separator, so "well-known" stays one word.
export const WORD_SEPARATOR = /(?:[\u2013\u2014\u2015]|(?<!\d),|,(?!\d))+/u;

// A chunk that starts like a web address is kept whole, so a URL with commas in its query
// ("https://ex.com/?a=1,b=2") is one word.
const URL_START = /^(?:https?:\/\/|www\.)/i;

/**
 * The raw word pieces of `text`, the single rule behind the Words count and wordTokens: split on
 * whitespace, then split each chunk on WORD_SEPARATOR unless it starts like a URL. Empty pieces
 * are dropped.
 */
export function wordPieces(text: string): string[] {
  const out: string[] = [];
  for (const chunk of text.split(/\s+/)) {
    if (!chunk) continue;
    if (URL_START.test(chunk)) { out.push(chunk); continue; }
    for (const piece of chunk.split(WORD_SEPARATOR)) if (piece) out.push(piece);
  }
  return out;
}

/**
 * The words of `text`, lowercased, from the same wordPieces as the headline Words count. Each
 * piece has punctuation at either end trimmed and its case folded. A piece with no letter or digit
 * (a lone "-", "...", an emoji) is dropped. Every token comes from exactly one counted word, so
 * Unique Words can never exceed Words. Shared by Unique Words, the Word Counter's Top Words and
 * the Word Frequency Counter's table.
 */
export function wordTokens(text: string): string[] {
  const out: string[] = [];
  for (const piece of wordPieces(text)) {
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
  const words = wordPieces(text).length;
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
