import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'discount-calculator',
  name: 'Calculateur de Remise',
  seoTitle: 'Calculateur de Remise et Prix Soldé en Ligne',
  description:
    'Calculez le prix final et l’économie réalisée après un pourcentage de réduction ou un montant fixe directement dans votre navigateur sans envoi.',
  tagline: 'Prix final et économie en pourcentage ou montant fixe.',
  craft: {
    solves:
      'Les affiches « -30 % plus -20 % en caisse » font croire à -50 %, alors que les deux remises en cascade donnent en réalité -44 %.',
  },
  knowledge: {
    primaryConcepts: ['calcul de remise', 'prix soldé'],
    realWorldUseCases: [
      'Calculer le prix soldé d’un article en promotion',
      'Comparer un bon en pourcentage face à un bon en euros fixes',
      'Vérifier l’économie réelle lors des soldes saisonnières',
      'Anticiper le montant total avant passage en caisse',
    ],
    commonMistakes: [
      'Additionner deux remises successives au lieu de les appliquer en cascade',
      'Appliquer une remise sur un mauvais prix de base TTC/HT',
    ],
  },
  faqs: [
    {
      id: 'disc-faq-1',
      question: 'Comment calculer un pourcentage de remise ?',
      answer:
        'Multipliez le prix d’origine par le taux et divisez par 100 pour trouver l’économie, puis soustrayez-la du prix initial. À -25 % sur 80 : économie = 20, prix soldé = 60.',
    },
    {
      id: 'disc-faq-2',
      question: 'Quelle différence entre remise en pourcentage et montant fixe ?',
      answer:
        'Le pourcentage s’adapte au montant (-20 % retire 10 sur 50, mais 40 sur 200), alors qu’un bon fixe retire exactement la même somme quel que soit le prix.',
    },
    {
      id: 'disc-faq-3',
      question: 'Combien vais-je économiser ?',
      answer:
        'Saisissez le prix initial puis le taux ou montant de remise : l’économie et le prix net s’affichent aussitôt.',
    },
    {
      id: 'disc-faq-4',
      question: 'Comment fonctionnent les remises cumulées ?',
      answer:
        'Elles s’appliquent successivement : -20 % puis -10 % sur 100 donnent d’abord 80 puis 72, soit 28 % d’économie réelle au total (et non 30 %).',
    },
    {
      id: 'disc-faq-5',
      question: 'La remise s’applique-t-elle avant ou après taxes ?',
      answer:
        'En commerce courant, la réduction s’applique sur le prix affiché avant taxes ou proportionnellement, réduisant ainsi l’assiette taxable.',
    },
    {
      id: 'disc-faq-6',
      question: 'Comment retrouver le prix d’origine depuis un prix soldé ?',
      answer:
        'Divisez le prix payé par (1 − taux). Pour 60 après -25 % : 60 ÷ 0,75 = 80.',
    },
    {
      id: 'disc-faq-7',
      question: 'Que vaut « le 2e à -50 % » sur l’ensemble du panier ?',
      answer:
        'Sur deux articles de même prix, vous payez 150 % au lieu de 200 %, ce qui revient exactement à 25 % de réduction globale.',
    },
    {
      id: 'disc-faq-8',
      question: 'Remise sur prix de vente et réduction de marge sont-elles identiques ?',
      answer:
        'Non : la remise part du prix public de vente tandis que le taux de marge ou markup part du coût d’achat.',
    },
    {
      id: 'disc-faq-9',
      question: 'Mes montants sont-ils envoyés sur un serveur ?',
      answer:
        'Non. Tout reste en local dans votre navigateur sans compte ni suivi.',
    },
  ],
  guide: {
    title: 'Calculer une remise : taux, cascade & prix',
    description:
      'Pourquoi -20 % puis -10 % font -28 %, retrouver un prix avant soldes et comparer bon fixe vs taux.',
    readMinutes: 4,
  },
  ui: {
    panelDetails: 'Détails de la remise',
    lblMode: 'Mode de calcul',
    optPercent: 'Pourcentage (%)',
    optFixed: 'Montant fixe',
    lblPrice: 'Prix initial',
    phPrice: 'Ex. 80',
    lblAmountPct: 'Remise (%)',
    lblAmountFixed: 'Montant déduit',
    phPct: 'Ex. 25',
    phFixed: 'Ex. 15',
    lblFinalPrice: 'Prix final',
    emptyHint: 'Saisissez un prix initial et une remise pour calculer.',
    lblSaved: 'Économie',
    lblRate: 'Taux effectif',
    errInvalidPrice: 'Indiquez un prix initial valide supérieur ou égal à 0.',
    warnFixedCapTpl: 'Une déduction de {amt} dépasse {price} : montant ramené à zéro.',
    warnPctCapTpl: 'Remise supérieure à 100 % : {rate} plafonné à 100 %.',
    copyLabel: 'Copier le résultat',
    copiedLabel: 'Copié',
    clearLabel: 'Effacer',
    confirmClearLabel: 'Cliquer encore pour effacer',
    nothingToCopy: 'Calculez d’abord une remise pour copier.',
    engine: {
      pitfallChainedTpl: 'Taux cumulé effectif de {rate} appliqué sur la base de {base}.',
      pitfallSingleTpl: 'Remise simple sur {price} : prix final {final}.',
      pitfallActionLabel: 'Taux équivalent',
    },
  },
};
