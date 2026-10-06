import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'colorblind-simulator-faq-1',
    question: 'How do I check a palette in a colorblind simulator?',
    answer:
      'Type the colors with spaces between them, for example #d32f2f #388e3c #1976d2. The page draws the palette as you typed it, then again under protanopia, deuteranopia, tritanopia, the three anomaly types, and achromatopsia. The list scrolls. You do not switch types one at a time. Copy puts the hex values and the collapse note on the clipboard.',
  },
  {
    id: 'colorblind-simulator-faq-2',
    question: 'What is the difference between protanopia and deuteranopia?',
    answer:
      'Protanopia is the simulation with no L cones, the long-wavelength cones. Deuteranopia is the simulation with no M cones, the medium-wavelength cones. Both are red-green deficiencies, and they do not move a color by the same amount. The rows are labeled, so the swatch you are looking at names the type. Protanomaly and deuteranomaly use a milder step from the same model, severity 0.6 rather than full dichromacy.',
  },
  {
    id: 'colorblind-simulator-faq-3',
    question: 'Why do some red and green pairs stay apart?',
    answer:
      'The simulation is Machado, Oliveira, and Fernandes (2009), applied in linear sRGB. It keeps lightness. Pure red #ff0000 and pure green #00ff00 differ a lot in lightness, so they stay apart under deuteranopia. A mid red and a mid green, such as #d32f2f and #388e3c, are close in lightness and can land on top of each other. If a pair you care about is the pure pair, judge the swatches, not the proverb.',
  },
  {
    id: 'colorblind-simulator-faq-4',
    question: 'When does the collapse note appear?',
    answer:
      'The note appears when two colors that started well apart land close together under one of the cone simulations. It names that type and both hex values, and it gives the distance before and after. If several types collapse a pair, the note names the closest landing. It stays hidden when every distinct pair stays distinct, when you entered one color, or when two swatches were already the same color.',
  },
  {
    id: 'colorblind-simulator-faq-5',
    question: 'Does this diagnose color vision?',
    answer:
      'No. A color blindness simulator shows a model of how a palette shifts. It does not test a person, and it does not say which type someone has. Anomalous trichromacy here is one published severity, 0.6, not a measurement of an eye. Blue cone monochromacy is not in the Machado table this page uses, so it is not drawn.',
  },
  {
    id: 'colorblind-simulator-faq-6',
    question: 'Is the palette uploaded?',
    answer:
      'No. The arithmetic runs in the browser. Nothing is uploaded, and the colors you type are not stored for the next visit. A screenshot you would otherwise send to a server stays on the machine.',
  },
];
