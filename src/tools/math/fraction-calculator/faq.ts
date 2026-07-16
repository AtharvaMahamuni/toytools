import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'fraction-calculator-faq-1',
    question: 'How do I add fractions with different denominators?',
    answer: 'Convert both fractions to the least common denominator, then add only the numerators. For example, 1/2 + 3/4 becomes 2/4 + 3/4 = 5/4, which is the mixed number 1 1/4. The calculator shows the LCD it found, both converted fractions, and the final simplification so you can follow every step.',
  },
  {
    id: 'fraction-calculator-faq-2',
    question: 'How does dividing by a fraction work?',
    answer: 'Dividing by a fraction is the same as multiplying by its reciprocal: flip the second fraction, then multiply straight across. So 3/4 ÷ 1/8 becomes 3/4 × 8/1 = 24/4 = 6. The intuition: dividing by an eighth asks how many eighths fit into three quarters, and six of them do.',
  },
  {
    id: 'fraction-calculator-faq-3',
    question: 'Can I enter mixed numbers or whole numbers?',
    answer: 'Yes. Type mixed numbers with a space, like 1 2/3, plain fractions like 3/4, or whole numbers like 7. Mixed numbers are first rewritten as improper fractions (1 2/3 becomes 5/3) because arithmetic is simpler in that form, and the answer is shown both ways.',
  },
  {
    id: 'fraction-calculator-faq-4',
    question: 'How is the answer simplified?',
    answer: 'The calculator divides the numerator and denominator by their greatest common factor. For example, 24/6 simplifies by the GCF 6 to 4. Because the arithmetic runs on exact integers rather than floating point, the simplified fraction is always exact, never a rounded decimal pretending to be a fraction.',
  },
  {
    id: 'fraction-calculator-faq-5',
    question: 'Why does my textbook answer look different from the result?',
    answer: 'The two answers are almost always the same value in different forms: 5/4, 1 1/4, and 1.25 are all equal. Check the mixed-number and decimal cards next to the main result. If they still differ, compare the worked steps against your own to find where the calculations diverge.',
  },
  {
    id: 'fraction-calculator-faq-6',
    question: 'How do I convert a fraction to a decimal?',
    answer: 'Divide the numerator by the denominator: 3/4 = 3 ÷ 4 = 0.75. Some fractions terminate (any denominator whose only prime factors are 2 and 5, like 8 or 20) while others repeat forever, like 1/3 = 0.333... The calculator shows the decimal beside every result, rounded to six places, while the fraction form stays exact.',
  },
  {
    id: 'fraction-calculator-faq-7',
    question: 'How do I find the least common denominator of two fractions?',
    answer: 'Take the least common multiple of the two denominators. List multiples until they meet (4, 8, 12... and 6, 12: LCD = 12), or factor into primes and take every prime at its higher power. For 1/4 and 5/6: 4 = 2² and 6 = 2 × 3, so the LCD is 2² × 3 = 12. The calculator names the LCD it used in step form on every add or subtract.',
  },
  {
    id: 'fraction-calculator-faq-8',
    question: 'How do I compare two fractions to see which is bigger?',
    answer: 'Put both over a common denominator and compare numerators: 2/3 vs 3/5 becomes 10/15 vs 9/15, so 2/3 is bigger. A quick shortcut is cross-multiplying (2 × 5 = 10 against 3 × 3 = 9, same verdict). Subtracting one from the other in the calculator does the comparison too: a positive result means the first fraction is larger.',
  },
  {
    id: 'fraction-calculator-faq-9',
    question: 'Is anything I type uploaded?',
    answer: 'No. The arithmetic runs entirely in your browser using exact integer math. Nothing is sent to a server, there is no account, and the calculator keeps working offline once the page has loaded.',
  },
];
