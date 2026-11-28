import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "uppercase-converter",
  "name": "Großbuchstaben-Konverter",
  "seoTitle": "Text in Großbuchstaben Umwandeln Online",
  "description": "Wandle jeden Text sofort komplett in GROSSBUCHSTABEN um und kopiere ihn direkt im Browser. Alle Daten bleiben lokal.",
  "tagline": "Beliebigen Text sofort in GROSSBUCHSTABEN umwandeln.",
  "knowledge": {
    "primaryConcepts": [
      "Großbuchstaben umwandeln"
    ],
    "realWorldUseCases": [
      "Überschriften oder Etiketten durchgängig groß formatieren",
      "Konstanten wie MAX_SIZE für Quellcode vorbereiten",
      "Gemischt geschriebene Kürzel vereinheitlichen",
      "Kurze Hinweise optisch hervorheben"
    ],
    "commonMistakes": [
      "Lange Fließtexte in Versalien setzen",
      "Sich auf CSS text-transform statt echte Zeichen zu verlassen"
    ]
  },
  "faqs": [
    {
      "id": "uc-faq-1",
      "question": "Wie wandle ich Text in Großbuchstaben um?",
      "answer": "Füge den Text links ein; rechts erscheint sofort die vollständig großgeschriebene Ausgabe zum Kopieren."
    },
    {
      "id": "uc-faq-2",
      "question": "Werden Zahlen oder Satzzeichen verändert?",
      "answer": "Nein. Ziffern, Leerzeichen und Satzzeichen bleiben unverändert erhalten."
    },
    {
      "id": "uc-faq-3",
      "question": "Warum kopiert man manchmal Kleinbuchstaben trotz Großschrift auf Webseiten?",
      "answer": "Dort sorgt CSS text-transform: uppercase nur optisch für Großbuchstaben; der echte zugrunde liegende Text bleibt gemischt."
    },
    {
      "id": "uc-faq-4",
      "question": "Wird mein Text hochgeladen?",
      "answer": "Nein. Die gesamte Umwandlung läuft lokal in deinem Browser."
    },
    {
      "id": "uc-faq-5",
      "question": "Wann sind reine Großbuchstaben sinnvoll?",
      "answer": "Für Abkürzungen, Programmier-Konstanten und kurze Labels; längere Fließtexte werden dadurch schwerer lesbar."
    },
    {
      "id": "uc-faq-6",
      "question": "CSS text-transform oder echte Umwandlung?",
      "answer": "CSS genügt für reine Optik; für Datenbanken, Exporte oder exakte Vergleiche müssen die echten Zeichen umgewandelt werden."
    },
    {
      "id": "uc-faq-7",
      "question": "Gilt dieselbe Regel für alle Sprachen?",
      "answer": "Das Tool nutzt standardisiertes Unicode-Mapping: aus deutschem „ß“ wird beispielsweise „SS“."
    },
    {
      "id": "uc-faq-8",
      "question": "Warum behalten Umlaute und Akzente ihre Zeichen?",
      "answer": "Das ist korrektes Unicode-Verhalten (aus „café“ wird „CAFÉ“, aus „ä“ wird „Ä“)."
    }
  ],
  "guide": {
    "title": "Text in Großbuchstaben umwandeln",
    "description": "Unicode-Regeln (wie ß zu SS), Unterschied zu CSS text-transform und Lesbarkeits-Tipps."
  },
  "ui": {
    "placeholder": "Text hier einfügen oder tippen",
    "outputPlaceholder": "Ergebnis in Großbuchstaben erscheint hier",
    "sampleText": "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern"
  }
};
