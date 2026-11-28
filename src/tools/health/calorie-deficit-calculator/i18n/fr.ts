import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur de déficit calorique",
  "seoTitle": "Calculateur Déficit Calorique - Cible & Durée",
  "description": "Calculez votre déficit calorique quotidien pour maigrir durablement, votre plancher BMR et la durée estimée jusqu’à votre objectif.",
  "tagline": "Apport quotidien recommandé selon votre rythme et durée estimée.",
  "lead": "Estimez votre apport calorique quotidien dans votre navigateur en respectant votre métabolisme de base (BMR) et les jalons de perte.",
  "craft": {
    "solves": "Un déficit fixé une seule fois s’amenuise lorsque vous perdez du poids, donnant l’illusion d’un plateau inexpliqué."
  },
  "guide": {
    "title": "Comment fixer un déficit calorique durable",
    "description": "D’où vient le repère des 7 700 kcal par kilogramme, pourquoi préserver votre BMR et comment recalculer votre objectif en route."
  },
  "fields": {
    "unit": {
      "label": "Unités",
      "options": {
        "metric": "Métrique (kg, cm)",
        "imperial": "Impérial (lb, in)"
      }
    },
    "sex": {
      "label": "Sexe",
      "options": {
        "male": "Homme",
        "female": "Femme"
      },
      "help": "Requis par l’équation BMR ; choisissez le profil métabolique correspondant."
    },
    "age": {
      "label": "Âge",
      "suffix": "ans"
    },
    "weight": {
      "label": "Poids actuel",
      "help": "Kilogrammes en métrique, livres en impérial."
    },
    "height": {
      "label": "Taille",
      "help": "Centimètres en métrique, pouces au total en impérial."
    },
    "activity": {
      "label": "Niveau d’activité",
      "options": {
        "sedentary": "Sédentaire (bureau, peu d’exercice)",
        "light": "Léger (1-3 séances/semaine)",
        "moderate": "Modéré (3-5 séances/semaine)",
        "active": "Actif (6-7 séances/semaine)",
        "very-active": "Très actif (sport intense ou métier physique)"
      }
    },
    "rate": {
      "label": "Perte souhaitée par semaine",
      "options": {
        "1": "1 kg par semaine (très strict)",
        "0.25": "0,25 kg par semaine (doux)",
        "0.5": "0,5 kg par semaine (standard)",
        "0.75": "0,75 kg par semaine (soutenu)"
      }
    },
    "goal": {
      "label": "Poids cible",
      "help": "Laissez vide pour masquer la projection temporelle."
    }
  },
  "ui": {
    "emptyText": "Renseignez vos mesures et votre rythme pour obtenir l’objectif quotidien et la durée estimée.",
    "engine": {
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errMinTpl": "{label} ne peut être inférieur à {min}.",
      "errMaxTpl": "{label} ne peut dépasser {max}.",
      "fieldUnit": "votre système d’unités",
      "fieldSex": "votre sexe pour le calcul BMR",
      "fieldActivity": "votre niveau d’activité",
      "fieldRate": "un rythme de perte",
      "fieldAge": "votre âge",
      "fieldWeight": "votre poids",
      "fieldHeight": "votre taille",
      "fieldGoal": "votre poids cible",
      "errWeightZero": "Indiquez un poids supérieur à zéro pour calculer un déficit.",
      "errHeightZero": "Indiquez une taille supérieure à zéro.",
      "heroLabel": "Apport quotidien",
      "noteFloorTpl": "plancher minimal conseillé, soit environ {kg} kg/semaine",
      "noteRateTpl": "pour perdre {kg} kg par semaine",
      "cardMaint": "Calories de maintien",
      "cardDailyDef": "Déficit quotidien",
      "cardWeeklyDef": "Déficit hebdomadaire",
      "cardBmr": "BMR (plancher)",
      "cardLeft": "Reste à perdre",
      "cardWeeks": "Durée estimée",
      "weeksTpl": "{n} semaines",
      "msQuarterTpl": "Quart du parcours, {w}",
      "msHalfTpl": "Mi-parcours, {w}",
      "msGoalTpl": "Poids cible, {w}",
      "insMainTpl": "Votre maintien est d’environ {maint}. Manger {target} crée un écart de {daily} kcal/jour ({weekly} kcal/semaine).",
      "insFloorTpl": "Viser {kg} kg par semaine descendrait sous votre BMR ({bmr}) ; nous maintenons donc ce plancher.",
      "insWater": "Un kilo de réserve adipeuse représente près de 7 700 kcal. La rétention d’eau peut masquer la tendance pendant deux semaines.",
      "stepMetric": "4 à 5 kg",
      "stepImp": "10 lb",
      "insRecalcTpl": "Recalculez tous les {step} perdus car votre dépense diminue avec votre poids.",
      "vizEat": "Apport",
      "vizGap": "Déficit",
      "vizTitle": "Votre apport face au maintien",
      "vizDescTpl": "Réduction de {pct} % par rapport au maintien estimé de {maint}.",
      "asmUnits": "Unités",
      "asmMetric": "métrique (kg, cm)",
      "asmImp": "impérial (lb, in)",
      "asmFormula": "Formule BMR",
      "asmEnergy": "Énergie par kg",
      "asmFloor": "Plancher calorique",
      "decTdee": "Vérifier uniquement votre TDEE",
      "decMacro": "Répartir ces calories en macros",
      "decTrack": "Suivre votre courbe hebdomadaire",
      "q1": "Quelle ampleur choisir pour un déficit calorique ?",
      "q2": "Combien de semaines faut-il pour atteindre son objectif ?",
      "q3": "Pourquoi la perte de poids stagne-t-elle ?",
      "explanation": "Le déficit calorique mesure l’écart entre dépense totale (BMR Mifflin-St Jeor pondéré par l’activité) et apports. À environ 7 700 kcal par kg de masse grasse, perdre 0,5 kg par semaine demande près de 550 kcal/jour tout en préservant le métabolisme de base."
    }
  },
  "knowledge": {
    "summary": "Calcule la cible calorique quotidienne selon le rythme de perte en protégeant votre BMR et projetant les semaines nécessaires.",
    "useCases": [
      "Définir un budget calorique réaliste pour mincir sans épuisement",
      "Estimer le nombre de semaines jusqu’au poids visé",
      "S’assurer qu’un objectif hebdomadaire ne passe pas sous le BMR"
    ],
    "mistakes": [
      "Choisir le rythme maximal sous le métabolisme basal",
      "Garder les mêmes calories après avoir perdu plusieurs kilos",
      "Tirer des conclusions d’une pesée isolée"
    ]
  },
  "faqs": [
    {
      "id": "calorie-deficit-calculator-faq-1",
      "question": "De combien doit être un déficit calorique ?",
      "answer": "Un rythme compris entre 0,5 % et 1 % du poids corporel par semaine (environ 440 à 880 kcal/jour pour 80 kg) est durable et protège la masse musculaire."
    },
    {
      "id": "calorie-deficit-calculator-faq-2",
      "question": "D’où vient la valeur de 7 700 kcal par kilogramme ?",
      "answer": "C’est l’énergie moyenne contenue dans un kilo de tissu adipeux : divisée par sept, elle correspond à environ 1 100 kcal/jour pour 1 kg hebdomadaire."
    },
    {
      "id": "calorie-deficit-calculator-faq-3",
      "question": "Pourquoi ma perte de poids s’est-elle arrêtée ?",
      "answer": "En maigrissant, votre corps dépense moins : votre déficit d’origine rétrécit. Recalculez tous les 4 à 5 kg et observez les moyennes hebdomadaires."
    },
    {
      "id": "calorie-deficit-calculator-faq-4",
      "question": "Vaut-il mieux manger moins ou bouger davantage ?",
      "answer": "Combiner les deux fonctionne mieux : ajuster l’assiette reste précis tandis que bouger permet de garder des portions plus confortables."
    },
    {
      "id": "calorie-deficit-calculator-faq-5",
      "question": "Que risque-t-on à manger sous son BMR ?",
      "answer": "Une fonte musculaire plus rapide, de la fatigue et une faible tenue sur la durée. Cet outil bloque donc l’objectif au plancher BMR."
    },
    {
      "id": "calorie-deficit-calculator-faq-6",
      "question": "La durée en semaines est-elle exacte ?",
      "answer": "Elle suppose un écart constant idéal ; servez-vous-en comme ordre de grandeur puis ajustez après 2 à 3 semaines réelles."
    }
  ]
};
