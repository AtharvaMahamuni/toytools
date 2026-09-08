import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sb-faq-1',
    question: 'What is a switch board fidget?',
    answer:
      'A switch board is a grid of latching toggles you flip for the click, not for a score. This one is sixteen switches in four columns. Tap to latch a switch on or off. Optional click sound and haptics live under the board and Settings → Feel. Nothing about which switches you flipped is uploaded.',
  },
  {
    id: 'sb-faq-2',
    question: 'Does every flip make a sound?',
    answer:
      'Only if Sounds are on. The default is on. The cue is a short click the browser synthesises, so there is no audio file to fetch. Toggle Sound under the board or Settings → Feel. Muting sound does not turn haptics off. The two channels are separate on purpose.',
  },
  {
    id: 'sb-faq-3',
    question: 'Why is there no vibration on my laptop?',
    answer:
      'Most desktops and laptops have no vibrator. Haptics stay off by default. Even when you opt in, a missing vibration API is ignored so the switch still latches. Turn Haptics on under the board or Settings → Feel when you are on a phone that can actually vibrate.',
  },
  {
    id: 'sb-faq-4',
    question: 'How do I clear the board after flipping around?',
    answer:
      'Tap All off. That is the craft of this tool: a mixed board should not force you to toggle each switch by hand or reload the tab. All off is hidden while every switch is already off, and it leaves your sound and haptics preferences alone.',
  },
  {
    id: 'sb-faq-5',
    question: 'Can one tap flip the same switch twice?',
    answer:
      'No. A press latches once. The matching click is ignored so press and release cannot fight each other, which is the bug that makes a toggle animate then snap back.',
  },
  {
    id: 'sb-faq-6',
    question: 'Can I use the board with a keyboard?',
    answer:
      'Yes. Tab to the board, then use arrow keys to move and Space or Enter to flip the focused switch. Individual switches are not each in the tab order, so you do not tab through sixteen controls to leave the page.',
  },
  {
    id: 'sb-faq-7',
    question: 'Is anything stored or uploaded when I use this?',
    answer:
      'The latches themselves are not saved. Feel preferences for sound, haptics, and motion live in your browser under Settings → Feel so other fidgets can read the same choices. Nothing about which switches you flipped is sent to a server, and there is no account.',
  },
  {
    id: 'sb-faq-8',
    question: 'How is this different from an ASMR switch video?',
    answer:
      'A video is not interactive. You cannot flip a latch, mute the click independently of vibration, or clear the board. This page is a real grid of buttons in your tab, with no install and no IAP skins.',
  },
  {
    id: 'sb-faq-9',
    question: 'Is this Switch Board free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab with no install, no account, and no paywall. Open the page, flip a few switches, and leave when you are done. Once the tab has loaded, it keeps working without a server.',
  },
  {
    id: 'sb-faq-10',
    question: 'Does reduced motion disable the fidget?',
    answer:
      'No. Reduced motion (from your system or Settings → Feel) turns off switch transitions. Taps still latch and All off still works. Once Feel loads, the Full or Reduced choice under Settings → Feel overrides the system preference.',
  },
];
