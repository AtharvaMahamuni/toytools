import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'csv-column-picker-faq-1',
    question: 'What is a csv column picker?',
    answer:
      'A csv column picker keeps the columns you name and drops every other field. Paste the table in the first box and the headers to keep in the second. The smaller file follows the order you typed, and a quoted comma stays inside its cell. Nothing is uploaded, so a customer list stays on this device.',
  },
  {
    id: 'csv-column-picker-faq-2',
    question: 'How do I extract columns from csv by header name?',
    answer:
      'Type the header names in the second box, separated by commas, with the file capitalization. The list city,name returns the city column and then the name column. Leave the second box empty when you want every column written back. The summary names the headers, which lets you confirm the read before the cut.',
  },
  {
    id: 'csv-column-picker-faq-3',
    question: 'What is the difference between picking by header name and picking by position?',
    answer:
      'A name pick follows the header text, so an inserted column does not move the field. A position pick uses only positive integers such as 3, and the notice says so. The difference between them is what happens after a new column appears. Switch to names whenever the file has a real header row.',
  },
  {
    id: 'csv-column-picker-faq-4',
    question: 'Why did my semicolon file become one column?',
    answer:
      'A comma split of name;age produces one column, so the picker reads the file as semicolon. The notice states that a comma split the line into one column. A tab file is chosen when tabs produce more columns than commas. Keep city and name from a European semicolon export by typing those headers next.',
  },
  {
    id: 'csv-column-picker-faq-5',
    question: 'What happens when a header name is missing?',
    answer:
      'The run stops and names the missing header instead of writing a partial file. Columns name and age with the list email produce an error that includes email. Check capitalization next, because Name does not match the header name. A repeated header keeps the first match, and a later column with the same name was left behind.',
  },
  {
    id: 'csv-column-picker-faq-6',
    question: 'Does a quoted comma stay inside the cell?',
    answer:
      'Yes, the comma inside a quoted note stays in that cell when you keep the note column. The row name,note with Ada and hello, world comes back as one column with the comma there. Parsing happens before the cut, so a comma in a note does not split the row. A spreadsheet note survives that way, with the comma still inside one field.',
  },
  {
    id: 'csv-column-picker-faq-7',
    question: 'Will a pick by position break if I insert a column?',
    answer:
      'Yes, a position pick breaks when you insert a column, because the number points at a slot. Column 3 means the third field today, not the header that used to sit there. Insert a field near the front and the same number now keeps something else. Switch to header names when the file has them, since a name stays on the same field.',
  },
  {
    id: 'csv-column-picker-faq-8',
    question: 'Is my CSV uploaded anywhere?',
    answer:
      'No, the file is not uploaded, and the picker runs in the browser on your device. Privacy holds because the file stays on this device and nothing leaves the page. After one online load, the page still runs with the network off. Drop a salary column before sharing a spreadsheet, then pass on only the smaller file.',
  },
];
