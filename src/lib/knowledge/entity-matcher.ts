// EntityMatcher — detects mentions of tool concepts/aliases in free text and maps them back to
// tool slugs. Config-driven: the surface-form index is built entirely from knowledge files +
// tool names. NO hardcoded keyword lists. This phase RETURNS matches only; prose rewriting is
// deferred to Phase E. Matching is token-boundary based (not naive substring) to avoid false
// positives like "json" inside "jsonp".

import { tools as allTools } from '@data/registry';
import { KNOWLEDGE_ENTRIES } from './registry';
import type { Knowledge } from './types';
import type { ToolConfig } from '@data/types';

export interface EntityIndexItem {
  term: string;      // normalized (lowercased) surface form
  slug: string;      // target tool slug
  score: number;     // disambiguation weight (primaryConcept 100 … keyword 40)
}

export interface EntityMatch {
  term: string;      // the surface form as it appeared (original case)
  slug: string;
  start: number;     // index in source content
  end: number;       // exclusive
  score: number;
}

const SCORE = {
  primary: 100,
  secondary: 60,
  alias: 60,
  name: 80,
  keyword: 40,
} as const;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** Build a surface-form → {slug, score} index. Pure, so tests pass fixtures. */
export function buildEntityIndex(
  knowledge: Knowledge[],
  tools: ToolConfig[],
): Map<string, EntityIndexItem> {
  // Highest score wins when the same surface form maps to multiple sources.
  const index = new Map<string, EntityIndexItem>();
  const add = (rawTerm: string, slug: string, score: number) => {
    const term = normalize(rawTerm);
    if (!term) return;
    const existing = index.get(term);
    if (!existing || score > existing.score) {
      index.set(term, { term, slug, score });
    }
  };

  const toolBySlug = new Map(tools.map(t => [t.slug, t]));

  for (const kn of knowledge) {
    if (!toolBySlug.has(kn.slug)) continue;
    kn.primaryConcepts.forEach(c => add(c, kn.slug, SCORE.primary));
    kn.secondaryConcepts.forEach(c => add(c, kn.slug, SCORE.secondary));
    kn.entityAliases.forEach(a => add(a, kn.slug, SCORE.alias));
    kn.keywords.forEach(k => add(k, kn.slug, SCORE.keyword));
    const tool = toolBySlug.get(kn.slug);
    if (tool) add(tool.name, kn.slug, SCORE.name);
  }

  return index;
}

/**
 * Find entity mentions in `content`. Token-boundary matching, case-insensitive.
 * Disambiguation: longest surface form wins; ties broken by highest score.
 */
export function getEntityMatches(
  content: string,
  index: Map<string, EntityIndexItem> = defaultIndex,
): EntityMatch[] {
  if (!content) return [];

  // Candidate terms sorted longest-first so multi-word forms win over their sub-tokens.
  const terms = [...index.values()].sort((a, b) => b.term.length - a.term.length);
  const matches: EntityMatch[] = [];
  const claimed: Array<[number, number]> = []; // occupied [start,end) spans

  const overlaps = (s: number, e: number) =>
    claimed.some(([cs, ce]) => s < ce && e > cs);

  for (const item of terms) {
    // \b…\b token boundaries; escape regex metachars in the term.
    const escaped = item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (overlaps(start, end)) continue; // a longer term already claimed this span
      matches.push({ term: m[0], slug: item.slug, start, end, score: item.score });
      claimed.push([start, end]);
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

/** Default index over the real registries. */
export const defaultIndex: Map<string, EntityIndexItem> = buildEntityIndex(KNOWLEDGE_ENTRIES, allTools);
