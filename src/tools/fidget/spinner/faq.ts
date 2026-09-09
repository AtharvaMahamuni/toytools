import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'spin-faq-1',
    question: 'How do I spin this fidget spinner?',
    answer:
      'Flick the disc with mouse, trackpad, or a finger. The tool reads pointer velocity, not how far you dragged, so a short fast flick on a trackpad imparts spin. It coasts, then stops. Optional tick sounds fire when an arm crosses the top.',
  },
  {
    id: 'spin-faq-2',
    question: 'Why does it actually stop?',
    answer:
      'A leftover crawl drains a phone battery if the tab stays open. When speed falls below a rest threshold the loop ends and the status reads Stopped. Hiding the tab also stops the loop. That is the craft of this spinner.',
  },
  {
    id: 'spin-faq-3',
    question: 'Does reduced motion disable the spinner?',
    answer:
      'Continuous rotation turns off. Status reads Motion reduced. A tap still nudges the disc by a discrete step, so the control is not a dead toy. Settings → Feel Full or Reduced overrides the system preference once Feel loads.',
  },
  {
    id: 'spin-faq-4',
    question: 'Do ticks stay in sync on a long spin?',
    answer:
      'Ticks fire from the disc angle, not from elapsed time. Muting sound under the board or Settings → Feel silences them without changing the physics.',
  },
  {
    id: 'spin-faq-5',
    question: 'Is this free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab with no install, no account, and no paywall. Nothing about how you flicked it is uploaded.',
  },
  {
    id: 'spin-faq-6',
    question: 'What does Play do?',
    answer:
      'Play hides the trust row, knowledge drawers, footer, and Feel strip so the disc fills the screen. Flick anywhere on the stage. Exit or Escape restores the page. Mute stays in the corner and only flips sound. Set Sound and Haptics under Feel before Play.',
  },
  {
    id: 'spin-faq-7',
    question: 'Why is there no vibration on my laptop?',
    answer:
      'Most laptops have no vibrator. Haptics stay off by default. Turn them on under the board or Settings → Feel on a phone that can vibrate.',
  },
];
