import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'unix-timestamp-converter',
  name: 'Unix-Zeitstempel-Umrechner',
  seoTitle: 'Unix Timestamp Umrechner – Epoch in Datum & Zurück',
  description:
    'Unix-Zeitstempel (Epoch) in ein lesbares Datum oder umgekehrt in Sekunden bzw. Millisekunden umrechnen, inklusive UTC, ISO 8601 und Ortszeit.',
  tagline: 'Unix-Zeitstempel in Datum und zurück umrechnen, in Sekunden oder Millisekunden.',
  knowledge: {
    primaryConcepts: ['unix-zeitstempel', 'epoch-umrechner'],
    realWorldUseCases: [
      'Unix-Zeitstempel aus Server-Logs, Datenbankzeilen oder API-Antworten ablesen.',
      'Ein bestimmtes Datum für Konfigurationen oder Datenbankabfragen in Epoch-Zeit umwandeln.',
      'Prüfen, ob ein Zeitstempel in Sekunden oder Millisekunden vorliegt.',
    ],
    commonMistakes: [
      'Einen Millisekunden-Zeitstempel als Sekunden einlesen, sodass das Datum tausende Jahre in der Zukunft liegt.',
      'Annehmen, ein Unix-Zeitstempel richte sich nach der lokalen Zeitzone statt nach UTC.',
      'Vergessen, dass die Unix-Epoche am 1. Januar 1970 beginnt und frühere Daten negativ sind.',
    ],
  },
  faqs: [
    {
      id: 'unix-timestamp-converter-faq-1',
      question: 'Wie rechne ich einen Unix-Zeitstempel in ein Datum um?',
      answer:
        'Belassen Sie die Richtung auf „Zeitstempel in Datum“, fügen Sie die Zahl ein und wählen Sie Sekunden oder Millisekunden. Sie sehen sofort UTC, ISO 8601, Ihre Ortszeit und den Wochentag. 1700000000 Sekunden entsprechen etwa Dienstag, 14. November 2023 um 22:13:20 UTC.',
    },
    {
      id: 'unix-timestamp-converter-faq-2',
      question: 'Wie wandle ich ein Datum in einen Unix-Zeitstempel um?',
      answer:
        'Schalten Sie auf „Datum in Zeitstempel“ um und wählen Sie Datum und Uhrzeit. Die Eingabe wird als UTC interpretiert, sodass Sie weltweit exakt denselben Wert in Sekunden und Millisekunden erhalten.',
    },
    {
      id: 'unix-timestamp-converter-faq-3',
      question: 'Sind Unix-Zeitstempel in Sekunden oder Millisekunden angegeben?',
      answer:
        'Beides ist üblich. Klassische Unix-Zeit zählt Sekunden (heute 10 Stellen), während JavaScript und viele APIs Millisekunden nutzen (13 Stellen, Faktor 1000). Ergibt ein Zeitstempel ein Datum weit in der Zukunft, handelt es sich fast sicher um Millisekunden.',
    },
    {
      id: 'unix-timestamp-converter-faq-4',
      question: 'Was ist die Unix-Epoche?',
      answer:
        'Die Unix-Epoche ist der 1. Januar 1970 um 00:00:00 UTC. Ein Unix-Zeitstempel zählt die seitdem vergangenen Sekunden (oder Millisekunden). Zeitpunkte vor 1970 sind negativ und unabhängig von jeder Zeitzone.',
    },
    {
      id: 'unix-timestamp-converter-faq-5',
      question: 'Werden Datenbank-Zeitstempel oder Log-Daten an einen Server gesendet?',
      answer:
        'Nein. Sämtliche Berechnungen und ISO-8601-Formatierungen laufen ausschließlich lokal in Ihrem Browser.',
    },
  ],
  guide: {
    title: 'Unix-Zeitstempel in Datum umrechnen',
    description:
      'Was ein Unix-Timestamp ist, wie die Epoche seit 1970 funktioniert, wie man Sekunden von Millisekunden unterscheidet und lokal umrechnet.',
    readMinutes: 4,
  },
  fields: {
    mode: {
      label: 'Richtung',
      options: {
        'to-date': 'Zeitstempel in Datum',
        'to-timestamp': 'Datum in Zeitstempel',
      },
    },
    timestamp: {
      label: 'Unix-Zeitstempel',
      help: 'Positive oder negative ganze Zahl eingeben.',
    },
    unit: {
      label: 'Einheit des Zeitstempels',
      options: {
        seconds: 'Sekunden (heute 10-stellig)',
        milliseconds: 'Millisekunden (heute 13-stellig)',
      },
    },
    datetime: {
      label: 'Datum und Uhrzeit (UTC)',
      help: 'Wird als UTC-Zeit gelesen.',
    },
  },
  ui: {
    emptyText: 'Unix-Zeitstempel oder Datum zur Umrechnung eingeben.',
    resultNote: 'Sofortige Berechnung lokal auf Ihrem Gerät.',
    engine: {
      errEnterTs: 'Geben Sie einen Unix-Zeitstempel für die Umrechnung ein.',
      errNotNumber: 'Der Zeitstempel muss eine gültige Zahl sein.',
      errOutOfRange: 'Dieser Zeitstempel liegt außerhalb des unterstützten Bereichs.',
      heroUtc: 'UTC-Zeit',
      labelLocal: 'Ihre Ortszeit',
      labelWeekday: 'Wochentag',
      labelMillis: 'In Millisekunden',
      rightNow: 'gerade eben',
      unitSeconds: 'Sekunden',
      unitMillis: 'Millisekunden',
      insightMillis: '13 Ziffern deuten auf Millisekunden hin. Als Millisekunden entspricht das {iso}. Stellen Sie die Einheit auf Millisekunden um.',
      insightUtc: 'In UTC ist das {time} am {date}.',
      insightRel: 'Dieser Zeitpunkt liegt {rel}.',
      msAfterEpoch: 'Nach der Unix-Epoche (1970)',
      ms32Bit: 'Innerhalb des 32-Bit-Sekundenbereichs',
      decTimezone: 'Diese Uhrzeit in eine andere Zeitzone umrechnen',
      decDiff: 'Tage zwischen zwei Daten zählen',
      nextQsToDate: [
        'Wie spät ist es in einer anderen Zeitzone?',
        'Wie viele Tage liegen dazwischen?',
      ],
      explToDate: 'Ein Unix-Zeitstempel zählt die Sekunden seit dem 1. Januar 1970 UTC (Unix-Epoche). {val} {unit} entspricht {iso}, also {utc} UTC.',
      fieldDatetime: 'ein Datum und eine Uhrzeit',
      heroUnix: 'Unix-Zeitstempel',
      heroUnixNote: 'Sekunden seit 1. Januar 1970 UTC',
      labelInterpreted: 'Interpretiert als',
      noteUtc: 'Eingegebene Zeit wird als UTC gelesen',
      insightUtcInput: 'Datum und Uhrzeit werden als UTC gelesen, sodass der Zeitstempel weltweit identisch ist.',
      decAge: 'Genaues Alter berechnen',
      nextQsToTs: [
        'Welches Datum stellt ein Unix-Zeitstempel dar?',
        'Was passiert beim Jahr-2038-Problem mit 32 Bit?',
      ],
      explToTs: 'Als UTC gelesen entspricht {utc} genau {sec} Sekunden seit dem 1. Januar 1970, beziehungsweise {ms} Millisekunden.',
    },
  },
};
