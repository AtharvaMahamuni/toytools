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
    question: 'What is a factor tree?',
    answer: 'A factor tree splits a number into any two factors, then keeps splitting each branch until every leaf is prime: 360 might branch into 36 × 10, then 6 × 6 and 2 × 5, and so on down to 2, 2, 2, 3, 3, 5. Whichever splits you choose, the leaves always come out the same, which is the uniqueness of prime factorization in action. The narrated divisions in this calculator are a factor tree flattened into a straight line.',
  },
  {
    id: 'prime-factorization-calculator-faq-7',
    question: 'What are coprime numbers?',
    answer: 'Two numbers are coprime (relatively prime) when they share no prime factor, making their GCF exactly 1. For example, 9 = 3² and 10 = 2 × 5 are coprime even though neither is prime itself. Coprime denominators are the worst case for adding fractions, because the LCD becomes the full product. Enter two numbers and the calculator says outright when they are coprime.',
  },
  {
    id: 'prime-factorization-calculator-faq-8',
    question: 'Is 2 a prime number?',
    answer: 'Yes, and it is the only even one. A prime needs exactly two divisors, 1 and itself, and 2 qualifies. Every other even number has 2 as an extra divisor, so it cannot be prime. That makes 2 the first prime and the reason factorization always starts by dividing out the 2s before moving to 3, 5, and 7.',
  },
  {
    id: 'prime-factorization-calculator-faq-9',
    question: 'Is anything I enter uploaded?',
    answer: 'No. The factorization runs entirely in your browser. Nothing is sent to a server, there is no account, and the calculator works offline once the page has loaded.',
  },
];
