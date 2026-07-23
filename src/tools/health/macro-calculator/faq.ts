import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'macro-calculator-faq-1',
    question: 'How do I calculate my macros?',
    answer: 'Start with a daily calorie target, then decide what percentage of those calories comes from each macronutrient. Convert the percentages to grams using the energy each provides: protein and carbohydrate give 4 calories per gram, fat gives 9. For example, 20 percent of a 2,000 calorie day as protein is 400 calories, which divided by 4 is 100 grams. The calculator does all of this once you pick a diet style.',
  },
  {
    id: 'macro-calculator-faq-2',
    question: 'What is a good macro split for weight loss?',
    answer: 'For fat loss, a higher-protein split helps because protein preserves muscle and keeps you full, so many people do well around 40 percent carbs, 35 percent protein, and 25 percent fat. That said, the split that works is the one you can stick to while staying in a calorie deficit. The tool offers balanced, high-protein, low-carb, and keto presets so you can compare the grams each produces.',
  },
  {
    id: 'macro-calculator-faq-3',
    question: 'How much protein should I eat?',
    answer: 'A common evidence-based range is roughly 1.6 to 2.2 grams of protein per kilogram of bodyweight for people who train, which for many lands between 100 and 160 grams a day. The percentage-based splits here often fall in that zone, but if you have your bodyweight handy you can sanity-check the protein figure against that range and pick the split that gets you there.',
  },
  {
    id: 'macro-calculator-faq-4',
    question: 'What is the difference between the diet presets?',
    answer: 'They shift where your calories come from. Balanced keeps carbs highest for everyday energy. High-protein raises protein for muscle retention and fullness. Low-carb trims carbohydrate and leans on protein and fat. Keto pushes fat very high and carbs very low, around 5 percent, to encourage ketosis. Switch between them to see how dramatically the fat and carb grams change while calories stay the same.',
  },
  {
    id: 'macro-calculator-faq-5',
    question: 'Do I need to hit my macros exactly?',
    answer: 'No. Getting close is plenty. Your calorie total is what drives weight change, and the macro split is a secondary lever that affects performance, fullness, and body composition. Aim to land within about ten grams of each target on most days rather than weighing every crumb. Consistency over weeks beats precision on any single day.',
  },
  {
    id: 'macro-calculator-faq-6',
    question: 'Where do I get my calorie target?',
    answer: 'From your Total Daily Energy Expenditure. Use the TDEE calculator to estimate the calories you burn in a day, then eat at that number to maintain, below it to lose, or above it to gain. Feed that figure into this macro calculator and it will split it into protein, carbs, and fat for your chosen diet style. Everything runs privately in your browser.',
  },
];
