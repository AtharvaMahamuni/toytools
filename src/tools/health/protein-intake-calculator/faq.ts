import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'protein-intake-calculator-faq-1',
    question: 'How much protein do I need a day?',
    answer: 'It depends on body weight and on what you are asking your muscles to do. For example, a 70 kg person needs about 56 to 70 g for general health, 84 to 112 g when generally active, and 112 to 154 g when strength training. Cutting calories raises it further, to roughly 126 to 168 g, because protein is what protects muscle while energy is short. The calculator gives the range rather than one number because that is how the guidelines are written.',
  },
  {
    id: 'protein-intake-calculator-faq-2',
    question: 'Why is it a range instead of a single number?',
    answer: 'Because the research reports ranges. The ISSN and the joint ACSM statement both give bands, since individual needs shift with training volume, calorie intake, age, and how much muscle you already carry. A single number would be a false precision. Anywhere inside your band is fine, and picking the middle is a perfectly reasonable way to plan meals.',
  },
  {
    id: 'protein-intake-calculator-faq-3',
    question: 'Is too much protein bad for you?',
    answer: 'For healthy kidneys, intakes up to around 2 g per kilogram have not been shown to cause harm, and controlled trials at higher intakes in trained people have found no adverse effects on kidney or liver markers. The practical limit is different: past the top of the range, extra protein simply displaces carbohydrate and fat you might rather eat, without adding muscle. Anyone with existing kidney disease should follow medical advice instead.',
  },
  {
    id: 'protein-intake-calculator-faq-4',
    question: 'Should protein be based on body weight or lean mass?',
    answer: 'Lean mass is more precise, but total body weight is what most guidelines and most calculators use, including this one. The difference matters most at higher body fat: a 120 kg person carrying a lot of fat gets a target from total weight that overshoots what their muscle can use. If you know your body fat percentage, apply the same grams per kilogram to your lean mass instead and use that as the target.',
  },
  {
    id: 'protein-intake-calculator-faq-5',
    question: 'Does it matter how I spread protein across the day?',
    answer: 'Yes. Muscle protein synthesis responds per meal rather than per day, and roughly 0.4 g per kilogram in a sitting is where the response saturates. For example, 140 g spread over four meals of 35 g works better than 40 g at lunch and 100 g at dinner. The calculator shows the per-meal figure alongside the daily one for exactly this reason.',
  },
  {
    id: 'protein-intake-calculator-faq-6',
    question: 'Do I need protein powder to hit these numbers?',
    answer: 'No. Powder is convenient, not necessary. For example, 150 g a day is reachable with three eggs, 200 g of chicken, a tin of tuna, and a bowl of Greek yoghurt. Powder earns its place when a target is high, appetite is low, or a meal has to be quick after training, but whole food covers the same ground with more fibre and micronutrients.',
  },
];
