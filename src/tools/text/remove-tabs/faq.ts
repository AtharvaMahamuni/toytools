import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rt-faq-1',
    question: 'What does the Remove Tabs tool do?',
    answer:
      'It replaces every tab character with a single space, so text that was aligned or indented with tabs becomes consistently space-separated. The rest of your text is left unchanged.',
  },
  {
    id: 'rt-faq-2',
    question: 'Why replace tabs with a space instead of deleting them?',
    answer:
      'Tabs usually separate words or columns. Deleting them outright would glue neighbouring values together: "Name\tAge" would become "NameAge". Replacing each tab with a space keeps those values readable and parseable.',
  },
  {
    id: 'rt-faq-3',
    question: 'When is removing tabs useful?',
    answer:
      'It helps when pasting tab-indented code into an editor that expects spaces, cleaning tab-separated data before reformatting it, or fixing text where invisible tabs break alignment or a strict format.',
  },
  {
    id: 'rt-faq-4',
    question: 'Does it collapse the resulting spaces?',
    answer:
      'No. Each tab becomes exactly one space. If you then want to collapse multiple spaces, run Remove Extra Spaces afterwards.',
  },
];
