import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jtv-faq-1',
    question: 'How do I find a specific key in a large JSON file?',
    answer:
      'Type the key name into the search box above the tree. The viewer highlights every match and automatically expands the parent nodes so each hit is visible. Use the Prev and Next buttons to jump between matches, and the "Match 3 of 12" counter tells you how many were found. Search also matches values and full paths, so "users[0]" or "active" both work.',
  },
  {
    id: 'jtv-faq-2',
    question: 'What is the difference between a dot path and a JSONPath?',
    answer:
      'A dot path uses plain access notation like data.users[0].name, which you can paste directly into JavaScript or most query languages. A JSONPath starts with a $ and looks like $.data.users[0].name, the format used by JSONPath libraries and many API tools. Each node offers both: click "path" for the dot form or "$" for the JSONPath form.',
  },
  {
    id: 'jtv-faq-3',
    question: 'Can I view very large JSON files?',
    answer:
      'Yes. When a document has more than about 5,000 nodes, the viewer shows the summary and node count first, then waits for you to click "Render anyway" before drawing the full tree. This guard prevents a multi-megabyte file from freezing the browser. Smaller files render immediately as you type.',
  },
  {
    id: 'jtv-faq-4',
    question: 'Does the viewer change or reformat my JSON?',
    answer:
      'No. The tree is a read-only view of the data. It does not reorder keys, change values, or alter the structure. The Download button saves a pretty-printed copy with 2-space indentation, but your original input is never modified. To transform the data, use the Format or Minify modes in the same JSON workspace.',
  },
  {
    id: 'jtv-faq-5',
    question: 'What do the numbers next to objects and arrays mean?',
    answer:
      'Each collapsed object shows a key count like "3 keys" and each array shows an item count like "5 items". This lets you gauge the size of a branch without expanding it. The summary above the tree adds totals for the whole document: size, maximum depth, and counts of keys, objects, arrays, and leaf values.',
  },
  {
    id: 'jtv-faq-6',
    question: 'How do I read a path that contains array indices?',
    answer:
      'Array elements are addressed by position, starting at zero. In data.users[0].name, the [0] means the first element of the users array, not a key named "0". Object keys appear after a dot, like .name. Reading left to right, the path is a set of steps from the root down to one value.',
  },
  {
    id: 'jtv-faq-7',
    question: 'Why does pasting my JSON show an error instead of a tree?',
    answer:
      'The tree only renders for syntactically valid JSON. Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or a missing bracket. The status line reports the parser message and, when available, the line and column of the problem. Fix that spot, or run the text through the JSON Validator first.',
  },
  {
    id: 'jtv-faq-8',
    question: 'Is my data sent to a server?',
    answer:
      'No. Parsing and rendering happen entirely in your browser. The JSON you paste never leaves your machine, there is no upload, and nothing is logged. This makes the viewer safe for inspecting internal API responses or other sensitive data.',
  },
];
