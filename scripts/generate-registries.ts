// Registry generator — derives the four per-tool registration barrels from the filesystem.
//
// The architectural invariant this enforces: a tool exists because its directory conforms to the
// contract (src/tools/<segment>/<slug>/config.ts), NOT because five files were hand-edited to
// import it. This script scans the tool tree and writes:
//
//   src/data/registry.generated.ts        — every config.ts       → toolConfigs: ToolConfig[]
//   src/data/faq-registry.generated.ts    — every faq.ts          → authoredFaqsBySlug
//   src/data/guide-registry.generated.ts  — every Guide.astro     → authoredGuideSlugs (as const)
//   src/lib/knowledge/registry.generated.ts — every knowledge.ts  → authoredKnowledge: Knowledge[]
//
// The hand-written hub modules (registry.ts, faq-registry.ts, guide-registry.ts,
// knowledge/registry.ts) merge these with the simulation-derived surfaces and keep their public
// export names, so no consumer changes. Generated files are explicit static imports (never
// import.meta.glob) so they stay consumable by tsx scripts, vitest, AND Astro alike.
//
// Output is deterministic (sorted by slug, no timestamps) and committed; validate-architecture
// byte-compares it against a fresh in-memory build and fails the build when stale. Never edit the
// .generated.ts files by hand — author the tool directory and re-run:
//
//   npm run registries:generate

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories } from '../src/data/categories';
import { tools as registryTools } from '../src/data/registry';
import { manifestBySlug } from '../src/lib/simulation/manifests';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const toolsDir = join(repoRoot, 'src', 'tools');

const HEADER = `// GENERATED FILE — do not edit. Run \`npm run registries:generate\` to refresh.
// Derived from the src/tools/<segment>/<slug>/ directory contract (see scripts/generate-registries.ts).
`;

export interface DiscoveredTool {
  slug: string;
  segment: string;
  hasFaq: boolean;
  hasGuide: boolean;
  hasKnowledge: boolean;
}

/** Scan src/tools/<segment>/<slug>/ for conforming tool directories, sorted by slug. */
export function discoverTools(): DiscoveredTool[] {
  const found: DiscoveredTool[] = [];
  for (const segment of readdirSync(toolsDir, { withFileTypes: true })) {
    if (!segment.isDirectory() || segment.name === '_shared') continue;
    const segPath = join(toolsDir, segment.name);
    for (const slugDir of readdirSync(segPath, { withFileTypes: true })) {
      if (!slugDir.isDirectory()) continue;
      const files = new Set(readdirSync(join(segPath, slugDir.name)));
      if (!files.has('config.ts')) continue; // not a tool dir
      found.push({
        slug: slugDir.name,
        segment: segment.name,
        hasFaq: files.has('faq.ts'),
        hasGuide: files.has('Guide.astro'),
        hasKnowledge: files.has('knowledge.ts'),
      });
    }
  }
  // Sorted by slug: deterministic output, and parallel tool PRs only conflict when their slugs
  // are alphabetically adjacent (instead of always, as with append-at-anchor editing).
  return found.sort((a, b) => a.slug.localeCompare(b.slug));
}

const camelOf = (slug: string) => slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

export function serializeToolRegistry(tools: DiscoveredTool[]): string {
  const imports = tools.map(
    t => `import { config as ${camelOf(t.slug)} } from '@tools/${t.segment}/${t.slug}/config';`,
  );
  const entries = tools.map(t => `  ${camelOf(t.slug)},`);
  return `${HEADER}
import type { ToolConfig } from './types';
${imports.join('\n')}

export const toolConfigs: ToolConfig[] = [
${entries.join('\n')}
];
`;
}

export function serializeFaqRegistry(tools: DiscoveredTool[]): string {
  const withFaq = tools.filter(t => t.hasFaq);
  const imports = withFaq.map(
    t => `import { items as ${camelOf(t.slug)}Faqs } from '@tools/${t.segment}/${t.slug}/faq';`,
  );
  const entries = withFaq.map(t => `  '${t.slug}': ${camelOf(t.slug)}Faqs,`);
  return `${HEADER}
import type { FAQItem } from './types';
${imports.join('\n')}

export const authoredFaqsBySlug: Record<string, FAQItem[]> = {
${entries.join('\n')}
};
`;
}

