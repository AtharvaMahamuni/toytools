import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur de macros",
  "seoTitle": "Calculateur de Macros - Protéines, Glucides, Lipides",
  "description": "Répartissez votre objectif calorique en grammes de protéines, glucides et lipides selon les profils équilibré, hyperprotéiné, low-carb ou céto.",
  "tagline": "Convertissez vos calories en protéines, glucides et lipides.",
  "lead": "Traduisez votre apport calorique quotidien en grammes précis de macronutriments dans votre navigateur avec des répartitions à 100 % cohérentes.",
  "craft": {
    "solves": "Des pourcentages choisis au hasard ne totalisent souvent pas 100 %, faussant involontairement l’apport calorique visé."
  },
  "guide": {
    "title": "Comment calculer ses macros à partir des calories",
    "description": "Comprendre protéines, glucides et lipides, convertir des calories en grammes et choisir une répartition facile à tenir."
  },
  "fields": {
    "calories": {
      "label": "Calories quotidiennes",
      "suffix": "kcal",
      "help": "Votre objectif journalier (utilisez le calculateur TDEE si besoin)."
    },
    "diet": {
      "label": "Profil nutritionnel",
      "options": {
        "balanced": "Équilibré (45% gluc. / 25% prot. / 30% lip.)",
        "high-protein": "Riche en protéines (40 / 35 / 25)",
        "low-carb": "Faible en glucides (25 / 35 / 40)",
        "keto": "Cétogène (5 / 25 / 70)"
      }
    }
  },
  "ui": {
    "emptyText": "Entrez vos calories quotidiennes et choisissez un profil pour voir vos objectifs en grammes.",
    "engine": {
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errMinTpl": "{label} ne peut être inférieur à {min}.",
      "errMaxTpl": "{label} ne peut dépasser {max}.",
      "fieldDiet": "un profil nutritionnel",
      "fieldCalories": "vos calories quotidiennes",
      "errCalZero": "Saisissez un objectif supérieur à zéro.",
      "heroProtein": "Protéines",
      "notePctKcalTpl": "{pct} % de {kcal} kcal",
      "notePctTpl": "{pct} % des calories",
      "cardCarb": "Glucides",
      "cardFat": "Lipides",
      "cardSplit": "Répartition (G/P/L)",
      "vizCarb": "Glucides",
      "vizProtein": "Protéines",
      "vizFat": "Lipides",
      "vizTitle": "Votre répartition des macros",
      "vizDescTpl": "{carb} % glucides, {protein} % protéines, {fat} % lipides sur {kcal} kcal.",
      "diets": {
        "balanced": "Équilibré",
        "high-protein": "Riche en protéines",
        "low-carb": "Low-Carb",
        "keto": "Cétogène"
      },
      "insSplitTpl": "En profil {diet} à {kcal} kcal, visez environ {protein} g de protéines, {carb} g de glucides et {fat} g de lipides.",
      "insEnergy": "Protéines et glucides fournissent 4 kcal par gramme contre 9 kcal pour les lipides. Retenez la répartition la plus tenable.",
      "insTotal": "Tenir le total calorique global prime sur la précision exacte du pourcentage.",
      "asmDiet": "Profil nutritionnel",
      "asmEnergy": "Énergie par gramme",
      "asmEnergyVal": "protéines 4, glucides 4, lipides 9 kcal",
      "decTdee": "Estimer votre TDEE de référence",
      "decBmi": "Consulter aussi votre IMC",
      "q1": "Combien de calories manger chaque jour ?",
      "q2": "De combien de protéines ai-je besoin ?",
      "q3": "Quel partage de macros choisir pour perdre du gras ?",
      "explanation": "Les trois macronutriments apportent respectivement 4 kcal/g (protéines et glucides) et 9 kcal/g (lipides). L’outil convertit chaque part sans écart de somme."
    }
  },
  "knowledge": {
    "summary": "Transforme un budget calorique en grammes de protéines, glucides et lipides avec des préréglages équilibrés, protéinés, low-carb ou keto.",
    "useCases": [
      "Convertir un objectif TDEE en cibles alimentaires concrètes",
      "Comparer les grammes entre un régime équilibré et cétogène",
      "Structurer ses repas pour la sèche ou la prise de muscle"
    ],
    "mistakes": [
      "Additionner des pourcentages arbitraires qui ne font pas 100 %",
      "Oublier de vérifier les grammes absolus de protéines par kilo",
      "Vouloir atteindre chaque gramme à la décimale près"
    ]
  },
  "faqs": [
    {
      "id": "macro-calculator-faq-1",
      "question": "Comment calculer ses macronutriments ?",
      "answer": "Prenez votre objectif calorique, appliquez le pourcentage de chaque macro puis divisez par 4 (protéines/glucides) ou 9 (lipides)."
    },
    {
      "id": "macro-calculator-faq-2",
      "question": "Quelle répartition convient pour la perte de poids ?",
      "answer": "Un partage plus riche en protéines (40 % glucides / 35 % protéines / 25 % lipides) aide à préserver le muscle et la satiété."
    },
    {
      "id": "macro-calculator-faq-3",
      "question": "Combien de protéines consommer par jour ?",
      "answer": "Pour les sportifs, les repères courants vont de 1,6 à 2,2 g/kg, ce qui correspond bien aux préréglages de 25 à 35 %."
    },
    {
      "id": "macro-calculator-faq-4",
      "question": "Quelles différences entre les profils proposés ?",
      "answer": "Équilibré (45/25/30), Riche en protéines (35 % prot.), Low-Carb (25 % gluc.) et Céto (5 % glucides, 70 % lipides)."
    },
    {
      "id": "macro-calculator-faq-5",
      "question": "Faut-il respecter les grammes au gramme près ?",
      "answer": "Non : rester proche du total calorique et de votre cible protéique suffit amplement."
    },
    {
      "id": "macro-calculator-faq-6",
      "question": "Comment connaître mon besoin en calories ?",
      "answer": "Utilisez d’abord le calculateur TDEE selon votre taille, poids, âge et niveau d’activité."
    }
  ]
};
