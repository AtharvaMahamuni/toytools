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
 *               2026-08-20  7 → 4          the catalog-wide flattening: .io-panel stopped drawing a
 *                                          frame round an already-filled field, and the container
 *                                          boxes in 15 widgets became fills. Controls kept their
 *                                          edges, so what is left is affordance, not decoration
 * dividers      2026-08-20  new, at 0      every border-top/bottom in a widget was a section rule or a
 *                                          ledger hairline; all removed, so the floor is zero and any
 *                                          new one fails. Scope widened to _shared at the same time.
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
  //   structured-data (5)  a `repair` resolver + one button. Each processor declares whether ITS
  //                        input is JSON, so csv-to-json and yaml-to-json render nothing at all.
  //                        json-tree-viewer is JSON-input but is a bespoke 32 KB widget rather than
  //                        StructuredDataWidget, so the shared button never reaches it. Declaration
  //                        removed rather than half-wired; it stays on the backlog.
  // Plus 2 declarations of touches that were already built and simply undeclared: the JWT live
  // validity panel and the contrast checker's suggest-a-passing-colour button. Both pass the four
  // doctrine tests and both were already silent-until-needed; only `craft:` and a data-craft
  // attribute were missing. Recorded separately because declaring is not building, and a coverage
  // number that blurs the two would mislead the next person reading it.
  // Plus password-generator: its exclude-ambiguous option already rendered too, and generator craft
  // is an option rather than a panel, so GeneratorField gained an optional craft marker. 19/107.
  //   text-analysis (8)    a `textNotice` resolver + one line in TextMetricWidget. Three bare
  //                        wrappers gained it; five already rendered their own depth panel and only
  //                        needed declaring (space-counter has reported trailing whitespace all
  //                        along, which is the exact failure its knowledge file records).
  // 2026-08-18: 0.299 (32/107), from 0.242 (26/107). The calculator seam: six bespoke widgets on
  //   an engine that had no browser runtime at all, given one so the rules could be unit tested
  //   rather than copied into six inline scripts. Each names the arithmetic its own knowledge file
  //   records as the mistake, and each is silent unless the input exhibits it.
  // 2026-08-18: 0.327 (35/107). The units seam: three bespoke converters, each given the one thing
  //   its own knowledge file says goes wrong one step PAST the conversion, in what the number is
  //   about to be used for. All three are silent on values that already divide cleanly.
  // 2026-08-18: 0.355 (38/107). The last three bespoke widgets, which share nothing but a shape:
  //   color-format-converter  eight-digit hex, where CSS and Android disagree about byte order
  //   text-compare            how much of a diff is whitespace nobody can see
  //   keep-screen-awake       DECLARED, not built: the status line has been derived from the live
  //                           sentinel since the tool shipped. Recorded as a declaration because
  //                           declaring is not building.
  // 2026-08-18: 0.514 (55/107). The text-processor seam, the largest single move this ratchet has
  //   made. Reading the eighteen knowledge files together showed one shared failure, not eighteen:
  //   "this is not the tool you wanted". These tools are one paste apart and near-identical from a
  //   listing, so somebody lands on the wrong one and leaves with a correct-looking half-done job.
  //   One rule per processor, rendered once in TextProcessorWidget. 17 tools; `uppercase` has no
  //   honest rule and gets nothing.
  // 2026-08-18: 0.598 (64/107). The wellness seam. Every result on this engine already carried a
  //   standing caution ("these are estimates from a formula") on EVERY result, which is exactly why
  //   nobody reads them. Each rule here fires only when this input has landed where the model is
  //   weakest, and states the cost as a number. 9 tools; macro and body-fat get nothing, the latter
  //   because its sensitivity barely varies with the input and a rule would be a disclaimer.
  // 2026-08-21: 0.601 (65/108). encoding-detector ships with its chain note. A decode that succeeds
  //   and returns something still encoded is indistinguishable from a corrupt one, so the tool says
  //   the value is wrapped twice and offers the next peel rather than leaving the user to guess.
  // 2026-08-21: 0.605 (66/109). invisible-character-detector ships with its script-mix warning. A
  //   Cyrillic letter that renders as its ASCII twin passes every visual review, so pointing at the
  //   character is not enough: the reader is told the text mixes scripts and that this is a
  //   technique rather than a typo. It stays silent for text that is simply not Latin.
  // 2026-08-22: 0.635 (75/118). Nine tools shipped craft-first rather than retrofitted, on two new
  //   seams and two bespoke widgets:
  //   generation (4)   a `note` verb on GenerationResult plus the shared CraftNote. Chance tools
  //                    all fail the same way and each for its own reason: a coin run looks rigged, a
  //                    dice total says nothing about whether it was good, a duplicated name buys
  //                    somebody two tickets, and a comma-separated line is one option pretending to
  //                    be five. Each generator answers with a number or a fix and returns nothing
  //                    when it has nothing to say.
  //   encoding (3)     three more `recover` implementations on the existing seam. Roman numerals
  //                    arrive additive off clock faces, amounts arrive wearing a currency symbol,
  //                    and binary arrives with a 0b prefix or spaced nibbles.
  //   bespoke (2)      text-repeater measures the output before building it, since the copy count
  //                    is one keystroke from a multi-megabyte string; character-map carries the
  //                    escape forms next to the glyph, because copying the character is not where
  //                    the task ends.
  // 2026-08-30: 0.638 (76/119). equalizer-settings-generator ships with its preamp guardrail. An EQ
  //   curve built out of boosts pushes a player past full scale, and the crackle that follows gets
  //   blamed on the headphones; the preamp cut that fixes it is a control on another screen that
  //   nothing labels as the fix. The line names the peak boost and the matching cut, and offers to
  //   scale the boosts down when they are large enough to be worth it. Silent under +3 dB.
  coverage: 0.638,
  boxesPerTool: 4,
  /** border-top/bottom inside a widget. Zero: space separates, lines do not. */
  dividers: 0,
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
// Scope is every widget surface, per-tool AND shared. Excluding the shared ones was the loophole
// that let three tracker tools keep outlined panels and jwt-decoder keep eight boxes through a
// release that claimed to have flattened the catalog: a box in _shared reaches every tool built on
// it, so it is the last place that should go uncounted.
const widgetFiles = execSync(
  'ls src/tools/*/*/Widget.astro src/tools/_shared/*.astro src/tools/_shared/*/*.astro',
  { cwd: repoRoot },
).toString().trim().split('\n').filter(Boolean);

