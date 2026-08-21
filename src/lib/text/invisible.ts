// Invisible and confusable character detection.
//
// The defect this finds is, by construction, one nobody can see. Two strings render identically and
// an exact-match comparison says they differ, so the conclusion people reach is that the comparison
// is broken. The character that is actually there never becomes a suspect, which is why the need
// produces no search term until somebody else names it.
//
// Three classes are worth reporting, and they fail in different ways:
//
//   invisible   zero-width joiners, the BOM, soft hyphens. They occupy no space, survive copy and
//               paste, and defeat trim() because they are not the whitespace anyone expects.
//   confusable  a space that is not U+0020, a quote that is not U+0027. These LOOK right, so the
//               eye confirms them and the byte comparison rejects them.
//   dangerous   mixed-script homoglyphs and bidi overrides. Not a typo but a technique: the basis of
//               lookalike domains and of source that reads differently to a compiler than a human.
//
// Plain ASCII, ordinary spaces and newlines are never reported. A detector that flags every string
// teaches people to ignore it, and this one has to be believed on the day it matters.
//
// Pure and deterministic.

export type FindingKind = 'invisible' | 'confusable' | 'dangerous';

export interface CharFinding {
  /** 0-based index into the ORIGINAL string. */
  index: number;
  /** The offending character. */
  char: string;
  /** U+XXXX. */
  codePoint: string;
  name: string;
  kind: FindingKind;
  /** What it breaks, in the user's terms. */
  effect: string;
  /** What this character should probably be, when there is an obvious answer. '' means delete it. */
  replacement: string;
}

export interface ScriptMix {
  /** Script names present among the letters, e.g. ['Latin', 'Cyrillic']. */
  scripts: string[];
  /** The confusable characters that made the mix, deduped, in first-seen order. */
  samples: string[];
}

export interface InvisibleReport {
  findings: CharFinding[];
  counts: Record<FindingKind, number>;
  /** The input with every finding replaced by its `replacement`. Equal to the input when clean. */
  cleaned: string;
  /**
   * Set when the text mixes scripts in a way that produces lookalikes, or carries a bidi override.
   *
   * This is the craft seam. Every other finding is something the person will recognise once it is
   * pointed at; this one they can stare at and still not see, because the character is not merely
   * invisible, it is wearing another character's face.
   */
  spoofRisk: ScriptMix | null;
}

interface Def {
  name: string;
  kind: FindingKind;
  effect: string;
  replacement: string;
}

/**
 * Characters that are invisible or that impersonate an ASCII one.
 *
 * Keys are written as \u escapes on purpose. A file about characters nobody can see must not
 * depend on those characters surviving every future edit, copy and merge intact - the bug this
 * tool finds is exactly the bug that would silently corrupt this table.
 *
 * A map rather than ranges, because each entry has to carry what it BREAKS. "U+00A0 is a
 * no-break space" is a fact; "a no-break space stops a CSS class matching and survives trim()" is
 * the sentence that ends the bug hunt.
 */
