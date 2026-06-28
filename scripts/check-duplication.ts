// Content duplication detector — guards against the catalog reading "mass-produced" as it scales.
//
// Compares the high-signal authored text fields across tools (descriptions, FAQ answers, knowledge
// summaries, common-mistakes) and flags near-duplicate pairs using word-shingle Jaccard similarity.
// WARN-only by default (duplication is sometimes a deliberate call); pass --strict to fail the run
// (e.g. to gate a content PR once the catalog is clean).
//
// No external deps. Run: `npm run check:duplication` (add `-- --strict` to fail on findings).

import { tools } from '../src/data/registry';
import { faqsByToolSlug } from '../src/data/faq-registry';
import { KNOWLEDGE } from '../src/lib/knowledge/registry';

const strict = process.argv.includes('--strict');

// k-word shingles → Jaccard. k=3 balances sensitivity (catches reworded boilerplate) against noise.
const K = 3;
function shingles(text: string): Set<string> {
  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.length < K) return new Set(tokens);
  const out = new Set<string>();
  for (let i = 0; i <= tokens.length - K; i++) out.add(tokens.slice(i, i + K).join(' '));
  return out;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

interface Item { id: string; text: string; shingles: Set<string> }
interface Group { label: string; threshold: number; minTokens: number; items: Item[] }

const groups: Group[] = [
  { label: 'tool descriptions', threshold: 0.55, minTokens: 6, items: [] },
  { label: 'FAQ answers',       threshold: 0.6,  minTokens: 8, items: [] },
  { label: 'knowledge summaries', threshold: 0.55, minTokens: 6, items: [] },
  { label: 'common mistakes',   threshold: 0.7,  minTokens: 4, items: [] },
];
const [descriptions, faqAnswers, summaries, mistakes] = groups;

for (const t of tools) {
  if (t.description) descriptions.items.push(mk(t.slug, t.description));
  for (const item of faqsByToolSlug[t.slug] ?? []) {
    faqAnswers.items.push(mk(`${t.slug}#${item.id}`, item.answer));
  }
}
for (const k of KNOWLEDGE.values()) {
  if (k.summary) summaries.items.push(mk(k.slug, k.summary));
  (k.commonMistakes ?? []).forEach((m, i) => mistakes.items.push(mk(`${k.slug}[${i}]`, m)));
}

function mk(id: string, text: string): Item {
  return { id, text, shingles: shingles(text) };
}

let findings = 0;
for (const g of groups) {
  const pairs: string[] = [];
  for (let i = 0; i < g.items.length; i++) {
    const a = g.items[i];
    if (a.shingles.size < g.minTokens) continue;
    for (let j = i + 1; j < g.items.length; j++) {
      const b = g.items[j];
      if (b.shingles.size < g.minTokens) continue;
      const sim = jaccard(a.shingles, b.shingles);
      if (sim >= g.threshold) {
        pairs.push(`  ⚠ ${(sim * 100).toFixed(0)}%  ${a.id}  ≈  ${b.id}`);
      }
    }
  }
  if (pairs.length) {
    findings += pairs.length;
    console.log(`\n[check-duplication] ${g.label} — ${pairs.length} near-duplicate pair(s) (≥${g.threshold * 100}%):`);
    pairs.forEach(p => console.log(p));
  }
}

if (findings === 0) {
  console.log('[check-duplication] OK — no near-duplicate content above thresholds.');
  process.exit(0);
}
console.log(`\n[check-duplication] ${findings} near-duplicate pair(s) found.`);
if (strict) {
  console.error('[check-duplication] --strict: failing on duplication.');
  process.exit(1);
}
