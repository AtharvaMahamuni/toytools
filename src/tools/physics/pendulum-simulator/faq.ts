import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pendulum-faq-1',
    question: 'What determines the period of a pendulum?',
    answer:
      'For small swings the period is T ≈ 2π√(L / g): it depends only on the length L and the gravitational field g. A longer pendulum swings more slowly, and stronger gravity speeds it up. Strikingly, the mass of the bob does not appear, so a heavy and a light bob of the same length swing at the same rate. The simulator shows the period updating as you change length and gravity.',
  },
  {
    id: 'pendulum-faq-2',
    question: 'Why does the mass not affect the period?',
    answer:
      'Gravity pulls harder on a heavier bob, but a heavier bob also resists changes in motion more, and the two effects cancel exactly. This is the same reason all objects fall at the same rate in a vacuum. In the formula T ≈ 2π√(L / g) there is simply no mass term. The simulator keeps mass fixed at one kilogram and display-only for this reason.',
  },
  {
    id: 'pendulum-faq-3',
    question: 'How does energy change during a swing?',
    answer:
      'Energy trades between two forms. At the top of a swing the bob is momentarily still, so all the energy is potential (stored in its height). At the bottom it moves fastest, so the energy is all kinetic. In between it is a mix, and the total stays constant. The PE and KE bars in the simulator rise and fall in opposite step to show this conservation.',
  },
  {
    id: 'pendulum-faq-4',
    question: 'Is the small-angle formula always accurate?',
    answer:
      'No. T ≈ 2π√(L / g) is an approximation that is excellent for small swings but drifts for large ones. At a 60 degree release the true period is around 7 percent longer than the formula predicts. This simulator integrates the full nonlinear equation, so releasing the bob from a wide angle makes it visibly swing slower than the small-angle reading suggests.',
  },
  {
    id: 'pendulum-faq-5',
    question: 'How do I set the starting angle?',
    answer:
      'Drag the bob to wherever you want and let go: it swings from rest at that angle. You can also use the initial-angle slider, or load a preset such as the grandfather clock. Dragging is the most direct way to feel how a wider release stores more potential energy and produces a faster bottom-of-swing speed.',
  },
  {
    id: 'pendulum-faq-6',
    question: 'Does the simulator upload anything?',
    answer:
      'No. It runs entirely in your browser on the HTML canvas, computing the motion locally. Nothing is sent anywhere and it works offline once loaded.',
  },
];
