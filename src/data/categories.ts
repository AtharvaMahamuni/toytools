import type { Category } from './types';
import { tools } from './registry';

const categoryDefs: Omit<Category, 'toolCount'>[] = [
  {
    slug: 'text-utilities',
    name: 'Text Utilities',
    description: 'Count, transform, clean, and analyze text strings.',
    accent: '#F97316',
    segment: 'text',
  },
  {
    slug: 'number-utilities',
    name: 'Number Utilities',
    description: 'Convert, format, and calculate numeric values quickly.',
    accent: '#C89B3C',
    segment: 'number',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Encode, decode, format, and inspect data structures.',
    accent: '#6366F1',
    segment: 'developer',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Simple tools to help you focus, plan, and get things done.',
    accent: '#16A34A',
    segment: 'productivity',
  },
];

export const categories: Category[] = categoryDefs.map(c => ({
  ...c,
  toolCount: tools.filter(t => t.categorySlug === c.slug).length,
}));
