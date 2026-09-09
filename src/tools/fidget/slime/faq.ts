import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'slime-faq-1',
    question: 'How do I play with virtual slime?',
    answer:
      'Press and drag on the blob. It stretches toward your finger. Let go and it eases back. Stiffness follows Settings → Feel intensity: low is calm, high is stretchy. No goo skins and no download.',
  },
  {
    id: 'slime-faq-2',
    question: 'What does Release do?',
    answer:
      'If a pointer leaves the canvas without a pointerup, other slime toys stay glued to a ghost finger. This page listens for pointerup, pointercancel, and lostpointercapture. If a grab is still held with no buttons down, Release appears. One tap detaches the blob. It stays hidden when the pointer path is clean.',
  },
  {
    id: 'slime-faq-3',
    question: 'Why is there only one blob?',
    answer:
      'A zoo of meshes and IAP colours is the mobile-app pattern. One blob is enough for a short sensory break, and it keeps the page light on a phone.',
  },
  {
    id: 'slime-faq-4',
    question: 'Does this work in light and dark themes?',
    answer:
      'The fill is mixed from the accent and the surface tokens, so the blob does not disappear on a light page. Reduced motion stops idle jiggle; a grab still stretches because that is the task.',
  },
  {
    id: 'slime-faq-5',
    question: 'Is this free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab. Nothing about how you pulled the slime is uploaded.',
  },
  {
    id: 'slime-faq-6',
    question: 'What does Play do?',
    answer:
      'Play fills the screen with the blob. Release, if it is needed, stays on the stage. Exit or Escape restores the page.',
  },
];
