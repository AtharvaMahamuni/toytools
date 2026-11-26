import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'percentage-calculator',
  name: 'Calculatrice de Pourcentage',
  seoTitle: 'Calculatrice de Pourcentage en Ligne Gratuite',
  description:
    'Combien font 15% de 80 ? 12. Calculez un pourcentage, une variation en pourcentage et la proportion X sur Y directement sur votre appareil.',
  tagline: 'Calculez le pourcentage d’un nombre ou l’écart entre deux valeurs localement.',
  knowledge: {
    primaryConcepts: ['pourcentage', 'variation en pourcentage', 'points de pourcentage'],
    realWorldUseCases: [
      'Calculer une remise, une réduction commerciale ou une marge',
      'Mesurer la hausse ou la baisse d’une valeur en pourcentage',
      'Calculer un pourboire ou le montant de la TVA sur une facture',
      'Convertir une note ou un ratio en pourcentage sur 100',
    ],
    commonMistakes: [
      'Confondre variation en pourcentage et points de pourcentage entre deux taux',
      'Inverser la partie et le tout lorsqu’on cherche quel pourcentage représente X de Y',
    ],
  },
  faqs: [
    {
      id: 'pct-faq-1',
      question: 'Qu’est-ce qu’un pourcentage ?',
      answer:
        'Un pourcentage est un nombre exprimé comme une fraction sur 100. Le mot vient du latin « per centum », qui signifie « pour cent ». Dire 25% revient à prendre 25 parts sur 100, soit un quart du total. Les pourcentages permettent de comparer des grandeurs différentes sur une échelle commune.',
    },
    {
      id: 'pct-faq-2',
      question: 'Comment calculer le pourcentage d’un nombre ?',
      answer:
        'Multipliez le nombre par le pourcentage puis divisez par 100. Par exemple, 20% de 150 = (20 × 150) ÷ 100 = 30. Astuce mentale rapide : décalez la virgule d’un rang vers la gauche pour obtenir 10% (150 → 15), puis doublez pour avoir 20% (15 × 2 = 30).',
    },
    {
      id: 'pct-faq-3',
      question: 'Comment calculer quel pourcentage représente un nombre par rapport à un autre ?',
      answer:
        'Divisez la partie par le total puis multipliez par 100. Par exemple, pour savoir quel pourcentage représente 45 sur 200 : (45 ÷ 200) × 100 = 22,5%. C’est idéal pour les notes d’examen, les sondages ou le suivi d’un budget.',
    },
    {
      id: 'pct-faq-4',
      question: 'Quelle est la différence entre pourcentage et points de pourcentage ?',
      answer:
        'Un point de pourcentage désigne l’écart arithmétique direct entre deux pourcentages. Si un taux passe de 3% à 5%, il augmente de 2 points de pourcentage, ce qui représente aussi une hausse relative de 66,7% du taux initial. Les points mesurent un écart absolu ; la variation en pourcentage mesure un changement relatif.',
    },
    {
      id: 'pct-faq-5',
      question: 'Comment calculer une augmentation ou une diminution en pourcentage ?',
      answer:
        'Soustrayez la valeur initiale de la valeur finale, divisez par la valeur absolue de la valeur initiale et multipliez par 100 : ((Nouvelle − Ancienne) ÷ |Ancienne|) × 100. Si un prix passe de 80 € à 100 € : ((100 − 80) ÷ 80) × 100 = +25%. Un résultat négatif indique une baisse. Si la valeur initiale est négative, ignorez son signe au dénominateur pour garder le bon sens d’évolution.',
    },
    {
      id: 'pct-faq-6',
      question: 'Comment calculer une remise ou une réduction ?',
      answer:
        'Multipliez le prix d’origine par le pourcentage de remise et divisez par 100 pour trouver la réduction, puis soustrayez-la du prix initial. Pour 30% de remise sur 120 € : réduction = (30 × 120) ÷ 100 = 36 € ; prix final = 120 € − 36 € = 84 €. Vous pouvez aussi multiplier directement par (1 − 0,30) = 0,70.',
    },
    {
      id: 'pct-faq-7',
      question: 'Pourquoi moins 50% suivi de plus 50% ne redonne-t-il pas le prix d’origine ?',
      answer:
        'Parce que chaque pourcentage s’applique à une base différente. Un article à 100 € soldé à 50% coûte 50 €. Ajouter 50% à ces 50 € donne 75 €, et non 100 €. La deuxième opération part du montant réduit, ce qui rend les variations en pourcentage asymétriques.',
    },
    {
      id: 'pct-faq-8',
      question: 'Comment calculer la TVA ou une taxe en pourcentage ?',
      answer:
        'Multipliez le prix hors taxe par le taux de TVA et divisez par 100. Pour une TVA à 20% sur 60 € : taxe = (20 × 60) ÷ 100 = 12 € ; prix TTC = 72 €. Pour retrouver le montant HT à partir du TTC, divisez par (1 + taux / 100), soit 72 € ÷ 1,20 = 60 €.',
    },
  ],
  guide: {
    title: 'Comment calculer un pourcentage : 3 formules clés',
    description:
      'Les trois formules de pourcentage avec exemples résolus : X% de Y, X en pourcentage de Y et variation en pourcentage, plus points de pourcentage.',
    readMinutes: 6,
  },
  ui: {
    panelValues: 'Valeurs',
    lblMode: 'Calcul',
    optOf: 'Combien font A% de B ?',
    optChange: 'Variation en % de A à B',
    optIs: 'Quel pourcentage est A de B ?',
    lblA: 'A',
    phA: 'Exemple : 20',
    lblB: 'B',
    phB: 'Exemple : 150',
    emptyHint: 'Saisissez les valeurs pour calculer.',
    errInvalid: 'Entrez des nombres valides.',
    errFirstZero: 'La première valeur ne peut pas être zéro.',
    errSecondZero: 'La seconde valeur ne peut pas être zéro.',
    fmlOf: '{a}% de {b}',
    dirIncrease: 'Hausse',
    dirDecrease: 'Baisse',
    dirNone: 'Aucun changement',
    fmlChange: '{dir} de {a} à {b}',
    fmlIs: '{a} représente ce % de {b}',
    toastEmptyCopy: 'Rien à copier !',
    btnCopied: '✓ Copié',
    btnCopy: 'Copier',
    btnClear: 'Effacer',
    btnConfirmClear: 'Confirmer',
  },
};
