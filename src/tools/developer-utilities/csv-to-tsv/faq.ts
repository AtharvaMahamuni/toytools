import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'csv-to-tsv-faq-1',
    question: 'How do I convert CSV to TSV without Excel?',
    answer:
      'Paste the CSV into the input pane and the tab-separated output appears immediately, no spreadsheet required. Do not just replace every comma with a tab: CSV cells can hold commas inside quotes, and a find-and-replace turns "Smith, Jane" into two columns. This converter parses the CSV first, so a quoted cell with an embedded comma becomes a single tab-separated cell with the comma intact.',
  },
  {
    id: 'csv-to-tsv-faq-2',
    question: 'What happens to quoted fields during conversion?',
    answer:
      'Quoting is rebuilt for the new delimiter. A cell that was quoted only because it contained a comma no longer needs quotes in TSV, so they are removed. A cell containing a tab, a quote character, or a line break stays quoted, with inner quotes doubled, following the same RFC 4180 convention CSV uses.',
  },
  {
    id: 'csv-to-tsv-faq-3',
    question: 'Why do some tools want TSV instead of CSV?',
    answer:
      'Tabs almost never appear inside real data, so TSV avoids most quoting headaches, which makes it a favourite for command-line tools like cut and awk, database bulk loaders, and clipboard pastes into spreadsheets. Excel and Google Sheets both paste tab-separated text straight into separate columns.',
  },
  {
    id: 'csv-to-tsv-faq-4',
    question: 'Is the conversion lossless?',
    answer:
      'Yes. Cell text is preserved exactly, including leading zeros, number formatting, and blank lines. Only the delimiter and the quoting around cells change, so converting back to CSV returns the original data. If you also want cleanup, empty rows removed or whitespace trimmed, run the file through the CSV cleaner first.',
  },
  {
    id: 'csv-to-tsv-faq-5',
    question: 'Is my file uploaded anywhere?',
    answer:
      'No. The conversion runs entirely in your browser; nothing you paste is sent to a server, stored, or shared. That makes it safe for exports containing customer or financial data, and the page keeps working offline once loaded.',
  },
  {
    id: 'csv-to-tsv-faq-6',
    question: 'How do I save the result as a .tsv file?',
    answer:
      'Use the Download button under the output, which saves the converted text with a .tsv extension. You can also copy the output and paste it directly into a spreadsheet, where the tabs split into columns automatically.',
  },
];
