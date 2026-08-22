import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'charmap-faq-1',
    question: 'How do I copy a special character?',
    answer:
      'Tap it. The glyph goes to your clipboard and the cell flashes to confirm it. To find one, search by name rather than scrolling: typing arrow narrows 365 characters down to the two dozen arrows, and typing dash finds the en dash and the en dash without you needing to know what either is called. Searching for the character itself works too, if you already have a copy of it somewhere.',
  },
  {
    id: 'charmap-faq-2',
    question: 'What is a code point?',
    answer:
      'It is the number Unicode assigns to a character, written as U+ and four or more hex digits. The degree sign is U+00B0 and the right arrow is U+2192. That number is the character\'s real identity: fonts decide what it looks like, encodings decide how it gets stored as bytes, and the code point is the part that stays the same through both. Every escape shown next to a character is that number in another syntax.',
  },
  {
    id: 'charmap-faq-3',
    question: 'Should I paste the glyph or an escape?',
    answer:
      'Paste the glyph into anything a person reads: a document, an email, a message, a spreadsheet cell. Use an escape when the character has to survive a file whose encoding you do not control, or when the surrounding syntax would swallow it. HTML, CSS content rules and string literals in source code are the three places where an escape is the safer answer, and all three sit next to the glyph here.',
  },
  {
    id: 'charmap-faq-4',
    question: 'What is an HTML entity?',
    answer:
      'A way of writing a character using only ASCII, so it survives any encoding. There are two forms. Named entities such as &amp;mdash; read well and exist for a few hundred common characters. Numeric entities such as &amp;#8212; work for every character in Unicode. The tool gives you the named form when there is one and the numeric form otherwise, because the named version is easier to recognise six months later.',
  },
  {
    id: 'charmap-faq-5',
    question: 'Why does my CSS escape have a trailing space?',
    answer:
      'Because CSS reads a backslash escape as hex digits until it runs out of them, and a space is what tells it to stop. Writing content: "\\2192" beside a digit would swallow that digit into the escape. Adding a space after the hex ends it safely, and CSS discards that one space rather than rendering it. Leaving it out is the common mistake behind an arrow that renders as something else entirely.',
  },
  {
    id: 'charmap-faq-6',
    question: 'Why did my character turn into a question mark?',
    answer:
      'Because something in the chain could not carry it. A file saved as Latin-1, a database column set to a single-byte character set, or an older system reading the bytes with the wrong encoding will all replace what they cannot represent. The fix is to make the whole path UTF-8, and the workaround, when you cannot, is to paste an escape rather than the glyph. Nothing you copy here is uploaded.',
  },
];
