import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { searchAliases } from '../src/data/search-aliases';
import { engineIds, knownPatterns, getEngine, engineRegistry, NON_DISPATCHING_PATTERNS } from '../src/data/engines';
import { ENGINE_GLOBALS, RUNTIME_ENGINE_IDS } from '../src/lib/runtime/loaders';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getToolMetadata } from '../src/data/metadata';
import { isIsoDate } from '../src/lib/dates';
import { registeredGuideSlugSet } from '../src/data/guide-registry';
import { toolGroups, getToolGroup } from '../src/data/tool-groups';
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { HASHERS } from '../src/lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';
import { JWT_TOOLS } from '../src/lib/engines/jwt/registry';
import { FINANCE_CALCULATORS } from '../src/lib/engines/finance/registry';
import { MATH_CALCULATORS } from '../src/lib/engines/math/registry';
import { WELLNESS_CALCULATORS } from '../src/lib/engines/wellness/registry';
import { TRACKER_DEFS } from '../src/lib/engines/tracker/registry';
import { CSV_TOOLS } from '../src/lib/engines/csv/registry';
import { GENERATORS } from '../src/lib/generation/registry';
import { DOMAINS, SIMULATIONS } from '../src/lib/simulation/simulations/registry';
import { MANIFESTS } from '../src/lib/simulation/manifests';
import { SIMULATION_SCHEMA_VERSION } from '../src/lib/simulation/manifest';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

// KNOWN engines/patterns derive from the engine manifest — single source of truth.
const KNOWN_ENGINES = engineIds;
const KNOWN_PATTERNS = knownPatterns;

// Per-engine processorId resolution: engine id → its registry of valid ids.
const ENGINE_REGISTRIES: Record<string, Record<string, unknown>> = {
  'text-processor': PROCESSORS,
  encoding: ENCODERS,
  hashing: HASHERS,
  'structured-data': STRUCTURED_TOOLS,
  jwt: JWT_TOOLS,
  finance: FINANCE_CALCULATORS,
  csv: CSV_TOOLS,
  generation: GENERATORS,
  math: MATH_CALCULATORS,
  wellness: WELLNESS_CALCULATORS,
  tracker: TRACKER_DEFS,
  // Each simulation domain plugin resolves only its own slice of the composed simulation map,
  // so e.g. a physics tool cannot claim a math-lab processorId.
  ...Object.fromEntries(DOMAINS.map(d => [d.id, d.simulations])),
};

const categorySlugSet = new Set(categories.map(c => c.slug));
const allSlugs = new Set(tools.map(t => t.slug));
const segmentOf = (categorySlug: string) =>
  categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;

const slugsSeen = new Set<string>();
const urlsSeen = new Set<string>();
// engine-scoped processorId → owning tool slug. Two tools resolving to the same processor is a
// silent runtime bug: engine registries never throw, so a typo that happens to match another
// tool's id ships the wrong transform with no build failure. Catch the collision here instead.
const processorIdOwner = new Map<string, string>();
const errors: string[] = [];

