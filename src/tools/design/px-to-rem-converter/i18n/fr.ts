import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'px-to-rem-converter',
  name: 'Convertisseur PX vers REM',
  seoTitle: 'Convertisseur PX en REM, EM et PT CSS en Ligne',
  description:
    'Convertissez pixels en rem, em, pt et pourcentage selon une taille de police racine configurable dans votre navigateur avec copie en un clic.',
  tagline: 'px vers rem, em et pt selon votre taille racine.',
  craft: {
    solves:
      'Convertir `em` par rapport à la taille racine n’est vrai qu’au niveau supérieur ; dans des composants imbriqués, les facteurs `em` se multiplient.',
  },
  knowledge: {
    primaryConcepts: ['conversion d’unités CSS'],
    realWorldUseCases: [
      'Traduire une maquette en pixels vers du CSS évolutif en rem',
      'Convertir des points typographiques (pt) vers des pixels Web',
      'Construire une échelle d’espacement rem depuis des valeurs px',
      'Vérifier les valeurs rem avec une base personnalisée (ex. 10 px)',
    ],
    commonMistakes: [
      'Supposer que 1rem vaut toujours 16px sans vérifier html { font-size }',
      'Utiliser em pour les marges globales et subir des multiplications imbriquées',
    ],
  },
  faqs: [
    {
      id: 'px-to-rem-converter-faq-1',
      question: 'Comment convertir des px en rem ?',
      answer:
        'Divisez la valeur en pixels par la taille racine. Avec 16 px par défaut, 24 px ÷ 16 = 1,5 rem. Adaptez le champ racine si votre CSS définit une autre base.',
    },
    {
      id: 'px-to-rem-converter-faq-2',
      question: 'Quelle différence entre rem et em ?',
      answer:
        '`rem` se réfère toujours à la racine (`html`) et reste prévisible partout ; `em` dépend de la taille de l’élément courant et s’accumule par imbrication.',
    },
    {
      id: 'px-to-rem-converter-faq-3',
      question: 'Pourquoi utiliser rem plutôt que px ?',
      answer:
        'Les tailles et marges en `rem` suivent automatiquement le réglage de taille de texte choisi par l’utilisateur dans son navigateur pour le confort de lecture.',
    },
    {
      id: 'px-to-rem-converter-faq-4',
      question: 'Quelle taille de police racine choisir ?',
      answer:
        'Conservez 16 px (réglage standard) à moins que votre CSS modifie `html { font-size }`. Avec la règle `62,5 %` (10 px), saisissez `10`.',
    },
    {
      id: 'px-to-rem-converter-faq-5',
      question: 'Quel est le rapport entre pt et px ?',
      answer:
        'En CSS, 1 pouce vaut 96 px et 72 pt, donc 1 px = 0,75 pt et 16 px = 12 pt.',
    },
  ],
  guide: {
    title: 'PX, REM, EM et PT : comprendre et convertir en CSS',
    description:
      'Relations entre px, rem, em et pt, impact de la taille racine html et bonnes pratiques d’accessibilité CSS.',
    readMinutes: 5,
  },
  ui: {
    panelValue: 'Valeur à convertir',
    lblValue: 'Valeur',
    ariaUnit: 'Unité source',
    lblBase: 'Taille racine (px)',
    rootNote: 'La valeur navigateur par défaut est 16 px (ou 10 px pour 62,5 %).',
    panelConverted: 'Unités converties',
    copyLabel: 'Copier',
    errInvalid: 'Saisissez un nombre positif fini valide.',
    engine: {
      emHintTpl: 'Équivalent sur une base de {base} px à la racine (peut se multiplier en cascade).',
    },
  },
};
