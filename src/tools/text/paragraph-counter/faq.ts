import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pc-faq-1',
    question: 'How does a paragraph counter work?',
    answer:
      'A paragraph counter splits the text on blank lines. Each contiguous block of non-empty lines is counted as one paragraph. So "Line 1\nLine 2\n\nLine 3" contains two paragraphs: the first includes "Line 1" and "Line 2", and the second is "Line 3". Lines with only spaces or tabs are treated as blank.',
  },
  {
    id: 'pc-faq-2',
    question: 'What defines a paragraph?',
    answer:
      'A paragraph is a block of text separated from adjacent blocks by one or more blank lines. In web and plain-text contexts, a blank line is the standard separator. In print and academic writing, paragraphs are sometimes indicated by indentation rather than blank lines. This tool uses blank-line separation, which is the most common digital convention.',
  },
  {
    id: 'pc-faq-3',
    question: 'How many paragraphs should an essay or article have?',
    answer:
      'A five-paragraph essay has an introduction, three body paragraphs, and a conclusion. Longer academic papers typically have one paragraph per argument or supporting point. For web articles, most SEO practitioners recommend 2 to 4 sentences per paragraph (shorter than academic writing) and a new paragraph for each new idea or sub-point.',
  },
  {
    id: 'pc-faq-4',
    question: 'What is the ideal paragraph length for web content?',
    answer:
      'For on-screen reading, shorter paragraphs improve readability. Most digital style guides recommend 2 to 4 sentences per paragraph, with no more than 100 to 150 words in a single block. Long paragraphs of 7 or more sentences create "walls of text" that readers tend to skip on screens, even if they would read the same content in print.',
  },
  {
    id: 'pc-faq-5',
    question: 'How is paragraph count different from sentence count?',
    answer:
      'Sentence count counts every complete thought ending with terminal punctuation. Paragraph count groups those sentences into visual or semantic blocks separated by blank lines. A 10-sentence essay might have 3 paragraphs if sentences are grouped into three blocks. Paragraph count measures structure; sentence count measures volume.',
  },
  {
    id: 'pc-faq-6',
    question: 'Why would I want to count paragraphs?',
    answer:
      'Paragraph count is useful for checking structural consistency in long documents, matching a required format (some assignments specify a number of paragraphs), verifying that a document has not been accidentally merged into one block, and comparing the visual density of writing before and after editing.',
  },
  {
    id: 'pc-faq-7',
    question: 'Does this paragraph counter upload my text?',
    answer:
      'No. All counting runs in your browser. Your text stays private and is never uploaded to any server. The tool is free to use, with no account or sign-up required.',
  },
];
