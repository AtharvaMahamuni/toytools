import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "sip-calculator",
  "name": "SIP-Sparplan-Rechner",
  "seoTitle": "SIP-Rechner Online: Monatlicher Sparplan & Rendite",
  "description": "Berechne Endwert, Einzahlungen und Rendite deines monatlichen Investmentplans (SIP / Sparplan) lokal im Browser.",
  "tagline": "Endwert eines monatlichen Sparplans mit optionaler Starteinlage.",
  "methodology": {
    "name": "Rentenendwertformel (nachschüssig)",
    "detail": "Jede Monatsrate verzinst sich bis Laufzeitende, sodass frühe Raten den stärksten Hebel entfalten."
  },
  "knowledge": {
    "primaryConcepts": [
      "monatlicher Sparplan (SIP)"
    ],
    "realWorldUseCases": [
      "Monatliche ETF- oder Fondssparpläne planen",
      "Langfristiges Gehaltssparen realistisch einschätzen",
      "Verschiedene Sparraten für Lebensziele vergleichen",
      "Effekt eines frühen Einstiegs sichtbar machen"
    ],
    "commonMistakes": [
      "Optimistische Renditen als garantiert einplanen",
      "Kaufkraftverlust durch Inflation außer Acht lassen"
    ]
  },
  "faqs": [
    {
      "id": "sip-faq-1",
      "question": "Was ist ein SIP-Sparplan?",
      "answer": "Ein Systematic Investment Plan (SIP) legt regelmäßig – meist monatlich – denselben Betrag an. So baut man diszipliniert Vermögen auf, ohne den perfekten Einstiegstag treffen zu müssen."
    },
    {
      "id": "sip-faq-2",
      "question": "Wie wird der SIP-Endwert berechnet?",
      "answer": "Jede Monatsrate verzinst sich über die Restlaufzeit gemäß der nachschüssigen Rentenformel FV = P · ((1 + i)^n − 1) / i."
    },
    {
      "id": "sip-faq-3",
      "question": "Welche Rendite sollte ich ansetzen?",
      "answer": "Orientiere dich konservativ an der Anlageklasse. Breite Aktien-ETFs lagen historisch im hohen einstelligen Bereich, Anleihen niedriger."
    },
    {
      "id": "sip-faq-4",
      "question": "Ist ein Sparplan besser als eine Einmalanlage?",
      "answer": "Vorhandenes Kapital erzielt als Einmalanlage im Schnitt mehr Zeit am Markt. Ein Sparplan passt zum monatlichen Gehalt und glättet Kursschwankungen. Beide lassen sich hier kombinieren."
    },
    {
      "id": "sip-faq-5",
      "question": "Was bedeutet Cost-Average-Effekt?",
      "answer": "Bei konstanter Rate erhältst du bei niedrigen Kursen mehr Anteile und bei hohen Kursen weniger, was den durchschnittlichen Kaufpreis ausgleicht."
    },
    {
      "id": "sip-faq-6",
      "question": "Warum bringt früheres Starten so viel?",
      "answer": "Frühe Einzahlungen arbeiten über die gesamte Laufzeit hinweg mit Zinseszins; fünf Jahre Vorlauf schlagen oft eine spätere Erhöhung der Sparrate."
    },
    {
      "id": "sip-faq-7",
      "question": "Sind Steuern oder Inflation berücksichtigt?",
      "answer": "Nein. Das Ergebnis ist brutto vor Steuern und Inflation. Prüfe die reale Kaufkraft zusätzlich im Inflationsrechner."
    },
    {
      "id": "sip-faq-8",
      "question": "Höhere Sparrate oder längere Laufzeit?",
      "answer": "Bei identischer Gesamteinzahlung gewinnt fast immer die längere Dauer, da jede Rate länger verzinst wird."
    },
    {
      "id": "sip-faq-9",
      "question": "Warum bringt doppelte Laufzeit mehr als den doppelten Endbetrag?",
      "answer": "Weil sich die exponentielle Kurve in den letzten Jahren stark aufbaut: Aus 100.000 nach 10 Jahren werden bei 10% rund 380.000 nach 20 Jahren."
    },
    {
      "id": "sip-faq-10",
      "question": "Warum ist der Ertrag in den ersten Jahren so gering?",
      "answer": "Zu Beginn dominiert eigenes Kapital, weil kaum Verzinsungszeit vergangen ist. Die Wachstumskurve steilt erst später deutlich an."
    },
    {
      "id": "sip-faq-11",
      "question": "Warum weicht der Wert vom echten Depotauszug ab?",
      "answer": "Reale Märkte schwanken täglich und erheben Produktkosten wie TER, während die Modellrechnung eine gleichmäßige Rendite unterstellt."
    },
    {
      "id": "sip-faq-12",
      "question": "Bleiben meine Angaben lokal?",
      "answer": "Ja. Alle Berechnungen laufen ausschließlich im Browser auf deinem Gerät."
    }
  ],
  "guide": {
    "title": "Wie ein monatlicher SIP-Sparplan Vermögen aufbaut",
    "description": "Durchschnittskosteneffekt, Sparplanformel und Vergleich zwischen Rate und Anlagedauer."
  },
  "ui": {
    "scenarios": {
      "First salary SIP": "Berufseinstieg",
      "Wealth building": "Vermögensaufbau",
      "Short-term goal": "Kurzfristiges Ziel"
    },
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "heroLabel": "Endvermögen",
      "heroNoteTpl": "nach {years} {unit}",
      "cardGain": "Wertzuwachs",
      "cardInvested": "Eingezahlt gesamt",
      "cardMonths": "Monatsraten",
      "brkLump": "Starteinlage",
      "brkMonthly": "Sparraten",
      "brkGrowth": "Rendite",
      "insShareTpl": "Der Marktertrag steuert {pct}% zum Endwert bei; der Rest stammt aus eigenen Einzahlungen.",
      "insAvg": "Durch gleichbleibende Monatsraten kaufst du bei niedrigeren Kursen mehr Anteile (Cost-Average-Effekt).",
      "msDoubled": "Einzahlungen verdoppelt",
      "msExceeds": "Ertrag übersteigt Einzahlungen",
      "asmRate": "Erwartete Rendite",
      "asmTiming": "Zahlungszeitpunkt",
      "asmTimingVal": "Monatsende",
      "asmCompounding": "Verzinsung",
      "asmMonthly": "monatlich",
      "asmLump": "Starteinlage",
      "none": "keine",
      "decInflation": "Kaufkraft nach Inflation prüfen",
      "decCompound": "Mit reiner Einmalanlage vergleichen",
      "decGoal": "Nötige Monatsrate aus Zielwert berechnen",
      "q1": "Welche Monatsrate braucht mein Sparziel?",
      "q2": "Wie viel bringt ein um 5 Jahre früherer Start?",
      "expLumpTpl": " plus {lump} Startkapital",
      "explanationTpl": "Bei monatlich {monthly}{lumpClause} und {rate} Jahresrendite wächst der Plan nach {years} {unit} auf {final} (eingezahlt {invested}, Gewinn {gain}).",
      "vizTitle": "Sparplanwert im Zeitverlauf",
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
    "heroLabel": "Endvermögen",
    "heroNoteTpl": "nach {years} {unit}",
    "cardGain": "Wertzuwachs",
    "cardInvested": "Eingezahlt gesamt",
    "cardMonths": "Monatsraten",
    "brkLump": "Starteinlage",
    "brkMonthly": "Sparraten",
    "brkGrowth": "Rendite",
    "insShareTpl": "Der Marktertrag steuert {pct}% zum Endwert bei; der Rest stammt aus eigenen Einzahlungen.",
    "insAvg": "Durch gleichbleibende Monatsraten kaufst du bei niedrigeren Kursen mehr Anteile (Cost-Average-Effekt).",
    "msDoubled": "Einzahlungen verdoppelt",
    "msExceeds": "Ertrag übersteigt Einzahlungen",
    "asmRate": "Erwartete Rendite",
    "asmTiming": "Zahlungszeitpunkt",
    "asmTimingVal": "Monatsende",
    "asmCompounding": "Verzinsung",
    "asmMonthly": "monatlich",
    "asmLump": "Starteinlage",
    "none": "keine",
    "decInflation": "Kaufkraft nach Inflation prüfen",
    "decCompound": "Mit reiner Einmalanlage vergleichen",
    "decGoal": "Nötige Monatsrate aus Zielwert berechnen",
    "q1": "Welche Monatsrate braucht mein Sparziel?",
    "q2": "Wie viel bringt ein um 5 Jahre früherer Start?",
    "expLumpTpl": " plus {lump} Startkapital",
    "explanationTpl": "Bei monatlich {monthly}{lumpClause} und {rate} Jahresrendite wächst der Plan nach {years} {unit} auf {final} (eingezahlt {invested}, Gewinn {gain}).",
    "vizTitle": "Sparplanwert im Zeitverlauf",
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
    "monthly": {
      "label": "Monatliche Sparrate"
    },
    "rate": {
      "label": "Erwartete Jahresrendite"
    },
    "years": {
      "label": "Anlagedauer",
      "unit": "Jahre"
    },
    "initial": {
      "label": "Einmalige Starteinlage",
      "help": "Optional. Wird einmalig zu Beginn zusammen mit dem Sparplan angelegt."
    }
  }
};
