import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Worthäufigkeits-Zähler",
  "seoTitle": "Worthäufigkeit zählen - Wortwiederholungen prüfen",
  "description": "Zähle online, wie oft jedes Wort im Text vorkommt, inklusive Prozentanteil, Sortierung und Filter für Füllwörter.",
  "tagline": "Wie oft jedes Wort vorkommt, mit Prozentanteil.",
  "lead": "Analysiere Wortwiederholungen sofort im Browser, sortiere nach Häufigkeit oder Alphabet und filtere bei Bedarf Stoppwörter.",
  "guide": {
    "title": "Worthäufigkeit im Text gezielt analysieren",
    "description": "Erfahre, wie Wortzählung und Stoppwort-Filter funktionieren, was Keyword-Dichte bedeutet und wie Redakteure Wiederholungen aufspüren."
  },
  "ui": {
    "stats": {
      "uniqueWords": "Einzigartige Wörter",
      "words": "Wörter",
      "sentences": "Sätze",
      "averageWordLength": "Ø Wortlänge"
    },
    "emptyMessage": "Text einfügen oder eingeben, um die Worthäufigkeit zu messen.",
    "sampleText": "Der schnelle braune Fuchs springt über den faulen Hund am alten Bauernhaus. Eine sanfte Brise strich durch die Blätter der hohen Eiche, während der Fuchs über die sonnigen Hügel blickte.",
    "heading": "Worthäufigkeit",
    "hideCommon": "Häufige Wörter ausblenden",
    "ignoreNumbers": "Zahlen ignorieren",
    "byFrequency": "Nach Häufigkeit",
    "alphabetical": "Alphabetisch",
    "listAria": "Wörter nach Häufigkeit",
    "noWords": "Keine Wörter gefunden.",
    "topWordsTpl": "Zeigt die Top {limit} von insgesamt {total} verschiedenen Wörtern."
  },
  "knowledge": {
    "summary": "Misst die Häufigkeit jedes einzelnen Wortes im Text samt Prozentanteil, Sortieroptionen und Stoppwort-Filter.",
    "useCases": [
      "Überstrapazierte Füll- und Lieblingswörter vor Veröffentlichung finden",
      "Keyword-Dichte in Fachartikeln und Webtexten kontrollieren",
      "Wortschatz in Aufsätzen oder Dokumenten profilieren",
      "Wiederkehrende Begriffe aus Kundenfeedback extrahieren"
    ],
    "mistakes": [
      "Absolute Trefferzahlen statt Prozentanteile über ungleich lange Texte vergleichen",
      "Stoppwörter aktiv lassen und bedeutungslose Funktionswörter überbewerten"
    ]
  },
  "faqs": [
    {
      "id": "wf-faq-1",
      "question": "Was macht ein Worthäufigkeits-Zähler?",
      "answer": "Er ermittelt, wie oft jedes unterschiedliche Wort vorkommt, und stellt die Treffer mit Anzahl und prozentualem Anteil übersichtlich als Rangliste dar."
    },
    {
      "id": "wf-faq-2",
      "question": "Wie werden Wörter abgegrenzt und zählt Groß-/Kleinschreibung?",
      "answer": "Wörter werden an Leerzeichen, Umbrüchen, Gedankenstrichen sowie Kommas außerhalb von Zahlen getrennt; Satzzeichen am Rand entfallen. Die Zählung ignoriert Groß-/Kleinschreibung, sodass \"Haus\" und \"haus\" zusammengezählt werden."
    },
    {
      "id": "wf-faq-3",
      "question": "Was entfernt der Filter \"Häufige Wörter ausblenden\"?",
      "answer": "Er blendet häufige englische Stoppwörter wie \"the\", \"a\", \"of\" oder \"and\" aus, damit aussagekräftige Inhaltswörter direkt ganz oben erscheinen."
    },
    {
      "id": "wf-faq-4",
      "question": "Wofür nutzt man eine Worthäufigkeits-Analyse?",
      "answer": "Autorinnen entdecken Wortwiederholungen, SEO-Teams prüfen thematische Dichte, Lernende extrahieren Kernvokabeln und Produktteams werten Feedback aus."
    },
    {
      "id": "wf-faq-5",
      "question": "Was bedeutet Keyword-Dichte und wird sie angezeigt?",
      "answer": "Die Keyword-Dichte zeigt den prozentualen Anteil eines Begriffs an der Gesamtwortzahl. In vielen Redaktionstexten liegt ein natürlicher Wert häufig um 1 bis 2 Prozent."
    },
    {
      "id": "wf-faq-6",
      "question": "Warum weicht die Anzahl eindeutiger Wörter leicht von anderen Tools ab?",
      "answer": "Unterschiedliche Tools trennen Bindestriche, Apostrophe oder Dezimalzahlen verschieden. Durch einheitliche Tokenisierung bleibt jedoch die relative Rangfolge zuverlässig stabil."
    },
    {
      "id": "wf-faq-7",
      "question": "Gibt es eine Textlängen-Begrenzung?",
      "answer": "Auch lange Manuskripte werden in einem schnellen Durchlauf ausgewertet. Zur Übersichtlichkeit zeigt die Tabelle die 50 häufigsten Wörter samt Gesamtanzahl unterschiedlicher Begriffe."
    },
    {
      "id": "wf-faq-8",
      "question": "Werden meine Texte auf einen Server übertragen?",
      "answer": "Nein. Die komplette Auswertung geschieht lokal im Browser und funktioniert nach dem Laden sogar ohne Internetverbindung."
    }
  ]
};
