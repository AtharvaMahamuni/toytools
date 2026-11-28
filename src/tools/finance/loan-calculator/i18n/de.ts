import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "loan-calculator",
  "name": "Kreditrechner",
  "seoTitle": "Kreditrechner: Monatsrate & Tilgung Online",
  "description": "Berechne Monatsrate, Gesamtzinsen und Ersparnis durch Sondertilgung für Ratenkredite oder Baufinanzierungen direkt im Browser.",
  "tagline": "Monatsrate, Zinskosten und Wirkung von Sondertilgungen.",
  "methodology": {
    "name": "Annuitätendarlehen",
    "detail": "Der Jahreszins wird durch 12 geteilt; monatliche Sondertilgungen senken direkt die Restschuld."
  },
  "knowledge": {
    "primaryConcepts": [
      "Kreditrechner",
      "Monatsrate"
    ],
    "realWorldUseCases": [
      "Monatsrate eines Ratenkredits vor Abschluss prüfen",
      "20-jährige und 30-jährige Baufinanzierung vergleichen",
      "Zinsersparnis durch monatliche Sondertilgung berechnen",
      "Kaufpreis sauber um Anzahlung reduzieren"
    ],
    "commonMistakes": [
      "Monatszins wie 2 in das Jahreszins-Feld eintragen",
      "Laufzeit in Jahren irrtümlich als Monate lesen",
      "Sondertilgung als Vorschuss auf die nächste Monatsrate verstehen"
    ]
  },
  "faqs": [
    {
      "id": "loan-faq-payment",
      "question": "Wie wird die monatliche Kreditrate berechnet?",
      "answer": "Der Jahreszins wird durch 12 geteilt und über die Annuitätenformel auf alle Monate verteilt. 100.000 zu 12% über 5 Jahre ergeben 2.224,44 pro Monat und 33.466,83 Gesamtzins."
    },
    {
      "id": "loan-faq-rate-unit",
      "question": "Was bedeutet ein Zinssatz von 2% im Eingabefeld?",
      "answer": "Es handelt sich immer um einen Jahreszins (2% pro Monat wären 24% p. a.). Unter 3% oder über 36% blendet der Rechner einen klaren Hinweis ein."
    },
    {
      "id": "loan-faq-extra",
      "question": "Senkt eine monatliche Sondertilgung die Zinsen?",
      "answer": "Ja, denn jede zusätzliche Zahlung tilgt unmittelbar Restschuld, wodurch Zinsen entfallen und der Kredit schneller abbezahlt ist."
    },
    {
      "id": "loan-faq-home",
      "question": "Gilt bei einer Baufinanzierung dieselbe Formel?",
      "answer": "Ja. Trage Kaufpreis, Eigenkapital als Anzahlung und Laufzeit in Jahren ein; die Formel entspricht dem klassischen Annuitätendarlehen."
    },
    {
      "id": "loan-faq-left-out",
      "question": "Sind Notarkosten, Steuern oder Bankgebühren enthalten?",
      "answer": "Nein. Berechnet werden ausschließlich Tilgung und Sollzins ohne Nebenkosten oder Versicherungen."
    },
    {
      "id": "loan-faq-high-rate",
      "question": "Warum sinkt die Restschuld bei extremem Zinssatz nicht?",
      "answer": "Wenn die Zinslast höher liegt als die monatliche Tilgungsrate, bleibt das Darlehen offen stehen. Senke den Zinssatz oder ergänze eine Sondertilgung."
    },
    {
      "id": "loan-faq-privacy",
      "question": "Werden meine Kreditdaten gespeichert?",
      "answer": "Nein. Alle Berechnungen finden rein lokal auf deinem Gerät statt."
    }
  ],
  "guide": {
    "title": "Wie sich die monatliche Kreditrate berechnet",
    "description": "Annuitätenformel, Anzahlung, Jahreszins-Fallstricke und Nutzen monatlicher Sondertilgung."
  },
  "ui": {
    "scenarios": {
      "Personal loan": "Ratenkredit",
      "Home loan, 15 years": "Hauskredit 15 J.",
      "Home loan, 20 years": "Hauskredit 20 J.",
      "Home loan, 30 years": "Hauskredit 30 J."
    },
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "monthOne": "Monat",
      "monthMany": "Monate",
      "none": "keine",
      "yearlyRateToken": "ist ein Jahreszins",
      "noteLowRateTpl": "{rate} ist ein Jahreszins. {rate} pro Monat entspräche {annualized} pro Jahr und wird hier nicht verwendet.",
      "noteHighRateTpl": "{rate} ist ein Jahreszins, etwa {monthly} pro Monat. Die Rate nutzt den Jahreszins.",
      "errShortTerm": "Mindestlaufzeit ist ein Monat (0.08 für 1 Monat oder 0.5 für 6 Monate).",
      "errNoBorrow": "Nach dieser Anzahlung verbleibt kein Kreditbedarf.",
      "errUnpaid": "Bei diesem Jahreszins und dieser Laufzeit wird die Schuld nie getilgt. Senke den Zins oder erhöhe die Tilgung.",
      "underTpl": "Unter {amt}",
      "heroLabel": "Monatsrate",
      "cardBorrowed": "Kreditsumme",
      "cardInterest": "Zinskosten gesamt",
      "cardTotal": "Gesamtaufwand",
      "cardPayoff": "Laufzeit",
      "cardSaved": "Zinsen gespart",
      "insExtraTpl": "Eine Sondertilgung von {extra} pro Monat verkürzt die Laufzeit auf {payoff} und spart {saved} Zinsen.",
      "insZero": "Bei 0% Zins wird der Betrag gleichmäßig auf die Monate aufgeteilt.",
      "insShareTpl": "Der Zinsanteil macht {pct}% der gesamten Rückzahlung aus.",
      "insTiny": "Die Zinsen liegen unter einem halben Cent.",
      "msPaid": "Vollständig getilgt",
      "msShortened": "Sondertilgung verkürzt Laufzeit",
      "asmRate": "Jahreszins",
      "asmSchedule": "Zahlplan",
      "asmScheduleVal": "Monatlich (Jahreszins geteilt durch 12).",
      "asmDown": "Anzahlung",
      "asmExtra": "Sondertilgung",
      "asmExtraTpl": "{extra} monatlich direkt zur Tilgung",
      "brkPrincipal": "Tilgung",
      "brkInterest": "Zinsen",
      "decSip": "Vergleich: Monatsrate stattdessen monatlich anlegen",
      "decCompound": "Einmalanlage mit Zinseszins gegenrechnen",
      "q1": "Wie viel früher bin ich durch Sondertilgung schuldenfrei?",
      "q2": "Was würde aus der Rate als Sparplan?",
      "expShortTpl": " Mit {extra} monatlicher Sondertilgung ist der Kredit in {payoff} abbezahlt.",
      "explanationTpl": "Für {principal} zu {rate} p. a. über {term} beträgt die Rate {payment} im Monat; die Zinsen summieren sich auf {interest}.{shortened}",
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
    "monthOne": "Monat",
    "monthMany": "Monate",
    "none": "keine",
    "yearlyRateToken": "ist ein Jahreszins",
    "noteLowRateTpl": "{rate} ist ein Jahreszins. {rate} pro Monat entspräche {annualized} pro Jahr und wird hier nicht verwendet.",
    "noteHighRateTpl": "{rate} ist ein Jahreszins, etwa {monthly} pro Monat. Die Rate nutzt den Jahreszins.",
    "errShortTerm": "Mindestlaufzeit ist ein Monat (0.08 für 1 Monat oder 0.5 für 6 Monate).",
    "errNoBorrow": "Nach dieser Anzahlung verbleibt kein Kreditbedarf.",
    "errUnpaid": "Bei diesem Jahreszins und dieser Laufzeit wird die Schuld nie getilgt. Senke den Zins oder erhöhe die Tilgung.",
    "underTpl": "Unter {amt}",
    "heroLabel": "Monatsrate",
    "cardBorrowed": "Kreditsumme",
    "cardInterest": "Zinskosten gesamt",
    "cardTotal": "Gesamtaufwand",
    "cardPayoff": "Laufzeit",
    "cardSaved": "Zinsen gespart",
    "insExtraTpl": "Eine Sondertilgung von {extra} pro Monat verkürzt die Laufzeit auf {payoff} und spart {saved} Zinsen.",
    "insZero": "Bei 0% Zins wird der Betrag gleichmäßig auf die Monate aufgeteilt.",
    "insShareTpl": "Der Zinsanteil macht {pct}% der gesamten Rückzahlung aus.",
    "insTiny": "Die Zinsen liegen unter einem halben Cent.",
    "msPaid": "Vollständig getilgt",
    "msShortened": "Sondertilgung verkürzt Laufzeit",
    "asmRate": "Jahreszins",
    "asmSchedule": "Zahlplan",
    "asmScheduleVal": "Monatlich (Jahreszins geteilt durch 12).",
    "asmDown": "Anzahlung",
    "asmExtra": "Sondertilgung",
    "asmExtraTpl": "{extra} monatlich direkt zur Tilgung",
    "brkPrincipal": "Tilgung",
    "brkInterest": "Zinsen",
    "decSip": "Vergleich: Monatsrate stattdessen monatlich anlegen",
    "decCompound": "Einmalanlage mit Zinseszins gegenrechnen",
    "q1": "Wie viel früher bin ich durch Sondertilgung schuldenfrei?",
    "q2": "Was würde aus der Rate als Sparplan?",
    "expShortTpl": " Mit {extra} monatlicher Sondertilgung ist der Kredit in {payoff} abbezahlt.",
    "explanationTpl": "Für {principal} zu {rate} p. a. über {term} beträgt die Rate {payment} im Monat; die Zinsen summieren sich auf {interest}.{shortened}",
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
    "price": {
      "label": "Kaufpreis oder Kreditbetrag"
    },
    "down": {
      "label": "Anzahlung",
      "help": "Optional. Wird direkt vom Finanzierungsbetrag abgezogen."
    },
    "rate": {
      "label": "Jährlicher Zinssatz"
    },
    "years": {
      "label": "Laufzeit",
      "unit": "Jahre",
      "help": "Unter einem Jahr als Bruch eingeben: 0.5 = 6 Monate."
    },
    "extra": {
      "label": "Monatliche Sondertilgung",
      "help": "Optional. Fließt zusätzlich zur Rate direkt in die Tilgung."
    }
  }
};
