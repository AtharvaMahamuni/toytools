import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'trm-faq-1',
    question: 'What does trimming text do?',
    answer:
      'It removes whitespace (spaces and tabs) from the start and end of every line, while leaving the words and the spacing between them untouched. "  hello world  " becomes "hello world".',
  },
  {
    id: 'trm-faq-2',
    question: 'Why are trailing spaces a problem?',
    answer:
      'They are invisible but real. A trailing space can break an exact text match, fail a password or coupon-code check, create misaligned data in a spreadsheet column, or trigger linter warnings in code.',
  },
  {
    id: 'trm-faq-3',
    question: 'Does it collapse double spaces in the middle of a line?',
    answer:
      'No. Trimming only affects the start and end of each line. To collapse repeated spaces inside the text, use Remove Extra Spaces.',
  },
  {
    id: 'trm-faq-4',
    question: 'Does it remove blank lines?',
    answer:
      'A line that contained only spaces becomes empty after trimming, but it is not deleted. If you want those empty lines removed as well, follow up with Remove Blank Lines.',
  },
  {
    id: 'trm-faq-5',
    question: 'How do I strip indentation from pasted code?',
    answer:
      'Paste the code into Trim Text and every line loses its leading whitespace, so the whole block comes back flush left. Each line is trimmed independently, which is why nested indentation of any depth disappears in one pass. For example, a method copied from deep inside a class arrives with eight leading spaces per line, and "        return total;" becomes "return total;" with the code itself unchanged. This flattens relative indentation too, so use it when you want everything flush left, not to re-indent.',
  },
  {
    id: 'trm-faq-6',
    question: 'What is the difference between trimming edges and collapsing internal spaces?',
    answer:
      'Trimming deletes whitespace only at the start and end of each line; collapsing rewrites the runs of spaces between words down to one. Trim Text does the first job and never edits the interior of a line. For example, the line "   total  =  42   " trims to "total  =  42": the double gaps around the equals sign survive because they sit between words. Run Remove Extra Spaces afterward if you want those interior runs collapsed to single spaces.',
  },
  {
    id: 'trm-faq-7',
    question: 'Does trimming work per line or on the whole text block?',
    answer:
      'Trim Text trims every line separately, not just the outer edges of the whole block. The text is split on line breaks, each line has its own leading and trailing whitespace removed, and the lines are rejoined in order. A whole-text trim, like a single call to JavaScript String.trim(), would clean only the very start and end of the block and leave every interior line still indented. For example, a five-line list indented with two spaces per line comes back with all five lines flush left.',
  },
  {
    id: 'trm-faq-8',
    question: 'Why are there still spaces between words after trimming?',
    answer:
      'Because trimming touches only the edges of each line by design; whitespace between words is interior content and is deliberately preserved. That boundary is what makes trimming safe for text where interior spacing matters, such as aligned columns. For example, "  Monday    9am  " trims to "Monday    9am": the edge padding is gone but the four-space gap in the middle stays. If those interior gaps are the actual problem, run the result through Remove Extra Spaces, which collapses runs between words to single spaces.',
  },
  {
    id: 'trm-faq-9',
    question: 'Why were blank lines left in place after trimming?',
    answer:
      'Trimming never deletes lines, so an empty line stays where it was and a line holding only spaces becomes an empty line that still occupies its row. Your text has the same line count before and after; only the characters at each line\'s edges change. For example, a list with an empty row between "apples" and "bananas" keeps that empty row after trimming. To drop those empty rows, send the output through Remove Blank Lines, which deletes them without touching the surviving content.',
  },
];
