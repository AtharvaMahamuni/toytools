import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "slugify-text",
  "name": "URL-Slug-Generator",
  "seoTitle": "URL-Slug-Generator Online - Text in Slug Umwandeln",
  "description": "Wandle Überschriften sofort in saubere, kleingeschriebene URL-Slugs mit Bindestrich und ohne Umlaute um – direkt im Browser.",
  "tagline": "Saubere, kleingeschriebene URL-Slugs lokal erzeugen.",
  "knowledge": {
    "primaryConcepts": [
      "URL-Slug (Slugify)"
    ],
    "realWorldUseCases": [
      "Permalinks aus Blog-Titeln erzeugen",
      "Saubere HTML-Anker-IDs bilden",
      "Webtaugliche Dateinamen erstellen",
      "Ganze Titellisten fürs CMS in Slugs umwandeln"
    ],
    "commonMistakes": [
      "Umlaute oder Großbuchstaben im Slug erwarten",
      "Mit Kebab-Case verwechseln (Kebab-Case behält Akzente)"
    ]
  },
  "faqs": [
    {
      "id": "slugify-text-faq-1",
      "question": "Was ist ein URL-Slug?",
      "answer": "Der lesbare letzte Teil einer Webadresse in Kleinbuchstaben und mit Bindestrichen statt Leerzeichen."
    },
    {
      "id": "slugify-text-faq-2",
      "question": "Wie werden Akzente, Umlaute und Sonderzeichen behandelt?",
      "answer": "Akzente fallen auf ASCII zurück („Café“ → „cafe“), „ß“ wird zu „ss“, Sonderzeichen werden zu einfachen Bindestrichen ohne Rand-Bindestriche."
    },
    {
      "id": "slugify-text-faq-3",
      "question": "Kann ich eine ganze Titelliste auf einmal umwandeln?",
      "answer": "Ja, jede Zeile ergibt genau einen sauberen Slug."
    },
    {
      "id": "slugify-text-faq-4",
      "question": "Wann ist ein Slug SEO-freundlich?",
      "answer": "Kurz, kleingeschrieben, mit Bindestrichen getrennt und frei von unnötigen Füllwörtern."
    },
    {
      "id": "slugify-text-faq-5",
      "question": "Unterschied zwischen Slugify und Kebab-Case?",
      "answer": "Slugify entfernt Akzente zu reinem ASCII für URLs; Kebab-Case setzt Bindestriche, behält aber Sonderzeichen/Akzente im Code."
    },
    {
      "id": "slugify-text-faq-6",
      "question": "Ist der Slug identisch mit dem URL-Pfad?",
      "answer": "Nein, der Pfad enthält auch übergeordnete Ordner, der Slug ist nur das letzte Segment."
    },
    {
      "id": "slugify-text-faq-7",
      "question": "Bleiben Akzente wie „é“ oder „ü“ erhalten?",
      "answer": "Nein, sie werden bewusst auf ASCII-Basisbuchstaben reduziert, um unleserliche %C3%-Kodierungen in URLs zu vermeiden."
    },
    {
      "id": "slugify-text-faq-8",
      "question": "Warum werden alle Buchstaben kleingeschrieben?",
      "answer": "Weil viele Webserver Groß-/Kleinschreibung in Pfaden unterscheiden und konsistente Kleinschreibung Duplicate Content verhindert."
    },
    {
      "id": "slugify-text-faq-9",
      "question": "Werden meine Titel gespeichert?",
      "answer": "Nein, alles läuft vollständig im Browser ab."
    }
  ],
  "guide": {
    "title": "Text in saubere URL-Slugs umwandeln",
    "description": "Umgang mit Umlauten und ß, SEO-Vorteile kurzer Slugs und Unterschied zu Kebab-Case."
  },
  "ui": {
    "placeholder": "Titel oder Titelliste einfügen",
    "outputPlaceholder": "URL-Slugs erscheinen hier",
    "sampleText": "Straße Øresund: Kaffee & Crème Brûlée 2026",
    "handoff": {
      "msgTpl": "{n} Zeile(n) ohne lateinische Buchstaben oder Ziffern wurden zu einem leeren Slug.",
      "siblings": {
        "sentence-case-converter": "Satzschreibung",
        "kebab-case-converter": "Kebab-Case",
        "trim-text": "Text trimmen",
        "lowercase-converter": "Kleinbuchstaben"
      }
    }
  }
};
