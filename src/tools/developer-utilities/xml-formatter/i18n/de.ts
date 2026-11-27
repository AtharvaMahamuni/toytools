import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'xml-formatter',
  name: 'XML Formatter und Validator',
  seoTitle: 'XML Formatter und Validator Online – Prüfen & Formatieren',
  description:
    'XML lokal im Browser einrücken oder minifizieren und Wohlgeformtheitsfehler samt Zeilennummer direkt finden – kostenlos und ohne Upload.',
  tagline: 'Formatiert oder minifiziert XML und findet Syntaxfehler sofort.',
  citation: {
    problem: 'Nutze diesen XML Formatter und Validator, um XML-Dokumente ohne Server-Upload einzurücken und auf Wohlgeformtheit zu prüfen.',
    nonGoal: 'gegen externe XSD-, DTD- oder Schematron-Schemas zu validieren.',
  },
  knowledge: {
    primaryConcepts: ['XML-Formatierung', 'XML-Validator'],
    realWorldUseCases: [
      'Einzeilige SOAP- oder RSS-Payloads aus Serverlogs ordentlich einrücken',
      'Konfigurationsdateien vor dem Deploy auf schließende Tags prüfen',
      'XML für kompakte Übertragung minifizieren',
    ],
    commonMistakes: [
      'Eine XSD-Schemaprüfung von einem Wohlgeformtheitscheck erwarten',
      'Groß-/Kleinschreibung in XML-Tagnamen wie bei HTML zu ignorieren',
    ],
  },
  faqs: [
    {
      id: 'xml-fmt-1',
      question: 'Was verändert der XML Formatter?',
      answer:
        'Bei wohlgeformtem XML nur das Layout: Pretty Print nutzt zwei Leerzeichen Einrückung pro Ebene; Minifizieren entfernt unnötigen Leerraum zwischen Tags. Namen, Attribute, Kommentare und CDATA bleiben identisch.',
    },
    {
      id: 'xml-fmt-2',
      question: 'Was bedeutet Validieren hier genau?',
      answer:
        'Wohlgeformtheit: genau ein Wurzelelement, zusammenpassende Start- und End-Tags sowie gültige Namen. Externe XSD-, DTD- oder Schematron-Schemas werden nicht geladen oder geprüft.',
    },
    {
      id: 'xml-fmt-3',
      question: 'Warum beachtet XML Groß- und Kleinschreibung?',
      answer:
        'Für XML sind `<Buch>` und `<buch>` zwei unterschiedliche Tags. Stimmt die Schreibweise beim schließenden Tag nicht exakt überein, gilt das Dokument als nicht wohlgeformt.',
    },
    {
      id: 'xml-fmt-4',
      question: 'Wie werden XML-Namespaces behandelt?',
      answer:
        'Präfixe mit `xmlns:prefix="..."` und Standard-Namespaces bleiben exakt erhalten. Es werden keine externen DTDs oder Schema-URLs abgerufen.',
    },
    {
      id: 'xml-fmt-5',
      question: 'Wird mein XML auf einen Server hochgeladen?',
      answer:
        'Nein. Parsing und Formatierung laufen lokal mit dem browser-eigenen DOMParser in deinem Tab.',
    },
    {
      id: 'xml-fmt-6',
      question: 'Woher stammt die Zeilennummer bei Fehlern?',
      answer:
        'Direkt aus der Fehlermeldung des Browser-DOMParsers, sofern dieser Zeile und Spalte liefert.',
    },
    {
      id: 'xml-fmt-7',
      question: 'Kann ich XML auch minifizieren statt einrücken?',
      answer:
        'Ja. Wähle oben rechts im Modusfeld einfach "Minifizieren", um Leerraum zwischen Elementen zu entfernen.',
    },
    {
      id: 'xml-fmt-8',
      question: 'Verändert Formatieren die Bedeutung von XML?',
      answer:
        'Elementstruktur und Attribute bleiben unverändert; reine Leerraum-Textknoten zwischen Tags werden beim Einrücken normalisiert.',
    },
  ],
  guide: {
    title: 'XML Formatter: Wohlgeformtes XML ohne Upload',
    description: 'XML im Browser formatieren und prüfen, Case-Sensitivity verstehen und Namespaces bewahren.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'XML-Eingabe',
    placeholder: 'XML hier einfügen',
    emptyOutput: 'Füge links XML ein, um es zu formatieren oder zu minifizieren.',
    validLabel: 'Gültiges XML',
    invalidLabel: 'Ungültiges XML',
    loadError: 'XML-Prozessor konnte nicht geladen werden.',
    modePretty: 'Einrücken',
    modeMinify: 'Minifizieren',
    modeAriaLabel: 'Modus',
    toolNote: 'Der erste Wohlgeformtheitsfehler nennt eine Zeilennummer, sobald der Browser diese meldet.',
    insight:
      'Rückt wohlgeformtes XML lesbar ein und erkennt Syntaxfehler über den eingebauten Browser-DOMParser ohne Datenübertragung.',
    technical: [
      { term: 'Vorgang', detail: 'Mit DOMParser parsen, dann mit 2 Leerzeichen einrücken oder minifizieren' },
      { term: 'Validierung', detail: 'Wohlgeformtheit: passende Tags, ein Wurzelelement, gültige Namen' },
      { term: 'Nicht geprüft', detail: 'DTD-, XSD- oder Schematron-Schemas' },
      { term: 'Erhalten', detail: 'Elemente, Attribute, Text, Kommentare und CDATA' },
      { term: 'Datenschutz', detail: 'Läuft lokal im Browser ohne Serverkontakt' },
    ],
    engine: {
      errNoParser: 'XML-Parsing ist in dieser Umgebung nicht verfügbar.',
      whereLineColTpl: ' (Zeile {line}, Spalte {col})',
      whereLineTpl: ' (Zeile {line})',
      errMalformed: 'Fehlerhaftes XML',
      errNoRoot: 'Fehlerhaftes XML: Kein Wurzelelement gefunden.',
    },
  },
};
