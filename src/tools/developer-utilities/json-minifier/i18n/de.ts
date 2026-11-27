import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'json-minifier',
  name: 'JSON Minifier',
  seoTitle: 'JSON Minifier Online – JSON Kostenlos Komprimieren',
  description:
    'JSON online minifizieren und überflüssige Leerzeichen sofort im Browser entfernen. Exakte Zahlen und Schlüssel bleiben unverändert erhalten.',
  tagline: 'Entfernt Leerzeichen und Zeilenumbrüche aus JSON für kleinere Dateien.',
  knowledge: {
    primaryConcepts: ['JSON-Minifizierung'],
    realWorldUseCases: [
      'Antwortgrößen produktiver APIs spürbar reduzieren',
      'Statische JSON-Dateien für schnelle HTTP-Auslieferung verkleinern',
      'Konfigurationspakete in Build-Pipelines kompakt halten',
    ],
    commonMistakes: [
      'JSON in Versionskontrolle minifiziert einchecken (unlesbare Diffs)',
      'Dateien mit JSONC- oder JSON5-Kommentaren minifizieren zu wollen',
    ],
  },
  faqs: [
    {
      id: 'json-min-faq-1',
      question: 'Was macht die JSON-Minifizierung?',
      answer:
        'Sie entfernt sämtliche unnötigen Leerzeichen, Tabulatoren und Zeilenumbrüche zwischen JSON-Tokens. Die Daten bleiben unangetastet: `{ "a": 1 }` und `{"a":1}` sind semantisch identisch, aber kompakt kleiner.',
    },
    {
      id: 'json-min-faq-2',
      question: 'Wie viel Speicherplatz spart Minifizieren?',
      answer:
        'Je nach Einrückungstiefe schrumpft formatiertes JSON meist um 20 bis 40 Prozent. Bei flachen Objekten fällt die Ersparnis geringer aus, kombiniert mit gzip oder Brotli sinkt das Gesamtvolumen jedoch weiter.',
    },
    {
      id: 'json-min-faq-3',
      question: 'Bleibt minifiziertes JSON gültig?',
      answer:
        'Ja. Die offizielle JSON-Spezifikation RFC 8259 ignoriert Leerraum zwischen Tokens. Jeder standardkonforme Parser verarbeitet die kompakte Form identisch.',
    },
    {
      id: 'json-min-faq-4',
      question: 'Lässt sich minifiziertes JSON wieder lesbar formatieren?',
      answer:
        'Ja, verlustfrei. Füge das kompakte Ergebnis einfach wieder in den JSON Formatter ein; da keine Neuserialisierung stattfindet, bleiben alle Token exakt erhalten.',
    },
    {
      id: 'json-min-faq-5',
      question: 'Wann sollte man JSON minifizieren?',
      answer:
        'Immer dann, wenn Nutzdaten im Produktivbetrieb über das Netzwerk übertragen werden. In Entwicklung und Git-Repositories sollte JSON lesbar eingerückt bleiben.',
    },
    {
      id: 'json-min-faq-6',
      question: 'Was ist der Unterschied zwischen Minifizierung und gzip?',
      answer:
        'Minifizierung entfernt Formatierungszeichen direkt im Text; gzip oder Brotli komprimieren die resultierenden Bytes für die Übertragung. Beide Verfahren ergänzen sich.',
    },
    {
      id: 'json-min-faq-7',
      question: 'Verändert Minifizieren Reihenfolge oder Struktur?',
      answer:
        'Nein. Schlüsselreihenfolge und Werttypen bleiben exakt erhalten. Es verschwindet ausschließlich Leerraum zwischen den Elementen.',
    },
    {
      id: 'json-min-faq-8',
      question: 'Entfernt der Minifier auch Kommentare?',
      answer:
        'Standard-JSON unterstützt keine Kommentare. Falls Kommentare (JSONC/JSON5) enthalten sind, lehnt jeder strikte Parser die Eingabe zunächst als ungültig ab.',
    },
    {
      id: 'json-min-faq-9',
      question: 'Muss ich API-Antworten manuell minifizieren?',
      answer:
        'Meist nicht, da Web-Frameworks standardmäßig kompakt serialisieren (wie `JSON.stringify(data)` ohne drittes Argument in Node.js).',
    },
    {
      id: 'json-min-faq-10',
      question: 'Kann das Minifizieren lange IDs oder Dezimalstellen wie 19.90 verändern?',
      answer:
        'Nein. Es werden lediglich Leerzeichen zwischen den Original-Tokens gelöscht. Große Ganzzahlen wie 9007199254740993 werden nicht gerundet und 19.90 behält die abschließende Null. Doppelte Schlüssel bleiben mit Warnhinweis sichtbar.',
    },
  ],
  guide: {
    title: 'Was ist JSON-Minifizierung & wann nutzen?',
    description: 'Payload-Größe senken ohne Datenverlust, Vergleich mit gzip und verlustfreie Verarbeitung.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'JSON-Eingabe',
    placeholder: 'JSON hier einfügen',
    emptyOutput: 'Füge links JSON ein, um es zu minifizieren.',
    validLabel: 'Gültiges JSON',
    invalidLabel: 'Ungültiges JSON',
    appliedPrefix: 'Korrektur angewendet:',
    loadError: 'JSON-Prozessor konnte nicht geladen werden.',
    moreAboutHeading: 'So arbeitet der JSON Minifier',
    insight:
      'Minifizieren entfernt überflüssige Leerzeichen für kleinstmögliches gültiges JSON, während Werte und große Zahlen unverändert bleiben.',
    technical: [
      { term: 'Vorgang', detail: 'Kopiert Original-Tokens ohne Leerraum und ohne Neuserialisierung' },
      { term: 'Einsatz', detail: 'API-Nutzdaten, Web-Assets und Speichergröße reduzieren' },
      { term: 'Daten', detail: 'Unverändert: große Zahlen, 1.0, 1e5, Escapes und Reihenfolge bleiben gleich' },
      { term: 'Doppelte Schlüssel', detail: 'Werden beibehalten und mit Hinweis markiert' },
    ],
    engine: {
      repairBoth: 'Typografische Anführungszeichen und letztes Komma korrigieren',
      repairQuotes: 'Typografische Anführungszeichen ersetzen',
      repairComma: 'Nachgestelltes Komma entfernen',
    },
  },
};
