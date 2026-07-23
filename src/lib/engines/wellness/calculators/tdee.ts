// TDEE calculator: Total Daily Energy Expenditure from the Mifflin-St Jeor BMR and a standard
// activity multiplier, in metric (kg/cm) or imperial (lb/in). Beyond the maintenance number it
// gives concrete calorie targets for losing, holding, and gaining weight, since "how many calories
// to eat" is the question people actually arrive with.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  bmrMifflinStJeor,
  tdee as computeTdee,
  ACTIVITY_FACTOR,
  dailyCalorieDelta,
  lbToKg,
  inToCm,
  type ActivityLevel,
  type Sex,
} from '../models';
import { calories } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;
const ACTIVITIES = ['sedentary', 'light', 'moderate', 'active', 'very-active'] as const;

const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly active (1 to 3 days a week)',
  moderate: 'Moderately active (3 to 5 days a week)',
  active: 'Very active (6 to 7 days a week)',
  'very-active': 'Extra active (hard training or physical job)',
};

export const tdeeCalculator: WellnessCalculator = {
  id: 'tdee',
  family: 'energy',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'select',
      default: 'metric',
      options: [
        { value: 'metric', label: 'Metric (kg, cm)' },
        { value: 'imperial', label: 'Imperial (lb, in)' },
      ],
    },
    {
      id: 'sex',
      label: 'Sex',
      type: 'select',
      default: 'male',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      help: 'Used by the BMR equation; enter the sex your body most closely matches metabolically.',
    },
    { id: 'age', label: 'Age', type: 'integer', default: 30, min: 14, max: 120, step: 1, suffix: 'years' },
    { id: 'weight', label: 'Weight', type: 'number', default: 70, min: 0, step: 0.1, help: 'Kilograms in metric, pounds in imperial.' },
    { id: 'height', label: 'Height', type: 'number', default: 175, min: 0, step: 0.1, help: 'Centimetres in metric, total inches in imperial.' },
    {
      id: 'activity',
      label: 'Activity level',
      type: 'select',
      default: 'moderate',
      options: [
        { value: 'sedentary', label: ACTIVITY_LABEL.sedentary },
        { value: 'light', label: ACTIVITY_LABEL.light },
        { value: 'moderate', label: ACTIVITY_LABEL.moderate },
        { value: 'active', label: ACTIVITY_LABEL.active },
        { value: 'very-active', label: ACTIVITY_LABEL['very-active'] },
      ],
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the BMR equation', SEXES);
    if (!sex.ok) return sex.result;
    const activity = selectField(input, 'activity', 'your activity level', ACTIVITIES);
    if (!activity.ok) return activity.result;
    const isMetric = unit.value === 'metric';

    const age = numberField(input, 'age', 'your age', { min: 14, max: 120 });
    if (!age.ok) return age.result;
    const w = numberField(input, 'weight', 'your weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = numberField(input, 'height', 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (w.value <= 0) return validationError('Enter a weight above zero to calculate your energy needs.');
    if (h.value <= 0) return validationError('Enter a height above zero to calculate your energy needs.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightCm = isMetric ? h.value : inToCm(h.value);

    const bmr = bmrMifflinStJeor(sex.value as Sex, weightKg, heightCm, age.value);
    const maintain = computeTdee(bmr, activity.value as ActivityLevel);

    // Concrete calorie goals. A 0.5 kg/week change is ~550 kcal/day; floor a deficit at the BMR so
    // the suggestion never drops below the body's resting requirement.
    const mildLoss = Math.max(bmr, maintain - dailyCalorieDelta(0.25));
    const loss = Math.max(bmr, maintain - dailyCalorieDelta(0.5));
    const gain = maintain + dailyCalorieDelta(0.5);

    const hero = card('tdee', 'Calories to maintain', calories(maintain), {
      raw: Math.round(maintain),
      emphasis: 'hero',
      note: 'per day at your activity level',
    });

    const metrics: ResultCard[] = [
      card('bmr', 'BMR (at complete rest)', calories(bmr), { raw: Math.round(bmr), emphasis: 'primary' }),
      card('mild-loss', 'Mild weight loss (0.25 kg/wk)', calories(mildLoss), { raw: Math.round(mildLoss) }),
      card('loss', 'Weight loss (0.5 kg/wk)', calories(loss), { raw: Math.round(loss) }),
      card('gain', 'Weight gain (0.5 kg/wk)', calories(gain), { raw: Math.round(gain) }),
    ];

    const insights = [
      insight(
        `Your body burns about ${calories(bmr)} at complete rest. Everyday movement and exercise raise that to roughly ${calories(maintain)} a day.`,
      ),
      insight(
        'To lose weight, eat below the maintenance number; to gain, eat above it. About 7,700 kcal equals a kilogram, so a 550 kcal daily gap moves roughly half a kilogram a week.',
        'info',
      ),
      insight(
        'These are estimates from a formula, not a measurement. Track your real weight over two to three weeks and adjust the target up or down if it is not moving as expected.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('BMR formula', 'Mifflin-St Jeor'),
        assumption('Activity factor', `${ACTIVITY_FACTOR[activity.value as ActivityLevel]} (${ACTIVITY_LABEL[activity.value as ActivityLevel].split(' (')[0]})`),
      ],
      decisions: decisions([
        toolDecision('Check your BMI and healthy weight range', 'bmi-calculator'),
        toolDecision('Estimate body fat, which changes calorie needs', 'body-fat-calculator'),
        toolDecision('Track your weight to see if the target works', 'body-weight-tracker'),
      ]),
      nextQuestions: [
        'How many calories should I eat to lose weight?',
        'What is the difference between BMR and TDEE?',
        'How do I split calories into protein, carbs, and fat?',
      ],
      explanation:
        'TDEE is your Basal Metabolic Rate multiplied by an activity factor. BMR is the energy your body uses at complete rest, estimated here with the Mifflin-St Jeor equation from your sex, age, height, and weight. The activity factor, from 1.2 for sedentary up to 1.9 for extra active, scales that resting figure up to account for daily movement and exercise. The result is a solid starting estimate; your true expenditure can differ by a few hundred calories, so treat the number as a hypothesis to test against the scale.',
      meta: { bmr: Math.round(bmr), tdee: Math.round(maintain) },
    });
  },
};
