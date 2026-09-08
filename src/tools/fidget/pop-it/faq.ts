import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pop-faq-1',
    question: 'Does this Pop It make sound on every tap?',
    answer:
      'Only if Sounds are on under Settings → Feel. The default is on, and one toggle mutes every fidget on the site without turning haptics off. Sound and vibration are separate on purpose, so an open office can stay quiet while a phone still buzzes if you want it to.',
  },
  {
    id: 'pop-faq-2',
    question: 'Why is there no vibration on my laptop?',
    answer:
      'Most desktops and laptops have no vibrator. Haptics stay off by default, and even when you opt in the Feel engine swallows a missing or rejected vibration API so the bubble still pops. Turn Haptics on under Settings → Feel when you are on a phone that can actually vibrate.',
  },
  {
    id: 'pop-faq-3',
    question: 'How do I reuse the board after every bubble is popped?',
    answer:
      'Tap Reset board. That is the craft of this tool: a finished grid should not force a reload. Reset inflates every bubble again and leaves your sound and haptics preferences alone.',
  },
  {
    id: 'pop-faq-4',
    question: 'Can one tap pop the same bubble twice?',
    answer:
      'No. A bubble that is already popped ignores further presses until you reset. That avoids the common bug where press and release both fire and the same cell tries to pop twice.',
  },
  {
    id: 'pop-faq-5',
    question: 'Is anything stored or uploaded when I use this?',
    answer:
      'The board itself is not saved. Feel preferences (sound, haptics, motion) live in your browser under the shared Settings page so other fidgets can read the same choices. Nothing about which bubbles you popped is sent to a server, and there is no account.',
  },
  {
    id: 'pop-faq-6',
    question: 'How is this different from a phone Pop It app?',
    answer:
      'You do not install anything, grant notification permissions, or sit through autoplaying ads. Preferences are shared with other ToyTools fidgets through the Feel settings, instead of being trapped inside one app.',
  },
  {
    id: 'pop-faq-7',
    question: 'Does reduced motion disable the fidget?',
    answer:
      'No. Reduced motion (from your system or Settings → Feel) turns off bubble transitions. Taps still pop bubbles and Reset still works. Once Feel loads, the Full or Reduced choice under Settings → Feel overrides the system preference.',
  },
  {
    id: 'pop-faq-8',
    question: 'How many bubbles are on the board?',
    answer:
      'Twelve, in a four by three grid sized for a phone-width screen. That is enough to fidget through without scrolling the board away, and small enough to reset in one tap when you are done.',
  },
  {
    id: 'pop-faq-9',
    question: 'What is a virtual Pop It?',
    answer:
      'A virtual Pop It is a browser bubble board you tap instead of squeezing silicone. This one is a four by three grid of twelve bubbles. Tap to flatten one, then use Reset board when the grid is clear. Optional sound and haptics live under Settings → Feel, and nothing about which bubbles you popped is uploaded.',
  },
  {
    id: 'pop-faq-10',
    question: 'Is this Pop It free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab with no install, no account, and no paywall. Open the page, tap, and leave when you are done.',
  },
  {
    id: 'pop-faq-11',
    question: 'Does this Pop It work on a phone?',
    answer:
      'Yes. The twelve-bubble grid is sized for a phone-width screen and accepts tap. On a phone you can turn Haptics on under Settings → Feel; on most laptops there is no vibrator, so leave haptics off.',
  },
];
