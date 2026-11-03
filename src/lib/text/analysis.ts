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
const WORD_CHAR = /[\p{L}\p{M}\p{N}]/u;

// Trims EDGE punctuation in linear time. A /[^...]+$/ regex retries from every position of a long
// inner punctuation run ("a" + "-" x 100k + "a"), which is quadratic, so this walks code units
// from both ends instead. Surrogate pairs are tested as one code point.
function trimEdges(piece: string): string {
  let start = 0;
  let end = piece.length;
  while (start < end) {
    const cp = piece.codePointAt(start) as number;
    if (WORD_CHAR.test(String.fromCodePoint(cp))) break;
    start += cp > 0xffff ? 2 : 1;
  }
  while (end > start) {
    let i = end - 1;
    const lo = piece.charCodeAt(i);
    // Step back over a low surrogate only when a high surrogate really precedes it, so a lone
    // (malformed) low surrogate is never paired with the wrong unit.
    if (lo >= 0xdc00 && lo <= 0xdfff && i > start) {
      const hi = piece.charCodeAt(i - 1);
      if (hi >= 0xd800 && hi <= 0xdbff) i--;
    }
    if (WORD_CHAR.test(String.fromCodePoint(piece.codePointAt(i) as number))) break;
    end = i;
  }
  return piece.slice(start, end);
}

// Word separators inside a whitespace-separated chunk: en dash, em dash and horizontal bar
// ("dog—tired" is two words), and a comma that is not between two digits ("red,green" is two
// words, "1,000" stays one). A hyphen-minus is not a separator, so "well-known" stays one word.
export const WORD_SEPARATOR = /(?:[\u2013\u2014\u2015]|(?<!\d),|,(?!\d))+/u;

// A chunk that starts like a web address, optionally after quotes or brackets ("(https://..."),
// is treated as a URL: commas inside its path or query stay ("https://ex.com/?a=1,b=2" is one word).
const URL_START = /^[^\p{L}\p{N}]*(?:https?:\/\/|www\.)/iu;

// Inside a URL chunk, a word still ends at an en/em dash or horizontal bar, and at a comma that
// starts another URL ("https://a.com,https://b.com").
// The lookahead may not cross another comma, so each comma's lookahead stops at the next one and
// a long run of commas stays linear.
const URL_SEPARATOR = /[\u2013\u2014\u2015]+|,(?=[^\p{L}\p{N},]*(?:https?:\/\/|www\.))/iu;

// The host part of a URL piece: everything up to the first "/", "?" or "#" after the scheme. A
// comma in the host cannot be part of the address, so the word ends there ("https://ex.com,next").
const URL_HOST = /^[^\p{L}\p{N}]*(?:https?:\/\/)?[^/?#,]*/iu;

function pushPieces(chunk: string, out: string[]): void {
  if (!URL_START.test(chunk)) {
    for (const piece of chunk.split(WORD_SEPARATOR)) if (piece) out.push(piece);
    return;
  }
  for (const part of chunk.split(URL_SEPARATOR)) {
    if (!part) continue;
    if (!URL_START.test(part)) { pushPieces(part, out); continue; }
    const host = (URL_HOST.exec(part) as RegExpExecArray)[0];
    if (part.charAt(host.length) === ',') {
      out.push(host);
      pushPieces(part.slice(host.length + 1), out); // the rest follows the normal rules
    } else {
      out.push(part);
    }
  }
}

/**
 * The raw word pieces of `text`, the single rule behind the Words count and wordTokens: split on
 * whitespace, then split each chunk on WORD_SEPARATOR, or, for a chunk that starts like a URL, only
 * on dashes, a comma in the host, or a comma that starts another URL. Empty pieces are dropped.
 */
export function wordPieces(text: string): string[] {
  const out: string[] = [];
  for (const chunk of text.split(/\s+/)) if (chunk) pushPieces(chunk, out);
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
    // A curly apostrophe (U+2019, also the typographic right single quote; U+2018, which some
    // keyboards autocorrect to inside a word), a modifier letter apostrophe (U+02BC) or a
    // fullwidth one (U+FF07) counts as a straight one, so don't and don’t are one word.
    const token = trimEdges(piece).replace(/[\u2018\u2019\u02bc\uff07]/g, "'").toLowerCase();
    if (token) out.push(token);
  }
  return out;
}

