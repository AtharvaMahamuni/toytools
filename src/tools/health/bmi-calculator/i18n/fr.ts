import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'bmi-calculator',
  name: 'Calculateur d’IMC',
  seoTitle: 'Calculateur d’IMC en Ligne – Indice de Masse Corporelle',
  description:
    'Calculez votre Indice de Masse Corporelle (IMC) en unités métriques ou impériales, consultez la catégorie OMS et votre plage de poids santé.',
  tagline: 'Votre IMC selon la taille et le poids, avec la plage de poids santé adaptée.',
  methodology: {
    name: 'Classification IMC de l’OMS',
    detail:
      'Poids en kilogrammes divisé par la taille en mètres au carré, situé selon les seuils adultes de l’Organisation mondiale de la santé : 18,5, 25 et 30.',
  },
  knowledge: {
    primaryConcepts: ['indice de masse corporelle', 'plage de poids santé'],
    realWorldUseCases: [
      'Situer votre poids par rapport à la zone de poids santé avant de définir un objectif.',
      'Comprendre un indice d’IMC indiqué lors d’une visite médicale ou sur un bilan.',
      'Connaître l’écart en kilos ou en livres par rapport à la plage recommandée pour votre taille.',
    ],
    commonMistakes: [
      'Interpréter l’IMC comme un diagnostic médical au lieu d’un indicateur statistique.',
      'Mélanger les unités, par exemple saisir un poids en livres avec une taille en centimètres.',
      'Appliquer les seuils adultes aux enfants ou aux sportifs très musclés.',
    ],
  },
  faqs: [
    {
      id: 'bmi-calculator-faq-1',
      question: 'Quelle est la plage d’IMC considérée comme saine ?',
      answer:
        'Chez l’adulte, l’Organisation mondiale de la santé place la zone normale entre 18,5 et 24,9. En dessous de 18,5 correspond à une insuffisance pondérale, de 25 à 29,9 à un surpoids et à partir de 30 à une obésité. Le calculateur indique votre indice, sa catégorie et la fourchette de poids adaptée à votre taille.',
    },
    {
      id: 'bmi-calculator-faq-2',
      question: 'Comment calcule-t-on l’IMC ?',
      answer:
        'L’IMC correspond au poids en kilogrammes divisé par le carré de la taille en mètres. Pour 70 kg et 1,75 m, on obtient 70 / (1,75 × 1,75), soit environ 22,9. En système impérial, l’outil convertit d’abord les livres et les pouces avant d’appliquer la même formule.',
    },
    {
      id: 'bmi-calculator-faq-3',
      question: 'L’IMC est-il fiable pour les personnes très musclées ou sportives ?',
      answer:
        'Pas toujours. L’IMC n’utilise que la taille et le poids, sans distinguer la masse musculaire de la masse grasse. Un athlète musclé peut obtenir un IMC de surpoids avec très peu de graisse, tandis qu’une personne âgée ayant perdu du muscle peut paraître dans la norme malgré un excès adipeux.',
    },
    {
      id: 'bmi-calculator-faq-4',
      question: 'Comment calculer l’IMC en livres et en pouces ?',
      answer:
        'Sélectionnez le système impérial et saisissez votre poids en livres (lb) et votre taille totale en pouces (in). Vos valeurs déjà saisies sont converties automatiquement et les mêmes seuils OMS s’appliquent.',
    },
    {
      id: 'bmi-calculator-faq-5',
      question: 'Ce calculateur d’IMC convient-il aux enfants ?',
      answer:
        'Non. Les seuils fixes pour adultes ne s’appliquent pas avant 18 ans. Pour les enfants et adolescents, on utilise des courbes de corpulence et percentiles par âge et par sexe, car la composition corporelle évolue pendant la croissance.',
    },
    {
      id: 'bmi-calculator-faq-6',
      question: 'Mes données personnelles restent-elles privées ?',
      answer:
        'Oui. Tout le calcul est effectué localement dans votre navigateur. Votre poids et votre taille ne sont jamais envoyés à un serveur ; seul votre choix d’unité est mémorisé localement.',
    },
  ],
  guide: {
    title: 'Comment calculer l’IMC (et ce qu’il indique vraiment)',
    description:
      'Formule de l’IMC, catégories de l’OMS, lecture de la plage de poids santé et limites concrètes de cet indicateur de dépistage.',
    readMinutes: 5,
  },
  fields: {
    unit: {
      label: 'Système d’unités',
      options: { metric: 'Métrique (kg, cm)', imperial: 'Impérial (lb, in)' },
    },
    weight: {
      label: 'Poids',
      help: 'Entrez votre poids corporel actuel.',
    },
    height: {
      label: 'Taille',
      help: 'Entrez votre taille en centimètres ou en pouces totaux.',
    },
  },
  ui: {
    emptyText: 'Saisissez votre poids et votre taille pour calculer votre IMC.',
    engine: {
      fieldUnit: 'votre système d’unités',
      fieldWeight: 'votre poids',
      fieldHeight: 'votre taille',
      errWeightZero: 'Entrez un poids supérieur à zéro pour calculer votre IMC.',
      errHeightZero: 'Entrez une taille supérieure à zéro pour calculer votre IMC.',
      heroLabel: 'Indice de Masse Corporelle',
      categoryLabel: 'Catégorie',
      healthyRangeLabel: 'Poids santé pour votre taille',
      weightToLoseLabel: 'Poids à perdre pour rejoindre la plage santé',
      weightToGainLabel: 'Poids à prendre pour rejoindre la plage santé',
      insightNormal: 'Un IMC de {bmi} se situe dans la plage normale (18,5 à 24,9) pour un adulte.',
      insightOther: 'Un IMC de {bmi} entre dans la catégorie « {label} ». La plage santé pour votre taille est {range}.',
      insightCaveat:
        'L’IMC est un repère rapide, pas un diagnostic médical. Comme il ne distingue pas le muscle de la graisse, complétez-le par d’autres indicateurs.',
      cats: {
        underweight: 'Insuffisance pondérale',
        normal: 'Poids normal',
        overweight: 'Surpoids',
        obese: 'Obésité',
      },
      bands: {
        underweight: 'Maigreur',
        normal: 'Normal',
        overweight: 'Surpoids',
        obese: 'Obésité',
      },
      vizTitle: 'Votre IMC de {bmi} sur l’échelle OMS adulte',
      vizDesc: 'Plage de poids santé pour votre taille : {range}.',
      milestoneHealthy: 'Le poids se situe dans la plage d’IMC santé',
      assumpUnitsTerm: 'Unités',
      assumpMetric: 'métrique (kg, cm)',
      assumpImperial: 'impérial (lb, in)',
      assumpFormulaTerm: 'Formule',
      assumpFormulaVal: 'poids (kg) / taille (m)²',
      assumpCatsTerm: 'Catégories',
      assumpCatsVal: 'seuils OMS adultes (18,5 / 25 / 30)',
      decTdee: 'Estimer votre dépense calorique quotidienne',
      decBodyFat: 'Estimer le taux de masse grasse, invisible avec l’IMC',
      decWeight: 'Suivre l’évolution de votre poids dans le temps',
      nextQuestions: [
        'Combien de calories est-ce que je brûle par jour ?',
        'Quel est mon pourcentage de masse grasse ?',
        'L’IMC est-il fiable pour les sportifs ?',
      ],
      explanation:
        'L’IMC divise le poids en kilogrammes par le carré de la taille en mètres et situe le résultat sur les seuils adultes définis par l’Organisation mondiale de la santé. Ne tenant compte que de la taille et du poids, il ne distingue ni la masse musculaire ni la morphologie osseuse et reste un repère global.',
    },
  },
};
