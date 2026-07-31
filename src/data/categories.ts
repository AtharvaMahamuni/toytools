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
  {
    slug: 'physics',
    name: 'Physics',
    description: 'Interactive physics simulations you can see, touch, and experiment with. Explore waves, oscillations, and heat right in your browser.',
    accent: '#0369A1',
    segment: 'physics',
  },
  {
    slug: 'applied-math',
    name: 'Applied Math',
    description: 'Interactive math you can see and touch. Drag angles, morph curves, and watch sin, cos, and the rest come alive in your browser.',
    accent: '#BE123C',
    segment: 'math',
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Calculate ages and durations, convert time zones and timestamps, and work with dates, all in your browser.',
    accent: '#7C3AED',
    segment: 'datetime',
  },
  {
    slug: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Calculate fitness metrics, track your health, and build habits that stick, all privately in your browser.',
    accent: '#DB2777',
    segment: 'health',
  },
  {
    slug: 'design-tools',
    name: 'Design & CSS',
    description: 'Convert colors, check WCAG contrast, and translate CSS and mobile units, all privately in your browser.',
    accent: '#0EA5E9',
    segment: 'design',
  },
];

export const categories: Category[] = categoryDefs.map(c => ({
  ...c,
  toolCount: tools.filter(t => t.categorySlug === c.slug).length,
  engines: engineRegistry.filter(e => e.category === c.slug).map(e => e.id),
}));
