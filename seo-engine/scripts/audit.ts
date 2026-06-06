/**
 * Generates reports/audit.md from all validated research.
 * Usage: tsx scripts/audit.ts
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateSeoScore, calculateGeoScore } from './utils/scoring.js';
import { calculateWritingScore } from './writing.js';
import type { ResearchDocument } from '../types/index.js';

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

console.log(`\n=== SEO Audit Engine ===\n`);
console.log(`Auditing ${toolDirs.length} tool(s)...\n`);

mkdirSync(REPORTS_DIR, { recursive: true });

const date = new Date().toISOString().split('T')[0];
const lines: string[] = [`# SEO Audit — ${date}`, ''];

let audited = 0;

for (const toolSlug of toolDirs) {
  const researchPath = join(PROCESSED_DIR, toolSlug, 'research.json');
  if (!existsSync(researchPath)) continue;

  const doc = JSON.parse(readFileSync(researchPath, 'utf-8')) as ResearchDocument;
  const seo = calculateSeoScore(doc);
  const geo = calculateGeoScore(doc);

  // Generate recommendations from issues
  const recommendations: string[] = [];

  for (const issue of seo.issues) {
    if (issue.includes('entities')) recommendations.push('Expand entity coverage: add technical terms from competitor headings');
    if (issue.includes('questions')) recommendations.push('Extract more questions from People Also Ask and FAQ sections');
    if (issue.includes('content gaps')) recommendations.push('Run extraction on more competitor pages to identify more gap topics');
    if (issue.includes('competitor headings')) recommendations.push('Fetch and analyze additional competitor pages');
    if (issue.includes('FAQs')) recommendations.push('Target sites with FAQ schema markup for richer question data');
    if (issue.includes('intent')) recommendations.push('Review tool slug and heading structure for intent signals');
  }

  for (const issue of geo.issues) {
    if (issue.includes('definition')) recommendations.push('Ensure "What is X?" question is covered in research');
    if (issue.includes('comparison')) recommendations.push('Add comparison coverage: X vs Y, difference between X and Y');
    if (issue.includes('troubleshooting')) recommendations.push('Add troubleshooting coverage: common errors, fixes, edge cases');
    if (issue.includes('entity')) recommendations.push('Increase entity coverage to improve GEO snippet extractability');
    if (issue.includes('FAQs')) recommendations.push('Identify FAQ-rich competitor pages for GEO snippet data');
    if (issue.includes('related topics')) recommendations.push('Identify related topics to improve contextual relevance');
  }

  // Notable content gaps as specific recommendations
  if (doc.contentGaps.length > 0) {
    const topGaps = doc.contentGaps.slice(0, 3);
    topGaps.forEach(gap => recommendations.push(`Add section: ${gap}`));
  }

  const toolDisplay = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Writing score — analyze guide outline if available
  const outlinePath = join(ROOT, 'output', toolSlug, 'guide.outline.md');
  let writing = null;
  if (existsSync(outlinePath)) {
    const md = readFileSync(outlinePath, 'utf-8');
    const ws = calculateWritingScore(md);
    if (ws.score > 0) writing = ws;
  }

  lines.push(`## ${toolDisplay}`);
  lines.push('');
  lines.push(`**SEO Score:** ${seo.score}/100`);
  lines.push(`**GEO Score:** ${geo.score}/100`);
  if (writing) {
    lines.push(`**Writing Score:** ${writing.score}/100  |  **ToyTools Style Match:** ${writing.toyToolsStyleScore}/100`);
  }
  lines.push(`**Primary Intent:** ${doc.primaryIntent}`);
  lines.push(`**Secondary Intent:** ${doc.secondaryIntent}`);
  lines.push(`**Entities:** ${doc.entities.length} | **Questions:** ${doc.questions.length} | **Competitor FAQs:** ${doc.competitorFaqs.length}`);
  lines.push('');

  const allIssues = [...new Set([...seo.issues, ...geo.issues])];
  if (allIssues.length > 0) {
    lines.push('### Issues');
    allIssues.forEach(i => lines.push(`- ${i}`));
    lines.push('');
  }

  if (recommendations.length > 0) {
    lines.push('### Recommendations');
    [...new Set(recommendations)].forEach(r => lines.push(`- ${r}`));
    lines.push('');
  }

  if (doc.contentGaps.length > 0) {
    lines.push('### Content Gaps');
    doc.contentGaps.slice(0, 10).forEach(g => lines.push(`- ${g}`));
    lines.push('');
  }

  if (doc.competitorHeadings.length > 0) {
    lines.push('### Must-Have Sections (Competitor Consensus)');
    doc.competitorHeadings.slice(0, 10).forEach(h => lines.push(`- ${h}`));
    lines.push('');
  }

  if (writing && writing.issues.length > 0) {
    lines.push('### Writing Issues');
    writing.issues.forEach(i => lines.push(`- ${i}`));
    lines.push('');
  }

  if (writing && writing.recommendations.length > 0) {
    lines.push('### Writing Recommendations');
    writing.recommendations.forEach(r => lines.push(`- ${r}`));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  audited++;
  const writingInfo = writing ? ` | Writing: ${writing.score} | Style: ${writing.toyToolsStyleScore}` : '';
  console.log(`  Audited: ${toolSlug} (SEO: ${seo.score} | GEO: ${geo.score}${writingInfo})`);
}

const auditPath = join(REPORTS_DIR, 'audit.md');
writeFileSync(auditPath, lines.join('\n'));

console.log(`\n=== Audit complete ===`);
console.log(`  Tools audited: ${audited}`);
console.log(`  Output: reports/audit.md\n`);
