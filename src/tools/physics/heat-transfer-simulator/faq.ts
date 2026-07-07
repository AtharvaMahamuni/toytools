import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'heat-transfer-faq-1',
    question: 'Which way does heat flow?',
    answer:
      'Heat always flows from the hotter object to the colder one, never the other way on its own. That direction is the essence of the second law of thermodynamics. In the simulator the arrow and flow particles always point from the warmer block toward the cooler one, and the flow only stops once both blocks share the same temperature.',
  },
  {
    id: 'heat-transfer-faq-2',
    question: 'What is thermal equilibrium?',
    answer:
      'Thermal equilibrium is the state where two objects in contact reach the same temperature and no net heat flows between them. Because the two blocks here are identical, they settle at the average of their starting temperatures. The simulator marks equilibrium once the difference between the blocks drops below half a degree.',
  },
  {
    id: 'heat-transfer-faq-3',
    question: 'Why does the heat flow slow down over time?',
    answer:
      'The rate of heat flow is proportional to the temperature difference between the blocks. When the gap is large the flow is fast; as the blocks approach each other the gap shrinks and the flow fades. This gives the familiar exponential cooling curve, fast at first and gradually levelling off, which you can see in the graph.',
  },
  {
    id: 'heat-transfer-faq-4',
    question: 'What does the thermal conductance slider do?',
    answer:
      'Conductance sets how easily heat crosses between the blocks, like the quality of the thermal contact. High conductance behaves like metal pressed against metal and reaches equilibrium in seconds. Low conductance behaves like insulation and takes far longer. Importantly, the final equilibrium temperature is the same either way; only the speed changes.',
  },
  {
    id: 'heat-transfer-faq-5',
    question: 'Is energy conserved in the simulation?',
    answer:
      'Yes. Every unit of heat that leaves the hot block enters the cold block, so the total energy is constant. That is why the equilibrium temperature is exactly the average of the two starting temperatures for identical blocks. The heat-moved reading tracks how much energy has crossed between them.',
  },
  {
    id: 'heat-transfer-faq-6',
    question: 'Does this simulator send data anywhere?',
    answer:
      'No. The calculation runs in your browser on the canvas, with nothing uploaded or stored remotely. It continues to work offline once the page has loaded.',
  },
];
