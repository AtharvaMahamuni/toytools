import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'aspect-ratio-calculator',
  name: 'Seitenverhältnis-Rechner',
  seoTitle: 'Seitenverhältnis Rechner Online – 16:9 & Auflösung',
  description:
    'Seitenverhältnis wie 16:9 festlegen und fehlende Breite oder Höhe in Pixeln exakt berechnen. Bilder und Videos ohne Verzerrung skalieren.',
  tagline: 'Verhältnis wie 16:9 sperren und fehlende Breite oder Höhe exakt berechnen.',
  knowledge: {
    primaryConcepts: ['seitenverhältnis', 'format 16:9'],
    realWorldUseCases: [
      'Passende Videohöhe bei vorgegebener Breite bestimmen',
      'Bilder proportional verkleinern oder vergrößern ohne Verzerrung',
      'Das gekürzte Seitenverhältnis einer beliebigen Auflösung ermitteln',
      'Responsive Container und Embeds exakt im Zielformat dimensionieren',
    ],
    commonMistakes: [
      'Breite und Höhe unabhängig ändern und dadurch das Seitenverhältnis zerstören',
      'Absolute Pixelauflösung mit dem relativen Seitenverhältnis verwechseln',
    ],
  },
  faqs: [
    {
      id: 'aspect-ratio-calculator-faq-1',
      question: 'Wie berechne ich die Höhe für 16:9?',
      answer:
        'Multiplizieren Sie die Breite mit 9 und teilen Sie durch 16. Bei 1600 px Breite ergibt das 1600 × 9 ÷ 16 = 900 px. Wählen Sie oben die Vorgabe 16:9, geben Sie die Breite ein und der Rechner ergänzt Höhe und Live-Vorschau sofort.',
    },
    {
      id: 'aspect-ratio-calculator-faq-2',
      question: 'Wie behalte ich beim Skalieren das Seitenverhältnis bei?',
      answer:
        'Legen Sie zuerst das Verhältnis fest und ändern Sie danach nur noch eine Seite. Wenn Sie die Breite anpassen, wird die Höhe automatisch neu berechnet, und umgekehrt. So werden Bilder oder Videos weder gestreckt noch gestaucht.',
    },
    {
      id: 'aspect-ratio-calculator-faq-3',
      question: 'Welches Seitenverhältnis ist 1920x1080?',
      answer:
        '1920 × 1080 kürzt sich auf 16:9, das gängige Breitbildformat. Um das Verhältnis einer beliebigen Größe zu bestimmen, teilt man beide Werte durch ihren größten gemeinsamen Teiler. Hier wird es automatisch neben den Pixelmaßen angezeigt.',
    },
    {
      id: 'aspect-ratio-calculator-faq-4',
      question: 'Welches sind die häufigsten Seitenverhältnisse?',
      answer:
        '16:9 ist Standard für Video und Monitore, 4:3 für klassische Bildschirme, 3:2 für Fotokameras, 21:9 für Ultrawide-Displays und Kino, 1:1 für quadratische Social-Posts und 9:16 für Hochkant-Videos am Smartphone. Alle Formate sind als Vorlage wählbar.',
    },
    {
      id: 'aspect-ratio-calculator-faq-5',
      question: 'Kann ich auch Dezimalwerte verwenden?',
      answer:
        'Ja. Sowohl beim Verhältnis als auch bei Breite und Höhe lassen sich Kommawerte eingeben, um präzise Layoutmaße oder ungerade Formate abzudecken.',
    },
  ],
  guide: {
    title: 'Seitenverhältnis: 16:9, Skalierung & Formel',
    description:
      'Was ein Seitenverhältnis bedeutet, wie man Breite oder Höhe berechnet und Bilder sowie Videos verlustfrei ohne Verzerrung anpasst.',
    readMinutes: 5,
  },
  ui: {
    panelDims: 'Abmessungen',
    lblRatio: 'Seitenverhältnis',
    opt169: '16:9 (Breitbild)',
    opt43: '4:3 (Standard)',
    opt32: '3:2 (Foto)',
    opt219: '21:9 (Ultrawide)',
    opt11: '1:1 (Quadrat)',
    opt916: '9:16 (Hochkant)',
    optCustom: 'Benutzerdefiniert',
    ariaRatioW: 'Verhältnis Breite',
    ariaRatioH: 'Verhältnis Höhe',
    lblWidth: 'Breite (px)',
    lblHeight: 'Höhe (px)',
    btnCopyDims: 'Maße kopieren',
    errInvalidRatio: 'Gültiges Verhältnis wie 16:9 eingeben.',
    errNeedDim: 'Breite oder Höhe eingeben.',
    errInvalidVals: 'Gültige Werte eingeben.',
    evenHintText: 'Video-Encoder wie H.264 erfordern gerade ganze Pixelzahlen für Breite und Höhe.',
    btnUsePrefix: 'Übernehmen: ',
    toastEmptyCopy: 'Nichts zum Kopieren!',
    btnCopied: '✓ Kopiert',
  },
};
