import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'type-scale-generator-faq-1',
    question: 'How do I generate a modular type scale?',
    answer:
      'Enter a base size in pixels. That number is the body step. Pick a ratio from the menu, from 1.125 up to the golden ratio 1.618. The page multiplies and divides to build caption, small, body, lead, h3, h2, h1, and display. Each row shows pixels, rem, and a short sample. Copy CSS takes the :root block of custom properties.',
  },
  {
    id: 'type-scale-generator-faq-2',
    question: 'What ratio should I use for font sizes?',
    answer:
      'A major third, 1.25, is a steady ramp for most interfaces. A major second, 1.125, stays tight, which suits dense UI text. A perfect fifth, 1.5, and the golden ratio, 1.618, jump quickly and push display type very large. The musical names are labels for the numbers. Pick the ratio whose display step still fits the screen you are designing for.',
  },
  {
    id: 'type-scale-generator-faq-3',
    question: 'When does the size note appear?',
    answer:
      'The note appears when caption is under 12px, or when display is over 64px. Under 12px is hard to read as text on a phone. Over 64px overflows a phone before a sentence does. A 16px base with a 1.125 ratio stays inside that band, so the note stays hidden. A 16px base with 1.25 names the caption. The golden ratio names both ends.',
  },
  {
    id: 'type-scale-generator-faq-4',
    question: 'Are the CSS variables in rem or px?',
    answer:
      'The variables are rem. --type-body is 1rem when the base is 16px, because the root is taken as 16px, the browser default. The row still shows the pixel size so you can see the step without doing the division. If your html element sets a different root, the rem values will render at a different pixel size. Convert that case with the px to rem tool.',
  },
  {
    id: 'type-scale-generator-faq-5',
    question: 'What is a modular scale?',
    answer:
      'A modular scale is one size multiplied by the same ratio, over and over. Body times the ratio is the next step up. Body divided by the ratio is the next step down. The steps share a single relationship, so a heading is not an arbitrary pixel value. This page uses eight named steps, from caption at two powers below body to display at five powers above it.',
  },
  {
    id: 'type-scale-generator-faq-6',
    question: 'Why is the golden ratio so large at display?',
    answer:
      '1.618 to the fifth power is about 11. A 16px body becomes roughly 177px at display. That is a poster word, not a phone heading. The note says the display size overflows a phone. Use the golden ratio when you want that jump, and keep phone headings on a lower step such as h2 or h3. The sample row scrolls inside a short box so the page itself does not grow by 177px.',
  },
  {
    id: 'type-scale-generator-faq-7',
    question: 'Does this pick a font?',
    answer:
      'No. The scale is sizes only. It does not choose a family, a weight, or a line height. Those change how large a size feels, and they belong in the stylesheet next to the variables. Paste the :root block, then set font-family on body. The sample word Ag uses the font already on the page, so you can see the size without loading a new face.',
  },
  {
    id: 'type-scale-generator-faq-8',
    question: 'How do the step names map to headings?',
    answer:
      'Caption and small sit below body. Lead is one step up, then h3, h2, h1, and display. The names are suggestions for a stylesheet, not a rule that h1 in HTML must use --type-h1. A page with one title can use display. A product UI can stop at h2. The variable names stay stable so you can change the ratio later without renaming the tokens.',
  },
  {
    id: 'type-scale-generator-faq-9',
    question: 'What base size should I start from?',
    answer:
      'Start at 16. That is the browser default for body text, and it makes --type-body equal 1rem. A base of 18 is a common reading size. Raise the base and every step grows, including caption, which can lift a small step back over 12px. Lower it and caption falls under the floor sooner. The note updates as you type the base.',
  },
  {
    id: 'type-scale-generator-faq-10',
    question: 'Is the arithmetic done on my device?',
    answer:
      'Yes. The base and the ratio never leave the browser. There is no account and no upload. The CSS you copy is the whole output. A chat can print a similar list, and this page is the list you can change and copy while you look at the samples. Runs entirely on your device. Nothing is uploaded.',
  },
];
