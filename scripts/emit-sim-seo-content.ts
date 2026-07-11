// Emits synthetic guide/faq/config text for every simulation manifest into
// seo-engine/.sim-content/<slug>/, so the seo-engine's file-based content analyzer (which reads
// Guide.astro + faq.ts prose from disk) can gate simulations even though they have no per-tool
// source files. The prose comes straight from the manifest, so the gate audits exactly the content
// the site renders. This is a generated cache (like seo-engine/cache/content-graph.json), never
// hand-edited; re-run before seo:gate for a sim. Not part of `npm run build`.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MANIFESTS } from '../src/lib/simulation/manifests';
import { faqItemsFrom, relatedToolSlugs } from '../src/lib/simulation/generate';
import type { SimulationManifest } from '../src/lib/simulation/manifest';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = join(repoRoot, 'seo-engine', '.sim-content');

/** Guide.astro-equivalent markup the seo-engine's extractGuideText understands (h2 + p + blocks). */
function guideAstro(m: SimulationManifest): string {
  const g = m.guide;
  const dot = '<span class="gold-dot" aria-hidden="true"></span>';
  const sections = g.sections
    .map((s) => `  <section id="${s.id}">\n    <h2>${s.heading} ${dot}</h2>\n    <p>${s.body}</p>\n  </section>`)
    .join('\n\n');
  const mistakes = g.mistakes
    .map(
      (mk) =>
        `    <ReferenceBlock type="${mk.type ?? 'common-mistake'}" heading="${mk.heading}">\n      <p>${mk.body}</p>\n    </ReferenceBlock>`,
    )
    .join('\n\n');
  return `---
// GENERATED from ${m.metadata.slug}'s manifest for seo-engine analysis. Do not edit.
---

<GuideLayout>
  <section id="quick-answer">
    <h2>Quick Answer ${dot}</h2>
    <p>${g.quickAnswer}</p>
    <a href="/tool/${m.metadata.category}/${m.metadata.slug}/" class="cta-link">Open The ${m.metadata.title}</a>
  </section>

${sections}

  <section id="common-mistakes">
    <h2>Common Mistakes ${dot}</h2>

${mistakes}
  </section>
</GuideLayout>
`;
}

/** faq.ts-equivalent source the seo-engine's extractFaqText understands (question/answer pairs). */
function faqSource(m: SimulationManifest): string {
  const items = faqItemsFrom(m)
    .map((f) => `  {\n    question: ${JSON.stringify(f.question)},\n    answer: ${JSON.stringify(f.answer)},\n  },`)
    .join('\n');
  return `// GENERATED from ${m.metadata.slug}'s manifest. Do not edit.\nexport const items = [\n${items}\n];\n`;
}

/** Minimal config.ts carrying the fields the analyzer text-scans (relatedTools, seo). */
function configSource(m: SimulationManifest): string {
  return `// GENERATED from ${m.metadata.slug}'s manifest. Do not edit.
export const config = {
  slug: ${JSON.stringify(m.metadata.slug)},
  seoTitle: ${JSON.stringify(m.seo.title)},
  description: ${JSON.stringify(m.seo.description)},
  tags: ${JSON.stringify(m.presentation.tags)},
  relatedTools: ${JSON.stringify(relatedToolSlugs(m))},
};
`;
}

rmSync(outRoot, { recursive: true, force: true });
for (const m of MANIFESTS) {
  const dir = join(outRoot, m.metadata.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'Guide.astro'), guideAstro(m));
  writeFileSync(join(dir, 'faq.ts'), faqSource(m));
  writeFileSync(join(dir, 'config.ts'), configSource(m));
}
console.log(`[emit-sim-seo-content] wrote ${MANIFESTS.length} sim content bundle(s) to seo-engine/.sim-content/`);
