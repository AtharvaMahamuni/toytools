import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'tdee-calculator',
  name: 'TDEE-Rechner',
  seoTitle: 'TDEE-Rechner Online – Kalorienbedarf Berechnen',
  description:
    'Berechne deinen täglichen Gesamtumsatz (TDEE) sowie Kalorienziele zum Abnehmen, Halten oder Zunehmen nach Mifflin-St Jeor direkt im Browser.',
  tagline: 'Dein täglicher Energiebedarf zum Halten, Abnehmen oder Aufbauen.',
  craft: {
    solves:
      'Das Aktivitätslevel wird am häufigsten zu hoch angesetzt; schon eine Stufe zu viel bläht das Tagesziel um mehrere Hundert Kalorien auf.',
  },
  knowledge: {
    primaryConcepts: ['Gesamtenergieumsatz (TDEE)', 'Grundumsatz (BMR)'],
    realWorldUseCases: [
      'Tägliches Kalorienziel für Diät oder Aufbau festlegen',
      'Anteil der Alltagsbewegung am Gesamtverbrauch erkennen',
      'Kalorienangaben aus Fitness-Apps kritisch überprüfen',
    ],
    commonMistakes: [
      'Aktivitätsfaktor überschätzen und dadurch zu hoch ansetzen',
      'Schätzwert als exakt ansehen statt nach Gewichtstrend anzupassen',
      'Kalorien für schnelleren Verlust unter den Grundumsatz senken',
    ],
  },
  fields: {
    unit: { label: 'Einheiten', options: { metric: 'Metrisch (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Geschlecht', options: { male: 'Männlich', female: 'Weiblich' } },
    age: { label: 'Alter', suffix: 'Jahre' },
    weight: { label: 'Gewicht', help: 'In Kilogramm (bzw. Pfund).' },
    height: { label: 'Größe', help: 'In Zentimetern (bzw. Zoll).' },
    activity: {
      label: 'Aktivitätslevel',
      options: {
        sedentary: 'Sitzend (Büro, kaum Sport)',
        light: 'Leicht aktiv (1–3 Einheiten/Woche)',
        moderate: 'Moderat aktiv (3–5 Einheiten/Woche)',
        active: 'Sehr aktiv (6–7 Einheiten/Woche)',
        'very-active': 'Extrem aktiv (tägliches hartes Training oder körperlicher Beruf)',
      },
    },
  },
  faqs: [
    {
      id: 'tdee-calculator-faq-1',
      question: 'Was ist der Unterschied zwischen BMR und TDEE?',
      answer:
        'BMR ist der Grundumsatz in völliger Ruhe für Atmung und Organe. TDEE (Total Daily Energy Expenditure) addiert Bewegung, Arbeit, Verdauung und Sport und bestimmt deinen realen Tagesbedarf.',
    },
    {
      id: 'tdee-calculator-faq-2',
      question: 'Wie viele Kalorien sollte ich zum Abnehmen essen?',
      answer:
        'Bleibe unter deinem Erhaltungswert (TDEE). Etwa 500–550 kcal tägliches Defizit entsprechen rund 0,5 kg pro Woche. Unterschreite deinen BMR nicht ohne ärztlichen Rat.',
    },
    {
      id: 'tdee-calculator-faq-3',
      question: 'Welches Aktivitätslevel soll ich wählen?',
      answer:
        'Im Zweifel eine Stufe niedriger wählen. Sitzend passt für Büroarbeit ohne regelmäßigen Sport; leicht entspricht 1–3, moderat 3–5 und aktiv 6–7 Workouts pro Woche.',
    },
    {
      id: 'tdee-calculator-faq-4',
      question: 'Wie genau ist ein TDEE-Rechner?',
      answer:
        'Mifflin-St Jeor gilt als sehr praxistauglich, bleibt jedoch eine Schätzung ohne Kenntnis deiner Muskelmasse. Prüfe den Trend auf der Waage über 2–3 Wochen und justiere bei Bedarf nach.',
    },
    {
      id: 'tdee-calculator-faq-5',
      question: 'Warum verändert sich mein Gewicht bei diesem Kalorienziel nicht?',
      answer:
        'Meist liegt das reale Aktivitätsniveau etwas niedriger oder Portionen sind größer als geschätzt. Wenn sich nach 2–3 Wochen nichts tut, senke die Zufuhr um rund 150–200 kcal.',
    },
    {
      id: 'tdee-calculator-faq-6',
      question: 'Bleiben meine Eingaben privat?',
      answer:
        'Ja. Alle Berechnungen erfolgen komplett lokal im Browser ohne Datenübertragung an Server.',
    },
  ],
  guide: {
    title: 'TDEE berechnen: Gesamtumsatz & Kalorienziel',
    description:
      'Unterschied zwischen Grundumsatz (BMR) und TDEE, Mifflin-St-Jeor-Formel und sichere Defizite zum Abnehmen oder Aufbauen.',
    readMinutes: 6,
  },
  ui: {
    emptyText: 'Gib Alter, Gewicht, Größe und Aktivitätslevel ein.',
    engine: {
      fieldUnit: 'Einheiten',
      fieldSex: 'Geschlecht',
      fieldActivity: 'Aktivität',
      fieldAge: 'Alter',
      fieldWeight: 'Gewicht',
      fieldHeight: 'Größe',
      errWeightZero: 'Das Gewicht muss größer als null sein.',
      errHeightZero: 'Die Größe muss größer als null sein.',
      heroLabel: 'Gesamtumsatz pro Tag (TDEE)',
      heroNote: 'Geschätzte Erhaltungskalorien pro Tag',
      cardBmr: 'Grundumsatz (BMR)',
      cardMildLoss: 'Sanft abnehmen (-250 kcal)',
      cardLoss: 'Abnehmen (-500 kcal)',
      cardGain: 'Zunehmen (+300 kcal)',
      insightRestingTpl: 'In völliger Ruhe verbrennst du rund {bmr}; Bewegung erhöht das auf {maintain} pro Tag.',
      insightGoal: 'Ein Defizit von 500 kcal täglich entspricht ca. 0,45 kg pro Woche bei Sicherung des BMR.',
      insightCaveat: 'Schätzung nach Mifflin-St Jeor: Nach 2–3 Wochen anhand des Gewichtstrends prüfen.',
      actShort: {
        sedentary: 'Sitzend',
        light: 'Leicht',
        moderate: 'Moderat',
        active: 'Aktiv',
        'very-active': 'Extrem aktiv',
      },
      vizRest: 'Ruhe (BMR)',
      vizActivity: 'Aktivität',
      vizTitle: 'Aufteilung des Tagesbedarfs',
      vizDescTpl: 'Der Grundumsatz beträgt {pct} % deines Erhaltungsumsatzes von {maintain}.',
      assumpUnitsTerm: 'Einheiten',
      assumpMetric: 'Metrisch (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Formel',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpActivityTerm: 'Aktivitätsfaktor',
      decBmi: 'BMI-Bereich zur Körpergröße einordnen',
      decBodyFat: 'Körperfettanteil zusätzlich abschätzen',
      decWeight: 'Gewichtstrend über mehrere Wochen verfolgen',
      nextQuestions: [
        'Wie teile ich diese Kalorien in Eiweiß, Kohlenhydrate und Fette auf?',
        'Wie entwickelt sich mein Wochendurchschnitt nach 14 Tagen mit diesem Ziel?',
        'Wie verändert sich der Bedarf bei einer niedrigeren Aktivitätsstufe?',
      ],
      explanation:
        'Zuerst schätzt die Mifflin-St-Jeor-Formel deinen Grundumsatz (BMR) aus Geschlecht, Alter, Gewicht und Größe. Anschließend multipliziert der Aktivitätsfaktor (1,2 bis 1,9) Bewegung und Sport hinzu.',
    },
  },
};
