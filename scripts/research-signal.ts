// `npm run research:signal` — append one OBSERVED engagement signal to a seed record.
//
// This is the whole engagement-to-evidence loop, as one command. The x-content skill has always
// said "write it into research/datasets/*.json as evidence and re-run", but until the `signals`
// field existed there was nowhere for an observation to go except the `demand` number, and a
// hand-raised `demand` is indistinguishable from a researched one a month later. This writes the
// structured record instead: what was seen, when, where, and how strongly it argues the need is
// real.
//
//   npm run research:signal -- --tool csv-diff --kind x-probe --strength 60 \
//     --observation "Three replies described diffing semicolon-delimited exports by eye." \
//     --url https://x.com/...
//
//   npm run research:signal -- --tool csv-diff --list     # what is already recorded
//
// It refuses to write anything the validator would reject, and it re-validates every dataset after
// writing, so a bad signal fails here rather than at the next `npm run research`.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDatasets } from './research-lib';
import { REPORT_PATHS } from '../src/lib/research/config';
import { ENGAGEMENT_SIGNAL_KINDS } from '../src/lib/research/constants';
import { validateDatasets } from '../src/lib/research/validate';
import type { EngagementSignal, SeedRecord } from '../src/lib/research/models/provider';

interface Args {
  tool?: string;
  kind?: string;
  strength?: string;
  observation?: string;
  url?: string;
  date?: string;
  list?: boolean;
  help?: boolean;
}

const args = parseArgs(process.argv.slice(2));

if (args.help || (!args.tool && !args.list)) usage();

const { datasets, errors: loadErrors } = loadDatasets();
if (loadErrors.length) fail(loadErrors);

// Find which dataset file owns the record. Proposed tools are unique across datasets (the validator
// enforces it), so the first match is the only match.
const found = locate(args.tool!);
if (!found) {
  fail([
    `No seed record proposes "${args.tool}".\n` +
      'A signal attaches to evidence that already exists: if this is a need we have not written up\n' +
      'yet, add the record to the right research/datasets/<domain>.json first, then record the\n' +
      'signal against it. An observation with no problem statement behind it is a note, not evidence.',
  ]);
}

const { file, record } = found;

if (args.list) {
  const sigs = record.signals ?? [];
  console.log(`\n[research:signal] ${record.proposedTool}  (${file})\n`);
  if (!sigs.length) {
    console.log('  no observed signals yet - this record rests on desk research alone.\n');
  } else {
    for (const s of sigs) {
      console.log(`  ${s.date}  ${s.kind.padEnd(15)} strength ${String(s.strength).padStart(3)}  ${s.observation}`);
      if (s.url) console.log(`              ${s.url}`);
    }
    console.log('');
  }
  process.exit(0);
}

const signal = buildSignal();
const updated: SeedRecord = { ...record, signals: [...(record.signals ?? []), signal] };

// Validate the WHOLE dataset with the new signal in place, using the same validator the pipeline
// runs. A CLI with its own looser rules would be a second source of truth for the schema.
const patched = datasets.map(ds => ({
  ...ds,
  records: ds.records.map(r => (r.proposedTool === record.proposedTool ? updated : r)),
}));
const errors = validateDatasets(patched);
if (errors.length) fail(['The signal would make the datasets invalid, so nothing was written:', ...errors]);

writeSignal(file, record.proposedTool, signal);

console.log(`\n[research:signal] recorded against ${record.proposedTool} in ${file}:`);
console.log(`  ${signal.date}  ${signal.kind}  strength ${signal.strength}`);
console.log(`  ${signal.observation}`);
console.log('\n  This raises confidence, not the score. Re-run `npm run research:report` to fold it in.\n');

// ── helpers ───────────────────────────────────────────────────────────────────

function buildSignal(): EngagementSignal {
  const kind = args.kind ?? '';
  if (!ENGAGEMENT_SIGNAL_KINDS.includes(kind as EngagementSignal['kind'])) {
    fail([`--kind must be one of: ${ENGAGEMENT_SIGNAL_KINDS.join(', ')} (got "${kind}")`]);
  }
  const strength = Number(args.strength);
  if (!Number.isFinite(strength) || strength < 0 || strength > 100) {
    fail(['--strength must be a number 0-100: how strongly this ONE observation argues the need is real.']);
  }
  const observation = (args.observation ?? '').trim();
  if (observation.length < 15) {
    fail([
      '--observation must say what was actually seen.\n' +
        '"did well" is not an observation; "three replies described diffing semicolon exports by\n' +
        'eye" is. The first is a mood, and a month later it is indistinguishable from research.',
    ]);
  }
  const date = args.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(['--date must be YYYY-MM-DD']);

  return {
    kind: kind as EngagementSignal['kind'],
    date,
    observation,
    strength: Math.round(strength),
    ...(args.url ? { url: args.url } : {}),
  };
}

