// Similarity helper — word-shingle Jaccard over normalized text. Reused by deduplicate (collapse
// near-identical problems) and clustering. Same idea as scripts/check-duplication.ts. Pure.

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Word shingles of size n (default unigrams+bigrams give robust short-text similarity). */
export function shingles(text: string, n = 2): Set<string> {
  const t = tokens(text);
  const out = new Set<string>(t); // unigrams
  for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n).join(' '));
  return out;
}

export function jaccard(a: string, b: string): number {
  const sa = shingles(a);
  const sb = shingles(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}
