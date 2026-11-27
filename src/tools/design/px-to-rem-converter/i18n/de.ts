import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'px-to-rem-converter',
  name: 'PX-zu-REM-Umrechner',
  seoTitle: 'PX in REM Umrechner Online – CSS EM & PT',
  description:
    'Rechne Pixel bei frei wählbarer Root-Schriftgröße im Browser in rem, em, pt und Prozent um – mit Ein-Klick-Kopieren und ohne Server-Upload.',
  tagline: 'px in rem, em und pt bezogen auf deine Root-Schriftgröße.',
  craft: {
    solves:
      'Die Umrechnung von em gegen die Root-Größe stimmt nur auf oberster Ebene; verschachtelte Elemente mit eigener Schriftgröße vervielfachen em-Abstände.',
  },
  knowledge: {
    primaryConcepts: ['CSS-Einheiten umrechnen'],
    realWorldUseCases: [
      'Design-Vorgaben aus Figma in skalierbares CSS mit rem übersetzen',
      'Punkt-Maße (pt) aus Print oder UI-Tools in Web-Pixel umwandeln',
      'Konsistente Abstands-Skalen in rem aus px-Werten ableiten',
      'Benutzerdefinierte Root-Größen wie 10 px (62,5 %) direkt ablesen',
    ],
    commonMistakes: [
      'Pauschal voraussetzen, dass 1rem immer 16px entspricht ohne html { font-size } zu prüfen',
      'em für globale Layout-Abstände nutzen und unerwünschte Verschachtelung auslösen',
    ],
  },
  faqs: [
    {
      id: 'px-to-rem-converter-faq-1',
      question: 'Wie rechne ich px in rem um?',
      answer:
        'Teile den Pixelwert durch die Root-Schriftgröße. Beim Standard von 16 px sind 24 px ÷ 16 = 1,5 rem. Bei abweichender Basis passe das Feld „Root-Größe“ oben an.',
    },
    {
      id: 'px-to-rem-converter-faq-2',
      question: 'Was ist der Unterschied zwischen rem und em?',
      answer:
        '`rem` bezieht sich immer auf das Wurzelelement (`html`) und bleibt überall konstant. `em` orientiert sich am eigenen bzw. Eltern-Element und multipliziert sich bei Verschachtelung.',
    },
    {
      id: 'px-to-rem-converter-faq-3',
      question: 'Warum sollte man rem statt fester px nutzen?',
      answer:
        'Weil Schriften und Abstände in `rem` sauber mitskalieren, wenn Nutzer in den Browsereinstellungen eine größere Standardschrift für bessere Lesbarkeit wählen.',
    },
    {
      id: 'px-to-rem-converter-faq-4',
      question: 'Welche Root-Schriftgröße sollte ich verwenden?',
      answer:
        'Lasse 16 px (Browser-Standard), sofern dein Stylesheet `html { font-size }` nicht umstellt. Bei der 62,5-%-Regel trägst du `10` als Basis ein.',
    },
    {
      id: 'px-to-rem-converter-faq-5',
      question: 'Wie hängen pt und px im Web zusammen?',
      answer:
        'In CSS entsprechen 1 Zoll exakt 96 px sowie 72 pt, somit gilt 1 px = 0,75 pt und 16 px = 12 pt.',
    },
  ],
  guide: {
    title: 'PX, REM, EM & PT: Wie CSS-Einheiten zusammenhängen',
    description:
      'Umrechnung gegen die Root-Schriftgröße, warum rem die Barrierefreiheit verbessert und wann em verschachtelt.',
    readMinutes: 5,
  },
  ui: {
    panelValue: 'Eingabewert',
    lblValue: 'Wert',
    ariaUnit: 'Eingabeeinheit',
    lblBase: 'Root-Schriftgröße (px)',
    rootNote: 'Browser-Standard ist 16 px (oder 10 px bei der 62,5-%-Basis).',
    panelConverted: 'Umgerechnete Einheiten',
    copyLabel: 'Kopieren',
    errInvalid: 'Bitte eine gültige endliche Zahl größer 0 eingeben.',
    engine: {
      emHintTpl: 'Wert bezogen auf {base} px Root-Ebene (kann sich in verschachtelten Elementen summieren).',
    },
  },
};
