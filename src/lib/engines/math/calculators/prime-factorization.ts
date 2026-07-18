// Prime factorization calculator: factor a number into primes (exponent form) with the trial
// divisions narrated, plus primality, divisor count, and, against an optional second number,
// the GCF and LCM read straight off the shared and combined prime factors.

import type { MathCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  divisorCount,
  formatBigInt,
  formatFactorization,
  primeFactorize,
  MAX_FACTOR_INPUT,
  type PrimeFactor,
} from '../models';
import { integerField, optionalIntegerField } from '../validation';
import { assumption, decisions, insight, step, toolDecision } from '../story';

/** Narrate the trial divisions for one prime: "360 ÷ 2 = 180, ÷ 2 = 90, ÷ 2 = 45 (2³ divides in)". */
function narrate(start: number, f: PrimeFactor): { text: string; rest: number } {
  let rest = start;
  const hops: string[] = [];
  for (let k = 0; k < f.exp; k++) {
    const next = rest / f.prime;
    hops.push(k === 0 ? `${formatBigInt(BigInt(rest))} ÷ ${f.prime} = ${formatBigInt(BigInt(next))}` : `÷ ${f.prime} = ${formatBigInt(BigInt(next))}`);
    rest = next;
  }
  return { text: `${hops.join(', ')} (${formatFactorization([f])} divides in).`, rest };
}

function exponentMap(factors: PrimeFactor[]): Map<number, number> {
  return new Map(factors.map((f) => [f.prime, f.exp]));
}

export const primeFactorizationCalculator: MathCalculator = {
  id: 'prime-factorization',
  family: 'number-theory',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'number',
      label: 'Number to factor',
      type: 'integer',
      default: 360,
      min: 2,
      max: MAX_FACTOR_INPUT,
      step: 1,
    },
    {
      id: 'second',
      label: 'Second number (optional, for GCF and LCM)',
      type: 'integer',
      default: '',
      min: 2,
      max: MAX_FACTOR_INPUT,
      step: 1,
      optional: true,
    },
  ],

  calculate(input, _opts) {
    const n = integerField(input, 'number', 'a number to factor', { min: 2, max: MAX_FACTOR_INPUT });
    if (!n.ok) return n.result;
    const second = optionalIntegerField(input, 'second', 'the second number', { min: 2, max: MAX_FACTOR_INPUT });
    if (!second.ok) return second.result;

    const factors = primeFactorize(n.value)!;
    const prime = factors.length === 1 && factors[0].exp === 1;

    const steps = [];
    let i = 1;
    if (prime) {
      steps.push(step(i++, `Trial-divide ${formatBigInt(BigInt(n.value))} by every prime up to its square root: none divides it, so ${formatBigInt(BigInt(n.value))} is prime.`));
    } else {
      let rest = n.value;
      for (const f of factors) {
        if (rest === f.prime && f.exp === 1) {
          steps.push(step(i++, `The remainder ${formatBigInt(BigInt(rest))} is itself prime, so the factorization stops.`));
          rest = 1;
        } else {
          const out = narrate(rest, f);
          steps.push(step(i++, out.text));
          rest = out.rest;
        }
      }
      if (rest === 1) steps.push(step(i++, `The chain reaches 1, so ${formatBigInt(BigInt(n.value))} = ${formatFactorization(factors)}.`));
    }

    const hero = card('factorization', 'Prime factorization', prime ? `${formatBigInt(BigInt(n.value))} (prime)` : formatFactorization(factors), {
      raw: n.value,
      emphasis: 'hero',
      note: `n = ${formatBigInt(BigInt(n.value))}`,
    });
    const metrics: ResultCard[] = [
      card('isPrime', 'Prime number?', prime ? 'Yes' : 'No', { emphasis: 'primary' }),
      card('divisors', 'Number of divisors', String(divisorCount(factors)), { raw: divisorCount(factors) }),
    ];
    const insights = [...steps];

    if (second.value !== null) {
      const factors2 = primeFactorize(second.value)!;
      const m1 = exponentMap(factors);
      const m2 = exponentMap(factors2);
      const primes = [...new Set([...m1.keys(), ...m2.keys()])].sort((a, b) => a - b);
      let gcf = 1n;
      let lcm = 1n;
      const gcfFactors: PrimeFactor[] = [];
      const lcmFactors: PrimeFactor[] = [];
      for (const p of primes) {
        const lo = Math.min(m1.get(p) ?? 0, m2.get(p) ?? 0);
        const hi = Math.max(m1.get(p) ?? 0, m2.get(p) ?? 0);
        if (lo > 0) {
          gcfFactors.push({ prime: p, exp: lo });
          gcf *= BigInt(p) ** BigInt(lo);
        }
        lcmFactors.push({ prime: p, exp: hi });
        lcm *= BigInt(p) ** BigInt(hi);
      }
      insights.push(insight(`The second number factors as ${formatBigInt(BigInt(second.value))} = ${formatFactorization(factors2)}.`));
      insights.push(
        insight(
          gcfFactors.length > 0
            ? `Shared primes at their LOWER exponents give the GCF: ${formatFactorization(gcfFactors)} = ${formatBigInt(gcf)}.`
            : 'The two numbers share no prime factor, so they are coprime and the GCF is 1.',
        ),
      );
      insights.push(insight(`All primes at their HIGHER exponents give the LCM: ${formatFactorization(lcmFactors)} = ${formatBigInt(lcm)}.`));
      metrics.push(card('gcf', 'GCF (greatest common factor)', formatBigInt(gcf), { raw: gcf <= 9007199254740991n ? Number(gcf) : undefined, emphasis: 'primary' }));
      metrics.push(card('lcm', 'LCM (least common multiple)', formatBigInt(lcm), { raw: lcm <= 9007199254740991n ? Number(lcm) : undefined }));
    }

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Method', 'trial division by primes up to √n'),
        assumption('Input range', `whole numbers from 2 to ${MAX_FACTOR_INPUT.toLocaleString('en-US')}`),
      ],
      decisions: decisions([
        toolDecision('Use the GCF to simplify a fraction', 'fraction-calculator'),
        toolDecision('Count selections with factorials', 'combinations-permutations-calculator'),
      ]),
      nextQuestions: ['How do GCF and LCM come from prime factors?', 'How many divisors does a number have?'],
      explanation:
        'Every whole number above 1 factors into primes in exactly one way (the fundamental theorem of arithmetic). Divide out each small prime until it no longer fits, move to the next, and stop when the remainder is 1 or prime.',
      meta: { n: n.value },
    });
  },
};
