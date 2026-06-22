import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'c2j-faq-1',
    question: 'What CSV format does the converter expect?',
    answer:
      'The converter expects the first row to be a header row listing the column names, with one data row per line beneath it. For example, a file starting with name,age followed by Alice,30 produces [{"name":"Alice","age":30}]. Each header becomes a key and each row becomes one object in the resulting JSON array.',
  },
  {
    id: 'c2j-faq-2',
    question: 'How does type detection work?',
    answer:
      'With "Detect types" enabled (the default), the converter coerces cells that look like numbers, booleans, or null into real JSON types: 30 becomes the number 30, true becomes a boolean, and null becomes JSON null. Everything else stays a string. Turn the option off to keep every value as a string, which is useful when you need a lossless, predictable result.',
  },
  {
    id: 'c2j-faq-3',
    question: 'Why is a value like 007 kept as a string?',
    answer:
      'Numbers with leading zeros — zip codes, product codes, phone extensions — would lose their zeros if converted to a numeric type (007 would become 7). To prevent silent data loss, the converter keeps any leading-zero value as a string even when type detection is on.',
  },
  {
    id: 'c2j-faq-4',
    question: 'How are commas and quotes inside a field handled?',
    answer:
      'The converter follows RFC 4180 quoting rules. A field wrapped in double quotes can contain commas, line breaks, and escaped quotes (written as two double quotes, ""). For example, "Smith, Jr." is read as the single value Smith, Jr. rather than two columns.',
  },
  {
    id: 'c2j-faq-5',
    question: 'Can I use a delimiter other than a comma?',
    answer:
      'Yes. The delimiter control lets you choose comma, semicolon, tab, or pipe. Semicolon files are common in locales where the comma is the decimal separator, and tab-separated values (TSV) are common in exports from spreadsheets and databases.',
  },
  {
    id: 'c2j-faq-6',
    question: 'What happens if a row has fewer values than the header?',
    answer:
      'Missing trailing values are filled with an empty string for the corresponding columns, so every object has the same set of keys. This keeps the JSON array uniform and safe to iterate over without checking for undefined keys.',
  },
  {
    id: 'c2j-faq-7',
    question: 'Can I convert the JSON back to CSV?',
    answer:
      'Yes. Use the JSON to CSV Converter — the sibling tool in this workspace. Switch direction with the pill above the editor and your result carries straight over, so you can round-trip between CSV and JSON without copying and pasting.',
  },
  {
    id: 'c2j-faq-8',
    question: 'Is my data sent to a server when I convert?',
    answer:
      'No. All conversion happens in your browser using JavaScript. Your CSV data never leaves your machine — there is no upload, no server-side processing, and no logging of what you convert. This makes the tool safe to use with internal or sensitive data.',
  },
];
