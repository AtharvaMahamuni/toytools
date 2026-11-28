import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "MD5-Hash-Generator",
  "seoTitle": "MD5 Hash Generator - Prüfsummen Online Erstellen",
  "description": "Erzeuge einen 32-stelligen MD5-Hash oder eine Prüfsumme aus beliebigem Text direkt im Browser, schnell und privat.",
  "tagline": "32-stellige MD5-Prüfsumme aus beliebigem Text berechnen.",
  "lead": "Berechne 128-Bit-MD5-Hashes lokal im Browser für Cache-Keys, Deduplizierung und schnelle Fehlerprüfungen ohne Server-Upload.",
  "guide": {
    "title": "Was ist MD5? Funktionsweise und sinnvolle Grenzen",
    "description": "Erfahre, wie MD5-Hashing arbeitet, warum 128-Bit-Kollisionen Passwörter und Signaturen unsicher machen und wofür MD5 noch taugt."
  },
  "ui": {
    "displayName": "MD5",
    "inputAriaLabel": "Text für MD5-Hash",
    "comparePlaceholder": "32-stelligen MD5-Hash zum Vergleich einfügen",
    "historyTitle": "Verlauf",
    "insight": "MD5 liefert eine schnelle 128-Bit-Prüfsumme, gilt aber kryptografisch als gebrochen. Nutze MD5 nur für Cache-Schlüssel oder Deduplizierung, niemals für Passwörter oder Signaturen.",
    "technical": [
      {
        "term": "Standard",
        "detail": "RFC 1321"
      },
      {
        "term": "Ausgabe",
        "detail": "128 Bit, 32 Hexadezimalzeichen"
      },
      {
        "term": "Richtung",
        "detail": "Einwegfunktion: nicht in Klartext umkehrbar"
      },
      {
        "term": "Sicherheit",
        "detail": "Gebrochen: Kollisionen sind praktisch erzeugbar"
      }
    ]
  },
  "knowledge": {
    "summary": "Erstellt einen 32-stelligen MD5-Hash lokal im Browser. Ideal für nicht sicherheitsrelevante Prüfsummen.",
    "useCases": [
      "Downloads auf zufällige Übertragungsfehler prüfen",
      "Deterministische Cache-Schlüssel aus URLs generieren",
      "Doppelte Dateien anhand des Inhalts erkennen",
      "Datensätze gleichmäßig auf Shards verteilen"
    ],
    "mistakes": [
      "Benutzerpasswörter mit MD5 speichern",
      "MD5 gegen gezielte Manipulation einsetzen"
    ]
  },
  "faqs": [
    {
      "id": "md5-faq-1",
      "question": "Was ist MD5?",
      "answer": "MD5 ist eine 1991 von Ronald Rivest entwickelte Hashfunktion, die beliebige Eingaben in eine feste 32-stellige Hex-Zeichenkette (128 Bit) überführt."
    },
    {
      "id": "md5-faq-2",
      "question": "Wie sieht ein MD5-Hash aus?",
      "answer": "Immer 32 kleingeschriebene Hexadezimalzeichen. \"hello\" ergibt 5d41402abc4b2a76b9719d911017c592; schon ein Großbuchstabe ändert den gesamten Digest."
    },
    {
      "id": "md5-faq-3",
      "question": "Kann man einen MD5-Hash zurückrechnen?",
      "answer": "Mathematisch nein, da MD5 eine Einwegfunktion ist. Kurze oder häufige Wörter lassen sich jedoch über Lookup-Tabellen nachschlagen."
    },
    {
      "id": "md5-faq-4",
      "question": "Ist MD5 sicher?",
      "answer": "Für nicht-kryptografische Zwecke ja; für Sicherheitsaufgaben nein, da zwei verschiedene Dateien denselben MD5-Wert haben können."
    },
    {
      "id": "md5-faq-5",
      "question": "Darf ich Passwörter mit MD5 hashen?",
      "answer": "Nein. Moderne GPUs berechnen Milliarden MD5-Hashes pro Sekunde. Nutze Argon2, bcrypt oder scrypt."
    },
    {
      "id": "md5-faq-6",
      "question": "Was ist eine Hash-Kollision?",
      "answer": "Wenn zwei unterschiedliche Eingaben identische Hashes erzeugen. Bei MD5 lassen sich gezielte Kollisionen in Sekunden erstellen."
    },
    {
      "id": "md5-faq-7",
      "question": "Wofür ist MD5 heute noch sinnvoll?",
      "answer": "Für schnelle Prüfsummen gegen zufällige Bitfehler, Cache-Keys, Inhaltserkennung zur Deduplizierung und Shard-Keys."
    },
    {
      "id": "md5-faq-8",
      "question": "Was unterscheidet MD5 von SHA-256?",
      "answer": "MD5 liefert 128 Bit (32 Hex-Zeichen) und ist gebrochen; SHA-256 liefert 256 Bit (64 Hex-Zeichen) und gilt weiterhin als kollisionsresistent."
    },
    {
      "id": "md5-faq-9",
      "question": "Warum ergibt derselbe Text immer denselben Hash?",
      "answer": "Weil Hashfunktionen deterministisch arbeiten: identische Bytes durchlaufen exakt dieselben Rechenschritte."
    },
    {
      "id": "md5-faq-10",
      "question": "Kann ich MD5 ohne Upload berechnen?",
      "answer": "Ja. Der 128-Bit-Digest wird lokal durch JavaScript in deinem Browser berechnet."
    },
    {
      "id": "md5-faq-11",
      "question": "Kann eine KI einen MD5-Hash entschlüsseln?",
      "answer": "Nein. Hashing verwirft Information unumkehrbar und lässt sich weder rechnerisch noch per KI zurückverwandeln."
    }
  ]
};
