import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "inflation-calculator",
  "name": "Inflationsrechner",
  "seoTitle": "Inflationsrechner Online: Kaufkraftverlust Berechnen",
  "description": "Berechne künftige Kaufkraft, realen Wertverlust durch Inflation und zukünftige Preise im Browser. Alle Eingaben bleiben privat.",
  "tagline": "Zukünftige Kaufkraft und Preisentwicklung berechnen.",
  "methodology": {
    "name": "Geometrische Preissteigerung",
    "detail": "Inflation wirkt wie ein negativer Zinseszins und mindert die Kaufkraft exponentiell über die Zeit."
  },
  "knowledge": {
    "primaryConcepts": [
      "Inflation"
    ],
    "realWorldUseCases": [
      "Reale Kaufkraft der Altersvorsorge einschätzen",
      "Nötige Gehaltsanpassung gegen Preissteigerung berechnen",
      "Langfristige Sparziele preisbereinigt planen",
      "Geldanlage-Rendite gegen Inflation messen"
    ],
    "commonMistakes": [
      "Nominalbetrag mit realer Kaufkraft verwechseln",
      "Kumulierte Inflation über Jahrzehnte unterschätzen"
    ]
  },
  "faqs": [
    {
      "id": "inf-faq-1",
      "question": "Was ist mein Geld nach der Inflation noch wert?",
      "answer": "Man teilt den heutigen Betrag durch (1 + Rate)^Jahre. Bei 3% Inflation entsprechen 100.000 in 25 Jahren noch etwa 47.761 heutiger Kaufkraft."
    },
    {
      "id": "inf-faq-2",
      "question": "Worin unterscheiden sich Real- und Nominalwert?",
      "answer": "Der Nominalwert ist der Nennbetrag auf dem Konto, der Realwert berücksichtigt die Preissteigerung und zeigt die echte Kaufkraft."
    },
    {
      "id": "inf-faq-3",
      "question": "Wie wirkt sich Inflation auf Bargeld oder Tagesgeld aus?",
      "answer": "Erhältst du 1% Zins bei 3% Inflation, schrumpft die reale Kaufkraft um rund 2% jährlich."
    },
    {
      "id": "inf-faq-4",
      "question": "Wie berechnet man zukünftige Preise?",
      "answer": "Heutiger Preis × (1 + Inflationsrate)^Jahre. Aus 100.000 werden bei 3% über 25 Jahre rund 209.378."
    },
    {
      "id": "inf-faq-5",
      "question": "Welche Inflationsrate sollte ich ansetzen?",
      "answer": "Viele Industrieländer peilen 2% an; für langfristige Vorsorge werden häufig 2,5% bis 4% getestet."
    },
    {
      "id": "inf-faq-6",
      "question": "Wie lässt sich Inflation schlagen?",
      "answer": "Indem die Nettorendite nach Steuern höher liegt als die Teuerungsrate, meist über breit gestreute Produktivkapital-Anlagen."
    },
    {
      "id": "inf-faq-7",
      "question": "Warum fällt eine kleine Jahresrate langfristig so stark ins Gewicht?",
      "answer": "Weil sich die Teuerung wie ein Zinseszins aufeinander aufbaut und über 25 Jahre bei 3% über 52% Kaufkraft auffrisst."
    }
  ],
  "guide": {
    "title": "Wie Inflation die Kaufkraft beeinflusst",
    "description": "Rechenbeispiele bei 3%, 5% und 7%, Realzins versus Nominalzins und 72er-Regel."
  },
  "ui": {
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "heroLabel": "Zukünftige Kaufkraft",
      "heroNoteTpl": "in heutigem Geld nach {years} {unit}",
      "cardLost": "Kaufkraftverlust absolut",
      "cardLostPct": "Kaufkraftverlust in %",
      "cardCost": "Zukünftiger Preis derselben Waren",
      "insPowerTpl": "Die Inflation entzieht diesem Betrag über {years} {unit} rund {pct} seiner Kaufkraft.",
      "insImpact": "Schleichende Inflation wirkt stärker als oft gedacht, weshalb Erträge oberhalb der Teuerung entscheidend sind.",
      "msHalved": "Kaufkraft halbiert",
      "asmRate": "Inflationsrate",
      "asmPeriod": "Zeitraum",
      "decCompound": "Rendite über Inflationsniveau simulieren",
      "decRule72": "Verdopplungszeit berechnen",
      "q1": "Welche Rendite gleicht diese Inflation aus?",
      "q2": "Wie viel muss ich zusätzlich zurücklegen?",
      "explanationTpl": "Bei {rate} Inflation entspricht ein Betrag von {amount} nach {years} {unit} einer heutigen Kaufkraft von {real}; dieselben Güter kosten dann {futureCost}.",
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
        "amount": "den Betrag",
        "rate": "den Zinssatz",
        "years": "die Jahre",
        "goal": "das Sparziel",
        "current": "das vorhandene Ersparte",
        "start": "den Anfangswert",
        "end": "den Endwert"
      }
    },
    "yearOne": "Jahr",
    "yearMany": "Jahre",
    "heroLabel": "Zukünftige Kaufkraft",
    "heroNoteTpl": "in heutigem Geld nach {years} {unit}",
    "cardLost": "Kaufkraftverlust absolut",
    "cardLostPct": "Kaufkraftverlust in %",
    "cardCost": "Zukünftiger Preis derselben Waren",
    "insPowerTpl": "Die Inflation entzieht diesem Betrag über {years} {unit} rund {pct} seiner Kaufkraft.",
    "insImpact": "Schleichende Inflation wirkt stärker als oft gedacht, weshalb Erträge oberhalb der Teuerung entscheidend sind.",
    "msHalved": "Kaufkraft halbiert",
    "asmRate": "Inflationsrate",
    "asmPeriod": "Zeitraum",
    "decCompound": "Rendite über Inflationsniveau simulieren",
    "decRule72": "Verdopplungszeit berechnen",
    "q1": "Welche Rendite gleicht diese Inflation aus?",
    "q2": "Wie viel muss ich zusätzlich zurücklegen?",
    "explanationTpl": "Bei {rate} Inflation entspricht ein Betrag von {amount} nach {years} {unit} einer heutigen Kaufkraft von {real}; dieselben Güter kosten dann {futureCost}.",
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
      "amount": "den Betrag",
      "rate": "den Zinssatz",
      "years": "die Jahre",
      "goal": "das Sparziel",
      "current": "das vorhandene Ersparte",
      "start": "den Anfangswert",
      "end": "den Endwert"
    }
  },
  "fields": {
    "amount": {
      "label": "Heutiger Betrag"
    },
    "rate": {
      "label": "Jährliche Inflationsrate"
    },
    "years": {
      "label": "Laufzeit",
      "unit": "Jahre"
    }
  }
};
