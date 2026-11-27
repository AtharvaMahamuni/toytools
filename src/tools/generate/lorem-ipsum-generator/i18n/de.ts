import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'lorem-ipsum-generator',
  name: 'Lorem-Ipsum-Generator',
  seoTitle: 'Lorem-Ipsum-Generator – Blindtext Online',
  description:
    'Erstelle Lorem-Ipsum-Blindtext nach Absätzen, Sätzen oder Wörtern direkt im Browser. Sauberer Klartext ohne HTML-Tags inklusive Wort- und Zeichenzählung.',
  tagline: 'Blindtext wahlweise nach Absätzen, Sätzen oder Wörtern.',
  craft: {
    solves:
      'Viele fragen sich, ob Blindtext eine versteckte Bedeutung hat; das Tool verortet den Klassiker eindeutig auf Ciceros Textquelle.',
  },
  knowledge: {
    primaryConcepts: ['Lorem ipsum', 'Blindtext'],
    realWorldUseCases: [
      'Layout-Entwürfe befüllen, bevor finale Texte vorliegen',
      'Umbruch und Textlängen in UI-Komponenten testen',
      'Themes und Redaktionsvorlagen realistisch demonstrieren',
      'Typografie, Zeilenabstand und Satzbreite beurteilen',
    ],
    commonMistakes: [
      'Blindtext versehentlich auf produktiven Websites veröffentlichen',
      'Lorem ipsum nutzen, obwohl echte Textlängen das Layout sprengen',
      'Annehmend, die lateinischen Wörter ergäben einen sinnvollen Text',
      'Viel mehr Text erzeugen, als die Layout-Fläche erfordert',
    ],
  },
  fields: {
    unit: {
      label: 'Einheit',
      options: { paragraphs: 'Absätze', sentences: 'Sätze', words: 'Wörter' },
    },
    count: { label: 'Anzahl' },
    startWithLorem: { label: 'Mit "Lorem ipsum" beginnen', group: 'Optionen' },
  },
  faqs: [
    {
      id: 'lorem-ipsum-generator-faq-1',
      question: 'Was ist Lorem ipsum?',
      answer:
        'Lorem ipsum ist klassischer Blindtext aus lateinisch anmutenden Wörtern, um Layouts und Schriften zu beurteilen, ohne dass inhaltliche Bedeutung vom Design ablenkt.',
    },
    {
      id: 'lorem-ipsum-generator-faq-2',
      question: 'Wie benutze ich diesen Generator?',
      answer:
        'Wähle Absätze, Sätze oder Wörter, lege die Anzahl fest und aktiviere bei Bedarf den klassischen Beginn mit "Lorem ipsum dolor sit amet". Danach genügt ein Klick auf Kopieren.',
    },
    {
      id: 'lorem-ipsum-generator-faq-3',
      question: 'Woher stammt Lorem ipsum ursprünglich?',
      answer:
        'Er geht auf eine abgewandelte Passage aus Ciceros philosophischem Werk *De finibus bonorum et malorum* von 45 v. Chr. zurück, die über Jahrhunderte im Schriftsatz genutzt wurde.',
    },
    {
      id: 'lorem-ipsum-generator-faq-4',
      question: 'Warum verwendet man überhaupt Blindtext?',
      answer:
        'Lesbarer Text zieht die Aufmerksamkeit auf Inhalt und Formulierung. Neutraler Blindtext lenkt den Blick gezielt auf Raster, Weißraum, Typografie und Spaltenbreite.',
    },
    {
      id: 'lorem-ipsum-generator-faq-5',
      question: 'Hat Lorem ipsum eine konkrete Bedeutung?',
      answer:
        'Nein, keinen zusammenhängenden Sinn. Die Wörter besitzen lateinische Wurzeln, wurden aber absichtlich zerstückelt und neu kombiniert.',
    },
    {
      id: 'lorem-ipsum-generator-faq-6',
      question: 'Kann ich auch gezielt Wörter statt ganzer Absätze generieren?',
      answer:
        'Ja. Stelle die Einheit einfach auf Wörter oder Sätze um, wenn du genau passende Längen für Überschriften oder Karten brauchst.',
    },
    {
      id: 'lorem-ipsum-generator-faq-7',
      question: 'Was bewirkt "Mit Lorem ipsum beginnen"?',
      answer:
        'Aktiviert startet der erste Absatz mit dem bekannten "Lorem ipsum dolor sit amet". Deaktiviert wird ab dem ersten Wort frei aus dem Wortpool gemischt.',
    },
    {
      id: 'lorem-ipsum-generator-faq-8',
      question: 'Funktioniert der Generator offline?',
      answer:
        'Ja. Nach dem Laden der Seite läuft alles in lokalem JavaScript im Browser – ganz ohne Serverkontakt.',
    },
    {
      id: 'lorem-ipsum-generator-faq-9',
      question: 'Wie viel Text lässt sich auf einmal erzeugen?',
      answer:
        'Bis zu 100 Einheiten pro Klick – also bis zu 100 Absätze, Sätze oder Wörter für nahezu jedes Mockup.',
    },
    {
      id: 'lorem-ipsum-generator-faq-10',
      question: 'Ist die Ausgabe reiner Klartext?',
      answer:
        'Ja. Keine HTML-Tags oder Formatierungen, Absätze werden durch Leerzeilen getrennt und lassen sich sauber überall einfügen.',
    },
    {
      id: 'lorem-ipsum-generator-faq-11',
      question: 'Kann ich den Text mit einem Klick kopieren?',
      answer:
        'Ja. Ein Klick auf Kopieren übernimmt den gesamten generierten Block vollständig in die Zwischenablage.',
    },
    {
      id: 'lorem-ipsum-generator-faq-12',
      question: 'Sieht der Text jedes Mal gleich aus?',
      answer:
        'Nein. Satzlängen und Wörter variieren bei jeder neuen Generierung zufällig, lediglich die optionale Startphrase bleibt gleich.',
    },
    {
      id: 'lorem-ipsum-generator-faq-13',
      question: 'Wann sollte man auf Lorem ipsum verzichten?',
      answer:
        'Wenn konkrete Textlängen oder Überschriften maßgeblich die Layout-Entscheidung beeinflussen – und natürlich vor jedem Produktiv-Go-Live.',
    },
    {
      id: 'lorem-ipsum-generator-faq-14',
      question: 'Was ist der Vorteil gegenüber deutschen Zufallswörtern?',
      answer:
        'Bekannte Wörter lassen sich beim Hinsehen unwillkürlich mitlesen. Lateinischer Pseudo-Fließtext hält das gewohnte Schriftbild ohne Ablenkung.',
    },
    {
      id: 'lorem-ipsum-generator-faq-15',
      question: 'Darf ich Lorem ipsum kommerziell nutzen?',
      answer:
        'Ja. Blindtext ist gemeinfrei und darf in Kundenprojekten, Templates und Demos frei verwendet werden.',
    },
    {
      id: 'lorem-ipsum-generator-faq-16',
      question: 'Warum wird Blindtext im Design manchmal kritisiert?',
      answer:
        'Weil zu gleichmäßiger Fülltext Designfehler bei extrem kurzen oder langen echten Texten verdecken kann.',
    },
    {
      id: 'lorem-ipsum-generator-faq-17',
      question: 'Kann ich genau einen Absatz generieren?',
      answer:
        'Ja. Einheit auf Absätze und Anzahl auf 1 setzen ergibt genau einen sauberen Absatz.',
    },
    {
      id: 'lorem-ipsum-generator-faq-18',
      question: 'Speichert die Seite meine Einstellungen?',
      answer:
        'Nur deine gewählten Schalter (Einheit, Anzahl) bleiben lokal im Browser erhalten, niemals der erzeugte Text.',
    },
    {
      id: 'lorem-ipsum-generator-faq-19',
      question: 'In welchen Browsern läuft das Tool?',
      answer:
        'In allen aktuellen Desktop- und Mobilbrowsern dank Standard-JavaScript ohne Abhängigkeiten.',
    },
    {
      id: 'lorem-ipsum-generator-faq-20',
      question: 'Kann ich eine exakte Zeichenzahl vorgeben?',
      answer:
        'Nicht direkt als Vorgabe, aber Wort- und Zeichenzahl werden sofort eingeblendet, sodass du die Länge schnell anpassen kannst.',
    },
    {
      id: 'lorem-ipsum-generator-faq-21',
      question: 'Eignet sich Lorem ipsum für Schrifttests?',
      answer:
        'Ja, hervorragend: Die gleichmäßige Verteilung von Wortlängen macht Laufweite, Zeilenhöhe und Kontrast optimal sichtbar.',
    },
    {
      id: 'lorem-ipsum-generator-faq-22',
      question: 'Werden Daten hochgeladen oder geteilt?',
      answer:
        'Nein. Alles geschieht ausschließlich in deinem Browser.',
    },
  ],
  guide: {
    title: 'Was ist Lorem ipsum? Herkunft und Praxis-Tipps',
    description:
      'Warum Blindtext aus Ciceros Werk stammt, weshalb er bei Typografie-Tests hilft und wann echte Inhalte nötig sind.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Einheit und Anzahl wählen.',
    engine: {
      metaWords: 'Wörter',
      metaChars: 'Zeichen',
    },
  },
};
