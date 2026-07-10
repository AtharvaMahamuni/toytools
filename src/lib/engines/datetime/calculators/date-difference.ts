// Date Difference Calculator. The exact duration between two dates as years + months + days, plus
// totals (months / weeks / days), the count of weekdays (business days), and the weekday each date
// falls on. Order-independent: if the end is before the start it measures the same span and says so.

import type { DateTimeTool } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  ageBetween, compareCivil, daysBetween, weekdaysBetween, weekdayOf, type CivilDate,
} from '../models';
import { agePhrase, formatCivil, integer, plural, weekdayName } from '../format';
import { dateField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';

export const dateDifferenceCalculator: DateTimeTool = {
  id: 'date-difference',
  family: 'duration',
  capabilities: { loadExample: true },
  fields: [
    { id: 'startDate', label: 'Start date', type: 'date', default: '' },
    { id: 'endDate', label: 'End date', type: 'date', default: '' },
  ],

  calculate(input, _opts) {
    const start = dateField(input, 'startDate', 'a start date');
    if (!start.ok) return start.result;
    const end = dateField(input, 'endDate', 'an end date');
    if (!end.ok) return end.result;

    // Measure the span regardless of order; remember whether the user entered them backwards.
    const reversed = compareCivil(start.value, end.value) > 0;
    const from: CivilDate = reversed ? end.value : start.value;
    const to: CivilDate = reversed ? start.value : end.value;

    const parts = ageBetween(from, to);
    const totalDays = daysBetween(from, to);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = parts.years * 12 + parts.months;
    const businessDays = weekdaysBetween(from, to);
    const weekendDays = totalDays - businessDays;

    const startDow = weekdayName(weekdayOf(start.value));
    const endDow = weekdayName(weekdayOf(end.value));

    const hero = card('duration', 'Duration', agePhrase(parts), {
      raw: totalDays,
      emphasis: 'hero',
      note: `${integer(totalDays)} days in total`,
    });

    const metrics: ResultCard[] = [
      card('total-days', 'Total days', integer(totalDays), { raw: totalDays, emphasis: 'primary' }),
      card('total-weeks', 'Total weeks', integer(totalWeeks), { raw: totalWeeks }),
      card('total-months', 'Total months', integer(totalMonths), { raw: totalMonths }),
      card('business-days', 'Weekdays', integer(businessDays), {
        raw: businessDays,
        note: `${integer(weekendDays)} weekend days`,
      }),
    ];

    const insights = [
      insight(`The start date is a ${startDow}; the end date is a ${endDow}.`),
      totalDays === 0
        ? insight('Both dates are the same day.', 'info')
        : insight(`That is ${plural(totalWeeks, 'week')} and ${plural(totalDays - totalWeeks * 7, 'day')}.`),
      reversed
        ? insight('The end date is before the start date, so this measures the span between them.', 'warning')
        : insight(`Excluding weekends, that is ${plural(businessDays, 'business day')}.`),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('At least a full week', totalDays >= 7),
        milestone('At least a full year', parts.years >= 1),
      ],
      decisions: decisions([
        toolDecision('Turn one of these dates into an age', 'age-calculator'),
        toolDecision('Convert a date to a Unix timestamp', 'unix-timestamp-converter'),
      ]),
      nextQuestions: [
        'How many working days are in this range?',
        'What is my exact age from a birth date?',
      ],
      explanation:
        `From ${formatCivil(from)} to ${formatCivil(to)} is exactly ${agePhrase(parts)}, or ${integer(totalDays)} `
        + `days. The years, months, and days account for leap years and each month's real length, and the `
        + `weekday counts step through the range one day at a time.`,
      assumptions: [],
      meta: {
        years: parts.years,
        months: parts.months,
        days: parts.days,
        totalDays,
        totalWeeks,
        totalMonths,
        businessDays,
        weekendDays,
        reversed,
      },
    });
  },
};
