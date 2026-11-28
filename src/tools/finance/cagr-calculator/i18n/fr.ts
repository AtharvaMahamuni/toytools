import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "cagr-calculator",
  "name": "Calculatrice CAGR (TCAM)",
  "seoTitle": "Calculatrice CAGR / TCAM: Croissance Annuelle Composée",
  "description": "Calculez le CAGR (taux de croissance annuel composé), la hausse globale, le multiple et le temps de doublement localement.",
  "tagline": "Taux annuel composé (CAGR), croissance totale et doublement.",
  "methodology": {
    "name": "Taux de croissance annuel composé",
    "detail": "Calcule (Fin/Départ)^(1/t) − 1, le taux annuel constant qui relie la valeur initiale à la valeur finale."
  },
  "knowledge": {
    "primaryConcepts": [
      "CAGR",
      "TCAM"
    ],
    "realWorldUseCases": [
      "Annualiser le rendement d’un fonds sur plusieurs années",
      "Mesurer la croissance d’un chiffre d’affaires",
      "Comparer des investissements de durées inégales",
      "Vérifier le réalisme d’un taux projeté"
    ],
    "commonMistakes": [
      "Diviser la hausse totale par le nombre d’années",
      "Calculer un CAGR malgré des apports/retraits intermédiaires"
    ]
  },
  "faqs": [
    {
      "id": "cagr-faq-1",
      "question": "Qu’est-ce que le CAGR (TCAM) ?",
      "answer": "Le taux de croissance annuel composé est le taux annuel constant reliant la valeur de départ à la valeur finale sur t années."
    },
    {
      "id": "cagr-faq-2",
      "question": "Comment le calculer ?",
      "answer": "CAGR = (Valeur finale / Valeur initiale)^(1/t) − 1. Passer de 10 000 à 25 000 sur 10 ans donne environ 9,6% par an."
    },
    {
      "id": "cagr-faq-3",
      "question": "Pourquoi est-il inférieur à la croissance totale divisée par les années ?",
      "answer": "Chaque année se compose sur la précédente; un taux annuel plus faible suffit pour atteindre le même résultat final."
    },
    {
      "id": "cagr-faq-4",
      "question": "Quelle différence entre CAGR et ROI ?",
      "answer": "Le ROI indique le gain total cumulé; le CAGR traduit ce gain en rythme annuel comparable."
    },
    {
      "id": "cagr-faq-5",
      "question": "Un CAGR peut-il être négatif ?",
      "answer": "Oui, dès que la valeur finale est inférieure au point de départ."
    },
    {
      "id": "cagr-faq-6",
      "question": "Quelles sont les limites du CAGR ?",
      "answer": "Il masque les baisses intermédiaires et fausse l’analyse si des apports ou retraits ont lieu en cours de route."
    },
    {
      "id": "cagr-faq-7",
      "question": "Lien avec le temps de doublement ?",
      "answer": "La durée exacte de doublement vaut ln(2) / ln(1 + CAGR), proche de la règle de 72."
    },
    {
      "id": "cagr-faq-8",
      "question": "Comment annualiser une croissance pluriannuelle ?",
      "answer": "Élevez le multiple (Fin / Départ) à la puissance 1/t puis retranchez 1. Doubler en 5 ans équivaut à 14,87% par an."
    },
    {
      "id": "cagr-faq-9",
      "question": "CAGR vs moyenne arithmétique annuelle ?",
      "answer": "La moyenne simple surestime dès qu’il y a volatilité (+100% puis −50% = +25% en moyenne mais 0% en CAGR)."
    },
    {
      "id": "cagr-faq-10",
      "question": "Deux actifs de même CAGR ont-ils le même risque ?",
      "answer": "Non : le CAGR ne montre ni la volatilité ni l’ampleur des krachs intermédiaires."
    },
    {
      "id": "cagr-faq-11",
      "question": "Pourquoi le CAGR paraît bas face au gain total ?",
      "answer": "Sur 20 ans, +400% (×5) correspond à 8,4% par an sous l’effet composé, bien loin de 20%."
    },
    {
      "id": "cagr-faq-12",
      "question": "Mes données restent-elles confidentielles ?",
      "answer": "Oui, tout se calcule localement dans le navigateur."
    }
  ],
  "guide": {
    "title": "Qu’est-ce que le CAGR (TCAM) et comment le calculer",
    "description": "Formule du TCAM, supériorité sur la moyenne arithmétique et limites liées à la volatilité."
  },
  "ui": {
    "scenarios": {
      "Index fund decade": "Décennie indice",
      "Fast-growing revenue": "Forte croissance",
      "Slow saver": "Progression douce"
    },
    "engine": {
      "heroLabel": "CAGR (taux annuel composé)",
      "heroNoteTpl": "par an sur {period}",
      "cardGrowth": "Croissance totale",
      "cardDecline": "Baisse totale",
      "cardMultiple": "Multiple",
      "cardDoubles": "Double tous les",
      "insPosTpl": "{total} de hausse sur {period} équivaut à {cagr} par an, moins qu’une simple division à cause de l’effet composé.",
      "insNegTpl": "La valeur a reculé en moyenne de {cagr} par an sur la période.",
      "insShort": "Annualiser une durée inférieure à un an extrapole une courte fenêtre sur toute l’année.",
      "insSmooth": "Le CAGR suppose une croissance régulière; la volatilité intermédiaire est lissée.",
      "msDoubled": "Valeur au moins doublée",
      "msDoubleDigit": "Croissance annuelle à deux chiffres",
      "asmGrowth": "Croissance",
      "asmGrowthVal": "constante à composition annuelle",
      "asmCash": "Flux",
      "asmCashVal": "aucun apport ni retrait durant la période",
      "asmFigures": "Montants",
      "asmFiguresVal": "avant impôts et frais",
      "decRoi": "Voir le gain total dans la calculatrice ROI",
      "decRule72": "Estimer le doublement avec la règle de 72",
      "decCompound": "Projeter l’avenir à ce même taux",
      "q1": "À combien monterait le capital à ce rythme ?",
      "q2": "Est-ce avant ou après inflation ?",
      "gainWord": "progression",
      "declineWord": "baisse",
      "explanationTpl": "Passer de {start} à {end} en {period} représente un CAGR de {cagr} traduisant cette {dir} globale.",
      "vizTitle": "Trajectoire composée lissée",
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
    "heroLabel": "CAGR (taux annuel composé)",
    "heroNoteTpl": "par an sur {period}",
    "cardGrowth": "Croissance totale",
    "cardDecline": "Baisse totale",
    "cardMultiple": "Multiple",
    "cardDoubles": "Double tous les",
    "insPosTpl": "{total} de hausse sur {period} équivaut à {cagr} par an, moins qu’une simple division à cause de l’effet composé.",
    "insNegTpl": "La valeur a reculé en moyenne de {cagr} par an sur la période.",
    "insShort": "Annualiser une durée inférieure à un an extrapole une courte fenêtre sur toute l’année.",
    "insSmooth": "Le CAGR suppose une croissance régulière; la volatilité intermédiaire est lissée.",
    "msDoubled": "Valeur au moins doublée",
    "msDoubleDigit": "Croissance annuelle à deux chiffres",
    "asmGrowth": "Croissance",
    "asmGrowthVal": "constante à composition annuelle",
    "asmCash": "Flux",
    "asmCashVal": "aucun apport ni retrait durant la période",
    "asmFigures": "Montants",
    "asmFiguresVal": "avant impôts et frais",
    "decRoi": "Voir le gain total dans la calculatrice ROI",
    "decRule72": "Estimer le doublement avec la règle de 72",
    "decCompound": "Projeter l’avenir à ce même taux",
    "q1": "À combien monterait le capital à ce rythme ?",
    "q2": "Est-ce avant ou après inflation ?",
    "gainWord": "progression",
    "declineWord": "baisse",
    "explanationTpl": "Passer de {start} à {end} en {period} représente un CAGR de {cagr} traduisant cette {dir} globale.",
    "vizTitle": "Trajectoire composée lissée",
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
    "start": {
      "label": "Valeur initiale"
    },
    "end": {
      "label": "Valeur finale"
    },
    "years": {
      "label": "Période",
      "unit": "ans"
    }
  }
};
