/**
 * Derived audit profiles — the entities and search intents a tool's content is
 * scored against. Replaces the requirement that every tool gets a hand-written
 * entry in content-intelligence-rules.json (which covered 8 of 32 tools and
 * went stale). Fallback chain, most-curated source wins:
 *
 *   1. `override`  — content-intelligence-rules.json toolIntents[slug] (optional)
 *   2. `knowledge` — the tool's knowledge.ts overlay via content-graph.json
 *   3. `config`    — tool tags/description via content-graph.json + generic intents
 *
 * The report prints which tier the profile came from so an agent knows how
 * much to trust entity/intent scores.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSpecificEntity } from './terms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export type ProfileSource = 'override' | 'knowledge' | 'config';

export interface ToolProfile {
  source: ProfileSource;
  entities: string[];
  intents: string[];
}

export interface GraphTool {
  name: string;
  segment: string;
  categorySlug: string;
  description: string;
  tags: string[];
  keywords: string[];
  relatedTools: string[];
  hasGuideConfig: boolean;
  guideRegistered: boolean;
  faqRegistered: boolean;
  faqQuestions: string[];
  knowledgeRegistered: boolean;
  knowledge: {
    primaryConcepts: string[];
    secondaryConcepts: string[];
    keywords: string[];
    entityAliases: string[];
    intentGroups: Record<string, string[]>;
    commonQuestions: string[];
    commonMistakes: string[];
    realWorldUseCases: string[];
  } | null;
}

let graphCache: Record<string, GraphTool> | null = null;

/** Loads cache/content-graph.json (run `npm run seo:graph` to refresh). */
export function loadContentGraph(): Record<string, GraphTool> {
  if (graphCache) return graphCache;
  const p = join(ROOT, 'cache', 'content-graph.json');
  if (!existsSync(p)) return (graphCache = {});
  try {
    graphCache = JSON.parse(readFileSync(p, 'utf-8')).tools ?? {};
  } catch {
    graphCache = {};
  }
  return graphCache!;
}

export function getGraphTool(slug: string): GraphTool | null {
  return loadContentGraph()[slug] ?? null;
}

function dedupeCaseInsensitive(items: string[], cap: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
    if (out.length >= cap) break;
  }
  return out;
}

interface OverrideConfig {
  intents: string[];
  entities: string[];
}

export function getToolProfile(
  slug: string,
  overrides: Record<string, OverrideConfig>,
  genericIntents: string[],
): ToolProfile {
  const override = overrides[slug];
  if (override) {
    return { source: 'override', entities: override.entities, intents: override.intents };
  }

  const tool = getGraphTool(slug);
  const kn = tool?.knowledge;
  if (kn) {
    const entities = dedupeCaseInsensitive(
      [...kn.primaryConcepts, ...kn.keywords, ...kn.entityAliases, ...kn.secondaryConcepts],
      12,
    );
    const intents = dedupeCaseInsensitive(
      [...Object.values(kn.intentGroups).flat(), ...kn.commonQuestions],
      8,
    );
    if (entities.length > 0 && intents.length > 0) {
      return { source: 'knowledge', entities, intents };
    }
  }

  // Config tier — junk-filter the tags (they're search phrases, mostly specific,
  // but drop pure-generic ones like "online" or "free tool")
  const allowlist = new Set(slug.split('-').filter(t => t.length > 2));
  const tagEntities = (tool?.tags ?? []).filter(t => isSpecificEntity(t, allowlist));
  const entities = dedupeCaseInsensitive([...tagEntities, ...(tool?.keywords ?? [])], 10);
  return {
    source: 'config',
    entities: entities.length > 0 ? entities : [slug.replace(/-/g, ' ')],
    intents: genericIntents,
  };
}
