import type { Category } from './types';
import { tools } from './registry';
import { engineRegistry } from './engines';

const categoryDefs: Omit<Category, 'toolCount' | 'engines'>[] = [
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
    slug: 'developer-utilities',
    name: 'Developer Utilities',
    description: 'Encode, decode, format, and inspect data structures.',
    accent: '#6366F1',
    segment: 'developer-utilities',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Simple tools to help you focus, plan, and get things done.',
    accent: '#16A34A',
    segment: 'productivity',
  },
  {
    slug: 'money-finance',
    name: 'Money & Finance',
    description: 'Calculate interest, savings, inflation, and plan smarter money decisions.',
    accent: '#0D9488',
    segment: 'finance',
  },
  {
    slug: 'generate',
    name: 'Generators',
    description: 'Generate passwords, UUIDs, random strings, placeholder text, and QR codes in your browser.',
    accent: '#B45309',
    segment: 'generate',
  },
];

export const categories: Category[] = categoryDefs.map(c => ({
  ...c,
  toolCount: tools.filter(t => t.categorySlug === c.slug).length,
  engines: engineRegistry.filter(e => e.category === c.slug).map(e => e.id),
}));
