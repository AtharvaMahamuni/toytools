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
      'Generally no. Most programming languages read the hyphen as a minus sign, so kebab-case cannot be used for variable or function names. Use it for CSS, HTML, URLs, and filenames; use camelCase or snake_case inside code.',
  },
  {
    id: 'kbb-faq-4',
    question: 'How does it handle punctuation and multiple words?',
    answer:
      'Spaces, underscores, existing hyphens, and camelCase humps are all treated as boundaries, and other punctuation is dropped, leaving a clean slug. Each line is converted independently.',
  },
];
