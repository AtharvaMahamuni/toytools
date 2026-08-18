// The craft seam for the text-processor engine: eighteen tools, one shape of failure.
//
// Read the eighteen knowledge files together and the same sentence keeps appearing. Not "the output
// is wrong" — the output is always right — but **"this is not the tool you wanted"**:
//
//   remove-extra-spaces  "Expecting it to also strip leading and trailing whitespace (use trim)"
//   trim-text            "Expecting it to also collapse double spaces inside a line"
//   remove-tabs          "Expecting it to also collapse spaces between words"
//   normalize-whitespace "Using it when you only meant to fix double spaces"
//   remove-line-breaks   "Confusing it with Remove Blank Lines, which keeps lines separate"
//   slugify-text         "Confusing it with kebab-case, which does not strip accents to ASCII"
//   sentence-case        "Confusing sentence case with simply making text lowercase"
//   remove-emoji         "Stripping all non-ASCII characters and destroying accented words too"
//
// These tools are one paste apart and near-indistinguishable from their listings, so somebody lands
// on the wrong one, gets a correct-looking result, and leaves with a job half done. Nothing on the
// page tells them, and the engine is the only thing positioned to: it can see the input, the output
// and what the sibling would have produced.
//
// So each processor gets one rule, phrased as a fact about THIS result, with the sibling named. The
// rule fires only when the input actually exhibits the confusion, which is what stops eighteen
// pages growing a permanent "see also" strip.
//
// Two rules carry no sibling (reverse-text, lowercase) because the fact is worth stating and no
// other tool undoes it. One processor gets nothing at all: see the note at the bottom.
//
// See docs/analysis/2026-08-11-tool-craft.md.

export interface Handoff {
  /** One line about this result. Never restates what the tool obviously did. */
  text: string;
  /** The sibling that finishes the job, when there is one. Slug in the `text` segment. */
  tool?: { slug: string; name: string };
}

const count = (s: string, re: RegExp): number => (s.match(re) ? (s.match(re) as string[]).length : 0);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Non-ASCII letters that survived a transform, which is what separates kebab from a URL slug. */
const NON_ASCII_LETTER = /[^\x00-\x7F]/;

/** The words every English style guide leaves lowercase inside a title. */
const MINOR_WORDS = /\b(?:a|an|and|as|at|but|by|for|in|nor|of|on|or|the|to|up|via)\b/gi;

/**
 * One line about this result, or null when the input does not exhibit the confusion.
 *
 * Pure and total: takes the processor id, what went in and what came out. Every rule guards its own
 * inputs, so the widget calls it on each keystroke and gets null until there is something true to
 * say.
 */
