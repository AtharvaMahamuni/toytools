import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'text-compare',
  name: 'Textvergleich',
  seoTitle: 'Textvergleich Online – Zwei Texte Direkt Vergleichen (Diff)',
  description:
    'Vergleichen Sie zwei Texte nebeneinander und sehen Sie sofort, welche Zeilen hinzugefügt oder entfernt wurden. Alles bleibt lokal auf Ihrem Gerät.',
  tagline: 'Zwei Texte vergleichen und sofort erkennen, welche Zeilen sich geändert haben.',
  knowledge: {
    primaryConcepts: ['textvergleich', 'diff-prüfung'],
    realWorldUseCases: [
      'Änderungen zwischen zwei Dokument-Entwürfen schnell aufspüren',
      'Korrekturen und Bearbeitungen von Kollegen prüfen',
      'Zwei Konfigurations- oder Code-Abschnitte vergleichen',
      'Eine überarbeitete Fassung gegen das Original gegenlesen',
    ],
    commonMistakes: [
      'Ohne vorherige Leerzeichen-Normalisierung vergleichen und dadurch unnötige Diffs erzeugen',
      'Ein Zusammenführen (Merge) erwarten statt einer reinen Änderungsansicht',
    ],
  },
  faqs: [
    {
      id: 'tc-faq-1',
      question: 'Wie vergleiche ich zwei Texte online?',
      answer:
        'Fügen Sie den ursprünglichen Text links und die neue Fassung rechts ein. Das Werkzeug markiert sofort alle hinzugefügten, entfernten und unveränderten Zeilen und zeigt dazu die prozentuale Ähnlichkeit an.',
    },
    {
      id: 'tc-faq-2',
      question: 'Vergleicht das Tool Zeichen für Zeichen oder zeilenweise?',
      answer:
        'Es führt einen zeilenweisen Vergleich (Line Diff) durch, genau wie git diff. Ändern Sie ein Wort innerhalb einer Zeile, wird die ganze Zeile als entfernt und neu hinzugefügt markiert. Bei Verträgen, Texten und Konfigurationen lässt sich das besonders schnell überblicken.',
    },
    {
      id: 'tc-faq-3',
      question: 'Was bedeuten die Zeichen + und - im Ergebnis?',
      answer:
        'Eine Zeile mit + wurde im neuen Text hinzugefügt. Eine Zeile mit - wurde aus dem Original entfernt. Unveränderte Zeilen erscheinen gedämpft ohne Vorzeichen.',
    },
    {
      id: 'tc-faq-4',
      question: 'Wird mein Text beim Vergleichen an einen Server übertragen?',
      answer:
        'Nein. Der gesamte Textvergleich läuft direkt per JavaScript in Ihrem Browser. Kein Zeichen verlässt Ihr Gerät.',
    },
    {
      id: 'tc-faq-5',
      question: 'Was bedeutet der Ähnlichkeitswert in Prozent?',
      answer:
        'Er gibt an, welcher Anteil der Zeilen in beiden Texten übereinstimmt. 100% bedeutet identische Texte, 0% keinerlei gemeinsame Zeilen. Stimmen 9 von 10 Zeilen überein, liegt die Ähnlichkeit bei 90%.',
    },
    {
      id: 'tc-faq-6',
      question: 'Unterscheidet der Vergleich Groß- und Kleinschreibung?',
      answer:
        'Ja. Standardmäßig wird exakt zwischen Groß- und Kleinschreibung unterschieden, sodass „Hallo“ und „hallo“ wie bei klassischen Diff-Werkzeugen als unterschiedliche Zeilen gelten.',
    },
    {
      id: 'tc-faq-7',
      question: 'Kann ich mehr als zwei Texte gleichzeitig vergleichen?',
      answer:
        'Der Vergleich arbeitet immer paarweise mit zwei Fassungen. Bei mehreren Versionen vergleichen Sie nacheinander Original vs. Version 1, danach Version 1 vs. Version 2.',
    },
    {
      id: 'tc-faq-8',
      question: 'Was ist der Unterschied zwischen Textvergleich und Suchen & Ersetzen?',
      answer:
        'Der Textvergleich ist rein lesend und macht Unterschiede zwischen zwei Fassungen sichtbar, ohne etwas umzuschreiben. Suchen & Ersetzen verändert dagegen einen Text aktiv anhand fester Muster.',
    },
    {
      id: 'tc-faq-9',
      question: 'Warum erscheinen Leerzeichen am Zeilenende als Änderungen?',
      answer:
        'Weil Zeilen nur bei zeichengenauer Gleichheit übereinstimmen. Ein unsichtbares Leerzeichen am Ende oder unterschiedliche Zeilenumbrüche (CRLF/LF) trennen sonst identische Zeilen. Bei reinem Whitespace-Rauschen bietet der Hinweis oben an, diesen mit einem Klick auszublenden.',
    },
    {
      id: 'tc-faq-10',
      question: 'Warum wirken verschobene Absätze wie komplett neu geschrieben?',
      answer:
        'Weil zeilenweise Diffs die Reihenfolge berücksichtigen. Wird ein Absatz an eine andere Stelle verschoben, erscheint er am alten Platz als gelöscht und am neuen Platz als eingefügt.',
    },
  ],
  guide: {
    title: 'Textvergleich: Zwei Texte per Diff prüfen',
    description:
      'So vergleichen Sie zwei Textversionen, lesen Diff-Markierungen richtig und nutzen den Vergleich für Korrekturlesen und Code-Reviews.',
    readMinutes: 4,
  },
  ui: {
    btnSampleAria: 'Beispieltexte zum Vergleichen laden',
    panelOriginal: 'Original',
    phOriginal: 'Ursprünglichen Text einfügen...',
    ariaOriginal: 'Ursprünglicher Text',
    panelNew: 'Neuer Text',
    phNew: 'Neuen Text einfügen...',
    ariaNew: 'Neuer Text',
    ariaDiffResult: 'Ergebnis des Textvergleichs',
    sampleA: 'Die erste Zeile bleibt unverändert.\nDiese Zeile wird entfernt.\nDritte Zeile mit kleinem Tippfehler.\nVierte Zeile bleibt genau gleich.',
    sampleB: 'Die erste Zeile bleibt unverändert.\nDritte Zeile ohne Fehler.\nVierte Zeile bleibt genau gleich.\nDiese neue Zeile wurde ergänzt.',
    msgIdentical: 'Beide Texte sind identisch.',
    msgSummaryTpl: 'Texte sind zu {sim}% ähnlich: {added} hinzugefügt, {removed} entfernt.',
    wsIgnoringTpl: 'Ignoriere {level}. ',
    wsOtherwiseIdentical: 'Abgesehen davon sind beide Texte identisch.',
    wsNormChangedTpl: '{norm} von {raw} geänderten Zeilen unterscheiden sich sichtbar.',
    wsOnlyDiffTpl: 'Unterschiede betreffen nur {level}. Alle {raw} geänderten Zeilen sind inhaltlich gleich.',
    wsSomeDiffTpl: '{diff} von {raw} geänderten Zeilen unterscheiden sich nur durch {level}.',
    btnShowRaw: 'Rohes Diff zeigen',
    btnIgnorePrefix: 'Ignorieren: ',
    lblAdded: 'Hinzugefügt',
    lblRemoved: 'Entfernt',
    lblUnchanged: 'Unverändert',
    lblSimilarity: 'Ähnlichkeit',
    unchangedRunTpl: '⋯ {n} unveränderte Zeilen',
  },
};
