// Architecture drift detector — an architectural lint pass over the whole repository.
//
// validate-registry.ts checks that every *declared* reference RESOLVES (missing-target direction).
// This script checks the OPPOSITE direction and the cross-file seams TypeScript/Astro do not catch
// on their own: files that exist on disk but no registry imports them (orphans), registry entries
// nothing uses (dead weight), the guide-route component map drifting from the slug registry,
// self-referential knowledge edges, and empty categories. These are the failures that slip past a
// green `astro build` because the build does not type-check `.astro` frontmatter and the engine
// registries never throw.
//
// Run as part of `npm run build` (after validate-registry/validate-knowledge). Errors fail the
// build; warnings print but do not. Pass --strict to promote warnings to errors.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { simulationGuideSlugs } from '../src/lib/simulation/derived';
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { HASHERS } from '../src/lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';
import { JWT_TOOLS } from '../src/lib/engines/jwt/registry';
import { FINANCE_CALCULATORS } from '../src/lib/engines/finance/registry';
import { MATH_CALCULATORS } from '../src/lib/engines/math/registry';
import { WELLNESS_CALCULATORS } from '../src/lib/engines/wellness/registry';
import { TRACKER_DEFS } from '../src/lib/engines/tracker/registry';
import { DOMAINS } from '../src/lib/simulation/simulations/registry';
import { KNOWLEDGE } from '../src/lib/knowledge/registry';
import { knownPatterns } from '../src/data/engines';
import { sectionsByPattern } from '../src/data/category-sections';
import { serializeCodeMap, CODE_MAP_PATH } from './export-code-map';
import { staleGeneratedFiles } from './generate-registries';

const strict = process.argv.includes('--strict');
const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => (strict ? errors : warnings).push(m);

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const toolsDir = join(repoRoot, 'src', 'tools');

const toolBySlug = new Map(tools.map(t => [t.slug, t]));

// ---- 1. Walk the tool tree to find files on disk, keyed by their owning tool slug ------------
// Layout: src/tools/<segment>/<slug>/{config.ts,faq.ts,knowledge.ts,Guide.astro}
interface ToolDir { slug: string; segment: string; files: Set<string>; }
const toolDirs: ToolDir[] = [];
for (const segment of readdirSync(toolsDir, { withFileTypes: true })) {
  if (!segment.isDirectory() || segment.name === '_shared') continue;
  const segPath = join(toolsDir, segment.name);
  for (const slugDir of readdirSync(segPath, { withFileTypes: true })) {
    if (!slugDir.isDirectory()) continue;
    const dirPath = join(segPath, slugDir.name);
    const files = new Set(readdirSync(dirPath));
    if (!files.has('config.ts')) continue; // not a tool dir
    toolDirs.push({ slug: slugDir.name, segment: segment.name, files });
  }
}

// ---- 2. Generated-registry freshness: registration is DERIVED from the tool tree -------------
// Registration barrels (registry/faq/guide/knowledge *.generated.ts) are written by
// `npm run registries:generate` from the same directory scan as above. A stale barrel is the
// derived-registration analogue of the old orphan-file class: content authored on disk that never
// renders. Rebuild in memory and byte-compare, mirroring the code-map check below.
for (const stale of staleGeneratedFiles()) {
  err(`${stale} is stale (tool tree changed) — run \`npm run registries:generate\``);
}

// Belt and braces: the generated barrel spreads into src/data/registry.ts, so a conforming dir
// missing from `tools` means the hub module itself was tampered with.
for (const { slug } of toolDirs) {
  if (!toolBySlug.has(slug)) {
    err(`Tool directory "${slug}" has config.ts but is missing from the registry — regenerate (npm run registries:generate) and check src/data/registry.ts spreads registry.generated.ts`);
  }
}

