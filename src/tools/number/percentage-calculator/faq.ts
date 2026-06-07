import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pct-faq-1',
    question: 'What is a percentage?',
    answer:
      'A percentage is a number expressed as a fraction of 100. The word comes from the Latin "per centum," meaning "per hundred." When you say 25%, you mean 25 out of every 100, or one quarter. Percentages make it easy to compare quantities of different sizes on a common scale.',
  },
  {
    id: 'pct-faq-2',
    question: 'How do I calculate a percentage of a number?',
    answer:
      'Multiply the number by the percentage and divide by 100. For example, 20% of 150 = (20 × 150) ÷ 100 = 30. A quicker mental shortcut: move the decimal one place left to get 10% (150 → 15), then double it to get 20% (15 × 2 = 30). This tool calculates it instantly.',
  },
  {
    id: 'pct-faq-3',
    question: 'How do I calculate what percentage one number is of another?',
    answer:
      'Divide the part by the whole, then multiply by 100. For example, to find what percentage 45 is of 200: (45 ÷ 200) × 100 = 22.5%. This is useful for grading, survey results, and measuring progress toward a goal.',
  },
  {
    id: 'pct-faq-4',
    question: 'What is the difference between percentage and percentage points?',
    answer:
      'A percentage point is the arithmetic difference between two percentages. If interest rates rise from 3% to 5%, that is a 2 percentage point increase — but it is also a 66.7% increase in the rate itself. Confusing the two is a common mistake. "Percentage points" are used when comparing two percentages directly; "percent change" is used when measuring relative change.',
  },
  {
    id: 'pct-faq-5',
    question: 'How do I calculate percentage increase or decrease?',
    answer:
      'Subtract the original value from the new value, divide by the original value, then multiply by 100. Formula: ((New − Old) ÷ Old) × 100. If a price goes from £80 to £100: ((100 − 80) ÷ 80) × 100 = 25% increase. A negative result means a decrease.',
  },
  {
    id: 'pct-faq-6',
    question: 'How do I calculate a discount?',
    answer:
      'Multiply the original price by the discount percentage and divide by 100 to get the discount amount, then subtract from the original price. For a 30% discount on $120: discount = (30 × 120) ÷ 100 = $36; final price = $120 − $36 = $84. Alternatively, multiply by (1 − 0.30) = 0.70 to get $84 directly.',
  },
  {
    id: 'pct-faq-7',
    question: 'Why does 50% off followed by 50% on not equal the original price?',
    answer:
      'Because each percentage is applied to a different base. A $100 item at 50% off becomes $50. Adding 50% back onto $50 gives $75, not $100. The second operation uses the reduced price as its base, so the two changes do not cancel out. This is why percentage changes are not symmetric.',
  },
  {
    id: 'pct-faq-8',
    question: 'How do I calculate tax from a percentage?',
    answer:
      'Multiply the pre-tax price by the tax rate and divide by 100. For 20% VAT on £60: tax = (20 × 60) ÷ 100 = £12; total = £60 + £12 = £72. To find the pre-tax price from an already-taxed total, divide by (1 + tax rate / 100). For a £72 total with 20% VAT: £72 ÷ 1.20 = £60.',
  },
];
