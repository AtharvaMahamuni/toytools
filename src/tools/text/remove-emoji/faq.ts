import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 're-faq-1',
    question: 'What exactly does this tool remove?',
    answer:
      'Everything that renders as an emoji: faces and objects, flags, skin-tone variants, and joined sequences like the family emoji. It also strips the invisible characters that travel with them, such as zero-width joiners and variation selectors, so no hidden debris stays behind in the text. Words, numbers, punctuation, and spacing are untouched.',
  },
  {
    id: 're-faq-2',
    question: 'Why is removing emoji harder than deleting a character?',
    answer:
      'Because one visible emoji is frequently several Unicode characters. A family emoji can be seven: four pictographs joined by three invisible joiners. A flag is two regional-indicator letters. A thumbs up with a skin tone is a base emoji plus a modifier. Deleting by hand or with a naive pattern removes part of the sequence and leaves invisible characters that later break searches, CSV files, or databases.',
  },
  {
    id: 're-faq-3',
    question: 'Are symbols like the trademark or copyright sign removed?',
    answer:
      'No. Characters such as the trademark sign, the copyright sign, and plain arrows read as ordinary text symbols, so they stay. The rule the tool follows: a character goes only if it renders in emoji form, either by default or because a variation selector forces it. That matches what people mean when they say text without emoji.',
  },
  {
    id: 're-faq-4',
    question: 'Will accented letters or non-English text be affected?',
    answer:
      'No. Accented letters, Cyrillic, Arabic, Chinese, Japanese, Korean, and every other script pass through unchanged. Emoji removal targets the emoji blocks of Unicode, not letters of any language. If you also want accents folded to plain letters, that is a separate step: the Remove Accents tool in the switcher above does exactly that.',
  },
  {
    id: 're-faq-5',
    question: 'What happens to keycap emoji like the boxed number one?',
    answer:
      'The digit survives. A keycap emoji is a normal digit followed by two invisible marks that draw the box around it. The tool removes the marks and keeps the digit, so a message like "press 1 now" keeps its meaning instead of losing the number.',
  },
  {
    id: 're-faq-6',
    question: 'Why remove emoji from text at all?',
    answer:
      'Common reasons: preparing user-generated content for systems that reject or mangle emoji, cleaning copy for formal documents and print, deduplicating and matching strings, importing text into older databases with limited encodings, and reducing noise before text analysis. Emoji carry tone in chat, but they get in the way of machine processing.',
  },
  {
    id: 're-faq-7',
    question: 'Does the removal leave double spaces behind?',
    answer:
      'The tool removes only the emoji characters themselves, so a space that surrounded an emoji stays. If that leaves doubled spaces in your text, switch to the Extra Spaces tool in the pill row above; your text carries over automatically and one click collapses them.',
  },
  {
    id: 're-faq-8',
    question: 'Is my text uploaded when I use this tool?',
    answer:
      'No. The cleanup runs entirely in your browser using a Unicode-aware pattern. Nothing you paste is sent to a server or stored anywhere, and the page keeps working offline once loaded.',
  },
];
