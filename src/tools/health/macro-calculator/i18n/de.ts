import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Makro-Rechner",
  "seoTitle": "Makro Rechner - Protein, Kohlenhydrate & Fett",
  "description": "Teile dein tägliches Kalorienziel in Gramm Protein, Kohlenhydrate und Fett auf: Ausgewogen, High-Protein, Low-Carb oder Keto.",
  "tagline": "Kalorienziel in Protein, Kohlenhydrate und Fett aufteilen.",
  "lead": "Rechne deinen täglichen Kalorienbedarf im Browser direkt in Gramm Protein, Kohlenhydrate und Fett für deine Ernährungsform um.",
  "craft": {
    "solves": "Frei gewählte Makro-Prozentsätze ergeben oft nicht 100 % und erzeugen unbemerkte Abweichungen vom eigentlichen Kalorienziel."
  },
  "guide": {
    "title": "Makronährstoffe aus Kalorien richtig berechnen",
    "description": "Was Makros bedeuten, wie Kalorien zu Gramm Protein, Kohlenhydraten und Fett werden und welche Aufteilung im Alltag hält."
  },
  "fields": {
    "calories": {
      "label": "Tageskalorien",
      "suffix": "kcal",
      "help": "Dein Tagesziel (ggf. zuerst im TDEE-Rechner ermitteln)."
    },
    "diet": {
      "label": "Ernährungsform",
      "options": {
        "balanced": "Ausgewogen (45% KH / 25% Prot. / 30% Fett)",
        "high-protein": "High-Protein (40 / 35 / 25)",
        "low-carb": "Low-Carb (25 / 35 / 40)",
        "keto": "Keto (5 / 25 / 70)"
      }
    }
  },
  "ui": {
    "emptyText": "Gib deine Tageskalorien ein und wähle ein Profil für deine Protein-, Kohlenhydrat- und Fettziele.",
    "engine": {
      "errEnterTpl": "Bitte {label} eingeben.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errMinTpl": "{label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{label} darf nicht größer als {max} sein.",
      "fieldDiet": "eine Ernährungsform",
      "fieldCalories": "deine Tageskalorien",
      "errCalZero": "Gib ein Kalorienziel größer Null ein.",
      "heroProtein": "Protein",
      "notePctKcalTpl": "{pct}% von {kcal} kcal",
      "notePctTpl": "{pct}% der Kalorien",
      "cardCarb": "Kohlenhydrate",
      "cardFat": "Fett",
      "cardSplit": "Verhältnis (KH/P/F)",
      "vizCarb": "Kohlenhydrate",
      "vizProtein": "Protein",
      "vizFat": "Fett",
      "vizTitle": "Deine Makroverteilung",
      "vizDescTpl": "{carb}% Kohlenhydrate, {protein}% Protein, {fat}% Fett bei {kcal} kcal.",
      "diets": {
        "balanced": "Ausgewogen",
        "high-protein": "High-Protein",
        "low-carb": "Low-Carb",
        "keto": "Keto"
      },
      "insSplitTpl": "Beim Profil {diet} mit {kcal} kcal ergeben sich rund {protein} g Protein, {carb} g Kohlenhydrate und {fat} g Fett.",
      "insEnergy": "Protein und Kohlenhydrate liefern je 4 kcal pro Gramm, Fett 9 kcal. Wähle das Verhältnis, das zu deinem Alltag passt.",
      "insTotal": "Die gesamte Kalorienmenge einzuhalten zählt mehr als das letzte Prozent im Makro-Split.",
      "asmDiet": "Ernährungsform",
      "asmEnergy": "Energie pro Gramm",
      "asmEnergyVal": "Protein 4, KH 4, Fett 9 kcal",
      "decTdee": "Tagesbedarf (TDEE) zuerst ermitteln",
      "decBmi": "BMI ergänzend prüfen",
      "q1": "Wie viele Kalorien brauche ich täglich?",
      "q2": "Wie viel Protein benötige ich?",
      "q3": "Welcher Makro-Split hilft beim Abnehmen?",
      "explanation": "Makros sind Protein (4 kcal/g), Kohlenhydrate (4 kcal/g) und Fett (9 kcal/g). Aus den gewählten Prozenten rechnet das Tool sofort die tägliche Grammzahl bei exakter 100-%-Summe aus."
    }
  },
  "knowledge": {
    "summary": "Teilt Tageskalorien mit geprüften Presets (Ausgewogen, High-Protein, Low-Carb, Keto) exakt in Gramm Makronährstoffe auf.",
    "useCases": [
      "Ein TDEE-Kalorienziel in greifbare Lebensmittel-Grammzahlen übersetzen",
      "High-Protein gegen Low-Carb oder Keto direkt vergleichen",
      "Mahlzeitenplanung für Diät oder Muskelaufbau strukturieren"
    ],
    "mistakes": [
      "Beliebige Prozentzahlen kombinieren, die nicht 100 % ergeben",
      "Bei sehr hohen/niedrigen Kalorien den absoluten Proteinbedarf aus dem Blick verlieren",
      "Gramm-Perfektion über verlässliche Gesamtkalorien stellen"
    ]
  },
  "faqs": [
    {
      "id": "macro-calculator-faq-1",
      "question": "Wie berechne ich meine Makros?",
      "answer": "Nimm dein Kalorienziel, multipliziere mit dem Anteil jedes Makros und teile durch 4 (Protein & KH) bzw. 9 (Fett)."
    },
    {
      "id": "macro-calculator-faq-2",
      "question": "Was ist ein guter Makro-Split zum Abnehmen?",
      "answer": "Ein proteinbetonter Split wie 40 % Kohlenhydrate, 35 % Protein und 25 % Fett sättigt besser und schützt Muskulatur."
    },
    {
      "id": "macro-calculator-faq-3",
      "question": "Wie viel Eiweiß sollte ich essen?",
      "answer": "Trainierende profitieren meist von 1,6 bis 2,2 g je kg Körpergewicht; die Vorgaben landen bei typischer Energiezufuhr genau dort."
    },
    {
      "id": "macro-calculator-faq-4",
      "question": "Worin unterscheiden sich die Diät-Presets?",
      "answer": "Ausgewogen setzt auf 45/25/30, High-Protein auf 35 % Protein, Low-Carb drosselt KH auf 25 % und Keto auf strenge 5 %."
    },
    {
      "id": "macro-calculator-faq-5",
      "question": "Muss ich jedes Gramm exakt treffen?",
      "answer": "Nein. Eine Abweichung von +/- 5-10 g ist im Alltag völlig unkritisch, solange Gesamtkalorien und Protein ungefähr stimmen."
    },
    {
      "id": "macro-calculator-faq-6",
      "question": "Woher bekomme ich mein Kalorienziel?",
      "answer": "Berechne mit dem TDEE- oder Kaloriendefizit-Rechner deinen individuellen Tagesbedarf."
    }
  ]
};
