import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "savings-goal-calculator",
  "name": "Sparziel-Rechner",
  "seoTitle": "Sparziel-Rechner: Monatliche Sparrate Berechnen",
  "description": "Berechne deine nötige monatliche Sparrate für ein festes Ziel inklusive Startguthaben und erwarteter Rendite direkt im Browser.",
  "tagline": "Wie viel du monatlich für ein Sparziel zurücklegen musst.",
  "methodology": {
    "name": "Umgekehrte Rentenformel",
    "detail": "Löst die Sparplanformel nach der monatlichen Rate unter Einrechnung vorhandener Ersparnisse auf."
  },
  "knowledge": {
    "primaryConcepts": [
      "Sparziel"
    ],
    "realWorldUseCases": [
      "Eigenkapital für den Immobilienkauf ansparen",
      "Budget für Hochzeit oder Autokauf planen",
      "Dauerauftrag exakt passend zum Zieldatum einrichten",
      "Machbarkeit eines Sparplans prüfen"
    ],
    "commonMistakes": [
      "Zu hohe Rendite für kurzfristige Ziele unterstellen",
      "Vorhandenes Startkapital vergessen"
    ]
  },
  "faqs": [
    {
      "id": "sg-faq-1",
      "question": "Wie viel muss ich monatlich für mein Ziel sparen?",
      "answer": "Das hängt von Zielhöhe, vorhandenem Startkapital, Anlagedauer und Rendite ab. Der Rechner bestimmt exakt die gleichbleibende Monatsrate."
    },
    {
      "id": "sg-faq-2",
      "question": "Wie senken Zinsen oder Renditen meine Sparrate?",
      "answer": "Erträge übernehmen einen wachsenden Teil des Ziels. Höhere angenommene Renditen reduzieren die Rate, erhöhen aber auch das Risiko."
    },
    {
      "id": "sg-faq-3",
      "question": "Welche Rendite ist realistisch?",
      "answer": "Bei kurzen Zielen bis 2 Jahren lieber niedrige sichere Zinsen wählen; bei längeren Horizonten sind moderate Misch- oder ETF-Raten üblich."
    },
    {
      "id": "sg-faq-4",
      "question": "Was passiert, wenn ich später starte?",
      "answer": "Kürzere Zeit lässt dem Zinseszins wenig Raum, weshalb die benötigte Monatsrate sprunghaft ansteigt."
    },
    {
      "id": "sg-faq-5",
      "question": "Soll ich vorhandenes Erspartes angeben?",
      "answer": "Ja, denn es wächst mit und senkt den monatlichen Bedarf spürbar."
    },
    {
      "id": "sg-faq-6",
      "question": "Erst einen Notgroschen aufbauen?",
      "answer": "In der Regel ja, damit unerwartete Ausgaben deinen Sparplan nicht unterbrechen."
    },
    {
      "id": "sg-faq-7",
      "question": "Ist die Inflation eingerechnet?",
      "answer": "Nein. Bei mehrjährigen Zielen empfiehlt es sich, das Ziel vorher mit dem Inflationsrechner anzupassen."
    },
    {
      "id": "sg-faq-8",
      "question": "Bleiben meine Zahlen auf meinem Gerät?",
      "answer": "Ja, sämtliche Berechnungen bleiben lokal im Browser."
    }
  ],
  "guide": {
    "title": "Wie du ein Sparziel systematisch erreichst",
    "description": "Monatsrate berechnen, Einfluss der Anlagedauer und sinnvolle Zinssätze nach Zielhorizont."
  },
  "ui": {
    "scenarios": {
      "Home down payment": "Hausanzahlung",
      "Wedding": "Hochzeit",
      "New car": "Neues Auto"
    },
    "engine": {
      "yearOne": "Jahr",
      "yearMany": "Jahre",
      "heroLabel": "Monatlich sparen",
      "heroNoteTpl": "für {months} Monate",
      "cardInvested": "Eigene Einzahlungen",
      "cardInterest": "Zuwachs durch Rendite",
      "cardGoal": "Sparziel",
      "errMinMonths": "Gib mindestens einige Monate Spardauer an.",
      "insMet": "Dein aktuelles Guthaben deckt das Sparziel bereits ab.",
      "insReturnsTpl": "Erträge steuern {interest} bei, sodass du weniger selbst einzahlen musst.",
      "insEarlier": "Ein früherer Start lässt Erträge stärker mitarbeiten und senkt die Monatsrate deutlich.",
      "msMet": "Ziel bereits erreicht",
      "msReturns": "Erträge tragen zum Ziel bei",
      "asmRate": "Erwartete Rendite",
      "asmHorizon": "Zeithorizont",
      "asmStart": "Startguthaben",
      "decCompound": "Wachstum mit dem Zinseszinsrechner verfolgen",
      "decInflation": "Zielbetrag gegen Inflation prüfen",
      "decEmergency": "Notgroschen zuerst absichern",
      "q1": "Was passiert bei geringerer Rendite?",
      "q2": "Wie verändert Inflation mein Sparziel?",
      "expMetTpl": "Mit {current} Startguthaben ist das Ziel {goal} bereits erreicht.",
      "explanationTpl": "Um {goal} in {years} {unit} mit {current} Startguthaben bei {rate} Rendite zu erreichen, spare {monthly} pro Monat.",
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
    "heroLabel": "Monatlich sparen",
    "heroNoteTpl": "für {months} Monate",
    "cardInvested": "Eigene Einzahlungen",
    "cardInterest": "Zuwachs durch Rendite",
    "cardGoal": "Sparziel",
    "errMinMonths": "Gib mindestens einige Monate Spardauer an.",
    "insMet": "Dein aktuelles Guthaben deckt das Sparziel bereits ab.",
    "insReturnsTpl": "Erträge steuern {interest} bei, sodass du weniger selbst einzahlen musst.",
    "insEarlier": "Ein früherer Start lässt Erträge stärker mitarbeiten und senkt die Monatsrate deutlich.",
    "msMet": "Ziel bereits erreicht",
    "msReturns": "Erträge tragen zum Ziel bei",
    "asmRate": "Erwartete Rendite",
    "asmHorizon": "Zeithorizont",
    "asmStart": "Startguthaben",
    "decCompound": "Wachstum mit dem Zinseszinsrechner verfolgen",
    "decInflation": "Zielbetrag gegen Inflation prüfen",
    "decEmergency": "Notgroschen zuerst absichern",
    "q1": "Was passiert bei geringerer Rendite?",
    "q2": "Wie verändert Inflation mein Sparziel?",
    "expMetTpl": "Mit {current} Startguthaben ist das Ziel {goal} bereits erreicht.",
    "explanationTpl": "Um {goal} in {years} {unit} mit {current} Startguthaben bei {rate} Rendite zu erreichen, spare {monthly} pro Monat.",
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
    "goal": {
      "label": "Sparziel"
    },
    "current": {
      "label": "Aktuelles Guthaben"
    },
    "rate": {
      "label": "Erwartete Jahresrendite"
    },
    "years": {
      "label": "Spardauer",
      "unit": "Jahre"
    }
  }
};
