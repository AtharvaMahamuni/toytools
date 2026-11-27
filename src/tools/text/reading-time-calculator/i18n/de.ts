import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'reading-time-calculator',
  name: 'Lesezeit-Rechner',
  seoTitle: 'Lesezeit-Rechner Online – Lese- & Sprechzeit',
  description:
    'Berechne sofort im Browser, wie viele Minuten das Lesen oder Vortragen eines Textes dauert. Kostenlos, ohne Upload und datensparsam.',
  tagline: 'Lese- und Sprechdauer für jeden Text direkt im Browser.',
  craft: {
    solves:
      'Lesezeiten beruhen auf einer angenommenen Wörter-pro-Minute-Rate; das Werkzeug legt diese Annahme für abweichende Lesetempi offen.',
  },
  knowledge: {
    primaryConcepts: ['Lesezeit'],
    realWorldUseCases: [
      'Einen Hinweis wie „5 Min. Lesezeit“ im Blogartikel angeben',
      'Ein Vortragsmanuskript exakt auf ein Zeitfenster abstimmen',
      'Bearbeitungsdauer von Newslettern oder Kursmodulen planen',
      'Abschätzen, ob ein langer Fachartikel aufgeteilt werden sollte',
    ],
    commonMistakes: [
      'Für komplexe Fachtexte dieselbe Lesegeschwindigkeit wie für Prosa ansetzen',
      'Vergessen, dass Grafiken, Tabellen und Codeblöcke zusätzliche Zeit kosten',
    ],
  },
  faqs: [
    {
      id: 'rtc-faq-1',
      question: 'Wie wird die Lesezeit berechnet?',
      answer:
        'Die Wortanzahl wird durch eine durchschnittliche stille Lesegeschwindigkeit von 200 Wörtern pro Minute (WpM) geteilt. Ein Text mit 1.000 Wörtern ergibt damit etwa 5 Minuten Lesezeit.',
    },
    {
      id: 'rtc-faq-2',
      question: 'Wie schnell lesen Erwachsene durchschnittlich?',
      answer:
        'Normale Sachtexte und Artikel werden im Schnitt mit 200 bis 250 Wörtern pro Minute verstanden. Bei technischer oder wissenschaftlicher Literatur sinkt das Tempo oft auf 100 bis 150 WpM.',
    },
    {
      id: 'rtc-faq-3',
      question: 'Wie lange dauert ein Artikel mit 1.000 Wörtern?',
      answer:
        'Bei 200 WpM etwa 5 Minuten, bei 250 WpM rund 4 Minuten – je nach Satzbau, Fachbegriffen und Lesefluss.',
    },
    {
      id: 'rtc-faq-4',
      question: 'Was ist die Sprechzeit und wie unterscheidet sie sich?',
      answer:
        'Die Sprechzeit schätzt das laute Vortragen einer Rede oder Moderation bei rund 130 bis 150 WpM und liegt damit deutlich über der stillen Lesezeit.',
    },
    {
      id: 'rtc-faq-5',
      question: 'Wie viele Wörter brauche ich für eine bestimmte Lesezeit?',
      answer:
        'Bei 200 WpM entsprechen 2 Minuten rund 400 Wörtern, 5 Minuten etwa 1.000, 10 Minuten circa 2.000 und 15 Minuten etwa 3.000 Wörtern.',
    },
    {
      id: 'rtc-faq-6',
      question: 'Warum zeigen verschiedene Lesezeit-Rechner unterschiedliche Werte?',
      answer:
        'Manche Rechner nutzen 200 WpM, andere 238 WpM oder zählen Wörter mit Bindestrich unterschiedlich. Kleine Abweichungen von 10–15 % sind völlig normal.',
    },
    {
      id: 'rtc-faq-7',
      question: 'Ist die Angabe der Lesezeit gut für SEO?',
      answer:
        'Sie setzt realistische Erwartungen beim Leser, senkt schnelle Absprünge und erhöht damit indirekt positive Nutzersignale, auch wenn sie kein direkter Rankingfaktor ist.',
    },
    {
      id: 'rtc-faq-8',
      question: 'Lädt dieser Lesezeit-Rechner meinen Text hoch?',
      answer:
        'Nein. Alle Berechnungen laufen lokal in deinem Browser; der eingegebene Text verlässt dein Gerät nicht.',
    },
  ],
  guide: {
    title: 'Lesezeit berechnen: Richtwerte für Texte',
    description:
      'Formel mit 200 Wörtern pro Minute, Unterschied zwischen leisem Lesen und Vortrag sowie Gründe für Abweichungen.',
    readMinutes: 5,
  },
  ui: {
    emptyMessage: 'Text oben einfügen oder tippen, um Lese- und Sprechzeit zu berechnen.',
    sampleText:
      'Füge hier deinen Blogartikel, Entwurf oder Vortragstext ein, um sofort eine verlässliche Schätzung der Lese- und Sprechdauer zu erhalten.',
    statReadingTime: 'Lesezeit',
    statSpeakingTime: 'Sprechzeit',
    statWords: 'Wörter',
    statAvgSentence: 'Ø Satzlänge',
  },
};
