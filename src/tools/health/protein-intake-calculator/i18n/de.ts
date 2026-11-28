import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Proteinbedarf-Rechner",
  "seoTitle": "Proteinbedarf Rechner - Gramm pro Tag nach Gewicht",
  "description": "Berechne deinen täglichen Eiweißbedarf nach Körpergewicht und Trainingsziel in g/kg inklusive Portionierung pro Mahlzeit.",
  "tagline": "Die Proteinspanne passend zu Gewicht und Trainingsziel.",
  "lead": "Ermittle deinen täglichen Eiweißbedarf in Gramm pro Kilogramm sowie die optimale Proteinmenge je Mahlzeit direkt im Browser.",
  "craft": {
    "solves": "Muskelproteinsynthese reagiert pro Mahlzeit; wer sein gesamtes Protein erst abends isst, verschenkt Reize gegenüber gleichmäßiger Verteilung."
  },
  "guide": {
    "title": "Wie viel Protein du wirklich pro Tag brauchst",
    "description": "Warum Empfehlungen Spannen statt Einzelzahlen nennen, weshalb 0,8 g/kg nur das Minimum markiert und wie die Aufteilung pro Mahlzeit hilft."
  },
  "fields": {
    "unit": {
      "label": "Einheiten",
      "options": {
        "metric": "Metrisch (kg)",
        "imperial": "Imperial (lb)"
      }
    },
    "weight": {
      "label": "Körpergewicht",
      "help": "Kilogramm metrisch, Pfund imperial."
    },
    "goal": {
      "label": "Trainingsziel",
      "options": {
        "sedentary": "Überwiegend sitzend, allgemeine Gesundheit",
        "active": "Allgemein aktiv ohne festen Plan",
        "endurance": "Ausdauersport (Laufen, Radfahren)",
        "strength": "Krafttraining oder Muskelaufbau",
        "fat-loss": "Fettabbau mit Muskelschutz"
      }
    },
    "meals": {
      "label": "Mahlzeiten pro Tag",
      "suffix": "Mahlzeiten"
    }
  },
  "ui": {
    "emptyText": "Gib dein Gewicht und Trainingsziel ein, um deine tägliche Proteinspanne zu berechnen.",
    "engine": {
      "errEnterTpl": "Bitte {label} eingeben.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errMinTpl": "{label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{label} darf nicht größer als {max} sein.",
      "fieldUnit": "dein Einheitensystem",
      "fieldGoal": "dein Trainingsziel",
      "fieldWeight": "dein Körpergewicht",
      "fieldMeals": "Mahlzeiten pro Tag",
      "errWeightZero": "Gib ein Körpergewicht größer Null ein.",
      "goals": {
        "sedentary": "allgemeine Gesundheit",
        "active": "allgemeine Aktivität",
        "endurance": "Ausdauertraining",
        "strength": "Krafttraining oder Muskelaufbau",
        "fat-loss": "Fettabbau bei Muskelerhalt"
      },
      "heroLabel": "Protein pro Tag",
      "rangeTpl": "{lo} bis {hi}",
      "cardMid": "Richtwert in der Mitte",
      "cardMealTpl": "Pro Mahlzeit bei {n} Mahlzeiten",
      "cardPerKg": "Gramm pro Kilogramm",
      "perKgTpl": "{lo} bis {hi} g/kg",
      "cardKcal": "Kalorien aus Protein",
      "bandGen": "Gesundheit",
      "bandActive": "Aktiv",
      "bandTrain": "Training",
      "bandCut": "Diät / Cut",
      "insRangeTpl": "Bei {kg} kg für {goal} liegt deine Empfehlung bei {loKg} bis {hiKg} g/kg ({lo} bis {hi} täglich).",
      "insMealTpl": "Verteilt auf {n} Mahlzeiten entspricht das etwa {meal} je Mahlzeit.",
      "insBand": "Fachgesellschaften geben Spannen an, weil individuelle Ansprüche schwanken. Jeder Wert innerhalb deines Korridors passt.",
      "vizTitle": "Dein Bereich innerhalb der Leitlinien (g/kg)",
      "vizDescTpl": "Empfohlene Spanne: {lo} bis {hi} Gramm pro Kilogramm Körpergewicht.",
      "vizHighlight": "dein Bereich",
      "asmUnits": "Einheiten",
      "asmMetric": "metrisch (kg)",
      "asmImp": "imperial (lb)",
      "asmSource": "Quelle",
      "asmSourceVal": "ISSN- und ACSM-Positionspapiere",
      "asmBasis": "Berechnungsbasis",
      "asmBasisVal": "Gesamtgewicht, nicht Magermasse",
      "decMacro": "Als kompletten Makro-Split ansehen",
      "decTdee": "Tageskalorien (TDEE) prüfen",
      "decBf": "Mit KFA auf Magermasse verfeinern",
      "q1": "Wie viel Protein brauche ich pro Tag?",
      "q2": "Ist zu viel Eiweiß schädlich?",
      "q3": "Sollte Protein nach Gesamtgewicht oder Magermasse berechnet werden?",
      "explanation": "Der Eiweißbedarf richtet sich nach Körpergewicht und Trainingsreiz. 0,8 g/kg gilt lediglich als Mangeluntergrenze; für Aktive empfehlen ISSN und ACSM 1,2-1,6 g/kg und bei Krafttraining 1,6-2,2 g/kg."
    }
  },
  "knowledge": {
    "summary": "Berechnet die optimale tägliche Proteinspanne je nach Gewicht und Ziel inklusive Gramm pro Kilogramm und je Mahlzeit.",
    "useCases": [
      "Eiweißziel für Muskelaufbau oder Muskelschutz im Kaloriendefizit ermitteln",
      "Tagesbedarf gleichmäßig auf 3 bis 5 Mahlzeiten aufteilen",
      "Bedarf nach Gesamtgewicht oder fettfreier Masse einordnen"
    ],
    "mistakes": [
      "Die Mindestmenge von 0,8 g/kg mit einem sportlichen Zielwert verwechseln",
      "Fast das gesamte Eiweiß erst abends in einer Mahlzeit essen"
    ]
  },
  "faqs": [
    {
      "id": "protein-intake-calculator-faq-1",
      "question": "Wie viel Protein brauche ich täglich?",
      "answer": "Bei 70 kg etwa 56-70 g ohne Training, 84-112 g bei Aktivität, 112-154 g beim Krafttraining und bis ca. 126-168 g während einer Diät."
    },
    {
      "id": "protein-intake-calculator-faq-2",
      "question": "Warum nennt der Rechner eine Spanne statt einer Einzelzahl?",
      "answer": "Studien von ISSN und ACSM arbeiten mit Zielbereichen, da Trainingsumfang und Kalorienzufuhr schwanken."
    },
    {
      "id": "protein-intake-calculator-faq-3",
      "question": "Ist zu viel Eiweiß schädlich?",
      "answer": "Bei gesunden Nieren zeigen Studien bis deutlich über 2 g/kg keine negativen Folgen; bei Nierenerkrankungen ärztlichen Rat einholen."
    },
    {
      "id": "protein-intake-calculator-faq-4",
      "question": "Nach Gesamtgewicht oder nach fettfreier Masse rechnen?",
      "answer": "Bei höherem Körperfettanteil liefert die Berechnung auf Basis der Magermasse mit denselben g/kg-Faktoren einen passenderen Wert."
    },
    {
      "id": "protein-intake-calculator-faq-5",
      "question": "Spielt die Verteilung über den Tag eine Rolle?",
      "answer": "Ja. Gleichmäßige Portionen von rund 0,4 g/kg pro Mahlzeit unterstützen die Muskelproteinsynthese über den Tag hinweg optimal."
    },
    {
      "id": "protein-intake-calculator-faq-6",
      "question": "Brauche ich zwingend Proteinpulver?",
      "answer": "Nein. Eier, Fleisch, Fisch, Quark und Hülsenfrüchte decken auch 150 g problemlos; Shakes sind lediglich bequem."
    }
  ]
};
