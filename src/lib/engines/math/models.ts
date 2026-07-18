// Math engine models — the pure arithmetic core (fractions, combinatorics, prime factorization)
// shared by every math calculator. All exact paths run on BigInt so results are never silently
// rounded; documented caps keep the UI honest instead of hanging. Pure, synchronous, never-throws
// (invalid input returns null and the calculator phrases the validation error).

export interface Fraction {
  /** Numerator; carries the sign. */
  n: bigint;
  /** Denominator; always positive. */
  d: bigint;
}

/** Cap for any single fraction part (numerator, denominator, whole) users can type. */
export const MAX_FRACTION_PART = 1_000_000_000n;
/** Cap for n in nCr / nPr / factorial (BigInt is exact but rendering must stay sane). */
export const MAX_COMBINATORICS_N = 1000;
/** Cap for prime factorization input (trial division to √n stays instant below this). */
export const MAX_FACTOR_INPUT = 1_000_000_000_000;

// ── Integer helpers ────────────────────────────────────────────────────────────────────────────

export function bgcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function blcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  const g = bgcd(a, b);
  const v = (a / g) * b;
  return v < 0n ? -v : v;
}

/** Group a BigInt's digits with commas, e.g. 1234567n -> "1,234,567". */
export function formatBigInt(v: bigint): string {
  const neg = v < 0n;
  const digits = (neg ? -v : v).toString();
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ',';
    out += digits[i];
  }
  return (neg ? '-' : '') + out;
}

/** Scientific approximation for huge values, e.g. "1.07 × 10^301", or null when it fits plainly. */
export function approxBigInt(v: bigint): string | null {
  const s = (v < 0n ? -v : v).toString();
  if (s.length <= 15) return null;
  const mantissa = `${s[0]}.${s.slice(1, 3)}`;
  return `${v < 0n ? '-' : ''}${mantissa} × 10^${s.length - 1}`;
}

// ── Fractions ──────────────────────────────────────────────────────────────────────────────────

function normalize(n: bigint, d: bigint): Fraction {
  if (d < 0n) return { n: -n, d: -d };
  return { n, d };
}

/**
 * Parse "7", "-7", "3/4", "-3/4", "1 2/3", or "-1 2/3" (whitespace tolerant) into a Fraction.
 * Returns null for anything else, a zero denominator, or a part beyond MAX_FRACTION_PART.
 */
export function parseFraction(text: string): Fraction | null {
  const t = text.trim().replace(/\s+/g, ' ');
  const m = t.match(/^(-?)(?:(\d+) )?(\d+)(?:\/(\d+))?$/);
  if (!m) return null;
  const sign = m[1] === '-' ? -1n : 1n;
  const whole = m[2] !== undefined ? BigInt(m[2]) : null;
  const first = BigInt(m[3]);
  const den = m[4] !== undefined ? BigInt(m[4]) : null;

  // "1 2/3" (mixed) requires the fraction part; "3" alone is an integer; "3/4" a plain fraction.
  if (whole !== null && den === null) return null;
  const w = whole ?? 0n;
  const n = first;
  const d = den ?? 1n;
  if (d === 0n) return null;
  if (w > MAX_FRACTION_PART || n > MAX_FRACTION_PART || d > MAX_FRACTION_PART) return null;
  // Mixed-number convention: the sign applies to the whole value, -1 2/3 = -(1 + 2/3).
  return normalize(sign * (w * d + n), d);
}

