import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Binär-Konverter",
  "seoTitle": "Binär Konverter - Dezimal zu Binär & Dualsystem",
  "description": "Rechne Dezimalzahlen in Basis 2 (Binär) und zurück bis 512 Bit exakt per BigInt um, inklusive Hex, Oktal und Bitbreite.",
  "tagline": "Dezimal nach Binär und zurück mit Hex und Oktal.",
  "lead": "Wandle ganze Zahlen bis 512 Bit lokal im Browser exakt zwischen Dezimal und Binär um, inklusive Bereinigung von 0b-Präfixen und Trennern.",
  "guide": {
    "title": "Dezimal, Binär, Hex und die Bitbreite",
    "description": "Wie das Stellenwertsystem zur Basis 2 funktioniert, warum eine Hex-Ziffer vier Bits entspricht und was Zahlen-Binär von Text-Binär trennt."
  },
  "ui": {
    "displayName": "Binär",
    "forwardLabel": "Zu Binär →",
    "inverseLabel": "Zu Dezimal ←",
    "outputLabel": "Ergebnis",
    "placeholder": "Dezimalzahl eingeben oder Binärziffern einfügen.",
    "modeAriaLabel": "Umrechnungsrichtung",
    "inputAriaLabel": "Dezimal- oder Binärzahl",
    "outputAriaLabel": "Umgerechnetes Ergebnis",
    "outputPlaceholder": "Hier erscheint das Ergebnis. Auch dieses Feld ist editierbar.",
    "swapLabel": "Tauschen",
    "swapAriaLabel": "Eingabe und Ausgabe tauschen",
    "insight": [
      "Das Binärsystem kennt nur 0 und 1: Jede Stelle nach links zählt doppelt so viel wie ihr rechter Nachbar, sodass 1011 = 8 + 2 + 1 = 11 ergibt.",
      "Hexadezimal ist die Kurzschrift des Binärsystems: Genau vier Bits passen in eine Hex-Ziffer (0xFF = 1111 1111).",
      "Die Bitbreite bestimmt führende Nullen für Registerwerte, Farbkanäle oder Berechtigungsmasken."
    ],
    "technical": [
      {
        "term": "Bereich",
        "detail": "Exakt bis 512 Bit via BigInt (kein Rundungsfehler ab 2^53)"
      },
      {
        "term": "Akzeptiert",
        "detail": "0b-Präfix, Leerzeichen, Unterstriche, Kommas, Apostrophe"
      },
      {
        "term": "Negativ",
        "detail": "Vorzeichen und Betrag (-1011), kein Zweierkomplement"
      },
      {
        "term": "Metadaten",
        "detail": "Hexadezimal, Oktal, Bitzahl und Byteanzahl"
      },
      {
        "term": "Abgrenzung",
        "detail": "Keine Textkodierung; für Zeichen nutze Text-zu-Binär"
      }
    ],
    "engine": {
      "detBinary": "Binär",
      "detNumber": "Zahl",
      "errEnterNumber": "Bitte eine Zahl eingeben.",
      "errBadBinTpl": "\"{ch}\" ist keine Binärziffer. Erlaubt sind nur 0 und 1.",
      "errWhole": "Bitte eine ganze Zahl nur aus Ziffern eingeben.",
      "errMaxBitsTpl": "Das sind {bits} Bits. Das Maximum beträgt {max} Bits.",
      "metaHex": "Hex",
      "metaOctal": "Oktal",
      "metaBits": "Bits",
      "metaBytes": "Bytes",
      "recUseTpl": "{cleaned} übernehmen"
    }
  },
  "knowledge": {
    "summary": "Rechnet Dezimalzahlen und Binärwerte bis 512 Bit verlustfrei um und zeigt Hex, Oktal sowie Bitbreite direkt an.",
    "useCases": [
      "Rechte-Bitmasken oder Feature-Flags aus Konfigurationsdateien ablesen",
      "Registerwerte aus Datenblättern gegen Programmcode prüfen",
      "Beim Debugging geänderte Einzelbits zwischen zwei Werten finden",
      "Zweierpotenzen und Stellenwerte anschaulich vermitteln"
    ],
    "mistakes": [
      "Führende Nullen weglassen und damit Bytegrenzen verlieren",
      "Zahlen-Binär mit Zeichenkodierung (ASCII/UTF-8) verwechseln",
      "Auf Standard-Fließkommazahlen über 2^53 vertrauen"
    ]
  },
  "faqs": [
    {
      "id": "binconv-faq-1",
      "question": "Wie rechne ich eine Dezimalzahl in Binär um?",
      "answer": "Teile wiederholt durch 2, notiere jeden Rest (0 oder 1) und lies die Reste von unten nach oben ab. Aus 11 wird 1011."
    },
    {
      "id": "binconv-faq-2",
      "question": "Was ist der Unterschied zwischen Binärzahlen und Binärtext?",
      "answer": "Als Zahl wird 65 zu 1000001; als Zeichenkodierung wird der Buchstabe \"A\" (Codepunkt 65) als 8-Bit-Byte 01000001 gespeichert."
    },
    {
      "id": "binconv-faq-3",
      "question": "Warum nutzt man oft Hexadezimal statt Binär?",
      "answer": "Weil genau vier Bits eine Hex-Ziffer ergeben. Ein 32-Bit-Wert schrumpft so von 32 Zeichen auf übersichtliche 8 Hex-Zeichen."
    },
    {
      "id": "binconv-faq-4",
      "question": "Welche Rolle spielen Bitbreite und führende Nullen?",
      "answer": "Das Werkzeug zeigt die minimale Bitlänge plus Hex/Oktal an; in 8-, 16- oder 32-Bit-Registern füllst du einfach links mit Nullen auf."
    },
    {
      "id": "binconv-faq-5",
      "question": "Mein Binärwert hat ein 0b-Präfix oder Leerzeichen. Klappt das?",
      "answer": "Ja. Der Konverter erkennt 0b-Präfixe, Leerzeichen und Unterstriche und bietet die Bereinigung per Klick an."
    },
    {
      "id": "binconv-faq-6",
      "question": "Rechnet das Tool auch bei extrem großen Zahlen exakt?",
      "answer": "Ja, bis 512 Bit mittels BigInt ohne jede Gleitkomma-Rundung jenseits von 2^53."
    }
  ]
};