export function serializeGuideRegistry(tools: DiscoveredTool[]): string {
  const withGuide = tools.filter(t => t.hasGuide);
  const entries = withGuide.map(t => `  '${t.slug}',`);
  return `${HEADER}
export const authoredGuideSlugs = [
${entries.join('\n')}
] as const;
`;
}

export function serializeKnowledgeRegistry(tools: DiscoveredTool[]): string {
  const withKnowledge = tools.filter(t => t.hasKnowledge);
  const imports = withKnowledge.map(
    t => `import { knowledge as ${camelOf(t.slug)} } from '@tools/${t.segment}/${t.slug}/knowledge';`,
  );
  const entries = withKnowledge.map(t => `  ${camelOf(t.slug)},`);
  return `${HEADER}
import type { Knowledge } from './types';
${imports.join('\n')}

export const authoredKnowledge: Knowledge[] = [
${entries.join('\n')}
];
`;
}

// ── Per-segment tool routes ────────────────────────────────────────────────────────────────────
//
// One route file per category segment instead of a single `[category]/[slug].astro` catch-all.
// The catch-all had to resolve any widget via `import.meta.glob('../../../tools/*/*/Widget.astro')`,
// which put EVERY widget in that route's module graph; Astro derives a page's stylesheet links from
// the whole graph, so every tool page shipped every bespoke widget's CSS (11 render-blocking sheets,
// most of it unused). A per-segment route globs only its own segment, so a page carries its own
// segment's widget CSS and nothing else — and the sim-only segments, which have no Widget.astro at
// all, carry none. Generated (not hand-written) so a new category cannot silently miss its route:
// validate-architecture byte-compares these and fails the build when stale.

/** Category segments that own at least one tool, plus which flavours of tool they hold. */
export function discoverSegments(tools: DiscoveredTool[]): { segment: string; hasWidgets: boolean; hasSims: boolean }[] {
  const dirSegments = new Set(tools.map(t => t.segment));
  const simSegments = new Set<string>();
  const all = new Set(dirSegments);
  for (const cat of categories) {
    const owns = registryTools.some(t => t.categorySlug === cat.slug);
    if (!owns) continue;
    all.add(cat.segment);
    // Sims are manifest-derived and have no src/tools/<segment>/<slug>/ directory, so a segment can
    // be widget-less (physics) or mixed (math: 3 calculators + 3 simulations).
    if (registryTools.some(t => t.categorySlug === cat.slug && manifestBySlug.has(t.slug))) {
      simSegments.add(cat.segment);
    }
  }
  return [...all]
    .sort()
    .map(segment => ({ segment, hasWidgets: dirSegments.has(segment), hasSims: simSegments.has(segment) }));
}

const ASTRO_HEADER = `---
// GENERATED FILE — do not edit. Run \`npm run registries:generate\` to refresh.
// One route per category segment, so this page's import.meta.glob reaches only THIS segment's
// widgets and Astro does not hoist every other tool's CSS onto it. See scripts/generate-registries.ts.`;

