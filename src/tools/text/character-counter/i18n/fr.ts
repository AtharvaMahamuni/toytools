import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'character-counter',
  name: 'Compteur de Caractères',
  seoTitle: 'Compteur de Caractères en Ligne (Avec/Sans Espaces)',
  description:
    'Comptez les caractères avec et sans espaces en direct et vérifiez les limites des méta-descriptions, SMS et réseaux sociaux sans envoyer vos textes.',
  tagline: 'Comptez les caractères, avec et sans espaces.',
  citation: {
    problem: 'Utilisez ce compteur pour vérifier la longueur exacte d’un texte ou prompt sans le téléverser.',
    nonGoal: 'compter les jetons (tokens) d’un modèle ou envoyer le texte vers une IA.',
  },
  craft: {
    solves:
      'Les champs limités comptent les espaces et retours à la ligne souvent oubliés, faisant échouer un texte pourtant jugé assez court.',
  },
  knowledge: {
    primaryConcepts: ['compteur de caractères'],
    realWorldUseCases: [
      'Adapter un message à la limite de 280 caractères sur X',
      'Maintenir titres et méta-descriptions dans la limite d’affichage Google',
      'Respecter les 160 caractères d’un segment SMS standard',
      'Contrôler la longueur maximale d’un champ de formulaire ou base',
    ],
    commonMistakes: [
      'Mesurer sans espaces alors que la plateforme les comptabilise',
      'Supposer qu’un emoji compte toujours pour un seul caractère',
    ],
  },
  faqs: [
    {
      id: 'cc-faq-1',
      question: 'Comment compter les caractères d’un texte ?',
      answer:
        'Collez ou tapez votre texte et les compteurs se mettent à jour instantanément : avec espaces, sans espaces, mots, phrases et répartition par catégorie.',
    },
    {
      id: 'cc-faq-2',
      question: 'Les espaces comptent-ils comme des caractères ?',
      answer:
        'Oui. Chaque espace est un caractère inclus dans le total avec espaces, utilisé par X/Twitter, LinkedIn, Instagram et les balises SEO.',
    },
    {
      id: 'cc-faq-3',
      question: 'Un emoji compte-t-il pour un caractère ?',
      answer:
        'Souvent pour 1 ou 2 caractères : X/Twitter compte la plupart des emojis simples pour 2 caractères (encodage UTF-16) et davantage pour les emojis combinés.',
    },
    {
      id: 'cc-faq-4',
      question: 'Mon texte est-il envoyé sur un serveur ?',
      answer:
        'Non. Tout le calcul s’exécute localement dans votre navigateur en JavaScript sans envoi ni compte requis.',
    },
    {
      id: 'cc-faq-5',
      question: 'Quelle différence entre caractères avec et sans espaces ?',
      answer:
        'Avec espaces inclut tous les blancs (espaces, tabulations, sauts de ligne) ; sans espaces exclut tous ces séparateurs.',
    },
    {
      id: 'cc-faq-6',
      question: 'Quelles sont les limites des principales plateformes ?',
      answer:
        'X/Twitter autorise 280 caractères, les méta-descriptions ~160, un SMS GSM-7 160 (70 en Unicode), Instagram 2 200 et LinkedIn 3 000.',
    },
    {
      id: 'cc-faq-7',
      question: 'Quelle différence entre nombre de caractères et octets ?',
      answer:
        'Le compteur mesure les caractères affichés, alors qu’en UTF-8 les caractères accentués ou emojis consomment de 2 à 4 octets en base ou API.',
    },
    {
      id: 'cc-faq-8',
      question: 'Comment faire tenir mon texte en 280 caractères ?',
      answer:
        'Activez le préréglage X/Twitter et raccourcissez les tournures longues jusqu’à passer sous 280, espaces et liens compris.',
    },
    {
      id: 'cc-faq-9',
      question: 'Les sauts de ligne comptent-ils comme des caractères ?',
      answer:
        'Oui, chaque retour à la ligne ajoute 1 au total avec espaces et n’est pas compté dans le total sans espaces.',
    },
    {
      id: 'cc-faq-10',
      question: 'Puis-je vérifier des prompts confidentiels en toute confidentialité ?',
      answer:
        'Oui. L’analyse reste exclusivement en mémoire locale sans appel réseau ni IA externe.',
    },
    {
      id: 'cc-faq-11',
      question: 'Le nombre de caractères équivaut-il aux tokens d’IA ?',
      answer:
        'Non. Cette page compte uniquement les caractères et n’estime pas les tokens de modèles de langage.',
    },
  ],
  guide: {
    title: 'Compter les caractères et chaque limite Web',
    description:
      'Avec vs sans espaces, poids des emojis UTF-16, retours à la ligne et différences avec la taille en octets.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Tapez ou collez un texte ci-dessus pour compter.',
    sampleText:
      'Saisissez ou collez votre brouillon ici pour vérifier en direct les limites de 160 caractères (méta-description ou SMS) et 280 caractères.',
    statCharacters: 'Caractères (avec espaces)',
    statNoSpaces: 'Sans espaces',
    statWords: 'Mots',
    statSentences: 'Phrases',
    statParagraphs: 'Paragraphes',
    statAvgWordLength: 'Long. moy. des mots',
    btnDownloadReport: 'Télécharger le rapport',
    headingLimits: 'Limites des plateformes',
    ariaPresets: 'Préréglages de limites de caractères',
    presetMetaDesc: 'Méta-description (160)',
    headingBreakdown: 'Répartition des caractères',
    limitRemainingTpl: '{chars} / {limit} caractères, {remaining} restants ({pct}%)',
    limitOverTpl: '{chars} / {limit} caractères, {over} en trop',
    lblLetters: 'Lettres',
    lblDigits: 'Chiffres',
    lblSpaces: 'Espaces',
    lblPunctuation: 'Ponctuation',
    lblOther: 'Autres',
    nothingToDownload: 'Aucun texte à exporter.',
    reportTitle: 'Rapport du Compteur de Caractères',
    reportActiveLimit: 'Limite active :',
    reportRemaining: 'Caractères restants :',
    reportGenerated: 'Généré avec ToyTools',
    reportDownloaded: 'Rapport téléchargé',
  },
};
