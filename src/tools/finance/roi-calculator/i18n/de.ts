import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "roi-calculator",
  "name": "ROI-Rechner",
  "seoTitle": "ROI-Rechner: Kapitalrendite & Jahresrendite Online",
  "description": "Berechne Return on Investment (ROI), Nettogewinn und die annualisierte Jahresrendite über deine Haltedauer direkt im Browser.",
  "tagline": "Gesamtrendite (ROI) inklusive annualisierter Jahresrate.",
  "methodology": {
    "name": "ROI inklusive Annualisierung",
    "detail": "Setzt den Nettogewinn ins Verhältnis zum Kapitaleinsatz und rechnet ihn über die Haltedauer auf eine Jahresrendite um."
  },
  "knowledge": {
    "primaryConcepts": [
      "Return on Investment (ROI)"
    ],
    "realWorldUseCases": [
      "Tatsächliche Rendite nach Verkauf einer Aktienposition prüfen",
      "Immobilienverkauf gegen ein Indexportfolio vergleichen",
      "Wirtschaftlichkeit eines Projekts bewerten",
      "Mehrjährige Gewinne als jährliche Vergleichsrate darstellen"
    ],
    "commonMistakes": [
      "Rohen ROI über verschiedene Zeiträume direkt vergleichen",
      "Gebühren, Steuern oder Dividenden im Ergebnis vergessen"
    ]
  },
  "faqs": [
    {
      "id": "roi-faq-1",
      "question": "Wie berechnet man den ROI?",
      "answer": "ROI% = ((Endwert − Kapitaleinsatz) / Kapitaleinsatz) × 100. Aus 10.000 auf 15.000 ergibt sich ein ROI von 50%."
    },
    {
      "id": "roi-faq-2",
      "question": "Was gilt als guter ROI?",
      "answer": "Das hängt von der Haltedauer ab: 50% in einem Jahr sind stark, über 15 Jahre aber nur etwa 2,7% pro Jahr. Vergleiche stets die annualisierte Rate."
    },
    {
      "id": "roi-faq-3",
      "question": "Worin unterscheidet sich ROI von der jährlichen Rendite?",
      "answer": "Der ROI misst den Gesamtertrag über die gesamte Zeit, die annualisierte Rendite rechnet ihn auf einen fairen Jahreszins um."
    },
    {
      "id": "roi-faq-4",
      "question": "Werden auch Verluste berechnet?",
      "answer": "Ja. Ist der Endwert niedriger als das eingesetzte Kapital, zeigt der Rechner den negativen ROI und Nettoverlust."
    },
    {
      "id": "roi-faq-5",
      "question": "Sollte man Gebühren, Steuern und Dividenden einbeziehen?",
      "answer": "Ja. Addiere Kaufgebühren zu den Kosten und rechne Ausschüttungen zum Netto-Endwert, um ein realistisches Bild zu erhalten."
    },
    {
      "id": "roi-faq-6",
      "question": "Wie hängen ROI und CAGR zusammen?",
      "answer": "Der ROI nennt die Gesamtrendite, der CAGR die konstante jährliche Wachstumsrate dahinter (hier als annualisierte Rendite angezeigt)."
    },
    {
      "id": "roi-faq-7",
      "question": "Bleiben meine Zahlen privat?",
      "answer": "Ja, alles läuft im Browser ohne Datenübertragung."
    }
  ],
  "guide": {
    "title": "Return on Investment (ROI) richtig berechnen",
    "description": "ROI-Formel, Vergleich mit der annualisierten Rendite (CAGR) und typische Bewertungsfehler."
  },
  "ui": {
    "scenarios": {
      "Stock position": "Aktienposition",
      "Property sale": "Immobilienverkauf",
      "Losing trade": "Verlustposition"
    },
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "yrUnit": "Jahr",
      "notSpecified": "nicht angegeben",
      "heroLabel": "Kapitalrendite (ROI)",
      "noteGainTpl": "Gewinn von {amt}",
      "noteLossTpl": "Verlust von {amt}",
      "cardGain": "Nettogewinn",
      "cardLoss": "Nettoverlust",
      "cardFinal": "Endwert",
      "cardAnnualized": "Annualisierte Rendite",
      "insGainTpl": "Jede {base} Einsatz brachte {back} zurück.",
      "insLossTpl": "Diese Anlage verlor {loss}, entsprechend {pct} Minus auf das eingesetzte Kapital.",
      "insAnnualTpl": "Der einfache ROI ignoriert die Zeit. Über {years} Jahre sind es {annual} pro Jahr zum fairen Vergleich.",
      "insNoPeriod": "Ergänze die Haltedauer, um die jährliche Vergleichsrendite zu berechnen.",
      "msDoubled": "Kapital mindestens verdoppelt",
      "msAhead": "Gewinnzone erreicht",
      "asmFigures": "Basiswerte",
      "asmFiguresVal": "vor Steuern und Gebühren",
      "asmCash": "Zahlungsfluss",
      "asmCashVal": "ein Einstieg, ein Ausstieg ohne Zwischenzahlungen",
      "asmPeriod": "Haltedauer",
      "decCagr": "Wachstum im CAGR-Rechner analysieren",
      "decCompound": "Erlös weiter mit Zinseszins hochrechnen",
      "decInflation": "Gewinn gegen Inflation prüfen",
      "q1": "Welcher Jahresrendite entspricht das?",
      "q2": "Wie schneidet das gegen einen Indexfonds ab?",
      "returnWord": "Gewinn",
      "lossWord": "Verlust",
      "expAnnualTpl": " ({annual} p. a. über {years} {unit})",
      "explanationTpl": "Einsatz {cost} ergab am Ende {final}, ein {pct} {dir}{annualClause}.",
      "errEnterTpl": "Gib {label} ein, um zu berechnen.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errNotNegativeTpl": "{Label} darf nicht negativ sein. Gib 0 oder mehr ein.",
      "errMinTpl": "{Label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{Label} darf nicht größer als {max} sein.",
      "errPositiveTpl": "{label} muss größer als null sein.",
      "yearSingular": "Jahr",
      "yearsPlural": "Jahre",
      "neverLabel": "nie",
      "vLabels": {
        "principal": "das Startkapital",
        "rate": "den Zinssatz",
        "years": "die Laufzeit in Jahren",
        "contribution": "den monatlichen Beitrag",
        "price": "den Kreditbetrag",
        "down": "die Anzahlung",
        "extra": "die monatliche Sondertilgung",
        "monthly": "den monatlichen Sparbetrag",
        "initial": "die Starteinlage",
        "cost": "den investierten Betrag",
        "final": "den Endwert",
        "amount": "den Ausgangsbetrag",
        "goal": "das Sparziel",
        "current": "das vorhandene Ersparte",
        "start": "den Anfangswert",
        "end": "den Endwert"
      }
    },
    "yearOne": "Jahr",
    "yearMany": "Jahre",
    "yrUnit": "Jahr",
    "notSpecified": "nicht angegeben",
    "heroLabel": "Kapitalrendite (ROI)",
    "noteGainTpl": "Gewinn von {amt}",
    "noteLossTpl": "Verlust von {amt}",
    "cardGain": "Nettogewinn",
    "cardLoss": "Nettoverlust",
    "cardFinal": "Endwert",
    "cardAnnualized": "Annualisierte Rendite",
    "insGainTpl": "Jede {base} Einsatz brachte {back} zurück.",
    "insLossTpl": "Diese Anlage verlor {loss}, entsprechend {pct} Minus auf das eingesetzte Kapital.",
    "insAnnualTpl": "Der einfache ROI ignoriert die Zeit. Über {years} Jahre sind es {annual} pro Jahr zum fairen Vergleich.",
    "insNoPeriod": "Ergänze die Haltedauer, um die jährliche Vergleichsrendite zu berechnen.",
    "msDoubled": "Kapital mindestens verdoppelt",
    "msAhead": "Gewinnzone erreicht",
    "asmFigures": "Basiswerte",
    "asmFiguresVal": "vor Steuern und Gebühren",
    "asmCash": "Zahlungsfluss",
    "asmCashVal": "ein Einstieg, ein Ausstieg ohne Zwischenzahlungen",
    "asmPeriod": "Haltedauer",
    "decCagr": "Wachstum im CAGR-Rechner analysieren",
    "decCompound": "Erlös weiter mit Zinseszins hochrechnen",
    "decInflation": "Gewinn gegen Inflation prüfen",
    "q1": "Welcher Jahresrendite entspricht das?",
    "q2": "Wie schneidet das gegen einen Indexfonds ab?",
    "returnWord": "Gewinn",
    "lossWord": "Verlust",
    "expAnnualTpl": " ({annual} p. a. über {years} {unit})",
    "explanationTpl": "Einsatz {cost} ergab am Ende {final}, ein {pct} {dir}{annualClause}.",
    "errEnterTpl": "Gib {label} ein, um zu berechnen.",
    "errNotNumberTpl": "{label} muss eine Zahl sein.",
    "errNotNegativeTpl": "{Label} darf nicht negativ sein. Gib 0 oder mehr ein.",
    "errMinTpl": "{Label} darf nicht kleiner als {min} sein.",
    "errMaxTpl": "{Label} darf nicht größer als {max} sein.",
    "errPositiveTpl": "{label} muss größer als null sein.",
    "yearSingular": "Jahr",
    "yearsPlural": "Jahre",
    "neverLabel": "nie",
    "vLabels": {
      "principal": "das Startkapital",
      "rate": "den Zinssatz",
      "years": "die Laufzeit in Jahren",
      "contribution": "den monatlichen Beitrag",
      "price": "den Kreditbetrag",
      "down": "die Anzahlung",
      "extra": "die monatliche Sondertilgung",
      "monthly": "den monatlichen Sparbetrag",
      "initial": "die Starteinlage",
      "cost": "den investierten Betrag",
      "final": "den Endwert",
      "amount": "den Ausgangsbetrag",
      "goal": "das Sparziel",
      "current": "das vorhandene Ersparte",
      "start": "den Anfangswert",
      "end": "den Endwert"
    }
  },
  "fields": {
    "cost": {
      "label": "Investiertes Kapital"
    },
    "final": {
      "label": "Endwert",
      "help": "Aktueller Wert oder erzielter Verkaufserlös."
    },
    "years": {
      "label": "Haltedauer",
      "unit": "Jahre",
      "help": "Optional. Zeigt die jährliche Vergleichsrendite an."
    }
  }
};
