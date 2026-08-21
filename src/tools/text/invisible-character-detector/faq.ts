import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ic-faq-1',
    question: 'Why do two identical-looking strings not match?',
    answer:
      'Because at least one of them contains a character that takes up no space or impersonates one that does. A zero-width space renders as nothing at all, so the two strings look the same and differ by one byte. A no-break space renders exactly like a normal space but is a different character, so a comparison rejects it. Both survive copy and paste, which is why the problem arrives with text that came from a PDF, a spreadsheet or a word processor.',
  },
  {
    id: 'ic-faq-2',
    question: 'Why did trim() not remove it?',
    answer:
      'Because trim strips a specific set of whitespace characters, and a no-break space is not in it in most languages. The same applies to the narrow no-break space common in French text and to the ideographic space common in CJK input. They sit at the end of your string looking exactly like the space you expected, survive the trim, and leave the comparison failing for a reason the code never reports.',
  },
  {
    id: 'ic-faq-3',
    question: 'What is a homoglyph, and why is it flagged as dangerous?',
    answer:
      'A homoglyph is a letter from one script that renders identically to a letter from another. Cyrillic а and Latin a are separate characters that most fonts draw the same way. Substituting one into a domain, a username or a package name produces a string that looks correct to every reviewer and resolves somewhere else entirely. The tool raises the warning only when Latin letters and lookalikes from another script appear together, because that combination is the technique. Text written entirely in Cyrillic is just Cyrillic and gets no warning.',
  },
  {
    id: 'ic-faq-4',
    question: 'What is a right-to-left override doing in my file?',
    answer:
      'Reordering how the text displays without changing a single byte. A bidi override tells the renderer to draw characters in a different order, so a line of source can read one way to a person and mean another to the compiler. That is the Trojan Source class of attack, and it is the reason these characters are reported as dangerous rather than merely unusual. If you did not put one there deliberately, it should not be there.',
  },
  {
    id: 'ic-faq-5',
    question: 'Does the cleaned text change anything else?',
    answer:
      'No. Each finding is replaced by the thing it was pretending to be and nothing else is touched. Zero-width characters and bidi controls are deleted, odd spaces become an ordinary space, smart quotes become straight quotes, and a lookalike letter becomes the ASCII letter it was impersonating. Text with no findings comes back byte for byte identical, so running it on clean input is safe.',
  },
  {
    id: 'ic-faq-6',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. The check runs entirely in your browser and nothing you paste leaves the page. That matters here because the text people bring to this tool is frequently a credential, a config value or a fragment of a private document that was failing a comparison.',
  },
];
