import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'css-gradient-generator-faq-1',
    question: 'What is an OKLCH CSS gradient?',
    answer: `An OKLCH CSS gradient blends two stops in a space where lightness and chroma stay even.

The copied line is linear-gradient, to the right, in oklch, then the two hex stops.
Blue #0000ff to yellow #ffff00 is the pair that opens the page.`,
  },
  {
    id: 'css-gradient-generator-faq-2',
    question: 'How do I copy linear gradient CSS code?',
    answer: `Copy CSS puts the OKLCH declaration on the clipboard.

That line is the one to paste into a stylesheet.
The row of hex samples under the strip is a fallback, not the declaration.`,
  },
  {
    id: 'css-gradient-generator-faq-3',
    question: 'Why does an sRGB blend go gray in the middle?',
    answer: `Red, green, and blue channels do not track how bright a color looks.

Blue and yellow meet in the middle as a grayish mix in sRGB.
OKLCH keeps the chroma up, so the same pair stays colored through the middle.`,
  },
  {
    id: 'css-gradient-generator-faq-4',
    question: 'What is the difference between an OKLCH gradient and an sRGB gradient?',
    answer: `The difference between an OKLCH gradient and an sRGB gradient is which numbers get blended.

OKLCH blends lightness, chroma, and hue.
sRGB blends the red, green, and blue channels, and that is the mix that goes gray.`,
  },
  {
    id: 'css-gradient-generator-faq-5',
    question: 'Does this upload my color stops?',
    answer: `No. The two stops stay in the page.

Uploading stops to a generator that stores them is a different product.
Nothing here is sent off the device.`,
  },
  {
    id: 'css-gradient-generator-faq-6',
    question: 'Can the copied CSS live in a stylesheet?',
    answer: `Yes. Paste the copied line as a background value.

Browsers that understand "in oklch" interpolate the stops themselves.
The sampled hex row is there for a browser that does not.`,
  },
];
