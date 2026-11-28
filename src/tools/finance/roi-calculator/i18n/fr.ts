import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "roi-calculator",
  "name": "Calculatrice ROI",
  "seoTitle": "Calculatrice ROI: Retour sur Investissement",
  "description": "Calculez votre retour sur investissement (ROI), gain net et taux annualisé sur la période de détention directement en local.",
  "tagline": "Retour sur investissement global et taux annualisé.",
  "methodology": {
    "name": "ROI et taux annualisé",
    "detail": "Rapporte le gain net au coût d’entrée et convertit le résultat en taux annuel composé selon la durée."
  },
  "knowledge": {
    "primaryConcepts": [
      "retour sur investissement (ROI)"
    ],
    "realWorldUseCases": [
      "Évaluer le gain net d’une action après revente",
      "Comparer une plus-value immobilière à un indice boursier",
      "Vérifier la rentabilité d’un projet ou investissement",
      "Convertir un gain pluriannuel en taux annuel comparable"
    ],
    "commonMistakes": [
      "Comparer des ROI sur des durées inégales sans annualisation",
      "Omettre frais, impôts et revenus perçus"
    ]
  },
  "faqs": [
    {
      "id": "roi-faq-1",
      "question": "Comment calculer le ROI ?",
      "answer": "ROI% = ((Valeur finale − Coût) / Coût) × 100. Passer de 10 000 à 15 000 représente un ROI de 50%."
    },
    {
      "id": "roi-faq-2",
      "question": "Qu’est-ce qu’un bon ROI ?",
      "answer": "Tout dépend de la durée : 50% en 1 an est remarquable, mais en 15 ans cela ne fait que 2,7% par an. Référez-vous au taux annualisé."
    },
    {
      "id": "roi-faq-3",
      "question": "Quelle différence entre ROI et rendement annualisé ?",
      "answer": "Le ROI donne le gain total sans dimension temporelle; le taux annualisé ramène ce résultat sur une base annuelle comparable."
    },
    {
      "id": "roi-faq-4",
      "question": "Le calculateur gère-t-il les pertes ?",
      "answer": "Oui. Une valeur finale inférieure au coût affiche directement un ROI négatif et la perte nette."
    },
    {
      "id": "roi-faq-5",
      "question": "Faut-il inclure frais, taxes et dividendes ?",
      "answer": "Oui. Intégrez les frais d’entrée au coût et ajoutez dividendes ou loyers perçus à la valeur finale nette."
    },
    {
      "id": "roi-faq-6",
      "question": "Quelle différence avec le CAGR ?",
      "answer": "Le ROI exprime la variation globale, tandis que le CAGR indique le taux annuel composé correspondant."
    },
    {
      "id": "roi-faq-7",
      "question": "Mes montants sont-ils envoyés en ligne ?",
      "answer": "Non, le calcul est 100% local dans votre navigateur."
    }
  ],
  "guide": {
    "title": "Comment calculer le retour sur investissement (ROI)",
    "description": "Formule du ROI, pourquoi annualiser le rendement et comment intégrer frais, taxes et dividendes."
  },
  "ui": {
    "scenarios": {
      "Stock position": "Action",
      "Property sale": "Vente immo",
      "Losing trade": "Opération perdante"
    },
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "yrUnit": "an",
      "notSpecified": "non précisée",
      "heroLabel": "Retour sur investissement",
      "noteGainTpl": "gain net de {amt}",
      "noteLossTpl": "perte de {amt}",
      "cardGain": "Gain net",
      "cardLoss": "Perte nette",
      "cardFinal": "Valeur finale",
      "cardAnnualized": "Rendement annualisé",
      "insGainTpl": "Chaque {base} investi a rapporté {back}.",
      "insLossTpl": "Cette position a perdu {loss}, soit un recul de {pct}.",
      "insAnnualTpl": "Le ROI brut ignore le temps. Sur {years} ans cela revient à {annual} par an.",
      "insNoPeriod": "Ajoutez une durée pour afficher le rendement annuel équivalent.",
      "msDoubled": "Mise au moins doublée",
      "msAhead": "Résultat positif",
      "asmFigures": "Montants",
      "asmFiguresVal": "bruts de frais et fiscalité",
      "asmCash": "Flux",
      "asmCashVal": "un achat initial et une sortie finale",
      "asmPeriod": "Détention",
      "decCagr": "Analyser sous forme de CAGR",
      "decCompound": "Projeter ces capitaux sur les années à venir",
      "decInflation": "Vérifier le gain face à l’inflation",
      "q1": "À quel taux annuel cela correspond-il ?",
      "q2": "Comment cela se compare-t-il à un indice boursier ?",
      "returnWord": "rendement",
      "lossWord": "perte",
      "expAnnualTpl": " ({annual} par an sur {years} {unit})",
      "explanationTpl": "Vous avez investi {cost} pour obtenir {final}, soit {pct} de {dir}{annualClause}.",
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
        "principal": "le capital initial",
        "rate": "le taux d’intérêt",
        "years": "la durée en années",
        "contribution": "le versement mensuel",
        "price": "le montant emprunté",
        "down": "l’apport personnel",
        "extra": "le remboursement anticipé mensuel",
        "monthly": "l’investissement mensuel",
        "initial": "le capital de départ",
        "cost": "le montant investi",
        "final": "la valeur finale",
        "amount": "le montant actuel",
        "goal": "l’objectif d’épargne",
        "current": "l’épargne actuelle",
        "start": "la valeur de départ",
        "end": "la valeur finale"
      }
    },
    "yearOne": "an",
    "yearMany": "ans",
    "yrUnit": "an",
    "notSpecified": "non précisée",
    "heroLabel": "Retour sur investissement",
    "noteGainTpl": "gain net de {amt}",
    "noteLossTpl": "perte de {amt}",
    "cardGain": "Gain net",
    "cardLoss": "Perte nette",
    "cardFinal": "Valeur finale",
    "cardAnnualized": "Rendement annualisé",
    "insGainTpl": "Chaque {base} investi a rapporté {back}.",
    "insLossTpl": "Cette position a perdu {loss}, soit un recul de {pct}.",
    "insAnnualTpl": "Le ROI brut ignore le temps. Sur {years} ans cela revient à {annual} par an.",
    "insNoPeriod": "Ajoutez une durée pour afficher le rendement annuel équivalent.",
    "msDoubled": "Mise au moins doublée",
    "msAhead": "Résultat positif",
    "asmFigures": "Montants",
    "asmFiguresVal": "bruts de frais et fiscalité",
    "asmCash": "Flux",
    "asmCashVal": "un achat initial et une sortie finale",
    "asmPeriod": "Détention",
    "decCagr": "Analyser sous forme de CAGR",
    "decCompound": "Projeter ces capitaux sur les années à venir",
    "decInflation": "Vérifier le gain face à l’inflation",
    "q1": "À quel taux annuel cela correspond-il ?",
    "q2": "Comment cela se compare-t-il à un indice boursier ?",
    "returnWord": "rendement",
    "lossWord": "perte",
    "expAnnualTpl": " ({annual} par an sur {years} {unit})",
    "explanationTpl": "Vous avez investi {cost} pour obtenir {final}, soit {pct} de {dir}{annualClause}.",
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
      "principal": "le capital initial",
      "rate": "le taux d’intérêt",
      "years": "la durée en années",
      "contribution": "le versement mensuel",
      "price": "le montant emprunté",
      "down": "l’apport personnel",
      "extra": "le remboursement anticipé mensuel",
      "monthly": "l’investissement mensuel",
      "initial": "le capital de départ",
      "cost": "le montant investi",
      "final": "la valeur finale",
      "amount": "le montant actuel",
      "goal": "l’objectif d’épargne",
      "current": "l’épargne actuelle",
      "start": "la valeur de départ",
      "end": "la valeur finale"
    }
  },
  "fields": {
    "cost": {
      "label": "Montant investi"
    },
    "final": {
      "label": "Valeur finale",
      "help": "Valeur actuelle ou prix net de cession."
    },
    "years": {
      "label": "Durée de détention",
      "unit": "ans",
      "help": "Optionnel. Affiche le taux annualisé comparable."
    }
  }
};
