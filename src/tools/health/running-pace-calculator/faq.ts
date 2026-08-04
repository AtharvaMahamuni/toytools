import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'running-pace-calculator-faq-1',
    question: 'How do I calculate running pace?',
    answer: 'Divide your total time by the distance. For example, 5 km in 25 minutes is 1,500 seconds over 5, which is 300 seconds or 5:00 per kilometre. In miles that same run is 8:03 per mile, because a mile is 1.609 km. The calculator does both at once, so a run logged in kilometres still gives you the mile pace a race in the United States will be run at.',
  },
  {
    id: 'running-pace-calculator-faq-2',
    question: 'What is the difference between pace and speed?',
    answer: 'They are the same relationship read in opposite directions. Pace is time per distance, written as minutes and seconds per kilometre or mile, and lower is faster. Speed is distance per time, written in km/h or mph, and higher is faster. Runners think in pace because a race target is a time; treadmills and cyclists use speed. For example, 5:00 per kilometre is 12 km/h.',
  },
  {
    id: 'running-pace-calculator-faq-3',
    question: 'Can a 5K time predict my marathon time?',
    answer: 'It can point at a range, but treat it loosely. Riegel\'s model is most trustworthy within about a factor of three of the distance you ran, so a 5K predicts a 10K well and a half marathon acceptably. A marathon is more than eight times the distance, and the prediction assumes marathon-specific training you may not have done. Runners without a long-run base routinely finish 20 to 30 minutes behind the predicted time.',
  },
  {
    id: 'running-pace-calculator-faq-4',
    question: 'What is a good 5K pace?',
    answer: 'Good is relative to where you started, but some rough markers help. A 30 minute 5K is 6:00 per kilometre and is a solid recreational time; 25 minutes is 5:00 per kilometre and puts you ahead of most club beginners; under 20 minutes, at 4:00 per kilometre, is competitive club running. Improvement in your own times over a season matters far more than any of these.',
  },
  {
    id: 'running-pace-calculator-faq-5',
    question: 'Why does the predicted pace get slower for longer races?',
    answer: 'Because holding a speed gets harder the longer you hold it, and Riegel encodes that in the exponent 1.06. If pace were constant the exponent would be 1, and doubling the distance would exactly double the time. At 1.06 doubling the distance multiplies time by about 2.08, which is the few percent of slowdown real runners show. It is a small number with a large effect over a marathon.',
  },
  {
    id: 'running-pace-calculator-faq-6',
    question: 'Do hills and terrain change the prediction?',
    answer: 'Yes, and the model does not know about them. It assumes flat ground and even pacing throughout. A time set on a downhill course or with a strong tailwind flatters every prediction that follows, and a hilly trail run understates your road form. Feed it a flat, honestly paced effort, ideally a race or a proper time trial, and the numbers behave much better.',
  },
];
