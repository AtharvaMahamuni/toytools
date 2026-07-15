import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'combinations-permutations-calculator-faq-1',
    question: 'What is the difference between combinations and permutations?',
    answer: 'Order. Combinations count selections where order is irrelevant: picking Alice and Bob is the same team as picking Bob and Alice, so C(5, 2) = 10. Permutations count ordered arrangements: Alice-then-Bob differs from Bob-then-Alice, so P(5, 2) = 20. The permutation count is always the combination count times r!, the number of ways to shuffle each selection.',
  },
  {
    id: 'combinations-permutations-calculator-faq-2',
    question: 'How do I calculate nCr by hand?',
    answer: 'Use C(n, r) = n! / (r! × (n - r)!). For example, C(5, 2) = 120 / (2 × 6) = 10. In practice you cancel before multiplying: C(5, 2) = (5 × 4) / (2 × 1), which keeps the numbers small. The calculator shows this expansion for small n and switches to grouped or scientific form when the factorials get enormous.',
  },
  {
    id: 'combinations-permutations-calculator-faq-3',
    question: 'What if items are allowed to repeat?',
    answer: 'Two different formulas take over. Ordered with repetition is n^r: a 4-digit PIN has 10^4 = 10,000 possibilities. Unordered with repetition uses the stars and bars formula C(n + r - 1, r): choosing 3 scoops from 4 ice-cream flavors gives C(6, 3) = 20 ways. Switch the repetition option and the calculator applies the right formula and names it.',
  },
  {
    id: 'combinations-permutations-calculator-faq-4',
    question: 'Why can r not be bigger than n?',
    answer: 'Without repetition, each choice uses an item up, so you cannot pick 6 distinct items from a set of 5. With repetition allowed there is no such limit for ordered picks, since every slot resets to all n choices. The calculator explains this instead of returning a silent zero.',
  },
  {
    id: 'combinations-permutations-calculator-faq-5',
    question: 'How accurate are the huge results?',
    answer: 'Exact. The arithmetic runs on big integers, not floating point, so C(1000, 500) comes out to every last digit rather than an approximation. For readability the calculator also shows a scientific form such as 2.70 × 10^299 alongside the full number.',
  },
  {
    id: 'combinations-permutations-calculator-faq-6',
    question: 'Is anything I enter uploaded?',
    answer: 'No. The counting runs entirely in your browser. Nothing is sent to a server, there is no account, and the calculator works offline once the page has loaded.',
  },
];
