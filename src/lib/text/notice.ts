// The craft seam for the text-analysis engine: one line about the input the number does not show.
//
// Why. Every counter on this engine prints a figure and stops, and each one has a documented way of
// being misread that the code can already see:
//
//   space-counter      "Overlooking trailing spaces because they are invisible" — literally true; a
//                      trailing space is the one character a person cannot proofread.
//   letter-counter     "Treating letter count and character count as the same number" — they differ
//                      by every digit, space and symbol, and both numbers are already computed.
//   character-counter  the same divergence from the other side, where a limit is usually the point.
//   line-counter       blank lines counted as lines, which is why a "500 line" file is not.
//   sentence-counter   abbreviations split a sentence, so the count reads low or high for a reason.
//   paragraph-counter   single newlines are not paragraph breaks, which is how a wall of text counts 1.
//   word-frequency      stop words dominate any frequency list unless they are excluded.
//   reading-time        derived from a words-per-minute assumption, not measured.
//
// Orientation, in the doctrine's taxonomy: something true about their input they cannot see, in one
// line. Silent whenever the input does not actually exhibit it, which is most of the time — that is
// what separates this from a tip strip.
//
// See docs/analysis/2026-08-11-tool-craft.md.

import type { TextAnalysis } from './analysis';

/** Which counter is asking. One notice per processor; there is deliberately no default. */
export type NoticeId =
  | 'space-counter'
  | 'letter-counter'
  | 'character-counter'
  | 'line-counter'
  | 'sentence-counter'
  | 'paragraph-counter'
  | 'word-frequency-counter'
  | 'reading-time-calculator';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * One line about the input, or null when there is nothing true to say.
 *
 * Pure: takes the raw text and the analysis already computed for the page, returns a string. Never
 * reports a count of zero and never restates the headline number — a notice that fires on every
 * input is a tip strip, and a notice that repeats the metric is noise.
 */
export function textNotice(id: NoticeId, text: string, a: TextAnalysis): string | null {
  if (!text) return null;

  switch (id) {
    case 'space-counter': {
      // Trailing whitespace is invisible by definition, so this is the one thing a person cannot
      // check by looking. Counted per line, because that is how it gets fixed.
      const lines = text.split('\n');
      const trailing = lines.filter((l) => l.length > 0 && /\s$/.test(l)).length;
      const tabs = (text.match(/\t/g) ?? []).length;
      const parts: string[] = [];
      if (trailing > 0) parts.push(`${plural(trailing, 'line ends', 'lines end')} in invisible whitespace`);
      if (tabs > 0) parts.push(`${plural(tabs, 'tab', 'tabs')} counted separately from spaces`);
      return parts.length ? parts.join(', ') : null;
    }

    case 'letter-counter':
    case 'character-counter': {
      // The two numbers diverge by exactly the digits, punctuation and spaces. Saying so is the
      // difference between a count and an answer, and it is silent when they agree.
      const diff = a.characters - a.letters;
      if (diff <= 0) return null;
      return `${a.letters} letters of ${a.characters} characters: ${plural(diff, 'is', 'are')} a digit, space or symbol`;
    }

    case 'line-counter': {
      const blank = a.lines - a.nonEmptyLines;
      if (blank <= 0) return null;
      return `${plural(blank, 'line is', 'lines are')} blank, so ${a.nonEmptyLines} carry content`;
    }

    case 'sentence-counter': {
      // Abbreviations are the documented reason a sentence count reads wrong, and they are
      // detectable: a period followed by a space and a lowercase letter is rarely a sentence end.
      const suspect = (text.match(/\b(?:[A-Z][a-z]{0,3}|e\.g|i\.e|etc|vs|Dr|Mr|Mrs|Ms|St|No)\.\s+[a-z]/g) ?? []).length;
      if (suspect === 0) return null;
      return `${plural(suspect, 'abbreviation may be', 'abbreviations may be')} counted as a sentence end`;
    }

    case 'paragraph-counter': {
      // A wall of text with single newlines counts as one paragraph, and that surprises people.
      const singles = (text.match(/[^\n]\n(?!\n)[^\n]/g) ?? []).length;
      if (singles === 0 || a.paragraphs > 1) return null;
      return `${plural(singles, 'single line break is', 'single line breaks are')} not a paragraph break, so this counts as one paragraph`;
    }

    case 'word-frequency-counter': {
      // Any frequency list is topped by "the" and "and" unless they are excluded, which is the
      // documented reason the output looks useless on real prose.
      const stop = (text.toLowerCase().match(/\b(?:the|and|of|to|a|in|is|it|that|for)\b/g) ?? []).length;
      if (stop === 0 || a.words === 0) return null;
      const pct = Math.round((stop / a.words) * 100);
      if (pct < 10) return null;
      return `${pct}% of these words are common stop words like "the" and "and"`;
    }

    case 'reading-time-calculator': {
      // The figure is an assumption, not a measurement, and the assumption is the thing people are
      // surprised by when their own reading disagrees with it.
      if (a.words < 50) return null;
      return `Assumes 200 words a minute reading and 130 speaking; ${a.words} words either way`;
    }

    default:
      return null;
  }
}
