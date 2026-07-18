import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tc-faq-1',
    question: 'What is Title Case?',
    answer:
      'Title Case capitalizes the first letter of each word: "the quick brown fox" becomes "The Quick Brown Fox". It is used for headings, article titles, book titles, and film titles.',
  },
  {
    id: 'tc-faq-2',
    question: 'Which words should be capitalized in a title?',
    answer:
      'Traditional style guides capitalize nouns, verbs, adjectives, and adverbs, and keep articles (a, an, the), short prepositions (in, on, at, of), and coordinating conjunctions (and, but, or) lowercase, unless they begin the title. This tool capitalizes the first letter of every word, which is the most common convention and a reliable starting point you can fine-tune.',
  },
  {
    id: 'tc-faq-3',
    question: 'What is the difference between Title Case and sentence case?',
    answer:
      'Title Case capitalizes the first letter of each word ("The Quick Brown Fox"), while sentence case capitalizes only the first word and proper nouns ("The quick brown fox"). Title Case suits headings; sentence case suits body text and UI labels.',
  },
  {
    id: 'tc-faq-4',
    question: 'Should I use Title Case for body text?',
    answer:
      'No. Title Case is designed for short headings and titles. Using it for full paragraphs looks overly formal and is harder to read. Use sentence case for body copy.',
  },
  {
    id: 'tc-faq-5',
    question: 'Does it change my numbers or punctuation?',
    answer:
      'No. Only the first letter of each word is affected. Numbers, punctuation, and symbols are left exactly as they are.',
  },
  {
    id: 'tc-faq-6',
    question: 'How do you convert a headline to title case?',
    answer:
      'Paste your headline into the input box and the converter capitalizes the first letter of every word instantly, with no button to press. For example, pasting "the future of remote work in 2026" returns "The Future Of Remote Work In 2026". Copy the result, then lowercase any short words your style guide keeps down, such as "of" and "in", so the finished headline reads "The Future of Remote Work in 2026" for AP or Chicago style.',
  },
  {
    id: 'tc-faq-7',
    question: 'Should the word of or the be capitalized in a title?',
    answer:
      'No, in the middle of a title "of" and "the" stay lowercase in every major style guide; only as the first or last word do they take a capital. For example, Chicago style writes "The Art of War" but "Of Mice and Men", because "Of" opens the second title. The guides split on longer prepositions: AP capitalizes prepositions of four letters or more, such as "With", while Chicago keeps every preposition lowercase regardless of length.',
  },
  {
    id: 'tc-faq-8',
    question: 'Why did the converter capitalize a small word like and or in?',
    answer:
      'The converter capitalized it because it applies one mechanical rule: it lowercases your text, then capitalizes the first letter of every word, with no built-in list of minor words. For example, "a walk in the park" comes back as "A Walk In The Park", while AP and Chicago style both expect "A Walk in the Park". After converting, lowercase the offending small words by hand; that final pass takes a few seconds on a normal headline.',
  },
  {
    id: 'tc-faq-9',
    question: 'How does title case handle hyphenated words like well-known?',
    answer:
      'The converter capitalizes every part of a hyphenated word, turning "well-known" into "Well-Known" and "e-commerce" into "E-Commerce". For example, "state-of-the-art design for e-commerce" becomes "State-Of-The-Art Design For E-Commerce". Chicago style instead keeps articles and prepositions inside a compound lowercase, so the edited headline reads "State-of-the-Art Design for E-Commerce". A capital after a hyphen is this tool working as designed, not a bug; lowercase the inner "of" and "the" yourself when your style guide requires it.',
  },
];
