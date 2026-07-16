import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'nw-faq-1',
    question: 'What does normalizing whitespace do?',
    answer:
      'It replaces every run of whitespace (spaces, tabs, and line breaks) with a single space, then trims the ends. Any mix of messy spacing collapses into one clean, single-spaced line.',
  },
  {
    id: 'nw-faq-2',
    question: 'How is this different from Remove Extra Spaces?',
    answer:
      'Remove Extra Spaces collapses runs of spaces and tabs but keeps your line breaks. Normalize Whitespace goes further: it also flattens line breaks, turning multi-line text into a single line.',
  },
  {
    id: 'nw-faq-3',
    question: 'When should I use it?',
    answer:
      'Use it to turn copy-pasted, multi-line content into one tidy line, for example before putting a value into a CSV cell, a search box, a single-line database field, or a URL parameter.',
  },
  {
    id: 'nw-faq-4',
    question: 'Will it keep my paragraphs separate?',
    answer:
      'No. Because it removes line breaks, all text becomes one line. If you need to keep paragraphs, use Remove Extra Spaces or Trim Text instead.',
  },
  {
    id: 'nw-faq-5',
    question: 'What is whitespace normalization?',
    answer:
      'Whitespace normalization replaces every run of whitespace characters, whatever mix of spaces, tabs, or line breaks it contains, with one standard single space, then trims both ends. Every gap in the text ends up the same width, so downstream code sees predictable input. For example, a heading indented with two tabs, followed by three spaces and a stray newline, normalizes to plain words separated by single spaces on one line.',
  },
  {
    id: 'nw-faq-6',
    question: 'Which whitespace characters get standardized?',
    answer:
      'All of them: regular spaces, tabs, newlines, carriage returns, and Unicode spaces such as the non-breaking space that web pages paste in. Any run of these characters, in any combination, becomes one plain space. That scope is what makes normalization broader than a double-space fix, which only merges repeated spaces. For example, a value containing a tab, a non-breaking space, and a newline comes out with three ordinary single spaces instead.',
  },
  {
    id: 'nw-faq-7',
    question: 'How do I make spacing consistent before parsing text?',
    answer:
      'Run the raw text through Normalize Whitespace first, so your parser only ever meets single spaces between tokens. Paste the input, copy the flattened output, and feed that to your script or import step. For example, a product list pasted from a spreadsheet arrives with tabs between columns and a newline after each row; after normalizing, it is one line of space-separated values that a simple split on spaces handles reliably.',
  },
  {
    id: 'nw-faq-8',
    question: 'What is the difference between normalizing whitespace and trimming?',
    answer:
      'Trimming only deletes whitespace at the edges of text and leaves everything between the first and last character untouched, while normalizing rewrites the interior too, collapsing tabs, repeated spaces, and line breaks into single spaces. For example, a line padded with two leading spaces and holding a tab in the middle keeps that tab after trimming, but normalization converts it to one space and removes the padding as well. Trim when only the padding is wrong; normalize when interior spacing is inconsistent too.',
  },
  {
    id: 'nw-faq-9',
    question: 'Is it safe to paste private data into an online whitespace normalizer?',
    answer:
      'Yes, this normalizer runs entirely in your browser, so the text you paste never leaves your device or reaches any server. The collapse of tabs, spaces, and line breaks happens locally in JavaScript the moment you type. That matters because normalization is a first pass over raw exports, logs, or customer records. For example, you can flatten a pasted database row into a single clean line without the contents ever being transmitted.',
  },
];
