// The engine gate — engine SHAPE and engine RELATIONSHIPS, which nothing else measured.
//
// The other validators check that declared references resolve (validate-registry) and that nothing
// on disk is unwired (validate-architecture). Neither has an opinion about the shape of the engine
// layer itself: how many engines a category carries, how much widget reuse there is, or which
// engines are connected to which. That last one is derived and rendered on /architecture/ as dotted
// Mermaid links, and has been since the page was built, but a picture is not a check. An engine
// could drift into total isolation, or two could fuse into a mesh, and every gate stayed green.
//
// So this prints the shape as a table you can diff, and holds two numbers as ratchets.
//
// WHY THESE TWO:
//
//   ISOLATED ENGINES — an engine with no cross-engine edge at all is a subject nothing on the site
//     links to. Sometimes that is honest (finance genuinely stands alone). Usually it means a tool
//     set shipped without anyone asking what it sits next to, which is how a whole category becomes
//     a dead end for a reader. It is a ceiling, so it can only fall.
//
//   BESPOKE ENGINES — engines with no shared widget. Legitimate (see BESPOKE_ENGINES in
//     src/lib/engines/contract.test.ts), but it is the number that quietly grows: each one is a
//     self-contained widget that "happens to share subject matter", and the sixth is usually a real
//     engine that owes the contract file a block. Ceiling, falls only.
//
// Coupling itself is deliberately NOT gated. A sparse graph is the goal (28 of 210 possible pairs
// at the time of writing), but the right number for any given pair is a judgement about subject
// matter, not something a threshold can hold.
//
//   npx tsx scripts/check-engines.ts            # gate mode
//   npx tsx scripts/check-engines.ts --report   # full tables, never fails

import { engineRegistry, NON_DISPATCHING_PATTERNS } from '../src/data/engines';
import { tools } from '../src/data/registry';
import { graph } from '../src/lib/knowledge/graph';
import { RELATION_TYPES } from '../src/lib/knowledge/types';
import type { PatternId } from '../src/data/engines';

/**
 * Ceilings, not targets. Each is what the catalog achieves today; the gate fails above it. Lower one
 * in the same commit as the change that earns it. Never raise one to get past a red build.
 */
const THRESHOLDS = {
  /**
   * 2026-08-29: 1. `finance` is the lone isolated engine and has been since it shipped: interest
   * and savings maths genuinely sits beside nothing else in the catalog. `chemistry-lab` was the
   * second until its manifests authored the cross-subject links their derivation could not produce
   * (every chemistry simulator is the only member of its family, so nothing outside the domain
   * derived). Adding a subject with no neighbours is the thing this number is here to catch.
   */
  isolatedEngines: 1,
  /**
   * 2026-08-29: 5 — text-interactive, calculator, productivity, color, units. All five are declared
   * bespoke in the engine contract test, which asserts none of them declares a processorId.
   */
  bespokeEngines: 5,
};

const REPORT = process.argv.includes('--report');

// ── Shape ────────────────────────────────────────────────────────────────────────────────────
const toolsOf = (id: string) => tools.filter((t) => t.engine === id);
const bespoke = engineRegistry.filter((e) => !e.sharedWidget);

const byCategory = new Map<string, string[]>();
for (const e of engineRegistry) byCategory.set(e.category, [...(byCategory.get(e.category) ?? []), e.id]);

const byWidget = new Map<string, string[]>();
for (const e of engineRegistry) {
  const key = e.sharedWidget ?? '(bespoke)';
  byWidget.set(key, [...(byWidget.get(key) ?? []), e.id]);
}

// ── Relationships ────────────────────────────────────────────────────────────────────────────
// The same derivation /architecture/ renders: a knowledge-graph edge between two tools in different
// engines is one engine-to-engine relationship. Kept in step with src/pages/architecture.astro.
const CROSS_TYPES = new Set<string>([
  RELATION_TYPES.RELATED_TOOL,
  RELATION_TYPES.USED_WITH,
  RELATION_TYPES.ALTERNATIVE,
  RELATION_TYPES.NEXT_STEP,
]);
const slugToEngine = new Map(tools.map((t) => [t.slug, t.engine]));
const slugOf = (nodeId: string) => nodeId.slice(nodeId.indexOf(':') + 1);

