import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "CSV-zu-JSON-Konverter",
  "seoTitle": "CSV zu JSON Konverter - Kostenlos Online Umwandeln",
  "description": "Wandle CSV in ein JSON-Array aus Objekten um. Mit Typerkennung, Trennzeichen-Support und RFC-4180-Escaping lokal im Browser.",
  "tagline": "CSV mit Typerkennung in ein JSON-Objekt-Array umwandeln.",
  "lead": "Konvertiere CSV- und TSV-Tabellen direkt im Browser in saubere JSON-Arrays, wobei führende Nullen bei Postleitzahlen erhalten bleiben.",
  "guide": {
    "title": "CSV zu JSON konvertieren: vollständiger Leitfaden",
    "description": "Erfahre, wie die CSV-zu-JSON-Umwandlung funktioniert, wie Datentypen und Anführungszeichen behandelt werden und welche Fehler es gibt."
  },
  "ui": {
    "inputLabel": "CSV-Eingabe",
    "placeholder": "CSV hier einfügen",
    "craftNote": "Führende Nullen und große Ganzzahlen in CSV-Spalten bleiben bei der JSON-Serialisierung sicher erhalten.",
    "moreAboutHeading": "So funktioniert der CSV-zu-JSON-Konverter",
    "insight": "Wandelt CSV-Zeilen in ein JSON-Objekt-Array um und nutzt die Kopfzeile als Schlüsselliste. Ideal für API-Importe aus Tabellenkalkulationen.",
    "technical": [
      {
        "term": "Kopfzeile",
        "detail": "Die erste Zeile liefert die Objektschlüssel"
      },
      {
        "term": "Ausgabe",
        "detail": "Ein JSON-Array mit einem Objekt pro Datenzeile"
      },
      {
        "term": "Werte",
        "detail": "Strings, außer eindeutige Zahlen, Booleans oder null"
      }
    ],
    "errInvalidCsv": "Ungültiges CSV.",
    "errNoHeaders": "Keine Kopfzeile gefunden: Die erste Zeile muss Spaltennamen enthalten.",
    "errNoRows": "Keine Datenzeilen gefunden: Füge mindestens eine Zeile unterhalb der Kopfzeile ein."
  },
  "knowledge": {
    "summary": "Wandelt CSV in ein JSON-Array aus Objekten für APIs und JavaScript um, inklusive Typerkennung und RFC-4180-Quoting.",
    "useCases": [
      "Tabellenexporte als JSON-Arrays in Webanwendungen übernehmen",
      "Datenbank-CSV-Dumps für API-Anfragen aufbereiten",
      "Testdaten und Fixtures aus CSV-Dateien erzeugen",
      "Berichtsdaten für Visualisierungsbibliotheken nach JSON wandeln",
      "Tab-getrennte Exporte (TSV) in JSON-Pipelines einspeisen"
    ],
    "mistakes": [
      "Kopfzeile mit Spaltennamen weglassen",
      "Erwarten, dass führende Nullen bei PLZ als Zahl erhalten bleiben",
      "Falsches Trennzeichen bei deutschen Semikolon-CSVs verwenden",
      "Zellen mit enthaltenem Trennzeichen nicht in Anführungszeichen setzen"
    ]
  },
  "faqs": [
    {
      "id": "c2j-faq-1",
      "question": "Welches CSV-Format erwartet der Konverter?",
      "answer": "Erwartet wird eine Kopfzeile mit Spaltennamen als erste Zeile, gefolgt von einer Datenzeile pro Datensatz. Jeder Spaltenname wird zum Objektschlüssel im resultierenden JSON-Array."
    },
    {
      "id": "c2j-faq-2",
      "question": "Wie arbeitet die automatische Typerkennung?",
      "answer": "Zellen mit Zahlen, true/false oder null werden automatisch in echte JSON-Typen umgewandelt; normaler Text bleibt ein String."
    },
    {
      "id": "c2j-faq-3",
      "question": "Warum bleibt ein Wert wie 007 ein String?",
      "answer": "Nummern mit führenden Nullen wie Postleitzahlen (z. B. 01067) würden als echte Zahl die Nullen verlieren. Zum Schutz vor Datenverlust bleiben solche Werte immer Text."
    },
    {
      "id": "c2j-faq-4",
      "question": "Wie werden Kommas und Anführungszeichen in Feldern verarbeitet?",
      "answer": "Nach RFC 4180: Eingeklammerte Felder in doppelten Anführungszeichen dürfen Kommas, Zeilenumbrüche und gedoppelte Anführungszeichen (\"\") enthalten."
    },
    {
      "id": "c2j-faq-5",
      "question": "Kann ich andere Trennzeichen als das Komma nutzen?",
      "answer": "Ja. Komma, Semikolon, Tabulator und Pipe werden unterstützt, besonders wichtig bei europäischen Excel-Exporten mit Semikolon."
    },
    {
      "id": "c2j-faq-6",
      "question": "Was passiert bei Zeilen mit weniger Werten als Spalten?",
      "answer": "Fehlende Werte am Zeilenende werden als leerer String ergänzt, damit jedes JSON-Objekt dieselbe Schlüsselstruktur behält."
    },
    {
      "id": "c2j-faq-7",
      "question": "Kann ich das JSON wieder zurück in CSV wandeln?",
      "answer": "Ja. Nutze den verknüpften JSON-zu-CSV-Konverter in der Werkzeugleiste, um die Struktur direkt wieder in eine Tabelle umzuwandeln."
    },
    {
      "id": "c2j-faq-8",
      "question": "Werden meine CSV-Tabellen auf einen Server hochgeladen?",
      "answer": "Nein. Parsing und JSON-Export laufen vollständig lokal in deinem Browser; keine Datensätze verlassen dein Gerät."
    }
  ]
};
