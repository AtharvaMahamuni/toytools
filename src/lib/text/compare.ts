export type DiffType = 'unchanged' | 'added' | 'removed';

export interface DiffResult {
  type: DiffType;
  line: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
  similarity: number; // 0–100, percentage of unchanged lines relative to total unique lines
}

// Line-level LCS diff (Myers-style patience approach).
// Returns an array of DiffResult covering every line from both inputs.
export function diffLines(a: string, b: string): DiffResult[] {
  const aLines = a === '' ? [] : a.split('\n');
  const bLines = b === '' ? [] : b.split('\n');

  if (aLines.length === 0 && bLines.length === 0) return [];

  const lcs = computeLCS(aLines, bLines);
  const result: DiffResult[] = [];

  let ai = 0;
  let bi = 0;
  let li = 0;

  while (ai < aLines.length || bi < bLines.length) {
    if (
      ai < aLines.length &&
      bi < bLines.length &&
      li < lcs.length &&
      aLines[ai] === lcs[li] &&
      bLines[bi] === lcs[li]
    ) {
      result.push({ type: 'unchanged', line: aLines[ai] });
      ai++;
      bi++;
      li++;
    } else if (bi < bLines.length && (li >= lcs.length || bLines[bi] !== lcs[li])) {
      result.push({ type: 'added', line: bLines[bi] });
      bi++;
    } else {
      result.push({ type: 'removed', line: aLines[ai] });
      ai++;
    }
  }

  return result;
}

export function diffStats(result: DiffResult[]): DiffStats {
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const r of result) {
    if (r.type === 'added') added++;
    else if (r.type === 'removed') removed++;
    else unchanged++;
  }

  const total = added + removed + unchanged;
  // Two empty texts are identical → 100% similar (avoids a misleading 0%).
  if (total === 0) return { added, removed, unchanged, similarity: 100 };

  // Similarity = unchanged lines / max(aLines, bLines) expressed as percentage.
  // added + unchanged === bLines.length; removed + unchanged === aLines.length.
  const denominator = Math.max(added + unchanged, removed + unchanged);
  const similarity = Math.round((unchanged / denominator) * 100);

  return { added, removed, unchanged, similarity };
}

// Compute Longest Common Subsequence of two string arrays.
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;

  // For large inputs, cap to avoid O(n²) memory blowup.
  // 2000 lines each → 4M cells → ~32MB at 8 bytes/cell, acceptable.
  if (m > 2000 || n > 2000) return computeLCSHeuristic(a, b);

  // Standard DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const lcs: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs.reverse();
}

// Heuristic for very large inputs: match equal lines greedily from both ends,
// then treat the middle as all-changed.
function computeLCSHeuristic(a: string[], b: string[]): string[] {
  const lcs: string[] = [];
  let aStart = 0;
  let bStart = 0;
  let aEnd = a.length - 1;
  let bEnd = b.length - 1;

  // Match common prefix
  while (aStart <= aEnd && bStart <= bEnd && a[aStart] === b[bStart]) {
    lcs.push(a[aStart]);
    aStart++;
    bStart++;
  }

  // Match common suffix
  const suffix: string[] = [];
  while (aEnd >= aStart && bEnd >= bStart && a[aEnd] === b[bEnd]) {
    suffix.unshift(a[aEnd]);
    aEnd--;
    bEnd--;
  }

  return lcs.concat(suffix);
}

// ── The craft seam ────────────────────────────────────────────────────────────
// "Comparing without normalizing whitespace first, inflating the diff" is the mistake this tool's
// knowledge file records, and it is the one the code can see for itself. A file saved on Windows
// against the same file from git differs on every single line, and the diff says so in red without
// ever mentioning that not one visible character changed.
//
// Four normalizations, least invasive first, applied cumulatively. The first level that actually
// reduces the number of changed lines is the one reported, so the offer is always the smallest
// change to the comparison that helps, and there is no offer at all when none of them helps.

export type WhitespaceLevel = 'line endings' | 'trailing whitespace' | 'indentation' | 'all whitespace';

export interface WhitespaceNoise {
  /** The least invasive normalization that reduced the diff. */
  level: WhitespaceLevel;
  /** Changed lines before and after, which is what makes the offer worth taking. */
  rawChanged: number;
  normalizedChanged: number;
  /** True when the two texts are the same once normalized. */
  identical: boolean;
  /** The normalized texts, for the widget to re-diff. */
  a: string;
  b: string;
}

const LEVELS: { level: WhitespaceLevel; apply: (s: string) => string }[] = [
  { level: 'line endings', apply: s => s.replace(/\r\n?/g, '\n') },
  { level: 'trailing whitespace', apply: s => s.replace(/[ \t]+$/gm, '') },
  { level: 'indentation', apply: s => s.replace(/^[ \t]+/gm, '') },
  { level: 'all whitespace', apply: s => s.replace(/[ \t]+/g, ' ') },
];

const changedLines = (a: string, b: string): number => {
  const s = diffStats(diffLines(a, b));
  return s.added + s.removed;
};

/**
 * How much of the difference between two texts is whitespace, or null when none of it is.
 *
 * Silent for identical texts, for empty input, and whenever every changed line differs by something
 * a reader would actually see. That last case is most comparisons, which is the point.
 */
export function whitespaceNoise(a: string, b: string): WhitespaceNoise | null {
  if (!a || !b || a === b) return null;
  const rawChanged = changedLines(a, b);
  if (rawChanged === 0) return null;

  let na = a;
  let nb = b;
  for (const { level, apply } of LEVELS) {
    na = apply(na);
    nb = apply(nb);
    const normalizedChanged = changedLines(na, nb);
    if (normalizedChanged < rawChanged) {
      return { level, rawChanged, normalizedChanged, identical: na === nb, a: na, b: nb };
    }
  }
  return null;
}