const CHARS: Record<string, Def> = {
  // ── invisible ────────────────────────────────────────────────────────────────────────────
  '\u200B': { name: 'Zero-width space', kind: 'invisible', effect: 'Occupies no space and breaks exact-match comparison and search.', replacement: '' },
  '\u200C': { name: 'Zero-width non-joiner', kind: 'invisible', effect: 'Invisible; usually pasted in from rich text.', replacement: '' },
  '\u200D': { name: 'Zero-width joiner', kind: 'invisible', effect: 'Invisible; joins emoji sequences and otherwise breaks comparison.', replacement: '' },
  '\u2060': { name: 'Word joiner', kind: 'invisible', effect: 'Invisible; prevents a line break and defeats comparison.', replacement: '' },
  '\uFEFF': { name: 'Byte order mark', kind: 'invisible', effect: 'Invisible; a leading BOM breaks the first key of a parsed file.', replacement: '' },
  '\u00AD': { name: 'Soft hyphen', kind: 'invisible', effect: 'Invisible until the line wraps, then appears as a hyphen.', replacement: '' },

  // ── confusable whitespace ────────────────────────────────────────────────────────────────
  '\u00A0': { name: 'No-break space', kind: 'confusable', effect: 'Looks like a space; trim() leaves it and CSS class names stop matching.', replacement: ' ' },
  '\u2007': { name: 'Figure space', kind: 'confusable', effect: 'Looks like a space; comes from copied numeric tables.', replacement: ' ' },
  '\u202F': { name: 'Narrow no-break space', kind: 'confusable', effect: 'Looks like a space; common in French text and spreadsheets.', replacement: ' ' },
  '\u205F': { name: 'Medium mathematical space', kind: 'confusable', effect: 'Looks like a space; comes from copied equations.', replacement: ' ' },
  '\u3000': { name: 'Ideographic space', kind: 'confusable', effect: 'Looks like a wide space; common in CJK input.', replacement: ' ' },
  '\u2009': { name: 'Thin space', kind: 'confusable', effect: 'Looks like a space; comes from typeset copy.', replacement: ' ' },

  // ── confusable punctuation ───────────────────────────────────────────────────────────────
  '\u2018': { name: 'Left single quotation mark', kind: 'confusable', effect: "Looks like an apostrophe; breaks code and string literals.", replacement: "'" },
  '\u2019': { name: 'Right single quotation mark', kind: 'confusable', effect: "Looks like an apostrophe; the usual cause of a broken quoted string.", replacement: "'" },
  '\u201C': { name: 'Left double quotation mark', kind: 'confusable', effect: 'Looks like a double quote; invalid inside JSON.', replacement: '"' },
  '\u201D': { name: 'Right double quotation mark', kind: 'confusable', effect: 'Looks like a double quote; invalid inside JSON.', replacement: '"' },

  // ── dangerous: bidi controls (the Trojan Source class) ───────────────────────────────────
  '\u202A': { name: 'Left-to-right embedding', kind: 'dangerous', effect: 'Reorders how the text displays without changing its bytes.', replacement: '' },
  '\u202B': { name: 'Right-to-left embedding', kind: 'dangerous', effect: 'Reorders how the text displays without changing its bytes.', replacement: '' },
  '\u202D': { name: 'Left-to-right override', kind: 'dangerous', effect: 'Forces display order, so the text can read differently to a person than to a parser.', replacement: '' },
  '\u202E': { name: 'Right-to-left override', kind: 'dangerous', effect: 'Forces display order, so the text can read differently to a person than to a parser.', replacement: '' },
  '\u2066': { name: 'Left-to-right isolate', kind: 'dangerous', effect: 'Reorders display without changing the bytes.', replacement: '' },
  '\u2067': { name: 'Right-to-left isolate', kind: 'dangerous', effect: 'Reorders display without changing the bytes.', replacement: '' },
  '\u2068': { name: 'First strong isolate', kind: 'dangerous', effect: 'Reorders display without changing the bytes.', replacement: '' },
  '\u200E': { name: 'Left-to-right mark', kind: 'dangerous', effect: 'Invisible direction hint that survives copy and paste.', replacement: '' },
  '\u200F': { name: 'Right-to-left mark', kind: 'dangerous', effect: 'Invisible direction hint that survives copy and paste.', replacement: '' },
};

/**
 * Non-Latin letters that are pixel-identical to an ASCII one in most fonts, mapped to the letter
 * they impersonate.
 *
 * Confined to the characters that actually collide. The full Unicode confusables table is thousands
 * of entries and would report pairs nobody would ever mistake, which is how a security warning
 * becomes noise that gets clicked through.
 */
