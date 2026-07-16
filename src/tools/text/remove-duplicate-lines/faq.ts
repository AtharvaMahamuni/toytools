import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rdl-faq-1',
    question: 'How are duplicate lines detected?',
    answer:
      'Two lines are duplicates when they match exactly, character for character. The first time a line appears it is kept; any later identical line is removed. The original order of the surviving lines is preserved.',
  },
  {
    id: 'rdl-faq-2',
    question: 'Does it only remove lines that are next to each other?',
    answer:
      'No. Duplicates are removed across the whole text, not just consecutive ones. A line near the bottom that matches a line near the top is still removed.',
  },
  {
    id: 'rdl-faq-3',
    question: 'Is duplicate matching exact or case-insensitive?',
    answer:
      'Matching is exact: two lines count as duplicates only when every character matches, including case. "Apple" and "apple" are different lines, so both survive. For case-insensitive deduplication, convert the text to lowercase first, then remove duplicates. For example, a list containing "SALES@acme.com" and "sales@acme.com" keeps both entries until you lowercase it, after which only the first remains.',
  },
  {
    id: 'rdl-faq-4',
    question: 'Do leading or trailing spaces affect matching?',
    answer:
      'Yes. "  apple" and "apple" differ because of the spaces. Run Trim Text first if you want lines that differ only in surrounding whitespace to be treated as duplicates.',
  },
  {
    id: 'rdl-faq-5',
    question: 'How do I remove duplicate emails from a mailing list?',
    answer:
      'Paste the list with one email address per line, and the tool keeps the first occurrence of each address while deleting every exact repeat. For example, a subscriber export of 500 lines where "jo@example.com" appears three times comes back with that address once, in its original position. Because matching is case-sensitive, lowercase the list first so "Jo@Example.com" and "jo@example.com" collapse into one entry. The same steps work for deduplicating a URL list.',
  },
  {
    id: 'rdl-faq-6',
    question: 'How do I get unique lines from a log file?',
    answer:
      'Paste the log and the output contains each distinct line once, at the position where it first appeared. For example, a server log with 2,000 repeats of "connection timeout" collapses to a single line, so every distinct error becomes visible at a glance. One caveat: lines that carry unique timestamps never match each other, so strip the timestamp column first if you want identical messages to merge.',
  },
  {
    id: 'rdl-faq-7',
    question: 'What is the difference between removing duplicate lines and removing blank lines?',
    answer:
      'Removing duplicate lines deletes repeated content; removing blank lines deletes empty rows and keeps repeats. Use this tool when the same entry appears more than once, and Remove Blank Lines when the problem is empty gaps. For example, a list with "apple", an empty line, then "apple" again keeps "apple" and the empty line here. Repeated blank lines do count as duplicates of each other, so only the first empty line survives.',
  },
  {
    id: 'rdl-faq-8',
    question: 'Why did the order of my lines change after deduplicating?',
    answer:
      'The order never changes: every surviving line stays exactly where it first appeared, and only later repeats are deleted. What looks like reordering is a removed repeat. For example, if "beta" sits at line 2 and again at line 9, the copy at line 9 disappears and the lines below it shift up. Compare the output against the first occurrence of each entry and the sequence matches your input.',
  },
  {
    id: 'rdl-faq-9',
    question: 'Is it safe to paste an email list into an online duplicate remover?',
    answer:
      'With this tool, yes: deduplication runs entirely in your browser and the list is never uploaded to a server. Your addresses stay on your device, and closing the tab discards them. For example, you can dedupe a 10,000-line subscriber export offline: load the page once, disconnect from the internet, and duplicate removal still works because no network request is involved.',
  },
];
