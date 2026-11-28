import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Römische-Zahlen-Konverter",
  "seoTitle": "Römische Zahlen Konverter - 1 bis 3999 Umrechnen",
  "description": "Rechne arabische und römische Zahlen (I bis MMMCMXCIX) bidirektional um. Erkennt Uhr-Schreibweisen wie IIII und schlägt Standardform vor.",
  "tagline": "Zahlen und römische Ziffern von I bis MMMCMXCIX umrechnen.",
  "lead": "Übersetze Werte zwischen 1 und 3999 in beide Richtungen direkt im Browser und erkenne historische Schreibweisen wie IIII oder MDCCCCX.",
  "guide": {
    "title": "Römische Zahlen sicher lesen und schreiben",
    "description": "Die sechs Subtraktionspaare, warum Uhren IIII zeigen, warum bei 3999 Schluss ist und wie man Jahreszahlen in Filmabspännen liest."
  },
  "ui": {
    "displayName": "Römische Zahl",
    "forwardLabel": "Zu Römisch →",
    "inverseLabel": "Zu Zahl ←",
    "outputLabel": "Ergebnis",
    "placeholder": "Zahl (1 bis 3999) oder römische Ziffer eingeben.",
    "modeAriaLabel": "Umrechnungsrichtung",
    "inputAriaLabel": "Arabische oder römische Zahl",
    "outputAriaLabel": "Umgerechnetes Ergebnis",
    "outputPlaceholder": "Hier erscheint das Ergebnis. Du kannst auch diese Seite bearbeiten.",
    "swapLabel": "Tauschen",
    "swapAriaLabel": "Eingabe und Ausgabe tauschen",
    "insight": [
      "Römische Zahlen werden von groß nach klein addiert, außer wenn eine kleinere Ziffer vor einer größeren steht: IV ist 4, VI ist 6.",
      "Nur sechs Subtraktionspaare sind genormt: IV, IX, XL, XC, CD und CM. Schreibungen wie IC für 99 gab es im alten Rom nie.",
      "Im reinen Text endet das System bei 3999 (MMMCMXCIX), da größere Werte einen Querstrich über dem Buchstaben verlangen."
    ],
    "technical": [
      {
        "term": "Bereich",
        "detail": "1 bis 3999 (MMMCMXCIX). Null und Minus fehlen"
      },
      {
        "term": "Buchstaben",
        "detail": "I=1, V=5, X=10, L=50, C=100, D=500, M=1000"
      },
      {
        "term": "Subtraktionspaare",
        "detail": "Nur IV, IX, XL, XC, CD, CM"
      },
      {
        "term": "Lesen",
        "detail": "Tolerant: IIII und VIIII werden erkannt und gemeldet"
      },
      {
        "term": "Schreiben",
        "detail": "Strikt: immer kanonische Subtraktionsschreibweise"
      }
    ],
    "engine": {
      "detNumber": "Zahl",
      "detRoman": "Römische Zahl",
      "errWhole": "Bitte eine ganze Zahl nur mit Ziffern eingeben.",
      "errZero": "Für die Null gibt es keine römische Ziffer. Die kleinste ist I.",
      "errNegative": "Römische Zahlen kennen kein Minuszeichen.",
      "errOverbarTpl": "{n} bräuchte einen Querstrich zur Tausender-Multiplikation; reiner Text endet bei {max} (MMMCMXCIX).",
      "errBadRomanTpl": "\"{ch}\" ist kein gültiger römischer Buchstabe. Erlaubt sind nur I, V, X, L, C, D und M.",
      "warnNonStd": "Lesbar, aber nicht die moderne Standardschreibweise.",
      "metaValue": "Wert",
      "metaLetters": "Buchstaben",
      "metaSubtractive": "Subtraktionspaare",
      "recCanonicalTpl": "In Standardschreibweise {canonical} für {value} ändern"
    }
  },
  "knowledge": {
    "summary": "Rechnet Zahlen in römische Ziffern und zurück um, versteht alte Uhr-Schreibweisen und bietet per Klick die moderne Form an.",
    "useCases": [
      "Erscheinungsjahre im Abspann oder auf Buchtiteln entziffern",
      "Kapitel, Jahrhunderte oder Anhänge stilvoll nummerieren",
      "Ein Gravur- oder Tattoo-Datum vorab verlässlich prüfen",
      "Regenten- oder Jubiläumsnummern sicher zuordnen"
    ],
    "mistakes": [
      "IC statt XCIX für 99 schreiben",
      "IIII vom Zifferblatt übernehmen und beim Rückumwandeln wieder IIII erwarten",
      "Werte über 3999 ohne Querstrich-Notation eingeben wollen"
    ]
  },
  "faqs": [
    {
      "id": "roman-faq-1",
      "question": "Welches Jahr ist MCMXCIX?",
      "answer": "Das Jahr 1999: M (1000) + CM (900) + XC (90) + IX (9). Zerlegt man die Subtraktionspaare, liest sich jedes Bau- oder Filmjahr sofort."
    },
    {
      "id": "roman-faq-2",
      "question": "Warum nutzen Uhren oft IIII statt IV?",
      "answer": "Aus optischer Symmetrie zum gegenüberliegenden VIII und aus Gießerei-Gründen bei zwanzig I-Lettern. Unser Tool versteht beides."
    },
    {
      "id": "roman-faq-3",
      "question": "Warum enden römische Zahlen bei 3999?",
      "answer": "Für 4000 bräuchte man vier M in Folge oder ein Überstreichungszeichen (Vinculum mal 1000), das in normalem ASCII-Text nicht darstellbar ist."
    },
    {
      "id": "roman-faq-4",
      "question": "Darf man 99 als IC schreiben?",
      "answer": "Nein. Nur direkt benachbarte Zweierschritte sind als Subtraktion zulässig; 99 heißt daher korrekt XCIX (90 + 9)."
    },
    {
      "id": "roman-faq-5",
      "question": "Warum meldet das Tool eine nicht standardgemäße Ziffer?",
      "answer": "Weil additive Varianten wie IIII, VIIII oder MDCCCCX zwar den richtigen Zahlenwert ergeben, heute aber durch IV, IX oder MCM ersetzt werden."
    },
    {
      "id": "roman-faq-6",
      "question": "Gibt es eine römische Ziffer für Null?",
      "answer": "Nein. Römische Ziffern entstanden zum Abzählen realer Mengen; die Null hatte kein Zeichen, höchstens das lateinische Wort nulla."
    }
  ]
};
