import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'kbb-faq-1',
    question: 'What is kebab-case?',
    answer:
      'kebab-case writes all letters in lowercase and joins words with hyphens: "User Profile Image" becomes "user-profile-image". It is the standard for CSS class names, HTML IDs, URL slugs, and command-line flags.',
  },
  {
    id: 'kbb-faq-2',
    question: 'Why is kebab-case good for URLs?',
    answer:
      'Hyphens are treated as word separators by search engines, so "how-to-count-words" reads as three words rather than one. kebab-case also avoids spaces (which are not valid in URLs) and sidesteps case-sensitivity problems on some servers.',
  },
  {
    id: 'kbb-faq-3',
    question: 'Can I use kebab-case in code identifiers?',
    answer:
      'No. Most programming languages read the hyphen as a minus sign, so kebab-case cannot be used for variable or function names. Use it for CSS, HTML, URLs, and filenames; use camelCase or snake_case inside code.',
  },
  {
    id: 'kbb-faq-4',
    question: 'How does it handle punctuation and multiple words?',
    answer:
      'Spaces, underscores, existing hyphens, and camelCase humps are all treated as boundaries, and other punctuation is dropped, leaving a clean slug. Each line is converted independently.',
  },
  {
    id: 'kbb-faq-5',
    question: 'How do I turn a blog title into a URL slug?',
    answer:
      'Paste the title into the converter and copy the output: every word is lowercased and joined with hyphens, which is the shape a URL slug takes. For example, "10 Tips for Faster CSS" becomes "10-tips-for-faster-css". One difference matters for URLs: kebab-case keeps accented letters, so "Café Menu" becomes "café-menu", while a dedicated slugifier also strips accents and URL-unsafe characters down to plain ASCII. For titles you plan to publish as web addresses, run the result through the Slugify Text tool as the final step.',
  },
  {
    id: 'kbb-faq-6',
    question: 'How do I make a CSS-class-safe name from a phrase?',
    answer:
      'Convert the phrase to kebab-case: lowercase letters, digits, and hyphens are all valid in CSS class names, and hyphens are the separator stylesheets already use. For example, "Primary Button Large" becomes "primary-button-large", ready to use in a selector as .primary-button-large. Punctuation that would break a selector, such as periods, colons, or brackets, is treated as a word boundary and removed. One rule stays yours to check: a class name cannot start with a digit, so rework a phrase like "3 column layout" after converting.',
  },
  {
    id: 'kbb-faq-7',
    question: 'Why were special characters left in my slug?',
    answer:
      'Punctuation and symbols are always removed, but accented and other Unicode letters are kept on purpose: "Café Menu!" becomes "café-menu", not "caf-menu". kebab-case serves code-facing names such as CSS classes, HTML data attributes, and file names, and Unicode letters are legal in all of them, so stripping accents would corrupt real words. Symbols like &, ?, and # act as word boundaries and never survive conversion. If you need a plain-ASCII result for a public web address, accent transliteration is a slugifier job, not a case converter job.',
  },
  {
    id: 'kbb-faq-8',
    question: 'Why did consecutive hyphens appear in my slug?',
    answer:
      'This converter never produces consecutive hyphens: any run of spaces, symbols, or existing hyphens collapses into one boundary, so "hello -- world!!" becomes "hello-world". Doubled hyphens come from scripts that replace each illegal character one for one; "rock & roll" turns into "rock---roll" when the space, ampersand, and second space each become a hyphen. Paste the broken string here to repair it: separator runs collapse, empty fragments are dropped, and leading or trailing punctuation disappears instead of leaving a stray hyphen at either end.',
  },
];
