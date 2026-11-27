import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'css-minifier',
  name: 'CSS Minifier und Beautifier',
  seoTitle: 'CSS Minifier und Beautifier Online – CSS Komprimieren',
  description:
    'CSS für die Produktion minifizieren oder kompaktes CSS wieder lesbar formatieren – direkt im Browser inklusive Anzeige der gesparten Bytes.',
  tagline: 'CSS für die Auslieferung schrumpfen oder kompaktes CSS lesbar machen.',
  citation: {
    problem: 'Nutze diesen CSS Minifier und Beautifier, um Stylesheets ohne Upload zu verkleinern oder lesbar aufzubereiten.',
    nonGoal: 'Autoprefixing, Transpilieren oder Zusammenführen doppelter Regeln.',
  },
  knowledge: {
    primaryConcepts: ['CSS-Minifizierung', 'CSS Beautifier'],
    realWorldUseCases: [
      'Handgeschriebenes Stylesheet vor dem Einbinden verkleinern',
      'Minifiziertes CSS aus Drittquellen zum Debuggen formatieren',
      'Prüfen, wie viele Bytes Kommentare und Leerzeichen belegen',
    ],
    commonMistakes: [
      'Erwarten, dass ein reiner Tokenizer ungenutzte Regeln entfernt',
      'Die einzige bearbeitbare Kopie eines Stylesheets überschreiben',
    ],
  },
  faqs: [
    {
      id: 'css-min-1',
      question: 'Was entfernt das CSS-Minifizieren?',
      answer:
        'Kommentare und unnötigen Leerraum außerhalb von Strings und `url()`. Selektoren, Custom Properties und `calc()`-Ausdrücke bleiben völlig unberührt.',
    },
    {
      id: 'css-min-2',
      question: 'Was kann das Tool nicht gefahrlos entfernen?',
      answer:
        'Ungenutzte Regeln, doppelte Selektoren oder gekürzte Farbwerte. Dafür bräuchte man Kenntnis des gesamten HTMLs; blindes Eingreifen im Browser könnte Layouts zerstören.',
    },
    {
      id: 'css-min-3',
      question: 'Was bewirkt der Modus Formatieren (Beautify)?',
      answer:
        'Er erweitert minifiziertes CSS mit zwei Leerzeichen Einrückung und sauberen Zeilenumbrüchen nach Semikolon und geschweiften Klammern.',
    },
    {
      id: 'css-min-4',
      question: 'Wird mein CSS an einen Server gesendet?',
      answer:
        'Nein. Tokenizing, Minifizieren und Formatieren laufen vollständig lokal im Browser.',
    },
    {
      id: 'css-min-5',
      question: 'Ändert Minifizieren das Aussehen meiner Website?',
      answer:
        'Bei normalem CSS nicht, da Leerraum zwischen Tokens keine optische Bedeutung hat. Bewahre für komplexe Hacks dennoch immer die Quelldatei.',
    },
    {
      id: 'css-min-6',
      question: 'Unterstützt das Tool @media und verschachtelte Blöcke?',
      answer:
        'Ja auf Token-Ebene: Geschweifte Klammern werden beim Minifizieren und Formatieren sauber geöffnet und geschlossen.',
    },
    {
      id: 'css-min-7',
      question: 'Warum zeigt das Tool die gesparten Bytes an?',
      answer:
        'So erkennst du sofort den Nutzen: Bei winzigen Dateien spart ein Pass nach gzip kaum etwas, bei großen kommentierten Dateien fallen ganze Kilobytes weg.',
    },
    {
      id: 'css-min-8',
      question: 'Wann sollte man besser nicht minifizieren?',
      answer:
        'Wenn du die Datei noch von Hand bearbeitest oder dein Build-System beim Deployment ohnehin selbst minifiziert.',
    },
  ],
  guide: {
    title: 'CSS Minifier: Styles schrumpfen und formatieren',
    description: 'Wie CSS-Minifizierung im Browser arbeitet, was sicher entfernt wird und wann Formatieren sinnvoll ist.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'CSS-Eingabe',
    placeholder: 'CSS hier einfügen',
    emptyOutput: 'Füge links CSS ein, um es zu formatieren oder zu minifizieren.',
    validLabel: 'CSS verarbeitet',
    invalidLabel: 'CSS-Fehler',
    loadError: 'CSS-Prozessor konnte nicht geladen werden.',
    modeBeautify: 'Formatieren',
    modeMinify: 'Minifizieren',
    modeAriaLabel: 'Modus',
    toolNote: 'Beim Minifizieren zeigt die Statuszeile exakt, wie viele Bytes gespart wurden.',
    insight:
      'Minifizieren entfernt Kommentare und Leerraum für kleinere Dateien; Formatieren stellt die Einrückung kompakten Codes wieder her.',
    technical: [
      { term: 'Minifizieren', detail: 'Kommentare entfernen und Leerraum außerhalb von Strings/url() kürzen' },
      { term: 'Formatieren', detail: 'Einrückung mit 2 Leerzeichen unter Erhalt von Strings und url()' },
      { term: 'Sicher', detail: 'Verändert keine Selektoren und kein calc()' },
      { term: 'Datenschutz', detail: 'Läuft lokal im Browser ohne Serverübertragung' },
    ],
    engine: {
      savedBytesTpl: '{saved} Bytes gespart ({before} → {after}).',
      errCss: 'CSS-Verarbeitung fehlgeschlagen.',
    },
  },
};
