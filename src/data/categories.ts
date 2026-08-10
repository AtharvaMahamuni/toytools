import type { Category } from './types';
import { tools } from './registry';
import { engineRegistry } from './engines';

// `tagline` and `highlights` drive the homepage index (CategoryIndex.astro): the homepage
// now shows eleven category rows instead of every tool name, so these three example slugs
// are the concrete picture a visitor gets of what a category holds. Prefer the tools people
// actually arrive looking for, and prefer ones the collapsed directory hides (BMI and TDEE
// both sit behind a single "Health Calculator" group entry, so name them here).
const categoryDefs: Omit<Category, 'toolCount' | 'engines'>[] = [
  {
    slug: 'text-utilities',
    name: 'Text Utilities',
    description: 'Count, transform, clean, and analyze text strings.',
    tagline: 'Count, convert, clean and compare text.',
    highlights: ['word-counter', 'title-case-converter', 'find-replace'],
    accent: '#9B543E',
    segment: 'text',
  },
  {
    slug: 'number-utilities',
    name: 'Number Utilities',
    description: 'Convert, format, and calculate numeric values quickly.',
    tagline: 'Percentages, discounts, tips and everyday math.',
    highlights: ['percentage-calculator', 'discount-calculator', 'scientific-calculator'],
    accent: '#765B22',
    segment: 'number',
  },
  {
    slug: 'developer-utilities',
    name: 'Developer Utilities',
    description: 'Encode, decode, format, and inspect data structures.',
    tagline: 'Format, encode, hash and inspect data.',
    highlights: ['json-formatter', 'base64-encoder-decoder', 'jwt-decoder'],
    accent: '#56568F',
    segment: 'developer-utilities',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Simple tools to help you focus, plan, and get things done.',
    tagline: 'Focus, plan and keep track.',
    highlights: ['pomodoro-timer', 'notepad', 'todo-list'],
    accent: '#3E7B55',
    segment: 'productivity',
  },
  {
    slug: 'money-finance',
    name: 'Money & Finance',
    description: 'Calculate interest, savings, inflation, and plan smarter money decisions.',
    tagline: 'Interest, savings and growth, projected.',
    highlights: ['compound-interest-calculator', 'sip-calculator', 'savings-goal-calculator'],
    accent: '#2F7268',
    segment: 'finance',
  },
  {
    slug: 'generate',
    name: 'Generators',
    description: 'Generate passwords, UUIDs, random strings, placeholder text, and QR codes in your browser.',
    tagline: 'Passwords, UUIDs, QR codes and filler text.',
    highlights: ['password-generator', 'uuid-generator', 'qr-code-generator'],
    accent: '#7F5B2A',
    segment: 'generate',
  },
  {
    slug: 'physics',
    name: 'Physics',
    headline: 'Physics Simulations',
    description: 'Interactive physics simulations you can see, touch, and experiment with. Explore waves, oscillations, and heat right in your browser.',
    tagline: 'Motion, waves, heat and circuits, made visual.',
    highlights: ['projectile-motion-calculator', 'ohms-law-calculator', 'wave-speed-calculator'],
    accent: '#3A6288',
    segment: 'physics',
  },
  {
    slug: 'applied-math',
    name: 'Applied Math',
    headline: 'Interactive Math Simulations',
    description: 'Interactive math you can see and touch. Drag angles, morph curves, and watch sin, cos, and the rest come alive in your browser.',
    tagline: 'Trigonometry, probability and number theory.',
    highlights: ['unit-circle-calculator', 'quadratic-equation-solver', 'fraction-calculator'],
    accent: '#9E4750',
    segment: 'math',
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Calculate ages and durations, convert time zones and timestamps, and work with dates, all in your browser.',
    tagline: 'Ages, durations, time zones and timestamps.',
    highlights: ['age-calculator', 'timezone-converter', 'unix-timestamp-converter'],
    accent: '#6B5090',
    segment: 'datetime',
  },
  {
    slug: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Calculate fitness metrics, track your health, and build habits that stick, all privately in your browser.',
    tagline: 'BMI, calories, macros and training numbers.',
    highlights: ['bmi-calculator', 'tdee-calculator', 'macro-calculator'],
    accent: '#94486F',
    segment: 'health',
  },
  {
    slug: 'design-tools',
    name: 'Design & CSS',
    description: 'Convert colors, check WCAG contrast, and translate CSS and mobile units, all privately in your browser.',
    tagline: 'Colors, contrast and CSS units.',
    highlights: ['color-format-converter', 'color-contrast-checker', 'px-to-rem-converter'],
    accent: '#33697C',
    segment: 'design',
  },
];

export const categories: Category[] = categoryDefs.map(c => ({
  ...c,
  toolCount: tools.filter(t => t.categorySlug === c.slug).length,
  engines: engineRegistry.filter(e => e.category === c.slug).map(e => e.id),
}));
