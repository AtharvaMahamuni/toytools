import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Kaloriendefizit-Rechner",
  "seoTitle": "Kaloriendefizit Rechner - Tagesziel & Zeitplan",
  "description": "Berechne dein tägliches Kaloriendefizit für nachhaltiges Abnehmen, deinen BMR-Mindestwert und die voraussichtlichen Wochen bis zum Zielgewicht.",
  "tagline": "Tägliche Zielkalorien und Zeitplan für dein Abnehmtempo.",
  "lead": "Ermittle dein sicheres tägliches Kalorienziel inklusive Grundumsatz-Untergrenze (BMR) und Meilensteinen bis zu deinem Wunschgewicht.",
  "craft": {
    "solves": "Ein einmal festgelegtes Defizit schrumpft mit sinkendem Körpergewicht unbemerkt, sodass die Abnahme scheinbar grundlos stagniert."
  },
  "guide": {
    "title": "Kaloriendefizit richtig berechnen und anpassen",
    "description": "Woher die 7.700 kcal pro Kilogramm kommen, warum Essen unter dem Grundumsatz bremst und wann du das Kalorienziel neu anpasst."
  },
  "fields": {
    "unit": {
      "label": "Einheiten",
      "options": {
        "metric": "Metrisch (kg, cm)",
        "imperial": "Imperial (lb, in)"
      }
    },
    "sex": {
      "label": "Geschlecht",
      "options": {
        "male": "Männlich",
        "female": "Weiblich"
      },
      "help": "Für die BMR-Gleichung benötigt; wähle das metabolisch passende Geschlecht."
    },
    "age": {
      "label": "Alter",
      "suffix": "Jahre"
    },
    "weight": {
      "label": "Aktuelles Gewicht",
      "help": "Kilogramm metrisch, Pfund imperial."
    },
    "height": {
      "label": "Größe",
      "help": "Zentimeter metrisch, Gesamtzoll imperial."
    },
    "activity": {
      "label": "Aktivitätsniveau",
      "options": {
        "sedentary": "Sitzend (Büro, kein Sport)",
        "light": "Leicht aktiv (1-3 Tage/Woche)",
        "moderate": "Moderat aktiv (3-5 Tage/Woche)",
        "active": "Aktiv (6-7 Tage/Woche)",
        "very-active": "Sehr aktiv (intensives Training / körperliche Arbeit)"
      }
    },
    "rate": {
      "label": "Gewichtsverlust pro Woche",
      "options": {
        "1": "1 kg pro Woche (sehr streng)",
        "0.25": "0,25 kg pro Woche (sanft)",
        "0.5": "0,5 kg pro Woche (Standard)",
        "0.75": "0,75 kg pro Woche (ambitioniert)"
      }
    },
    "goal": {
      "label": "Zielgewicht",
      "help": "Für reine Zielkalorien ohne Zeitachse leer lassen."
    }
  },
  "ui": {
    "emptyText": "Gib deine Daten und das gewünschte Tempo ein, um Tageskalorien und Zeitplan zu berechnen.",
    "engine": {
      "errEnterTpl": "Bitte {label} eingeben.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errMinTpl": "{label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{label} darf nicht größer als {max} sein.",
      "fieldUnit": "dein Einheitensystem",
      "fieldSex": "ein Geschlecht für die BMR-Formel",
      "fieldActivity": "dein Aktivitätsniveau",
      "fieldRate": "eine Abnehmrate",
      "fieldAge": "dein Alter",
      "fieldWeight": "dein Gewicht",
      "fieldHeight": "deine Körpergröße",
      "fieldGoal": "dein Zielgewicht",
      "errWeightZero": "Gib ein aktuelles Gewicht über Null ein.",
      "errHeightZero": "Gib eine Körpergröße über Null ein.",
      "heroLabel": "Täglich essen",
      "noteFloorTpl": "Obergrenze dieses Rechners, etwa {kg} kg pro Woche",
      "noteRateTpl": "um {kg} kg pro Woche abzunehmen",
      "cardMaint": "Erhaltungskalorien",
      "cardDailyDef": "Tägliches Defizit",
      "cardWeeklyDef": "Wöchentliches Defizit",
      "cardBmr": "Grundumsatz (BMR)",
      "cardLeft": "Noch abzunehmen",
      "cardWeeks": "Dauer bei diesem Tempo",
      "weeksTpl": "{n} Wochen",
      "msQuarterTpl": "Ein Viertel geschafft, {w}",
      "msHalfTpl": "Halbzeit, {w}",
      "msGoalTpl": "Zielgewicht, {w}",
      "insMainTpl": "Dein Erhaltungsbedarf liegt bei {maint}. Mit {target} erreichst du ein Defizit von {daily} kcal pro Tag ({weekly} kcal pro Woche).",
      "insFloorTpl": "{kg} kg pro Woche würden deinen Grundumsatz ({bmr}) unterschreiten; daher begrenzen wir das Ziel auf diese Untergrenze.",
      "insWater": "Ein Kilogramm Körperfett speichert etwa 7.700 kcal. Wassereinlagerungen können reale Fortschritte kurzfristig überdecken.",
      "stepMetric": "4 bis 5 kg",
      "stepImp": "10 lb",
      "insRecalcTpl": "Berechne dein Ziel alle {step} neu, da ein leichterer Körper weniger Energie verbraucht.",
      "vizEat": "Zufuhr",
      "vizGap": "Defizit",
      "vizTitle": "Deine Zufuhr im Vergleich zum Bedarf",
      "vizDescTpl": "{pct} % Einsparung gegenüber deinen geschätzten Erhaltungskalorien von {maint}.",
      "asmUnits": "Einheiten",
      "asmMetric": "Metrisch (kg, cm)",
      "asmImp": "Imperial (lb, in)",
      "asmFormula": "BMR-Formel",
      "asmEnergy": "Energie je kg",
      "asmFloor": "Untergrenze",
      "decTdee": "Reinen TDEE-Bedarf prüfen",
      "decMacro": "Kalorien in Makronährstoffe aufteilen",
      "decTrack": "Wöchentlichen Gewichtsverlauf verfolgen",
      "q1": "Wie groß sollte ein Kaloriendefizit sein?",
      "q2": "Wie lange dauert mein Abnehmziel?",
      "q3": "Warum stagniert mein Gewicht plötzlich?",
      "explanation": "Ein Kaloriendefizit ist der Abstand zwischen täglichem Verbrauch und Nahrungszufuhr. Ausgehend vom Mifflin-St-Jeor-Grundumsatz samt Aktivitätsfaktor benötigt 0,5 kg Abnahme pro Woche rund 550 kcal Defizit täglich, ohne den Grundumsatz dauerhaft zu unterschreiten."
    }
  },
  "knowledge": {
    "summary": "Berechnet dein tägliches Kalorienziel mit Grundumsatz-Untergrenze und wöchentlicher Prognose bis zum Wunschgewicht.",
    "useCases": [
      "Realistisches Kalorienziel festlegen ohne extremen Muskelverlust",
      "Wochen bis zum Zielgewicht realistisch abschätzen",
      "Prüfen, ob 1 kg pro Woche unter den Grundumsatz drücken würde"
    ],
    "mistakes": [
      "Das aggressivste Defizit unterhalb des Grundumsatzes wählen",
      "Das Kalorienziel nach mehreren verlorenen Kilos nie aktualisieren",
      "Einzelne Tageswiegewerte überbewerten"
    ]
  },
  "faqs": [
    {
      "id": "calorie-deficit-calculator-faq-1",
      "question": "Wie groß sollte ein Kaloriendefizit sein?",
      "answer": "Für die meisten Menschen sind 0,5 bis 1 % Körpergewicht pro Woche (bei 80 kg etwa 440 bis 880 kcal/Tag) nachhaltig und muskelschonend."
    },
    {
      "id": "calorie-deficit-calculator-faq-2",
      "question": "Woher stammt der Wert 7.700 kcal pro Kilogramm?",
      "answer": "Ein Kilogramm Körperfettgewebe liefert rund 7.700 kcal nutzbare Energie – geteilt durch sieben Tage ergibt das ca. 1.100 kcal/Tag für 1 kg wöchentlich."
    },
    {
      "id": "calorie-deficit-calculator-faq-3",
      "question": "Warum stagniert meine Gewichtsabnahme?",
      "answer": "Ein leichterer Körper verbrennt weniger Grundkalorien, sodass das frühere Defizit schrumpft. Zudem maskieren Wasserschwankungen echte Fettabnahme."
    },
    {
      "id": "calorie-deficit-calculator-faq-4",
      "question": "Lieber weniger essen oder mehr bewegen?",
      "answer": "Die Kombination überzeugt: Weniger essen lässt sich exakt dosieren, während zusätzliche Bewegung mehr Essensspielraum im Alltag erlaubt."
    },
    {
      "id": "calorie-deficit-calculator-faq-5",
      "question": "Was passiert bei dauerhafter Zufuhr unter dem Grundumsatz?",
      "answer": "Leistungsfähigkeit und Muskelschutz sinken rapide. Deshalb deckelt dieser Rechner das Ziel sicher beim BMR."
    },
    {
      "id": "calorie-deficit-calculator-faq-6",
      "question": "Wie genau ist die berechnete Wochenzahl?",
      "answer": "Als linearer Richtwert unter idealen Bedingungen gedacht: Nutze ihn zur Planung des Zeitrahmens und justiere nach realen Wochentrends."
    }
  ]
};
