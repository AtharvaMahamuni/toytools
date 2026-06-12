import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cc-faq-1',
    question: 'How does a character counter work?',
    answer:
      'A character counter measures the total length of a string by counting every individual symbol, letters, numbers, spaces, punctuation, and special characters. This tool provides two counts: characters with spaces (the total length) and characters without spaces (letters and symbols only, excluding whitespace).',
  },
  {
    id: 'cc-faq-2',
    question: 'What is the difference between characters with and without spaces?',
    answer:
      'Characters with spaces is the total length of the text including every space. Characters without spaces excludes all whitespace characters (spaces, tabs, newlines). For the text "Hello, World!", the with-spaces count is 13 and the without-spaces count is 11. Most platform character limits count characters with spaces.',
  },
  {
    id: 'cc-faq-3',
    question: 'What are the character limits for popular platforms?',
    answer:
      'Twitter/X allows 280 characters per post (URLs count as 23 regardless of actual length). LinkedIn posts allow 3,000 characters. LinkedIn comments allow 1,250 characters. Instagram captions allow 2,200 characters. SMS messages are 160 characters in GSM-7 encoding (70 characters for Unicode texts). Meta (Facebook) post limit is 63,206 characters.',
  },
  {
    id: 'cc-faq-4',
    question: 'Is a space counted as a character?',
    answer:
      'Yes. A space is a character and is included in the characters with spaces count. Most platform character limits (Twitter, LinkedIn, Instagram) count spaces. If you need to know only the non-space content length, use the characters without spaces count.',
  },
  {
    id: 'cc-faq-5',
    question: 'What is the difference between character count and byte count?',
    answer:
      'Character count counts each visible symbol as one character. Byte count measures storage size. For plain ASCII text (English letters, digits, punctuation), one character equals one byte. For Unicode characters (emoji, accented letters, Chinese or Arabic script) each character may require 2 to 4 bytes in UTF-8 encoding. Some APIs and databases have byte limits rather than character limits.',
  },
  {
    id: 'cc-faq-6',
    question: 'Do emoji count as one character?',
    answer:
      'In most user-facing counts (including this tool and most social platforms), an emoji counts as one or two characters. Twitter counts standard emoji as two characters because it uses UTF-16 encoding, where many emoji require two code units. Simple emoji like smiley faces count as two on Twitter; combined emoji sequences (like skin tone modifiers) count as more.',
  },
  {
    id: 'cc-faq-7',
    question: 'What is the ideal character count for an SEO meta description?',
    answer:
      'Google typically displays meta descriptions up to 155 to 160 characters before truncating. Best practice is to write descriptions between 120 and 158 characters: long enough to be informative, short enough to display in full. Meta titles are typically limited to 50 to 60 characters.',
  },
  {
    id: 'cc-faq-8',
    question: 'Is my text uploaded when I use this character counter?',
    answer:
      'No. All counting happens in your browser using JavaScript. Your text never leaves your device: there is no server, no upload, and no account required. Privacy is fully protected.',
  },
];
