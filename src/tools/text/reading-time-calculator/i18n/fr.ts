import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'reading-time-calculator',
  name: 'Calculateur de Temps de Lecture',
  seoTitle: 'Calculateur Temps de Lecture & Discours en Ligne',
  description:
    'Estimez en quelques secondes le temps de lecture silencieuse et le temps de parole de n’importe quel texte dans votre navigateur sans rien envoyer.',
  tagline: 'Durée estimée de lecture et de prise de parole en local.',
  craft: {
    solves:
      'Le temps de lecture repose sur une vitesse moyenne supposée en mots par minute ; afficher cette hypothèse aide chacun à situer son propre rythme.',
  },
  knowledge: {
    primaryConcepts: ['temps de lecture'],
    realWorldUseCases: [
      'Afficher une mention « X min de lecture » sur un article de blog',
      'Caler un discours ou script vidéo sur une durée précise',
      'Estimer le temps consacré à une newsletter ou leçon',
      'Décider s’il faut scinder un dossier trop long',
    ],
    commonMistakes: [
      'Appliquer la même cadence à un article très technique qu’à un récit léger',
      'Oublier le temps ajouté par les schémas, tableaux et blocs de code',
    ],
  },
  faqs: [
    {
      id: 'rtc-faq-1',
      question: 'Comment le temps de lecture est-il calculé ?',
      answer:
        'On divise le nombre total de mots par une vitesse moyenne adulte de 200 mots par minute (mpm). Un article de 1 000 mots demande donc environ 5 minutes.',
    },
    {
      id: 'rtc-faq-2',
      question: 'Quelle est la vitesse moyenne de lecture chez l’adulte ?',
      answer:
        'Un adulte lit couramment entre 200 et 250 mpm avec bonne compréhension, et plutôt 100 à 150 mpm sur des sujets très techniques. 200 mpm constitue une base prudente.',
    },
    {
      id: 'rtc-faq-3',
      question: 'Combien de temps faut-il pour lire 1 000 mots ?',
      answer:
        'À 200 mots par minute, comptez environ 5 minutes (4 minutes à 250 mpm), selon la densité du vocabulaire et des paragraphes.',
    },
    {
      id: 'rtc-faq-4',
      question: 'Qu’est-ce que le temps de parole et quelle différence ?',
      answer:
        'Il estime la durée de lecture à voix haute pour une présentation ou vidéo, autour de 130 à 150 mots par minute, nettement plus lente que la lecture silencieuse.',
    },
    {
      id: 'rtc-faq-5',
      question: 'Combien de mots faut-il pour viser une durée donnée ?',
      answer:
        'À 200 mpm : 2 min équivalent à ~400 mots, 5 min à ~1 000 mots, 10 min à ~2 000 mots et 15 min à ~3 000 mots.',
    },
    {
      id: 'rtc-faq-6',
      question: 'Pourquoi les calculateurs affichent-ils parfois des durées différentes ?',
      answer:
        'Certains retiennent 200 mpm, d’autres 238 mpm ou découpent différemment tirets et ponctuation. De légers écarts sont tout à fait normaux.',
    },
    {
      id: 'rtc-faq-7',
      question: 'Afficher le temps de lecture aide-t-il le SEO ?',
      answer:
        'Oui indirectement : cela informe le lecteur dès l’arrivée, réduit les retours précoces et améliore l’engagement sur la page.',
    },
    {
      id: 'rtc-faq-8',
      question: 'Ce calculateur envoie-t-il mon texte en ligne ?',
      answer:
        'Non. Tout s’exécute directement dans votre navigateur sans aucun transfert vers un serveur.',
    },
  ],
  guide: {
    title: 'Comment calculer le temps de lecture et de discours',
    description:
      'Méthode à 200 mots/min pour articles, écart avec la lecture à voix haute et impact de la technicité du texte.',
    readMinutes: 5,
  },
  ui: {
    emptyMessage: 'Saisissez ou collez votre texte ci-dessus pour estimer les durées.',
    sampleText:
      'Collez ici votre article de blog, script ou discours afin d’obtenir aussitôt l’estimation de lecture silencieuse et de temps de parole.',
    statReadingTime: 'Temps de lecture',
    statSpeakingTime: 'Temps de parole',
    statWords: 'Mots',
    statAvgSentence: 'Moy. par phrase',
  },
};