export function textHandoff(processorId: string, input: string, output: string): Handoff | null {
  if (!input) return null;
  const unchanged = input === output;

  switch (processorId) {
    // ── cleanup: what this one deliberately left alone ────────────────────────
    case 'removeExtraSpaces': {
      // Collapses runs WITHIN a line and keeps one space at each edge, by design. People read
      // "extra spaces" as "all of them" and walk away with indented output.
      // Count LINES, not matches: a line indented and trailing at once is still one line.
      const edges = output.split('\n').filter(l => /^[ \t]|[ \t]$/.test(l)).length;
      if (edges === 0) return null;
      return {
        text: `Runs of spaces are collapsed, but ${plural(edges, 'line still starts or ends', 'lines still start or end')} with one.`,
        tool: { slug: 'trim-text', name: 'Trim Text' },
      };
    }

    case 'trimLines': {
      // Trims the edges and leaves the middle, which is the mirror image of the above.
      const inner = count(output, /\S[ \t]{2,}\S/g);
      if (inner === 0) return null;
      return {
        text: `Line edges are trimmed, but ${plural(inner, 'gap', 'gaps')} of two or more spaces remain inside the lines.`,
        tool: { slug: 'remove-extra-spaces', name: 'Remove Extra Spaces' },
      };
    }

    case 'removeTabs': {
      // Each tab becomes one space, so a tab next to spaces leaves a run behind.
      const runs = count(output, /[ ]{2,}/g);
      if (runs === 0) return null;
      return {
        text: `Each tab became one space, which leaves ${plural(runs, 'run', 'runs')} of two or more spaces behind.`,
        tool: { slug: 'remove-extra-spaces', name: 'Remove Extra Spaces' },
      };
    }

    case 'normalizeWhitespace': {
      // The heaviest cleanup on the engine: it eats line breaks too, and that surprises people who
      // arrived wanting double spaces fixed.
      const breaks = count(input, /\r\n?|\n/g);
      if (breaks === 0) return null;
      return {
        text: `This collapsed ${plural(breaks, 'line break', 'line breaks')} into spaces as well.`,
        tool: { slug: 'remove-extra-spaces', name: 'Remove Extra Spaces' },
      };
    }

    case 'removeLineBreaks': {
      // Joins everything into one block, paragraph structure included.
      const paras = count(input, /\n[ \t]*\n/g);
      if (paras === 0) return null;
      return {
        text: `${plural(paras + 1, 'paragraph is', 'paragraphs are')} now one block of text.`,
        tool: { slug: 'remove-blank-lines', name: 'Remove Blank Lines' },
      };
    }

    case 'removeBlankLines': {
      // Did nothing, on multi-line input. Almost always means the other line tool was wanted.
      if (!unchanged || !/\n/.test(input)) return null;
      return {
        text: `No blank lines to remove: these ${count(input, /\n/g) + 1} lines are all content.`,
        tool: { slug: 'remove-line-breaks', name: 'Remove Line Breaks' },
      };
    }

    case 'removeDuplicateLines': {
      // Both documented mistakes at once, and both measurable: how many MORE lines would go if the
      // text were trimmed or lowercased first. Naming the number is what makes it actionable.
      const lines = output.split('\n');
      const afterTrim = new Set(lines.map(l => l.trim())).size;
      const afterLower = new Set(lines.map(l => l.toLowerCase())).size;
      const byTrim = lines.length - afterTrim;
      const byCase = lines.length - afterLower;
      if (byTrim === 0 && byCase === 0) return null;
      if (byTrim >= byCase) {
        return {
          text: `${plural(byTrim, 'more line is', 'more lines are')} a duplicate once the whitespace is trimmed.`,
          tool: { slug: 'trim-text', name: 'Trim Text' },
        };
      }
      return {
        text: `${plural(byCase, 'more line is', 'more lines are')} a duplicate if case is ignored.`,
        tool: { slug: 'lowercase-converter', name: 'Lowercase' },
      };
    }

    case 'removeEmoji': {
      // Found no emoji but the text is not ASCII, so whatever looked "weird" was something else.
      if (!unchanged || !NON_ASCII_LETTER.test(input)) return null;
      return {
        text: 'No emoji here. The non-ASCII characters in this text are letters, not pictographs.',
        tool: { slug: 'remove-accents', name: 'Remove Accents' },
      };
    }

    case 'removeAccents': {
      // The mirror: nothing decomposed, yet the text is not ASCII.
      if (!unchanged || !NON_ASCII_LETTER.test(input)) return null;
      return {
        text: 'Nothing here carries a separable accent, so the non-ASCII characters are unchanged.',
        tool: { slug: 'remove-emoji', name: 'Remove Emoji' },
      };
    }

    // ── transform: what this one flattened ────────────────────────────────────
    case 'slugify': {
      // A line with no ASCII alphanumerics slugifies to nothing at all, which is silent data loss.
      const lost = input.split('\n').filter((l, i) => l.trim() !== '' && (output.split('\n')[i] ?? '') === '').length;
      if (lost === 0) return null;
      return {
        text: `${plural(lost, 'line has', 'lines have')} no ASCII characters and slugified to nothing.`,
        tool: { slug: 'kebab-case-converter', name: 'Kebab Case' },
      };
    }

    case 'kebabCase':
    case 'snakeCase':
    case 'camelCase': {
      // These keep accented letters, which is right for prose and wrong for a URL or a filename.
      if (!NON_ASCII_LETTER.test(output)) return null;
      return {
        text: 'Accented letters are kept as they are, which a URL, a filename or an ASCII-only identifier will not accept.',
        tool: { slug: 'remove-accents', name: 'Remove Accents' },
      };
    }

    case 'sentenceCase': {
      // No sentence terminator means exactly one capital changed, which reads as "it lowercased
      // my text" — the documented confusion, verbatim.
      if (/[.!?]/.test(input)) return null;
      return {
        text: 'No sentence endings found, so only the very first letter was capitalized.',
        tool: { slug: 'title-case-converter', name: 'Title Case' },
      };
    }

    case 'titleCase': {
      // Capitalizes every word including the ones every style guide leaves down.
      const minor = (input.trim().split(/\s+/).slice(1).join(' ').match(MINOR_WORDS) ?? []).length;
      if (minor === 0) return null;
      return {
        text: `${plural(minor, 'short word is', 'short words are')} capitalized here that Chicago and AP both leave lowercase.`,
        tool: { slug: 'sentence-case-converter', name: 'Sentence Case' },
      };
    }

    case 'reverseText': {
      // Reversing the block moves the line breaks, so a list comes back inside out.
      const breaks = count(input, /\n/g);
      if (breaks === 0) return null;
      return {
        text: `Every character is reversed, not the word order, so ${plural(breaks, 'line break', 'line breaks')} moved to the other end of the text.`,
      };
    }

    case 'lowercase': {
      // Case is not recoverable, and an acronym is the case people did not mean to lose.
      const acronyms = input.match(/\b[A-Z]{2,}\b/g);
      if (!acronyms || acronyms.length === 0) return null;
      const unique = [...new Set(acronyms)].slice(0, 3);
      return {
        text: `${plural(acronyms.length, 'acronym', 'acronyms')} lost its capitals (${unique.join(', ')}${acronyms.length > unique.length ? ', …' : ''}), and nothing here restores them.`,
      };
    }

    // `uppercase` gets nothing, deliberately. Its two documented mistakes are that long all-caps
    // reads slowly (a judgement about the user's writing, not a fact about their input) and that
    // CSS text-transform is not the same as a stored value (invisible from here). Inventing a rule
    // to fill the slot is the failure this doctrine argues against.
    default:
      return null;
  }
}
