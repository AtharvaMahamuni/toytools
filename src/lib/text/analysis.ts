export interface TextAnalysis {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

export function analyzeText(text: string): TextAnalysis {
  if (!text.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
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
  const sentences = punctuationGroups > 0 ? punctuationGroups : 1;

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const lines = text.split('\n').length;

  const readingTime = Math.max(1, Math.round(words / 200));
  const speakingTime = Math.max(1, Math.round(words / 130));

  // Unicode-aware tokens: letters, digits, apostrophes — "café" and "2024" are words.
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  const uniqueWords = new Set(tokens).size;

  const totalLetters = (text.match(/\p{L}/gu) ?? []).length;
  const averageWordLength = words > 0
    ? Math.round((totalLetters / words) * 10) / 10
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
    readingTime,
    speakingTime,
    uniqueWords,
    averageWordLength,
    averageSentenceLength,
  };
}
