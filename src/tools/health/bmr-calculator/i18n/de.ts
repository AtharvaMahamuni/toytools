import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'bmr-calculator',
  name: 'Grundumsatz-Rechner (BMR)',
  seoTitle: 'BMR-Rechner Online – Grundumsatz nach Mifflin-St Jeor',
  description:
    'Berechne deinen Grundumsatz (BMR) exakt mit der Mifflin-St-Jeor-Formel im Browser und sieh, wie viel jedes Aktivitätslevel täglich hinzufügt.',
  tagline: 'Dein Grundumsatz in Ruhe plus Aufschlag je Aktivitätsstufe.',
  craft: {
    solves:
      'Ein Ruheumsatz unter 1.400 kcal wirkt oft wie ein kaputter Stoffwechsel; pro Kilogramm Körpergewicht betrachtet ist derselbe Wert völlig normal.',
  },
  knowledge: {
    primaryConcepts: ['Grundumsatz (BMR)', 'Ruheenergieumsatz (RMR)'],
    realWorldUseCases: [
      'Den reinen Ruheverbrauch vor Anwendung von Aktivitätsfaktoren ermitteln',
      'Eine gesunde Untergrenze für eine Kalorienreduktion festlegen',
      'Anteil von Grundumsatz und Alltagsaktivität am Tagesbedarf vergleichen',
    ],
    commonMistakes: [
      'Nur in Höhe des Grundumsatzes essen statt nach Gesamtumsatz planen',
      'Erwarten, dass die Formel Muskelmasse allein aus Gewicht und Größe erkennt',
      'Einen kleineren BMR bei zierlicher Statur als langsamen Stoffwechsel missdeuten',
    ],
  },
  fields: {
    unit: { label: 'Einheiten', options: { metric: 'Metrisch (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Geschlecht', options: { male: 'Männlich', female: 'Weiblich' } },
    age: { label: 'Alter', suffix: 'Jahre' },
    weight: { label: 'Gewicht', help: 'In Kilogramm (bzw. Pfund).' },
    height: { label: 'Größe', help: 'In Zentimetern (bzw. Zoll).' },
  },
  faqs: [
    {
      id: 'bmr-calculator-faq-1',
      question: 'Was ist ein normaler BMR-Wert?',
      answer:
        'Es gibt keinen pauschalen Normwert, da der BMR mit der Körpergröße skaliert. Ein 30-jähriger Mann mit 175 cm und 70 kg liegt bei ~1.650 kcal, eine gleichaltrige Frau mit 165 cm und 60 kg bei ~1.320 kcal.',
    },
    {
      id: 'bmr-calculator-faq-2',
      question: 'Worin unterscheiden sich BMR und TDEE?',
      answer:
        'Der BMR deckt Atmung, Kreislauf und Organe bei völliger Ruhe ab. Der TDEE addiert Bewegung, Verdauung und Sport (meist Faktor 1,2 bis 1,9) und bestimmt deine echte Erhaltungsmenge.',
    },
    {
      id: 'bmr-calculator-faq-3',
      question: 'Sollte ich zum Abnehmen genau meinen BMR essen?',
      answer:
        'Nein. Wer nur seinen Grundumsatz isst, berücksichtigt keinerlei Bewegung und erzeugt meist ein viel zu hartes Defizit. Plane das Defizit ausgehend vom TDEE.',
    },
    {
      id: 'bmr-calculator-faq-4',
      question: 'Warum Mifflin-St Jeor statt Harris-Benedict?',
      answer:
        'Harris-Benedict entstand 1919 und überschätzt den Ruheumsatz moderner Körper häufig um ca. 5 %. Mifflin-St Jeor (1990) bildet Erwachsene im Durchschnitt präziser ab.',
    },
    {
      id: 'bmr-calculator-faq-5',
      question: 'Erhöht mehr Muskelmasse den Grundumsatz?',
      answer:
        'Ja, aber moderater als oft behauptet: 1 kg Muskulatur verbrennt in Ruhe rund 13 kcal pro Tag gegenüber ~4,5 kcal bei Fettgewebe. Die Formel berücksichtigt jedoch nur Gewicht, Größe, Alter und Geschlecht.',
    },
    {
      id: 'bmr-calculator-faq-6',
      question: 'Ist BMR dasselbe wie RMR?',
      answer:
        'Sehr ähnlich, aber nicht identisch: BMR wird unter strenger Nüchternheit im Labor gemessen, RMR unter etwas lockereren Bedingungen und fällt meist rund 10 % höher aus.',
    },
  ],
  guide: {
    title: 'Was dein Grundumsatz (BMR) wirklich aussagt',
    description:
      'Mifflin-St-Jeor-Gleichung im Detail, warum BMR kein Diätziel ist und wie BMR, RMR und TDEE zusammenhängen.',
    readMinutes: 5,
  },
  ui: {
    emptyText: 'Gib Geschlecht, Alter, Gewicht und Größe ein.',
    engine: {
      fieldUnit: 'Einheiten',
      fieldSex: 'Geschlecht',
      fieldAge: 'Alter',
      fieldWeight: 'Gewicht',
      fieldHeight: 'Größe',
      errWeightZero: 'Das Gewicht muss größer als null sein.',
      errHeightZero: 'Die Größe muss größer als null sein.',
      errBmrNonPos: 'Ungültige Maße: Ergebnis wäre nicht positiv.',
      heroLabel: 'Grundumsatz pro Tag (BMR)',
      heroNote: 'Ruheverbrauch (nicht dein tägliches Essensziel)',
      cardPerHour: 'Pro Stunde in Ruhe',
      levels: {
        sedentary: 'Sitzend (×1,2)',
        light: 'Leicht aktiv (×1,375)',
        moderate: 'Moderat aktiv (×1,55)',
        active: 'Aktiv (×1,725)',
        'very-active': 'Sehr aktiv (×1,9)',
      },
      insightRestingTpl: 'Selbst in völliger Ruhe verbraucht dein Körper rund {bmr} pro Tag, etwa {perHour} kcal jede Stunde.',
      insightNotEatTpl: 'Der BMR ist kein Essensziel: Schon ein ruhiger Sitztag kostet etwa {sedentary}. Auf BMR-Niveau entsteht ein starkes Defizit.',
      insightDrivers: 'Körpergewicht, Größe und Lebensalter bestimmen den größten Teil des Ruhebedarfs.',
      vizRest: 'Ruhe (BMR)',
      vizModerate: 'Moderat aktiv',
      vizTitle: 'Grundumsatz im Vergleich zu moderater Aktivität',
      vizDescTpl: 'Dein Grundumsatz macht {pct} % eines moderat aktiven Tages ({moderate}) aus.',
      assumpUnitsTerm: 'Einheiten',
      assumpMetric: 'Metrisch (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Formel',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpBodyTerm: 'Körperbau',
      assumpBodyVal: 'Unterscheidet nicht zwischen Muskel- und Fettanteil',
      decTdee: 'Passendes Aktivitätslevel im TDEE-Rechner wählen',
      decMacro: 'Kalorien in Eiweiß, Fett und Kohlenhydrate aufteilen',
      decBodyFat: 'Körperfettanteil zusätzlich berechnen',
      nextQuestions: [
        'Wie hoch ist mein realer Gesamtumsatz bei meinem Trainingspensum?',
        'Welches Defizit bleibt sicher oberhalb meines Grundumsatzes?',
        'Wie stark sinkt mein BMR alle fünf Lebensjahre?',
      ],
      explanation:
        'Die Mifflin-St-Jeor-Formel berechnet anhand von Geschlecht, Alter, Gewicht und Körpergröße den täglichen Energiebedarf deines Körpers in völliger körperlicher Ruhe.',
    },
  },
};
