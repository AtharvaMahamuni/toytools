import type { FAQItem } from '@data/types';
import { PRIVACY_LINE } from '@lib/privacy';

export const items: FAQItem[] = [
  {
    id: 'rt-faq-1',
    question: 'How do I test a regular expression online?',
    answer:
      'Paste a pattern into the Pattern field, add flags such as g or i, and put sample text in the Test text box. Matches appear instantly with their indices and capture groups. Use the optional Replace field to preview substitutions with $1 or named groups.',
  },
  {
    id: 'rt-faq-2',
    question: 'Which regex flavour does this tester use?',
    answer:
      'JavaScript RegExp, the same engine your browser runs. Patterns behave like they would in Node or front-end code: lookbehind, named groups, and flags such as s, u, and d are available when the browser supports them.',
  },
  {
    id: 'rt-faq-3',
    question: 'What do the match indices mean?',
    answer:
      'Each match shows a start…end span in the test text, counted in UTF-16 code units (JavaScript string indices). Match #1 at [4…7] means characters starting at index 4 up to, but not including, index 7. Capture groups list the substring each group held, or undefined when that group did not participate.',
  },
  {
    id: 'rt-faq-4',
    question: 'Can I use named capture groups?',
    answer:
      'Yes. Write (?<word>\\w+) in the pattern, then read $<word> in the replace field or inspect the group list under each match. Unnamed groups still appear as group 1, group 2, and so on.',
  },
  {
    id: 'rt-faq-5',
    question: 'What happens if my regex is invalid?',
    answer:
      'The tool shows the engine error under the pattern field, for example an unclosed parenthesis or an unknown flag. Matches stay empty until the pattern compiles. Nothing is guessed or silently rewritten.',
  },
  {
    id: 'rt-faq-6',
    question: 'Why was my pattern blocked as expensive?',
    answer:
      'Some shapes such as (a+)+ or (a|ab)+ can trigger catastrophic backtracking and freeze a tab. The tester refuses those shapes up front and also stops any run that exceeds a short time budget. Rewrite the pattern with tighter classes or fewer nested quantifiers.',
  },
  {
    id: 'rt-faq-7',
    question: 'Is there a limit on test text size?',
    answer:
      'Yes. Test text is capped at about 20,000 characters so a huge paste cannot stall the page. A short notice appears when the cap applies. For larger corpora, slice a representative sample.',
  },
  {
    id: 'rt-faq-8',
    question: 'How is this different from Find and Replace?',
    answer:
      'Find and Replace edits a document: it swaps matches and shows a live count. Regex Tester is for understanding a pattern: it lists every match, explains groups, and only optionally previews a replace. Use Find and Replace when you want the edited text; use Regex Tester when you are debugging the expression itself.',
  },
  {
    id: 'rt-faq-9',
    question: 'Does the global flag matter here?',
    answer:
      'The tester adds g automatically when it is missing so every match can be listed. Sticky (y) stays sticky. Other flags (i, m, s, u, d) are passed through unchanged.',
  },
  {
    id: 'rt-faq-10',
    question: 'Is my text uploaded?',
    answer: `No. Matching and replace both run in your browser. ${PRIVACY_LINE}`,
  },
];
