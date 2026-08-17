// The craft gate — three ratchets holding the tool-craft doctrine in place.
//
// The doctrine says every tool should carry ONE thoughtful touch that comes from knowing what that
// tool's users are actually doing, and that the touch must not be bought with visual clutter.
// Measured 2026-08-11: 80 of 105 tools were a single self-closing tag with nothing of their own,
// and the 25 that did add something were also the most cluttered pages in the catalog. Both halves
// of that need holding, so both are gated here.
//
// Why ratchets rather than a rule in a document: every design rule this project has held in prose
// alone has drifted. 57% of tool descriptions broke their stated length ceiling, the tool header
// drew the one boundary the recipe forbids, and the design skill described a palette that had been
// replaced two phases earlier. Bytes, folds and query targeting are all held by numbers that only
// move one way, and that is the only kind of rule that has survived here.
//
//   1. COVERAGE   the fraction of tools declaring a craft. Only ever RISES.
//   2. WIRING     a declared craft whose id never reaches the DOM fails the build.
//   3. RESTRAINT  boxes and raw hex in tool widgets. Only ever FALL.
//
// Coverage is a RATIO and not a count, deliberately. A count would let a new tool ship with no
// craft at all (the count is unchanged, so the gate passes). A ratio drops when the catalog grows
// without craft, so "every new tool carries a thoughtful touch" enforces itself and nobody has to
// maintain a list of which tools are new.
//
// What this cannot do: tell a thoughtful touch from a thoughtless one. It checks that a
// declaration exists, that it renders, and that it cost no clutter. Whether the touch is WORTH
// having is a judgement, and it stays with .claude/skills/tool-craft/, the tool-crafter agent and
// the reviewer. Pretending otherwise would be the failure this doctrine argues against.
//
// Background: docs/analysis/2026-08-11-tool-craft.md
//
//   npm run check:craft              the gate (needs dist/ for the wiring check)
//   npm run check:craft -- --report  full per-tool listing plus the backlog, never fails

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { tools } from '../src/data/registry';
import { simulationTools } from '../src/lib/simulation/derived';
import { categories } from '../src/data/categories';
import type { CraftKind } from '../src/data/types';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const report = process.argv.includes('--report');

/**
 * The three thresholds, as measured today.
 *
 * coverage      2026-08-11  0.028 (3/105)  the encoding recovery seam (base64, url) + the
 *                                          word-counter goal, the catalog's one pre-existing
 *                                          touch that survives the tests in the doctrine
 *               2026-08-16  0.037 (4/106)  shell-quote-escalator ships with its orientation line,
 *                                          the first tool built craft-first rather than retrofitted
 *               2026-08-16  0.046 (5/107)  systemd-timer-converter ships with its divergence check
 * boxesPerTool  2026-08-11  8 → 7          word-counter's goal card and insight tiles went inline
 * rawHex        2026-08-11  11 → 9         word-counter's #d97706 state was removed, not retinted
 *
 * `boxesPerTool` is the WORST SINGLE WIDGET, not a catalog total, and the distinction matters. A
 * total falls as the catalog grows only if tools get plainer, so it would flag a new tool for a
 * legitimate <input> border while missing the actual failure mode, which is one page quietly
 * becoming a control panel. The worst-case shape is the same one check-budget and fold.spec use.
 *
 * Raise `coverage` in the same commit as the craft that earns it; lower the other two in the same
 * commit as the cleanup that earns it. Never move one to make a build pass: a coverage drop means
 * a tool shipped with nothing of its own, and a box rise means craft was bought with clutter.
 */
const THRESHOLDS = {
  // 2026-08-17: 0.149 (16/107), from 0.046 (5/107). Two engine seams, not eleven touches, which is
  // the only way this backlog moves without multiplying widgets:
  //   hashing (5)          a `compare` verb + DigestMatch. Each hasher supplies its own digest
  //                        length, so a 40-character paste is named as SHA-1 rather than reported
  //                        as a mismatch — the failure that sends people re-downloading good files.
  //   structured-data (6)  a `repair` resolver + one button. Each processor declares whether ITS
  //                        input is JSON, so csv-to-json and yaml-to-json render nothing at all.
  // Plus 2 declarations of touches that were already built and simply undeclared: the JWT live
  // validity panel and the contrast checker's suggest-a-passing-colour button. Both pass the four
  // doctrine tests and both were already silent-until-needed; only `craft:` and a data-craft
  // attribute were missing. Recorded separately because declaring is not building, and a coverage
  // number that blurs the two would mislead the next person reading it. 18/107 = 0.168.
  coverage: 0.168,
  boxesPerTool: 7,
  rawHex: 9,
};

