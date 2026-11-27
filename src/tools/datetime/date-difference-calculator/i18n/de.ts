import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'date-difference-calculator',
  name: 'Datumsdifferenz-Rechner',
  seoTitle: 'Datumsdifferenz Online – Tage & Werktage Berechnen',
  description:
    'Berechne den genauen Zeitraum zwischen zwei Daten in Jahren, Monaten, Tagen, vollen Wochen sowie Werktagen (Mo–Fr) direkt im Browser.',
  tagline: 'Exakte Zeitspanne zwischen zwei Daten inklusive Werktage.',
  craft: {
    solves:
      'Verwechslungen zwischen Kalenderdauer und inklusiven Werktagen führen oft zu um einen Tag verschobenen Reisebuchungen oder Projektfristen.',
  },
  knowledge: {
    primaryConcepts: ['Datumsdifferenz', 'Tage zwischen zwei Daten', 'Zeitspanne'],
    realWorldUseCases: [
      'Verbleibende Tage bis zu einer Deadline oder Veranstaltung zählen',
      'Projektdauer in Wochen und Arbeitstagen (Mo–Fr) ermitteln',
      'Genauen Abstand zu einem vergangenen Termin bestimmen',
    ],
    commonMistakes: [
      'Jeden Monat pauschal mit 30 Tagen ansetzen statt echte Kalendermonate zu prüfen',
      'Kalendertage zählen, wenn eigentlich Arbeitstage ohne Wochenende gemeint sind',
      'Annehmen, dass die Reihenfolge von Start- und Enddatum die Spanne verändert',
    ],
  },
  fields: {
    startDate: { label: 'Startdatum' },
    endDate: { label: 'Enddatum' },
  },
  faqs: [
    {
      id: 'date-difference-calculator-faq-1',
      question: 'Wie viele Tage liegen zwischen zwei Daten?',
      answer:
        'Gib Start- und Enddatum ein, um die exakte Anzahl ganzer Kalendertage sowie volle Wochen und Jahre/Monate/Tage unter Berücksichtigung realer Monatslängen und Schaltjahre zu sehen.',
    },
    {
      id: 'date-difference-calculator-faq-2',
      question: 'Wie viele Werktage liegen zwischen zwei Terminen?',
      answer:
        'Ausgewiesen werden alle Montage bis Freitage innerhalb der Spanne ohne Wochenenden. Regionale Feiertage werden nicht abgezogen.',
    },
    {
      id: 'date-difference-calculator-faq-3',
      question: 'Wie viele Wochen und Monate entspricht das?',
      answer:
        'Volle Wochen zeigen komplette 7-Tage-Blöcke; die Aufschlüsselung in Jahre, Monate und Tage nutzt echte Monatsübergänge ab dem Startdatum.',
    },
    {
      id: 'date-difference-calculator-faq-4',
      question: 'Spielt die Reihenfolge der beiden Daten eine Rolle?',
      answer:
        'Nein. Der Abstand wird in jedem Fall als positive Dauer berechnet, mit einem Hinweis, falls das Enddatum vor dem Startdatum liegt.',
    },
  ],
  guide: {
    title: 'Tage und Werktage zwischen zwei Daten exakt zählen',
    description:
      'Echte Kalendermonate vs. Gesamttage, volle Wochen und Werktagszählung (Mo–Fr) richtig anwenden.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Wähle Start- und Enddatum zur Berechnung der Zeitspanne.',
    engine: {
      fieldStartDate: 'Startdatum',
      fieldEndDate: 'Enddatum',
      heroLabel: 'Zeitraum zwischen Daten',
      listSep: ', ',
      units: {
        year: ['Jahr', 'Jahre'],
        month: ['Monat', 'Monate'],
        day: ['Tag', 'Tage'],
        week: ['Woche', 'Wochen'],
        'business day': ['Werktag', 'Werktage'],
      },
      months: [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
      ],
      weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      dateTpl: '{d}. {m} {y}',
      totalDaysNoteTpl: '{n} insgesamt',
      cardTotalDays: 'Gesamttage',
      cardTotalWeeks: 'Volle Wochen',
      cardTotalMonths: 'Volle Monate',
      cardWeekdays: 'Werktage (Mo–Fr)',
      weekendNoteTpl: '{n} Wochenendtage',
      insightDowTpl: 'Das Startdatum ist ein {start}, das Enddatum ein {end}.',
      insightSameDay: 'Start- und Enddatum fallen auf denselben Tag.',
      insightWeeksDaysTpl: 'Entspricht {weeks} und {days}.',
      insightReversed: 'Enddatum liegt vor dem Startdatum; positive Dauer wird angezeigt.',
      insightBusinessTpl: 'Ohne Wochenenden sind das {days}.',
      msWeek: 'Mindestens 1 volle Woche',
      msYear: 'Mindestens 1 volles Jahr',
      decAge: 'Alter exakt ab Geburtsdatum berechnen',
      decUnix: 'Datum in Unix-Timestamp umwandeln',
      nextQuestions: [
        'Welche gesetzlichen Feiertage fallen in diesen Zeitraum?',
        'Wie viele Stunden oder Sekunden umfasst diese Spanne?',
        'Welches genaue Alter entspricht diesem Intervall?',
      ],
      explanationTpl: 'Vom {from} bis {to} beträgt der Zeitraum {phrase} ({totalDays} Tage insgesamt).',
    },
  },
};