function locate(tool: string): { file: string; record: SeedRecord } | null {
  for (const ds of datasets) {
    const record = ds.records.find(r => r.proposedTool === tool);
    if (record) return { file: `${ds.domain}.json`, record };
  }
  return null;
}

/**
 * Append the signal by INSERTING text, leaving every other byte of the file untouched.
 *
 * Two implementations were tried and rejected first, and both failures are worth recording because
 * both looked correct:
 *
 *   `JSON.stringify(..., 2)` expands every short keyword array onto its own lines, so adding one
 *   signal produced a 263-line diff on developer.json. Evidence nobody can review line by line is
 *   not much better than evidence with no provenance, which is the problem this field exists to fix.
 *
 *   A re-serializer matching the house style needed a rule for when an array stays on one line, and
 *   the corpus does not have one: `solutionWeaknesses` is inline at 180 characters while
 *   `userFailures` is expanded at 28, so the split is per-key habit, not per-content. A key
 *   allowlist would have gone stale at the first new field, exactly as CLAUDE.md warns.
 *
 * Splicing sidesteps the question entirely: the file's existing formatting is whatever it already
 * was, because nothing rewrites it. `assertAdditive` then proves that claim on every write.
 */
function writeSignal(fileName: string, tool: string, sig: EngagementSignal): void {
  const path = join(REPORT_PATHS.datasets, fileName);
  const before = readFileSync(path, 'utf8');
  const after = spliceSignal(before, tool, sig);

  assertAdditive(fileName, before, after);
  // Re-parse the result and check it says exactly what we meant. A splice that produced valid-looking
  // text with the signal on the wrong record would be a silent evidence corruption.
  const reparsed = JSON.parse(after) as { records: SeedRecord[] };
  const target = reparsed.records.find(r => r.proposedTool === tool);
  const landed = target?.signals?.[target.signals.length - 1];
  if (!landed || landed.observation !== sig.observation || landed.date !== sig.date) {
    fail([`The signal did not land on ${tool} as written. Nothing was saved.`]);
  }

  writeFileSync(path, after);
}

/**
 * Every line of `before` still present, in order, in `after`. Adding a signal only ever adds lines
 * (plus one trailing comma on the property it follows), so anything else means the splice moved
 * something, and a reviewer would have to hunt for the one change that matters.
 */
function assertAdditive(fileName: string, before: string, after: string): void {
  const newLines = after.split('\n');
  let i = 0;
  const lost: string[] = [];
  for (const line of before.split('\n')) {
    // The property the signals block follows gains a comma; that is the one permitted edit.
    const at = indexOfEither(newLines, line, line.replace(/(\S)$/, '$1,'), i);
    if (at === -1) lost.push(line.trim().slice(0, 70));
    else i = at + 1;
  }
  if (lost.length) {
    fail([
      `Writing to ${fileName} would rewrite ${lost.length} existing line(s), not just add the signal.\n` +
        `Nothing was written. First changed line: ${lost[0]}`,
    ]);
  }
}

function indexOfEither(lines: string[], a: string, b: string, from: number): number {
  const i = lines.indexOf(a, from);
  const j = lines.indexOf(b, from);
  if (i === -1) return j;
  if (j === -1) return i;
  return Math.min(i, j);
}

