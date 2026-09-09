import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'br-faq-1',
    question: 'What is a breathing circle?',
    answer:
      'A visual guide for inhale, hold, and exhale. This one names the pattern: Box (4-4-4-4), 4-7-8, or Coherent (5-5). The circle scales with the phase unless reduced motion is on, in which case the phase name and the seconds are the only progress.',
  },
  {
    id: 'br-faq-2',
    question: 'Why is there no preset called Calm?',
    answer:
      'A label like Calm that runs faster than box breathing is a lie. The craft of this tool is named presets with the numbers visible (4-4-4-4). Pick Box, 4-7-8, or Coherent. Default is Box.',
  },
  {
    id: 'br-faq-3',
    question: 'Can I use this silently?',
    answer:
      'Yes. Mute under the board or Settings → Feel turns off the soft cue. Motion and mute are independent. Play session still works with sound off.',
  },
  {
    id: 'br-faq-4',
    question: 'What does Play session do?',
    answer:
      'It hides the rest of the page and uses the dark overlay surface so the circle is the only thing in front of you. Exit or Escape restores the page. Native fullscreen is attempted as a bonus; if the browser refuses, the overlay stays.',
  },
  {
    id: 'br-faq-5',
    question: 'How does a session end?',
    answer:
      'The circle fades instead of cutting. The phase line reads Session complete. Start again by picking a preset or entering Play session.',
  },
  {
    id: 'br-faq-6',
    question: 'Is this free, and do I need an account?',
    answer:
      'Yes. It runs in the tab with no account and no download. Timing never leaves the device.',
  },
  {
    id: 'br-faq-7',
    question: 'Does reduced motion disable the guide?',
    answer:
      'The circle stops expanding. Phase name and remaining seconds still run, so you can follow the pattern without the scale animation.',
  },
];
