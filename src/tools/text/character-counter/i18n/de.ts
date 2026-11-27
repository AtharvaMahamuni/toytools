import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'character-counter',
  name: 'Zeichenzähler',
  seoTitle: 'Zeichenzähler Online – Mit & Ohne Leerzeichen',
  description:
    'Zähle Zeichen mit und ohne Leerzeichen sofort im Browser und prüfe Limits für Meta-Descriptions, SMS und X/Twitter. Alle Texte bleiben lokal.',
  tagline: 'Zeichen mit und ohne Leerzeichen in Echtzeit zählen.',
  citation: {
    problem: 'Nutze diesen Zeichenzähler, um exakte Zeichenlängen oder Prompt-Limits ohne Upload zu prüfen.',
    nonGoal: 'KI-Modell-Tokens zu berechnen oder Texte an einen Dienst zu senden.',
  },
  craft: {
    solves:
      'Zeichenbegrenzungen zählen oft Leerzeichen und Zeilenumbrüche mit, weshalb scheinbar passende Texte in Feldern abgeschnitten werden.',
  },
  knowledge: {
    primaryConcepts: ['Zeichenzähler'],
    realWorldUseCases: [
      'Einen Beitrag innerhalb des 280-Zeichen-Limits auf X halten',
      'Meta-Title und Meta-Description unter Googles Anzeigelimit prüfen',
      'Das 160-Zeichen-Limit einer Standard-SMS einhalten',
      'Maximallängen von Formular- und Datenbankfeldern kontrollieren',
    ],
    commonMistakes: [
      'Ohne Leerzeichen messen, obwohl die Zielplattform sie mitzählt',
      'Annehmend, jedes Emoji entspreche immer genau einem Zeichen',
    ],
  },
  faqs: [
    {
      id: 'cc-faq-1',
      question: 'Wie zähle ich Zeichen in einem Text?',
      answer:
        'Füge deinen Text ein oder tippe los – die Zählung aktualisiert sich sofort mit und ohne Leerzeichen sowie nach Zeichentypen aufgeschlüsselt.',
    },
    {
      id: 'cc-faq-2',
      question: 'Zählen Leerzeichen als Zeichen?',
      answer:
        'Ja. Jedes Leerzeichen ist ein Zeichen im Gesamtwert „mit Leerzeichen“. Die meisten Plattformen wie X, LinkedIn oder Meta-Tags zählen Leerzeichen mit.',
    },
    {
      id: 'cc-faq-3',
      question: 'Zählt ein Emoji als ein Zeichen?',
      answer:
        'Einfache Emojis zählen oft als ein oder zwei Zeichen (z. B. 2 in UTF-16 auf X/Twitter); kombinierte Emojis mit Hauttönen belegen noch mehr Zeichen.',
    },
    {
      id: 'cc-faq-4',
      question: 'Wird mein Text hochgeladen?',
      answer:
        'Nein. Die gesamte Berechnung läuft lokal per JavaScript in deinem Browser ohne Serverkontakt.',
    },
    {
      id: 'cc-faq-5',
      question: 'Was unterscheidet Zeichen mit vs. ohne Leerzeichen?',
      answer:
        'Mit Leerzeichen umfasst den kompletten Text inklusive Leerzeichen, Tabs und Zeilenumbrüchen; ohne Leerzeichen ignoriert sämtliche Whitespace-Zeichen.',
    },
    {
      id: 'cc-faq-6',
      question: 'Welche Zeichenlimits gelten auf bekannten Plattformen?',
      answer:
        'X/Twitter erlaubt 280 Zeichen, Meta-Descriptions meist rund 160 Zeichen, Standard-SMS 160 (GSM-7) bzw. 70 (Unicode), Instagram-Captions 2.200 und LinkedIn-Posts 3.000.',
    },
    {
      id: 'cc-faq-7',
      question: 'Was ist der Unterschied zwischen Zeichenzahl und Byte-Größe?',
      answer:
        'Die Zeichenzahl zählt sichtbare Zeichen, während Bytes den Speicherbedarf in UTF-8 messen: Umlaute oder Emojis benötigen dort 2 bis 4 Bytes statt 1 Byte.',
    },
    {
      id: 'cc-faq-8',
      question: 'Wie kürze ich einen Text sicher auf 280 Zeichen?',
      answer:
        'Wähle das X/Twitter-Limit und streiche Füllwörter, bis der Wert inklusive Leerzeichen und Zeilenumbrüchen bei 280 oder darunter liegt.',
    },
    {
      id: 'cc-faq-9',
      question: 'Zählen Zeilenumbrüche als Zeichen?',
      answer:
        'Ja. Jeder Absatz- oder Zeilenumbruch erhöht den Wert mit Leerzeichen um 1 und fällt beim Wert ohne Leerzeichen heraus.',
    },
    {
      id: 'cc-faq-10',
      question: 'Kann ich vertrauliche Texte oder Prompts privat prüfen?',
      answer:
        'Ja. Alle Auswertungen geschehen ausschließlich im lokalen Arbeitsspeicher deines Browsers.',
    },
    {
      id: 'cc-faq-11',
      question: 'Entspricht die Zeichenanzahl einer Token-Anzahl?',
      answer:
        'Nein. Dieses Tool misst Zeichen mit und ohne Leerzeichen und schätzt keine Sprachmodell-Tokens.',
    },
  ],
  guide: {
    title: 'Zeichen zählen: Leerzeichen, Emojis & Limits',
    description:
      'Warum Limits mit Leerzeichen zählen, wie UTF-16-Emojis und Zeilenumbrüche wirken und welche Plattform-Obergrenzen gelten.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Text oben eingeben oder einfügen, um zu zählen.',
    sampleText:
      'Schreibe oder füge hier deinen Entwurf ein, um 160 Zeichen für Meta-Descriptions oder 280 Zeichen für Posts live zu prüfen.',
    statCharacters: 'Zeichen (mit Leerz.)',
    statNoSpaces: 'Ohne Leerzeichen',
    statWords: 'Wörter',
    statSentences: 'Sätze',
    statParagraphs: 'Absätze',
    statAvgWordLength: 'Ø Wortlänge',
    btnDownloadReport: 'Bericht laden',
    headingLimits: 'Plattform-Limits',
    ariaPresets: 'Voreinstellungen für Zeichenlimits',
    presetMetaDesc: 'Meta-Description (160)',
    headingBreakdown: 'Zeichenaufschlüsselung',
    limitRemainingTpl: '{chars} / {limit} Zeichen, noch {remaining} frei ({pct}%)',
    limitOverTpl: '{chars} / {limit} Zeichen, {over} darüber',
    lblLetters: 'Buchstaben',
    lblDigits: 'Ziffern',
    lblSpaces: 'Leerzeichen',
    lblPunctuation: 'Satzzeichen',
    lblOther: 'Sonstige',
    nothingToDownload: 'Kein Text zum Herunterladen vorhanden.',
    reportTitle: 'Zeichenzähler-Bericht',
    reportActiveLimit: 'Aktives Limit:',
    reportRemaining: 'Verbleibende Zeichen:',
    reportGenerated: 'Erstellt mit ToyTools',
    reportDownloaded: 'Bericht heruntergeladen',
  },
};
