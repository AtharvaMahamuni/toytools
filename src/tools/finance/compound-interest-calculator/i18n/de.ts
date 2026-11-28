import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "compound-interest-calculator",
  "name": "Zinseszinsrechner",
  "seoTitle": "Zinseszinsrechner Online mit Sparrate",
  "description": "Berechne Startkapital, Sparrate und Zinsfrequenz im Zinseszinsrechner sofort im Browser. Deine Eingaben bleiben privat auf deinem Gerät.",
  "tagline": "Endkapital, Zinserträge und monatliche Sparraten berechnen.",
  "methodology": {
    "name": "Periodische Zinseszinsformel",
    "detail": "Endwert FV = P(1 + r/n)^(n × t) zuzüglich des verzinsten Endwerts regelmäßiger Monatsraten."
  },
  "knowledge": {
    "primaryConcepts": [
      "Zinseszins"
    ],
    "realWorldUseCases": [
      "Langfristiges Spar- und Depotwachstum vorausberechnen",
      "Wirkung regelmäßiger Monatsraten über Jahrzehnte prüfen",
      "Monatliche gegen jährliche Verzinsung vergleichen",
      "Altersvorsorge oder Ausbildungsbudget planen"
    ],
    "commonMistakes": [
      "Jahreszins mit Periodenzins verwechseln",
      "Renditeannahmen bei Aktienanlagen als garantiert betrachten"
    ]
  },
  "faqs": [
    {
      "id": "ci-faq-1",
      "question": "Was ist der Zinseszins?",
      "answer": "Beim Zinseszins werden nicht nur auf das Startkapital, sondern auch auf bereits gutgeschriebene Zinsen weitere Zinsen gezahlt. Dadurch wächst das Vermögen über lange Laufzeiten exponentiell."
    },
    {
      "id": "ci-faq-2",
      "question": "Wie berechnet man den Zinseszins?",
      "answer": "Die Formel lautet FV = P(1 + r/n)^(n × t), mit P als Startkapital, r als Jahreszins in Dezimalform, n als Zinsperioden pro Jahr und t als Laufzeit. 10.000 zu 7% monatlich über 20 Jahre ergeben rund 40.387."
    },
    {
      "id": "ci-faq-3",
      "question": "Welchen Unterschied macht monatliche gegenüber jährlicher Verzinsung?",
      "answer": "Bei monatlicher Gutschrift arbeiten Erträge schneller mit, sodass das Endkapital etwas höher liegt als bei jährlicher Verzinsung. Zinssatz und Laufzeit wirken sich jedoch deutlich stärker aus."
    },
    {
      "id": "ci-faq-4",
      "question": "Ist Zinseszins dasselbe wie CAGR?",
      "answer": "Zinseszins rechnet von einem bekannten Zinssatz vorwärts in die Zukunft; CAGR ermittelt umgekehrt aus Anfangs- und Endwert die durchschnittliche jährliche Wachstumsrate."
    },
    {
      "id": "ci-faq-5",
      "question": "Kann man beim Zinseszins Geld verlieren?",
      "answer": "Die Formel setzt positive Zinsen voraus, reale Börsenanlagen schwanken aber. Modelliere vorsichtige Zinssätze und verstehe das Ergebnis als Schätzung, nicht als Garantie."
    },
    {
      "id": "ci-faq-6",
      "question": "Wie stark wirken monatliche Sparraten?",
      "answer": "Über Jahrzehnte übersteigen regelmäßige Monatsraten plus deren Erträge oft das ursprüngliche Startkapital um ein Vielfaches."
    },
    {
      "id": "ci-faq-7",
      "question": "Werden Steuern oder Gebühren berücksichtigt?",
      "answer": "Nein. Der Rechner zeigt Bruttoerträge ohne Abgeltungsteuer, Depotkosten oder Inflation. Reduziere zur Näherung den Zinssatz oder prüfe danach den Inflationsrechner."
    },
    {
      "id": "ci-faq-8",
      "question": "Wie viel werden aus 1.000 bei 5% in 10 Jahren?",
      "answer": "Bei jährlicher Verzinsung rund 1.629, bei monatlicher Verzinsung rund 1.647, weil zwölfmal im Jahr Zinsen gutgeschrieben werden."
    },
    {
      "id": "ci-faq-9",
      "question": "Werden meine Finanzdaten hochgeladen?",
      "answer": "Nein. Alle Berechnungen laufen lokal im Browser auf deinem Gerät."
    }
  ],
  "guide": {
    "title": "Wie der Zinseszins funktioniert",
    "description": "Zinseszinsformel, Einfluss der Zinsperiode und monatlicher Sparraten verständlich erklärt."
  },
  "ui": {
    "scenarios": {
      "Retirement": "Altersvorsorge",
      "Child education": "Ausbildung",
      "Dream house": "Eigenheim"
    },
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "heroLabel": "Endkapital",
      "heroNoteTpl": "nach {years} {unit}",
      "cardInterest": "Erzielte Zinsen",
      "cardPrincipal": "Startkapital",
      "cardContrib": "Gesamte Einzahlungen",
      "brkPrincipal": "Startkapital",
      "brkContrib": "Sparraten",
      "brkInterest": "Zinsen",
      "freqs": {
        "1": "jährlich",
        "4": "vierteljährlich",
        "12": "monatlich",
        "365": "täglich"
      },
      "insShareTpl": "Zinsen machen {pct}% des Endguthabens aus; der Rest sind eigene Einzahlungen.",
      "insContrib": "Über lange Zeiträume entsteht der Großteil des Vermögens durch den Zinseszinseffekt statt durch die Ersteinlage.",
      "msDoubled": "Kapital verdoppelt",
      "msExceeds": "Zinsen übersteigen Einzahlungen",
      "asmRate": "Jahreszins",
      "asmCompounding": "Verzinsung",
      "asmContrib": "Sparrate",
      "moUnit": "Monat",
      "none": "keine",
      "decInflation": "Kaufkraftverlust durch Inflation prüfen",
      "decRule72": "Verdopplungszeit schnell abschätzen",
      "decGoal": "Benötigte Monatsrate vom Sparziel berechnen",
      "q1": "Wie hoch muss meine monatliche Sparrate für ein Ziel sein?",
      "q2": "Was ist der Betrag nach Inflation real wert?",
      "expContribTpl": " und monatlichen {amount}",
      "explanationTpl": "Aus {principal}{contribClause} werden bei {rate} ({freq} verzinst) nach {years} {unit} insgesamt {final}.",
      "vizTitle": "Vermögensentwicklung im Zeitverlauf",
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
    "heroLabel": "Endkapital",
    "heroNoteTpl": "nach {years} {unit}",
    "cardInterest": "Erzielte Zinsen",
    "cardPrincipal": "Startkapital",
    "cardContrib": "Gesamte Einzahlungen",
    "brkPrincipal": "Startkapital",
    "brkContrib": "Sparraten",
    "brkInterest": "Zinsen",
    "freqs": {
      "1": "jährlich",
      "4": "vierteljährlich",
      "12": "monatlich",
      "365": "täglich"
    },
    "insShareTpl": "Zinsen machen {pct}% des Endguthabens aus; der Rest sind eigene Einzahlungen.",
    "insContrib": "Über lange Zeiträume entsteht der Großteil des Vermögens durch den Zinseszinseffekt statt durch die Ersteinlage.",
    "msDoubled": "Kapital verdoppelt",
    "msExceeds": "Zinsen übersteigen Einzahlungen",
    "asmRate": "Jahreszins",
    "asmCompounding": "Verzinsung",
    "asmContrib": "Sparrate",
    "moUnit": "Monat",
    "none": "keine",
    "decInflation": "Kaufkraftverlust durch Inflation prüfen",
    "decRule72": "Verdopplungszeit schnell abschätzen",
    "decGoal": "Benötigte Monatsrate vom Sparziel berechnen",
    "q1": "Wie hoch muss meine monatliche Sparrate für ein Ziel sein?",
    "q2": "Was ist der Betrag nach Inflation real wert?",
    "expContribTpl": " und monatlichen {amount}",
    "explanationTpl": "Aus {principal}{contribClause} werden bei {rate} ({freq} verzinst) nach {years} {unit} insgesamt {final}.",
    "vizTitle": "Vermögensentwicklung im Zeitverlauf",
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
    "principal": {
      "label": "Startkapital"
    },
    "rate": {
      "label": "Jährlicher Zinssatz"
    },
    "frequency": {
      "label": "Zinsperiode",
      "options": {
        "1": "Jährlich",
        "4": "Vierteljährlich",
        "12": "Monatlich",
        "365": "Täglich"
      }
    },
    "years": {
      "label": "Laufzeit in Jahren",
      "unit": "Jahre"
    },
    "contribution": {
      "label": "Monatliche Sparrate",
      "help": "Optional. Wird jeweils am Monatsende eingezahlt."
    }
  }
};
