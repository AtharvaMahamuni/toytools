import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'prime-factorization-calculator-faq-1',
    question: 'How do I find the prime factorization of a number?',
    answer: 'Divide by the smallest prime that fits, repeatedly, then move up. For example, 360 divides by 2 three times (360, 180, 90, 45), then by 3 twice (15, 5), and 5 is prime, so 360 = 2³ × 3² × 5. The calculator narrates exactly this chain of divisions, which is the same procedure as drawing a factor tree.',
  },
  {
    id: 'prime-factorization-calculator-faq-2',
    question: 'How do GCF and LCM come from prime factors?',
    answer: 'Line up both factorizations. The greatest common factor takes the primes both numbers share, each at its lower exponent; the least common multiple takes every prime that appears, each at its higher exponent. For 36 = 2² × 3² and 60 = 2² × 3 × 5: GCF = 2² × 3 = 12 and LCM = 2² × 3² × 5 = 180. Enter a second number and the calculator works both lines for you.',
  },
  {
    id: 'prime-factorization-calculator-faq-3',
    question: 'How do I know if a number is prime?',
    answer: 'Trial-divide by every prime up to its square root. If none divides it, the number is prime: any composite number must have a factor at or below its square root, because factors pair up around it. That is why checking 97 only needs the primes 2, 3, 5, and 7, and why the calculator can settle numbers up to a trillion instantly.',
  },
  {
    id: 'prime-factorization-calculator-faq-4',
    question: 'How does the divisor count work without listing divisors?',
    answer: 'Add one to each exponent in the factorization and multiply. For 360 = 2³ × 3² × 5 that is (3+1) × (2+1) × (1+1) = 24 divisors, because building a divisor means choosing how many of each prime to include, from zero up to its exponent.',
  },
  {
    id: 'prime-factorization-calculator-faq-5',
    question: 'Why is 1 not a prime number?',
    answer: 'Because uniqueness would collapse: if 1 counted as prime, 6 could be written as 2 × 3, or 1 × 2 × 3, or 1 × 1 × 2 × 3, endlessly. Excluding 1 keeps the fundamental theorem of arithmetic true: every number above 1 has exactly one prime factorization.',
  },
  {
    id: 'prime-factorization-calculator-faq-6',
    question: 'Is anything I enter uploaded?',
    answer: 'No. The factorization runs entirely in your browser. Nothing is sent to a server, there is no account, and the calculator works offline once the page has loaded.',
  },
];
