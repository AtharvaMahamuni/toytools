// Platform health report — a post-build, platform-wide integrity superset. Where
// validate-registry is the fast pre-build gate on tool configs, this verifies the whole
// platform hangs together: metadata, cross-references, manifest/registry agreement, search
// index generation, and (when dist exists) sitemap output. Critical failures exit non-zero.
//
// Run: npm run health   (intended for CI, after `npm run build`)

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tools, toolsWithGuide } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { engineIds } from '../src/data/engines';
import { getAllMetadata } from '../src/data/metadata';
import { buildContentManifest, contentByType } from '../src/lib/content/manifest';
import { buildSearchIndex } from '../src/lib/search';
import { KNOWLEDGE_ENTRIES } from '../src/lib/knowledge/registry';

const errors: string[] = [];
const warnings: string[] = [];

const categorySlugs = new Set(categories.map(c => c.slug));
const allSlugs = new Set(tools.map(t => t.slug));
const metadata = getAllMetadata();

// 1. Metadata completeness + reference integrity
const seenSlugs = new Set<string>();
for (const m of metadata) {
  for (const [field, val] of Object.entries({
    slug: m.slug, name: m.name, description: m.description,
    category: m.category, engine: m.engine, pattern: m.pattern, family: m.family,
  })) {
    if (!val) errors.push(`Tool "${m.slug || '?'}" missing ${field}`);
  }
  if (seenSlugs.has(m.slug)) errors.push(`Duplicate slug: "${m.slug}"`);
  seenSlugs.add(m.slug);

  if (m.engine && !engineIds.has(m.engine)) errors.push(`Tool "${m.slug}" references unknown engine "${m.engine}"`);
  if (m.category && !categorySlugs.has(m.category)) errors.push(`Tool "${m.slug}" references unknown category "${m.category}"`);
  for (const rel of m.relatedTools) {
    if (!allSlugs.has(rel)) errors.push(`Tool "${m.slug}" references unknown relatedTool "${rel}"`);
  }
}

// 2. Guide references resolve
for (const t of tools) {
  if (t.guide && !t.guide.slug) errors.push(`Tool "${t.slug}" guide config missing slug`);
}

// 3. Duplicate URLs across the content manifest
const manifest = buildContentManifest();
const seenUrls = new Set<string>();
for (const e of manifest) {
  if (seenUrls.has(e.url)) errors.push(`Duplicate URL in content manifest: "${e.url}"`);
  seenUrls.add(e.url);
}

// 4. Content manifest counts agree with the registry
const checkCount = (label: string, actual: number, expected: number) => {
  if (actual !== expected) errors.push(`Content manifest ${label} count ${actual} ≠ registry ${expected}`);
};
checkCount('tool', contentByType('tool').length, tools.length);
checkCount('guide', contentByType('guide').length, toolsWithGuide.length);
checkCount('category', contentByType('category').length, categories.length);

// 5. Search index generation succeeds and covers every tool
try {
  const index = buildSearchIndex();
  if (index.length !== tools.length) errors.push(`Search index covers ${index.length} tools, expected ${tools.length}`);
} catch (e) {
  errors.push(`Search index generation threw: ${(e as Error).message}`);
}

// 6. Sitemap output exists (post-build). A missing dist is a warning, not a failure.
const dist = join(process.cwd(), 'dist');
if (existsSync(dist)) {
  const required = [
    'sitemap-index.xml',
    'sitemaps/tools.xml', 'sitemaps/guides.xml',
    'sitemaps/categories.xml', 'sitemaps/languages.xml',
  ];
  for (const f of required) {
    if (!existsSync(join(dist, f))) errors.push(`Sitemap file missing from dist: ${f}`);
  }
} else {
  warnings.push('dist/ not found — skipped sitemap output check (run `npm run build` first).');
}

// Report
if (warnings.length) {
  console.warn('\n[platform-health] Warnings:');
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}
if (errors.length > 0) {
  console.error('\n[platform-health] Critical failures:\n');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} failure(s).\n`);
  process.exit(1);
} else {
  const knowledgeCovered = KNOWLEDGE_ENTRIES.length;
  console.log(`\n[platform-health] OK — ${tools.length} tools, ${engineIds.size} engines, ${manifest.length} content entries, all references resolve.`);
  console.log(`[platform-health] Knowledge coverage: ${knowledgeCovered}/${tools.length} tools have knowledge files.\n`);
}
