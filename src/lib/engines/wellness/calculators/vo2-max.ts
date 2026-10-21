// VO2 max from a twelve-minute Cooper distance, or from a resting pulse via Uth and Tanaka.
// The hero is Cooper when the distance is inside a twelve-minute human range. Uth is the hero
// only when that distance is absent. The two never share one unlabeled number.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { optionalNumberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { COOPER_MAX_KM, COOPER_MIN_KM, cooperVo2, distanceToKm, tanakaMaxHr, uthVo2 } from '../body';

const UNITS = ['km', 'mi'] as const;

function vo2Text(n: number): string {
  return `${n.toFixed(1)} ml/kg/min`;
}

/** The distance the formula used, to two decimals, without rounding 2.45 up to 2.5. */
function distanceLabel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/** Tanaka is 208 - 0.7 * age. Quote that figure, not a whole bpm the formula did not use. */
function hrLabel(hr: number): string {
  const rounded = Math.round(hr * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} bpm`;
}

export const vo2MaxCalculator: WellnessCalculator = {
  id: 'vo2-max',
  family: 'fitness-performance',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'unit',
      label: 'Distance unit',
      type: 'segmented',
      default: 'km',
      options: [
        { value: 'km', label: 'Kilometres' },
        { value: 'mi', label: 'Miles' },
      ],
    },
    {
      id: 'distance',
      label: 'Twelve-minute distance',
      type: 'number',
      default: 2.4,
      min: 0,
      step: 0.01,
      optional: true,
      help: 'How far you got in twelve minutes. Leave blank to use only the resting pulse.',
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      default: 0,
      min: 0,
      step: 1,
      optional: true,
      placeholder: '30',
      help: 'Years. Used only with a resting pulse. Leave blank to skip that estimate.',
    },
    {
      id: 'resting',
      label: 'Resting pulse',
      type: 'number',
      default: 0,
      min: 0,
      step: 1,
      optional: true,
      placeholder: '60',
      help: 'Beats per minute, at rest. Not a unit of distance.',
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'a distance unit', UNITS);
    if (!unit.ok) return unit.result;
    const distance = optionalNumberField(input, 'distance', 'distance', { min: 0, max: 20000 });
    if (!distance.ok) return distance.result;
    const age = optionalNumberField(input, 'age', 'age', { min: 0, max: 100 });
    if (!age.ok) return age.result;
    const resting = optionalNumberField(input, 'resting', 'resting pulse', { min: 0, max: 120 });
    if (!resting.ok) return resting.result;

    const isKm = unit.value === 'km';
    const hasDistance = distance.value > 0;
    const hasAge = age.value > 0;
    const hasRest = resting.value > 0;

    if (hasAge && age.value < 10) {
      return validationError('Age must be at least 10 years, or leave it blank.');
    }
    if (hasRest && resting.value < 30) {
      return validationError('Resting pulse must be at least 30 bpm, or leave it blank.');
    }

    let cooper: number | null = null;
    if (hasDistance) {
      const km = distanceToKm(unit.value, distance.value);
      if (km >= 100) {
        // 2400 in the km box is metres typed in the wrong unit.
        return validationError(
          isKm
            ? 'Distance is in kilometres. A twelve-minute Cooper test is often near 2.4 km, not a count of metres.'
            : 'Distance is in miles. A twelve-minute Cooper test is often near 1.5 miles, not a count of yards or metres.',
        );
      }
      if (km > COOPER_MAX_KM) {
        // Between 6 and 100 km is a pace problem, not a units one: it beats the world record.
        return validationError(
          isKm
            ? 'That distance is more than a world-record pace for twelve minutes. A Cooper test is often near 2.4 km.'
            : 'That distance is more than a world-record pace for twelve minutes. A Cooper test is often near 1.5 miles.',
        );
      }
      if (km < COOPER_MIN_KM) {
        return validationError(
          isKm
            ? 'Distance is in kilometres. A twelve-minute Cooper test is often near 2.4 km, so a small number like 0.5 is too short to read.'
            : 'Distance is in miles. A twelve-minute Cooper test is often near 1.5 miles, so a small number like 0.3 is too short to read.',
        );
      }
      cooper = cooperVo2(km * 1000);
    }

    let pulse: number | null = null;
    let hrMax: number | null = null;
    if (hasAge && hasRest) {
      hrMax = tanakaMaxHr(age.value);
      pulse = uthVo2(age.value, resting.value);
    }

    if (cooper === null && pulse === null) {
      return validationError('Enter a twelve-minute distance, or an age and a resting pulse.');
    }

    const heroIsCooper = cooper !== null;
    const heroValue = heroIsCooper ? cooper! : pulse!;
    const hero = card('vo2', 'VO2 max', vo2Text(heroValue), {
      raw: heroValue,
      emphasis: 'hero',
      note: heroIsCooper ? 'Cooper 12-minute test' : 'Uth resting pulse',
    });

    const metrics: ResultCard[] = [];
    if (heroIsCooper && pulse !== null) {
      metrics.push(card('other', 'Resting-pulse estimate', vo2Text(pulse), {
        raw: pulse,
        emphasis: 'primary',
        note: 'Uth, with Tanaka max heart rate',
      }));
    } else if (!heroIsCooper && pulse !== null) {
      metrics.push(card('hrmax', 'Estimated max heart rate', hrLabel(hrMax!), {
        raw: hrMax!,
        note: 'Tanaka: 208 minus 0.7 times age',
      }));
    }

    const unitWord = isKm ? 'km' : 'mi';
    const insights = [];
    if (cooper !== null) {
      insights.push(insight(
        `${distanceLabel(distance.value)} ${unitWord} in twelve minutes is a Cooper estimate of ${vo2Text(cooper)}.`,
      ));
    }
    if (pulse !== null) {
      insights.push(insight(
        `A resting pulse of ${resting.value} bpm at age ${age.value} is an Uth estimate of ${vo2Text(pulse)}, using a Tanaka maximum of ${hrLabel(hrMax!)}.`,
      ));
    }
    insights.push(insight(
      'These are field estimates. They do not replace a lab cart, and they do not compute fitness age.',
      'caution',
    ));

    const assumptions = [
      assumption('Distance unit', isKm ? 'kilometres' : 'miles'),
    ];
    if (cooper !== null) assumptions.push(assumption('Cooper', 'twelve-minute distance, 1968'));
    if (pulse !== null) assumptions.push(assumption('Resting pulse', 'Uth 2004 with Tanaka 2001'));

    return successResult({
      hero,
      metrics,
      insights,
      assumptions,
      decisions: decisions([
        toolDecision('Set heart-rate zones from age', 'heart-rate-zone-calculator'),
        toolDecision('Turn a race distance and time into pace', 'running-pace-calculator'),
      ]),
      nextQuestions: [
        'What is VO2 max?',
        'How does the Cooper test estimate VO2 max?',
        'Does this calculate fitness age?',
      ],
      explanation:
        'VO2 max is the rate the body uses oxygen at maximum effort, in millilitres per kilogram per minute. The Cooper test (JAMA, 1968) estimates it from a twelve-minute distance in metres: (distance minus 504.9) divided by 44.73. A distance typed in kilometres is converted to metres first. The resting-pulse estimate (Uth and others, European Journal of Applied Physiology, 2004) is 15.3 times maximum heart rate divided by resting heart rate. Maximum heart rate here is Tanaka\'s 208 minus 0.7 times age (Journal of the American College of Cardiology, 2001), not a measured maximum. When both estimates exist, Cooper stays the hero and the pulse estimate stays a separate card. The page does not compute fitness age.',
      meta: { cooper, pulse, hrMax },
    });
  },
};
