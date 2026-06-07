import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';

const KNOWN_ENGINES = new Set(['text-analysis']);
const KNOWN_PATTERNS = new Set(['text-metric', 'text-transform', 'text-cleanup']);

const categorySlugSet = new Set(categories.map(c => c.slug));
const slugsSeen = new Set<string>();
const errors: string[] = [];

for (const tool of tools) {
  // Required fields
  if (!tool.slug) errors.push(`Tool missing slug: ${JSON.stringify(tool)}`);
  if (!tool.name) errors.push(`Tool "${tool.slug}" missing name`);
  if (!tool.description) errors.push(`Tool "${tool.slug}" missing description`);
  if (!tool.categorySlug) errors.push(`Tool "${tool.slug}" missing categorySlug`);
  if (!tool.tags?.length) errors.push(`Tool "${tool.slug}" missing tags`);

  // Unique slugs
  if (slugsSeen.has(tool.slug)) {
    errors.push(`Duplicate slug: "${tool.slug}"`);
  }
  slugsSeen.add(tool.slug);

  // Valid category
  if (tool.categorySlug && !categorySlugSet.has(tool.categorySlug)) {
    errors.push(`Tool "${tool.slug}" references unknown category "${tool.categorySlug}"`);
  }

  // Valid engine (when provided)
  if (tool.engine && !KNOWN_ENGINES.has(tool.engine)) {
    errors.push(`Tool "${tool.slug}" uses unknown engine "${tool.engine}" — add it to KNOWN_ENGINES in validate-registry.ts`);
  }

  // Valid pattern (when provided)
  if (tool.pattern && !KNOWN_PATTERNS.has(tool.pattern)) {
    errors.push(`Tool "${tool.slug}" uses unknown pattern "${tool.pattern}" — add it to KNOWN_PATTERNS in validate-registry.ts`);
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
