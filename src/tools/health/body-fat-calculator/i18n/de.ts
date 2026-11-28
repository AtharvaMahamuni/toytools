import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Körperfettanteil-Rechner",
  "seoTitle": "Körperfettanteil Rechner - US-Navy-Methode Online",
  "description": "Schätze deinen Körperfettanteil (KFA) mit der US-Navy-Maßbandmethode sowie Fettmasse und fettfreie Masse im Browser.",
  "tagline": "Körperfettanteil per Maßband plus Fett- und Muskelmasse.",
  "lead": "Berechne deinen Körperfettanteil nach der US-Navy-Formel, ACE-Einstufung sowie Fett- und Magermasse sicher direkt im Browser.",
  "craft": {
    "solves": "Maßband-Formeln schwanken je nach Bandspannung um 3-4 Prozentpunkte, weshalb der Wochentrend weit aussagekräftiger ist als ein Einzelwert."
  },
  "guide": {
    "title": "Körperfett mit dem Maßband zuverlässig bestimmen",
    "description": "Wie die US-Navy-Methode funktioniert, wo Hals, Taille und Hüfte gemessen werden und worin der Unterschied zum BMI liegt."
  },
  "fields": {
    "unit": {
      "label": "Einheiten",
      "options": {
        "metric": "Metrisch (cm, kg)",
        "imperial": "Imperial (in, lb)"
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
      "help": "Zentimeter metrisch, Zoll imperial."
    },
    "neck": {
      "label": "Halsumfang",
      "help": "Direkt unterhalb des Kehlkopfs gemessen."
    },
    "waist": {
      "label": "Taillenumfang",
      "help": "Männer am Bauchnabel; Frauen an der schmalsten Stelle."
    },
    "hip": {
      "label": "Hüftumfang",
      "help": "Nur für Frauen an der breitesten Stelle (wird bei Männern ignoriert)."
    },
    "weight": {
      "label": "Körpergewicht (optional)",
      "help": "Optional für Fett- und Magermasse."
    }
  },
  "ui": {
    "emptyText": "Gib Körpergröße, Hals und Taille (bei Frauen zusätzlich Hüfte) ein, um den KFA zu berechnen.",
    "engine": {
      "errEnterTpl": "Bitte {label} eingeben.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errMinTpl": "{label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{label} darf nicht größer als {max} sein.",
      "errPositiveTpl": "{label} muss größer als Null sein.",
      "fieldUnit": "dein Einheitensystem",
      "fieldSex": "das Geschlecht für die Formel",
      "fieldHeight": "deine Körpergröße",
      "fieldNeck": "deinen Halsumfang",
      "fieldWaist": "deinen Taillenumfang",
      "fieldHip": "deinen Hüftumfang",
      "fieldWeight": "dein Gewicht",
      "errWaistNeck": "Der Taillenumfang muss größer als der Halsumfang sein.",
      "errWaistHipNeck": "Taille plus Hüfte müssen größer als der Halsumfang sein.",
      "errInvalidEst": "Diese Maße liefern keine gültige Schätzung. Bitte überprüfe alle Werte.",
      "heroLabel": "Körperfett",
      "cardCat": "Kategorie",
      "cardFat": "Fettmasse",
      "cardLean": "Magermasse",
      "men": "Männer",
      "women": "Frauen",
      "cats": {
        "essential": "Essentiell",
        "athletes": "Athleten",
        "fitness": "Fitness",
        "average": "Durchschnitt",
        "obese": "Überdurchschnittlich"
      },
      "insCatTpl": "Dein Schätzwert von {bf}% liegt in der ACE-Kategorie \"{cat}\" für {sex}.",
      "insTape": "Die Maßbandmethode hat rund 3-4 Prozentpunkte Toleranz. Miss zur selben Tageszeit locker anliegend und verfolge den Verlauf.",
      "vizTitleTpl": "Dein KFA von {bf}% auf der ACE-Skala",
      "vizDescTpl": "ACE-Bereiche für {sex}. Achte vor allem auf den längerfristigen Trend.",
      "asmMethod": "Methode",
      "asmMethodVal": "U.S.-Navy-Umfangsformel",
      "asmUnits": "Einheiten",
      "asmMetric": "metrisch (cm, kg)",
      "asmImp": "imperial (in, lb)",
      "asmCats": "Kategorien",
      "asmCatsVal": "American Council on Exercise",
      "decBmi": "Mit dem BMI abgleichen",
      "decTdee": "Tageskalorien (TDEE) bestimmen",
      "decTrack": "Wöchentlichen Gewichtsverlauf verfolgen",
      "q1": "Welcher Körperfettanteil ist gesund?",
      "q2": "Wie genau ist die Navy-Methode?",
      "q3": "Wie unterscheidet sich KFA vom BMI?",
      "explanation": "Die US-Navy-Formel schätzt den Körperfettanteil aus Hals-, Taillen- (sowie Hüft-)Umfang im Verhältnis zur Körpergröße. Damit liefert ein einfaches Maßband ohne Speziallabor einen praktischen Trendwert."
    }
  },
  "knowledge": {
    "summary": "Schätzt Körperfettanteil, ACE-Kategorie sowie Fett- und Magermasse mithilfe der US-Navy-Umfangsformel.",
    "useCases": [
      "Körperkomposition verfolgen, wenn sich auf der Waage wenig tut",
      "Fettfreie Masse während einer Diät im Blick behalten",
      "Den BMI bei viel Muskelmasse realistischer einordnen"
    ],
    "mistakes": [
      "Maßband tief in die Haut einschneiden lassen oder Bauch einziehen",
      "Morgendliche und abendliche Messungen direkt vergleichen",
      "Den Näherungswert als exakten DEXA-Scan betrachten"
    ]
  },
  "faqs": [
    {
      "id": "body-fat-calculator-faq-1",
      "question": "Wie funktioniert die US-Navy-Körperfettmethode?",
      "answer": "Sie setzt Nacken-, Taillen- und bei Frauen Hüftumfang mit der Körpergröße in eine an Unterwasserwägungen kalibrierte Gleichung ein."
    },
    {
      "id": "body-fat-calculator-faq-2",
      "question": "Wo genau muss ich messen?",
      "answer": "Hals direkt unter dem Kehlkopf; Taille beim Mann auf Bauchnabelhöhe, bei der Frau an der schmalsten Stelle; Hüfte an der breitesten Stelle."
    },
    {
      "id": "body-fat-calculator-faq-3",
      "question": "Wie genau ist diese Schätzung?",
      "answer": "Bei gleichmäßiger Messtechnik liegt das Ergebnis meist innerhalb von 3 bis 4 Prozentpunkten klinischer Referenzverfahren."
    },
    {
      "id": "body-fat-calculator-faq-4",
      "question": "Welcher Körperfettanteil gilt als gesund?",
      "answer": "Nach ACE liegt der Fitness-Bereich bei ca. 14–17 % für Männer und 21–24 % für Frauen; Athleten liegen darunter."
    },
    {
      "id": "body-fat-calculator-faq-5",
      "question": "Worin liegt der Unterschied zum BMI?",
      "answer": "Der BMI nutzt nur Größe und Gewicht ohne Muskel-Fett-Unterscheidung, während KFA sowie Fett-/Magermasse die Körperzusammensetzung erfassen."
    },
    {
      "id": "body-fat-calculator-faq-6",
      "question": "Bleiben meine Maße privat?",
      "answer": "Ja. Alle Berechnungen finden lokal im Browser statt und verlassen dein Gerät nicht."
    }
  ]
};
