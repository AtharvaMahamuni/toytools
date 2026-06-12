import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'json-fmt-faq-1',
    question: 'What does a JSON formatter do?',
    answer:
      'It takes valid JSON and rewrites it with consistent indentation and line breaks. The data is unchanged: same keys, same values, same structure. Only the whitespace changes, from a compact single line to a multi-line layout that humans can read and scan.',
  },
  {
    id: 'json-fmt-faq-2',
    question: 'Does formatting change what the JSON means?',
    answer:
      'No. Whitespace between tokens is not significant in JSON. `{"a":1}` and `{ "a": 1 }` and the four-space indented multi-line version all parse to identical data. Any JSON parser reads all three as the same object.',
  },
  {
    id: 'json-fmt-faq-3',
    question: 'What\'s the difference between formatting and minifying?',
    answer:
      'Opposite operations, same data. Formatting adds whitespace for readability. Minifying removes it for size. Both produce valid JSON. You can format a minified response to inspect it, then minify again before sending it: the data survives both trips intact.',
  },
  {
    id: 'json-fmt-faq-4',
    question: 'What is pretty-printing?',
    answer:
      'Pretty-printing is the same thing as formatting, adding indentation and newlines to make structured text human-readable. The term comes from older programming contexts where "printing" meant outputting text. Pretty-print, format, and beautify all mean the same operation for JSON.',
  },
  {
    id: 'json-fmt-faq-5',
    question: 'I formatted my JSON but I\'m still getting parse errors, why?',
    answer:
      'A formatter only processes valid JSON. If the input has syntax errors (a trailing comma, unquoted keys, single-quoted strings) the formatter can\'t parse it and will show an error. Use a JSON validator to find and fix the specific syntax problem first, then format.',
  },
  {
    id: 'json-fmt-faq-6',
    question: 'What indentation level should I use?',
    answer:
      '2 spaces is the most common choice in JavaScript and web projects. 4 spaces is common in Python and other ecosystems. Tabs are used in some style guides. The choice is cosmetic: JSON parsers treat all whitespace the same. Follow your project\'s existing style, or your team\'s preference.',
  },
  {
    id: 'json-fmt-faq-7',
    question: 'Can a JSON formatter fix my JSON?',
    answer:
      'No. A formatter is not a repair tool. It can only add whitespace around valid tokens: it doesn\'t know how to add missing commas, quote unquoted keys, or remove illegal values. For syntax errors, you need to read the error message and edit the JSON manually.',
  },
  {
    id: 'json-fmt-faq-8',
    question: 'Why does my API response look like a mess?',
    answer:
      'Most APIs return minified JSON (no spaces, no line breaks) to reduce response size. That\'s the right call for production traffic, but hard to read in a terminal or browser. Paste the response into a formatter to turn it into a readable structure for debugging.',
  },
  {
    id: 'json-fmt-faq-9',
    question: 'Does JSON allow numbers with leading zeros?',
    answer:
      'No. `01`, `007`, `0123` are all invalid JSON numbers. The only valid zero is `0` itself. Numbers in JSON follow strict decimal notation: an optional minus sign, digits (no leading zeros unless the number is just `0`), an optional decimal point with more digits, and an optional exponent (`e` or `E`).',
  },
];
