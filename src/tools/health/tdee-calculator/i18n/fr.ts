import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'tdee-calculator',
  name: 'Calculateur TDEE',
  seoTitle: 'Calculateur TDEE – Dépense Calorique Quotidienne',
  description:
    'Estimez votre dépense énergétique quotidienne totale (TDEE) et les calories pour perdre, maintenir ou prendre du poids selon Mifflin-St Jeor.',
  tagline: 'Votre dépense énergétique quotidienne et vos objectifs caloriques.',
  craft: {
    solves:
      'Le niveau d’activité est le facteur le plus surestimé ; un seul palier trop haut gonfle l’objectif quotidien de plusieurs centaines de calories.',
  },
  knowledge: {
    primaryConcepts: ['dépense énergétique quotidienne totale', 'métabolisme de base'],
    realWorldUseCases: [
      'Définir un objectif calorique avant une sèche ou une prise de masse',
      'Mesurer la part de l’activité quotidienne au-dessus du repos',
      'Vérifier les recommandations d’une application sportive',
    ],
    commonMistakes: [
      'Surestimer son niveau d’activité hebdomadaire',
      'Prendre le chiffre théorique comme exact sans ajuster avec la balance',
      'Descendre sous son métabolisme de base pour perdre plus vite',
    ],
  },
  fields: {
    unit: { label: 'Unités', options: { metric: 'Métrique (kg, cm)', imperial: 'Impérial (lb, ft/in)' } },
    sex: { label: 'Sexe', options: { male: 'Homme', female: 'Femme' } },
    age: { label: 'Âge', suffix: 'ans' },
    weight: { label: 'Poids', help: 'En kilogrammes (ou livres en impérial).' },
    height: { label: 'Taille', help: 'En centimètres (ou pouces en impérial).' },
    activity: {
      label: 'Niveau d’activité',
      options: {
        sedentary: 'Sédentaire (bureau, peu d’exercice)',
        light: 'Léger (1 à 3 séances/semaine)',
        moderate: 'Modéré (3 à 5 séances/semaine)',
        active: 'Actif (6 à 7 séances/semaine)',
        'very-active': 'Très actif (entraînement intense ou métier physique)',
      },
    },
  },
  faqs: [
    {
      id: 'tdee-calculator-faq-1',
      question: 'Quelle différence entre BMR et TDEE ?',
      answer:
        'Le BMR (métabolisme de base) correspond à l’énergie dépensée au repos complet pour respirer et faire fonctionner vos organes. Le TDEE ajoute à cela vos déplacements, digestion et entraînements.',
    },
    {
      id: 'tdee-calculator-faq-2',
      question: 'Combien de calories manger pour perdre du poids ?',
      answer:
        'Mangez en dessous de votre TDEE de maintien. Un déficit d’environ 500 kcal par jour vise près de 0,45 kg par semaine, tout en évitant de descendre sous votre BMR.',
    },
    {
      id: 'tdee-calculator-faq-3',
      question: 'Quel niveau d’activité choisir ?',
      answer:
        'Restez prudent : choisissez le palier inférieur en cas de doute. Sédentaire convient au travail assis ; léger à 1–3 séances hebdomadaires ; modéré à 3–5.',
    },
    {
      id: 'tdee-calculator-faq-4',
      question: 'Quelle est la fiabilité d’un calculateur TDEE ?',
      answer:
        'L’équation de Mifflin-St Jeor est fiable en moyenne, mais votre masse musculaire réelle peut déplacer le total de 100 à 250 kcal. Ajustez d’après l’évolution de votre poids sur 2 à 3 semaines.',
    },
    {
      id: 'tdee-calculator-faq-5',
      question: 'Pourquoi mon poids ne bouge-t-il pas avec ce total ?',
      answer:
        'Le plus souvent le niveau d’activité a été surestimé ou les portions sous-évaluées. Observez la tendance sur 2–3 semaines puis ajustez de 150–200 kcal si besoin.',
    },
    {
      id: 'tdee-calculator-faq-6',
      question: 'Mes informations restent-elles privées ?',
      answer:
        'Oui. Tous les calculs s’effectuent dans votre navigateur sans aucun envoi à un serveur.',
    },
  ],
  guide: {
    title: 'Calculer son TDEE et calories quotidiennes',
    description:
      'Comprendre BMR vs TDEE, l’équation Mifflin-St Jeor et comment calibrer un déficit ou surplus réaliste.',
    readMinutes: 6,
  },
  ui: {
    emptyText: 'Renseignez âge, poids, taille et activité pour estimer votre TDEE.',
    engine: {
      fieldUnit: 'Unités',
      fieldSex: 'Sexe',
      fieldActivity: 'Activité',
      fieldAge: 'Âge',
      fieldWeight: 'Poids',
      fieldHeight: 'Taille',
      errWeightZero: 'Le poids doit être supérieur à zéro.',
      errHeightZero: 'La taille doit être supérieure à zéro.',
      heroLabel: 'Dépense quotidienne totale (TDEE)',
      heroNote: 'Calories estimées de maintien par jour',
      cardBmr: 'Repos (BMR)',
      cardMildLoss: 'Perte douce (-250 kcal)',
      cardLoss: 'Perte de poids (-500 kcal)',
      cardGain: 'Prise de masse (+300 kcal)',
      insightRestingTpl: 'Au repos strict votre corps brûle {bmr} ; l’activité porte le total à {maintain} par jour.',
      insightGoal: 'Un déficit de 500 kcal/jour cible environ 0,45 kg/semaine en restant au-dessus du BMR.',
      insightCaveat: 'Estimation Mifflin-St Jeor : vérifiez sur la balance après 2 à 3 semaines.',
      actShort: {
        sedentary: 'Sédentaire',
        light: 'Léger',
        moderate: 'Modéré',
        active: 'Actif',
        'very-active': 'Très actif',
      },
      vizRest: 'Repos (BMR)',
      vizActivity: 'Activité',
      vizTitle: 'Répartition de la dépense',
      vizDescTpl: 'Le métabolisme de repos représente {pct} % de vos {maintain} de maintien.',
      assumpUnitsTerm: 'Unités',
      assumpMetric: 'Métrique (kg / cm)',
      assumpImperial: 'Impérial (lb / in)',
      assumpFormulaTerm: 'Équation',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpActivityTerm: 'Coefficient',
      decBmi: 'Situé par rapport à votre IMC',
      decBodyFat: 'Estimer le pourcentage de masse grasse',
      decWeight: 'Suivre la tendance de poids hebdomadaire',
      nextQuestions: [
        'Comment répartir ces calories en protéines, glucides et lipides ?',
        'Comment évolue ma moyenne de poids après 14 jours à ce total ?',
        'Que donne le calcul avec le palier d’activité inférieur ?',
      ],
      explanation:
        'La formule Mifflin-St Jeor estime d’abord votre métabolisme basal (BMR) selon sexe, âge, poids et taille, puis applique le facteur d’activité (1,2 à 1,9).',
    },
  },
};
