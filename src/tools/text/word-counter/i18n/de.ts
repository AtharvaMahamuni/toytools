import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'word-counter',
  name: 'Wörterzähler',
  seoTitle: 'Wörterzähler Online: Wörter & Zeichen zählen',
  description:
    'Wörter, Zeichen, Sätze, Absätze und Lesezeit live im Browser zählen. Mit Wortziel-Fortschritt ohne Upload auf fremde Server.',
  tagline: 'Wörter und Zeichen beim Tippen zählen und ein Wortziel verfolgen.',
  citation: {
    problem: 'Nutzen Sie diesen Wörterzähler, um die Länge von Aufsätzen, Artikeln oder Prompts exakt und lokal zu prüfen.',
    nonGoal: 'den Text umzuschreiben oder an ein KI-Sprachmodell zu senden.',
  },
  knowledge: {
    primaryConcepts: ['wörterzähler'],
    realWorldUseCases: [
      'Wortlimits in Hausarbeiten, Abstracts und Bewerbungen sicher einhalten',
      'Ziel-Textlängen für Fachartikel und Produktbeschreibungen prüfen',
      'Übersetzungs- oder Texter-Honorare anhand exakter Wortzahlen kalkulieren',
      'Anschreiben sauber auf eine Druckseite kürzen',
    ],
    commonMistakes: [
      'Annehmen, dass alle Programme zusammengesetzte Begriffe mit Bindestrich identisch zählen',
      'Vergessen, ob Literaturverzeichnisse oder Fußnoten zum Wortlimit gehören',
    ],
  },
  faqs: [
    {
      id: 'wc-faq-1',
      question: 'Wie funktioniert ein Wörterzähler?',
      answer:
        'Der Zähler zerlegt Ihren Text anhand definierter Trennzeichen in einzelne Wörter. Dieses Tool trennt bei Leerzeichen, Zeilenumbrüchen, Gedankenstrichen sowie Kommas außerhalb von Zahlen, während Webadressen als ein Wort zählen.',
    },
    {
      id: 'wc-faq-2',
      question: 'Was genau gilt als ein Wort?',
      answer:
        'Jede Zeichenfolge zwischen Trennzeichen gilt als Wort: Zahlen ("42"), Begriffe mit Bindestrich ("E-Mail") und URLs zählen jeweils als ein Wort, "rot,grün" ohne Leerzeichen als zwei Wörter.',
    },
    {
      id: 'wc-faq-3',
      question: 'Was ist der Unterschied zwischen Wort- und Zeichenanzahl?',
      answer:
        'Die Wortanzahl zählt getrennte Begriffe; die Zeichenanzahl erfasst jedes einzelne Zeichen inklusive Leer- und Satzzeichen. "Hallo, Welt!" besteht aus 2 Wörtern und 12 Zeichen.',
    },
    {
      id: 'wc-faq-4',
      question: 'Wird mein Text hochgeladen?',
      answer:
        'Nein. Sämtliche Berechnungen erfolgen direkt lokal in Ihrem Browser.',
    },
    {
      id: 'wc-faq-5',
      question: 'Wie lange dauert es, 1000 Wörter zu lesen?',
      answer:
        'Bei durchschnittlichem Lesetempo von 200 bis 250 Wörtern pro Minute benötigen Leser rund 4 bis 5 Minuten. Dieses Tool rechnet mit 200 Wörtern pro Minute.',
    },
    {
      id: 'wc-faq-6',
      question: 'Welche Zeichenlimits gelten bei X oder LinkedIn?',
      answer:
        'X (Twitter) begrenzt reguläre Beiträge auf 280 Zeichen, LinkedIn-Posts erlauben bis zu 3.000 Zeichen und LinkedIn-Artikel bis zu 125.000 Zeichen.',
    },
    {
      id: 'wc-faq-7',
      question: 'Warum liefern verschiedene Programme leicht unterschiedliche Wortzahlen?',
      answer:
        'Unterschiede entstehen meist bei Bindestrichen, Zahlenformaten, Abkürzungen und Mehrfachleerzeichen. Für Prüfungen zählt stets das vom System Ihrer Hochschule genannte Werkzeug.',
    },
    {
      id: 'wc-faq-8',
      question: 'Wie wird die Lesezeit berechnet?',
      answer:
        'Die Gesamtzahl der Wörter wird durch ein Standardtempo von 200 Wörtern pro Minute geteilt. Anspruchsvolle Fachtexte liegen oft bei 100 bis 150 Wörtern pro Minute.',
    },
    {
      id: 'wc-faq-9',
      question: 'Werden Überschriften mitgezählt?',
      answer:
        'Ja, jedes Wort im Eingabefeld fließt in die Zählung ein. Möchten Sie nur den Fließtext messen, fügen Sie nur diesen Abschnitt ein.',
    },
    {
      id: 'wc-faq-10',
      question: 'Kann ich vertrauliche Dokumente bedenkenlos prüfen?',
      answer:
        'Ja. Wortfrequenz, Lesezeit und Zählung bleiben vollständig im Arbeitsspeicher Ihres Browsers.',
    },
    {
      id: 'wc-faq-11',
      question: 'Zählt der Wörterzähler auch KI-Tokens?',
      answer:
        'Nein. Er zählt menschliche Wörter, Zeichen, Sätze und Absätze, keine Subword-Tokens von Sprachmodellen.',
    },
  ],
  guide: {
    title: 'Wörter richtig zählen und Textlängen steuern',
    description: 'Wie Wortzählung funktioniert, warum Programme abweichen und wie Sie Wortlimits sicher einhalten.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Text einfügen oder eingeben, um Wörter zu zählen.',
    sampleText: 'Der flinke braune Fuchs springt über den trägen Hund am alten Bauernhof vorbei. Eine sanfte Brise bewegte die Blätter der hohen Eiche und trug den Duft von Wildblumen über die Wiese, während ein schmaler Bach ruhig über bemooste Steine plätscherte.',
    statWords: 'Wörter',
    statCharacters: 'Zeichen',
    statSentences: 'Sätze',
    statParagraphs: 'Absätze',
    statReadingTime: 'Lesezeit',
    statUniqueWords: 'Eindeutige Wörter',
    btnDownloadReport: 'Bericht laden',
    lblGoal: 'Wortziel',
    goalPlaceholder: 'z. B. 500',
    btnClearGoal: 'Ziel löschen',
    headingTopWords: 'Häufigste Wörter',
    lblHideCommon: 'Füllwörter ausblenden',
    btnSortFreq: 'Nach Häufigkeit',
    btnSortAlpha: 'Alphabetisch',
    summaryInsights: 'Wortstatistiken',
    stopWords: 'der die das ein eine einer einem einen und oder aber in im an auf zu für von mit bei durch aus ist sind war waren sein haben hat hatte werden wird wurde kann muss soll wie was wer wo als auch noch nur sehr mehr nicht kein keine',
    goalRemainTpl: '{cur} / {goal} Wörter (noch {rem}, {pct}%)',
    goalDoneTpl: '{cur} / {goal} Wörter: Ziel erreicht!',
    noWordsFound: 'Keine Wörter gefunden.',
    insightLongest: 'Längstes Wort',
    insightShortest: 'Kürzestes Wort',
    insightRepeated: 'Wiederholte Wörter',
    toastEmptyDownload: 'Nichts zum Herunterladen vorhanden',
    reportHeading: 'Wortzählungsbericht',
    reportGoalPrefix: 'Ziel: ',
    reportWordsSuffix: 'Wörter',
    reportGeneratedPrefix: 'Erstellt: ',
    toastDownloaded: 'Bericht heruntergeladen',
  },
};
