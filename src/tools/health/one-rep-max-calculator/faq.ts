import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'one-rep-max-calculator-faq-1',
    question: 'How do I calculate my one rep max?',
    answer: 'Take a set close to failure, note the weight and the reps, and put both into a formula. For example, Epley multiplies the weight by 1 plus reps divided by 30, so 100 kg for 5 reps gives 100 times 1.167, or about 117 kg. This calculator runs four formulas at once and averages them, which is more honest than quoting whichever single number looks best.',
  },
  {
    id: 'one-rep-max-calculator-faq-2',
    question: 'Which one rep max formula is most accurate?',
    answer: 'None of them wins outright, which is why four are shown. Brzycki tends to read slightly low at high reps and Epley slightly high; Lombardi and O\'Conner sit between. At three to five reps they agree within a couple of percent, so the choice barely matters. At twelve or more they can differ by ten percent or more, and at that point the honest answer is the spread rather than any one number.',
  },
  {
    id: 'one-rep-max-calculator-faq-3',
    question: 'What percentage of my max should I train at?',
    answer: 'It depends on the goal. Strength work generally sits at 85 percent and above for one to five reps, hypertrophy at 70 to 85 percent for six to twelve, and muscular endurance below 70 percent for higher reps. The percentage table in the result converts your estimate straight into working weights, so a program calling for five sets of five at 80 percent needs no arithmetic.',
  },
  {
    id: 'one-rep-max-calculator-faq-4',
    question: 'How many reps should I use for the estimate?',
    answer: 'Three to five, taken close to failure. Fewer reps means the estimate barely extrapolates, so it is reliable, and the set is still safe to perform. Above about ten reps the limit shifts from peak force toward muscular endurance, which the formulas model poorly: two lifters with the same true max can post very different twenty rep sets. A submaximal set that was genuinely hard beats a heavier one you cut short.',
  },
  {
    id: 'one-rep-max-calculator-faq-5',
    question: 'Can I just attempt the estimated max?',
    answer: 'Not straight away. The estimate says what the arithmetic expects, not what your joints, technique, and nervous system will produce on the day. Work up in singles over several sets, use safety bars or a spotter, and stop if bar speed collapses or form breaks. Most lifters get everything they need from the estimate and never test a true maximum at all.',
  },
  {
    id: 'one-rep-max-calculator-faq-6',
    question: 'Does this work for any lift?',
    answer: 'It works best on big compound lifts with a long training history behind them: squat, bench press, deadlift, and overhead press. On isolation movements such as curls, and on lifts where balance or technique fails before the muscle does, the rep-to-load relationship is much noisier and the estimate drifts. Use it as a training anchor on the main lifts and judge the accessories by feel.',
  },
];
