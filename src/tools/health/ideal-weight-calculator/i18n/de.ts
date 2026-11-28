import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Idealgewicht-Rechner",
  "seoTitle": "Idealgewicht Rechner - Devine, Robinson, Miller & Hamwi",
  "description": "Berechne dein Idealgewicht nach Größe und Geschlecht mit den Formeln Devine, Robinson, Miller und Hamwi plus modernem BMI-Normalbereich.",
  "tagline": "Idealgewicht aus vier Klassikformeln plus gesundem BMI-Korridor.",
  "lead": "Vergleiche Devine, Robinson, Miller und Hamwi direkt neben deinem gesunden BMI-Gewichtsbereich (18,5 bis 24,9) im Browser.",
  "craft": {
    "solves": "Einzelformeln liefern einen starren Zielwert ohne Knochenbau oder Muskeln zu kennen; der kombinierte BMI-Korridor schafft einen realistischen Rahmen."
  },
  "guide": {
    "title": "Idealgewicht-Formeln und BMI-Korridor",
    "description": "Wie Devine, Robinson, Miller und Hamwi rechnen, warum die Ergebnisse auseinanderliegen und weshalb ein Gewichtskorridor sinnvoller ist."
  },
  "fields": {
    "unit": {
      "label": "Einheiten",
      "options": {
        "metric": "Metrisch (cm)",
        "imperial": "Imperial (in)"
      }
    },
    "sex": {
      "label": "Geschlecht",
      "options": {
        "male": "Männlich",
        "female": "Weiblich"
      }
    },
    "height": {
      "label": "Körpergröße",
      "help": "Zentimeter metrisch, Gesamtzoll imperial."
    }
  },
  "ui": {
    "emptyText": "Wähle Einheiten, Geschlecht und Körpergröße für Idealgewicht und gesunden Bereich.",
    "engine": {
      "errEnterTpl": "Bitte {label} eingeben.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errMinTpl": "{label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{label} darf nicht größer als {max} sein.",
      "fieldUnit": "dein Einheitensystem",
      "fieldSex": "das Geschlecht für die Formeln",
      "fieldHeight": "deine Körpergröße",
      "errHeightZero": "Bitte eine Körpergröße über Null eingeben.",
      "heroLabel": "Idealgewicht",
      "heroNote": "Durchschnitt aus vier Formeln",
      "cardHealthy": "Gesunder Bereich (BMI)",
      "cardDevine": "Devine-Formel",
      "cardRobinson": "Robinson-Formel",
      "cardMiller": "Miller-Formel",
      "cardHamwi": "Hamwi-Formel",
      "bandBelow": "Darunter",
      "bandHealthy": "Gesunder Bereich",
      "bandAbove": "Darüber",
      "insSpreadTpl": "Die vier Formeln liegen zwischen {lo} und {hi} bei einem Mittel von {avg}.",
      "insBandTpl": "Für deine Größe reicht der gesunde BMI-Bereich (18,5 bis 24,9) von {range}.",
      "insAnchor": "Die Formeln berücksichtigen weder Statur noch Muskelmasse oder Alter – nutze sie lediglich als groben Richtwert.",
      "vizTitleTpl": "Dein Idealgewicht im Vergleich zum gesunden Bereich ({unit})",
      "vizDescTpl": "Formelergebnisse zwischen {fRange} innerhalb des BMI-Korridors {bRange}.",
      "vizHighlight": "die vier Formeln",
      "asmUnits": "Einheiten",
      "asmMetric": "metrisch (cm)",
      "asmImp": "imperial (in)",
      "asmFormulas": "Formeln",
      "asmHealthy": "Gesunder Bereich",
      "asmHealthyVal": "BMI 18,5 bis 24,9",
      "decBmi": "Aktuellen BMI prüfen",
      "decBf": "Körperfettanteil schätzen",
      "decTrack": "Gewichtsverlauf protokollieren",
      "q1": "Was sollte ich bei meiner Größe wiegen?",
      "q2": "Ist Idealgewicht gleichbedeutend mit gesundem Gewicht?",
      "q3": "Warum weichen die vier Formeln voneinander ab?",
      "explanation": "Devine, Robinson, Miller und Hamwi wurden vor Jahrzehnten vor allem zur Medikamentendosierung aus Größe und Geschlecht entwickelt. Zusammen mit dem modernen BMI-Bereich erhältst du einen realistischen Spielraum statt einer starren Zahl."
    }
  },
  "knowledge": {
    "summary": "Berechnet das Idealgewicht über Devine, Robinson, Miller und Hamwi samt gesundem BMI-Bereich.",
    "useCases": [
      "Eine realistische Gewichtsspanne zur Körpergröße ablesen",
      "Abweichungen historischer Formeln direkt nebeneinander sehen",
      "Sinnvolle Zielzonen gemeinsam mit dem KFA festlegen"
    ],
    "mistakes": [
      "Einen einzelnen Nachkommawert als alleiniges Ideal betrachten",
      "Muskelmasse und Körperbau komplett außer Acht lassen"
    ]
  },
  "faqs": [
    {
      "id": "ideal-weight-calculator-faq-1",
      "question": "Wie viel sollte ich bei meiner Größe wiegen?",
      "answer": "Einen einzelnen Pflichtwert gibt es nicht. Der Rechner zeigt den Schnitt von Devine, Robinson, Miller und Hamwi plus die komplette gesunde BMI-Spanne."
    },
    {
      "id": "ideal-weight-calculator-faq-2",
      "question": "Warum liefern die Formeln unterschiedliche Werte?",
      "answer": "Jede Gleichung nutzt leicht andere Ausgangsgewichte ab 5 Fuß sowie andere Zuschläge je Zoll; Hamwi fällt meist am höchsten aus, Miller am niedrigsten."
    },
    {
      "id": "ideal-weight-calculator-faq-3",
      "question": "Ist Idealgewicht dasselbe wie gesundes Gewicht?",
      "answer": "Nein. Historische Idealgewicht-Formeln sollten Arzneidosen abschätzen, während der moderne BMI-Bereich von 18,5 bis 24,9 unterschiedliche Staturen zulässt."
    },
    {
      "id": "ideal-weight-calculator-faq-4",
      "question": "Berücksichtigen die Formeln Muskeln oder Knochenbau?",
      "answer": "Nein, ausschließlich Größe und Geschlecht. Kräftige oder trainierte Personen können deutlich darüber liegen und dennoch wenig Fett tragen."
    },
    {
      "id": "ideal-weight-calculator-faq-5",
      "question": "Wie setze ich damit ein sinnvolles Ziel?",
      "answer": "Orientiere dich am gesunden BMI-Korridor, wähle einen zu deiner Statur passenden Wohlfühlpunkt und verfolge den langfristigen Trend."
    }
  ]
};
