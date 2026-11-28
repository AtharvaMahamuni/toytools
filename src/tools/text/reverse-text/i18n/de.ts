import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Text umkehren",
  "seoTitle": "Text umkehren - Zeichenfolge online rückwärts drehen",
  "description": "Drehe Wörter, Sätze oder Zeichenfolgen online Zeichen für Zeichen um. Sofortige Verarbeitung lokal im Browser.",
  "tagline": "Zeichenfolge Zeichen für Zeichen umdrehen. Direkt auf deinem Gerät.",
  "lead": "Füge beliebigen Text ein, um die Reihenfolge aller Zeichen sofort lokal umzukehren, ohne Emojis oder Umlaute zu beschädigen.",
  "guide": {
    "title": "Text Zeichen für Zeichen umkehren",
    "description": "Erfahre, wie Rückwärtstext funktioniert, wofür gespiegelte Zeichenfolgen genutzt werden und worauf bei Zeilenumbrüchen zu achten ist."
  },
  "ui": {
    "placeholder": "Text hier eingeben oder einfügen",
    "outputPlaceholder": "Umgekehrter Text erscheint hier",
    "sampleText": "Reliefpfeiler",
    "handoff": {
      "msgTpl": "Enthält {n} Zeilenumbruch/-umbrüche; beim Umkehren des gesamten Blocks wird auch die Zeilenfolge umgedreht."
    }
  },
  "knowledge": {
    "summary": "Dreht Text Zeichen für Zeichen rückwärts um und bewahrt dabei Umlaute sowie zusammengesetzte Emojis sauber.",
    "useCases": [
      "Rückwärtstext für Rätsel, Quiz-Lösungen oder Spiele erstellen",
      "Palindrome wie \"Reliefpfeiler\" oder \"Regallager\" schnell prüfen",
      "Spiegelschrift-Akzente für soziale Medien vorbereiten",
      "Lange Strings oder Dateinamen vom Ende her inspizieren"
    ],
    "mistakes": [
      "Erwarten, dass nur ganze Wörter statt einzelner Zeichen umgestellt werden",
      "Übersehen, dass mehrzeilige Listen beim Komplett-Umkehren von unten nach oben wandern"
    ]
  },
  "faqs": [
    {
      "id": "reverse-text-faq-1",
      "question": "Was bewirkt das Umkehren von Text genau?",
      "answer": "Die Reihenfolge aller Zeichen wird gespiegelt: Das letzte Zeichen steht am Anfang und das erste am Ende. Aus \"hallo\" wird \"ollah\". Die Zeichen selbst bleiben unverändert."
    },
    {
      "id": "reverse-text-faq-2",
      "question": "Verschiebt das Umkehren auch Zeilenumbrüche?",
      "answer": "Ja. Da der gesamte Eingabeblock als eine Zeichenkette behandelt wird, wandert auch jeder Zeilenumbruch mit. Die letzte Zeile steht danach ganz oben. Sollen einzelne Zeilen an Ort und Stelle gedreht werden, füge sie einzeln ein."
    },
    {
      "id": "reverse-text-faq-3",
      "question": "Bleiben Emojis und Umlaute beim Umkehren heil?",
      "answer": "Ja. Die Verarbeitung arbeitet auf Graphem-Ebene statt auf rohen Code-Einheiten, sodass Umlaute, kombinierte Akzente und komplexe Emojis nicht zerrissen werden."
    },
    {
      "id": "reverse-text-faq-5",
      "question": "Wozu wird Rückwärtstext im Alltag genutzt?",
      "answer": "Typische Einsatzzwecke sind Quiz-Lösungen auf Arbeitsblättern, Palindrom-Tests, kleine Rätsel in Schnitzeljagden oder auffällige Social-Media-Bios."
    },
    {
      "id": "reverse-text-faq-6",
      "question": "Wie drehe ich eine Zeichenfolge rückwärts?",
      "answer": "Tippe oder füge den Text in das Eingabefeld ein. Das gespiegelte Ergebnis erscheint sofort ohne zusätzlichen Klick und lässt sich mit einem Tipp kopieren."
    },
    {
      "id": "reverse-text-faq-7",
      "question": "Wie kehre ich ein einzelnes Wort für ein Rätsel um?",
      "answer": "Gib das Lösungswort direkt ein und übernimm das Ergebnis, etwa \"Lager\" zu \"regaL\" oder \"Trug\" zu \"gurT\", sodass Rätselfreunde die Lösung im Kopf entziffern können."
    },
    {
      "id": "reverse-text-faq-4",
      "question": "Werden meine eingegebenen Texte hochgeladen?",
      "answer": "Nein. Alles läuft lokal im Browser ab. Es verlässt kein Zeichen dein Gerät, daher eignet sich das Tool auch für private Notizen."
    }
  ]
};
