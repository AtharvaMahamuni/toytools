import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'json-val-faq-1',
    question: 'What does JSON validation do?',
    answer:
      'It checks whether your text is syntactically valid JSON. The validator tries to parse the input according to the JSON specification (RFC 8259). If parsing succeeds, the JSON is valid. If not, it reports the error — what went wrong and where.',
  },
  {
    id: 'json-val-faq-2',
    question: 'What are the most common JSON syntax errors?',
    answer:
      'Trailing commas after the last element in an object or array. Single-quoted strings instead of double-quoted. Unquoted property keys. Comments (JSON has none). Using `undefined`, `NaN`, or `Infinity` as values — JSON only allows strings, numbers, objects, arrays, `true`, `false`, and `null`. Missing or extra brackets and braces round out the list.',
  },
  {
    id: 'json-val-faq-3',
    question: 'What\'s the difference between JSON and a JavaScript object literal?',
    answer:
      'JSON is stricter. JavaScript lets you use unquoted keys, single-quoted strings, trailing commas, comments, and values like `undefined` and `NaN`. JSON requires double-quoted keys, double-quoted strings, no trailing commas, no comments, and only its six value types. Code that looks like a JS object often isn\'t valid JSON.',
  },
  {
    id: 'json-val-faq-4',
    question: 'Why are trailing commas invalid in JSON?',
    answer:
      'JSON was designed to be simple and unambiguous to parse. Trailing commas after the last element — `[1, 2, 3,]` — were excluded to avoid the ambiguity around what follows the final comma. JavaScript and TypeScript have added trailing comma support over time, but JSON deliberately kept the grammar strict.',
  },
  {
    id: 'json-val-faq-5',
    question: 'Why can\'t JSON have comments?',
    answer:
      'By design. Douglas Crockford, who specified JSON, removed comment support intentionally to prevent people from using JSON as a config format with parsing instructions in comments. He wanted JSON to be purely a data interchange format. If you need comments in config files, look at JSONC (used by VS Code) or JSON5.',
  },
  {
    id: 'json-val-faq-6',
    question: 'What\'s the difference between syntax validation and JSON Schema validation?',
    answer:
      'Syntax validation checks whether the text is valid JSON — correct structure, legal characters, proper types. JSON Schema validation checks whether a valid JSON document conforms to a schema — required fields, value types, string patterns, numeric ranges. Syntax validation is a prerequisite: the JSON must be syntactically valid before Schema validation can run.',
  },
  {
    id: 'json-val-faq-7',
    question: 'My JavaScript object serializes fine but JSON.parse fails — why?',
    answer:
      'The most common cause is that the string wasn\'t actually produced by `JSON.stringify`. Strings that were manually assembled, logged from a debugger, or copied from a dev tools console can include JavaScript-style syntax (single quotes, unquoted keys, `undefined`) that `JSON.stringify` would never produce. Paste the string directly into a validator to see the exact error.',
  },
  {
    id: 'json-val-faq-8',
    question: 'Is JSONC or JSON5 valid JSON?',
    answer:
      'No. JSONC (JSON with Comments) and JSON5 are supersets of JSON — they add comment syntax, single quotes, trailing commas, and other extensions. They\'re valid in tools that specifically support them (VS Code uses JSONC for its config files), but a standard JSON parser rejects them. Treat them as different formats.',
  },
  {
    id: 'json-val-faq-9',
    question: 'Can a JSON object have duplicate keys?',
    answer:
      'The spec says it "should" avoid duplicate keys but doesn\'t explicitly forbid them. In practice, parsers handle duplicates inconsistently — some keep the last value, some the first, some all of them. This means duplicate keys produce behavior that varies by parser and language. Validation tools flag duplicates as a warning even if the parser accepts them.',
  },
];