for (const tool of tools) {
  const m = getToolMetadata(tool);

  // Required metadata-contract fields
  if (!m.slug) errors.push(`Tool missing slug: ${JSON.stringify(tool)}`);
  if (!m.name) errors.push(`Tool "${m.slug}" missing name`);
  if (!m.description) errors.push(`Tool "${m.slug}" missing description`);
  if (!m.category) errors.push(`Tool "${m.slug}" missing category`);
  if (!m.engine) errors.push(`Tool "${m.slug}" missing engine`);
  if (!m.pattern) errors.push(`Tool "${m.slug}" missing pattern`);
  if (!m.family) errors.push(`Tool "${m.slug}" missing family`);
  if (!Array.isArray(m.keywords)) errors.push(`Tool "${m.slug}" keywords must be an array`);
  if (!m.tags.length) errors.push(`Tool "${m.slug}" missing tags`);

  // Unique slug
  if (slugsSeen.has(m.slug)) errors.push(`Duplicate slug: "${m.slug}"`);
  slugsSeen.add(m.slug);

  // Unique tool-page URL
  if (m.slug) {
    const url = `/tool/${segmentOf(m.category)}/${m.slug}/`;
    if (urlsSeen.has(url)) errors.push(`Duplicate tool URL: "${url}"`);
    urlsSeen.add(url);
  }

  // Category must resolve
  if (m.category && !categorySlugSet.has(m.category)) {
    errors.push(`Tool "${m.slug}" references unknown category "${m.category}"`);
  }

  // Engine must be registered in the engine manifest
  if (m.engine && !KNOWN_ENGINES.has(m.engine)) {
    errors.push(`Tool "${m.slug}" uses unknown engine "${m.engine}" — register it in src/data/engines.ts`);
  }

  // Pattern must be declared, and owned by the tool's engine
  if (m.pattern && !KNOWN_PATTERNS.has(m.pattern)) {
    errors.push(`Tool "${m.slug}" uses unknown pattern "${m.pattern}" — declare it on an engine in src/data/engines.ts`);
  }
  const engine = getEngine(m.engine);
  if (engine && m.pattern && !engine.patterns.includes(m.pattern)) {
    errors.push(`Tool "${m.slug}" pattern "${m.pattern}" is not owned by engine "${m.engine}" (allowed: ${engine.patterns.join(', ')})`);
  }

  // relatedTools must resolve (no orphan relationships)
  for (const rel of m.relatedTools) {
    if (!allSlugs.has(rel)) {
      errors.push(`Tool "${m.slug}" references unknown relatedTool "${rel}"`);
    }
  }

  // guide slug must be present when declared (resolution is by route at build)
  if (tool.guide && !m.guideSlug) errors.push(`Tool "${m.slug}" has a guide config without a slug`);

  // A declared guide must actually be wired into its route — otherwise the tool page links to
  // a guide page that renders empty (no build error without this check).
  if (tool.guide && !registeredGuideSlugSet.has(m.slug)) {
    errors.push(`Tool "${m.slug}" declares a guide but is not registered in src/data/guide-registry.ts (add its slug + Guide.astro import in src/pages/guide/[...slug].astro)`);
  }

  // Same contract on the tool's own date: it is SoftwareApplication.dateModified on the tool page.
  if (tool.updatedAt !== undefined && !isIsoDate(tool.updatedAt)) {
    errors.push(`Tool "${m.slug}" updatedAt must be an ISO 8601 date (YYYY-MM-DD), got "${tool.updatedAt}". It is the SoftwareApplication schema's dateModified.`);
  }

  // guide.updatedAt is the Article schema's datePublished/dateModified, so it must be ISO 8601.
  // It held a display string ("Jul 2026") until 2026-08-17, which made Google drop the dates on
  // 102 of 121 guides. Nothing caught it, because a wrong-but-present string renders fine.
  if (tool.guide && !isIsoDate(tool.guide.updatedAt)) {
    errors.push(`Tool "${m.slug}" guide.updatedAt must be an ISO 8601 date (YYYY-MM-DD), got "${tool.guide.updatedAt}". It is the Article schema date; the visible "Updated Jun 2026" line is derived from it by formatMonthYear.`);
  }

  // toolGroup must resolve, and membership must be declared on both sides
  if (tool.toolGroup) {
    const group = getToolGroup(tool.toolGroup);
    if (!group) {
      errors.push(`Tool "${m.slug}" references unknown toolGroup "${tool.toolGroup}" — define it in src/data/tool-groups.ts`);
    } else if (!group.members.some(member => member.slug === m.slug)) {
      errors.push(`Tool "${m.slug}" declares toolGroup "${tool.toolGroup}" but is not listed in that group's members`);
    }
  }

  // Engine-specific processorId must resolve in that engine's registry.
  // Skipped for patterns that do not dispatch through it at all (NON_DISPATCHING_PATTERNS): those
  // tools have no processor to name, so requiring one would only invite a decorative id that
  // resolves to somebody else's transform. Declaring an unknown or duplicate id is still an error
  // for them, which is checked below exactly as it is for everyone else.
  const registry = ENGINE_REGISTRIES[m.engine];
  const dispatches = !NON_DISPATCHING_PATTERNS.has(tool.pattern as never);
  if (registry) {
    if (!tool.processorId && !dispatches) {
      // Nothing to resolve, by declaration.
    } else if (!tool.processorId) {
      errors.push(`Tool "${m.slug}" uses engine "${m.engine}" but is missing processorId`);
    } else if (!registry[tool.processorId]) {
      errors.push(`Tool "${m.slug}" references unknown processorId "${tool.processorId}" for engine "${m.engine}"`);
    } else {
      // Collision: another tool already claims this engine+processorId. A registered id resolves,
      // so the build would otherwise pass while one tool silently runs the other's transform.
      const key = `${m.engine}::${tool.processorId}`;
      const owner = processorIdOwner.get(key);
      if (owner) {
        errors.push(`Tool "${m.slug}" reuses processorId "${tool.processorId}" (engine "${m.engine}") already claimed by "${owner}" — each tool must map to a distinct processor`);
      } else {
        processorIdOwner.set(key, m.slug);
      }
    }
  }
}