const HOMOGLYPHS: Record<string, { latin: string; script: string }> = {
  // Cyrillic
  '\u0430': { latin: 'a', script: 'Cyrillic' }, '\u0435': { latin: 'e', script: 'Cyrillic' },
  '\u043E': { latin: 'o', script: 'Cyrillic' }, '\u0440': { latin: 'p', script: 'Cyrillic' },
  '\u0441': { latin: 'c', script: 'Cyrillic' }, '\u0445': { latin: 'x', script: 'Cyrillic' },
  '\u0443': { latin: 'y', script: 'Cyrillic' }, '\u0456': { latin: 'i', script: 'Cyrillic' },
  '\u0455': { latin: 's', script: 'Cyrillic' }, '\u0458': { latin: 'j', script: 'Cyrillic' },
  '\u0410': { latin: 'A', script: 'Cyrillic' }, '\u0412': { latin: 'B', script: 'Cyrillic' },
  '\u0415': { latin: 'E', script: 'Cyrillic' }, '\u041A': { latin: 'K', script: 'Cyrillic' },
  '\u041C': { latin: 'M', script: 'Cyrillic' }, '\u041D': { latin: 'H', script: 'Cyrillic' },
  '\u041E': { latin: 'O', script: 'Cyrillic' }, '\u0420': { latin: 'P', script: 'Cyrillic' },
  '\u0421': { latin: 'C', script: 'Cyrillic' }, '\u0422': { latin: 'T', script: 'Cyrillic' },
  '\u0425': { latin: 'X', script: 'Cyrillic' },
  // Greek
  '\u03BF': { latin: 'o', script: 'Greek' }, '\u039F': { latin: 'O', script: 'Greek' },
  '\u0391': { latin: 'A', script: 'Greek' }, '\u0392': { latin: 'B', script: 'Greek' },
  '\u0395': { latin: 'E', script: 'Greek' }, '\u0396': { latin: 'Z', script: 'Greek' },
  '\u0397': { latin: 'H', script: 'Greek' }, '\u0399': { latin: 'I', script: 'Greek' },
  '\u039A': { latin: 'K', script: 'Greek' }, '\u039C': { latin: 'M', script: 'Greek' },
  '\u039D': { latin: 'N', script: 'Greek' }, '\u03A1': { latin: 'P', script: 'Greek' },
  '\u03A4': { latin: 'T', script: 'Greek' }, '\u03A5': { latin: 'Y', script: 'Greek' },
  '\u03A7': { latin: 'X', script: 'Greek' },
};

function codePointOf(ch: string): string {
  return 'U+' + (ch.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0');
}

/** Inspect `input` for characters that are invisible, impersonating, or reordering. */
export function detectInvisible(input: string): InvisibleReport {
  const findings: CharFinding[] = [];
  const counts: Record<FindingKind, number> = { invisible: 0, confusable: 0, dangerous: 0 };
  const scripts = new Set<string>();
  const samples: string[] = [];
  let hasLatin = false;
  let cleaned = '';

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;

    if (/[A-Za-z]/.test(ch)) hasLatin = true;

    const def = CHARS[ch];
    if (def) {
      findings.push({ index: i, char: ch, codePoint: codePointOf(ch), name: def.name, kind: def.kind, effect: def.effect, replacement: def.replacement });
      counts[def.kind]++;
      cleaned += def.replacement;
      continue;
    }

    const homo = HOMOGLYPHS[ch];
    if (homo) {
      findings.push({
        index: i,
        char: ch,
        codePoint: codePointOf(ch),
        name: `${homo.script} letter that renders as "${homo.latin}"`,
        kind: 'dangerous',
        effect: `Looks exactly like the ASCII letter "${homo.latin}" but is a different character.`,
        replacement: homo.latin,
      });
      counts.dangerous++;
      scripts.add(homo.script);
      if (!samples.includes(ch)) samples.push(ch);
      cleaned += homo.latin;
      continue;
    }

    cleaned += ch;
  }

  // A mix is only a spoof signal when Latin is one of the scripts present. Text written entirely in
  // Cyrillic is just Russian, and warning about it would be both wrong and insulting.
  const spoofRisk =
    hasLatin && scripts.size > 0 ? { scripts: ['Latin', ...[...scripts].sort()], samples } : null;

  return { findings, counts, cleaned, spoofRisk };
}
