import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tc-faq-1',
    question: 'How do I compare two texts online?',
    answer:
      'Paste your original text in one box and the new text in the other. The tool highlights which lines were added, removed, or left unchanged so you can see what changed at a glance. Then copy the diff or keep editing until the versions match.',
  },
  {
    id: 'tc-faq-2',
    question: 'Is this a character-by-character compare or a line diff?',
    answer:
      'This is a line-level diff, not a character-by-character compare. Each full line is the unit of comparison: change one word in a ten-word sentence and the entire line shows as removed and added. A character-level view would underline only that word. Line-level output is faster to scan when reviewing documents, contracts, or configuration files.',
  },
  {
    id: 'tc-faq-3',
    question: 'What do the + and - lines mean?',
    answer:
      'A + line was added in the new text (present in New Text but not in Original). A - line was removed (present in Original but not in New Text). Unchanged lines appear without those markers. For example, editing one sentence in a paragraph usually shows that sentence as a - line and a + line side by side.',
  },
  {
    id: 'tc-faq-4',
    question: 'Is my text uploaded when I compare it?',
    answer:
      'No. The entire comparison runs in your browser using JavaScript. No text is uploaded to any server. Your content stays completely private.',
  },
  {
    id: 'tc-faq-5',
    question: 'What does the similarity percentage mean?',
    answer:
      'The similarity percentage shows how much of the text is shared between the two versions. A 100% similarity means the texts are identical. A 0% similarity means no lines are shared. For example, if 9 out of 10 lines are unchanged, the similarity is 90%.',
  },
  {
    id: 'tc-faq-6',
    question: 'Is the comparison case-sensitive?',
    answer:
      'Yes. The comparison is case-sensitive by default. "Hello" and "hello" are treated as different lines. This matches the behaviour of standard diff tools, which are designed for precise text comparison.',
  },
  {
    id: 'tc-faq-7',
    question: 'Can I compare more than two texts?',
    answer:
      'This tool compares exactly two texts at a time. To compare a series of revisions, compare versions one pair at a time: original vs. revision 1, then revision 1 vs. revision 2, and so on.',
  },
  {
    id: 'tc-faq-8',
    question: 'What is the difference between text compare and find and replace?',
    answer:
      'Text Compare is read-only: it shows you what is different between two texts without changing them. Find and Replace is a writing tool: it modifies the text by substituting one pattern with another. Use Text Compare for proofreading, auditing changes, and spotting differences. Use Find and Replace to apply corrections.',
  },
  {
    id: 'tc-faq-9',
    question: 'Why do trailing spaces show as differences in a text compare?',
    answer:
      'Because lines only match when they are identical character for character, an invisible trailing space makes two otherwise equal lines different. "Hello world" and "Hello world " are distinct strings, so the diff marks one as removed and the other as added even though they look the same on screen. To remove this noise, run both texts through a whitespace normalizer first, then compare the cleaned versions.',
  },
  {
    id: 'tc-faq-10',
    question: 'Why do reordered lines look like a full rewrite in a diff?',
    answer:
      'Because the diff matches lines in order, a moved paragraph reads as a deletion at its old position and an insertion at its new one, even when not a single word changed. Shared lines are kept in sequence, so the tool cannot recognize the same block appearing earlier or later in the other text. For example, swapping two sections of a document can cut the similarity score in half. When order does not matter, sort both texts first or compare the sections separately.',
  },
];
