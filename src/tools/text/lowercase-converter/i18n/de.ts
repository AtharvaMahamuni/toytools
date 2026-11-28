import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "lowercase-converter",
  "name": "Kleinbuchstaben-Konverter",
  "seoTitle": "Text in Kleinbuchstaben Umwandeln Online",
  "description": "Wandle jeden Text sofort komplett in kleinbuchstaben um – ideal für E-Mail-Adressen, Tags und Vergleiche direkt im Browser.",
  "tagline": "Jeden Text direkt im Browser in Kleinbuchstaben wandeln.",
  "knowledge": {
    "primaryConcepts": [
      "Kleinbuchstaben"
    ],
    "realWorldUseCases": [
      "E-Mail-Adressen und Nutzernamen vor dem Speichern vereinheitlichen",
      "Tags und Stichwörter für eindeutige Filter bereinigen",
      "Text für Vergleiche unabhängig von Groß-/Kleinschreibung vorbereiten",
      "Versehentlich mit Feststelltaste getippten Text retten"
    ],
    "commonMistakes": [
      "Eigennamen oder wichtige Akronyme versehentlich einebnen",
      "Beim Abgleich nur eine Seite kleinschreiben"
    ]
  },
  "faqs": [
    {
      "id": "lc-faq-1",
      "question": "Wie wandle ich Text in Kleinbuchstaben um?",
      "answer": "Text links eingeben oder einfügen – rechts erscheint sofort das komplett kleingeschriebene Ergebnis."
    },
    {
      "id": "lc-faq-2",
      "question": "Wann ist Kleinschreibung erforderlich?",
      "answer": "Bei E-Mail-Adressen, URL-Slugs, Hashtags und vielen Bezeichnern im Code sowie für zuverlässige Textvergleiche."
    },
    {
      "id": "lc-faq-3",
      "question": "Wie normalisiere ich E-Mail-Adressen vor dem Speichern?",
      "answer": "Wandle jede Adresse komplett in Kleinbuchstaben um, damit „Jane@Example.COM“ und „jane@example.com“ als identisch erkannt werden."
    },
    {
      "id": "lc-faq-4",
      "question": "Besser in Klein- oder Großbuchstaben normalisieren?",
      "answer": "In Kleinbuchstaben, da nahezu alle Web- und Mail-Konventionen kleingeschriebene Schlüssel erwarten."
    },
    {
      "id": "lc-faq-5",
      "question": "Warum schlägt mein Textvergleich trotzdem fehl?",
      "answer": "Beide Vergleichsstrings müssen bereinigt sein; prüfe außerdem führende Leerzeichen oder unsichtbare Zeichen."
    },
    {
      "id": "lc-faq-6",
      "question": "Werden Ziffern oder Sonderzeichen geändert?",
      "answer": "Nein, ausschließlich Buchstaben mit Groß-/Kleinform werden angepasst."
    },
    {
      "id": "lc-faq-7",
      "question": "Warum blieben manche Zeichen unverändert?",
      "answer": "Zahlen, Emojis sowie Schriften ohne Groß-/Kleinschreibung (z. B. Japanisch, Arabisch) bleiben unverändert."
    },
    {
      "id": "lc-faq-8",
      "question": "Gehen Eigennamen und Abkürzungen verloren?",
      "answer": "Ja, aus „NASA“ wird „nasa“. Nutze Kleinschreibung für Abgleiche/URLs und behalte das Original für Lesetexte."
    },
    {
      "id": "lc-faq-9",
      "question": "Funktioniert das Tool auch offline?",
      "answer": "Ja, nach dem ersten Laden läuft alles offline lokal im Browser."
    }
  ],
  "guide": {
    "title": "Text in Kleinbuchstaben umwandeln",
    "description": "Wann Kleinschreibung für E-Mails, URLs und Abgleiche Pflicht ist und wann Eigennamen verloren gehen."
  },
  "ui": {
    "placeholder": "Text hier einfügen oder tippen",
    "outputPlaceholder": "Ergebnis in Kleinbuchstaben erscheint hier",
    "sampleText": "Hallo WELT, API_KEY und Kontakt@Beispiel.DE",
    "handoff": {
      "msgTpl": "{n} Abkürzung(en) haben ihre Großbuchstaben verloren ({list}) und lassen sich hier nicht wiederherstellen."
    }
  }
};
