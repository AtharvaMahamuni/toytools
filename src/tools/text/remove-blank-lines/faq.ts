import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rbl-faq-1',
    question: 'What counts as a blank line?',
    answer:
      'Any line that is empty or contains only spaces and tabs is treated as blank and removed. Lines with visible content are always kept, in their original order.',
  },
  {
    id: 'rbl-faq-2',
    question: 'Why would I want to remove blank lines?',
    answer:
      'Pasted text, exported data, and double-spaced documents often carry empty lines between every paragraph or row. Removing them compacts lists, tidies code, and prepares data for import where blank rows would cause errors.',
  },
  {
    id: 'rbl-faq-3',
    question: 'Does it remove duplicate or extra spaces too?',
    answer:
      'No. This tool only removes whole blank lines. To collapse repeated spaces use Remove Extra Spaces, and to drop repeated lines use Remove Duplicate Lines.',
  },
  {
    id: 'rbl-faq-4',
    question: 'Will it merge my remaining lines together?',
    answer:
      'No. The lines that contain content keep their own line breaks: only the empty lines between them are deleted.',
  },
  {
    id: 'rbl-faq-5',
    question: 'Why are lines with only spaces treated as blank?',
    answer:
      'The tool trims each line before testing it, so a line holding only spaces or tabs counts as blank and is deleted exactly like a truly empty line. This catches the invisible whitespace that pasted text carries. For example, an input of "item one", a line containing a single space, then "item two" comes back as two adjacent lines: the space-only line looked empty on screen and was removed, leaving no hidden gap.',
  },
  {
    id: 'rbl-faq-6',
    question: 'Does removing blank lines destroy my paragraphs?',
    answer:
      'No text is lost, but the empty separator lines between paragraphs are deleted on purpose, so the visual gaps close up. In plain prose that is cosmetic; in Markdown or HTML source the blank line is structural, and renderers merge adjacent paragraphs into one block once it is gone. For example, two Markdown paragraphs separated by a single blank line render as one paragraph after cleanup, so use this tool on lists and data rather than markup.',
  },
  {
    id: 'rbl-faq-7',
    question: 'Why did my intentional spacing disappear after removing blank lines?',
    answer:
      'Every blank line is deleted, including the ones you added deliberately, because the tool cannot tell a purposeful section break from a stray gap. To recover the layout, restore the original text from your clipboard or source document and clean only the sections that need it. For example, a config file that used one empty line between sections comes back as a single contiguous block, so process each section separately and rejoin them with your own spacing.',
  },
];