let boxes = 0;
let dividers = 0;
let rawHex = 0;
const boxOffenders: Record<string, number> = {};
const dividerOffenders: Record<string, number> = {};
const hexOffenders: Record<string, string[]> = {};

for (const rel of widgetFiles) {
  const src = readFileSync(join(repoRoot, rel), 'utf8');

  // A "box" is a rule that draws a filled or bordered card. R2: a page that already has two panels
  // does not need a third rectangle to hold one sentence.
  //
  // Deliberately still only this spelling. Widening it to `var(--border)` was tried and reverted:
  // an all-round border says nothing about whether it wraps a card or a button, so the broader
  // count just flagged json-tree-viewer for owning six controls, which the design rules expressly
  // allow. A number that rises with control density is not measuring clutter. The precise signal
  // for the thing that actually regressed is `dividers` below.
  const b = (src.match(/border:\s*1px solid var\(--color-border\)/g) ?? []).length
    + (src.match(/var\(--color-surface-raised\)/g) ?? []).length;
  if (b) { boxes += b; boxOffenders[rel] = b; }

  // A horizontal rule inside a widget is a separator: between two sections, or between the rows of
  // a ledger. Space does that job, so the count is held at zero. Deliberately only top/bottom --
  // a `border-left` is an indent guide (the JSON tree) or an accent stripe (the insight callout),
  // which marks something rather than dividing it. That is a structural distinction, not a path
  // allowlist, so it does not go stale the way an exemption list does.
  const d = (src.match(/border-(?:top|bottom):\s*(?:var\(--border\)|\d+px solid)/g) ?? []).length;
  if (d) { dividers += d; dividerOffenders[rel] = d; }

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

if (dividers > THRESHOLDS.dividers) {
  const worst = Object.entries(dividerOffenders)
    .map(([f, n]) => `        ${n}  ${f}`).join('\n');
  errors.push(
    `widgets draw ${dividers} separator rule(s), above the ceiling ${THRESHOLDS.dividers}.\n` +
    `      A border-top or border-bottom inside a widget is a line doing what space should do:\n` +
    `      between two sections, or between the rows of a ledger. Delete the rule and let the\n` +
    `      margin separate them, remembering that between-group space has to beat within-group\n` +
    `      space. An edge round a control stays; see the ui-design-system skill.\n${worst}`,
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
console.log(`  separator rules in widgets    ${dividers}  (ceiling ${THRESHOLDS.dividers})`);
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
