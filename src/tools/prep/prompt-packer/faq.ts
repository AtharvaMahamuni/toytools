import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pp-faq-1',
    question: 'What is a prompt packer?',
    answer:
      'A prompt packer joins fields you already wrote, such as role, task, context, constraints, and output format, into one block. It does not invent the words.',
  },
  {
    id: 'pp-faq-2',
    question: 'Does Prompt Packer use AI?',
    answer:
      'No. It copies your fields into Markdown sections or XML-style tags. It does not call ChatGPT, Claude, Gemini, Grok, or any other model.',
  },
  {
    id: 'pp-faq-3',
    question: 'Does ToyTools send my prompt to a server?',
    answer:
      'No. The assembled text is built in your browser. Runs entirely on your device. Nothing is uploaded. Reloading the page clears the fields.',
  },
  {
    id: 'pp-faq-4',
    question: 'Can I use the output with ChatGPT or Claude?',
    answer:
      'Yes. Copy the block and paste it into whichever model you use. ToyTools is not connected to those products and is not affiliated with them. It prepares the text. You send it.',
  },
  {
    id: 'pp-faq-5',
    question: 'What formats can Prompt Packer create?',
    answer:
      'Markdown sections, with a heading per field, or XML-style tags such as <role> and <task>. Neither format is claimed to be better for a particular model. Empty fields are left out in both.',
  },
  {
    id: 'pp-faq-6',
    question: 'Why are empty fields left out?',
    answer:
      'A blank heading reads like an instruction you forgot to fill in. If Context is empty, the assembled prompt has no Context section. The page names what it left out.',
  },
];