const pairCounts = new Map<string, number>();
for (const e of graph.edges) {
  if (!CROSS_TYPES.has(e.type)) continue;
  if (!e.from.startsWith('tool:') || !e.to.startsWith('tool:')) continue;
  const a = slugToEngine.get(slugOf(e.from));
  const b = slugToEngine.get(slugOf(e.to));
  if (!a || !b || a === b) continue;
  const key = [a, b].sort().join('|');
  pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
}

const degree = new Map<string, number>();
for (const key of pairCounts.keys()) {
  for (const id of key.split('|')) degree.set(id, (degree.get(id) ?? 0) + 1);
}
const isolated = engineRegistry.filter((e) => !degree.has(e.id));
const possiblePairs = (engineRegistry.length * (engineRegistry.length - 1)) / 2;

// ── Report ───────────────────────────────────────────────────────────────────────────────────
console.log('\n[check-engines] engine shape\n');
console.log(`  engines                       ${engineRegistry.length} across ${byCategory.size} categories`);
console.log(`  bespoke (no shared widget)    ${bespoke.length}  (ceiling ${THRESHOLDS.bespokeEngines}${bespoke.length ? `: ${bespoke.map((e) => e.id).join(', ')}` : ''})`);
console.log(`  cross-engine pairs            ${pairCounts.size} of ${possiblePairs} possible`);
console.log(`  isolated engines              ${isolated.length}  (ceiling ${THRESHOLDS.isolatedEngines}${isolated.length ? `: ${isolated.map((e) => e.id).join(', ')}` : ''})`);

if (REPORT) {
  console.log('\n  engines per category (fan-out):');
  for (const [cat, ids] of [...byCategory].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ${cat.padEnd(22)} ${String(ids.length).padStart(2)}  ${ids.join(', ')}`);
  }

  console.log('\n  shared widget reuse:');
  for (const [widget, ids] of [...byWidget].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ${widget.padEnd(28)} ${String(ids.length).padStart(2)}  ${ids.join(', ')}`);
  }

  console.log('\n  engine inventory:');
  for (const e of engineRegistry) {
    const own = toolsOf(e.id);
    const families = new Set(own.map((t) => t.family).filter(Boolean));
    const dispatches = e.patterns.some((p) => !NON_DISPATCHING_PATTERNS.has(p as PatternId));
    console.log(
      `    ${e.id.padEnd(16)} ${String(own.length).padStart(3)} tools  ` +
        `${String(e.patterns.length).padStart(2)} pattern(s)  ${String(families.size).padStart(2)} famil(y/ies)  ` +
        `${dispatches ? 'dispatching' : 'non-dispatching'}`,
    );
  }

  console.log('\n  cross-engine coupling:');
  for (const [key, count] of [...pairCounts].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${key.replace('|', ' <-> ').padEnd(44)} ${count}`);
  }
}

// ── Gate ─────────────────────────────────────────────────────────────────────────────────────
const errors: string[] = [];

if (isolated.length > THRESHOLDS.isolatedEngines) {
  errors.push(
    `${isolated.length} engine(s) have no cross-engine relationship at all (${isolated.map((e) => e.id).join(', ')}), ` +
      `above the ceiling ${THRESHOLDS.isolatedEngines}.\n` +
      `      An engine reachable from nothing is a dead end for a reader. Relationships derive from shared\n` +
      `      concepts, quantities and family, so a subject whose families are all new derives none: author a\n` +
      `      \`relationships\` overlay on the manifest, or relatedTools on the config. Never raise the ceiling.`,
  );
}

if (bespoke.length > THRESHOLDS.bespokeEngines) {
  errors.push(
    `${bespoke.length} engines declare no shared widget (${bespoke.map((e) => e.id).join(', ')}), ` +
      `above the ceiling ${THRESHOLDS.bespokeEngines}.\n` +
      `      A new bespoke engine is usually a dispatching engine that has not admitted it yet. Check whether\n` +
      `      it belongs on an existing shared widget before adding it to BESPOKE_ENGINES.`,
  );
}

if (errors.length && !REPORT) {
  console.error('\n[check-engines] FAILED:\n');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\nFix the cause, do not raise a ceiling.');
  process.exit(1);
}

console.log(REPORT ? '\n[check-engines] report only, not a gate.\n' : '\n[check-engines] OK.\n');
