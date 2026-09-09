import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'gears-faq-1',
    question: 'What are interactive gears in a browser?',
    answer:
      'Two meshing gears you can spin with a drag. Tooth count sets radius, so the pair always meshes. The live ratio (default 1 : 2) updates if you change teeth. Optional click sound and haptics live under the board and Settings → Feel. Nothing is uploaded.',
  },
  {
    id: 'gears-faq-2',
    question: 'Why can I not set radius separately from tooth count?',
    answer:
      'Because that is how real gears fail on screen. If radius and teeth disagree, two discs overlap without meshing and the ratio label is a lie. This page snaps radius to tooth count. A pair that would not fit the stage is refused and the previous layout stays.',
  },
  {
    id: 'gears-faq-3',
    question: 'How do I read the gear ratio?',
    answer:
      'The line under the stage is the reduced ratio of driver teeth to driven teeth. Twelve and twenty-four reads 1 : 2. The driven gear turns the other way, as an external mesh should.',
  },
  {
    id: 'gears-faq-4',
    question: 'Does this work with reduced motion?',
    answer:
      'Yes. Continuous spin turns off. A Step control appears so you can advance one tooth at a time. The ratio and the mesh stay. Settings → Feel Full or Reduced overrides the system preference once Feel loads.',
  },
  {
    id: 'gears-faq-5',
    question: 'Is anything stored or uploaded?',
    answer:
      'The layout is not saved. Feel preferences for sound, haptics, and motion live in your browser under Settings → Feel so other fidgets can read them. Nothing about how you spun the gears is sent to a server.',
  },
  {
    id: 'gears-faq-6',
    question: 'How is this different from a CAD gear calculator?',
    answer:
      'CAD tools hide the feel and textbooks hide the play. This is a fidget first: drag to spin, hear an optional tick, reset the layout. The ratio is visible because hiding it is how toy gears become decoration.',
  },
  {
    id: 'gears-faq-7',
    question: 'What does Play do?',
    answer:
      'Play hides the trust row, knowledge drawers, footer, and Feel strip so the gears fill the screen under the tool name. Exit or Escape restores the page. Mute stays in the corner. Sound and haptics still follow Settings → Feel.',
  },
  {
    id: 'gears-faq-8',
    question: 'Is this free, and do I need to download it?',
    answer:
      'Yes. It runs in the tab with no install, no account, and no paywall. Open the page, drag a gear, and leave when you are done.',
  },
];
