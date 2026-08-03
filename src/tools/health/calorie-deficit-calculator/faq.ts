import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'calorie-deficit-calculator-faq-1',
    question: 'How big should a calorie deficit be?',
    answer: 'For most people, 0.5 to 1 percent of body weight a week is the range that holds. For example, at 80 kg that is 0.4 to 0.8 kg a week, which needs a deficit of roughly 440 to 880 kcal a day. Smaller deficits are easier to sustain and protect muscle better; larger ones lose more muscle and are abandoned more often. The calculator refuses to suggest eating below your BMR, which is where an aggressive rate usually ends up.',
  },
  {
    id: 'calorie-deficit-calculator-faq-2',
    question: 'Where does the 7,700 kcal per kilogram figure come from?',
    answer: 'A kilogram of body fat stores roughly 7,700 kcal of usable energy, which is the arithmetic behind every weight loss target. Divide by seven and you get about 1,100 kcal a day for a kilogram a week. It is a useful approximation rather than a law: real loss includes some lean tissue and water, and your burn falls as you get lighter, so the line bends over time rather than staying straight.',
  },
  {
    id: 'calorie-deficit-calculator-faq-3',
    question: 'Why did my weight loss stall?',
    answer: 'Two things happen at once. Your body is now lighter, so it burns less than it did at the start, and your original deficit has quietly shrunk toward maintenance. On top of that, water retention can mask several weeks of fat loss on the scale. Recalculate every 4 to 5 kg, weigh in at the same time each day, and judge progress from a weekly average rather than a single reading.',
  },
  {
    id: 'calorie-deficit-calculator-faq-4',
    question: 'Is it better to eat less or move more?',
    answer: 'Both work, and combining them beats either alone. Cutting food is the more reliable lever because it is easier to measure: a 500 kcal reduction is straightforward, while a 500 kcal workout is a serious session that also raises appetite. Adding activity, on the other hand, lets you eat more while still losing, which most people find easier to live with. This calculator changes the food side, so log your activity level honestly first.',
  },
  {
    id: 'calorie-deficit-calculator-faq-5',
    question: 'What happens if I eat below my BMR?',
    answer: 'Short spells are not dangerous for most healthy adults, but sustained intake below resting requirements tends to backfire. Muscle loss accelerates, training quality drops, and adherence collapses because the plan is simply unpleasant. That is why the target here is floored at your BMR: if the rate you picked would push intake lower, the calculator holds the floor and tells you the rate you will actually achieve instead.',
  },
  {
    id: 'calorie-deficit-calculator-faq-6',
    question: 'How accurate is the weeks-to-goal timeline?',
    answer: 'Treat it as a best case on a straight line. It assumes you hold the deficit every day, that your maintenance estimate is right, and that your burn does not fall as you lose. In practice all three drift, so a 20 week estimate often runs 24 or more. Its real value is comparative: it tells you whether a goal is a two month project or a six month one before you commit.',
  },
];
