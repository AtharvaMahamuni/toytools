import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'bmi-calculator',
  name: 'BMI-Rechner',
  seoTitle: 'BMI-Rechner Online – Body-Mass-Index Berechnen',
  description:
    'Berechnen Sie Ihren Body-Mass-Index (BMI) aus Größe und Gewicht metrisch oder imperial samt WHO-Kategorie und gesundem Gewichtsbereich.',
  tagline: 'Ihr BMI aus Körpergröße und Gewicht inklusive gesundem Gewichtsbereich.',
  methodology: {
    name: 'WHO-BMI-Klassifikation',
    detail:
      'Körpergewicht in Kilogramm geteilt durch die Körpergröße in Metern zum Quadrat, eingeteilt nach den Erwachsenen-Grenzwerten der Weltgesundheitsorganisation (18,5, 25 und 30).',
  },
  knowledge: {
    primaryConcepts: ['body-mass-index', 'gesunder gewichtsbereich'],
    realWorldUseCases: [
      'Eigenes Gewicht anhand des gesunden Bereichs einordnen, bevor Sie ein Ziel festlegen.',
      'Einen beim Arzt oder in Formularen genannten BMI-Wert besser verstehen.',
      'Ablesen, wie viele Kilogramm oder Pfund bis zum Normalgewichtsbereich liegen.',
    ],
    commonMistakes: [
      'Den BMI als medizinische Diagnose statt als groben Richtwert auf Bevölkerungsebene deuten.',
      'Einheiten mischen, etwa Gewicht in Pfund bei einer Körpergröße in Zentimetern.',
      'Erwachsenen-Grenzwerte auf Kinder, Jugendliche oder stark muskulöse Sportler übertragen.',
    ],
  },
  faqs: [
    {
      id: 'bmi-calculator-faq-1',
      question: 'Was ist ein gesunder BMI-Bereich?',
      answer:
        'Für Erwachsene liegt der Normalbereich laut Weltgesundheitsorganisation (WHO) zwischen 18,5 und 24,9. Unter 18,5 gilt als Untergewicht, 25 bis 29,9 als Übergewicht und ab 30 als Adipositas. Der Rechner zeigt Ihren Wert, die passende Stufe und den konkreten Gewichtsbereich für Ihre Körpergröße.',
    },
    {
      id: 'bmi-calculator-faq-2',
      question: 'Wie wird der BMI berechnet?',
      answer:
        'Der BMI ist das Gewicht in Kilogramm geteilt durch das Quadrat der Körpergröße in Metern. Bei 70 kg und 1,75 m lautet die Rechnung 70 / (1,75 × 1,75) = 22,9. Bei imperialen Angaben rechnet das Tool Pfund und Zoll zunächst intern um.',
    },
    {
      id: 'bmi-calculator-faq-3',
      question: 'Ist der BMI für muskulöse oder sportliche Menschen genau?',
      answer:
        'Nicht immer. Da der BMI nur Größe und Gewicht kennt, kann er Muskelmasse nicht von Fettgewebe unterscheiden. Ein sehr muskulöser Athlet kann rechnerisch im Übergewicht landen, während ältere Menschen mit wenig Muskelmasse trotz höherem Fettanteil unauffällig wirken. Ergänzen Sie ihn bei Bedarf durch den Körperfettanteil.',
    },
    {
      id: 'bmi-calculator-faq-4',
      question: 'Wie berechne ich den BMI in Pfund und Zoll?',
      answer:
        'Schalten Sie oben auf das imperiale System um und geben Sie Ihr Gewicht in Pfund (lb) und die Gesamtkörpergröße in Zoll (in) ein. Bereits eingegebene Werte werden automatisch umgerechnet, und es gelten dieselben WHO-Bereiche.',
    },
    {
      id: 'bmi-calculator-faq-5',
      question: 'Funktioniert dieser BMI-Rechner auch für Kinder?',
      answer:
        'Nein. Die festen Grenzwerte für Erwachsene gelten nicht unter 18 Jahren. Bei Kindern und Jugendlichen werden alters- und geschlechtsspezifische BMI-Perzentilkurven herangezogen, da sich die Körperzusammensetzung im Wachstum verändert.',
    },
    {
      id: 'bmi-calculator-faq-6',
      question: 'Bleiben meine Eingaben privat?',
      answer:
        'Ja. Alle Berechnungen laufen vollständig lokal in Ihrem Browser. Weder Größe noch Gewicht werden an einen Server gesendet oder gespeichert; lediglich Ihre gewählte Einheit bleibt lokal im Browser gemerkt.',
    },
  ],
  guide: {
    title: 'BMI berechnen und richtig einordnen',
    description:
      'Die BMI-Formel, WHO-Kategorien, der gesunde Gewichtsbereich für Ihre Größe und die Grenzen des Body-Mass-Index verständlich erklärt.',
    readMinutes: 5,
  },
  fields: {
    unit: {
      label: 'Einheitensystem',
      options: { metric: 'Metrisch (kg, cm)', imperial: 'Imperial (lb, in)' },
    },
    weight: {
      label: 'Gewicht',
      help: 'Aktuelles Körpergewicht eingeben.',
    },
    height: {
      label: 'Größe',
      help: 'Körpergröße in Zentimetern oder Gesamtzoll eingeben.',
    },
  },
  ui: {
    emptyText: 'Gewicht und Größe eingeben, um den BMI zu berechnen.',
    engine: {
      fieldUnit: 'Ihr Einheitensystem',
      fieldWeight: 'Ihr Gewicht',
      fieldHeight: 'Ihre Größe',
      errWeightZero: 'Geben Sie ein Gewicht über null ein, um Ihren BMI zu berechnen.',
      errHeightZero: 'Geben Sie eine Größe über null ein, um Ihren BMI zu berechnen.',
      heroLabel: 'Body-Mass-Index',
      categoryLabel: 'Kategorie',
      healthyRangeLabel: 'Gesundes Gewicht für Ihre Größe',
      weightToLoseLabel: 'Abnahme bis zum Normalbereich',
      weightToGainLabel: 'Zunahme bis zum Normalbereich',
      insightNormal: 'Ein BMI von {bmi} liegt im gesunden Bereich (18,5 bis 24,9) für Erwachsene.',
      insightOther: 'Ein BMI von {bmi} fällt in die Kategorie „{label}“. Der gesunde Bereich für Ihre Größe beträgt {range}.',
      insightCaveat:
        'Der BMI ist ein schneller Richtwert und keine Diagnose. Er unterscheidet nicht zwischen Muskel- und Fettmasse; betrachten Sie ihn daher im Gesamtkontext.',
      cats: {
        underweight: 'Untergewicht',
        normal: 'Normalgewicht',
        overweight: 'Übergewicht',
        obese: 'Adipositas',
      },
      bands: {
        underweight: 'Untergewicht',
        normal: 'Normal',
        overweight: 'Übergewicht',
        obese: 'Adipositas',
      },
      vizTitle: 'Ihr BMI von {bmi} auf der WHO-Erwachsenenskala',
      vizDesc: 'Gesunder Gewichtsbereich für Ihre Größe: {range}.',
      milestoneHealthy: 'Gewicht liegt im gesunden BMI-Bereich',
      assumpUnitsTerm: 'Einheiten',
      assumpMetric: 'metrisch (kg, cm)',
      assumpImperial: 'imperial (lb, in)',
      assumpFormulaTerm: 'Formel',
      assumpFormulaVal: 'Gewicht (kg) / Größe (m)²',
      assumpCatsTerm: 'Kategorien',
      assumpCatsVal: 'WHO-Bereiche für Erwachsene (18,5 / 25 / 30)',
      decTdee: 'Täglichen Kalorienbedarf abschätzen',
      decBodyFat: 'Körperfettanteil berechnen, den der BMI nicht erfasst',
      decWeight: 'Gewichtsverlauf im Zeitverlauf verfolgen',
      nextQuestions: [
        'Wie viele Kalorien verbrenne ich pro Tag?',
        'Wie hoch ist mein Körperfettanteil?',
        'Wie genau ist der BMI bei Sportlern?',
      ],
      explanation:
        'Der BMI teilt das Körpergewicht in Kilogramm durch das Quadrat der Körpergröße in Metern und vergleicht den Wert mit den festen WHO-Bereichen für Erwachsene. Da ausschließlich Größe und Gewicht eingehen, kann er Muskelmasse nicht von Fett trennen und dient nur als erste Orientierung.',
    },
  },
};