export function simplify(f: Fraction): Fraction {
  if (f.n === 0n) return { n: 0n, d: 1n };
  const g = bgcd(f.n, f.d);
  return normalize(f.n / g, f.d / g);
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return normalize(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subFractions(a: Fraction, b: Fraction): Fraction {
  return normalize(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mulFractions(a: Fraction, b: Fraction): Fraction {
  return normalize(a.n * b.n, a.d * b.d);
}

/** a ÷ b, or null when b is zero. */
export function divFractions(a: Fraction, b: Fraction): Fraction | null {
  if (b.n === 0n) return null;
  return normalize(a.n * b.d, a.d * b.n);
}

export function fractionToDecimal(f: Fraction): number {
  return Number(f.n) / Number(f.d);
}

/** "5/4", "3", "-5/8" (assumes the fraction is already in the form you want shown). */
export function formatFraction(f: Fraction): string {
  if (f.d === 1n) return formatBigInt(f.n);
  return `${formatBigInt(f.n)}/${formatBigInt(f.d)}`;
}

/** "1 1/4" for improper fractions, "3" for integers, "3/4" when there is no whole part. */
export function formatMixed(f: Fraction): string {
  const s = simplify(f);
  const neg = s.n < 0n;
  const n = neg ? -s.n : s.n;
  const whole = n / s.d;
  const rem = n % s.d;
  const sign = neg ? '-' : '';
  if (rem === 0n) return `${sign}${formatBigInt(whole)}`;
  if (whole === 0n) return `${sign}${formatBigInt(rem)}/${formatBigInt(s.d)}`;
  return `${sign}${formatBigInt(whole)} ${formatBigInt(rem)}/${formatBigInt(s.d)}`;
}

// ── Combinatorics ──────────────────────────────────────────────────────────────────────────────

/** n! for 0 ≤ n ≤ MAX_COMBINATORICS_N, else null. */
export function factorialBig(n: number): bigint | null {
  if (!Number.isInteger(n) || n < 0 || n > MAX_COMBINATORICS_N) return null;
  let out = 1n;
  for (let i = 2n; i <= BigInt(n); i++) out *= i;
  return out;
}

/** nPr = n!/(n-r)! via the falling product. Null outside 0 ≤ r ≤ n ≤ MAX_COMBINATORICS_N. */
export function nPr(n: number, r: number): bigint | null {
  if (!Number.isInteger(n) || !Number.isInteger(r)) return null;
  if (n < 0 || r < 0 || r > n || n > MAX_COMBINATORICS_N) return null;
  let out = 1n;
  const bn = BigInt(n);
  for (let i = 0n; i < BigInt(r); i++) out *= bn - i;
  return out;
}

/** nCr via the multiplicative formula (divides exactly at each step). Null outside range. */
export function nCr(n: number, r: number): bigint | null {
  if (!Number.isInteger(n) || !Number.isInteger(r)) return null;
  if (n < 0 || r < 0 || r > n || n > MAX_COMBINATORICS_N) return null;
  const k = Math.min(r, n - r);
  let out = 1n;
  for (let i = 1n; i <= BigInt(k); i++) {
    out = (out * (BigInt(n) - BigInt(k) + i)) / i;
  }
  return out;
}

/** Combinations with repetition: C(n + r - 1, r). Null when n + r - 1 exceeds the cap (or n = 0, r > 0). */
export function nCrWithRepetition(n: number, r: number): bigint | null {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return null;
  if (n === 0) return r === 0 ? 1n : null;
  if (n + r - 1 > MAX_COMBINATORICS_N) return null;
  return nCr(n + r - 1, r);
}

/** Permutations with repetition: n^r. Null when n = 0 with r > 0 or the result would be astronomical. */
export function nPrWithRepetition(n: number, r: number): bigint | null {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return null;
  if (n === 0) return r === 0 ? 1n : null;
  // Cap the printed size: r · log10(n) beyond ~3010 digits helps nobody.
  if (r * Math.log10(Math.max(n, 2)) > 3010) return null;
  return BigInt(n) ** BigInt(r);
}

// ── Primes ─────────────────────────────────────────────────────────────────────────────────────

export interface PrimeFactor {
  prime: number;
  exp: number;
}

/** Trial-division factorization for integers 2..MAX_FACTOR_INPUT; null outside that range. */
export function primeFactorize(n: number): PrimeFactor[] | null {
  if (!Number.isInteger(n) || n < 2 || n > MAX_FACTOR_INPUT) return null;
  const factors: PrimeFactor[] = [];
  let rest = n;
  for (const p of [2, 3]) {
    let exp = 0;
    while (rest % p === 0) {
      rest /= p;
      exp++;
    }
    if (exp > 0) factors.push({ prime: p, exp });
  }
  // 6k ± 1 wheel.
  for (let p = 5; p * p <= rest; p += 6) {
    for (const q of [p, p + 2]) {
      let exp = 0;
      while (rest % q === 0) {
        rest /= q;
        exp++;
      }
      if (exp > 0) factors.push({ prime: q, exp });
    }
  }
  if (rest > 1) factors.push({ prime: rest, exp: 1 });
  return factors;
}

export function isPrime(n: number): boolean {
  const f = primeFactorize(n);
  return f !== null && f.length === 1 && f[0].exp === 1;
}

const SUPERSCRIPTS: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

function sup(exp: number): string {
  return String(exp).split('').map((ch) => SUPERSCRIPTS[ch] ?? ch).join('');
}

/** "2³ × 3 × 5²" in exponent form. */
export function formatFactorization(factors: PrimeFactor[]): string {
  return factors.map((f) => (f.exp === 1 ? String(f.prime) : `${f.prime}${sup(f.exp)}`)).join(' × ');
}

/** Number of divisors τ(n) = Π(exp + 1). */
export function divisorCount(factors: PrimeFactor[]): number {
  return factors.reduce((acc, f) => acc * (f.exp + 1), 1);
}

export function gcdInt(a: number, b: number): number {
  return Number(bgcd(BigInt(a), BigInt(b)));
}

/** lcm as BigInt (two 10^12 inputs can exceed Number.MAX_SAFE_INTEGER). */
export function lcmInt(a: number, b: number): bigint {
  return blcm(BigInt(a), BigInt(b));
}
