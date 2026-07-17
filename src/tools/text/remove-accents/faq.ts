import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'remove-accents-faq-1',
    question: 'What does removing accents do?',
    answer:
      'It strips the diacritical marks from letters while keeping the base letter, so "café" becomes "cafe" and "naïve" becomes "naive". Case, spacing, and punctuation are all left exactly as they were.',
  },
  {
    id: 'remove-accents-faq-2',
    question: 'How does it work under the hood?',
    answer:
      'The text is normalised so each accented letter is split into a base letter plus a separate combining mark, then the combining marks are removed. This keeps the underlying letter intact rather than deleting the whole character.',
  },
  {
    id: 'remove-accents-faq-3',
    question: 'Does it change letters like the German ß or the Polish ł?',
    answer:
      'Letters that are not formed from a base letter plus a combining accent are left unchanged, because there is no diacritic to strip. To map those to ASCII you would need an explicit transliteration step, which this tool does not perform.',
  },
  {
    id: 'remove-accents-faq-4',
    question: 'When would I need plain ASCII text?',
    answer:
      'Legacy databases, file names, usernames, and some import formats only accept unaccented ASCII. Removing accents is a quick way to make accented text compatible without retyping it.',
  },
  {
    id: 'remove-accents-faq-5',
    question: 'What is Unicode normalization?',
    answer:
      'Unicode normalization converts text into one of several standard forms so that equivalent characters are always encoded the same way. The NFD form used by this tool decomposes é into the letter e followed by a combining acute accent, U+0301. For example, café can be stored with é as one code point or as two; NFD makes both identical, and dropping the combining marks in the range U+0300 to U+036F then yields plain cafe.',
  },
  {
    id: 'remove-accents-faq-6',
    question: 'How do I strip diacritics before a CSV or database import?',
    answer:
      'Paste the column values into the tool, then copy the output back before running the import; every diacritic is removed while rows, commas, quotes, and casing stay untouched, so the CSV structure survives. For example, a name column containing José García and Renée Müller becomes Jose Garcia and Renee Muller, values a strict ASCII-only column or legacy system will accept instead of rejecting the rows.',
  },
  {
    id: 'remove-accents-faq-7',
    question: 'What is the difference between stripping accents and slugifying?',
    answer:
      'Stripping accents removes only the diacritical marks and leaves spacing, punctuation, and case exactly as they were, while slugifying rewrites the entire string into a lowercase, hyphenated URL identifier. Use this tool for data work where the text must stay readable, such as matching São Paulo against Sao Paulo in a search index. For example, this tool turns "Crème Brûlée!" into "Creme Brulee!", where a slugifier would output creme-brulee.',
  },
  {
    id: 'remove-accents-faq-8',
    question: 'Why did ø, ß, or æ not change?',
    answer:
      'Those characters stay as they are because each is a standalone letter with no combining accent, so NFD decomposition finds nothing to strip. The tool only deletes marks in the combining range U+0300 to U+036F, and ø, ß, æ, and ł never decompose into a base character followed by such a mark. For example, "Søren Åberg" becomes "Søren Aberg": the å splits into a plus a ring, but the slashed ø survives intact. Transliterate those letters separately when you need pure ASCII.',
  },
];
