import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Überflüssige Leerzeichen entfernen",
  "seoTitle": "Doppelte Leerzeichen entfernen - Leerzeichen bereinigen",
  "description": "Wandle mehrfache Leerzeichen und Tabulatoren online in ein einzelnes Leerzeichen um. Zeilenumbrüche bleiben erhalten.",
  "tagline": "Mehrfache Leerzeichen und Tabs zusammenfassen. Lokal im Browser.",
  "lead": "Bereinige doppelte Leerzeichen aus PDF-Kopien oder E-Mails sofort lokal auf deinem Gerät, ohne Absätze zu zerstören.",
  "guide": {
    "title": "Doppelte Leerzeichen in Word & Excel löschen",
    "description": "So entfernst du mehrfache Leerzeichen in Word, Google Docs und Excel, warum GLÄTTEN anders arbeitet als Trimmen, mit Beispielen."
  },
  "ui": {
    "placeholder": "Text mit doppelten Leerzeichen hier einfügen",
    "outputPlaceholder": "Bereinigter Text erscheint hier",
    "sampleText": "Rechnung   versendet.   Zahlung    fällig   am   Freitag.",
    "handoff": {
      "msgTpl": "An den Zeilenrändern verbleibt noch {n} Leerzeichen.",
      "siblings": {
        "trim-text": "Ränder trimmen"
      }
    }
  },
  "knowledge": {
    "summary": "Fasst wiederholte Leerzeichen und Tabulatoren zwischen Wörtern zu jeweils einem Leerzeichen zusammen.",
    "useCases": [
      "Doppelte Leerzeichen nach Punkten in Texten korrigieren",
      "Kopierte Absätze aus PDF-Dateien oder E-Mails säubern",
      "Eingaben vor dem Speichern in Formularen vereinheitlichen",
      "Fließtext sauber für Satz und Layout vorbereiten"
    ],
    "mistakes": [
      "Erwarten, dass führende und abschließende einzelne Leerzeichen am Rand komplett wegfallen",
      "Annehmen, dass Zeilenumbrüche ebenfalls entfernt werden"
    ]
  },
  "faqs": [
    {
      "id": "res-faq-1",
      "question": "Was bewirkt \"Überflüssige Leerzeichen entfernen\"?",
      "answer": "Jede Folge von zwei oder mehr Leerzeichen oder Tabulatoren wird auf ein einziges normales Leerzeichen verkürzt. Aus \"Hallo     Welt\" wird \"Hallo Welt\". Zeilenumbrüche bleiben unangetastet."
    },
    {
      "id": "res-faq-2",
      "question": "Warum entstehen doppelte Leerzeichen in Texten?",
      "answer": "Häufig durch Kopieren aus PDFs oder Blocksatz-Dokumenten, durch ältere Schreibgewohnheiten nach dem Satzende oder durch manuelles Einrücken mit der Leertaste."
    },
    {
      "id": "res-faq-3",
      "question": "Werden auch Zeilenumbrüche gelöscht?",
      "answer": "Nein. Es werden nur horizontale Leerzeichen und Tabs zusammengefasst. Wenn auch Zeilenumbrüche zu Leerzeichen werden sollen, nutze eine vollständige Whitespace-Normalisierung."
    },
    {
      "id": "res-faq-4",
      "question": "Entfernt das Tool Leerzeichen am Zeilenanfang und -ende?",
      "answer": "Mehrfache Rand-Leerzeichen schrumpfen auf eines, ein einzelnes bleibt am Rand stehen. Zum vollständigen Entfernen am Rand eignet sich das Trim-Werkzeug."
    },
    {
      "id": "res-faq-5",
      "question": "Wie bereinige ich Abstände aus einer PDF-Kopie?",
      "answer": "Füge den Text direkt ein: Jeder übergroße Wortabstand wird zu genau einem Leerzeichen gekürzt, während deine Absätze sauber erhalten bleiben."
    },
    {
      "id": "res-faq-6",
      "question": "Soll ich Leerzeichen reduzieren oder Ränder trimmen?",
      "answer": "Reduziere mehrfache Leerzeichen bei zu großen Wortabständen innerhalb der Zeile; trimme, wenn nur Leerzeichen vor oder nach einer Zeile stören."
    },
    {
      "id": "res-faq-7",
      "question": "Was unterscheidet das Verdichten von kompletter Normalisierung?",
      "answer": "Das Verdichten bewahrt alle Zeilenumbrüche und korrigiert innere Lücken; beim Normalisieren werden sämtliche Umbrüche und Sonder-Leerzeichen in eine einzige Zeile umgewandelt."
    },
    {
      "id": "res-faq-8",
      "question": "Warum bleiben manche breite Lücken trotz Bereinigung bestehen?",
      "answer": "Dabei handelt es sich meist um geschützte Leerzeichen (U+00A0) aus Word oder Websites, die optisch gleich aussehen, technisch aber keine Standard-Leerzeichen sind."
    },
    {
      "id": "res-faq-9",
      "question": "Ist das Einfügen vertraulicher Texte sicher?",
      "answer": "Ja. Die Bereinigung läuft vollständig lokal im Browser ab; kein einziges Wort wird hochgeladen oder protokolliert."
    }
  ]
};
