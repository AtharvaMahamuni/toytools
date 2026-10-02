import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'color-shades-generator-faq-1',
    question: 'How do I generate a 50 to 900 color palette from one hex?',
    answer:
      'Paste a color such as #3b82f6, or pick one. The page builds eleven stops, from 50 through 950, and shows the CSS custom properties under the row. Copy CSS puts the whole :root block on the clipboard. Tap one stop to copy only that hex. The hue stays the hue you typed. Lightness is what changes from the pale stop to the near-black stop.',
  },
  {
    id: 'color-shades-generator-faq-2',
    question: 'What is the difference between tints and shades?',
    answer:
      'A tint is the color mixed toward white. A shade is the color mixed toward black. In this scale the light stops, 50 through 300, are the tints, and the dark stops, 700 through 950, are the shades. Stop 500 sits near the lightness of the color you typed. The names match the Tailwind ramp people already use in a stylesheet, so a token called --shade-500 reads as the brand step.',
  },
  {
    id: 'color-shades-generator-faq-3',
    question: 'Why is the scale in OKLCH instead of HSL?',
    answer:
      'HSL lightness is not perceptual. A yellow at 50% lightness looks much lighter than a blue at the same number, and a ramp built that way goes muddy in the middle. OKLCH walks lightness in a space where equal steps look closer to equal. Hue is held in degrees. Chroma, the colorfulness, is reduced only when the full amount would fall outside sRGB and the hex would have to be clipped.',
  },
  {
    id: 'color-shades-generator-faq-4',
    question: 'Why does a light stop look less saturated than my base color?',
    answer:
      'A very light color cannot keep a high chroma and still fit inside sRGB. The page binary-searches the largest chroma that stays in gamut at that lightness, then rounds to hex. The hue does not move. If you need the original chroma at every stop, some of those stops are not displayable on a normal screen, and a hex code would be a lie. The reduced stop is the honest one.',
  },
  {
    id: 'color-shades-generator-faq-5',
    question: 'When does the note about contrast on white appear?',
    answer:
      'The stop whose lightness is closest to your color is treated as the brand stop. If that stop, used as text on white, is under 4.5:1, the note names the stop and the ratio. Body text needs 4.5. If the brand stop already clears 4.5, the note stays hidden. A pale yellow brand fails. A deep navy brand usually passes. The other stops are not scored here.',
  },
  {
    id: 'color-shades-generator-faq-6',
    question: 'Is this the same as Tailwind color shades?',
    answer:
      'The stop numbers are the ones Tailwind uses: 50, 100, 200, and so on through 950. The hex values are not a copy of any Tailwind release. Tailwind picks a family by hand and revises it between versions. This page derives every stop from the one color you typed, in OKLCH, so two brands do not share a palette. Use the stop names. Do not expect the hex to match a docs page.',
  },
  {
    id: 'color-shades-generator-faq-7',
    question: 'Can I paste rgb(), hsl(), or a CSS color name?',
    answer:
      'Yes. #3b82f6, rgb(59, 130, 246), hsl(217, 91%, 60%), and names such as teal all parse. The picker writes a six-digit hex back into the field when you change it. Alpha is ignored, because a shade ramp is a set of opaque tokens. If the text is not a color, the previous scale stays and the error line says so, instead of inventing a gray.',
  },
  {
    id: 'color-shades-generator-faq-8',
    question: 'Does this color scale generator upload my brand color?',
    answer:
      'No. Parsing, the OKLCH math, and the CSS block all run in the browser after the page loads. Nothing is uploaded, and there is no account. A brand hex can stay on the device. The last color you typed is remembered in local storage on this browser only, so a refresh does not wipe the ramp.',
  },
  {
    id: 'color-shades-generator-faq-9',
    question: 'How should I use the CSS variables?',
    answer:
      'Paste the :root block into a stylesheet. Then color: var(--shade-700) and background: var(--shade-50) pick two stops from the same hue. The variable names are --shade-50 through --shade-950. They do not include a brand prefix. If you already have a --shade-500 in the project, rename these before you paste, or the later rule wins and the old token disappears.',
  },
  {
    id: 'color-shades-generator-faq-10',
    question: 'Does a passing brand stop mean the whole palette is accessible?',
    answer:
      'No. The note is one pair: the brand stop as text on white. A light 50 stop will fail that same test, and a dark 900 stop can fail as a background behind black text. This page does not score every pair. When you need a specific foreground on a specific background, open the contrast checker and type those two hex values. The scale is the ramp. The checker is the verdict.',
  },
];
