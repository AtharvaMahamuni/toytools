import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'slugify-text-faq-1',
    question: 'What is a URL slug?',
    answer:
      'A slug is the human-readable part of a web address that identifies a page, such as "how-to-slugify-text" in /guide/how-to-slugify-text. A good slug is lowercase, uses hyphens between words, and contains only letters and numbers.',
  },
  {
    id: 'slugify-text-faq-2',
    question: 'How does slugify handle accents and symbols?',
    answer:
      'Accented letters are converted to their plain ASCII base first, so "Café" becomes "cafe". Every run of spaces, punctuation, or other symbols is replaced with a single hyphen, and leading or trailing hyphens are trimmed.',
  },
  {
    id: 'slugify-text-faq-3',
    question: 'Can I slugify a whole list at once?',
    answer:
      'Yes. Each line is turned into its own slug, so you can paste a list of titles and get one slug per line back. This is handy for generating permalinks for many posts at once.',
  },
  {
    id: 'slugify-text-faq-4',
    question: 'Why are clean slugs good for SEO?',
    answer:
      'Readable, keyword-bearing slugs are easier for people to recognise and share, and they give search engines a clear, stable signal about the page topic. Random or symbol-heavy URLs do neither.',
  },
];
