import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'bmr-calculator',
  name: 'Calculateur BMR (Métabolisme de Base)',
  seoTitle: 'Calculateur BMR – Métabolisme de Base Mifflin-St Jeor',
  description:
    'Calculez votre métabolisme de base (BMR) avec l’équation Mifflin-St Jeor dans votre navigateur et voyez l’apport énergétique de chaque activité.',
  tagline: 'Votre métabolisme de base et le surcroît de chaque niveau d’activité.',
  craft: {
    solves:
      'Un métabolisme de repos sous 1 400 kcal fait souvent craindre un blocage ; ramené par kilo de poids, ce chiffre redevient tout à fait normal.',
  },
  knowledge: {
    primaryConcepts: ['métabolisme de base (BMR)', 'dépense énergétique au repos (RMR)'],
    realWorldUseCases: [
      'Connaître la dépense minimale au repos avant multiplicateur d’activité',
      'Fixer le plancher calorique à ne pas enfreindre en déficit',
      'Comparer la part du repos et celle du mouvement sur une journée',
    ],
    commonMistakes: [
      'Manger uniquement son BMR au lieu de cibler un déficit depuis le maintien',
      'Attendre de la formule qu’elle estime la masse musculaire sans la mesurer',
      'Prendre un BMR modeste lié au gabarit pour un métabolisme ralenti',
    ],
  },
  fields: {
    unit: { label: 'Unités', options: { metric: 'Métrique (kg, cm)', imperial: 'Impérial (lb, ft/in)' } },
    sex: { label: 'Sexe', options: { male: 'Homme', female: 'Femme' } },
    age: { label: 'Âge', suffix: 'ans' },
    weight: { label: 'Poids', help: 'En kilogrammes (ou livres en impérial).' },
    height: { label: 'Taille', help: 'En centimètres (ou pouces en impérial).' },
  },
  faqs: [
    {
      id: 'bmr-calculator-faq-1',
      question: 'Qu’est-ce qu’un BMR normal ?',
      answer:
        'Il varie selon la taille corporelle : un homme de 30 ans (175 cm, 70 kg) avoisine 1 650 kcal/jour et une femme de même âge (165 cm, 60 kg) 1 320 kcal/jour.',
    },
    {
      id: 'bmr-calculator-faq-2',
      question: 'Quelle différence entre BMR et TDEE ?',
      answer:
        'Le BMR couvre la respiration, la circulation et les organes au repos complet. Le TDEE ajoute la marche, la digestion et le sport (1,2 à 1,9 fois le BMR).',
    },
    {
      id: 'bmr-calculator-faq-3',
      question: 'Dois-je manger mon BMR pour perdre du poids ?',
      answer:
        'Non. Manger uniquement votre BMR ignore votre dépense active et crée une restriction excessive. Fixez plutôt un déficit modéré sous votre TDEE.',
    },
    {
      id: 'bmr-calculator-faq-4',
      question: 'Pourquoi Mifflin-St Jeor plutôt que Harris-Benedict ?',
      answer:
        'Harris-Benedict (1919) surestime souvent le repos d’environ 5 %. Publiée en 1990, Mifflin-St Jeor correspond mieux aux compositions corporelles modernes.',
    },
    {
      id: 'bmr-calculator-faq-5',
      question: 'Plus de muscle augmente-t-il fortement le BMR ?',
      answer:
        'Oui mais modérément : 1 kg de muscle consomme ~13 kcal/jour au repos contre ~4,5 kcal pour la graisse. Cette formule reste basée sur taille, poids, âge et sexe.',
    },
    {
      id: 'bmr-calculator-faq-6',
      question: 'Le BMR est-il identique au RMR ?',
      answer:
        'Ils sont très proches : le BMR se mesure à jeun dans un cadre clinique strict, tandis que le RMR (taux métabolique au repos) est mesuré de façon plus souple (~10 % plus élevé).',
    },
  ],
  guide: {
    title: 'Ce que mesure votre métabolisme de base (BMR)',
    description:
      'Équation de Mifflin-St Jeor expliquée, pourquoi ne pas descendre sous votre BMR et lien avec RMR et TDEE.',
    readMinutes: 5,
  },
  ui: {
    emptyText: 'Renseignez sexe, âge, poids et taille pour calculer le BMR.',
    engine: {
      fieldUnit: 'Unités',
      fieldSex: 'Sexe',
      fieldAge: 'Âge',
      fieldWeight: 'Poids',
      fieldHeight: 'Taille',
      errWeightZero: 'Le poids doit être supérieur à zéro.',
      errHeightZero: 'La taille doit être supérieure à zéro.',
      errBmrNonPos: 'Vérifiez vos mesures : le résultat doit être positif.',
      heroLabel: 'Métabolisme de base (BMR)',
      heroNote: 'Énergie au repos strict (pas votre objectif alimentaire)',
      cardPerHour: 'Par heure au repos',
      levels: {
        sedentary: 'Sédentaire (×1,2)',
        light: 'Léger (×1,375)',
        moderate: 'Modéré (×1,55)',
        active: 'Actif (×1,725)',
        'very-active': 'Très actif (×1,9)',
      },
      insightRestingTpl: 'Même au repos absolu votre corps dépense environ {bmr} par jour, soit ~{perHour} kcal chaque heure.',
      insightNotEatTpl: 'Le BMR n’est pas votre ration cible : une journée sédentaire coûte déjà environ {sedentary}. Manger au niveau du BMR crée un fort déficit.',
      insightDrivers: 'Le poids, la taille et l’âge expliquent la majeure partie de cette dépense basale.',
      vizRest: 'Repos (BMR)',
      vizModerate: 'Activité modérée',
      vizTitle: 'Repos complet vs journée modérément active',
      vizDescTpl: 'Votre métabolisme de repos représente {pct} % d’une journée modérément active ({moderate}).',
      assumpUnitsTerm: 'Unités',
      assumpMetric: 'Métrique (kg / cm)',
      assumpImperial: 'Impérial (lb / in)',
      assumpFormulaTerm: 'Équation',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpBodyTerm: 'Composition',
      assumpBodyVal: 'Ne distingue pas masse maigre et masse grasse',
      decTdee: 'Appliquer votre niveau d’activité dans le Calculateur TDEE',
      decMacro: 'Répartir l’apport en protéines, glucides et lipides',
      decBodyFat: 'Estimer le pourcentage de masse grasse',
      nextQuestions: [
        'Quelle est ma dépense totale avec mon rythme d’entraînement hebdomadaire ?',
        'Quel déficit reste confortable au-dessus de mon métabolisme basal ?',
        'De combien baisse mon BMR tous les 5 ans ?',
      ],
      explanation:
        'L’équation Mifflin-St Jeor estime la dépense minimale de vos fonctions vitales au repos complet à partir de votre sexe, âge, poids et taille.',
    },
  },
};
