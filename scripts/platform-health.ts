// Platform health report — a post-build, platform-wide integrity superset. Where
// validate-registry is the fast pre-build gate on tool configs, this verifies the whole
// platform hangs together: metadata, cross-references, manifest/registry agreement, search
// index generation, and (when dist exists) sitemap output. Critical failures exit non-zero.
//
// Run: npm run health   (intended for CI, after `npm run build`)

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tools, toolsWithGuide } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { engineIds } from '../src/data/engines';
import { getAllMetadata } from '../src/data/metadata';
import { buildContentManifest, contentByType } from '../src/lib/content/manifest';
import { buildSearchIndex } from '../src/lib/search';
import { KNOWLEDGE_ENTRIES } from '../src/lib/knowledge/registry';
import { collectUrls } from '../src/lib/indexnow/collectUrls';
import { INDEXNOW_HOST, INDEXNOW_KEY, INDEXNOW_KEY_FILENAME } from '../src/config/indexnow';

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
    'sitemaps/categories.xml',
  ];
  for (const f of required) {
    if (!existsSync(join(dist, f))) errors.push(`Sitemap file missing from dist: ${f}`);
  }


  // 6b. No indexable tool page may be a dead end in the internal link graph.
  //
  // Measured 2026-08-18: 47 of 121 tool pages linked to no other tool at all, and the median page
  // linked to four, every one of them a tool-group pill pointing at a near-identical sibling. The
  // cause was a 2026-08 layout cleanup that removed the related-tools block on the reasoning that
  // "the catalog is one click away either way" — true for a reader, false for a crawler, because a
  // category link hands authority to a hub that splits it across up to eighteen tools while a
  // tool-to-tool link is a topical signal between two specific pages.
  //
  // This is a floor, not a target: one link is enough to stop being a dead end, and the derivation
  // in src/lib/tools/related.ts decides how many there actually are. Redirect stubs are excluded
  // structurally, by their meta refresh, the same way Quality Guardian's canonical validator does
  // it — never by a list of paths, which goes stale the first time a slug is renamed.
  const deadEnds: string[] = [];
  for (const t of tools) {
    const category = categories.find(c => c.slug === t.categorySlug);
    const page = join(dist, 'tool', category?.segment ?? t.categorySlug, t.slug, 'index.html');
    if (!existsSync(page)) continue;
    const html = readFileSync(page, 'utf8');
    if (html.includes('<meta http-equiv="refresh"')) continue;
    const linked = new Set(
      [...html.matchAll(/href="[^"]*?\/tool\/[^"/]+\/([^"/]+)\//g)].map(m => m[1]!),
    );
    linked.delete(t.slug);
    if (linked.size === 0) deadEnds.push(t.slug);
  }
  if (deadEnds.length > 0) {
    errors.push(
      `${deadEnds.length} tool page(s) link to no other tool, which makes them dead ends for a ` +
      `crawler: ${deadEnds.slice(0, 8).join(', ')}${deadEnds.length > 8 ? ', …' : ''}. ` +
      `Related tools are derived (src/lib/tools/related.ts) and rendered in Zone C.`,
    );
  }
} else {
  warnings.push('dist/ not found — skipped sitemap output check (run `npm run build` first).');
}

// 7. IndexNow coverage + key file integrity. WARN-only (per spec) — IndexNow must never block
// a deploy. The URL list is derived from the same manifest, so this catches drift early.
{
  const indexnowUrls = collectUrls();
  const urlSet = new Set(indexnowUrls);

  if (!INDEXNOW_HOST) warnings.push('IndexNow: missing host.');
  if (!INDEXNOW_KEY) warnings.push('IndexNow: missing key.');
  if (indexnowUrls.length === 0) warnings.push('IndexNow: collected 0 URLs.');

  // Homepage + every public surface present.
  const expectHome = new URL('/', `https://${INDEXNOW_HOST}`).href;
  if (!urlSet.has(expectHome)) warnings.push('IndexNow: homepage URL missing from collection.');
  const expectAll = (type: 'tool' | 'guide' | 'category') =>
    contentByType(type).forEach(e => {
      const abs = new URL(e.url, `https://${INDEXNOW_HOST}`).href;
      if (!urlSet.has(abs)) warnings.push(`IndexNow: ${type} URL missing from collection: ${e.url}`);
    });
  expectAll('tool');
  expectAll('guide');
  expectAll('category');

  // No duplicates; https-only; canonical host only.
  if (urlSet.size !== indexnowUrls.length) warnings.push('IndexNow: duplicate URLs in collection.');
  for (const u of indexnowUrls) {
    const parsed = new URL(u);
    if (parsed.protocol !== 'https:') warnings.push(`IndexNow: non-https URL: ${u}`);
    if (parsed.hostname !== INDEXNOW_HOST) warnings.push(`IndexNow: off-host URL: ${u}`);
  }

  // Key file present in public/ and content === key (the "invalid key file path" check).
  const keyFile = join(process.cwd(), 'public', INDEXNOW_KEY_FILENAME);
  if (!existsSync(keyFile)) {
    warnings.push(`IndexNow: key file missing at public/${INDEXNOW_KEY_FILENAME}.`);
  } else if (readFileSync(keyFile, 'utf8').trim() !== INDEXNOW_KEY) {
    warnings.push(`IndexNow: key file public/${INDEXNOW_KEY_FILENAME} content does not match the configured key.`);
  }
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
