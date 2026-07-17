import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'uc-faq-1',
    question: 'How do I convert text to uppercase?',
    answer:
      'Paste or type your text into the input box and the uppercase version appears instantly in the result panel. Every lowercase letter is replaced with its capital equivalent: for example "hello world" becomes "HELLO WORLD". Then click Copy to use it anywhere.',
  },
  {
    id: 'uc-faq-2',
    question: 'Does converting to uppercase change numbers or punctuation?',
    answer:
      'No. Only alphabetic letters change case. Numbers, spaces, punctuation, and symbols stay exactly as they are. Converting "order #42 ready!" to uppercase gives "ORDER #42 READY!".',
  },
  {
    id: 'uc-faq-3',
    question: 'When should I use all-uppercase text?',
    answer:
      'Uppercase is appropriate for acronyms (HTML, NASA), constants in code (MAX_SIZE), short labels, and occasional emphasis. Avoid using it for long passages of body text: all-caps is harder to read at length and is often read as shouting.',
  },
  {
    id: 'uc-faq-4',
    question: 'How do I convert a heading to all caps without retyping it?',
    answer:
      'Paste the heading into this converter and copy the all-caps result back into your document; nothing needs retyping. For example, pasting "Summer sale ends friday" returns "SUMMER SALE ENDS FRIDAY" instantly, ready to drop into a slide, banner, or email subject line. This is faster and safer than holding Caps Lock and retyping, which invites typos, and it works on headings of any length in one paste.',
  },
  {
    id: 'uc-faq-5',
    question: 'Should I use CSS text-transform: uppercase or convert the text itself?',
    answer:
      'Use CSS text-transform when caps are purely visual styling, and convert the actual characters when the value itself must be uppercase. CSS only changes rendering: the underlying string keeps its original casing, so copying it, exporting it, or reading it from a database returns the lowercase original. For example, a coupon code stored as "save10" under text-transform still fails a case-sensitive check against "SAVE10". Convert the stored value here when the data, not just the display, needs capitals.',
  },
  {
    id: 'uc-faq-6',
    question: 'Is converting text to uppercase the same in every language?',
    answer:
      'No, uppercase rules differ by language, and this tool applies the standard Unicode mapping rather than locale-specific rules. Turkish is the classic case: Turkish spelling uppercases the dotted "i" to "İ", while the standard mapping used here produces a plain "I". German shows another quirk: "ß" has no single capital in the default mapping, so "straße" becomes "STRASSE" with a double S. For English and most Latin-script text the standard mapping is exactly right.',
  },
  {
    id: 'uc-faq-7',
    question: 'Why did accented letters not uppercase as I expected?',
    answer:
      'Accented letters keep their accents when uppercased, so "é" becomes "É", not a plain "E". For example, "café résumé" converts to "CAFÉ RÉSUMÉ"; if you expected bare capitals, the accents staying put is correct Unicode behaviour, not a bug. One genuine surprise is the German "ß", which expands to "SS" and makes the result one character longer per occurrence. Characters that merely resemble letters, such as symbols and emoji, never change at all.',
  },
  {
    id: 'uc-faq-8',
    question: 'Why does my text look uppercase on the page but paste as lowercase?',
    answer:
      'The page is styling that text with CSS text-transform: uppercase, which changes how letters render without touching the characters underneath. When you copy it, the clipboard receives the original stored string, so it pastes in its real casing. For example, a nav link displayed as "CONTACT US" pastes as "Contact us" because that is what the HTML contains. To get capitals you can paste anywhere, run the copied text through this converter first.',
  },
  {
    id: 'uc-faq-9',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. The conversion runs entirely in your browser using JavaScript. Your text never leaves your device: there is no server, no account, and no upload.',
  },
];
