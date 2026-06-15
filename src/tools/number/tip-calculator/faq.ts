import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tip-faq-1',
    question: 'What percentage should I tip?',
    answer:
      'Standard restaurant tips in the United States run 15-20% for good service, 20-25% for excellent service. For counter service or takeout, 10-15% is common. Outside the US, customs vary widely: tipping is not expected in Japan, included in the bill in many European countries, and optional in others. Use local norms as your guide.',
  },
  {
    id: 'tip-faq-2',
    question: 'How do I calculate a tip by hand?',
    answer:
      'To calculate 20% tip: move the decimal one place left to get 10% of the bill, then double it. On a $45 bill: 10% = $4.50; 20% = $9.00. For 15%: find 10% ($4.50), then add half of that ($2.25) to get $6.75. The total bill is the original amount plus the tip.',
  },
  {
    id: 'tip-faq-3',
    question: 'Does the tip apply before or after tax?',
    answer:
      'Standard advice is to calculate the tip on the pre-tax bill. On a $50 pre-tax bill with 10% tax ($5): tipping 20% on $50 gives $10; on $55 gives $11. The $1 gap is small for restaurant visits. For large catered events the difference is more significant, so pre-tax tipping is the more precise approach.',
  },
  {
    id: 'tip-faq-4',
    question: 'How do I split the bill between people?',
    answer:
      'Add the tip to the bill total to get the grand total, then divide by the number of people. On a $80 bill with a $16 tip (20%): grand total = $96; split among 4 people = $24 each. The calculator handles this automatically: enter the bill, tip percentage, and number of people.',
  },
  {
    id: 'tip-faq-5',
    question: 'How do I split an uneven bill fairly?',
    answer:
      'For an uneven split where people ordered different amounts, calculate each person\'s share of the pre-tip bill separately, then add each person\'s proportional share of the tip. If one person ordered $30 and another $50 of an $80 bill: the first pays 37.5% of the tip, the second 62.5%. This tool handles even splits; for uneven splits, use the percentage calculator to find each share.',
  },
  {
    id: 'tip-faq-6',
    question: 'How much to tip for takeout or delivery?',
    answer:
      'For takeout orders picked up in person, 10-15% is standard. For delivery, 15-20% on the food total is the norm, with a minimum of $3-5 for small orders to account for the driver\'s time. Delivery fees shown by apps do not always go to the driver: check the app\'s policy before assuming a fee replaces the tip.',
  },
  {
    id: 'tip-faq-7',
    question: 'What is gratuity vs tip?',
    answer:
      'Gratuity and tip mean the same thing in practice. "Gratuity" is the formal term used on restaurant bills and service industry receipts. An "automatic gratuity" (or "service charge") is a mandatory percentage added to bills for large parties, 18-20% for groups of 6 or more. Check your bill before adding an extra tip on top.',
  },
  {
    id: 'tip-faq-8',
    question: 'Should I tip on a discounted or comped item?',
    answer:
      'Yes. The standard advice is to tip on the full pre-discount price. The server provided the same level of service regardless of whether you had a coupon. If your bill was reduced from $60 to $40 by a discount, base the tip on $60. This is especially relevant for restaurant week deals or promotional pricing.',
  },
];
