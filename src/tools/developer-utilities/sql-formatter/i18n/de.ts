import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'sql-formatter',
  name: 'SQL Formatter',
  seoTitle: 'SQL Formatter Online – SQL Abfragen Lesbar Formatieren',
  description:
    'Einzeilige SQL-Abfragen mit großgeschriebenen Schlüsselwörtern und sauberen Einrückungen sofort lokal im Browser formatieren – ohne Upload.',
  tagline: 'Formatiert unübersichtliches SQL sauber mit klaren Klauseln und Einrückungen.',
  citation: {
    problem: 'Nutze diesen SQL Formatter, um lange Einzeiler aus Logs lokal im Browser lesbar zu machen, ohne sie hochzuladen.',
    nonGoal: 'Abfragen auf einer Datenbank auszuführen oder deren Logik umzuschreiben.',
  },
  knowledge: {
    primaryConcepts: ['SQL-Formatierung'],
    realWorldUseCases: [
      'Einzeilige SQL-Queries aus Applikations-Logs entwirren',
      'Lange JOIN-Statements vor dem Code-Review übersichtlich gliedern',
      'Ticket-Abfragen sicher im Browser prüfen, ohne Secrets hochzuladen',
    ],
    commonMistakes: [
      'Abfragen mit Passwörtern oder API-Keys bei Server-Tools hochladen',
      'Erwarten, dass der Formatter den Ausführungsplan optimiert',
    ],
  },
  faqs: [
    {
      id: 'sql-fmt-1',
      question: 'Was verändert der SQL Formatter?',
      answer:
        'Ausschließlich das Layout: Schlüsselwörter werden großgeschrieben, Hauptklauseln beginnen in neuen Zeilen und Listen in Klammern erhalten zwei Leerzeichen Einrückung. Strings, Kommentare, Zahlen und Bezeichner bleiben unverändert.',
    },
    {
      id: 'sql-fmt-2',
      question: 'Welche SQL-Dialekte werden unterstützt?',
      answer:
        'Abgedeckt sind übliche Schlüsselwörter aus PostgreSQL, MySQL und SQLite wie SELECT, JOIN-Varianten, GROUP BY, ORDER BY, WITH, RETURNING und Dollar-Quotes. Spezielle Erweiterungen bleiben unangetastet.',
    },
    {
      id: 'sql-fmt-3',
      question: 'Wird meine SQL-Abfrage an einen Server gesendet?',
      answer:
        'Nein. Das gesamte Tokenizing und Formatieren läuft im Browser; nichts verlässt diesen Tab und die Seite funktioniert auch offline.',
    },
    {
      id: 'sql-fmt-4',
      question: 'Warum sollte man Abfragen mit Zugangsdaten nicht hochladen?',
      answer:
        'Online-Formatierer mit Backend speichern Abfragen teils in Serverlogs. Passwörter oder Tokens in WHERE-Klauseln gehören niemals auf fremde Server.',
    },
    {
      id: 'sql-fmt-5',
      question: 'Was passiert bei fehlenden Anführungszeichen?',
      answer:
        'Der Formatter bricht ab und meldet den nicht geschlossenen String mit einfachem, doppeltem oder Backtick-Anführungszeichen, ohne zu raten.',
    },
    {
      id: 'sql-fmt-6',
      question: 'Minifiziert das Tool auch SQL?',
      answer:
        'Diese Seite erstellt gut lesbares Pretty-Print-SQL. Prüfe zuerst das formatierte Statement, bevor du es für ein Log zusammenziehst.',
    },
    {
      id: 'sql-fmt-7',
      question: 'Ändert Formatieren das Laufzeitverhalten der Abfrage?',
      answer:
        'Nein. Leerzeichen und Groß-/Kleinschreibung von Schlüsselwörtern ändern in SQL weder Logik noch Daten.',
    },
    {
      id: 'sql-fmt-8',
      question: 'Bleiben Kommentare im SQL erhalten?',
      answer:
        'Ja. Sowohl `--` Zeilenkommentare als auch `/* ... */` Blockkommentare werden auf eigenen Zeilen vollständig bewahrt.',
    },
  ],
  guide: {
    title: 'SQL Formatter: Lesbare Abfragen ohne Server-Upload',
    description: 'Wie SQL-Formatierung funktioniert, unterstützte Dialekte und Schutz sensibler Zugangsdaten.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'SQL-Eingabe',
    placeholder: 'SQL hier einfügen',
    emptyOutput: 'Füge links SQL ein, um es zu formatieren.',
    validLabel: 'Gültiges SQL',
    invalidLabel: 'SQL-Fehler',
    loadError: 'SQL-Prozessor konnte nicht geladen werden.',
    toolNote: 'Ein Passwort oder API-Key in Anführungszeichen löst eine Warnung vor dem Teilen aus.',
    insight:
      'Schreibt SQL-Schlüsselwörter groß und setzt jede Hauptklausel in eine neue Zeile, während Strings, Kommentare und Bezeichner unangetastet bleiben.',
    technical: [
      { term: 'Vorgang', detail: 'Tokenisieren, Schlüsselwörter großschreiben, Klauseln einrücken' },
      { term: 'Dialekte', detail: 'Gängiges Postgres, MySQL und SQLite' },
      { term: 'Erhalten', detail: 'String-Literale, -- / /* */ Kommentare, Zahlen und Namen' },
      { term: 'Fehler', detail: 'Offene Anführungszeichen werden direkt gemeldet' },
      { term: 'Datenschutz', detail: 'Läuft im Browser und warnt bei möglichen Passwörtern' },
    ],
    engine: {
      warnSecret: 'Diese Abfrage enthält möglicherweise ein Passwort oder Secret. Das Formatieren läuft nur im Browser, kopiere Zugangsdaten aber nicht unbedacht weiter.',
      errTooLargeTpl: 'Dieses SQL überschreitet {max} Zeichen. Bitte kürze es vorher.',
      errUnclosedTpl: 'Nicht geschlossene {name}-Zeichenkette. Ergänze das fehlende {q} und versuche es erneut.',
      quoteNames: { single: 'einfache', double: 'doppelte', backtick: 'Backtick' },
    },
  },
};
