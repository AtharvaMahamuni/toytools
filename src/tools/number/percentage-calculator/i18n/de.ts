import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'percentage-calculator',
  name: 'Prozentrechner',
  seoTitle: 'Prozentrechner Online – Kostenlos Prozente berechnen',
  description:
    'Was sind 15% von 80? Das sind 12. Berechnen Sie Prozentwert, prozentuale Veränderung und wie viel Prozent X von Y sind direkt im Browser.',
  tagline: 'Prozentwert einer Zahl oder prozentuale Veränderung zwischen zwei Werten auf Ihrem Gerät.',
  knowledge: {
    primaryConcepts: ['Prozentrechnung', 'prozentuale Veränderung', 'Prozentpunkte'],
    realWorldUseCases: [
      'Rabatte, Preisnachlässe oder Handelsmargen schnell berechnen',
      'Wachstum oder Rückgang zwischen zwei Werten in Prozent ermitteln',
      'Trinkgeld, Mehrwertsteuer oder Steueranteile berechnen',
      'Prüfungspunkte oder Verhältnisse in Prozent umrechnen',
    ],
    commonMistakes: [
      'Prozentuale Veränderung mit Prozentpunkten beim Vergleich zweier Raten verwechseln',
      'Grundwert und Prozentwert vertauschen, wenn man „wie viel Prozent von“ berechnet',
    ],
  },
  faqs: [
    {
      id: 'pct-faq-1',
      question: 'Was ist ein Prozent?',
      answer:
        'Ein Prozent ist eine Zahl, die als Bruch von 100 angegeben wird. Der Begriff stammt vom lateinischen „per centum“ und bedeutet „von Hundert“. 25% entsprechen also 25 von 100 Teilen oder einem Viertel. Prozentangaben machen unterschiedlich große Mengen auf einer einheitlichen Skala vergleichbar.',
    },
    {
      id: 'pct-faq-2',
      question: 'Wie berechnet man einen Prozentsatz von einer Zahl?',
      answer:
        'Multiplizieren Sie den Grundwert mit dem Prozentsatz und teilen Sie durch 100. Beispiel: 20% von 150 = (20 × 150) ÷ 100 = 30. Als Kopfrechentrick verschieben Sie das Komma für 10% um eine Stelle nach links (150 → 15) und verdoppeln das Ergebnis für 20% (15 × 2 = 30).',
    },
    {
      id: 'pct-faq-3',
      question: 'Wie berechnet man, wie viel Prozent eine Zahl von einer anderen ist?',
      answer:
        'Teilen Sie den Teilwert durch den Grundwert und multiplizieren Sie mit 100. Beispiel für 45 von 200: (45 ÷ 200) × 100 = 22,5%. Diese Formel eignet sich für Notenspiegel, Umfrageergebnisse und Zielquoten.',
    },
    {
      id: 'pct-faq-4',
      question: 'Was ist der Unterschied zwischen Prozent und Prozentpunkten?',
      answer:
        'Ein Prozentpunkt ist die direkte Differenz zwischen zwei Prozentwerten. Steigt ein Zinssatz von 3% auf 5%, beträgt der Anstieg 2 Prozentpunkte, aber relativ betrachtet 66,7%. Prozentpunkte vergleichen Raten direkt miteinander, während die prozentuale Veränderung die relative Abweichung misst.',
    },
    {
      id: 'pct-faq-5',
      question: 'Wie berechnet man prozentuale Zunahme oder Abnahme?',
      answer:
        'Ziehen Sie den alten Wert vom neuen Wert ab, teilen Sie durch den Betrag des alten Werts und multiplizieren Sie mit 100: ((Neu − Alt) ÷ |Alt|) × 100. Steigt ein Preis von 80 € auf 100 €: ((100 − 80) ÷ 80) × 100 = 25% Zunahme. Ein negatives Ergebnis zeigt eine Abnahme. Bei negativem Ausgangswert wird ohne Vorzeichen geteilt, damit die Richtung stimmt.',
    },
    {
      id: 'pct-faq-6',
      question: 'Wie berechnet man einen Rabatt?',
      answer:
        'Multiplizieren Sie den Originalpreis mit dem Rabattsatz und teilen Sie durch 100, um die Ersparnis zu erhalten, und ziehen Sie diese vom Originalpreis ab. Bei 30% Rabatt auf 120 €: Rabatt = (30 × 120) ÷ 100 = 36 €; Endpreis = 120 € − 36 € = 84 €. Schneller geht es über 120 € × (1 − 0,30) = 84 €.',
    },
    {
      id: 'pct-faq-7',
      question: 'Warum ergibt 50% Rabatt und danach 50% Aufschlag nicht wieder den Ausgangspreis?',
      answer:
        'Weil sich jeder Prozentsatz auf einen anderen Grundwert bezieht. Ein Artikel für 100 € kostet nach 50% Rabatt noch 50 €. Rechnet man 50% auf diese 50 € auf, erhält man 75 € statt 100 €. Prozentuale Veränderungen heben sich aufgrund des veränderten Basiswerts nicht symmetrisch auf.',
    },
    {
      id: 'pct-faq-8',
      question: 'Wie berechnet man die Mehrwertsteuer aus einem Prozentsatz?',
      answer:
        'Multiplizieren Sie den Nettopreis mit dem Steuersatz und teilen Sie durch 100. Bei 19% MwSt. auf 100 €: Steuer = 19 €, Bruttopreis = 119 €. Um den Nettopreis aus dem Bruttobetrag herauszurechnen, teilen Sie durch (1 + Steuersatz / 100), also 119 € ÷ 1,19 = 100 €.',
    },
  ],
  guide: {
    title: 'Prozentrechnung einfach erklärt: 3 Formeln',
    description:
      'Die drei wichtigsten Prozentformeln mit Beispielen: X% von Y, wie viel Prozent ist X von Y und prozentuale Veränderung samt Prozentpunkten.',
    readMinutes: 6,
  },
  ui: {
    panelValues: 'Werte',
    lblMode: 'Berechnung',
    optOf: 'Wie viel sind A% von B?',
    optChange: 'Prozentuale Veränderung von A nach B',
    optIs: 'Wie viel Prozent ist A von B?',
    lblA: 'A',
    phA: 'Beispiel: 20',
    lblB: 'B',
    phB: 'Beispiel: 150',
    emptyHint: 'Werte eingeben, um zu berechnen.',
    errInvalid: 'Gültige Zahlen eingeben.',
    errFirstZero: 'Der erste Wert darf nicht null sein.',
    errSecondZero: 'Der zweite Wert darf nicht null sein.',
    fmlOf: '{a}% von {b}',
    dirIncrease: 'Zunahme',
    dirDecrease: 'Abnahme',
    dirNone: 'Keine Änderung',
    fmlChange: '{dir} von {a} auf {b}',
    fmlIs: '{a} ist dieser Anteil in % von {b}',
    toastEmptyCopy: 'Nichts zum Kopieren!',
    btnCopied: '✓ Kopiert',
    btnCopy: 'Kopieren',
    btnClear: 'Leeren',
    btnConfirmClear: 'Leeren bestätigen',
  },
};
