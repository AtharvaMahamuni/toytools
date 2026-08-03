// Running pace calculator: pace, speed, and the race times that pace predicts. Splitting distance
// and time into what a runner actually reads off a watch (hours, minutes, seconds) matters more
// here than field count, because the input IS a stopwatch reading.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  paceSecPerKm,
  formatPace,
  formatDuration,
  riegelPredict,
  RACE_DISTANCES,
  RIEGEL_EXPONENT,
  miToKm,
  kmToMi,
  KM_PER_MI,
} from '../models';
import { num1 } from '../format';
import { numberField, optionalNumberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { partsSpec } from '@lib/visualization/types';

const UNITS = ['km', 'mi'] as const;

export const runningPaceCalculator: WellnessCalculator = {
  id: 'running-pace',
  family: 'fitness-performance',
  capabilities: { loadExample: true, visualization: true },
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
    { id: 'distance', label: 'Distance', type: 'number', default: 5, min: 0, step: 0.01, help: 'How far you ran, in the unit above.' },
    // hours and seconds are optional: SmartInput renders a numeric field defaulting to 0 as BLANK,
    // and the widget will not compute while a REQUIRED field is blank. A 25 minute 5K is entered as
    // one number, which is how a watch reads it, so demanding all three would be hostile.
    { id: 'hours', label: 'Hours', type: 'number', default: 0, min: 0, step: 1, optional: true },
    { id: 'minutes', label: 'Minutes', type: 'number', default: 25, min: 0, step: 1 },
    { id: 'seconds', label: 'Seconds', type: 'number', default: 0, min: 0, step: 1, optional: true },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'a distance unit', UNITS);
    if (!unit.ok) return unit.result;

    const d = numberField(input, 'distance', 'the distance', { min: 0, max: 1000 });
    if (!d.ok) return d.result;
    const hh = optionalNumberField(input, 'hours', 'hours', { min: 0, max: 99 });
    if (!hh.ok) return hh.result;
    const mm = optionalNumberField(input, 'minutes', 'minutes', { min: 0, max: 59 });
    if (!mm.ok) return mm.result;
    const ss = optionalNumberField(input, 'seconds', 'seconds', { min: 0, max: 59 });
    if (!ss.ok) return ss.result;

    if (d.value <= 0) return validationError('Enter a distance above zero to work out a pace.');
    const totalSeconds = hh.value * 3600 + mm.value * 60 + ss.value;
    if (totalSeconds <= 0) return validationError('Enter the time you took, in hours, minutes, and seconds.');

    const isKm = unit.value === 'km';
    const distanceKm = isKm ? d.value : miToKm(d.value);

    const perKm = paceSecPerKm(distanceKm, totalSeconds);
    const perMi = perKm * KM_PER_MI;
    const kmh = distanceKm / (totalSeconds / 3600);
    const mph = kmToMi(kmh);

    const heroPace = isKm ? perKm : perMi;
    const hero = card('pace', 'Pace', `${formatPace(heroPace)} /${unit.value}`, {
      raw: Math.round(heroPace),
      emphasis: 'hero',
      note: `${num1(d.value)} ${unit.value} in ${formatDuration(totalSeconds)}`,
    });

    const metrics: ResultCard[] = [
      card('other-pace', isKm ? 'Pace per mile' : 'Pace per kilometre', `${formatPace(isKm ? perMi : perKm)} /${isKm ? 'mi' : 'km'}`, {
        raw: Math.round(isKm ? perMi : perKm),
        emphasis: 'primary',
      }),
      card('kmh', 'Speed', `${num1(kmh)} km/h`, { raw: Number(kmh.toFixed(1)) }),
      card('mph', 'Speed', `${num1(mph)} mph`, { raw: Number(mph.toFixed(1)) }),
      // Riegel predictions. This is the part a runner comes back for: what does today's tempo run
      // say about the race in six weeks.
      ...RACE_DISTANCES.map((race) =>
        card(race.id, `Predicted ${race.label}`, formatDuration(riegelPredict(totalSeconds, distanceKm, race.km)), {
          raw: Math.round(riegelPredict(totalSeconds, distanceKm, race.km)),
        }),
      ),
    ];

    const marathonSec = riegelPredict(totalSeconds, distanceKm, 42.195);
    const insights = [
      insight(
        `Covering ${num1(d.value)} ${unit.value} in ${formatDuration(totalSeconds)} is ${formatPace(perKm)} per kilometre, or ${formatPace(perMi)} per mile, at ${num1(kmh)} km/h.`,
      ),
      insight(
        `Riegel's model puts a marathon at about ${formatDuration(marathonSec)} off this effort. The predictions assume you train for the distance: they describe potential, not what would happen if you started one tomorrow.`,
        'info',
      ),
      insight(
        `The model raises time by distance to the power of ${RIEGEL_EXPONENT}, which is why the predicted pace slows as the race gets longer. It is most trustworthy within about a factor of three of the distance you ran, so a 5K predicts a 10K far better than it predicts a marathon.`,
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      // Predicted times side by side. The point of the picture is the shape: the marathon is not
      // eight times the 5K, it is more, and by a visible amount.
      visualization: partsSpec(
        RACE_DISTANCES.map((race) => ({
          id: race.id,
          label: race.label,
          value: Math.round(riegelPredict(totalSeconds, distanceKm, race.km) / 60),
          display: formatDuration(riegelPredict(totalSeconds, distanceKm, race.km)),
        })),
        {
          kind: 'bars',
          title: 'Predicted race times, in minutes',
          description: `From ${num1(d.value)} ${unit.value} in ${formatDuration(totalSeconds)}, using Riegel's endurance model.`,
        },
      ),
      insights,
      assumptions: [
        assumption('Distance unit', isKm ? 'kilometres' : 'miles'),
        assumption('Prediction model', `Riegel, exponent ${RIEGEL_EXPONENT}`),
        assumption('Terrain', 'flat, and even effort throughout'),
      ],
      decisions: decisions([
        toolDecision('Set the heart-rate zones to train these paces in', 'heart-rate-zone-calculator'),
        toolDecision('Check the calories that training burns', 'tdee-calculator'),
        toolDecision('Log how much you moved today', 'move-today-tracker'),
      ]),
      nextQuestions: [
        'How do I calculate running pace?',
        'What is a good 5K pace?',
        'Can a 5K time predict my marathon time?',
      ],
      explanation:
        'Pace is time divided by distance, read as minutes and seconds per kilometre or per mile, and speed is the same relationship the other way up. The race predictions use Riegel\'s formula, which multiplies your time by the ratio of the distances raised to the power 1.06. The exponent is the whole idea: if running were purely a matter of holding one speed, it would be 1, and doubling the distance would double the time. It is slightly above 1 because pace decays as a race gets longer, so the model predicts a marathon at a slower pace per kilometre than a 5K. It assumes flat ground, even pacing, and that you have actually trained for the distance, which is why it flatters anyone extrapolating from a short race a long way out.',
      meta: { paceSecPerKm: Math.round(perKm), kmh: Number(kmh.toFixed(2)) },
    });
  },
};
