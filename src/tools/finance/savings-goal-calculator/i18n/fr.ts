import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "savings-goal-calculator",
  "name": "Calculatrice Objectif d’Épargne",
  "seoTitle": "Calculatrice Objectif d’Épargne Mensuelle",
  "description": "Déterminez l’épargne mensuelle requise pour atteindre un objectif financier à date fixe en intégrant votre capital actuel.",
  "tagline": "Combien épargner par mois pour atteindre votre objectif.",
  "methodology": {
    "name": "Résolution d’annuité",
    "detail": "Calcule le versement mensuel exact compte tenu du rendement estimé et de l’épargne déjà constituée."
  },
  "knowledge": {
    "primaryConcepts": [
      "objectif d’épargne"
    ],
    "realWorldUseCases": [
      "Préparer un apport immobilier",
      "Financer un mariage ou un véhicule",
      "Paramétrer un virement automatique mensuel",
      "Vérifier le réalisme d’un projet"
    ],
    "commonMistakes": [
      "Prendre un taux boursier sur un horizon inférieur à 3 ans",
      "Oublier l’épargne de départ"
    ]
  },
  "faqs": [
    {
      "id": "sg-faq-1",
      "question": "Combien épargner par mois pour atteindre un objectif ?",
      "answer": "La mensualité dépend de la cible, de l’épargne déjà détenue, du rendement espéré et de l’horizon disponible."
    },
    {
      "id": "sg-faq-2",
      "question": "Comment les intérêts réduisent-ils l’effort d’épargne ?",
      "answer": "Le rendement finance une part du montant final. Plus le taux espéré est élevé (avec un risque accru), plus la mensualité diminue."
    },
    {
      "id": "sg-faq-3",
      "question": "Quel taux de rendement retenir ?",
      "answer": "Privilégiez un taux prudent sans risque sous 2 ans et une hypothèse modérée sur 5 à 15 ans."
    },
    {
      "id": "sg-faq-4",
      "question": "Que change un démarrage plus tardif ?",
      "answer": "Réduire la durée diminue la part des intérêts composés et fait grimper rapidement le versement mensuel requis."
    },
    {
      "id": "sg-faq-5",
      "question": "Faut-il saisir mon épargne existante ?",
      "answer": "Oui : ce capital initial fructifie sur toute la durée et réduit d’autant vos mensualités futures."
    },
    {
      "id": "sg-faq-6",
      "question": "Faut-il constituer un fonds d’urgence avant ?",
      "answer": "Oui en général, pour éviter de puiser dans votre épargne dédiée en cas d’imprévu."
    },
    {
      "id": "sg-faq-7",
      "question": "L’inflation est-elle intégrée ?",
      "answer": "Non. Ajustez d’abord le montant cible avec la calculatrice d’inflation pour les projets lointains."
    },
    {
      "id": "sg-faq-8",
      "question": "Mes données quittent-elles mon appareil ?",
      "answer": "Non, tout est calculé localement dans votre navigateur."
    }
  ],
  "guide": {
    "title": "Comment atteindre un objectif d’épargne",
    "description": "Calcul du versement mensuel, arbitrage durée/rendement et erreurs courantes."
  },
  "ui": {
    "scenarios": {
      "Home down payment": "Apport immobilier",
      "Wedding": "Mariage",
      "New car": "Voiture"
    },
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "heroLabel": "Épargne mensuelle",
      "heroNoteTpl": "pendant {months} mois",
      "cardInvested": "Total de vos apports",
      "cardInterest": "Gains de placement",
      "cardGoal": "Objectif",
      "errMinMonths": "Saisissez au moins quelques mois d’épargne.",
      "insMet": "Votre épargne actuelle dépasse déjà cet objectif.",
      "insReturnsTpl": "Les intérêts couvrent {interest} de la somme finale, allégeant votre effort d’épargne.",
      "insEarlier": "Commencer plus tôt réduit nettement la mensualité à mettre de côté.",
      "msMet": "Objectif déjà atteint",
      "msReturns": "Les gains contribuent à l’objectif",
      "asmRate": "Rendement attendu",
      "asmHorizon": "Durée",
      "asmStart": "Solde initial",
      "decCompound": "Voir la capitalisation détaillée",
      "decInflation": "Tester l’objectif face à l’inflation",
      "decEmergency": "Sécuriser d’abord l’épargne de précaution",
      "q1": "Que faire si le rendement est moindre ?",
      "q2": "Comment l’inflation modifie-t-elle mon objectif ?",
      "expMetTpl": "Avec {current} déjà épargnés, l’objectif de {goal} est atteint.",
      "explanationTpl": "Pour réunir {goal} en {years} {unit} avec {current} de départ à {rate}, versez {monthly} par mois.",
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errNotNegativeTpl": "{Label} ne peut pas être négatif. Saisissez 0 ou plus.",
      "errMinTpl": "{Label} ne peut pas être inférieur à {min}.",
      "errMaxTpl": "{Label} ne peut pas dépasser {max}.",
      "errPositiveTpl": "{label} doit être supérieur à zéro.",
      "yearSingular": "an",
      "yearsPlural": "ans",
      "neverLabel": "jamais",
      "vLabels": {
        "amount": "le montant",
        "rate": "le taux",
        "years": "le nombre d’années",
        "goal": "l’objectif d’épargne",
        "current": "l’épargne actuelle",
        "start": "la valeur de départ",
        "end": "la valeur finale"
      }
    },
    "yearOne": "an",
    "yearMany": "ans",
    "heroLabel": "Épargne mensuelle",
    "heroNoteTpl": "pendant {months} mois",
    "cardInvested": "Total de vos apports",
    "cardInterest": "Gains de placement",
    "cardGoal": "Objectif",
    "errMinMonths": "Saisissez au moins quelques mois d’épargne.",
    "insMet": "Votre épargne actuelle dépasse déjà cet objectif.",
    "insReturnsTpl": "Les intérêts couvrent {interest} de la somme finale, allégeant votre effort d’épargne.",
    "insEarlier": "Commencer plus tôt réduit nettement la mensualité à mettre de côté.",
    "msMet": "Objectif déjà atteint",
    "msReturns": "Les gains contribuent à l’objectif",
    "asmRate": "Rendement attendu",
    "asmHorizon": "Durée",
    "asmStart": "Solde initial",
    "decCompound": "Voir la capitalisation détaillée",
    "decInflation": "Tester l’objectif face à l’inflation",
    "decEmergency": "Sécuriser d’abord l’épargne de précaution",
    "q1": "Que faire si le rendement est moindre ?",
    "q2": "Comment l’inflation modifie-t-elle mon objectif ?",
    "expMetTpl": "Avec {current} déjà épargnés, l’objectif de {goal} est atteint.",
    "explanationTpl": "Pour réunir {goal} en {years} {unit} avec {current} de départ à {rate}, versez {monthly} par mois.",
    "errEnterTpl": "Saisissez {label} pour calculer.",
    "errNotNumberTpl": "{label} doit être un nombre.",
    "errNotNegativeTpl": "{Label} ne peut pas être négatif. Saisissez 0 ou plus.",
    "errMinTpl": "{Label} ne peut pas être inférieur à {min}.",
    "errMaxTpl": "{Label} ne peut pas dépasser {max}.",
    "errPositiveTpl": "{label} doit être supérieur à zéro.",
    "yearSingular": "an",
    "yearsPlural": "ans",
    "neverLabel": "jamais",
    "vLabels": {
      "amount": "le montant",
      "rate": "le taux",
      "years": "le nombre d’années",
      "goal": "l’objectif d’épargne",
      "current": "l’épargne actuelle",
      "start": "la valeur de départ",
      "end": "la valeur finale"
    }
  },
  "fields": {
    "goal": {
      "label": "Objectif d’épargne"
    },
    "current": {
      "label": "Épargne actuelle"
    },
    "rate": {
      "label": "Rendement annuel attendu"
    },
    "years": {
      "label": "Horizon (années)",
      "unit": "ans"
    }
  }
};
