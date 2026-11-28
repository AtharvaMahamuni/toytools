import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Doppelte Zeilen entfernen",
  "seoTitle": "Doppelte Zeilen entfernen - Listen online bereinigen",
  "description": "Entferne doppelte Zeilen aus Texten und Listen unter Erhalt der ersten Fundstelle und ursprünglichen Reihenfolge lokal im Browser.",
  "tagline": "Wiederholte Zeilen entfernen, ersten Treffer behalten.",
  "lead": "Bereinige E-Mail-Listen, URLs oder Logdateien sofort im Browser ohne Alphabetisierung und ohne Daten hochzuladen.",
  "guide": {
    "title": "Doppelte Zeilen aus Texten zuverlässig entfernen",
    "description": "So bereinigst du Listen mit Erhalt der ersten Fundstelle, worauf bei Groß-/Kleinschreibung zu achten ist und wie du Importe vorbereitest."
  },
  "ui": {
    "placeholder": "Liste hier zeilenweise einfügen",
    "outputPlaceholder": "Eindeutige Zeilen erscheinen hier",
    "sampleText": "Apfel\nBanane\nApfel\nOrange\nBanane",
    "handoff": {
      "trimTpl": "{n} Zeile(n) unterscheiden sich nur durch Leerzeichen am Rand.",
      "lowerTpl": "{n} Zeile(n) unterscheiden sich nur durch Groß-/Kleinschreibung.",
      "siblings": {
        "trim-text": "Ränder trimmen",
        "lowercase-converter": "Kleinschreibung"
      }
    }
  },
  "knowledge": {
    "summary": "Behält nur das jeweils erste Vorkommen jeder Zeile und bereinigt Listen, Logs und Exporte unter Erhalt der Reihenfolge.",
    "useCases": [
      "E-Mail- oder Abonnentenlisten deduplizieren",
      "Eindeutige URLs oder IDs aus Exporten gewinnen",
      "Wiederkehrende Meldungen aus Server-Logs herausfiltern",
      "Saubere Keyword-Listen ohne Dubletten aufbauen"
    ],
    "mistakes": [
      "Unsichtbare Leerzeichen am Zeilenende vorab nicht zu trimmen",
      "Zu vergessen, dass Groß- und Kleinschreibung getrennt gezählt wird"
    ]
  },
  "faqs": [
    {
      "id": "rdl-faq-1",
      "question": "Wie werden doppelte Zeilen erkannt?",
      "answer": "Zwei Zeilen gelten als identisch, wenn jedes einzelne Zeichen exakt übereinstimmt. Das erste Vorkommen bleibt stehen, alle späteren Kopien verschwinden unter Erhalt der Reihenfolge."
    },
    {
      "id": "rdl-faq-2",
      "question": "Werden nur direkt aufeinanderfolgende Duplikate gelöscht?",
      "answer": "Nein. Dubletten werden im gesamten Text erkannt, selbst wenn hunderte andere Zeilen dazwischenliegen."
    },
    {
      "id": "rdl-faq-3",
      "question": "Ist der Abgleich exakt oder unabhängig von Groß-/Kleinschreibung?",
      "answer": "Der Abgleich arbeitet exakt. \"Apfel\" und \"apfel\" zählen als unterschiedlich. Für fallunabhängige Bereinigung wandle die Liste zuerst in Kleinschreibung um."
    },
    {
      "id": "rdl-faq-4",
      "question": "Beeinflussen Leerzeichen am Anfang oder Ende die Erkennung?",
      "answer": "Ja. \"  Apfel\" und \"Apfel\" gelten wegen der zusätzlichen Leerzeichen als verschieden. Trimme bei Bedarf vorher die Ränder."
    },
    {
      "id": "rdl-faq-5",
      "question": "Wie entferne ich doppelte E-Mail-Adressen aus einer Mailingliste?",
      "answer": "Füge eine Adresse pro Zeile ein: Jede exakte Adresse bleibt einmal an ihrer ersten Position erhalten. Wandle Adressen vorher in Kleinschreibung um, damit gemischte Schreibweisen zusammengeführt werden."
    },
    {
      "id": "rdl-faq-6",
      "question": "Wie filtere ich eindeutige Zeilen aus einer Logdatei?",
      "answer": "Füge das Log ein, sodass jede Meldung genau einmal sichtbar wird. Falls Zeitstempel pro Zeile variieren, entferne zuerst die Zeitstempelspalte."
    },
    {
      "id": "rdl-faq-7",
      "question": "Was ist der Unterschied zum Entfernen leerer Zeilen?",
      "answer": "Dieses Tool löscht wiederholte Inhalte; Leerzeilen entfernen löscht ausschließlich leere Zeilen. Zwei leere Zeilen zählen hier als Duplikat, sodass eine leere Zeile übrig bleibt."
    },
    {
      "id": "rdl-faq-8",
      "question": "Warum wirkt die Reihenfolge nach dem Bereinigen verändert?",
      "answer": "Die Reihenfolge der ersten Vorkommen ändert sich nie. Es rücken lediglich nachfolgende Zeilen nach oben, weil entfernte Wiederholungen Platz machen."
    },
    {
      "id": "rdl-faq-9",
      "question": "Ist das Einfügen einer Kunden- oder E-Mail-Liste sicher?",
      "answer": "Ja. Alles geschieht lokal im Browser auf deinem Gerät. Es werden keinerlei Listen an einen Server übertragen."
    }
  ]
};
