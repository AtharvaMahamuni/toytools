import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'aspect-ratio-calculator-faq-1',
    question: 'How do I calculate a height for 16:9?',
    answer: 'Multiply the width by 9 and divide by 16. For a 1600px wide element that is 1600 times 9 divided by 16, which is 900px. Pick the 16:9 preset here, type your width, and the height fills in automatically, along with a live preview box in the exact ratio.',
  },
  {
    id: 'aspect-ratio-calculator-faq-2',
    question: 'How do I keep an aspect ratio when resizing?',
    answer: 'Lock the ratio first, then change only one dimension. When you edit the width, the calculator recomputes the height to preserve the ratio, and editing the height recomputes the width. This keeps images and video frames from stretching or squashing when you scale them.',
  },
  {
    id: 'aspect-ratio-calculator-faq-3',
    question: 'What aspect ratio is 1920x1080?',
    answer: '1920 by 1080 simplifies to 16:9, the standard widescreen ratio. To find the ratio of any size, divide both numbers by their greatest common divisor. Enter a custom ratio or any width and height here and the simplified ratio is shown next to the dimensions.',
  },
  {
    id: 'aspect-ratio-calculator-faq-4',
    question: 'What are the most common aspect ratios?',
    answer: '16:9 is standard for video and most screens, 4:3 is older displays and many photos, 3:2 is common for cameras, 21:9 is ultrawide monitors and cinematic video, 1:1 is square social posts, and 9:16 is vertical phone video. The presets here cover all of these, and you can enter any custom ratio.',
  },
  {
    id: 'aspect-ratio-calculator-faq-5',
    question: 'Can I use decimal dimensions?',
    answer: 'Yes. The calculator accepts decimals in both the ratio and the dimensions, so you can work with fractional pixel values or unusual ratios. Results are rounded to four decimal places to stay readable while remaining precise enough for layout math.',
  },
];
