// Exports a JSON snapshot of the live TS registries for the SEO engine.
//
// The seo-engine sub-package cannot import src/ TypeScript directly (separate tsconfig,
// path aliases, .astro imports), so this script is the single bridge: it serializes
// everything the engine needs (registration state, knowledge overlay, tags) to
// seo-engine/cache/content-graph.json. seo:status, seo:doctor, and the audit's derived
// tool profiles all consume that file instead of hand-maintained lists.
//
// Run via `npm run seo:graph`. Cheap and deterministic; callers re-run it freely.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { registeredGuideSlugSet } from '../src/data/guide-registry';
import { faqsByToolSlug } from '../src/data/faq-registry';
import { KNOWLEDGE } from '../src/lib/knowledge/registry';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'seo-engine', 'cache', 'content-graph.json');

const segmentByCategory = new Map(categories.map(c => [c.slug, c.segment]));

const graph = {
  generatedAt: new Date().toISOString(),
  tools: Object.fromEntries(
    tools.map(tool => {
      const knowledge = KNOWLEDGE.get(tool.slug);
      const faqs = faqsByToolSlug[tool.slug] ?? [];
      return [
        tool.slug,
        {
          name: tool.name,
          segment: segmentByCategory.get(tool.categorySlug) ?? tool.categorySlug,
          categorySlug: tool.categorySlug,
          description: tool.description,
          tags: tool.tags,
          keywords: tool.keywords ?? [],
          relatedTools: tool.relatedTools ?? [],
          hasGuideConfig: Boolean(tool.guide),
          guideRegistered: registeredGuideSlugSet.has(tool.slug),
          faqRegistered: faqs.length > 0,
          faqQuestions: faqs.map(f => f.question),
          knowledgeRegistered: Boolean(knowledge),
          knowledge: knowledge
            ? {
                primaryConcepts: knowledge.primaryConcepts,
                secondaryConcepts: knowledge.secondaryConcepts,
                keywords: knowledge.keywords,
                entityAliases: knowledge.entityAliases,
                intentGroups: knowledge.intentGroups,
                commonQuestions: knowledge.commonQuestions,
                commonMistakes: knowledge.commonMistakes,
                realWorldUseCases: knowledge.realWorldUseCases,
              }
            : null,
        },
      ];
    }),
  ),
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(graph, null, 2) + '\n');
console.log(`[export-content-graph] wrote ${Object.keys(graph.tools).length} tools → seo-engine/cache/content-graph.json`);