/** Insert the signal into the record's own `signals` array, creating the array if it has none. */
function spliceSignal(text: string, tool: string, sig: EngagementSignal): string {
  const span = recordSpan(text, tool);
  const record = text.slice(span.start, span.end);
  const indent = propertyIndent(record);

  const existing = record.match(/\n(\s*)"signals":\s*\[/);
  if (existing) {
    // Append to the array that is already there, after its last element.
    const arrayStart = span.start + existing.index! + existing[0].length;
    const arrayEnd = matchingBracket(text, arrayStart - 1, '[', ']');
    const body = text.slice(arrayStart, arrayEnd).trim();
    const entry = renderSignal(sig, indent + '  ');
    const joined = body ? `${text.slice(arrayStart, arrayEnd).replace(/\s*$/, '')},\n${entry}\n${indent}` : `\n${entry}\n${indent}`;
    return text.slice(0, arrayStart) + joined + text.slice(arrayEnd);
  }

  // No signals array yet: add the property last, so the diff is a clean block at the end of the
  // record rather than an insertion in the middle of somebody's carefully ordered evidence.
  const closeBrace = span.end - 1;
  const beforeClose = text.slice(span.start, closeBrace).replace(/\s*$/, '');
  const block = `${beforeClose},\n${indent}"signals": [\n${renderSignal(sig, indent + '  ')}\n${indent}]\n${indentOf(text, span.start)}`;
  return text.slice(0, span.start) + block + text.slice(closeBrace);
}

function renderSignal(sig: EngagementSignal, pad: string): string {
  const inner = pad + '  ';
  const lines = [
    `${inner}"kind": ${JSON.stringify(sig.kind)},`,
    `${inner}"date": ${JSON.stringify(sig.date)},`,
    `${inner}"observation": ${JSON.stringify(sig.observation)},`,
    `${inner}"strength": ${sig.strength}${sig.url ? ',' : ''}`,
  ];
  if (sig.url) lines.push(`${inner}"url": ${JSON.stringify(sig.url)}`);
  return `${pad}{\n${lines.join('\n')}\n${pad}}`;
}

/** Indentation of the record's own properties, read off the record rather than assumed. */
function propertyIndent(record: string): string {
  return record.match(/\n(\s*)"/)?.[1] ?? '      ';
}

/** Indentation of the line the record's opening brace sits on. */
function indentOf(text: string, index: number): string {
  const lineStart = text.lastIndexOf('\n', index) + 1;
  return text.slice(lineStart, index).match(/^\s*/)?.[0] ?? '    ';
}

/**
 * The `{ ... }` span of the record proposing `tool`, found by brace-matching with string awareness
 * rather than by regex: a record contains braces inside its `latent` block and quotes inside its
 * prose, and a pattern that ignored either would cut the record in the wrong place.
 */
function recordSpan(text: string, tool: string): { start: number; end: number } {
  const marker = text.indexOf(`"proposedTool": ${JSON.stringify(tool)}`);
  if (marker === -1) fail([`Could not locate "${tool}" in the file to insert into. Nothing written.`]);

  const stack: number[] = [];
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') stack.push(i);
    else if (c === '}') {
      const start = stack.pop();
      // The record is the innermost object that closes after the marker while having opened before
      // it: `latent` opens after the marker, so it is popped first and correctly skipped.
      if (start !== undefined && start < marker && i > marker) return { start, end: i + 1 };
    }
  }
  return fail([`Could not find the record boundaries for "${tool}". Nothing written.`]);
}

/** Index of the bracket matching the one at `open`, string-aware. */
function matchingBracket(text: string, open: number, openCh: string, closeCh: string): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === openCh) depth++;
    else if (c === closeCh && --depth === 0) return i;
  }
  return fail(['Unbalanced brackets in the dataset file. Nothing written.']);
}

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') out.list = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else if (a.startsWith('--')) {
      // Consume every following token up to the next flag, not just one. `npm run x -- --observation
      // "two words"` reaches this script as two separate argv entries because npm drops the quotes,
      // so reading a single token would silently truncate an observation to its first word - and the
      // 15-character check would then reject a perfectly good one with a misleading message.
      const key = a.slice(2) as keyof Args;
      const words: string[] = [];
      while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) words.push(argv[++i]);
      if (words.length === 0) continue;
      (out as Record<string, string>)[key] = words.join(' ');
    }
  }
  return out;
}

function usage(): never {
  console.log(`
Record one observed engagement signal against an existing seed record.

  npm run research:signal -- --tool <slug> --kind <kind> --strength <0-100> \\
    --observation "what was actually seen" [--url <link>] [--date YYYY-MM-DD]

  npm run research:signal -- --tool <slug> --list

  --kind   ${ENGAGEMENT_SIGNAL_KINDS.join(' | ')}

Signals raise CONFIDENCE, never finalScore. A post doing well is not search volume, and one probe
is not a dataset - see src/lib/research/scorers/corroboration.ts.
`);
  process.exit(0);
}

/** One entry = one error. Embedded newlines are continuation lines of that same error, not new ones. */
function fail(errors: string[]): never {
  console.error('[research:signal] cannot record:');
  for (const e of errors) {
    const [first, ...rest] = e.split('\n');
    console.error(`  ✗ ${first}`);
    for (const line of rest) console.error(`    ${line}`);
  }
  process.exit(1);
}
