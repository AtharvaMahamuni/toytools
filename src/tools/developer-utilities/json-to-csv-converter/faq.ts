import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jtc-faq-1',
    question: 'What input format does the converter expect?',
    answer:
      'The converter expects a JSON array of objects, such as [{"name":"Alice","age":30},{"name":"Bob","age":25}]. Each object becomes one row and each unique key becomes a column. A single JSON object (not wrapped in an array) or an array of primitive values like [1,2,3] will produce an error.',
  },
  {
    id: 'jtc-faq-2',
    question: 'What happens to nested objects when converting to CSV?',
    answer:
      'Nested objects are flattened using dot notation. If your JSON contains {"user":{"name":"Alice","city":"NYC"}}, the CSV will have columns "user.name" and "user.city". Nested arrays are serialized as JSON strings because CSV has no native way to represent arrays inside a cell.',
  },
  {
    id: 'jtc-faq-3',
    question: 'How are missing fields handled in sparse JSON arrays?',
    answer:
      'The converter collects every key found across all objects and uses that as the column set. Rows that are missing a key get an empty cell for that column. For example, if one object has a "phone" field and others do not, the "phone" column exists in the output but is blank for the rows that lack it.',
  },
  {
    id: 'jtc-faq-4',
    question: 'Can I open the CSV output in Excel or Google Sheets?',
    answer:
      'Yes. Copy the CSV output and paste it into Excel or Google Sheets, or save it as a .csv file and open it directly. Both applications treat the first row as a header row by default. If a value contains a comma or a newline, the converter wraps it in double quotes, which Excel and Sheets handle correctly.',
  },
  {
    id: 'jtc-faq-5',
    question: 'Why does my CSV show [object Object] in some cells?',
    answer:
      'This happens when a value is a deeply nested object that the converter cannot flatten automatically. The browser converts the object to the string "[object Object]" instead. Fix this by reformatting your JSON to flatten the structure before converting, or by removing keys whose values are complex nested objects.',
  },
  {
    id: 'jtc-faq-6',
    question: 'What happens to values that contain commas?',
    answer:
      'Commas inside a value are handled by wrapping the entire cell in double quotes. For example, the value "Smith, Jr." appears in CSV as "Smith, Jr." with the surrounding quotes. Most spreadsheet applications parse this correctly and display the value without the quotes.',
  },
  {
    id: 'jtc-faq-7',
    question: 'Is my data sent to a server when I convert?',
    answer:
      'No. All conversion happens in your browser. Your JSON data never leaves your machine. There is no upload, no server-side processing, and no logging of what you convert. This makes the tool safe to use with internal or sensitive data.',
  },
  {
    id: 'jtc-faq-8',
    question: 'Can I choose which columns to include in the output?',
    answer:
      'The converter includes every key it finds across all objects in the array. To limit columns, edit your JSON first: remove the keys you do not need, then convert. Alternatively, delete unwanted columns in your spreadsheet after importing the CSV.',
  },
  {
    id: 'jtc-faq-9',
    question: 'What is the difference between JSON and CSV?',
    answer:
      'JSON (JavaScript Object Notation) stores structured, hierarchical data with named keys and supports nesting. CSV (Comma-Separated Values) stores flat tabular data in rows and columns with no nesting. JSON is better for API responses and configuration; CSV is better for spreadsheets, databases, and data analysis tools.',
  },
];
