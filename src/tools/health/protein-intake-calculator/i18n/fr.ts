import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur d’apport en protéines",
  "seoTitle": "Calculateur Protéines - Besoins Journaliers par Poids",
  "description": "Calculez vos besoins quotidiens en protéines selon votre poids et objectif sportif en g/kg, avec répartition optimale par repas.",
  "tagline": "La fourchette de protéines adaptée à votre poids et entraînement.",
  "lead": "Estimez votre plage quotidienne de protéines en grammes, en g/kg et par repas selon votre objectif directement dans le navigateur.",
  "craft": {
    "solves": "La synthèse protéique réagit par prise alimentaire (~0,4 g/kg) : répartir les apports sur plusieurs repas compte autant que le total."
  },
  "guide": {
    "title": "De combien de protéines avez-vous vraiment besoin ?",
    "description": "Pourquoi les recommandations donnent une fourchette, pourquoi 0,8 g/kg n’est qu’un minimum et comment répartir sur la journée."
  },
  "fields": {
    "unit": {
      "label": "Unités",
      "options": {
        "metric": "Métrique (kg)",
        "imperial": "Impérial (lb)"
      }
    },
    "weight": {
      "label": "Poids corporel",
      "help": "Kilogrammes en métrique, livres en impérial."
    },
    "goal": {
      "label": "Objectif d’entraînement",
      "options": {
        "sedentary": "Plutôt sédentaire, santé générale",
        "active": "Généralement actif, sans programme fixe",
        "endurance": "Endurance (course à pied, cyclisme)",
        "strength": "Musculation ou prise de masse",
        "fat-loss": "Perte de gras en gardant le muscle"
      }
    },
    "meals": {
      "label": "Repas par jour",
      "suffix": "repas"
    }
  },
  "ui": {
    "emptyText": "Entrez votre poids et votre objectif pour afficher la plage quotidienne de protéines.",
    "engine": {
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errMinTpl": "{label} ne peut être inférieur à {min}.",
      "errMaxTpl": "{label} ne peut dépasser {max}.",
      "fieldUnit": "votre système d’unités",
      "fieldGoal": "votre objectif d’entraînement",
      "fieldWeight": "votre poids corporel",
      "fieldMeals": "le nombre de repas par jour",
      "errWeightZero": "Indiquez un poids supérieur à zéro.",
      "goals": {
        "sedentary": "la santé générale sédentaire",
        "active": "l’activité physique générale",
        "endurance": "l’entraînement d’endurance",
        "strength": "la force et prise de muscle",
        "fat-loss": "la sèche avec maintien musculaire"
      },
      "heroLabel": "Protéines par jour",
      "rangeTpl": "{lo} à {hi}",
      "cardMid": "Cible médiane unique",
      "cardMealTpl": "Par repas sur {n} repas",
      "cardPerKg": "Grammes par kilo",
      "perKgTpl": "{lo} à {hi} g/kg",
      "cardKcal": "Calories des protéines",
      "bandGen": "Santé générale",
      "bandActive": "Actif",
      "bandTrain": "Entraînement",
      "bandCut": "Sèche",
      "insRangeTpl": "À {kg} kg pour {goal}, visez {loKg} à {hiKg} g/kg ({lo} à {hi} par jour).",
      "insMealTpl": "Réparti sur {n} repas, cela représente environ {meal} par repas.",
      "insBand": "La recherche s’exprime en fourchette plutôt qu’en chiffre unique ; toute valeur dans cette zone convient.",
      "vizTitle": "Votre cible dans les recommandations (g/kg)",
      "vizDescTpl": "Zone cible située entre {lo} et {hi} grammes par kilogramme.",
      "vizHighlight": "votre plage",
      "asmUnits": "Unités",
      "asmMetric": "métrique (kg)",
      "asmImp": "impérial (lb)",
      "asmSource": "Sources",
      "asmSourceVal": "Positions ISSN et ACSM",
      "asmBasis": "Base",
      "asmBasisVal": "poids total, hors masse maigre",
      "decMacro": "Convertir en répartition macros complète",
      "decTdee": "Estimer votre TDEE journalier",
      "decBf": "Ajuster via votre masse grasse",
      "q1": "Combien de protéines manger chaque jour ?",
      "q2": "Trop de protéines est-il mauvais pour la santé ?",
      "q3": "Calculer sur le poids total ou la masse maigre ?",
      "explanation": "Le besoin en protéines dépend du poids et des contraintes musculaires. Le seuil de 0,8 g/kg évite seulement la carence ; l’ISSN et l’ACSM situent l’actif entre 1,2 et 1,6 g/kg et la force entre 1,6 et 2,2 g/kg."
    }
  },
  "knowledge": {
    "summary": "Détermine la plage quotidienne optimale de protéines par poids et objectif, avec dose par repas et g/kg.",
    "useCases": [
      "Définir ses apports protéiques pour musculation ou sèche",
      "Fractionner ses protéines sur 3 à 5 repas équilibrés",
      "Adapter le calcul sur la masse maigre si nécessaire"
    ],
    "mistakes": [
      "Prendre 0,8 g/kg (AJR minimal) pour l’objectif d’un sportif",
      "Regrouper 80 % des protéines sur un seul dîner"
    ]
  },
  "faqs": [
    {
      "id": "protein-intake-calculator-faq-1",
      "question": "De combien de protéines ai-je besoin par jour ?",
      "answer": "Pour 70 kg : 56-70 g sédentaire, 84-112 g actif, 112-154 g en musculation et ~126-168 g en déficit calorique."
    },
    {
      "id": "protein-intake-calculator-faq-2",
      "question": "Pourquoi obtenir une plage plutôt qu’un nombre fixe ?",
      "answer": "Parce que les études ISSN et ACSM publient des intervalles adaptés au volume d’effort et à l’apport énergétique."
    },
    {
      "id": "protein-intake-calculator-faq-3",
      "question": "Consommer beaucoup de protéines est-il dangereux ?",
      "answer": "Chez une personne à fonction rénale saine, jusqu’à 2 g/kg et plus n’a pas montré d’effet néfaste en étude contrôlée."
    },
    {
      "id": "protein-intake-calculator-faq-4",
      "question": "Poids total ou masse maigre ?",
      "answer": "Avec une forte masse grasse, utilisez plutôt la même fourchette g/kg appliquée à votre masse maigre."
    },
    {
      "id": "protein-intake-calculator-faq-5",
      "question": "La répartition dans la journée change-t-elle quelque chose ?",
      "answer": "Oui. Viser ~0,4 g/kg par prise sur plusieurs repas stimule davantage la synthèse musculaire qu’un seul repas massif."
    },
    {
      "id": "protein-intake-calculator-faq-6",
      "question": "Faut-il obligatoirement des protéines en poudre ?",
      "answer": "Non : œufs, volaille, poisson, fromage blanc et légumineuses couvrent facilement les besoins ; la poudre n’est qu’un gain de temps."
    }
  ]
};