// Tool-group integrity: every member resolves, declares the group back, and the group
// is one experience (same engine + pattern across members).
for (const group of toolGroups) {
  const memberSlugsSeen = new Set<string>();
  let groupEngine: string | undefined;
  let groupPattern: string | undefined;

  for (const member of group.members) {
    if (memberSlugsSeen.has(member.slug)) {
      errors.push(`Tool group "${group.id}" lists member "${member.slug}" more than once`);
    }
    memberSlugsSeen.add(member.slug);

    const memberTool = tools.find(t => t.slug === member.slug);
    if (!memberTool) {
      errors.push(`Tool group "${group.id}" member "${member.slug}" does not exist in the registry`);
      continue;
    }
    if (memberTool.toolGroup !== group.id) {
      errors.push(`Tool group "${group.id}" member "${member.slug}" does not declare toolGroup: '${group.id}' in its config`);
    }

    groupEngine ??= memberTool.engine;
    groupPattern ??= memberTool.pattern;
    if (memberTool.engine !== groupEngine || memberTool.pattern !== groupPattern) {
      errors.push(`Tool group "${group.id}" member "${member.slug}" has engine/pattern "${memberTool.engine}/${memberTool.pattern}" — all members must share "${groupEngine}/${groupPattern}" (a group is one experience)`);
    }
  }
}

// Category highlights: the three example tools each category shows on the homepage index.
// A stale slug here does not throw at build time, it just silently drops an example from the
// homepage, which is exactly the kind of drift a rename causes and nobody notices.
for (const category of categories) {
  const highlights = category.highlights ?? [];
  if (highlights.length > 3) {
    errors.push(`Category "${category.slug}" lists ${highlights.length} highlights — the homepage index renders at most 3`);
  }
  const highlightsSeen = new Set<string>();
  for (const slug of highlights) {
    if (highlightsSeen.has(slug)) {
      errors.push(`Category "${category.slug}" lists highlight "${slug}" more than once`);
    }
    highlightsSeen.add(slug);

    const highlighted = tools.find(t => t.slug === slug);
    if (!highlighted) {
      errors.push(`Category "${category.slug}" highlights unknown tool "${slug}" — fix the slug in src/data/categories.ts`);
    } else if (highlighted.categorySlug !== category.slug) {
      errors.push(`Category "${category.slug}" highlights "${slug}", which belongs to "${highlighted.categorySlug}" — a highlight must be a tool in its own category`);
    }
  }
}

// ---- Simulation manifests: schemaVersion + model wiring ----
// Sims are derived from their manifests (no per-tool config), so the manifest is the contract.
// Guard the schemaVersion (an outdated manifest must fail the build, mirroring validate-knowledge)
// and that every manifest's processorId resolves to a registered model.
const simSlugsSeen = new Set<string>();
for (const manifest of MANIFESTS) {
  const { slug, processorId } = manifest.metadata;
  if (manifest.schemaVersion !== SIMULATION_SCHEMA_VERSION) {
    errors.push(`Simulation manifest "${slug}" has schemaVersion ${manifest.schemaVersion}, expected ${SIMULATION_SCHEMA_VERSION} — update the manifest to the current shape`);
  }
  if (!SIMULATIONS[processorId]) {
    errors.push(`Simulation manifest "${slug}" references processorId "${processorId}" with no registered model — register it in its domain plugin (src/lib/simulation/plugins/<domain>/index.ts)`);
  }
  if (simSlugsSeen.has(slug)) errors.push(`Duplicate simulation manifest slug: "${slug}"`);
  simSlugsSeen.add(slug);
}

