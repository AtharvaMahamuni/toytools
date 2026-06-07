import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'res-faq-1',
    question: 'What does "remove extra spaces" do?',
    answer:
      'It collapses any run of two or more spaces or tabs into a single space, so "hello     world" becomes "hello world". Line breaks are kept, so your paragraphs stay intact.',
  },
  {
    id: 'res-faq-2',
    question: 'Why do extra spaces appear in text?',
    answer:
      'They often come from copy-pasting between documents, the old typing habit of double-spacing after a period, manual alignment with the space bar, or text exported from PDFs and spreadsheets.',
  },
  {
    id: 'res-faq-3',
    question: 'Does it remove line breaks too?',
    answer:
      'No. This tool only collapses runs of spaces and tabs. If you also want to flatten line breaks into single spaces, use the Normalize Whitespace tool instead.',
  },
  {
    id: 'res-faq-4',
    question: 'Will it trim spaces at the start and end of lines?',
    answer:
      'It collapses internal runs to a single space but does not strip a single leading or trailing space on its own. To trim the start and end of every line, use the Trim Text tool.',
  },
];
