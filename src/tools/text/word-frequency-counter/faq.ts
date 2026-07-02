import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'wf-faq-1',
    question: 'What does a word frequency counter do?',
    answer:
      'It counts how many times each distinct word appears in your text and ranks the results. You see every word with its count and its share of the total, sorted by frequency or alphabetically. The headline metric is the number of unique words; the table below it is the full breakdown.',
  },
  {
    id: 'wf-faq-2',
    question: 'How are words counted? Is it case sensitive?',
    answer:
      'Words are matched across languages using Unicode letters, and counting is case insensitive: The, THE, and the tally as one word. Apostrophes and internal hyphens stay part of the word, so don\'t and well-known each count as a single word rather than splitting apart.',
  },
  {
    id: 'wf-faq-3',
    question: 'What does the "hide common words" filter remove?',
    answer:
      'It removes stop words: extremely frequent function words like the, a, of, and, to, and pronouns. They dominate every English text and rarely say anything about its subject. With the filter on, the ranking surfaces the meaningful vocabulary, which is what you want for spotting themes or overused terms.',
  },
  {
    id: 'wf-faq-4',
    question: 'What is word frequency analysis used for?',
    answer:
      'Writers and editors use it to catch overused words and crutch phrases before a reader does. SEOs check keyword density and topical coverage. Students and researchers profile vocabulary in a corpus, and language learners extract the most useful words from a text they want to read. Support and product teams mine feedback for recurring terms.',
  },
  {
    id: 'wf-faq-5',
    question: 'What is keyword density and does this tool show it?',
    answer:
      'Keyword density is a word\'s share of the total word count, shown here as the percentage next to each word. A term at 1 to 2% reads naturally in most articles; a much higher share reads repetitive to people and to search engines alike. Use the percentage column rather than raw counts when texts differ in length.',
  },
  {
    id: 'wf-faq-6',
    question: 'Why does my unique word count differ from other tools?',
    answer:
      'Tokenization rules differ. Tools disagree about hyphens, apostrophes, numbers, and case folding, and each choice changes what counts as one word. This tool lowercases everything and keeps internal apostrophes and hyphens. The relative ranking is stable across tools even when the exact totals differ.',
  },
  {
    id: 'wf-faq-7',
    question: 'Is there a limit on how much text I can analyze?',
    answer:
      'The counting itself handles book-length text comfortably because it is a single pass over the words. The table shows the top 50 entries and tells you how many distinct words there are in total, which keeps the page responsive even for very large inputs.',
  },
  {
    id: 'wf-faq-8',
    question: 'Is my text uploaded to a server?',
    answer:
      'No. The analysis runs entirely in your browser. Nothing you paste leaves the page, nothing is stored remotely, and the tool keeps working offline once loaded.',
  },
];
