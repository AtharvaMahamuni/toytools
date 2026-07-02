import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'je-faq-1',
    question: 'What does escaping a JSON string mean?',
    answer:
      'A JSON string literal sits between double quotes, so the text inside it cannot contain raw double quotes, backslashes, or control characters like newlines and tabs. Escaping replaces each of those characters with a backslash sequence, for example \\" for a quote, \\\\ for a backslash, and \\n for a newline. The escaped text drops into a JSON document without breaking its syntax.',
  },
  {
    id: 'je-faq-2',
    question: 'Which characters does JSON require me to escape?',
    answer:
      'Exactly three groups: the double quote, the backslash, and every control character from U+0000 to U+001F. The common control characters have short forms (\\b \\f \\n \\r \\t); the rest use the \\uXXXX form. Everything else, including emoji and non-Latin scripts, is legal as-is. This tool also escapes U+2028 and U+2029, which JSON allows but JavaScript string literals do not.',
  },
  {
    id: 'je-faq-3',
    question: 'Does the output include the surrounding quotes?',
    answer:
      'No. The tool outputs the escaped string body, since you normally paste it between quotes that already exist in your document or code. When unescaping, it accepts input either way: a bare string body or a full literal with the outer quotes still attached.',
  },
  {
    id: 'je-faq-4',
    question: 'Why does my JSON fail to parse after I paste text into it?',
    answer:
      'Almost always because the pasted text contains an unescaped double quote or a real line break. The parser reads the quote as the end of the string, and everything after it becomes a syntax error. Run the text through the escaper first, then paste the result. The JSON validator pinpoints the exact position of the first error if you want to inspect the document.',
  },
  {
    id: 'je-faq-5',
    question: 'What is the difference between JSON escape and URL encode?',
    answer:
      'They protect text in different containers. JSON escaping makes text safe inside a JSON string literal using backslash sequences. URL encoding makes text safe inside a URL using percent sequences such as %20. A value that travels through both, for example a JSON payload in a query parameter, needs both applied in the right order: escape for JSON first, then URL encode the whole document.',
  },
  {
    id: 'je-faq-6',
    question: 'How do I unescape a JSON string back to plain text?',
    answer:
      'Switch the direction to unescape (the tool detects escaped input automatically) and paste the string body or the full quoted literal. Every backslash sequence turns back into its real character: \\n becomes a line break, \\" becomes a quote, and \\uXXXX becomes the character it names. Invalid sequences, like a dangling backslash, are reported instead of silently mangled.',
  },
  {
    id: 'je-faq-7',
    question: 'Can I escape a whole JSON document to embed it as a string?',
    answer:
      'Yes, and it is a common need: embedding one JSON document inside another as a string value. Paste the inner document and escape it; every quote and newline gets its backslash form. The receiver then unescapes and parses it as a second step. Watch the size, though: each nesting level multiplies the backslashes.',
  },
  {
    id: 'je-faq-8',
    question: 'Is my text sent to a server?',
    answer:
      'No. Escaping and unescaping run entirely in your browser using the built-in JSON functions. Nothing you paste leaves the page, nothing is stored remotely, and the tool keeps working if you disconnect after loading it.',
  },
];
