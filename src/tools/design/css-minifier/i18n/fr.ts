import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'css-minifier',
  name: 'Minificateur et Formateur CSS',
  seoTitle: 'Minificateur & Formateur CSS en Ligne Gratuit',
  description:
    'Minifiez vos feuilles CSS pour la production ou reformatez du CSS compact avec indentation claire dans votre navigateur, avec gain exact en octets.',
  tagline: 'Compressez du CSS pour la production ou rendez lisible du CSS minifié.',
  citation: {
    problem: 'Utilisez ce Minificateur CSS pour alléger une feuille de style ou décompacter un fichier minifié sans envoi serveur.',
    nonGoal: 'ajouter des préfixes vendeurs, transpiler ou fusionner des règles en double.',
  },
  knowledge: {
    primaryConcepts: ['minification CSS', 'formateur CSS'],
    realWorldUseCases: [
      'Réduire une feuille de style manuscrite avant intégration',
      'Déplier un CSS tiers minifié pour déboguer une règle visuelle',
      'Mesurer combien d’octets coûtent commentaires et espaces',
    ],
    commonMistakes: [
      'Attendre d’un simple analyseur lexical qu’il supprime les règles inutilisées',
      'Écraser l’unique copie lisible d’une feuille CSS encore modifiée à la main',
    ],
  },
  faqs: [
    {
      id: 'css-min-1',
      question: 'Que retire la minification CSS ?',
      answer:
        'Les commentaires et espaces superflus hors chaînes entre guillemets et valeurs `url()`. Les sélecteurs, propriétés personnalisées et calculs `calc()` restent intacts.',
    },
    {
      id: 'css-min-2',
      question: 'Que ne peut-on pas supprimer sans risque ?',
      answer:
        'Les règles inutilisées, doublons ou conversions de couleurs. Cela demande d’analyser tout votre HTML dans un outil de build.',
    },
    {
      id: 'css-min-3',
      question: 'Que fait le mode Embellir (Beautify) ?',
      answer:
        'Il déploie du CSS minifié avec une indentation à deux espaces et des retours à la ligne après chaque point-virgule et accolade.',
    },
    {
      id: 'css-min-4',
      question: 'Mon CSS est-il envoyé vers un serveur ?',
      answer:
        'Non. Tout s’exécute localement dans votre navigateur sans quitter l’onglet.',
    },
    {
      id: 'css-min-5',
      question: 'Minifier modifie-t-il l’apparence de ma page ?',
      answer:
        'Pas pour des feuilles CSS standard, car les blancs entre jetons sont sans effet sur le rendu.',
    },
    {
      id: 'css-min-6',
      question: 'Gère-t-il @media et les blocs imbriqués ?',
      answer:
        'Oui au niveau des jetons : accolades ouvrantes et fermantes restent correctement appariées.',
    },
    {
      id: 'css-min-7',
      question: 'Pourquoi afficher les octets économisés ?',
      answer:
        'Pour voir concrètement si le gain vaut le coup : un gros fichier commenté perd plusieurs kilo-octets alors qu’un petit bout gagne à peine après gzip.',
    },
    {
      id: 'css-min-8',
      question: 'Quand éviter de minifier ?',
      answer:
        'Pendant l’édition manuelle ou lorsque votre outil de build minifie déjà au déploiement.',
    },
  ],
  guide: {
    title: 'Minificateur CSS : alléger ou reformater vos styles',
    description: 'Fonctionnement de la minification et mise en forme CSS locale, ce qui est préservé et bonnes pratiques.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrée CSS',
    placeholder: 'Collez votre CSS ici',
    emptyOutput: 'Collez du CSS à gauche pour l’embellir ou le minifier.',
    validLabel: 'CSS traité',
    invalidLabel: 'Erreur CSS',
    loadError: 'Impossible de charger le processeur CSS.',
    modeBeautify: 'Embellir',
    modeMinify: 'Minifier',
    modeAriaLabel: 'Mode',
    toolNote: 'Le mode Minifier indique le nombre exact d’octets supprimés.',
    insight:
      'La minification retire commentaires et espaces inutiles pour réduire la taille ; l’embellissement restaure une indentation claire.',
    technical: [
      { term: 'Minifier', detail: 'Retire commentaires et espaces hors chaînes et url()' },
      { term: 'Embellir', detail: 'Indente à 2 espaces en préservant chaînes et url()' },
      { term: 'Sûr', detail: 'Ne réécrit pas les sélecteurs ni calc()' },
      { term: 'Confidentialité', detail: 'Exécution 100 % navigateur sans envoi' },
    ],
    engine: {
      savedBytesTpl: '{saved} octets économisés ({before} → {after}).',
      errCss: 'Échec du traitement CSS.',
    },
  },
};
