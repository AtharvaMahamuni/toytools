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
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { HASHERS } from '../src/lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';
import { JWT_TOOLS } from '../src/lib/engines/jwt/registry';
import { FINANCE_CALCULATORS } from '../src/lib/engines/finance/registry';
import { SIMULATIONS } from '../src/lib/simulation/simulations/registry';
import { KNOWLEDGE } from '../src/lib/knowledge/registry';
import { faqsByToolSlug } from '../src/data/faq-registry';
import { registeredGuideSlugs } from '../src/data/guide-registry';
import { knownPatterns } from '../src/data/engines';
import { sectionsByPattern } from '../src/data/category-sections';
import { serializeCodeMap, CODE_MAP_PATH } from './export-code-map';

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

// ---- 2. Orphan files: authored on disk but not wired into the registry that renders them -----
for (const { slug, files } of toolDirs) {
  if (!toolBySlug.has(slug)) {
    err(`Tool directory "${slug}" has config.ts but no entry in src/data/registry.ts`);
    continue;
  }
  if (files.has('faq.ts') && !((faqsByToolSlug[slug]?.length ?? 0) > 0)) {
    err(`Orphan FAQ: src/tools/.../${slug}/faq.ts exists but "${slug}" is not in faqsByToolSlug — its FAQ never renders (register it in src/data/faq-registry.ts)`);
  }
  if (files.has('knowledge.ts') && !KNOWLEDGE.has(slug)) {
    err(`Orphan knowledge: src/tools/.../${slug}/knowledge.ts exists but "${slug}" is not in the knowledge registry (add it to src/lib/knowledge/registry.ts)`);
  }
  const tool = toolBySlug.get(slug);
  if (files.has('Guide.astro')) {
    if (!tool?.guide) {
      warn(`Guide.astro present for "${slug}" but its config.ts declares no guide: — the page is unreachable`);
    } else if (!registeredGuideSlugs.includes(slug as never)) {
      err(`Orphan guide: "${slug}" has Guide.astro + guide config but is not in registeredGuideSlugs (src/data/guide-registry.ts)`);
    }
  }
}

// ---- 3. Guide-route completeness: every registered slug must be wired into the route map -----
// astro build does not type-check the `Record<RegisteredGuideSlug, …>` constraint, so a slug
// registered without its import renders an EMPTY guide page silently. Verify by text.
const routeFile = join(repoRoot, 'src', 'pages', 'guide', '[...slug].astro');
if (existsSync(routeFile)) {
  const routeSrc = readFileSync(routeFile, 'utf8');
  for (const slug of registeredGuideSlugs) {
    if (!routeSrc.includes(`'${slug}':`)) {
      err(`Guide "${slug}" is in registeredGuideSlugs but has no entry in guidesBySlug (src/pages/guide/[...slug].astro) — the guide page renders empty`);
    }
  }
} else {
  err('Could not find src/pages/guide/[...slug].astro to verify guide-route completeness');
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
  physics: SIMULATIONS,
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
