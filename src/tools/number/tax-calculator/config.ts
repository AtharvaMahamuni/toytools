import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'tax-calculator',
  name: 'Tax Calculator',
  seoTitle: 'Tax Calculator — Add or Remove Sales Tax / VAT',
  description: 'Add sales tax or VAT to a price, or work backwards from a tax-inclusive total, and see the tax amount.',
  tagline: 'Add sales tax or VAT, or work backwards from the total.',
  categorySlug: 'number-utilities',
  tags: ['tax calculator', 'sales tax calculator', 'vat calculator', 'add tax', 'remove tax', 'reverse vat', 'tax inclusive price'],
  updatedAt: '2026-07-10',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  toolGroup: 'everyday-calculators',
  relatedTools: ['percentage-calculator', 'discount-calculator'],
  guide: {
    slug: 'how-to-calculate-sales-tax',
    categorySlug: 'number',
    title: 'How To Calculate Sales Tax and VAT',
    description: 'Learn how to add tax to a price, back out tax from an inclusive total, and avoid common rounding errors.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },
};
