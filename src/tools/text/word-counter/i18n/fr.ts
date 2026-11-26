import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'word-counter',
  name: 'Compteur de Mots',
  seoTitle: 'Compteur de Mots et Caractères en ligne',
  description:
    'Comptez mots, caractères, phrases, paragraphes et temps de lecture en direct. Fixez un objectif de rédaction sans rien envoyer en ligne.',
  tagline: 'Comptez vos mots en direct et suivez votre objectif de longueur.',
  citation: {
    problem: 'Utilisez ce compteur de mots pour mesurer la longueur d\'un texte ou d\'un prompt sans le téléverser.',
    nonGoal: 'réécrire votre texte ni le soumettre à un modèle d\'IA.',
  },
  knowledge: {
    primaryConcepts: ['compteur de mots'],
    realWorldUseCases: [
      'Respecter le plafond de mots d\'un mémoire, concours ou dossier',
      'Calibrer la longueur éditoriale d\'un article ou d\'une fiche',
      'Estimer un devis de traduction ou de rédaction facturé au mot',
      'Raccourcir une lettre de motivation à une page',
    ],
    commonMistakes: [
      'Supposer que tous les logiciels découpent les mots composés de la même façon',
      'Oublier si les notes de bas de page ou la bibliographie entrent dans la limite',
    ],
  },
  faqs: [
    {
      id: 'wc-faq-1',
      question: 'Comment fonctionne un compteur de mots ?',
      answer:
        'Un compteur découpe votre texte selon des séparateurs précis. Cet outil sépare sur les espaces, retours à la ligne, tirets longs et virgules hors nombres tout en gardant les adresses web entières, en temps réel.',
    },
    {
      id: 'wc-faq-2',
      question: 'Qu\'est-ce qui compte comme un mot ?',
      answer:
        'Toute suite de caractères encadrée par des séparateurs : les nombres (« 42 »), mots composés avec trait d\'union (« peut-être ») et URL comptent comme un mot, tandis que « rouge,vert » donne deux mots.',
    },
    {
      id: 'wc-faq-3',
      question: 'Quelle différence entre nombre de mots et nombre de caractères ?',
      answer:
        'Le décompte de mots compte les termes entiers ; celui des caractères inclut chaque lettre, ponctuation et espace. « Bonjour ! » compte 1 mot ou 2 éléments selon les règles, mais 9 caractères.',
    },
    {
      id: 'wc-faq-4',
      question: 'Mon texte est-il envoyé sur un serveur ?',
      answer:
        'Non. Tout le traitement s\'effectue localement dans votre navigateur.',
    },
    {
      id: 'wc-faq-5',
      question: 'Combien de temps faut-il pour lire 1000 mots ?',
      answer:
        'À une vitesse moyenne de 200 à 250 mots par minute, lire 1000 mots demande environ 4 à 5 minutes. Cet outil estime le temps de lecture sur une base de 200 mots/min.',
    },
    {
      id: 'wc-faq-6',
      question: 'Quelles sont les limites de caractères sur X et LinkedIn ?',
      answer:
        'X (Twitter) limite les messages standard à 280 caractères, tandis que LinkedIn autorise jusqu\'à 3 000 caractères par publication et 125 000 pour les articles.',
    },
    {
      id: 'wc-faq-7',
      question: 'Pourquoi deux compteurs donnent-ils parfois un écart de quelques mots ?',
      answer:
        'Les écarts proviennent des mots avec apostrophe ou trait d\'union, des tirets non espacés et des lignes de ponctuation isolée. Pour un examen, fiez-vous à l\'outil officiel de votre établissement.',
    },
    {
      id: 'wc-faq-8',
      question: 'Comment est calculé le temps de lecture ?',
      answer:
        'Il divise le nombre total de mots par une vitesse moyenne de lecture adulte de 200 mots par minute pour la prose courante.',
    },
    {
      id: 'wc-faq-9',
      question: 'L\'outil compte-t-il les titres et sous-titres ?',
      answer:
        'Oui, tout le texte saisi dans le champ est comptabilisé.',
    },
    {
      id: 'wc-faq-10',
      question: 'Puis-je vérifier des documents confidentiels sans risque ?',
      answer:
        'Oui. Aucune donnée textuelle ne quitte votre navigateur.',
    },
    {
      id: 'wc-faq-11',
      question: 'Ce compteur mesure-t-il les tokens d\'IA ?',
      answer:
        'Non. Il mesure uniquement les mots, caractères, phrases et paragraphes humains.',
    },
  ],
  guide: {
    title: 'Compter les mots et mesurer la longueur d’un texte',
    description: 'Règles de découpage des mots, différences entre logiciels, temps de lecture et limites éditoriales.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Collez ou saisissez votre texte pour compter les mots.',
    sampleText: 'Le rapide renard brun saute par-dessus le chien paresseux près de la vieille ferme. Une douce brise agitait les feuilles du grand chêne et portait le parfum des fleurs sauvages à travers la prairie.',
    statWords: 'Mots',
    statCharacters: 'Caractères',
    statSentences: 'Phrases',
    statParagraphs: 'Paragraphes',
    statReadingTime: 'Temps de lecture',
    statUniqueWords: 'Mots uniques',
    btnDownloadReport: 'Télécharger le rapport',
    lblGoal: 'Objectif de mots',
    goalPlaceholder: 'ex. 500',
    btnClearGoal: 'Effacer l\'objectif',
    headingTopWords: 'Mots les plus fréquents',
    lblHideCommon: 'Masquer les mots courants',
    btnSortFreq: 'Par fréquence',
    btnSortAlpha: 'Alphabétique',
    summaryInsights: 'Détails lexicaux',
    stopWords: 'le la les un une des du au aux et ou mais donc or ni car en dans sur sous par pour avec sans de d l qu que qui quoi dont où est sont a ont être avoir je tu il elle nous vous ils elles mon ton son ma ta sa mes tes ses ce cette ces',
    goalRemainTpl: '{cur} / {goal} mots (encore {rem}, {pct} %)',
    goalDoneTpl: '{cur} / {goal} mots : objectif atteint !',
    noWordsFound: 'Aucun mot trouvé.',
    insightLongest: 'Mot le plus long',
    insightShortest: 'Mot le plus court',
    insightRepeated: 'Mots répétés',
    toastEmptyDownload: 'Rien à télécharger',
    reportHeading: 'Rapport de comptage de mots',
    reportGoalPrefix: 'Objectif : ',
    reportWordsSuffix: 'mots',
    reportGeneratedPrefix: 'Généré le : ',
    toastDownloaded: 'Rapport téléchargé',
  },
};
