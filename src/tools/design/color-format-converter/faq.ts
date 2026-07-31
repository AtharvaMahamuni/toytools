import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'color-format-converter-faq-1',
    question: 'How do I convert a HEX color to RGB?',
    answer: 'Paste the hex value (for example #3366ff) into the input and the RGB row updates instantly to rgb(51, 102, 255). Each hex pair maps to one channel: 33 is 51 red, 66 is 102 green, and ff is 255 blue. Every other format updates at the same time, so you also get HSL, HSV, OKLCH, and CMYK from the same input.',
  },
  {
    id: 'color-format-converter-faq-2',
    question: 'What is OKLCH and why should I use it?',
    answer: 'OKLCH is a modern CSS color format built on a perceptually uniform color space. Its lightness value tracks how bright a color actually looks to the eye, so two colors with the same L read as equally light regardless of hue. That makes it far better than HSL for building shade scales and gradients, and browsers have supported it since 2023.',
  },
  {
    id: 'color-format-converter-faq-3',
    question: 'Does this converter support alpha transparency?',
    answer: 'Yes. Enter an 8-digit hex like #3366ff80 or an rgba/hsla value and the alpha channel is preserved in the RGB, HSL, and OKLCH outputs. The preview swatch shows the color at full opacity so you can still judge the hue.',
  },
  {
    id: 'color-format-converter-faq-4',
    question: 'Why is my CMYK value different from my print shop?',
    answer: 'The CMYK here is a direct mathematical conversion from sRGB, which is how screens describe color. Real print output depends on the specific inks, paper, and ICC profile your printer uses, so treat the CMYK value as a starting reference rather than a proof. For exact print color, ask your printer for their profile.',
  },
  {
    id: 'color-format-converter-faq-5',
    question: 'Is my color data sent anywhere?',
    answer: 'No. Every conversion runs entirely in your browser with JavaScript. Nothing is uploaded, logged, or stored on a server, and the tool keeps working offline once the page has loaded.',
  },
];
