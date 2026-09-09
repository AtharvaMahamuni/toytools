import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sand-faq-1',
    question: 'How do I play kinetic sand online?',
    answer:
      'Drag through the mound. Grains displace and settle. There is no account and no install. Feel intensity (Settings → Feel) picks how many columns the pile uses, so a budget phone can stay calm.',
  },
  {
    id: 'sand-faq-2',
    question: 'What does Reset pile do?',
    answer:
      'It restores a centred mound without reloading the tab. When sand packs into a corner the fidget looks finished. Reset is the continuation: same pile, same prefs, back to a heap you can drag again.',
  },
  {
    id: 'sand-faq-3',
    question: 'Why does a pinch not zoom the page?',
    answer:
      'The canvas captures the pointer and sets touch-action to none, so a two-finger gesture grabs sand instead of the browser page. That is a common failure on other sand toys.',
  },
  {
    id: 'sand-faq-4',
    question: 'Is this a heavy WebGL demo?',
    answer:
      'No. It is a column pile, not a particle ocean. Low, medium, and high intensity change column count. Reduced motion still lets you dig; grains jump to rest instead of trickling.',
  },
  {
    id: 'sand-faq-5',
    question: 'Is this free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab. Nothing about how you dragged the sand is uploaded.',
  },
  {
    id: 'sand-faq-6',
    question: 'What does Play do?',
    answer:
      'Play fills the screen with the sand stage under the tool name. Reset pile stays in the corner because packing is the end of the task. Exit or Escape restores the page.',
  },
];
