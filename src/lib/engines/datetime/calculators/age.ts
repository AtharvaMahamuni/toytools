// Age Calculator. Exact age (years + months + days) from a birth date to a reference date ("today" by
// default), plus totals (months / weeks / days) and a countdown to the next birthday.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  ageBetween, compareCivil, daysBetween, nextBirthday, weekdayOf, type CivilDate,
} from '../models';
import { agePhrase, formatCivil, integer, plural, weekdayName } from '../format';
import { dateField, optionalDateField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';

/** Local "today" as a civil date (what the user means by today), used when no reference date is given. */
function todayCivil(): CivilDate {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export const ageCalculator: DateTimeTool = {
  id: 'age',
  family: 'age',
  capabilities: { loadExample: true },
  fields: [
    { id: 'birthDate', label: 'Date of birth', type: 'date', default: '' },
    { id: 'asOf', label: 'Age at date', type: 'date', default: '', optional: true,
      help: 'Leave blank to use today.' },
  ],

  calculate(input, _opts) {
    const birth = dateField(input, 'birthDate', 'a date of birth');
    if (!birth.ok) return birth.result;

    const asOf = optionalDateField(input, 'asOf', 'the "age at" date');
    if (!asOf.ok) return asOf.result;
    const ref = asOf.value ?? todayCivil();

    if (compareCivil(birth.value, ref) > 0) {
      return validationError('The date of birth is after the reference date. Check your dates.');
    }

    const age = ageBetween(birth.value, ref);
    const totalDays = daysBetween(birth.value, ref);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = age.years * 12 + age.months;
    const born = weekdayName(weekdayOf(birth.value));

    const upcoming = nextBirthday(birth.value, ref);
    const daysToBirthday = daysBetween(ref, upcoming);

    const hero = card('age', 'Age', plural(age.years, 'year'), {
      raw: age.years,
      emphasis: 'hero',
      note: `${plural(age.months, 'month')}, ${plural(age.days, 'day')}`,
    });

    const metrics: ResultCard[] = [
      card('total-months', 'In months', integer(totalMonths), { raw: totalMonths, emphasis: 'primary' }),
      card('total-weeks', 'In weeks', integer(totalWeeks), { raw: totalWeeks }),
      card('total-days', 'In days', integer(totalDays), { raw: totalDays }),
      card('next-birthday', 'Next birthday',
        daysToBirthday === 0 ? 'Today' : `in ${plural(daysToBirthday, 'day')}`,
        { raw: daysToBirthday }),
    ];

    const insights = [
      insight(`You were born on a ${born}.`),
      daysToBirthday === 0
        ? insight('Happy birthday!', 'positive')
        : insight(`Your next birthday is ${formatCivil(upcoming)}, ${plural(daysToBirthday, 'day')} away.`),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('At least 18 years old', age.years >= 18),
        milestone('Birthday within a month', daysToBirthday <= 31),
      ],
      decisions: decisions([
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
        toolDecision('Convert this date to a Unix timestamp', 'unix-timestamp-converter'),
      ]),
      nextQuestions: [
        'How many days are between two specific dates?',
        'What day of the week was I born on?',
      ],
      explanation:
        `This age is the exact number of whole calendar years, months, and days from ${formatCivil(birth.value)} `
        + `to ${formatCivil(ref)}, which is ${integer(totalDays)} days in total. `
        + `Months and days account for leap years and each month's real length.`,
      assumptions: [],
      meta: {
        years: age.years,
        months: age.months,
        days: age.days,
        totalDays,
        totalMonths,
        totalWeeks,
        daysToBirthday,
      },
    });
  },
};
