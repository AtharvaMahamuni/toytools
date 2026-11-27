import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'age-calculator',
  name: 'Altersrechner',
  seoTitle: 'Altersrechner – Exaktes Alter in Jahren, Monaten & Tagen',
  description:
    'Berechne dein genaues Alter in Jahren, Monaten und Tagen ab deinem Geburtsdatum sowie gelebte Gesamttage und Countdown zum nächsten Geburtstag.',
  tagline: 'Genaues Alter in Jahren, Monaten und Tagen plus Geburtstags-Countdown.',
  craft: {
    solves:
      'Bei Geburtstagen am 29. Februar verschieben sich gesetzliche Altersgrenzen in Nicht-Schaltjahren je nach Rechtsordnung auf den 28. Februar oder 1. März.',
  },
  knowledge: {
    primaryConcepts: ['Altersberechnung', 'Geburtsdatum', 'chronologisches Alter'],
    realWorldUseCases: [
      'Exaktes Alter für Anträge, Fristen oder Altersgrenzen prüfen',
      'Gesamtanzahl gelebter Tage für ein Jubiläum herausfinden',
      'Alter an einem beliebigen vergangenen oder künftigen Stichtag berechnen',
    ],
    commonMistakes: [
      'Einfach Geburtsjahr vom aktuellen Jahr abziehen ohne Monat und Tag zu prüfen',
      'Mit pauschalen 30-Tage-Monaten statt realen Kalendermonaten rechnen',
      'Durchschnittliche 365,25 Tage annehmen statt echte Schaltjahre zu zählen',
    ],
  },
  fields: {
    birthDate: { label: 'Geburtsdatum' },
    asOf: { label: 'Alter am Stichtag', help: 'Leer lassen für heutiges Datum.' },
  },
  faqs: [
    {
      id: 'age-calculator-faq-1',
      question: 'Wie wird mein genaues Alter berechnet?',
      answer:
        'Es zählt die vollen Jahre und Kalendermonate vom Geburtsdatum bis zum Stichtag und addiert die verbleibenden Tage exakt nach tatsächlicher Monatslänge inklusive Schalttagen.',
    },
    {
      id: 'age-calculator-faq-2',
      question: 'Kann ich mein Alter für ein früheres oder künftiges Datum prüfen?',
      answer:
        'Ja. Trage ein beliebiges Datum im Feld „Alter am Stichtag“ ein oder lasse es für das heutige Datum leer.',
    },
    {
      id: 'age-calculator-faq-3',
      question: 'Wie geht der Rechner mit dem 29. Februar um?',
      answer:
        'In Jahren ohne Schalttag wird der Geburtstag gemäß gängiger ziviler Regelung am 28. Februar gezählt, einschließlich des Countdowns.',
    },
    {
      id: 'age-calculator-faq-4',
      question: 'Warum reicht aktuelles Jahr minus Geburtsjahr nicht aus?',
      answer:
        'Diese Differenz stimmt nur nach deinem diesjährigen Geburtstag; davor liegt sie um genau ein volles Jahr zu hoch.',
    },
  ],
  guide: {
    title: 'Genaues Alter berechnen: Jahre, Monate & Tage',
    description:
      'Kalendergenaue Altersberechnung verstehen, Sonderfall 29. Februar und Umrechnung in Monate, Wochen und Lebenstage.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Wähle ein Geburtsdatum zur Berechnung.',
    engine: {
      fieldBirthDate: 'Geburtsdatum',
      fieldAsOf: 'Stichtag',
      errBirthAfterRef: 'Das Geburtsdatum darf nicht nach dem Stichtag liegen.',
      heroLabel: 'Exaktes Alter',
      units: {
        year: ['Jahr', 'Jahre'],
        month: ['Monat', 'Monate'],
        day: ['Tag', 'Tage'],
      },
      months: [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
      ],
      weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      dateTpl: '{d}. {m} {y}',
      cardMonths: 'Volle Monate',
      cardWeeks: 'Wochen gesamt',
      cardDays: 'Tage gesamt',
      cardNextBday: 'Nächster Geburtstag',
      today: 'Heute!',
      inDaysTpl: 'in {days}',
      insightBornTpl: 'Geboren an einem {weekday}.',
      insightHappyBday: 'Alles Gute zum Geburtstag an diesem Datum!',
      insightNextBdayTpl: 'Dein nächster Geburtstag ist am {date} (in {days}).',
      ms18: 'Volljährig (18+)',
      msWithinMonth: 'Geburtstag innerhalb von 30 Tagen',
      decDateDiff: 'Abstand zwischen zwei beliebigen Daten zählen',
      decUnix: 'Datum in Unix-Timestamp umrechnen',
      nextQuestions: [
        'Wie viele Werktage liegen zwischen zwei bestimmten Terminen?',
        'Wie alt werde ich an einem künftigen Stichtag sein?',
        'Welcher Unix-Timestamp gehört zu meinem Geburtsdatum?',
      ],
      explanationTpl: 'Zwischen dem {birth} und dem {ref} liegen exakt {totalDays} Kalendertage.',
    },
  },
};
