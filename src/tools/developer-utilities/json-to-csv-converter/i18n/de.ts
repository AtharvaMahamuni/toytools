import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "JSON-zu-CSV-Konverter",
  "seoTitle": "JSON zu CSV Konverter - Export für Excel Online",
  "description": "Wandle JSON-Arrays in CSV-Dateien für Excel und Datenbanken um. Verschachtelte Objekte und Sonderzeichen werden sicher behandelt.",
  "tagline": "JSON-Arrays sauber in CSV-Tabellen umwandeln.",
  "lead": "Exportiere API-Antworten und JSON-Listen direkt im Browser als Excel-kompatible CSV-Dateien ohne Server-Upload.",
  "guide": {
    "title": "JSON zu CSV konvertieren: vollständiger Leitfaden",
    "description": "Erfahre, wie JSON-Arrays in CSV umgewandelt werden, wie verschachtelte Objekte abgeflacht werden und worauf beim Export zu achten ist."
  },
  "ui": {
    "inputLabel": "JSON-Eingabe",
    "placeholder": "JSON hier einfügen",
    "moreAboutHeading": "So funktioniert der JSON-zu-CSV-Konverter",
    "insight": "Wandelt ein Array flacher JSON-Objekte in CSV-Zeilen um und nutzt die Schlüssel als Kopfzeile. Verschachtelte Werte werden sauber textuell verpackt.",
    "technical": [
      {
        "term": "Eingabe",
        "detail": "Ein JSON-Array aus Objekten"
      },
      {
        "term": "Kopfzeile",
        "detail": "Aus allen gefundenen Objektschlüsseln erzeugt"
      },
      {
        "term": "Verschachtelt",
        "detail": "Als Zeichenkette in einer einzelnen Zelle ausgegeben"
      }
    ],
    "errMustBeArray": "Eingabe muss ein JSON-Array sein.",
    "errEmptyArray": "Das Array ist leer: Nichts zu konvertieren."
  },
  "knowledge": {
    "summary": "Konvertiert JSON-Arrays in CSV für Tabellenkalkulation und Datenbanken, inklusive Sonderzeichen-Escaping.",
    "useCases": [
      "API-Antworten für Berichte nach Excel exportieren",
      "JSON-Daten per CSV-Import in SQL-Datenbanken laden",
      "Konfigurationslisten tabellarisch auswerten",
      "Strukturierte Daten für Google Sheets aufbereiten"
    ],
    "mistakes": [
      "Einzelnes JSON-Objekt statt eines JSON-Arrays übergeben",
      "Komplexe Unterobjekte ohne Abflachung erwarten",
      "Fehlende Anführungszeichen bei Werten mit Komma übersehen"
    ]
  },
  "faqs": [
    {
      "id": "jtc-faq-1",
      "question": "Welches Eingabeformat erwartet der Konverter?",
      "answer": "Ein JSON-Array von Objekten wie [{\"name\":\"Anna\",\"alter\":30}]. Jedes Objekt ergibt eine Zeile und jeder eindeutige Schlüssel eine Spalte."
    },
    {
      "id": "jtc-faq-2",
      "question": "Was geschieht mit verschachtelten Objekten beim CSV-Export?",
      "answer": "Unterobjekte und Arrays werden für die flache CSV-Zelle als kompakte Zeichenkette oder über Punktnotation dargestellt, damit keine Spalte zerrissen wird."
    },
    {
      "id": "jtc-faq-3",
      "question": "Wie werden fehlende Felder in unregelmäßigen JSON-Arrays behandelt?",
      "answer": "Der Konverter sammelt alle Schlüssel über alle Objekte hinweg; Zeilen ohne bestimmtes Feld erhalten dort schlicht eine leere Zelle."
    },
    {
      "id": "jtc-faq-4",
      "question": "Lässt sich das CSV direkt in Excel oder Google Sheets öffnen?",
      "answer": "Ja. Einfach kopieren oder als .csv herunterladen: Die Kopfzeile und Werte mit Anführungszeichen werden sauber erkannt."
    },
    {
      "id": "jtc-faq-5",
      "question": "Warum zeigen manche Konverter [object Object] in Zellen an?",
      "answer": "Das passiert, wenn JavaScript-Objekte naiv in Strings gewandelt werden. Saubere Serialisierung oder vorheriges Abflachen verhindert genau das."
    },
    {
      "id": "jtc-faq-6",
      "question": "Was passiert mit Werten, die Kommas enthalten?",
      "answer": "Solche Zellen werden gemäß CSV-Standard in doppelte Anführungszeichen eingeschlossen, sodass Excel die Spalten nicht versehentlich trennt."
    },
    {
      "id": "jtc-faq-7",
      "question": "Sind vertrauliche JSON-Daten sicher?",
      "answer": "Ja. Die gesamte Umwandlung läuft lokal in deinem Browser ab; es werden keinerlei Daten an Server übertragen."
    },
    {
      "id": "jtc-faq-8",
      "question": "Kann ich auswählen, welche Spalten exportiert werden?",
      "answer": "Alle im Array vorhandenen Schlüssel werden berücksichtigt. Unerwünschte Felder lassen sich vorab im JSON oder danach in Excel entfernen."
    },
    {
      "id": "jtc-faq-9",
      "question": "Was ist der Hauptunterschied zwischen JSON und CSV?",
      "answer": "JSON speichert hierarchische, typisierte Daten für APIs; CSV speichert kompakte zweidimensionale Tabellen für Excel und Analysetools."
    }
  ]
};
