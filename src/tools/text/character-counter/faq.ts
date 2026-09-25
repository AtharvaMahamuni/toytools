import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cc-faq-1',
    question: 'How do I count characters in text?',
    answer:
      'Paste or type your text and the counts update live. You get characters with spaces (the total length) and characters without spaces (letters and symbols only). Use the with-spaces total against most platform limits.',
  },
  {
    id: 'cc-faq-2',
    question: 'Do spaces count as characters?',
    answer:
      'Yes. A space is a character and is included in the characters with spaces count. Most platform character limits (Twitter/X, LinkedIn, Instagram) count spaces. If you need only the non-space content length, use the characters without spaces count.',
  },
  {
    id: 'cc-faq-3',
    question: 'Do emoji count as one character?',
    answer:
      'In most user-facing counts (including this tool and many social platforms), a simple emoji often counts as one or two characters. Twitter/X counts many standard emoji as two characters because it uses UTF-16 encoding. Combined emoji sequences (skin tone modifiers, family emoji) count as more.',
  },
  {
    id: 'cc-faq-4',
    question: 'Is my text uploaded?',
    answer:
      'No. All counting happens in your browser using JavaScript, with no server and no account required. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'cc-faq-5',
    question: 'What is the difference between characters with and without spaces?',
    answer:
      'Characters with spaces is the total length of the text including every space. Characters without spaces excludes all whitespace characters (spaces, tabs, newlines). For the text "Hello, World!", the with-spaces count is 13 and the without-spaces count is 11. Most platform character limits count characters with spaces.',
  },
  {
    id: 'cc-faq-6',
    question: 'What are the character limits for popular platforms?',
    answer:
      'Twitter/X allows 280 characters per post (URLs count as 23 regardless of actual length). LinkedIn posts allow 3,000 characters. LinkedIn comments allow 1,250 characters. Instagram captions allow 2,200 characters. SMS messages are 160 characters in GSM-7 encoding (70 characters for Unicode texts). Meta (Facebook) post limit is 63,206 characters.',
  },
  {
    id: 'cc-faq-7',
    question: 'What is the difference between character count and byte count?',
    answer:
      'Character count counts each visible symbol as one character. Byte count measures storage size. For plain ASCII text (English letters, digits, punctuation), one character equals one byte. For Unicode characters (emoji, accented letters, Chinese or Arabic script) each character may require 2 to 4 bytes in UTF-8 encoding. Some APIs and databases have byte limits rather than character limits.',
  },
  {
    id: 'cc-faq-8',
    question: 'How do I fit my text into 280 characters?',
    answer:
      'Paste your draft, watch the characters with spaces total, and cut until it reads 280 or less, because X counts spaces, punctuation, and line breaks toward the limit. For example, a 306-character draft needs 26 characters removed: swap "in order to" for "to" (saves 9), delete filler adverbs, and remember each link occupies a flat 23 characters no matter its length.',
  },
  {
    id: 'cc-faq-9',
    question: 'Do line breaks count as characters?',
    answer:
      'Yes, each line break adds exactly 1 to the characters with spaces total, because browsers normalize every pasted break to a single newline, including Windows CRLF pairs from Word or Notepad. The without spaces figure excludes line breaks entirely, since a newline is whitespace, so check the with spaces number against any platform limit.',
  },
  {
    id: 'cc-faq-10',
    question: 'Can I count characters in a prompt without uploading it?',
    answer:
      'Yes. The count runs in your browser. The text is not sent to a server, and this page does not call an AI model.',
  },
  {
    id: 'cc-faq-11',
    question: 'Is a character count the same as a token count?',
    answer:
      'No. This page counts characters, with and without spaces. It does not estimate or count model tokens.',
  },
];
