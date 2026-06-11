import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { engineIds, knownPatterns, getEngine } from '../src/data/engines';
import { getToolMetadata } from '../src/data/metadata';
import { registeredGuideSlugSet } from '../src/data/guide-registry';
import { toolGroups, getToolGroup } from '../src/data/tool-groups';
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { HASHERS } from '../src/lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';

// KNOWN engines/patterns derive from the engine manifest — single source of truth.
const KNOWN_ENGINES = engineIds;
const KNOWN_PATTERNS = knownPatterns;

// Per-engine processorId resolution: engine id → its registry of valid ids.
const ENGINE_REGISTRIES: Record<string, Record<string, unknown>> = {
  'text-processor': PROCESSORS,
  encoding: ENCODERS,
  hashing: HASHERS,
  'structured-data': STRUCTURED_TOOLS,
};

const categorySlugSet = new Set(categories.map(c => c.slug));
const allSlugs = new Set(tools.map(t => t.slug));
const segmentOf = (categorySlug: string) =>
  categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;

const slugsSeen = new Set<string>();
const urlsSeen = new Set<string>();
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

  // toolGroup must resolve, and membership must be declared on both sides
  if (tool.toolGroup) {
    const group = getToolGroup(tool.toolGroup);
    if (!group) {
      errors.push(`Tool "${m.slug}" references unknown toolGroup "${tool.toolGroup}" — define it in src/data/tool-groups.ts`);
    } else if (!group.members.some(member => member.slug === m.slug)) {
      errors.push(`Tool "${m.slug}" declares toolGroup "${tool.toolGroup}" but is not listed in that group's members`);
    }
  }

  // Engine-specific processorId must resolve in that engine's registry
  const registry = ENGINE_REGISTRIES[m.engine];
  if (registry) {
    if (!tool.processorId) {
      errors.push(`Tool "${m.slug}" uses engine "${m.engine}" but is missing processorId`);
    } else if (!registry[tool.processorId]) {
      errors.push(`Tool "${m.slug}" references unknown processorId "${tool.processorId}" for engine "${m.engine}"`);
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

if (errors.length > 0) {
  console.error('\n[validate-registry] Errors found:\n');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} error(s). Fix before building.\n`);
  process.exit(1);
} else {
  console.log(`[validate-registry] OK — ${tools.length} tools, all valid.`);
}
