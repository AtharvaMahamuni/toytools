import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'wave-speed-faq-1',
    question: 'What is the wave speed formula?',
    answer:
      'Wave speed equals frequency times wavelength: v = f × λ. Frequency (f) counts how many cycles pass a point each second, measured in hertz; wavelength (λ) is the distance between two crests, measured in metres. Multiply them and you get the speed in metres per second. The simulator runs this live, so nudging either slider updates the speed instantly.',
  },
  {
    id: 'wave-speed-faq-2',
    question: 'Does changing the frequency change the wave speed?',
    answer:
      'It depends on what you hold constant. In this simulator frequency and wavelength are independent sliders, so raising the frequency while keeping the wavelength fixed does increase v = f × λ. In many real media, though, the medium fixes the speed, and raising the frequency instead shortens the wavelength so the product stays the same. The simulator lets you explore both cases by choosing which value you change.',
  },
  {
    id: 'wave-speed-faq-3',
    question: 'Does amplitude affect wave speed?',
    answer:
      'No. Amplitude sets how tall the wave is and how much energy it carries, but it does not change how fast the pattern travels. Drag the wave taller or flatter in the simulator and watch the wave-speed reading stay put while the energy reading changes. Speed depends only on frequency and wavelength (or, in a real medium, on the medium itself).',
  },
  {
    id: 'wave-speed-faq-4',
    question: 'What is the difference between wave speed and the speed of the particles?',
    answer:
      'They are different things. The wave speed is how fast the crest pattern moves along, shown by the red crest marker. The medium particles, drawn as dots, only bob up and down in place; they never travel with the wave. Energy moves through the medium while the medium itself stays put, which is the defining feature of a wave.',
  },
  {
    id: 'wave-speed-faq-5',
    question: 'How do I calculate the period from frequency?',
    answer:
      'The period is the time for one full cycle and is the reciprocal of frequency: T = 1 / f. At 2 Hz the period is 0.5 seconds; at 0.25 Hz it is 4 seconds. The simulator shows the period alongside the wave speed so you can see both change together as you move the frequency slider.',
  },
  {
    id: 'wave-speed-faq-6',
    question: 'Is anything uploaded when I use the simulator?',
    answer:
      'No. The whole simulation runs in your browser using the HTML canvas and a little maths. Nothing you do is sent anywhere, and it keeps working offline once the page has loaded.',
  },
];
