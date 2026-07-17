import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rt-faq-1',
    question: 'What does the Remove Tabs tool do?',
    answer:
      'It replaces every tab character with a single space, so text that was aligned or indented with tabs becomes consistently space-separated. The rest of your text is left unchanged.',
  },
  {
    id: 'rt-faq-2',
    question: 'Why replace tabs with a space instead of deleting them?',
    answer:
      'Tabs usually separate words or columns. Deleting them outright would glue neighbouring values together: "Name\tAge" would become "NameAge". Replacing each tab with a space keeps those values readable and parseable.',
  },
  {
    id: 'rt-faq-3',
    question: 'When is removing tabs useful?',
    answer:
      'It helps when pasting tab-indented code into an editor that expects spaces, cleaning tab-separated data before reformatting it, or fixing text where invisible tabs break alignment or a strict format.',
  },
  {
    id: 'rt-faq-4',
    question: 'Does it collapse the resulting spaces?',
    answer:
      'No. Each tab becomes exactly one space. If you then want to collapse multiple spaces, run Remove Extra Spaces afterwards.',
  },
  {
    id: 'rt-faq-5',
    question: 'Why do tabs cause alignment problems in text?',
    answer:
      'Tabs cause alignment problems because a tab is a single character whose displayed width depends on the program rendering it: one editor draws it 8 columns wide, another 4, an email client 2. Columns that line up on your screen therefore drift apart on someone else\'s. For example, a price list padded with tabs looks perfectly aligned in Notepad at 8-column tab stops but staggers in a code editor set to 4. Converting each tab to a space fixes the width everywhere.',
  },
  {
    id: 'rt-faq-6',
    question: 'How do I clean up tabs after pasting from a spreadsheet?',
    answer:
      'Paste the copied cells into Remove Tabs and copy the output: every tab that Excel or Google Sheets inserted between cells becomes one space, so the values stay separated as readable words. Spreadsheets copy rows as tab-separated text, which is why an invisible gap sits between each cell. For example, a row copied as "Widget\t4.99\tIn stock" comes out as "Widget 4.99 In stock", ready to drop into a sentence or a document.',
  },
  {
    id: 'rt-faq-7',
    question: 'Is a tab the same as four spaces?',
    answer:
      'No, a tab is one character (U+0009) that the display stretches to the next tab stop, while four spaces are four fixed-width characters. That is why the same file shows different indentation in different editors: the tab stop setting changes, the spaces never do. For example, a line starting with one tab sits 8 columns deep in a terminal and 4 in VS Code, but a line starting with four spaces sits 4 columns deep everywhere.',
  },
  {
    id: 'rt-faq-8',
    question: 'Why did my alignment shift after converting tabs to spaces?',
    answer:
      'The alignment shifted because each tab became exactly one space, while the original tab stretched to a tab stop several columns wide. Text that relied on that stretch for column layout or indentation depth now sits closer together. For example, a line indented with two tabs, rendered 8 columns deep, starts just 2 characters in after conversion. For source code, use your editor\'s indent conversion instead, which substitutes the full number of spaces your indentation setting expects.',
  },
  {
    id: 'rt-faq-9',
    question: 'Why are the spaces between my words unchanged after removing tabs?',
    answer:
      'They are unchanged because the tool matches only the tab character and touches nothing else: ordinary spaces, doubled spaces, and line breaks pass through exactly as they were. That narrow scope is deliberate, so you can fix tabs without reflowing the rest of the text. For example, "price:\t 4.99" keeps its existing space and gains one more where the tab was, giving "price:  4.99". Follow up with Remove Extra Spaces if the conversion leaves doubled gaps behind.',
  },
];
