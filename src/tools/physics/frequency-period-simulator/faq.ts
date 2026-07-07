import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'freq-period-faq-1',
    question: 'What is the relationship between frequency and period?',
    answer:
      'They are exact reciprocals: T = 1 / f, and equivalently f = 1 / T. Frequency counts cycles per second (hertz); period measures seconds per cycle. Multiply them together and you always get one. At 2 Hz the period is 0.5 seconds; at 0.25 Hz it is 4 seconds. The simulator shows both at once so you can watch one shrink as the other grows.',
  },
  {
    id: 'freq-period-faq-2',
    question: 'What is angular frequency?',
    answer:
      'Angular frequency, written ω, measures how fast the oscillation advances in radians per second: ω = 2πf. One full cycle is 2π radians, so a 1 Hz oscillation has an angular frequency of about 6.28 rad/s. It is the natural unit for the sine function that describes the motion, which is why it appears throughout wave and oscillation equations.',
  },
  {
    id: 'freq-period-faq-3',
    question: 'How does the tap-the-beat feature work?',
    answer:
      'Tap or click the canvas in a steady rhythm and the simulator measures the time between your taps, then sets the frequency to match. Tapping once a second gives 1 Hz; tapping twice a second gives 2 Hz. It is a hands-on way to feel that frequency is simply how often something repeats, turned into a number.',
  },
  {
    id: 'freq-period-faq-4',
    question: 'If I double the frequency, what happens to the period?',
    answer:
      'The period halves. Because T = 1 / f, frequency and period always move in opposite directions by the same factor. Double the frequency and each cycle has half as much time; halve the frequency and each cycle lasts twice as long. Drag the frequency slider and watch the period reading move the opposite way.',
  },
  {
    id: 'freq-period-faq-5',
    question: 'Does this simulator send my data anywhere?',
    answer:
      'No. Everything runs in your browser with a canvas and simple maths. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
  },
];
