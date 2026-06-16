import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'mrg-faq-1',
    question: 'What is gross margin?',
    answer:
      'Gross margin is the percentage of the selling price that is profit after subtracting the cost. Formula: ((Price − Cost) ÷ Price) × 100. If an item costs $40 to make and sells for $100, the gross margin is 60%. It measures how much of each dollar of revenue is gross profit.',
  },
  {
    id: 'mrg-faq-2',
    question: 'How is margin different from markup?',
    answer:
      'Margin is based on the selling price; markup is based on the cost. If cost is $40 and price is $100: margin = (($100 − $40) ÷ $100) × 100 = 60%; markup = (($100 − $40) ÷ $40) × 100 = 150%. The same gap between cost and price gives a different percentage depending on which base you use.',
  },
  {
    id: 'mrg-faq-3',
    question: 'What is a good profit margin?',
    answer:
      'It varies by industry. Grocery retail margins run 2-5%, software products 60-80%, and professional services 20-40%. A "good" gross margin is one that covers overhead and leaves net profit after operating costs. Compare your margin to industry benchmarks, not a fixed target.',
  },
  {
    id: 'mrg-faq-4',
    question: 'How do I calculate the selling price from a target margin?',
    answer:
      'Divide the cost by (1 − target margin). If your item costs $60 and you want a 40% gross margin: selling price = $60 ÷ (1 − 0.40) = $60 ÷ 0.60 = $100. At $100, you earn $40 gross profit, which is 40% of the $100 sale price.',
  },
  {
    id: 'mrg-faq-5',
    question: 'How do I calculate markup percentage?',
    answer:
      'Subtract the cost from the selling price, divide by the cost, and multiply by 100. If cost is $25 and price is $40: markup = (($40 − $25) ÷ $25) × 100 = 60%. A 60% markup means you added 60% of the cost on top to arrive at the selling price.',
  },
  {
    id: 'mrg-faq-6',
    question: 'What does negative gross margin mean?',
    answer:
      'A negative gross margin means the selling price is lower than the cost: you lose money on every sale. This can occur deliberately (a loss leader to attract customers) or by mistake (underpricing, rising input costs, or errors in cost calculation). A negative margin is not sustainable without other offsetting revenue.',
  },
  {
    id: 'mrg-faq-7',
    question: 'What is the difference between gross margin and net margin?',
    answer:
      'Gross margin subtracts only the direct cost of goods sold from revenue. Net margin subtracts all costs: cost of goods, operating expenses, taxes, and interest. Gross margin shows production efficiency; net margin shows overall profitability. A business with a 60% gross margin can still have a negative net margin if operating costs are high.',
  },
  {
    id: 'mrg-faq-8',
    question: 'Is a 50% markup the same as a 50% margin?',
    answer:
      'No. A 50% markup means you add 50% of the cost to arrive at the price. If cost is $100, price = $150. The gross margin on that sale is ($150 − $100) ÷ $150 = 33.3%, not 50%. Markup and margin percentages are never equal unless they are both zero.',
  },
];
