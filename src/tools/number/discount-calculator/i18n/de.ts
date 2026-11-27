import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'discount-calculator',
  name: 'Rabattrechner',
  seoTitle: 'Rabattrechner Online – Prozent & Endpreis Berechnen',
  description:
    'Berechne Endpreis und Ersparnis nach Prozent-Rabatt oder festem Betragsnachlass direkt im Browser. Kostenlos, schnell und komplett lokal.',
  tagline: 'Verkaufspreis und Ersparnis nach Prozent oder Festbetrag.',
  craft: {
    solves:
      'Schilder wie „30 % plus extra 20 %“ werden intuitiv als 50 % gelesen, ergeben in Wirklichkeit aber nur 44 % Gesamtrabatt.',
  },
  knowledge: {
    primaryConcepts: ['Rabattberechnung', 'Endpreis'],
    realWorldUseCases: [
      'Den Endpreis eines reduzierten Artikels schnell berechnen',
      'Prozentgutschein gegen einen festen Euro-Gutschein abwägen',
      'Tatsächliche Ersparnis im Ausverkauf kontrollieren',
      'Einkaufsbudget vor der Kasse exakt prüfen',
    ],
    commonMistakes: [
      'Zwei gestaffelte Prozentrabatte einfach zusammenaddieren statt nacheinander abzuziehen',
      'Rabatte auf Bruttopreis vs. Nettolistenpreis durcheinanderbringen',
    ],
  },
  faqs: [
    {
      id: 'disc-faq-1',
      question: 'Wie berechne ich einen prozentualen Rabatt?',
      answer:
        'Multipliziere den Ausgangspreis mit dem Rabattsatz und teile durch 100, um die Ersparnis zu erhalten, oder multipliziere direkt mit (1 − Rabatt/100). 25 % auf 80 ergibt 20 Ersparnis und 60 Endpreis.',
    },
    {
      id: 'disc-faq-2',
      question: 'Was unterscheidet Prozent-Rabatt vom Festbetrags-Abzug?',
      answer:
        'Ein Prozentwert wächst mit dem Preis (20 % spart 10 bei 50, aber 40 bei 200). Ein Festbetrag zieht unabhängig vom Warenwert denselben Betrag ab.',
    },
    {
      id: 'disc-faq-3',
      question: 'Wie viel spare ich konkret?',
      answer:
        'Gib Ausgangspreis und Nachlass ein – der Rechner zeigt sofort den gesparten Betrag, den neuen Verkaufspreis und die effektive Quote.',
    },
    {
      id: 'disc-faq-4',
      question: 'Wie funktionieren gestaffelte Doppel-Rabatte?',
      answer:
        'Sie wirken hintereinander auf den jeweils reduzierten Preis, nicht addiert: 20 % auf 100 ergeben 80, weitere 10 % auf 80 ergeben 72 – also insgesamt 28 % statt 30 %.',
    },
    {
      id: 'disc-faq-5',
      question: 'Gilt der Rabatt vor oder nach Steuern?',
      answer:
        'Im Einzelhandel erfolgt der Nachlass üblicherweise auf den Preis vor Zuschlägen bzw. anteilig auf den Listenpreis, sodass sich auch der Steueranteil mindert.',
    },
    {
      id: 'disc-faq-6',
      question: 'Wie berechne ich aus dem Endpreis den ursprünglichen Preis zurück?',
      answer:
        'Teile den reduzierten Preis durch (1 − Rabattsatz). Kostet etwas nach 25 % Nachlass noch 60, war der Ursprungspreis 60 ÷ 0,75 = 80.',
    },
    {
      id: 'disc-faq-7',
      question: 'Was bedeutet „Zweiter Artikel 50 % günstiger“ in Prozent?',
      answer:
        'Bei zwei gleich teuren Produkten zahlt man 150 % statt 200 % – die reale Gesamtersparnis beträgt also 25 %, nicht 50 %.',
    },
    {
      id: 'disc-faq-8',
      question: 'Ist ein Rabatt auf den Verkaufspreis dasselbe wie geringerer Aufschlag?',
      answer:
        'Nein. Der Rabatt bezieht sich auf den Verkaufspreis, der Handelsaufschlag hingegen auf den Einkaufspreis.',
    },
    {
      id: 'disc-faq-9',
      question: 'Werden meine eingegebenen Preise hochgeladen?',
      answer:
        'Nein. Alle Berechnungen laufen lokal im Browser ohne Serverkommunikation.',
    },
  ],
  guide: {
    title: 'Rabatt berechnen: Prozente & Doppelrabatt',
    description:
      'Warum 20 % + 10 % nur 28 % ergibt, wie du rückwärts auf den Originalpreis rechnest und Rabattarten vergleichst.',
    readMinutes: 4,
  },
  ui: {
    panelDetails: 'Rabatt-Eingabe',
    lblMode: 'Rabattart',
    optPercent: 'Prozent (%)',
    optFixed: 'Fester Betrag',
    lblPrice: 'Ausgangspreis',
    phPrice: 'z. B. 80',
    lblAmountPct: 'Rabatt (%)',
    lblAmountFixed: 'Abzugsbetrag',
    phPct: 'z. B. 25',
    phFixed: 'z. B. 15',
    lblFinalPrice: 'Endpreis',
    emptyHint: 'Ausgangspreis und Rabatt eingeben.',
    lblSaved: 'Ersparnis',
    lblRate: 'Effektiver Rabatt',
    errInvalidPrice: 'Bitte einen gültigen Preis ab 0 eingeben.',
    warnFixedCapTpl: 'Ein Abzug von {amt} übersteigt den Preis; auf {price} begrenzt (Endpreis 0).',
    warnPctCapTpl: 'Rabatt über 100 % nicht möglich: {rate} wird auf 100 % begrenzt.',
    copyLabel: 'Ergebnis kopieren',
    copiedLabel: 'Kopiert',
    clearLabel: 'Zurücksetzen',
    confirmClearLabel: 'Zum Löschen erneut klicken',
    nothingToCopy: 'Bitte zuerst einen Rabatt berechnen.',
    engine: {
      pitfallChainedTpl: 'Kombinierter Effektrabatt von {rate} auf den Ausgangspreis {base}.',
      pitfallSingleTpl: 'Einzelrabatt auf {price}: Endpreis {final}.',
      pitfallActionLabel: 'Effektive Quote',
    },
  },
};
