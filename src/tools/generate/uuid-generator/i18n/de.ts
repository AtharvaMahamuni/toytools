import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'uuid-generator',
  name: 'UUID-Generator',
  seoTitle: 'UUID-Generator Online – Zufällige v4 UUIDs',
  description:
    'Erstelle zufällige Version-4-UUIDs (GUID) lokal im Browser. Einzelne oder bis zu 100 Stück auf einmal mit wählbaren Bindestrichen und Großschreibung.',
  tagline: 'Zufällige Version-4-UUIDs einzeln oder als Stapel.',
  craft: {
    solves:
      'Version-4-UUIDs besitzen feste 4-Bit-Versions- und 2-Bit-RFC-4122-Varianten-Bits zur eindeutigen Abgrenzung von v7- oder Nil-UUIDs.',
  },
  knowledge: {
    primaryConcepts: ['UUID-Generierung', 'eindeutige Kennungen'],
    realWorldUseCases: [
      'Primärschlüssel für neue Datenbankzeilen vergeben',
      'Dateien oder Objekte kollisionsfrei benennen',
      'Logs über Request-IDs verteilter Dienste verknüpfen',
      'Stabile IDs für Offline-Datensätze vor der Synchronisierung erzeugen',
    ],
    commonMistakes: [
      'UUIDs als unerratbares Sicherheitsgeheimnis behandeln',
      'Eine UUID als Sitzungs-Token oder Passwort einsetzen',
      'UUIDs als Text speichern statt den nativen UUID-Spaltentyp zu nutzen',
      'Erwarten, dass v4-UUIDs zeitlich sortierbar sind',
    ],
  },
  fields: {
    count: { label: 'Anzahl' },
    version: { label: 'Version', options: { v4: 'v4 (zufällig)' } },
    hyphens: { label: 'Bindestriche einschließen', group: 'Format' },
    uppercase: { label: 'Großbuchstaben', group: 'Format' },
  },
  faqs: [
    {
      id: 'uuid-generator-faq-1',
      question: 'Was ist eine UUID?',
      answer:
        'Eine UUID (Universally Unique Identifier) ist ein 128-Bit-Wert in 36-stelliger Schreibweise wie `f47ac10b-58cc-4372-a567-0e02b2c3d479`. Verschiedene Systeme können sie unabhängig ohne zentrale Vergabestelle erzeugen.',
    },
    {
      id: 'uuid-generator-faq-2',
      question: 'Wofür steht UUID und ist GUID dasselbe?',
      answer:
        'UUID steht für Universally Unique Identifier, GUID für Globally Unique Identifier (Microsofts Bezeichnung). Beide bezeichnen praktisch dasselbe 128-Bit-Format.',
    },
    {
      id: 'uuid-generator-faq-3',
      question: 'Welche UUID-Version erstellt dieses Tool?',
      answer:
        'Version 4 (zufallsbasiert nach RFC 4122). Sie enthält weder Zeitstempel noch MAC-Adresse und gilt daher als datenschutzfreundlicher Standard.',
    },
    {
      id: 'uuid-generator-faq-4',
      question: 'Wie benutze ich diesen UUID-Generator?',
      answer:
        'Wähle die gewünschte Stückzahl sowie Bindestriche und Groß-/Kleinschreibung. Die Werte erscheinen sofort und lassen sich gesammelt kopieren oder neu erzeugen.',
    },
    {
      id: 'uuid-generator-faq-5',
      question: 'Wie ist eine Version-4-UUID aufgebaut?',
      answer:
        'Sie besteht aus fünf Hex-Gruppen im Muster 8-4-4-4-12. Die 13. Stelle ist immer `4` (Version), die 17. Stelle `8`, `9`, `a` oder `b` (RFC-4122-Variante).',
    },
    {
      id: 'uuid-generator-faq-6',
      question: 'Sind UUIDs garantiert eindeutig?',
      answer:
        'Mathematisch nicht zu 100 % ausgeschlossen, bei 122 Zufallsbits (über 5 × 10^36 Kombinationen) ist eine Kollision im praktischen Betrieb jedoch vernachlässigbar.',
    },
    {
      id: 'uuid-generator-faq-7',
      question: 'Ist dieser Generator sicher und privat?',
      answer:
        'Ja. Alle UUIDs werden lokal über die kryptografische Web Crypto API deines Browsers erzeugt und niemals an Server übertragen.',
    },
    {
      id: 'uuid-generator-faq-8',
      question: 'Funktioniert das Tool auch offline?',
      answer:
        'Ja. Sobald die Seite geladen ist, arbeitet sie komplett lokal im Browser ohne Internetverbindung.',
    },
    {
      id: 'uuid-generator-faq-9',
      question: 'Kann ich mehrere UUIDs auf einmal generieren?',
      answer:
        'Ja, bis zu 100 UUIDs pro Durchgang werden zeilenweise ausgegeben und stehen sofort bereit.',
    },
    {
      id: 'uuid-generator-faq-10',
      question: 'Wie kopiere ich alle generierten UUIDs?',
      answer:
        'Ein Klick auf Kopieren übernimmt die gesamte Liste zeilengetreu in die Zwischenablage.',
    },
    {
      id: 'uuid-generator-faq-11',
      question: 'Kann ich die Bindestriche entfernen?',
      answer:
        'Ja. Deaktiviere Bindestriche, um eine kompakte 32-stellige Hex-Zeichenkette mit identischem Wert zu erhalten.',
    },
    {
      id: 'uuid-generator-faq-12',
      question: 'Lassen sich UUIDs auch in Großbuchstaben ausgeben?',
      answer:
        'Ja. Mit Großbuchstaben werden `a-f` als `A-F` dargestellt. Der Wert bleibt unverändert.',
    },
    {
      id: 'uuid-generator-faq-13',
      question: 'Wann sollte man eine UUID statt einer normalen ID wählen?',
      answer:
        'Wenn IDs verteilt in mehreren Services, im Client oder offline vergeben werden sollen, ohne eine zentrale Sequenz abzufragen.',
    },
    {
      id: 'uuid-generator-faq-14',
      question: 'Was unterscheidet UUID v4 von v1?',
      answer:
        'Version 1 kodiert Zeitstempel und Rechneradresse und lässt Rückschlüsse auf Herkunft und Zeitpunkt zu. Version 4 ist vollständig zufällig.',
    },
    {
      id: 'uuid-generator-faq-15',
      question: 'Eignet sich eine UUID als Passwort oder API-Geheimnis?',
      answer:
        'Nein, ideal ist das nicht: Feste Formatbits und häufige Sichtbarkeit in URLs/Logs machen sie zu einem schlechten Geheimnis. Nutze dafür den Passwort-Generator.',
    },
    {
      id: 'uuid-generator-faq-16',
      question: 'Sortieren v4-UUIDs in Erstellreihenfolge?',
      answer:
        'Nein. Da v4 zufällig ist, spiegelt die Zeichenfolge keine zeitliche Reihenfolge wider. Ergänze bei Bedarf eine separate Zeitstempel-Spalte.',
    },
    {
      id: 'uuid-generator-faq-17',
      question: 'Sind UUIDs geheim oder schwer zu erraten?',
      answer:
        'Sie lassen sich zwar kaum erraten, gehören aber als sichtbare Kennung häufig in URLs und Logs – betrachte sie deshalb nicht als Zugriffsschutz.',
    },
    {
      id: 'uuid-generator-faq-18',
      question: 'Wie speichere ich eine UUID in einer Datenbank?',
      answer:
        'Nutze falls vorhanden den nativen `UUID`-Datentyp (16 Byte binär) statt eines 36-Zeichen-Strings und indiziere die Spalte.',
    },
    {
      id: 'uuid-generator-faq-19',
      question: 'Warum hat meine Datenbank eine UUID abgelehnt?',
      answer:
        'Meist fehlen die Bindestriche bei einer strikten `UUID`-Spalte oder es gibt Vorgaben zur Groß-/Kleinschreibung.',
    },
    {
      id: 'uuid-generator-faq-20',
      question: 'In welchen Browsern läuft der UUID-Generator?',
      answer:
        'In allen aktuellen Desktop- und Mobilbrowsern (Chrome, Firefox, Safari, Edge) mit Unterstützung für Web Crypto.',
    },
    {
      id: 'uuid-generator-faq-21',
      question: 'Merkt sich die Seite meine erzeugten UUIDs?',
      answer:
        'Nein. Nur deine Darstellungsoptionen werden lokal gespeichert, niemals generierte Werte.',
    },
    {
      id: 'uuid-generator-faq-22',
      question: 'Werden Daten hochgeladen oder geteilt?',
      answer:
        'Nein. Keine Serveranfragen, kein Account und kein Tracking der erstellten IDs.',
    },
  ],
  guide: {
    title: 'Was ist eine UUID v4 und wie setzt man sie ein?',
    description:
      'Aufbau nach RFC 4122, Vergleich zwischen UUID v4 und v1, Speicherung als 16-Byte-Feld und typische Fehler vermeiden.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Optionen einstellen und UUID erzeugen.',
    engine: {
      metaVersion: 'Version',
      versionV4: 'v4 (zufällig)',
      metaCount: 'Anzahl',
    },
  },
};
