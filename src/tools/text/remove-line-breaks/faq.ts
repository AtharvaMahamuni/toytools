import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'remove-line-breaks-faq-1',
    question: 'What does removing line breaks do?',
    answer:
      'It replaces the hard returns in your text with a single space, joining the separate lines into one continuous paragraph. Text that was wrapped mid-sentence flows back together as one block.',
  },
  {
    id: 'remove-line-breaks-faq-2',
    question: 'Does it leave double spaces where the breaks were?',
    answer:
      'No. Each run of line breaks, along with any spaces or tabs around it, collapses to exactly one space, and leading and trailing whitespace is trimmed. You get clean single spacing, not gaps.',
  },
  {
    id: 'remove-line-breaks-faq-3',
    question: 'How is this different from removing blank lines?',
    answer:
      'Removing line breaks joins every line into one paragraph. Remove Blank Lines instead deletes only the empty rows and keeps your remaining lines on separate lines. Use this tool when you want one continuous block.',
  },
  {
    id: 'remove-line-breaks-faq-4',
    question: 'Why does copied text break across lines in the first place?',
    answer:
      'PDFs, emails, and code editors often insert a hard line break at the end of every visual row. When you paste that elsewhere the breaks remain, splitting sentences. Removing them restores normal flow.',
  },
];
