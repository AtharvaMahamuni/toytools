import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'wc-faq-1',
    question: 'How does a word counter work?',
    answer:
      'A word counter splits your text on whitespace (spaces, tabs, and line breaks) and counts the resulting tokens as words. Most counters also strip leading and trailing whitespace before counting, so extra spaces between words do not inflate the total. This tool counts in real time as you type or paste.',
  },
  {
    id: 'wc-faq-2',
    question: 'What counts as a word?',
    answer:
      'A word is any sequence of non-whitespace characters separated by spaces or line breaks. Numbers ("42"), hyphenated words ("well-known"), contractions ("don\'t"), and URLs each typically count as one word. The exact definition varies between tools, which is why two different counters may give slightly different results for the same text.',
  },
  {
    id: 'wc-faq-3',
    question: 'How long does it take to read 1000 words?',
    answer:
      'At an average adult reading speed of around 200–250 words per minute, 1000 words takes approximately 4–5 minutes to read. Reading time estimates are averages: technical text with complex vocabulary takes longer than casual prose. This tool calculates an estimated reading time based on a 200 wpm average.',
  },
  {
    id: 'wc-faq-4',
    question: 'What is the character limit for a tweet or LinkedIn post?',
    answer:
      'Twitter/X allows 280 characters per post (URLs count as 23 characters regardless of length). LinkedIn posts allow up to 3,000 characters. LinkedIn articles allow up to 125,000 characters. Character count is different from word count: use the character count stat when writing for character-limited platforms.',
  },
  {
    id: 'wc-faq-5',
    question: 'What is the difference between word count and character count?',
    answer:
      'Word count counts discrete words separated by whitespace. Character count counts every individual character, including spaces, punctuation, and symbols. "Hello, world!" is 2 words but 13 characters (with space). Use word count for essays and articles; use character count for SMS messages, social media, and fields with character limits.',
  },
  {
    id: 'wc-faq-6',
    question: 'Why do different word counters give different results?',
    answer:
      'Counters differ in how they handle edge cases: hyphenated words (1 word or 2?), contractions (1 word), lines with only punctuation, multiple consecutive spaces, and em-dashes without spaces. Most differences are small. For academic submissions where the exact count matters, use the counter specified by your institution or submission system.',
  },
  {
    id: 'wc-faq-7',
    question: 'How is reading time calculated?',
    answer:
      'Reading time is estimated by dividing the word count by a typical reading speed. The most common reference is 200 words per minute for average adult reading of prose. At that rate, a 1,000-word article takes 5 minutes. Some tools use 250 wpm. Technical documentation is typically slower, around 100–150 wpm.',
  },
  {
    id: 'wc-faq-8',
    question: 'Does this tool count the text in headings and titles?',
    answer:
      'Yes, this tool counts every word in whatever text you paste or type into it. If you paste your full document including headings, they are included. If you want to count only the body text, paste only that section. There is no automatic detection of structural elements like headings.',
  },
];
