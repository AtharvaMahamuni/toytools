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
    question: 'Is anything I type uploaded?',
    answer: 'No. The arithmetic runs entirely in your browser using exact integer math. Nothing is sent to a server, there is no account, and the calculator keeps working offline once the page has loaded.',
  },
];
