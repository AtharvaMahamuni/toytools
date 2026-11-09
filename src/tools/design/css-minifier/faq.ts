import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'css-min-1',
    question: 'What does minifying CSS remove?',
    answer:
      'Comments and insignificant whitespace outside of strings and url() values. Selectors, property names, and values are not rewritten. Therefore calc(), custom properties and quoted content stay intact.',
  },
  {
    id: 'css-min-2',
    question: 'What can minifying not remove safely?',
    answer:
      'It does not drop unused rules, merge duplicates, or shorten colours. Those need a build pipeline that knows your HTML. A browser minifier that guessed would break pages.',
  },
  {
    id: 'css-min-3',
    question: 'What does beautify do?',
    answer:
      'Beautify expands minified CSS with two-space indentation and a line break after each semicolon and brace so you can read and edit it. It is the reverse layout pass of minify, not a linter.',
  },
  {
    id: 'css-min-4',
    question: 'Is my CSS sent to a server?',
    answer:
      'No. Tokenising, minifying and beautifying run in your browser. Nothing leaves this tab and nothing is stored remotely.',
  },
  {
    id: 'css-min-5',
    question: 'Will minify change how my page looks?',
    answer:
      'Not for ordinary stylesheets. Whitespace between tokens is insignificant in CSS. Keep a copy and compare after minifying if a stylesheet relies on a hack that needs a specific space inside a selector.',
  },
  {
    id: 'css-min-6',
    question: 'Does it handle @media and nested rules?',
    answer:
      'Yes at the token level: braces still open and close blocks. It does not understand CSS nesting semantics beyond brace matching, which is enough for minify and beautify.',
  },
  {
    id: 'css-min-7',
    question: 'Why show bytes saved?',
    answer:
      'So you can see whether a minify pass is worth shipping. A small file shrinks only a few bytes once gzip is applied; a large one drops kilobytes of comments and spaces.',
  },
  {
    id: 'css-min-8',
    question: 'When should I not minify?',
    answer:
      'When you still need to edit the file by hand, or when your deploy pipeline already minifies. Beautify first, edit, then minify as a last step before publish.',
  },
];
