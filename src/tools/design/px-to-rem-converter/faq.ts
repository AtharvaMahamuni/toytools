import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'px-to-rem-converter-faq-1',
    question: 'How do I convert px to rem?',
    answer: 'Divide the pixel value by the root font size. At the browser default of 16px, 24px is 24 / 16 = 1.5rem. Enter your value here and the rem, em, pt, and percent equivalents appear at once. If your CSS sets a different root size, change the root field and every result updates.',
  },
  {
    id: 'px-to-rem-converter-faq-2',
    question: 'What is the difference between rem and em?',
    answer: 'A rem is always relative to the root (html) font size, so it stays predictable across the whole page. An em is relative to the font size of its own element, which means ems can compound when nested. This converter treats both against your chosen root size, which matches the common case of using them for spacing and typography.',
  },
  {
    id: 'px-to-rem-converter-faq-3',
    question: 'Why should I use rem instead of px?',
    answer: 'When you size text and spacing in rem, everything scales together if a user increases their browser font size for readability. Fixed px values ignore that preference. Using rem is a simple, widely recommended way to make a layout respect accessibility settings.',
  },
  {
    id: 'px-to-rem-converter-faq-4',
    question: 'What root font size should I use?',
    answer: 'Leave it at 16, the browser default, unless your CSS explicitly changes html { font-size }. A common pattern sets the root to 62.5% (10px) so that 1rem equals 10px for easier mental math; if you do that, set the root field to 10 here and the numbers will match your stylesheet.',
  },
  {
    id: 'px-to-rem-converter-faq-5',
    question: 'How does pt relate to px?',
    answer: 'On the web, 1 inch is defined as 96px and 72pt, so 1px equals 0.75pt and 16px equals 12pt. Points mostly appear in print styles and design handoffs from tools that measure in points, so the pt column helps you translate those specs into web pixels.',
  },
];
