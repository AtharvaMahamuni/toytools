// Macro calculator: splits a daily calorie target into grams of protein, carbohydrate, and fat under
// a chosen diet ratio. It answers the question people bring from a TDEE result ("okay, but what do I
// actually eat?") without pretending there is one correct split.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { macroGrams, type MacroSplit } from '../models';
import { num1 } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { partsSpec } from '@lib/visualization/types';

const DIETS = ['balanced', 'high-protein', 'low-carb', 'keto'] as const;
type Diet = (typeof DIETS)[number];

const DIET_SPLIT: Record<Diet, MacroSplit> = {
  balanced: { carb: 50, protein: 20, fat: 30 },
  'high-protein': { carb: 40, protein: 35, fat: 25 },
  'low-carb': { carb: 25, protein: 40, fat: 35 },
  keto: { carb: 5, protein: 25, fat: 70 },
};

const DIET_LABEL: Record<Diet, string> = {
  balanced: 'Balanced (50/20/30)',
  'high-protein': 'High protein (40/35/25)',
  'low-carb': 'Low carb (25/40/35)',
  keto: 'Keto (5/25/70)',
};

export const macroCalculator: WellnessCalculator = {
  id: 'macro',
  family: 'nutrition',
  capabilities: { loadExample: true, visualization: true },
  fields: [
    {
      id: 'calories',
      label: 'Daily calories',
      type: 'number',
      default: 2000,
      min: 0,
      max: 10000,
      step: 10,
      suffix: 'kcal',
      help: 'Your daily calorie target (try the TDEE calculator if you do not have one).',
      presets: [
        { label: '1,800', value: 1800 },
        { label: '2,000', value: 2000 },
        { label: '2,500', value: 2500 },
      ],
    },
    {
      id: 'diet',
      label: 'Diet style',
      type: 'select',
      default: 'balanced',
      options: DIETS.map((d) => ({ value: d, label: DIET_LABEL[d] })),
    },
  ],

  calculate(input, _opts) {
    const diet = selectField(input, 'diet', 'a diet style', DIETS);
    if (!diet.ok) return diet.result;
    const cal = numberField(input, 'calories', 'your daily calories', { min: 0, max: 10000 });
    if (!cal.ok) return cal.result;
    if (cal.value <= 0) return validationError('Enter a calorie target above zero to split into macros.');

    const split = DIET_SPLIT[diet.value as Diet];
    const g = macroGrams(cal.value, split);

    const hero = card('protein', 'Protein', `${num1(g.protein)} g`, {
      raw: Number(g.protein.toFixed(1)),
      emphasis: 'hero',
      note: `${split.protein}% of ${num1(cal.value)} kcal`,
    });

    const metrics: ResultCard[] = [
      card('carb', 'Carbohydrate', `${num1(g.carb)} g`, { raw: Number(g.carb.toFixed(1)), emphasis: 'primary', note: `${split.carb}% of calories` }),
      card('fat', 'Fat', `${num1(g.fat)} g`, { raw: Number(g.fat.toFixed(1)), emphasis: 'primary', note: `${split.fat}% of calories` }),
      card('split', 'Split (C/P/F)', `${split.carb}/${split.protein}/${split.fat}`),
    ];

    // Split by CALORIES, not grams: the percentages are calorie shares, and fat carries 9 kcal/g
    // against 4 for protein and carbs, so a gram-width bar would misrepresent the same split.
    const viz = partsSpec(
      [
        { id: 'carb', label: 'Carbs', value: split.carb, display: `${num1(g.carb)} g` },
        { id: 'protein', label: 'Protein', value: split.protein, display: `${num1(g.protein)} g` },
        { id: 'fat', label: 'Fat', value: split.fat, display: `${num1(g.fat)} g` },
      ],
      {
        kind: 'distribution',
        title: 'Your macro split',
        description: `${split.carb}% carbs, ${split.protein}% protein, ${split.fat}% fat of ${num1(cal.value)} kcal.`,
      },
    );

    const insights = [
      insight(
        `On a ${DIET_LABEL[diet.value as Diet].split(' (')[0].toLowerCase()} split, ${num1(cal.value)} kcal works out to ${num1(g.protein)} g protein, ${num1(g.carb)} g carbs, and ${num1(g.fat)} g fat a day.`,
      ),
      insight(
        'Protein and carbs carry 4 calories per gram, fat carries 9. There is no single correct split: protein supports muscle, carbs fuel training, and fat supports hormones, so pick a ratio you can actually stick to.',
        'info',
      ),
      insight(
        'Hitting your calorie total matters more than nailing the exact ratio. Treat these grams as targets to aim near, not numbers to obsess over.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: viz,
      insights,
      assumptions: [
        assumption('Diet style', DIET_LABEL[diet.value as Diet]),
        assumption('Energy per gram', 'protein 4, carb 4, fat 9 kcal'),
      ],
      decisions: decisions([
        toolDecision('Find your calorie target first', 'tdee-calculator'),
        toolDecision('Check your BMI and healthy range', 'bmi-calculator'),
      ]),
      nextQuestions: [
        'How many calories should I eat a day?',
        'How much protein do I need?',
        'What is a good macro split for weight loss?',
      ],
      explanation:
        'Macros are the three nutrients that supply calories: protein, carbohydrate, and fat. A macro split assigns a percentage of your daily calories to each, then converts those calories to grams using 4 kcal per gram for protein and carbs and 9 for fat. The right split depends on your goals and preferences, not a universal rule, so this tool offers common presets and shows the grams each one produces. Consistency with your calorie total beats chasing a perfect ratio.',
      meta: { protein: Number(g.protein.toFixed(1)), carb: Number(g.carb.toFixed(1)), fat: Number(g.fat.toFixed(1)) },
    });
  },
};
