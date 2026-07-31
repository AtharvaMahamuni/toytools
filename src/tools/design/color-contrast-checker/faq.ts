import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'color-contrast-checker-faq-1',
    question: 'What contrast ratio do I need to pass WCAG?',
    answer: 'For normal body text you need a ratio of at least 4.5 to 1 to pass AA, and 7 to 1 to pass the stricter AAA level. Large text (about 24px, or 18.66px when bold) has a lower bar: 3 to 1 for AA and 4.5 to 1 for AAA. This checker shows all four results at once so you can see exactly which pass.',
  },
  {
    id: 'color-contrast-checker-faq-2',
    question: 'What counts as large text?',
    answer: 'WCAG defines large text as at least 18 point (roughly 24px) for regular weight, or at least 14 point (roughly 18.66px) when bold. Large text is easier to read, so it is allowed a lower contrast ratio. If your text is smaller than that, use the normal-text thresholds.',
  },
  {
    id: 'color-contrast-checker-faq-3',
    question: 'How is the contrast ratio calculated?',
    answer: 'The ratio compares the relative luminance of the two colors using the WCAG formula: (lighter + 0.05) divided by (darker + 0.05). Relative luminance weights green most and blue least, matching how the human eye responds. The result ranges from 1 to 1 (identical colors) up to 21 to 1 (pure black on pure white).',
  },
  {
    id: 'color-contrast-checker-faq-4',
    question: 'My colors fail. How do I fix them?',
    answer: 'When the text color fails AA, use the Suggest an accessible text color button. It keeps your hue and saturation but adjusts the lightness to the nearest value that reaches a 4.5 to 1 ratio on your background. You can also darken the text or lighten the background manually and watch the ratio update live.',
  },
  {
    id: 'color-contrast-checker-faq-5',
    question: 'Does contrast checking replace real accessibility testing?',
    answer: 'No. Contrast is one important part of accessibility, but readable color does not guarantee a usable interface. Also test keyboard navigation, focus states, screen-reader labels, and non-color ways of conveying meaning. Treat a passing ratio as necessary, not sufficient.',
  },
];