// ---- Runtime engine globals: every ToyTools.* a widget calls must actually be loaded ----
// The deferred runtime ships ONE engine chunk per page, chosen from the tool's declared engine
// (BaseLayout emits <meta name="tt-engines">). So a widget calling a global its engine does not
// provide is now a runtime TypeError on a real page — invisible to tsc, because these are inline
// browser scripts talking to an untyped global. This check is the replacement for the old
// safety net of "every engine is always loaded anyway".
{
  const CORE_GLOBALS = new Set([
    // Defined by the inline half of ToyToolsRuntime.astro — always present, no chunk needed.
    'ready', '_readyCbs', 'onReady', 'track', 'toast', 'storage', 'state', 'data', 'profile',
    'prefs', 'history', 'recordRecent', 'getRecent', 'focus', 'mobileTooltip', 'copy', 'url',
  ]);
  const usedGlobals = (file: string): string[] => {
    if (!existsSync(file)) return [];
    const src = readFileSync(file, 'utf8');
    const found = new Set<string>();
    // Widgets reach the global as `ToyTools.x` or via a local alias `var TT = window.ToyTools`.
    for (const m of src.matchAll(/\b(?:ToyTools|TT)\.([A-Za-z_$][\w$]*)/g)) found.add(m[1]);
    return [...found];
  };
  const check = (file: string, engineId: string, label: string) => {
    const provided = new Set([...(ENGINE_GLOBALS[engineId] ?? []), ...CORE_GLOBALS]);
    for (const g of usedGlobals(file)) {
      if (provided.has(g)) continue;
      errors.push(
        `${label} calls ToyTools.${g}, which engine "${engineId}" does not load. ` +
        `Either declare it in ENGINE_GLOBALS (src/lib/runtime/loaders.ts) and attach it in ` +
        `src/lib/runtime/engines/${engineId}.ts, or stop using it here.`,
      );
    }
  };

  // Shared widgets are rendered for every tool on their engine.
  for (const engine of engineRegistry) {
    if (!engine.sharedWidget) continue;
    check(join(repoRoot, 'src/tools/_shared', engine.sharedWidget), engine.id, `Shared widget ${engine.sharedWidget}`);
  }
  // Bespoke per-tool widgets.
  for (const tool of tools) {
    const category = categories.find(c => c.slug === tool.categorySlug);
    if (!category) continue;
    const widget = join(repoRoot, 'src/tools', category.segment, tool.slug, 'Widget.astro');
    check(widget, tool.engine, `Tool "${tool.slug}" widget`);
  }
  // Every engine that declares runtime globals must have a loader, and vice versa.
  for (const id of Object.keys(ENGINE_GLOBALS)) {
    if (!RUNTIME_ENGINE_IDS.includes(id)) {
      errors.push(`ENGINE_GLOBALS declares "${id}" but ENGINE_LOADERS has no entry — add the import() in src/lib/runtime/loaders.ts`);
    }
    if (!engineIds.has(id)) {
      errors.push(`ENGINE_GLOBALS declares unknown engine "${id}" — register it in src/data/engines.ts`);
    }
  }
  for (const id of RUNTIME_ENGINE_IDS) {
    if (!ENGINE_GLOBALS[id]) {
      errors.push(`ENGINE_LOADERS has "${id}" but ENGINE_GLOBALS does not list what it attaches — validators cannot check widgets against it`);
    }
  }
}

// ── Search aliases ────────────────────────────────────────────────────────────
// Aliases are the vocabulary layer over the catalog (src/data/search-aliases.ts). A key that is
// not a slug silently does nothing, and one phrase claimed by two tools makes ranking arbitrary,
// so both are build failures rather than quiet dead weight.
{
  const slugs = new Set(tools.map(t => t.slug));
  const owner = new Map<string, string>();
  for (const [slug, phrases] of Object.entries(searchAliases)) {
    if (!slugs.has(slug)) {
      errors.push(`search-aliases: "${slug}" is not a registered tool slug — remove it or fix the spelling`);
    }
    for (const phrase of phrases) {
      if (phrase !== phrase.trim().toLowerCase()) {
        errors.push(`search-aliases: "${phrase}" (${slug}) must be lowercase and trimmed — the index never sees it otherwise`);
      }
      const existing = owner.get(phrase);
      if (existing) {
        errors.push(`search-aliases: "${phrase}" is claimed by both "${existing}" and "${slug}" — one phrase, one tool`);
      } else {
        owner.set(phrase, slug);
      }
    }
  }
}

// ── Tagline length (warnings, not errors) ──────────────────────────────────────────────────
// `tagline` is the one-line label under a tool's title. Over 80 characters it wraps to two lines
// on a 393px phone, which is the geometry the header rebuild exists to remove.
//
// These were warnings while 94 of 119 tools still fell back to a long description. That backlog is
// cleared, so they are errors: the whole catalog holds the one-line contract, and the cheapest way
// to keep holding it is to stop the next tool shipping without one.
// See docs/analysis/2026-08-08-tool-identity-implementation.md, phase 8.
const TAGLINE_MAX = 80;

for (const tool of tools) {
  const t = tool as { slug: string; tagline?: string; description?: string };
  if (typeof t.tagline === 'string') {
    if (t.tagline.length > TAGLINE_MAX) {
      errors.push(
        `Tool "${t.slug}" tagline is ${t.tagline.length} chars (max ${TAGLINE_MAX}) — ` +
        'it wraps to two lines on a 393px phone',
      );
    }
  } else if ((t.description?.length ?? 0) > TAGLINE_MAX) {
    errors.push(
      `Tool "${t.slug}" has no tagline and its description is ${t.description!.length} chars, ` +
      `so its page renders a multi-line tagline. Author a \`tagline\` of ${TAGLINE_MAX} chars or ` +
      'fewer (description stays long: it is the meta description and a query-targeting slot)',
    );
  }
}

if (errors.length > 0) {
  console.error('\n[validate-registry] Errors found:\n');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} error(s). Fix before building.\n`);
  process.exit(1);
} else {
  console.log(`[validate-registry] OK — ${tools.length} tools, all valid.`);
}
