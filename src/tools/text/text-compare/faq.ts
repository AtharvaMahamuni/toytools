import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tc-faq-1',
    question: 'How does the text comparison work?',
    answer:
      'The tool splits both texts into lines and computes the longest common subsequence (LCS) to find which lines are shared between the two versions. Lines in the original that do not appear in the new text are shown as removed (red). Lines in the new text that do not appear in the original are shown as added (green). Lines present in both versions are shown as unchanged.',
  },
  {
    id: 'tc-faq-2',
    question: 'What does the similarity percentage mean?',
    answer:
      'The similarity percentage shows how much of the text is shared between the two versions. A 100% similarity means the texts are identical. A 0% similarity means no lines are shared. For example, if 9 out of 10 lines are unchanged, the similarity is 90%.',
  },
  {
    id: 'tc-faq-3',
    question: 'Is the comparison case-sensitive?',
    answer:
      'Yes. The comparison is case-sensitive by default. "Hello" and "hello" are treated as different lines. This matches the behaviour of standard diff tools, which are designed for precise text comparison.',
  },
  {
    id: 'tc-faq-4',
    question: 'What does the + and - symbol mean in the diff?',
    answer:
      'A + symbol marks a line that was added in the new text (present in "New Text" but not in "Original"). A - symbol marks a line that was removed (present in "Original" but not in "New Text"). A space marks a line that is unchanged in both texts.',
  },
  {
    id: 'tc-faq-5',
    question: 'Can I compare more than two texts?',
    answer:
      'This tool compares exactly two texts at a time. To compare a series of revisions, compare versions one pair at a time: original vs. revision 1, then revision 1 vs. revision 2, and so on.',
  },
  {
    id: 'tc-faq-6',
    question: 'Is my text sent to a server?',
    answer:
      'No. The entire comparison runs in your browser using JavaScript. No text is uploaded to any server. Your content stays completely private.',
  },
  {
    id: 'tc-faq-7',
    question: 'What is the difference between text compare and find and replace?',
    answer:
      'Text Compare is read-only: it shows you what is different between two texts without changing them. Find and Replace is a writing tool: it modifies the text by substituting one pattern with another. Use Text Compare for proofreading, auditing changes, and spotting differences. Use Find and Replace to apply corrections.',
  },
];
