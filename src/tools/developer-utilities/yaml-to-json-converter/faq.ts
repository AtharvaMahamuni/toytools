import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'y2j-faq-1',
    question: 'Why would I convert YAML to JSON?',
    answer:
      'JSON is the lingua franca of web APIs and most programming languages. If you have a YAML config file and need to send it to an API, validate it against a JSON Schema, store it in a database that expects JSON, or process it in a language without a YAML parser, converting to JSON first is the practical path. The conversion is lossless for the data types both formats share.',
  },
  {
    id: 'y2j-faq-2',
    question: 'Is YAML a superset of JSON?',
    answer:
      'Yes. Since YAML 1.2, every valid JSON document is also valid YAML, which means a YAML parser can read JSON directly. The reverse is not true: YAML has features JSON lacks, such as comments, anchors and aliases, and multiple documents in one file. Those YAML-only features are resolved or dropped when converting to JSON.',
  },
  {
    id: 'y2j-faq-3',
    question: 'What happens to YAML comments when I convert to JSON?',
    answer:
      'Comments are removed. JSON has no syntax for comments, so any lines beginning with # in your YAML are discarded during conversion. Only the data — keys, values, and structure — is carried over into the JSON output.',
  },
  {
    id: 'y2j-faq-4',
    question: 'How are YAML anchors and aliases handled?',
    answer:
      'Anchors (&name) and aliases (*name) let YAML reuse a block of data. When converting to JSON, the alias is expanded: the referenced data is copied in full wherever the alias appears, because JSON has no concept of references. The resulting JSON is larger but fully self-contained.',
  },
  {
    id: 'y2j-faq-5',
    question: 'What happens to dates and timestamps in YAML?',
    answer:
      'YAML can represent native timestamps (for example, 2026-06-18). Since JSON has no date type, the converter serializes these as ISO 8601 strings so no information is lost. If you need a specific date format, quote the value in your YAML so it is treated as a plain string.',
  },
  {
    id: 'y2j-faq-6',
    question: 'Why does my YAML fail to convert?',
    answer:
      'The most common cause is indentation: YAML uses spaces (never tabs) to define structure, and a single misaligned line changes the meaning or breaks parsing. Other causes include unquoted special characters, a missing colon after a key, or mixing tabs and spaces. The error message points to the line where parsing failed.',
  },
  {
    id: 'y2j-faq-7',
    question: 'Can I convert the JSON back to YAML?',
    answer:
      'Yes. Use the JSON to YAML Converter — the sibling tool in this workspace. Switch direction with the pill above the editor and your result carries straight over, so you can round-trip between the two formats without copying and pasting.',
  },
  {
    id: 'y2j-faq-8',
    question: 'Is my data private when I use this tool?',
    answer:
      'Yes. All conversion happens entirely in your browser using JavaScript. Your data never leaves your machine — there is no upload, no server-side processing, and no logging of any kind. This makes the tool safe to use with internal configuration files or any sensitive data.',
  },
];
