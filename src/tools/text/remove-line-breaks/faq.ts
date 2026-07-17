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
  {
    id: 'remove-line-breaks-faq-5',
    question: 'Does remove line breaks only delete the empty lines?',
    answer:
      'No. It joins every line, not just the empty ones, so the whole text becomes one continuous paragraph. Deleting only the empty rows while keeping each item on its own line is the job of Remove Blank Lines. For example, a five-line address with one blank row in the middle comes back from this tool as a single run-on line, while Remove Blank Lines returns the same address as four separate lines.',
  },
  {
    id: 'remove-line-breaks-faq-6',
    question: 'Why did my words run together with no space after removing line breaks?',
    answer:
      'This tool cannot cause that: it replaces each run of breaks with exactly one space, so a break between "brown" and "cat" becomes "brown cat", never "browncat". Glued words mean the newlines were stripped with an empty replacement somewhere else, typically a find and replace that swapped the newline for nothing. For example, an editor macro that deletes newline characters outright welds the last word of one line to the first word of the next. Paste the original text here instead and every join gets its space.',
  },
  {
    id: 'remove-line-breaks-faq-7',
    question: 'Why did my paragraph breaks disappear after removing line breaks?',
    answer:
      'Every break collapses, including the blank lines that separated paragraphs, so the whole text merges into one block by design. There is no way for the tool to distinguish a wrap inside a sentence from a gap you meant to keep. To keep separate paragraphs, paste and clean one paragraph at a time, then reassemble them. For example, a two-paragraph letter copied from a PDF comes back as one paragraph; cleaning each paragraph in its own pass preserves the split.',
  },
  {
    id: 'remove-line-breaks-faq-8',
    question: 'Why are there stray hyphens after joining lines from a PDF?',
    answer:
      'PDFs split long words at the right margin with a hyphen, so "informa-" ends one line and "tion" starts the next. Joining the lines turns that into "informa- tion": the hyphen is part of the copied text, so the tool keeps it and adds the normal single space between the lines. For example, fix these with a quick find and replace of "- " with nothing, checking genuine hyphenated words like "well-known" before accepting each change.',
  },
];
