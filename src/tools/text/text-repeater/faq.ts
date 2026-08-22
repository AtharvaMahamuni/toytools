import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rep-faq-1',
    question: 'How do I repeat a word a hundred times?',
    answer:
      'Type the word, set the copies field to 100, and pick what goes between the copies. The result appears as you type, so there is no button to press. The separator matters more than the count does: with nothing between them, a hundred copies of "test" arrive as one 400-character word that no editor will wrap sensibly.',
  },
  {
    id: 'rep-faq-2',
    question: 'How do I number each repeated copy?',
    answer:
      'Tick "number each copy" and every line gets a 1. 2. 3. prefix in order. That turns one line into a numbered list, which is the fastest way to mock up a table of rows or a set of placeholder items you will edit individually afterwards. The numbering counts the copies rather than the lines, so a multi-line block keeps one number per block.',
  },
  {
    id: 'rep-faq-3',
    question: 'Why was my output too big to paste?',
    answer:
      'Because the count field is one keystroke away from an accident. Fifty copies of a paragraph is a few kilobytes and 50,000 copies of the same paragraph is several megabytes, and the extra zero costs nothing to type. The tool measures the result before building it, tells you the size in kilobytes or megabytes, and offers a count that lands under the point where selecting and pasting gets slow. Past five megabytes it declines to build the string at all.',
  },
  {
    id: 'rep-faq-4',
    question: 'What separator should I pick?',
    answer:
      'A new line for anything you will read or edit afterwards, which is why it is the default. Nothing for padding a field to a character length, where the separator would count toward the limit. A space for building a long sentence. A comma and space for a quick inline list. A blank line when each copy is a paragraph and you want them visually separated.',
  },
  {
    id: 'rep-faq-5',
    question: 'Can I use this to make test data?',
    answer:
      'For length tests, yes, and it is the right tool. Repeat a string until you hit the character count you want to push a field past. For anything that tests behaviour rather than size, repeated text is a poor substitute, because identical rows hide bugs in sorting, deduplication and indexing. Use the lorem ipsum generator when you need filler that varies.',
  },
  {
    id: 'rep-faq-6',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. The repeat happens in your browser and nothing you type leaves the page. Your text, count and separator persist on this device so the tool opens the way you left it, with the stored text capped at 20,000 characters so a large paste does not fill your browser storage. Clearing your browser data removes it.',
  },
];
