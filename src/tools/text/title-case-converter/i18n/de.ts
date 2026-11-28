import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "title-case-converter",
  "name": "Titel-Großschreibung",
  "seoTitle": "Title Case Konverter: Jedes Wort Großschreiben",
  "description": "Wandle englische Überschriften und Titel sofort in Title Case um – jedes Wort mit großem Anfangsbuchstaben lokal im Browser.",
  "tagline": "Ersten Buchstaben jedes Wortes sofort großschreiben.",
  "knowledge": {
    "primaryConcepts": [
      "Title Case"
    ],
    "realWorldUseCases": [
      "Englischsprachige Blog- und Artikelüberschriften formatieren",
      "Buch-, Film- oder Songtitel vereinheitlichen",
      "Navigationspunkte sauber durchkapitalisieren",
      "Gemischte Überschriften korrigieren"
    ],
    "commonMistakes": [
      "Fließtext im Title Case formatieren",
      "Übersehen, dass AP und Chicago kurze Artikel und Präpositionen kleinlassen"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "Was ist Title Case?",
      "answer": "Beim Title Case beginnt jedes Wort mit einem Großbuchstaben – verbreitet bei englischen Überschriften, Buch- und Songtiteln."
    },
    {
      "id": "tc-faq-2",
      "question": "Welche Wörter werden im Titel großgeschrieben?",
      "answer": "Nomen, Verben, Adjektive und Adverbien immer; stilistisch lassen englische Styleguides kurze Artikel und Präpositionen oft klein. Dieses Tool setzt zunächst jedes Wort groß."
    },
    {
      "id": "tc-faq-3",
      "question": "Unterschied zu Sentence Case?",
      "answer": "Sentence Case schreibt nur das Satzanfangswort groß; Title Case kapitalisiert jedes Wort."
    },
    {
      "id": "tc-faq-4",
      "question": "Eignet sich Title Case für Fließtext?",
      "answer": "Nein. Für längere Absätze liest sich normale Satzschreibung weit flüssiger."
    },
    {
      "id": "tc-faq-5",
      "question": "Werden Ziffern und Satzzeichen berührt?",
      "answer": "Nein, nur der Wortanfang wird geändert."
    },
    {
      "id": "tc-faq-6",
      "question": "Wie formatiere ich eine Schlagzeile?",
      "answer": "Einfach einfügen und kopieren; je nach englischem Styleguide danach ggf. kurze Wörter wie „of“ oder „in“ wieder kleinschreiben."
    },
    {
      "id": "tc-faq-7",
      "question": "Müssen „of“ oder „the“ im Englischen groß sein?",
      "answer": "In der Mitte einer Überschrift bleiben sie laut AP/Chicago meist klein, nur am Anfang oder Ende groß."
    },
    {
      "id": "tc-faq-8",
      "question": "Warum wurden kurze Wörter wie „and“ oder „in“ großgeschrieben?",
      "answer": "Der Konverter arbeitet nach einheitlicher Regel; ein Hinweis zählt sofort mit, wie viele solcher Kurzwörter im Text stecken."
    },
    {
      "id": "tc-faq-9",
      "question": "Wie geht er mit Bindestrich-Wörtern um?",
      "answer": "Jeder Teil nach einem Bindestrich wird großgeschrieben (z. B. „Well-Known“)."
    }
  ],
  "guide": {
    "title": "Text in Title Case formatieren",
    "description": "Regeln der Titel-Großschreibung im Vergleich zu Satzschreibung sowie Umgang mit Füllwörtern und Bindestrichen."
  },
  "ui": {
    "placeholder": "Überschrift oder Text einfügen",
    "outputPlaceholder": "Title Case Ergebnis erscheint hier",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "Es wurden auch {n} kurze Wörter großgeschrieben, die Stilführer wie Chicago oder AP meist kleinschreiben.",
      "siblings": {
        "sentence-case-converter": "Satzschreibung",
        "kebab-case-converter": "Kebab-Case",
        "trim-text": "Text trimmen",
        "lowercase-converter": "Kleinbuchstaben"
      }
    }
  }
};
