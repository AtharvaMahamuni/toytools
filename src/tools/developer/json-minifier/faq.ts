import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'json-min-faq-1',
    question: 'What does JSON minification do?',
    answer:
      'It removes all non-significant whitespace — spaces, tabs, newlines — between JSON tokens. The data is unchanged. `{ "a": 1 }` and `{"a":1}` are semantically identical; the minified version is just fewer bytes.',
  },
  {
    id: 'json-min-faq-2',
    question: 'How much does minification reduce JSON size?',
    answer:
      'Depends on how much whitespace the formatted version has. A well-indented JSON with deep nesting might shrink 20–40%. A flat object with short keys and values might shrink by only a few percent. The savings compound when combined with gzip compression, since repetitive whitespace patterns compress well.',
  },
  {
    id: 'json-min-faq-3',
    question: 'Is minified JSON still valid JSON?',
    answer:
      'Yes. The JSON spec says whitespace between tokens is ignored. Minified JSON is perfectly valid and parses identically to its formatted counterpart. Any compliant JSON parser handles both.',
  },
  {
    id: 'json-min-faq-4',
    question: 'Can I format minified JSON back to readable form?',
    answer:
      'Yes. Minification is reversible. Paste the minified JSON into a formatter and it will produce the same structure with indentation. The two operations are inverses — both go through a parse-then-serialize cycle, so the round-trip is lossless.',
  },
  {
    id: 'json-min-faq-5',
    question: 'When should I minify JSON?',
    answer:
      'When you\'re optimizing payload size for production traffic. API responses, static JSON files served over HTTP, and config bundles in shipped code are good candidates. Development environments, config files in source control, and data you\'re actively debugging are not — readability matters more there.',
  },
  {
    id: 'json-min-faq-6',
    question: 'What\'s the difference between minification and gzip compression?',
    answer:
      'Different layers. Minification removes whitespace at the text level. Gzip (or Brotli) applies entropy compression to the bytes of whatever text you send — including the whitespace, if it\'s still there. They work well together: minifying first gives the compressor a cleaner, more repetitive input, which typically improves compression ratios.',
  },
  {
    id: 'json-min-faq-7',
    question: 'Does minification affect JSON ordering or structure?',
    answer:
      'No. Key order and value types are preserved exactly. Minification only touches whitespace. The parse tree before and after is identical.',
  },
  {
    id: 'json-min-faq-8',
    question: 'Does minification remove JSON comments?',
    answer:
      'JSON doesn\'t support comments. If your file has comments — like a JSONC or JSON5 file — it\'s not standard JSON, and a standard JSON minifier will reject it as invalid. Tools that handle JSON with comments need to strip them explicitly before parsing.',
  },
  {
    id: 'json-min-faq-9',
    question: 'Should I minify JSON in my API responses manually?',
    answer:
      'Usually not manually — most HTTP frameworks serialize JSON compactly by default. In Node.js, `JSON.stringify(data)` with no third argument produces minified output; `JSON.stringify(data, null, 2)` produces formatted output. Most API frameworks default to the compact form when serializing responses.',
  },
];