/** Simulations are excluded from the universe: they are a separate platform whose every surface is
 *  derived from a manifest, with their own content gate (seo:gate:sim). Craft is a property of the
 *  105 widget-backed tools. */
const simSlugs = new Set(simulationTools.map(t => t.slug));
const craftable = tools.filter(t => !simSlugs.has(t.slug));

const errors: string[] = [];
const notes: string[] = [];

// ── 1. Coverage ───────────────────────────────────────────────────────────────
const withCraft = craftable.filter(t => t.craft);
const coverage = craftable.length ? withCraft.length / craftable.length : 0;

if (coverage < THRESHOLDS.coverage) {
  errors.push(
    `craft coverage ${(coverage * 100).toFixed(1)}% (${withCraft.length}/${craftable.length}) is below the floor ` +
    `${(THRESHOLDS.coverage * 100).toFixed(1)}%.\n` +
    `      A drop usually means a tool was added without one. Every new tool ships a thoughtful touch:\n` +
    `      see .claude/skills/tool-craft/SKILL.md. Never lower the floor to get past this.`,
  );
}

// Ids are the contract between config.ts and the DOM, so a duplicate would make the wiring check
// pass for the wrong tool.
const seen = new Map<string, string>();
for (const t of withCraft) {
  const id = t.craft!.id;
  const prior = seen.get(id);
  if (prior) errors.push(`craft id "${id}" is used by both ${prior} and ${t.slug}. Ids must be unique.`);
  else seen.set(id, t.slug);
}

// A `solves` that says nothing is the failure mode the field exists to prevent.
for (const t of withCraft) {
  const solves = t.craft!.solves.trim();
  if (solves.length < 40) {
    errors.push(
      `${t.slug}: craft.solves is too short to name a real failure ("${solves}").\n` +
      `      State the concrete way a person fails at this tool today, not that it "improves usability".`,
    );
  }
}

// ── 2. Wiring: the declaration must reach the DOM ─────────────────────────────
const distDir = join(repoRoot, 'dist');
if (!existsSync(distDir)) {
  notes.push('dist/ not found, so the wiring check was skipped. Run `npm run build` first.');
} else {
  for (const t of withCraft) {
    const category = categories.find(c => c.slug === t.categorySlug);
    const segment = category?.segment ?? t.categorySlug;
    const page = join(distDir, 'tool', segment, t.slug, 'index.html');
    if (!existsSync(page)) {
      errors.push(`${t.slug}: declares craft but no built page was found at ${page}.`);
      continue;
    }
    const html = readFileSync(page, 'utf8');
    if (!html.includes(`data-craft="${t.craft!.id}"`)) {
      errors.push(
        `${t.slug}: declares craft "${t.craft!.id}" but its built page carries no ` +
        `[data-craft="${t.craft!.id}"].\n` +
        `      The declaration and the affordance must not drift apart: render the element, or ` +
        `remove the declaration.`,
      );
    }
  }
}

// ── 3. Restraint: craft may not be bought with clutter ────────────────────────
// Scope is per-tool widgets, which is where clutter accretes one tool at a time. The shared engine
// widgets are platform surfaces reviewed as a unit and are not counted here.
const widgetFiles = execSync('ls src/tools/*/*/Widget.astro', { cwd: repoRoot })
  .toString().trim().split('\n').filter(Boolean);

let boxes = 0;
let rawHex = 0;
const boxOffenders: Record<string, number> = {};
const hexOffenders: Record<string, string[]> = {};

