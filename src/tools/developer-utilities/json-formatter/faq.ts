import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'json-fmt-faq-1',
    question: 'How do I format JSON online?',
    answer:
      'Paste your JSON into the formatter and run format. Valid JSON comes back indented and line-broken. Invalid JSON is rejected with an error until you fix the syntax. Nothing leaves your browser.',
  },
  {
    id: 'json-fmt-faq-2',
    question: 'What does a JSON formatter do?',
    answer:
      'It takes valid JSON and rewrites it with consistent indentation and line breaks. The data is unchanged: same keys, same values, same structure. Only the whitespace changes, from a compact single line to a multi-line layout that humans can read and scan.',
  },
  {
    id: 'json-fmt-faq-3',
    question: 'Does formatting change what the JSON means?',
    answer:
      'No. Whitespace between tokens is not significant in JSON. `{"a":1}` and `{ "a": 1 }` and the four-space indented multi-line version all parse to identical data. Any JSON parser reads all three as the same object.',
  },
  {
    id: 'json-fmt-faq-4',
    question: 'What\'s the difference between formatting and minifying?',
    answer:
      'Opposite operations, same data. Formatting adds whitespace for readability. Minifying removes it for size. Both produce valid JSON. You can format a minified response to inspect it, then minify again before sending it: the data survives both trips intact.',
  },
  {
    id: 'json-fmt-faq-5',
    question: 'What is the difference between formatting and validating JSON?',
    answer:
      'Formatting adds whitespace to valid JSON so humans can read it. Validating checks whether the text is legal JSON and reports syntax errors. If the formatter rejects your input, fix the syntax with a validator first, then format.',
  },
  {
    id: 'json-fmt-faq-6',
    question: 'Is the JSON Formatter private?',
    answer:
      'Yes. Formatting runs in your browser. Your JSON is not sent to a server for processing. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'json-fmt-faq-7',
    question: 'What indentation level should I use?',
    answer:
      '2 spaces is the most common choice in JavaScript and web projects. 4 spaces is common in Python and other ecosystems. Tabs are used in some style guides. The choice is cosmetic: JSON parsers treat all whitespace the same. Follow your project\'s existing style, or your team\'s preference.',
  },
  {
    id: 'json-fmt-faq-8',
    question: 'Why does my API response look like a mess?',
    answer:
      'Most APIs return minified JSON (no spaces, no line breaks) to reduce response size. That\'s the right call for production traffic, but hard to read in a terminal or browser. Paste the response into a formatter to turn it into a readable structure for debugging.',
  },
  {
    id: 'json-fmt-faq-9',
    question: 'What is pretty-printing?',
    answer:
      'Pretty-printing is the same thing as formatting: adding indentation and newlines to make structured text human-readable. The term comes from older programming contexts where "printing" meant outputting text. Pretty-print, format, and beautify all mean the same operation for JSON.',
  },
  {
    id: 'json-fmt-faq-10',
    question: 'Can I format JSON without uploading it?',
    answer:
      'Yes. ToyTools formats JSON in your browser and does not require uploading the input to a server.',
  },
  {
    id: 'json-fmt-faq-11',
    question: 'Is the JSON Formatter an AI tool?',
    answer:
      'No. It pretty-prints JSON. It does not call ChatGPT, Claude, Gemini, Grok, or any other model. You can paste the result into a model yourself.',
  },
  {
    id: 'json-fmt-faq-12',
    question: 'Can I format JSON that a chat model returned?',
    answer:
      'Yes. Paste the JSON here to inspect it. ToyTools does not send that text to a model. Copy the formatted result if you want to use it somewhere else.',
  },
];
