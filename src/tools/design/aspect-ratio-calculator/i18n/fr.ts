import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'aspect-ratio-calculator',
  name: 'Calculateur de Ratio d’Aspect',
  seoTitle: 'Calculateur de Ratio d’Aspect en Ligne – Format 16:9',
  description:
    'Verrouillez un ratio comme 16:9 et calculez instantanément la largeur ou la hauteur manquante en pixels. Redimensionnez sans déformation.',
  tagline: 'Verrouillez un ratio comme 16:9 et trouvez la largeur ou hauteur exacte.',
  knowledge: {
    primaryConcepts: ['ratio d’aspect', 'format 16:9'],
    realWorldUseCases: [
      'Trouver la hauteur exacte d’une vidéo à partir d’une largeur donnée',
      'Redimensionner une image sans l’étirer ni la rogner',
      'Identifier le ratio simplifié d’une résolution d’écran',
      'Dimensionner un bloc vidéo ou média responsive au bon format',
    ],
    commonMistakes: [
      'Modifier librement largeur et hauteur séparément et casser la proportion voulue',
      'Confondre la définition en pixels absolus avec le ratio d’aspect',
    ],
  },
  faqs: [
    {
      id: 'aspect-ratio-calculator-faq-1',
      question: 'Comment calculer une hauteur pour le format 16:9 ?',
      answer:
        'Multipliez la largeur par 9 puis divisez par 16. Pour 1600 px de large, cela donne 1600 × 9 ÷ 16 = 900 px. Sélectionnez le préréglage 16:9, entrez la largeur et la hauteur ainsi que l’aperçu se mettent à jour automatiquement.',
    },
    {
      id: 'aspect-ratio-calculator-faq-2',
      question: 'Comment conserver le ratio lors d’un redimensionnement ?',
      answer:
        'Fixez d’abord le ratio, puis ne modifiez qu’une seule dimension. En changeant la largeur, le calculateur recalcule la hauteur pour préserver les proportions, et inversement. Vos images et vidéos ne sont ni écrasées ni étirées.',
    },
    {
      id: 'aspect-ratio-calculator-faq-3',
      question: 'Quel est le ratio d’aspect de 1920x1080 ?',
      answer:
        '1920 par 1080 se simplifie en 16:9, le format large standard. On divise les deux dimensions par leur plus grand diviseur commun. Saisissez n’importe quelles dimensions ici pour voir immédiatement le ratio réduit.',
    },
    {
      id: 'aspect-ratio-calculator-faq-4',
      question: 'Quels sont les ratios d’aspect les plus courants ?',
      answer:
        '16:9 est la norme vidéo et écran, 4:3 sert aux anciens affichages, 3:2 aux appareils photo, 21:9 au cinéma et écrans ultra-larges, 1:1 aux publications carrées et 9:16 aux vidéos verticales sur mobile. Tous sont inclus en préréglage.',
    },
    {
      id: 'aspect-ratio-calculator-faq-5',
      question: 'Puis-je utiliser des dimensions décimales ?',
      answer:
        'Oui. L’outil accepte les nombres décimaux pour le ratio comme pour la largeur ou la hauteur, avec un arrondi lisible à quatre décimales pour les mises en page précises.',
    },
  ],
  guide: {
    title: 'Ratio d’aspect : 16:9, format et calcul',
    description:
      'Comprendre le ratio d’aspect, calculer une largeur ou hauteur manquante et redimensionner images ou vidéos sans déformation.',
    readMinutes: 5,
  },
  ui: {
    panelDims: 'Dimensions',
    lblRatio: 'Ratio d’aspect',
    opt169: '16:9 (écran large)',
    opt43: '4:3 (standard)',
    opt32: '3:2 (photo)',
    opt219: '21:9 (ultra-large)',
    opt11: '1:1 (carré)',
    opt916: '9:16 (vertical)',
    optCustom: 'Personnalisé',
    ariaRatioW: 'Largeur du ratio',
    ariaRatioH: 'Hauteur du ratio',
    lblWidth: 'Largeur (px)',
    lblHeight: 'Hauteur (px)',
    btnCopyDims: 'Copier les dimensions',
    errInvalidRatio: 'Entrez un ratio valide comme 16:9.',
    errNeedDim: 'Entrez une largeur ou une hauteur.',
    errInvalidVals: 'Entrez des valeurs valides.',
    evenHintText: 'Les encodeurs vidéo H.264 exigent une largeur et une hauteur entières paires.',
    btnUsePrefix: 'Utiliser ',
    toastEmptyCopy: 'Rien à copier !',
    btnCopied: '✓ Copié',
  },
};
