/**
 * SEO + GEO validation across all processed research.json files.
 * Usage: tsx scripts/validate.ts
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateSeoScore, calculateGeoScore } from './utils/scoring.js';
import type { ResearchDocument, ValidationResult } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROCESSED_DIR = join(ROOT, 'research', 'processed');
const REPORTS_DIR = join(ROOT, 'reports');

if (!existsSync(PROCESSED_DIR)) {
  console.error('No processed research found. Run seo:extract first.');
  process.exit(1);
}

const toolDirs = readdirSync(PROCESSED_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

if (toolDirs.length === 0) {
  console.error('No tool research directories found.');
  process.exit(1);
}

console.log(`\n=== SEO + GEO Validation ===\n`);
console.log(`Found ${toolDirs.length} tool(s) to validate\n`);

mkdirSync(REPORTS_DIR, { recursive: true });

let totalSeo = 0;
let totalGeo = 0;
let count = 0;

for (const toolSlug of toolDirs) {
  const researchPath = join(PROCESSED_DIR, toolSlug, 'research.json');
  if (!existsSync(researchPath)) {
    console.warn(`  [skip] ${toolSlug}: research.json not found`);
    continue;
  }

  const doc = JSON.parse(readFileSync(researchPath, 'utf-8')) as ResearchDocument;
  const seo = calculateSeoScore(doc);
  const geo = calculateGeoScore(doc);

  const result: ValidationResult = {
    tool: toolSlug,
    seo,
    geo,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(join(REPORTS_DIR, `validation-${toolSlug}.json`), JSON.stringify(result, null, 2));

  totalSeo += seo.score;
  totalGeo += geo.score;
  count++;

  // Console output
  console.log(`─────────────────────────────────────`);
  console.log(`Tool: ${toolSlug}`);
  console.log(`SEO Score: ${seo.score}/100`);
  console.log(`GEO Score: ${geo.score}/100`);

  if (seo.issues.length > 0) {
    console.log('\nSEO Issues:');
    seo.issues.forEach(i => console.log(`  - ${i}`));
  }
  if (geo.issues.length > 0) {
    console.log('\nGEO Issues:');
    geo.issues.forEach(i => console.log(`  - ${i}`));
  }
  console.log('');
}

if (count > 1) {
  console.log(`─────────────────────────────────────`);
  console.log(`Average SEO Score: ${Math.round(totalSeo / count)}/100`);
  console.log(`Average GEO Score: ${Math.round(totalGeo / count)}/100`);
}

console.log(`\nValidation reports written to: reports/validation-<tool>.json\n`);
