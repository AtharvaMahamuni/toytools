import type { ToolConfig } from './types';
import { simulationTools } from '@lib/simulation/derived';
import { toolConfigs } from './registry.generated';
import { isEmbeddable } from './embeddable';

// A tool exists because its directory conforms to the contract
// (src/tools/<segment>/<slug>/config.ts) — registration is DERIVED, never hand-edited.
// `registry.generated.ts` is written by `npm run registries:generate` (run automatically by
// scaffold:tool); validate-architecture fails the build when it is stale. Simulation tools are
// derived from their manifests (src/lib/simulation) and spread in the same way.
export const tools: ToolConfig[] = [...simulationTools, ...toolConfigs];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);

/**
 * The derived `embeddable` flag for every tool, by slug (src/data/embeddable.ts). Data only: no
 * route, layout or widget reads it yet. Kept beside the configs rather than written into them, so
 * no ToolConfig is edited and nothing that serializes a config changes.
 */
export const embeddable: ReadonlyMap<string, boolean> = new Map(
  tools.map(t => [t.slug, isEmbeddable(t)]),
);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