for (const rel of widgetFiles) {
  const src = readFileSync(join(repoRoot, rel), 'utf8');

  // A "box" is a rule that draws a filled or bordered card. R2: a page that already has two panels
  // does not need a third rectangle to hold one sentence.
  const b = (src.match(/border:\s*1px solid var\(--color-border\)/g) ?? []).length
    + (src.match(/var\(--color-surface-raised\)/g) ?? []).length;
  if (b) { boxes += b; boxOffenders[rel] = b; }

  // R4: every colour comes from a token. Only <style> blocks count, because a colour tool
  // legitimately carries hex as a default VALUE in its markup and script.
  for (const block of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    // Comments are prose, not style. A note explaining which hardcoded colour was removed must not
    // itself count as a hardcoded colour.
    const css = (block[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
    const hits = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    if (hits.length) {
      rawHex += hits.length;
      (hexOffenders[rel] ??= []).push(...hits);
    }
  }
}

const ranked = Object.entries(boxOffenders).sort((a, b) => b[1] - a[1]);
const worst = ranked[0];
const worstBoxes = worst ? worst[1] : 0;

if (worstBoxes > THRESHOLDS.boxesPerTool) {
  const worst = ranked.filter(([, n]) => n > THRESHOLDS.boxesPerTool)
    .map(([f, n]) => `        ${n}  ${f}`).join('\n');
  errors.push(
    `a tool widget draws ${worstBoxes} boxes, above the per-tool ceiling ${THRESHOLDS.boxesPerTool}.\n` +
    `      A craft touch is a control plus a label, inline. Compose from IoPanel, ToolActions,\n` +
    `      StatCard or a <details> drawer instead of adding a bordered card.\n${worst}`,
  );
}

if (rawHex > THRESHOLDS.rawHex) {
  const worst = Object.entries(hexOffenders).slice(0, 5)
    .map(([f, h]) => `        ${h.join(' ')}  ${f}`).join('\n');
  errors.push(
    `raw hex colours in tool widget styles rose to ${rawHex}, above the ceiling ${THRESHOLDS.rawHex}.\n` +
    `      Every colour comes from src/styles/tokens.css.\n${worst}`,
  );
}

// ── Output ────────────────────────────────────────────────────────────────────
const byKind = withCraft.reduce<Record<string, number>>((acc, t) => {
  const k = t.craft!.kind as CraftKind;
  acc[k] = (acc[k] ?? 0) + 1;
  return acc;
}, {});

console.log('\n[check-craft] tool craft coverage\n');
console.log(`  tools with a declared craft   ${withCraft.length}/${craftable.length}  (${(coverage * 100).toFixed(1)}%, floor ${(THRESHOLDS.coverage * 100).toFixed(1)}%)`);
console.log(`  boxes, worst single widget    ${worstBoxes}  (ceiling ${THRESHOLDS.boxesPerTool}${worst ? `, ${worst[0].replace('src/tools/', '')}` : ''})`);
console.log(`  boxes, catalog total          ${boxes}  (informational, not gated)`);
console.log(`  raw hex in widget styles      ${rawHex}  (ceiling ${THRESHOLDS.rawHex})`);
if (withCraft.length) {
  console.log(`  by kind                       ${Object.entries(byKind).map(([k, n]) => `${k} ${n}`).join(', ')}`);
}

if (report) {
  console.log('\n  declared:');
  for (const t of withCraft) {
    console.log(`    ${t.slug}  [${t.craft!.kind}] ${t.craft!.id}`);
    console.log(`      ${t.craft!.solves}`);
  }
  const without = craftable.filter(t => !t.craft);
  console.log(`\n  no craft yet (${without.length}) — the backlog, ranked in docs/analysis/2026-08-11-tool-craft.md section 8:`);
  const byEngine = without.reduce<Record<string, string[]>>((acc, t) => {
    (acc[t.engine ?? 'none'] ??= []).push(t.slug);
    return acc;
  }, {});
  for (const [engine, slugs] of Object.entries(byEngine).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ${engine.padEnd(18)} ${slugs.length.toString().padStart(3)}  ${slugs.slice(0, 4).join(', ')}${slugs.length > 4 ? ', …' : ''}`);
  }
}

for (const n of notes) console.log(`\n  note: ${n}`);

if (errors.length) {
  console.error(`\n[check-craft] ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\n  Fix the cause. Never weaken a threshold to get past it.\n');
  process.exit(report ? 0 : 1);
}

console.log('\n[check-craft] OK\n');
