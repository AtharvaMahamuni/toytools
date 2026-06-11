// Relationship graph builder. Build-time only, constructed once at module load and exposed
// as prebuilt adjacency maps for near-O(1) queries. Pure core (buildGraph) takes its inputs
// so it's testable with fixtures; a default `graph` instance is built over the real registries.
//
// Node urls are LOGICAL site-relative paths (no base prefix); Astro components apply withBase().

import type { ToolConfig, Category } from '@data/types';
import { tools as allTools } from '@data/registry';
import { categories as allCategories } from '@data/categories';
import { KNOWLEDGE } from './registry';
import { getRelatedTools, getRelatedGuides, relationTier, tierStrength } from '@lib/tools/related';
import {
  CONTENT_TYPES,
  RELATION_TYPES,
  type GraphNode,
  type GraphEdge,
  type KnowledgeGraph,
  type Knowledge,
  type RelationshipReference,
} from './types';

const DERIVE_MAX = 6;

function segmentOf(categorySlug: string, categories: Category[]): string {
  return categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;
}

const nodeId = (type: string, slug: string) => `${type}:${slug}`;

function toolUrl(t: ToolConfig, categories: Category[]): string {
  return `/tool/${segmentOf(t.categorySlug, categories)}/${t.slug}/`;
}

/** Build the full content graph from explicit inputs. Pure — no module-level registry reads. */
export function buildGraph(
  tools: ToolConfig[],
  categories: Category[],
  knowledge: Map<string, Knowledge>,
): KnowledgeGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const toolBySlug = new Map(tools.map(t => [t.slug, t]));

  // Category nodes
  for (const c of categories) {
    nodes.push({
      id: nodeId(CONTENT_TYPES.CATEGORY, c.slug),
      type: CONTENT_TYPES.CATEGORY,
      slug: c.slug,
      title: c.name,
      category: c.slug,
      url: `/category/${c.slug}/`,
    });
  }

  // Tool / guide nodes (FAQ content lives on the tool page — no standalone FAQ nodes)
  for (const t of tools) {
    const url = toolUrl(t, categories);
    nodes.push({
      id: nodeId(CONTENT_TYPES.TOOL, t.slug),
      type: CONTENT_TYPES.TOOL,
      slug: t.slug,
      title: t.name,
      category: t.categorySlug,
      url,
    });
    if (t.guide) {
      nodes.push({
        id: nodeId(CONTENT_TYPES.GUIDE, t.slug),
        type: CONTENT_TYPES.GUIDE,
        slug: t.slug,
        title: t.guide.title,
        category: t.categorySlug,
        url: `/guide/${t.guide.categorySlug}/${t.guide.slug}/`,
      });
    }
  }

  const pushEdge = (
    fromType: string,
    fromSlug: string,
    toType: string,
    toSlug: string,
    type: string,
    extra?: Partial<GraphEdge>,
  ) => {
    edges.push({
      from: nodeId(fromType, fromSlug),
      to: nodeId(toType, toSlug),
      type,
      ...extra,
    });
  };

  // Edges per tool
  for (const t of tools) {
    // BELONGS_TO_CATEGORY
    pushEdge(CONTENT_TYPES.TOOL, t.slug, CONTENT_TYPES.CATEGORY, t.categorySlug, RELATION_TYPES.BELONGS_TO_CATEGORY);

    // Derived RELATED_TOOL / RELATED_GUIDE (with tier-based strength)
    for (const rel of getRelatedTools(t, tools, DERIVE_MAX)) {
      pushEdge(CONTENT_TYPES.TOOL, t.slug, CONTENT_TYPES.TOOL, rel.slug, RELATION_TYPES.RELATED_TOOL, {
        strength: tierStrength(relationTier(t, rel)),
      });
    }
    for (const rel of getRelatedGuides(t, tools, DERIVE_MAX)) {
      pushEdge(CONTENT_TYPES.TOOL, t.slug, CONTENT_TYPES.GUIDE, rel.slug, RELATION_TYPES.RELATED_GUIDE, {
        strength: tierStrength(relationTier(t, rel)),
      });
    }
    // Overlay edges from the knowledge file (curated, with reason/strength/priority preserved)
    const kn = knowledge.get(t.slug);
    if (!kn) continue;
    const overlay = (refs: RelationshipReference[], type: string) => {
      for (const r of refs) {
        if (!toolBySlug.has(r.slug)) continue; // unresolved refs are caught by validate-knowledge
        pushEdge(CONTENT_TYPES.TOOL, t.slug, CONTENT_TYPES.TOOL, r.slug, type, {
          reason: r.reason,
          strength: r.strength,
          priority: r.priority,
        });
      }
    };
    overlay(kn.usedWith, RELATION_TYPES.USED_WITH);
    overlay(kn.alternatives, RELATION_TYPES.ALTERNATIVE);
    overlay(kn.nextSteps, RELATION_TYPES.NEXT_STEP);
  }

  // Adjacency map for O(1) outgoing-edge lookups
  const adjacency = new Map<string, GraphEdge[]>();
  for (const e of edges) {
    const list = adjacency.get(e.from);
    if (list) list.push(e);
    else adjacency.set(e.from, [e]);
  }

  return { nodes, edges, adjacency };
}

/** Default graph over the real registries. Built once at module load (build-time). */
export const graph: KnowledgeGraph = buildGraph(allTools, allCategories, KNOWLEDGE);
