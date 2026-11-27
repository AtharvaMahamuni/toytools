import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'json-validator',
  name: 'JSON Validator',
  seoTitle: 'JSON Validator Online – Syntax Kostenlos Prüfen',
  description:
    'JSON-Syntax (RFC 8259) direkt im Browser prüfen und Fehler sofort finden. Erkennt Kommafehler, falsche Anführungszeichen und Klammern lokal.',
  tagline: 'JSON-Syntax prüfen und die genaue Fehlerstelle erkennen.',
  knowledge: {
    primaryConcepts: ['JSON-Validierung'],
    realWorldUseCases: [
      '400-API-Fehler wegen ungültigem JSON schnell diagnostizieren',
      'Manuell bearbeitete package.json- oder tsconfig.json-Dateien testen',
      'Webhook-Payloads aus Serverlogs vor dem Testen prüfen',
      'JSON-Fehler in Konfigurationsdateien vor dem Deploy abfangen',
    ],
    commonMistakes: [
      'Ein abschließendes Komma nach dem letzten Element stehen lassen',
      'Syntaxprüfung mit einer JSON-Schema-Prüfung verwechseln',
    ],
  },
  faqs: [
    {
      id: 'json-val-faq-1',
      question: 'Was macht ein JSON Validator?',
      answer:
        'Er prüft, ob ein Text der offiziellen JSON-Spezifikation RFC 8259 entspricht. Ist alles korrekt, wird das Dokument als gültig bestätigt; andernfalls nennt er die Art und Position des ersten Syntaxfehlers.',
    },
    {
      id: 'json-val-faq-2',
      question: 'Was sind die häufigsten JSON-Syntaxfehler?',
      answer:
        'Nachgestellte Kommas am Ende von Objekten oder Arrays, einfache statt doppelter Anführungszeichen, unzitierte Schlüssel, Kommentare sowie JavaScript-Werte wie `undefined` oder `NaN`.',
    },
    {
      id: 'json-val-faq-3',
      question: 'Worin unterscheidet sich JSON von einem JavaScript-Objektliteral?',
      answer:
        'JSON ist deutlich strenger. JavaScript erlaubt unzitierte Schlüssel, einfache Anführungszeichen, Trailing Commas und Kommentare; JSON verlangt strikt doppelte Anführungszeichen und keine Kommentare.',
    },
    {
      id: 'json-val-faq-4',
      question: 'Warum sind nachgestellte Kommas in JSON ungültig?',
      answer:
        'Die JSON-Grammatik wurde bewusst eindeutig und minimal gehalten (`[1, 2, 3,]` führt zu Fehlern), während JS und TypeScript spätere Kommas zulassen.',
    },
    {
      id: 'json-val-faq-5',
      question: 'Warum darf JSON keine Kommentare enthalten?',
      answer:
        'Douglas Crockford schloss Kommentare bewusst aus, damit JSON ein reines Datenaustauschformat bleibt und keine Parser-Direktiven in Kommentaren landen. Für kommentierte Konfigs existieren JSONC und JSON5.',
    },
    {
      id: 'json-val-faq-6',
      question: 'Was ist der Unterschied zwischen Syntax- und JSON-Schema-Validierung?',
      answer:
        'Syntaxvalidierung prüft Klammern, Kommas und Zeichensatz nach RFC 8259. JSON Schema prüft inhaltliche Regeln (Pflichtfelder, Datentypen, Wertebereiche) auf Basis eines bereits syntaktisch gültigen JSON.',
    },
    {
      id: 'json-val-faq-7',
      question: 'Mein JS-Objekt sieht sauber aus, aber JSON.parse scheitert – warum?',
      answer:
        'Häufig stammt der Text aus einer Konsolen- oder Debugger-Ausgabe statt aus `JSON.stringify` und enthält einfache Anführungszeichen oder unzitierte Keys. Der Validator zeigt die exakte Stelle an.',
    },
    {
      id: 'json-val-faq-8',
      question: 'Ist JSONC oder JSON5 gültiges JSON?',
      answer:
        'Nein. Beides sind Obermengen mit Kommentaren und weiteren Erweiterungen (z. B. VS Code Settings in JSONC), die jeder strenge JSON-Parser ablehnt.',
    },
    {
      id: 'json-val-faq-9',
      question: 'Darf ein JSON-Objekt doppelte Schlüssel haben?',
      answer:
        'Die Spezifikation rät dringend davon ab, verbietet sie aber nicht explizit. Da Parser unterschiedlich oft den ersten oder letzten Wert behalten, warnen Validatoren vor Duplikaten.',
    },
  ],
  guide: {
    title: 'JSON richtig validieren und Syntaxfehler beheben',
    description: 'RFC 8259 Syntaxregeln, Trailing Commas, Anführungszeichen und Unterschied zum JSON Schema.',
    readMinutes: 5,
  },
  ui: {
    inputLabel: 'JSON-Eingabe',
    placeholder: 'JSON hier einfügen',
    emptyOutput: 'Füge JSON ein, um die Syntax zu prüfen.',
    validLabel: 'Gültiges JSON',
    invalidLabel: 'Ungültiges JSON',
    appliedPrefix: 'Korrektur angewendet:',
    loadError: 'JSON-Prozessor konnte nicht geladen werden.',
    moreAboutHeading: 'So arbeitet der JSON Validator',
    insight:
      'Prüft sofort nach RFC 8259 auf wohlgeformtes JSON und benennt den ersten Syntaxfehler. Geschäftslogik oder JSON Schema werden nicht geprüft.',
    technical: [
      { term: 'Standard', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Prüft', detail: 'Syntax und Struktur' },
      { term: 'Prüft nicht', detail: 'Schema, Datentypen oder Pflichtfelder' },
      { term: 'Ausgabe', detail: 'Gültig oder Position des ersten Fehlers' },
    ],
    engine: {
      validJsonOut: 'Gültiges JSON',
      repairBoth: 'Typografische Anführungszeichen und letztes Komma korrigieren',
      repairQuotes: 'Typografische Anführungszeichen ersetzen',
      repairComma: 'Nachgestelltes Komma entfernen',
    },
  },
};
