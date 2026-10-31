import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'infinity-cube-faq-1',
    question: 'How do I fold the infinity cube?',
    answer:
      'Tap the free half, or swipe along that half. One fold is 90 degrees, and only the open hinge moves. A second swipe during the fold does nothing. The next hinge becomes free when the quarter turn finishes.',
  },
  {
    id: 'infinity-cube-faq-2',
    question: 'Why will it not fold the hinge I touched?',
    answer:
      'That block is not on the open hinge. A pointer there does not start a fold, because that move would drive one block through its neighbour.',
  },
  {
    id: 'infinity-cube-faq-3',
    question: 'Can the blocks pass through each other?',
    answer:
      'No. The page refuses a hinge that would let the blocks pass through each other, and the cube stays put.',
  },
  {
    id: 'infinity-cube-faq-4',
    question: 'How do I get back to one closed cube?',
    answer:
      'Keep folding the open hinge until the chain is one cube again. Five quarter turns from the closed cube do that. Reset returns at once and clears the session count.',
  },
  {
    id: 'infinity-cube-faq-5',
    question: 'Does it make a sound on every fold?',
    answer:
      'One soft click plays at the end of a fold while Sound is On. Sound Off stays silent. The cue comes from the shared Feel control under the cube.',
  },
  {
    id: 'infinity-cube-faq-6',
    question: 'Why is there no vibration on my laptop?',
    answer:
      'Haptics ship turned off, and a laptop has no vibration motor. Turn Haptics on for a phone that supports it. The cube never vibrates by itself. It asks the shared Feel control.',
  },
  {
    id: 'infinity-cube-faq-7',
    question: 'Does reduced motion still let me fold?',
    answer:
      'Yes. The fold still happens. The picture jumps to the end pose, the count rises by one, and the next hinge is the one you can fold.',
  },
  {
    id: 'infinity-cube-faq-8',
    question: 'Is the fold count saved?',
    answer:
      'No. The fold count lives in memory for this visit only. Reset clears it. Leaving the page clears it too.',
  },
  {
    id: 'infinity-cube-faq-9',
    question: 'Is anything uploaded?',
    answer: 'No. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'infinity-cube-faq-10',
    question: 'How is this different from a fidget spinner?',
    answer:
      'A fidget spinner is a flick that coasts after you let go. This cube is a fold with a next legal hinge, one quarter turn at a time. Pop It inverts one bubble. The cube moves a whole half.',
  },
  {
    id: 'infinity-cube-faq-11',
    question: 'Does it work on a phone?',
    answer:
      'Yes. Tap the free half. The stage fits a phone width, and the page stays in one column.',
  },
  {
    id: 'infinity-cube-faq-12',
    question: 'Is it free, with nothing to install?',
    answer: 'Yes. It is free, and there is nothing to install. Open the page and fold.',
  },
];
