import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "JSON-zu-YAML-Konverter",
  "seoTitle": "JSON zu YAML Konverter - Kubernetes & Docker Config",
  "description": "Wandle JSON blitzschnell in sauberes YAML für Kubernetes, Docker Compose, Ansible und CI/CD um. Mit korrektem Escaping im Browser.",
  "tagline": "JSON direkt in lesbares YAML für Kubernetes & CI/CD wandeln.",
  "lead": "Konvertiere JSON-Daten direkt im Browser in korrekt eingerücktes YAML für Manifeste, Pipelines und Konfigurationsdateien.",
  "guide": {
    "title": "JSON zu YAML Konverter: vollständiger Leitfaden",
    "description": "Unterschiede zwischen JSON und YAML, Bedeutung korrekter Leerzeichen-Einrückung, Anführungszeichen für Typenschutz und typische Fehler."
  },
  "ui": {
    "inputLabel": "JSON-Eingabe",
    "placeholder": "JSON hier einfügen",
    "moreAboutHeading": "So funktioniert der JSON-zu-YAML-Konverter",
    "insight": "Wandelt JSON in die gut lesbare Konfigurationssyntax YAML um. Alle Daten bleiben identisch erhalten; nur die Notation ändert sich.",
    "technical": [
      {
        "term": "Vorgang",
        "detail": "Serialisiert geparstes JSON neu als YAML"
      },
      {
        "term": "Einsatz",
        "detail": "Konfigurationen, CI-Pipelines und Manifeste"
      },
      {
        "term": "Daten",
        "detail": "Vollständig erhalten: YAML 1.2 ist ein JSON-Superset"
      }
    ]
  },
  "knowledge": {
    "summary": "Konvertiert JSON in YAML für Kubernetes, Docker Compose, Ansible und CI/CD-Workflows mit sauberem Quoting.",
    "useCases": [
      "JSON-API-Objekte in Kubernetes-Manifeste umwandeln",
      "Docker-Compose-Dateien aus JSON-Vorlagen erzeugen",
      "JSON-Variablen für Ansible-Playbooks aufbereiten",
      "GitHub-Actions-Konfigurationen aus JSON ableiten",
      "OpenAPI-Spezifikationen in YAML lesbarer gestalten"
    ],
    "mistakes": [
      "Tabulatoren statt Leerzeichen für YAML-Einrückungen nutzen",
      "Zahlähnliche Strings ohne Anführungszeichen im YAML lassen",
      "Verschachtelte Ebenen beim Handeditieren falsch einrücken",
      "Glauben, YAML ohne --- am Anfang sei ungültig"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "Was unterscheidet JSON und YAML?",
      "answer": "Beide speichern hierarchische Daten. JSON nutzt geschweifte Klammern und Pflicht-Anführungszeichen; YAML arbeitet mit Leerzeichen-Einrückung, Doppelpunkten und Bindestrichen für bessere Lesbarkeit."
    },
    {
      "id": "jyaml-faq-2",
      "question": "Warum sollte man JSON in YAML umwandeln?",
      "answer": "DevOps-Werkzeuge wie Kubernetes, Docker Compose, Ansible und GitHub Actions verwenden standardmäßig YAML. Exportiertes JSON wird so ohne Handarbeit einsetzbar."
    },
    {
      "id": "jyaml-faq-3",
      "question": "Kann YAML später wieder in JSON konvertiert werden?",
      "answer": "Ja. Für Web-APIs oder JSON-Schema-Prüfungen wandelt das Gegenstück YAML-zu-JSON die Daten verlustfrei zurück."
    },
    {
      "id": "jyaml-faq-4",
      "question": "Ist die Einrückung in YAML zwingend vorgeschrieben?",
      "answer": "Ja. Einrückung per Leerzeichen (niemals Tabs!) definiert die Baumstruktur. Zwei Leerzeichen pro Ebene sind der De-facto-Standard."
    },
    {
      "id": "jyaml-faq-5",
      "question": "Warum erhalten manche Strings im YAML Anführungszeichen?",
      "answer": "Ohne Anführungszeichen interpretiert YAML Wörter wie true, false, null, yes oder no sowie Ziffernfolgen als Booleans oder Zahlen. Anführungszeichen sichern den String-Typ."
    },
    {
      "id": "jyaml-faq-6",
      "question": "Wozu dienen Inline-Flow-Arrays?",
      "answer": "Einfache Listen aus Einzelwerten lassen sich kompakt als [a, b, c] darstellen statt untereinander mit Bindestrichen."
    },
    {
      "id": "jyaml-faq-7",
      "question": "Was bedeutet die Startmarkierung --- in YAML?",
      "answer": "Die drei Bindestriche kennzeichnen den Beginn eines YAML-Dokuments, besonders verbreitet bei mehreren Manifesten in einer Kubernetes- oder Helm-Datei."
    },
    {
      "id": "jyaml-faq-8",
      "question": "Bleiben interne Konfigurationsdaten privat?",
      "answer": "Ja. Die komplette Umwandlung erfolgt lokal per JavaScript im Browser; nichts wird auf Server geladen oder gespeichert."
    }
  ]
};
