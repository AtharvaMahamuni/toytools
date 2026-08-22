// Random name picker strategy.
//
// A pasted list, one name per line, and an unbiased draw from it. Drawing without replacement is
// the default because the job it is nearly always doing (a standup order, three raffle winners, who
// presents next) breaks the moment a name comes out twice.
//
// The craft (`name-duplicates`) is the failure this tool cannot avoid on its own. Lists arrive
// pasted from a spreadsheet, a chat thread or an attendance sheet, and a name that appears twice
// quietly gets two chances in a draw everybody was told was fair. The tool can see that, so it says
// so, names who it favours, and offers the one-tap fix. Clean lists get nothing at all.

import type { Generator, GenerationResult, GeneratorOptions, GenerationNote } from '../types';
import { shuffle } from '../utils';

const MAX_NAMES = 2000;
const MAX_PICKS = 100;

const SAMPLE = ['Ana', 'Ben', 'Chidi', 'Dara', 'Eli', 'Farah'].join('\n');

/** Split a pasted block into names: one per line, blanks dropped, surrounding space trimmed. */
export function parseNames(raw: string): string[] {
  return String(raw ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_NAMES);
}

export interface DuplicateReport {
  /** Names appearing more than once, most repeated first, with their count. */
  repeats: { name: string; count: number }[];
  /** Total extra entries beyond one per distinct name. */
  extra: number;
  /** The list with repeats collapsed, first spelling and first position kept. */
  deduped: string[];
}

/** Find names that occupy more than one slot. Case- and space-insensitive, because "ana " and
 *  "Ana" are the same person to everybody except a string comparison. */
export function findDuplicates(names: string[]): DuplicateReport {
  const counts = new Map<string, { name: string; count: number }>();
  const deduped: string[] = [];
  for (const name of names) {
    const key = name.toLowerCase().replace(/\s+/g, ' ').trim();
    const seen = counts.get(key);
    if (seen) {
      seen.count += 1;
    } else {
      counts.set(key, { name, count: 1 });
      deduped.push(name);
    }
  }
  const repeats = [...counts.values()].filter((c) => c.count > 1).sort((a, b) => b.count - a.count);
  return { repeats, extra: names.length - deduped.length, deduped };
}

/** Say who the list is quietly favouring, or nothing when it favours nobody. */
export function duplicateNote(names: string[]): GenerationNote | undefined {
  const { repeats, extra, deduped } = findDuplicates(names);
  if (!repeats.length) return undefined;

  const top = repeats[0];
  const others = repeats.length - 1;
  const who =
    others === 0
      ? `${top.name} is on the list ${top.count} times`
      : `${top.name} is on the list ${top.count} times, and ${others} other ${others === 1 ? 'name is' : 'names are'} repeated too`;

  return {
    text: `${who}, so ${top.name} has ${top.count} chances in ${names.length} while everyone else has 1.`,
    fix: {
      label: extra === 1 ? 'Remove 1 duplicate' : `Remove ${extra} duplicates`,
      field: 'names',
      value: deduped.join('\n'),
    },
  };
}

export const namePicker: Generator = {
  id: 'name-picker',
  family: 'chance',
  autoGenerate: true,
  live: false,
  notes: true,
  fields: [
    {
      id: 'names',
      label: 'Names',
      type: 'textarea',
      default: SAMPLE,
      rows: 8,
      placeholder: 'One name per line',
      help: 'Paste a list. One name per line; blank lines are ignored.',
    },
    {
      id: 'count',
      label: 'How many to pick',
      type: 'number',
      default: 1,
      min: 1,
      max: MAX_PICKS,
      step: 1,
    },
    {
      id: 'unique',
      label: 'Never pick the same slot twice',
      type: 'boolean',
      default: true,
      help: 'Off means every pick is drawn from the whole list again, so a name can repeat.',
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const names = parseNames(String(opts.names ?? ''));
    if (!names.length) {
      return { ok: false, kind: 'text', error: 'Add at least one name, one per line.' };
    }

    const unique = opts.unique !== false;
    const requested = Math.max(1, Math.min(MAX_PICKS, Math.round(Number(opts.count) || 1)));
    const count = unique ? Math.min(requested, names.length) : requested;

    let picks: string[];
    if (unique) {
      picks = shuffle([...names]).slice(0, count);
    } else {
      const pool = [...names];
      picks = Array.from({ length: count }, () => shuffle(pool)[0]);
    }

    const lines = count === 1 ? picks : picks.map((n, i) => `${i + 1}. ${n}`);

    const meta = [
      { label: 'Names', value: String(names.length) },
      { label: 'Picked', value: String(count) },
      { label: 'Each name', value: `1 in ${names.length}` },
    ];
    if (unique && requested > names.length) {
      meta.push({ label: 'Capped', value: `list holds ${names.length}` });
    }

    return {
      ok: true,
      kind: 'lines',
      lines,
      text: lines.join('\n'),
      meta,
      note: duplicateNote(names),
    };
  },
};