/**
 * True when a word token is a number rather than a word: it has at least one digit and no letter.
 * So 1,000, 3.14, 2026, 50% and 10:30 are numbers, while 1st, mp3 and covid-19 stay words.
 * Used by Word Frequency's "Ignore numbers" option.
 */
export function isNumberToken(token: string): boolean {
  return /\p{N}/u.test(token) && !/[\p{L}\p{M}]/u.test(token);
}

/**
 * User-perceived characters (grapheme clusters): an emoji with a skin tone, a flag, or an e with a
 * combining accent is one character, so '😀👍🏽 é' counts 4, not the 8 UTF-16 units text.length gave
 * (accuracy audit, 3 Nov 2026). Falls back to code points where Intl.Segmenter is missing.
 */
let graphemeSegmenter: Intl.Segmenter | null | undefined;
export function graphemeCount(text: string): number {
  if (graphemeSegmenter === undefined) {
    graphemeSegmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      : null;
  }
  if (!graphemeSegmenter) return Array.from(text).length;
  let n = 0;
  for (const _ of graphemeSegmenter.segment(text)) n++;
  return n;
}

/** Abbreviations whose period never ends a sentence (a title always has a name after it). */
const TITLE_ABBREVIATIONS = new Set(['mr', 'mrs', 'ms', 'dr', 'prof', 'st', 'sr', 'jr', 'mt', 'rev', 'gen', 'capt', 'lt', 'sgt', 'col', 'gov', 'sen', 'rep', 'hon', 'vs', 'no', 'fig', 'vol', 'pp', 'cf', 'approx', 'dept', 'est']);
/** Abbreviations that end a sentence only when a capitalised word follows ("at 3 p.m. He left."). */
const SOFT_ABBREVIATIONS = new Set(['a.m', 'p.m', 'e.g', 'i.e', 'etc', 'inc', 'ltd', 'co', 'corp', 'u.s', 'u.k', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec']);

/**
 * Sentence-ending punctuation groups ("..." counts once). A period does not end a sentence inside a
 * number (3.30), after a title such as Dr. or Mr., after a single initial, or after an abbreviation
 * such as p.m. or e.g. that the sentence carries on from in lower case. So
 * 'Dr. Smith arrived at 3.30 p.m. today. He left.' is 2 sentences, not 5 (accuracy audit,
 * 3 Nov 2026).
 */
export function sentenceEnds(text: string): number {
  let count = 0;
  const re = /[.!?]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const group = m[0];
    const end = m.index + group.length;
    const after = text.slice(end);
    // Inside a token (3.30, example.com, a.m): not an end unless the text stops here.
    if (after !== '' && !/^[\s"')\]\u201d\u2019]/.test(after)) continue;
    if (group === '.') {
      const before = text.slice(0, m.index);
      const word = (before.match(/[\p{L}.]+$/u)?.[0] ?? '').toLowerCase();
      const next = after.match(/^[\s"')\]\u201d\u2019]*(\S)?/u)?.[1] ?? '';
      if (after.trim() !== '') {
        if (TITLE_ABBREVIATIONS.has(word)) continue;
        if (/^\p{L}$/u.test(word) && /\p{Lu}/u.test(before.slice(-1))) continue; // an initial, J. Smith
        if ((SOFT_ABBREVIATIONS.has(word) || SOFT_ABBREVIATIONS.has(word.replace(/\.$/, ''))) && !/\p{Lu}/u.test(next)) continue;
      }
    }
    count++;
  }
  return count;
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
  const characters = graphemeCount(text);
  const charactersNoSpaces = graphemeCount(text.replace(/\s/g, ''));

  // Sentence-ending punctuation groups, skipping abbreviations and decimals (sentenceEnds above).
  const punctuationGroups = sentenceEnds(text);
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
