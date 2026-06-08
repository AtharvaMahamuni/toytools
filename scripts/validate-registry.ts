import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { HASHERS } from '../src/lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';

const KNOWN_ENGINES = new Set(['text-analysis', 'text-processor', 'encoding', 'hashing', 'structured-data']);
const KNOWN_PATTERNS = new Set(['text-metric', 'text-transform', 'text-cleanup', 'encode-decode', 'hash', 'structured-transform', 'structured-validate']);

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

  // text-processor tools must reference a registered processor
  if (tool.engine === 'text-processor') {
    if (!tool.processorId) {
      errors.push(`Tool "${tool.slug}" uses engine "text-processor" but is missing processorId`);
    } else if (!PROCESSORS[tool.processorId]) {
      errors.push(`Tool "${tool.slug}" references unknown processorId "${tool.processorId}" — register it in src/lib/text/processors/registry.ts`);
    }
  }

  // encoding tools must reference a registered encoder
  if (tool.engine === 'encoding') {
    if (!tool.processorId) {
      errors.push(`Tool "${tool.slug}" uses engine "encoding" but is missing processorId`);
    } else if (!ENCODERS[tool.processorId]) {
      errors.push(`Tool "${tool.slug}" references unknown encoder "${tool.processorId}" — register it in src/lib/engines/encoding/registry.ts`);
    }
  }

  // hashing tools must reference a registered hasher
  if (tool.engine === 'hashing') {
    if (!tool.processorId) {
      errors.push(`Tool "${tool.slug}" uses engine "hashing" but is missing processorId`);
    } else if (!HASHERS[tool.processorId]) {
      errors.push(`Tool "${tool.slug}" references unknown hasher "${tool.processorId}" — register it in src/lib/engines/hashing/registry.ts`);
    }
  }

  // structured-data tools must reference a registered tool
  if (tool.engine === 'structured-data') {
    if (!tool.processorId) {
      errors.push(`Tool "${tool.slug}" uses engine "structured-data" but is missing processorId`);
    } else if (!STRUCTURED_TOOLS[tool.processorId]) {
      errors.push(`Tool "${tool.slug}" references unknown structured-data tool "${tool.processorId}" — register it in src/lib/engines/structured-data/registry.ts`);
    }
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
