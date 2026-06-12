import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sc-faq-1',
    question: 'How does a sentence counter work?',
    answer:
      'A sentence counter detects sentence boundaries by looking for sentence-ending punctuation, periods (.), exclamation marks (!), and question marks (?). Each occurrence after meaningful content is counted as the end of a sentence. The result is then divided into the total word count to calculate average sentence length.',
  },
  {
    id: 'sc-faq-2',
    question: 'What counts as a sentence?',
    answer:
      'A sentence is any sequence of words ending with a period, exclamation mark, or question mark followed by whitespace or the end of the text. Fragments ending with punctuation count as sentences. Sentences without terminal punctuation (common in informal writing) are not counted unless the text ends there.',
  },
  {
    id: 'sc-faq-3',
    question: 'How do abbreviations affect the sentence count?',
    answer:
      'Abbreviations ending with a period (such as "Dr.", "e.g.", "U.S.A.") are treated as sentence terminators by most counters. This can inflate the sentence count. For example, "Dr. Smith arrived at 9 a.m. and left at noon." might be counted as three sentences instead of one. If accuracy is critical, review the count manually for texts heavy with abbreviations.',
  },
  {
    id: 'sc-faq-4',
    question: 'What is a good average sentence length?',
    answer:
      'Most style guides recommend 15 to 20 words per sentence for general prose. Academic writing averages 20 to 25 words. Conversational writing for web audiences targets 12 to 18 words. Long sentences over 30 words tend to be harder to read; very short sentences under 8 words can feel choppy in isolation. Variety is more important than hitting a specific number.',
  },
  {
    id: 'sc-faq-5',
    question: 'How many sentences should a paragraph have?',
    answer:
      'No strict rule exists, but three to five sentences per paragraph is a common guideline for web writing. Academic paragraphs average five to eight sentences. The key is that each paragraph should have a single clear point: when the point changes, start a new paragraph, regardless of length.',
  },
  {
    id: 'sc-faq-6',
    question: 'Is a sentence counter useful for readability analysis?',
    answer:
      'Yes. Sentence count and average sentence length are inputs to several readability formulas, including the Flesch Reading Ease score and the Flesch-Kincaid Grade Level. Both formulas use average sentence length (in words) and average word length (in syllables) to estimate how difficult text is to read. Lower sentence counts with shorter sentences typically produce more readable scores.',
  },
  {
    id: 'sc-faq-7',
    question: 'Does this sentence counter upload my text?',
    answer:
      'No. All counting runs in your browser using JavaScript. Your text stays private: nothing is uploaded to any server, no account is required, and the tool is completely free to use.',
  },
];