// ---- 3. Guide completeness: a declared guide must have a component to render -----------------
// The guide route discovers components via import.meta.glob over Guide.astro files, so a tool
// whose config declares `guide:` without a Guide.astro on disk gets a route that renders EMPTY
// (no build error without this check). Simulation guides render generically from their manifest
// and need no Guide.astro.
const simGuideSet = new Set<string>(simulationGuideSlugs);
for (const tool of tools) {
  if (!tool.guide || simGuideSet.has(tool.slug)) continue;
  const dir = toolDirs.find(d => d.slug === tool.slug);
  if (dir && !dir.files.has('Guide.astro')) {
    err(`Tool "${tool.slug}" declares guide: in config.ts but has no Guide.astro on disk — the guide page renders empty (author src/tools/${dir.segment}/${tool.slug}/Guide.astro)`);
  }
}
for (const { slug, files } of toolDirs) {
  if (files.has('Guide.astro') && !toolBySlug.get(slug)?.guide) {
    warn(`Guide.astro present for "${slug}" but its config.ts declares no guide: — the page is unreachable`);
  }
}

// ---- 4. Unused engine-registry entries: a registered processor no tool claims is dead code ---
const usedProcessorIds = new Set(
  tools.map(t => `${t.engine}::${t.processorId}`).filter(k => !k.includes('undefined')),
);
const engineRegistries: Record<string, Record<string, unknown>> = {
  'text-processor': PROCESSORS,
  encoding: ENCODERS,
  hashing: HASHERS,
  'structured-data': STRUCTURED_TOOLS,
  jwt: JWT_TOOLS,
  finance: FINANCE_CALCULATORS,
  math: MATH_CALCULATORS,
  wellness: WELLNESS_CALCULATORS,
  tracker: TRACKER_DEFS,
  // Each simulation domain plugin is its own engine id over its own slice of the composed
  // simulation map (physics, math-lab, ...), so a sim is only "unused" within its own domain.
  ...Object.fromEntries(DOMAINS.map(d => [d.id, d.simulations])),
};
for (const [engine, registry] of Object.entries(engineRegistries)) {
  for (const id of Object.keys(registry)) {
    if (!usedProcessorIds.has(`${engine}::${id}`)) {
      warn(`Unused processor: "${id}" is registered for engine "${engine}" but no tool uses it (dead registry entry)`);
    }
  }
}

// ---- 5. Empty categories: a category no tool belongs to renders an empty listing -------------
for (const c of categories) {
  if (!tools.some(t => t.categorySlug === c.slug)) {
    err(`Empty category: "${c.slug}" has no tools (src/data/categories.ts)`);
  }
}

// ---- 5b. Unmapped patterns: a pattern with no category-sections row drops its tools into the
// silent "Other" bucket on the category page. Every declared pattern must have a section. ------
for (const pattern of knownPatterns) {
  if (!sectionsByPattern[pattern]) {
    err(`Pattern "${pattern}" has no section in src/data/category-sections.ts — its tools fall into the unnamed "Other" bucket`);
  }
}

// ---- 6. Knowledge relationship hygiene: a tool must not reference itself --------------------
// (Cycles across tools are NOT flagged: bidirectional usedWith/alternatives and round-trip
// converter pairs — JSON↔CSV, JSON↔YAML — are legitimate and common here.)
const relFields = ['usedWith', 'alternatives', 'nextSteps'] as const;
for (const k of KNOWLEDGE.values()) {
  for (const field of relFields) {
    for (const ref of k[field] ?? []) {
      if (ref.slug === k.slug) {
        err(`Self-reference: knowledge "${k.slug}" lists itself in ${field}`);
      }
    }
  }
}

// ---- 7. Code-map freshness: docs/code-map.json is the committed "where does X live" answer ---
// It is generated from the registries (deterministic, no timestamps), so a stale copy means a
// registry changed without regenerating. Rebuild in memory and byte-compare.
if (!existsSync(CODE_MAP_PATH)) {
  err('docs/code-map.json is missing — run `npm run map:generate`');
} else if (readFileSync(CODE_MAP_PATH, 'utf8') !== serializeCodeMap()) {
  err('docs/code-map.json is stale (registries changed) — run `npm run map:generate`');
}

// ---- Report ---------------------------------------------------------------------------------
if (warnings.length) {
  console.warn('\n[validate-architecture] Warnings:');
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}
if (errors.length) {
  console.error('\n[validate-architecture] Errors found:\n');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} error(s). Fix before building.\n`);
  process.exit(1);
}
console.log(`[validate-architecture] OK — ${toolDirs.length} tool dirs, ${KNOWLEDGE.size} knowledge files, no drift.`);
