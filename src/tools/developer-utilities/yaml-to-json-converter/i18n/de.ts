import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "YAML-zu-JSON-Konverter",
  "seoTitle": "YAML zu JSON Konverter - Configs Online Umwandeln",
  "description": "Wandle YAML sofort in gültiges JSON für APIs und JSON Schema um. Löst Anker auf und konvertiert Zeitstempel lokal im Browser.",
  "tagline": "YAML-Konfigurationen direkt in valides JSON übersetzen.",
  "lead": "Konvertiere Kubernetes-Manifeste und YAML-Dateien lokal im Browser in striktes JSON inklusive Auflösung von Ankern und Aliasen.",
  "guide": {
    "title": "YAML zu JSON Konverter: vollständiger Leitfaden",
    "description": "Wie YAML-Kommentare, Anker, Aliase und Datumsangaben in JSON übersetzt werden und wie man typische Parse-Fehler vermeidet."
  },
  "ui": {
    "inputLabel": "YAML-Eingabe",
    "placeholder": "YAML hier einfügen",
    "craftNote": "YAML erlaubt keine Tabulatoren zur Einrückung; zwei Leerzeichen pro Ebene sind Standard.",
    "moreAboutHeading": "So funktioniert der YAML-zu-JSON-Konverter",
    "insight": "Wandelt YAML-Konfigurationen in JSON für APIs und JSON-Werkzeuge um. YAML-Einrückungen werden direkt in verschachtelte Objekte und Arrays übersetzt.",
    "technical": [
      {
        "term": "Vorgang",
        "detail": "Parst YAML und serialisiert es als strenges JSON"
      },
      {
        "term": "Einsatz",
        "detail": "JSON-APIs, Schema-Validierung und Skripte"
      },
      {
        "term": "Einrückung",
        "detail": "YAML-Ebenen werden zu JSON-Objekten und Arrays"
      }
    ]
  },
  "knowledge": {
    "summary": "Konvertiert YAML zu JSON für APIs und JSON-Schema-Checks, löst Anker auf und formatiert Datumswerte als ISO-Strings.",
    "useCases": [
      "Kubernetes-YAML-Manifeste für JSON-Tools aufbereiten",
      "YAML-Konfigurationen gegen ein JSON-Schema prüfen",
      "YAML-Einstellungen an eine JSON-API übermitteln",
      "YAML-Daten in Umgebungen ohne YAML-Parser nutzen",
      "Strukturierte Daten für JSON-Datenbanken vorbereiten"
    ],
    "mistakes": [
      "YAML-Zeilen mit Tab-Zeichen statt Leerzeichen einrücken",
      "Erwarten, dass #-Kommentare im JSON erhalten bleiben",
      "Glauben, Datumswerte blieben eigene Datumstypen im JSON",
      "Sonderzeichen oder Doppelpunkte im Text nicht in Anführungszeichen setzen"
    ]
  },
  "faqs": [
    {
      "id": "y2j-faq-1",
      "question": "Warum sollte man YAML in JSON konvertieren?",
      "answer": "JSON ist der Standard für Web-APIs und Programmiersprachen. So lassen sich YAML-Dateien direkt gegen ein JSON-Schema prüfen oder an REST-Schnittstellen senden."
    },
    {
      "id": "y2j-faq-2",
      "question": "Ist YAML ein Superset von JSON?",
      "answer": "Ja. Seit YAML 1.2 ist jedes gültige JSON auch gültiges YAML. Umgekehrt entfallen YAML-Eigenheiten wie Kommentare beim Export nach JSON, während Anker vollständig aufgelöst werden."
    },
    {
      "id": "y2j-faq-3",
      "question": "Was passiert mit YAML-Kommentaren bei der Konvertierung?",
      "answer": "Kommentare ab # werden entfernt, da die JSON-Spezifikation keine Kommentare kennt. Sämtliche Schlüssel, Werte und Strukturen bleiben erhalten."
    },
    {
      "id": "y2j-faq-4",
      "question": "Wie werden YAML-Anker und Aliase behandelt?",
      "answer": "Anker (&name) und Aliase (*name) werden aufgelöst, sodass der referenzierte Block im JSON direkt an jeder Alias-Stelle vollständig eingefügt wird."
    },
    {
      "id": "y2j-faq-5",
      "question": "Was geschieht mit Datums- und Zeitangaben in YAML?",
      "answer": "Da JSON keinen nativen Datumstyp hat, werden YAML-Zeitstempel verlustfrei als genormte ISO-8601-Zeichenketten ausgegeben."
    },
    {
      "id": "y2j-faq-6",
      "question": "Warum schlägt die Umwandlung meines YAML fehl?",
      "answer": "Die häufigste Ursache sind versteckte Tabulatoren oder eine ungleiche Einrückung sowie ungeschützte Sonderzeichen wie Doppelpunkte im Fließtext."
    },
    {
      "id": "y2j-faq-7",
      "question": "Wie wandele ich JSON zurück nach YAML?",
      "answer": "Wechsle oben einfach zum JSON-zu-YAML-Konverter, um zwischen beiden Formaten hin- und herzuwechseln."
    },
    {
      "id": "y2j-faq-8",
      "question": "Bleiben meine Konfigurationsdaten vertraulich?",
      "answer": "Ja. Alle Eingaben werden lokal in deinem Browser verarbeitet und niemals auf Server hochgeladen."
    }
  ]
};