export function serializeSegmentRoute(seg: { segment: string; hasWidgets: boolean; hasSims: boolean }): string {
  const { segment, hasWidgets, hasSims } = seg;
  const imports = [
    `import type { GetStaticPaths } from 'astro';`,
    `import ToolPage from '@components/tool/ToolPage.astro';`,
    `import { toolPathsForSegment } from '@lib/tools/segment-paths';`,
  ];
  if (hasSims) {
    imports.push(
      `import SimulationWidget from '@tools/_shared/SimulationWidget.astro';`,
      `import { manifestBySlug } from '@lib/simulation/manifests';`,
      `import { simulationSchemas } from '@lib/simulation/schema';`,
    );
  }

  const body: string[] = [
    ``,
    // The arrow MUST have a block body. With a single-expression body the Astro compiler folds the
    // statements that follow into the getStaticPaths scope, where `Astro` is a stub and reading
    // Astro.props throws UnavailableAstroGlobal at build time.
    `export const getStaticPaths = (() => {`,
    `  return toolPathsForSegment('${segment}');`,
    `}) satisfies GetStaticPaths;`,
    ``,
    `const { tool, category } = Astro.props;`,
  ];

  if (hasSims) {
    body.push(
      `const simManifest = manifestBySlug.get(tool.slug);`,
      `const simSchemas = simManifest ? simulationSchemas(simManifest, Astro.url.href) : [];`,
    );
  }
  if (hasWidgets) {
    // A literal glob pattern is required — Vite resolves it at build time.
    body.push(
      `const widgets = import.meta.glob<{ default: unknown }>('../../../tools/${segment}/*/Widget.astro');`,
      `const WidgetModule = ${hasSims ? 'simManifest ? null : ' : ''}await widgets[\`../../../tools/${segment}/\${tool.slug}/Widget.astro\`]?.();`,
      `const Widget = WidgetModule?.default as any;`,
      `if (${hasSims ? '!simManifest && ' : ''}!Widget) throw new Error(\`No Widget.astro found for tool slug "\${tool.slug}"\`);`,
    );
  }

  const schemasAttr = hasSims ? ' extraSchemas={simSchemas}' : '';
  let slot: string;
  if (hasWidgets && hasSims) {
    slot = `  {simManifest
    ? <SimulationWidget config={tool} simulationId={simManifest.metadata.processorId} examples={simManifest.examples} />
    : <Widget />}`;
  } else if (hasSims) {
    slot = `  <SimulationWidget config={tool} simulationId={simManifest!.metadata.processorId} examples={simManifest!.examples} />`;
  } else {
    slot = `  <Widget />`;
  }

  return `${ASTRO_HEADER}
${imports.join('\n')}
${body.join('\n')}
---

<ToolPage tool={tool} category={category}${schemasAttr}>
${slot}
</ToolPage>
`;
}

export const GENERATED_FILES: { path: string; serialize: (t: DiscoveredTool[]) => string }[] = [
  { path: 'src/data/registry.generated.ts', serialize: serializeToolRegistry },
  { path: 'src/data/faq-registry.generated.ts', serialize: serializeFaqRegistry },
  { path: 'src/data/guide-registry.generated.ts', serialize: serializeGuideRegistry },
  { path: 'src/lib/knowledge/registry.generated.ts', serialize: serializeKnowledgeRegistry },
  ...discoverSegments(discoverTools()).map(seg => ({
    path: `src/pages/tool/${seg.segment}/[slug].astro`,
    serialize: () => serializeSegmentRoute(seg),
  })),
];

/** Repo-relative paths of generated files that are stale (or missing) vs. the tool tree. */
export function staleGeneratedFiles(): string[] {
  const tools = discoverTools();
  const stale: string[] = [];
  for (const { path, serialize } of GENERATED_FILES) {
    const abs = join(repoRoot, path);
    if (!existsSync(abs) || readFileSync(abs, 'utf8') !== serialize(tools)) stale.push(path);
  }
  return stale;
}

function main() {
  const tools = discoverTools();
  for (const { path, serialize } of GENERATED_FILES) {
    const abs = join(repoRoot, path);
    const next = serialize(tools);
    const changed = !existsSync(abs) || readFileSync(abs, 'utf8') !== next;
    if (changed) {
      mkdirSync(dirname(abs), { recursive: true }); // a new category's route dir may not exist yet
      writeFileSync(abs, next);
    }
    console.log(`[generate-registries] ${changed ? 'wrote' : 'up-to-date'} ${path}`);
  }
  console.log(`[generate-registries] ${tools.length} tool dirs discovered.`);
}

// Run only as a CLI entry point (validate-architecture imports the serializers without side effects).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
