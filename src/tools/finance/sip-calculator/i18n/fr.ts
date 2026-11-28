import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "sip-calculator",
  "name": "Calculatrice SIP",
  "seoTitle": "Calculatrice SIP: Plan d’Investissement Mensuel",
  "description": "Estimez la valeur finale d’un plan d’investissement mensuel (SIP / DCA), les versements totaux et la plus-value composée sur votre appareil.",
  "tagline": "Valeur future d’un plan mensuel régulier et plus-value.",
  "methodology": {
    "name": "Valeur future d’une annuité",
    "detail": "Chaque mensualité fructifie jusqu’à l’échéance; les premiers versements génèrent l’essentiel des gains."
  },
  "knowledge": {
    "primaryConcepts": [
      "plan d’investissement systématique"
    ],
    "realWorldUseCases": [
      "Planifier un investissement mensuel automatisé en fonds",
      "Estimer le capital issu d’une épargne salariale mensuelle",
      "Comparer plusieurs montants de mensualités pour un projet",
      "Mesurer le gain d’un démarrage précoce"
    ],
    "commonMistakes": [
      "Considérer un taux attendu optimiste comme acquis",
      "Oublier d’ajuster le montant futur à l’inflation"
    ]
  },
  "faqs": [
    {
      "id": "sip-faq-1",
      "question": "Qu’est-ce qu’un plan SIP ?",
      "answer": "Un plan d’investissement systématique (SIP) consiste à verser une somme fixe chaque mois dans un fonds ou un ETF sans chercher à anticiper le marché."
    },
    {
      "id": "sip-faq-2",
      "question": "Comment la valeur finale est-elle calculée ?",
      "answer": "Le simulateur applique la valeur future d’une annuité FV = P · ((1 + i)^n − 1) / i avec versement en fin de mois et capitalisation mensuelle."
    },
    {
      "id": "sip-faq-3",
      "question": "Quel taux de rendement saisir ?",
      "answer": "Retenez une hypothèse prudente adaptée au support (souvent entre 5% et 8% à long terme pour des indices diversifiés)."
    },
    {
      "id": "sip-faq-4",
      "question": "Vaut-il mieux un SIP ou un versement unique ?",
      "answer": "Un capital déjà disponible profite plus longtemps du marché en une fois, tandis que le SIP s’adapte au salaire mensuel et lisse le prix d’entrée."
    },
    {
      "id": "sip-faq-5",
      "question": "Que signifie le lissage de coût (DCA) ?",
      "answer": "En investissant un montant fixe, vous achetez plus de parts quand les prix baissent et moins quand ils montent."
    },
    {
      "id": "sip-faq-6",
      "question": "Pourquoi commencer tôt change tout ?",
      "answer": "Les premiers versements travaillent toute la durée du plan. Gagner cinq ans sur l’horizon surpasse souvent une hausse tardive des mensualités."
    },
    {
      "id": "sip-faq-7",
      "question": "L’inflation ou la fiscalité sont-elles déduites ?",
      "answer": "Non. Le montant est brut avant impôts et inflation; passez-le au simulateur d’inflation pour le pouvoir d’achat réel."
    },
    {
      "id": "sip-faq-8",
      "question": "Mieux vaut investir plus par mois ou plus longtemps ?",
      "answer": "À somme investie égale, une durée plus longue l’emporte largement grâce aux dernières années de capitalisation."
    },
    {
      "id": "sip-faq-9",
      "question": "Pourquoi doubler la durée rapporte bien plus que le double ?",
      "answer": "Parce que la progression composée accélère fortement dans la seconde moitié de l’horizon."
    },
    {
      "id": "sip-faq-10",
      "question": "Pourquoi le gain paraît faible au début ?",
      "answer": "Les premières années reflètent surtout vos versements; l’effet composé prend de l’ampleur sur le moyen et long terme."
    },
    {
      "id": "sip-faq-11",
      "question": "Pourquoi un écart avec mon relevé réel ?",
      "answer": "Un fonds réel subit des variations quotidiennes et des frais de gestion, alors que la formule suppose un rendement lissé."
    },
    {
      "id": "sip-faq-12",
      "question": "Mes données restent-elles privées ?",
      "answer": "Oui. Tout reste sur votre appareil sans transmission serveur."
    }
  ],
  "guide": {
    "title": "Comment un plan SIP fait croître votre épargne",
    "description": "Principe du lissage de coût (DCA), formule mathématique et importance de la durée."
  },
  "ui": {
    "scenarios": {
      "First salary SIP": "Premier salaire",
      "Wealth building": "Patrimoine",
      "Short-term goal": "Objectif 5 ans"
    },
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "heroLabel": "Valeur finale",
      "heroNoteTpl": "après {years} {unit}",
      "cardGain": "Plus-value estimée",
      "cardInvested": "Total versé",
      "cardMonths": "Mensualités",
      "brkLump": "Capital initial",
      "brkMonthly": "Mensualités",
      "brkGrowth": "Croissance",
      "insShareTpl": "La croissance du marché représente {pct}% de la valeur finale; le reste provient de votre épargne.",
      "insAvg": "En versant la même somme chaque mois, vous achetez davantage de parts lorsque les cours baissent (DCA).",
      "msDoubled": "Apports doublés",
      "msExceeds": "Les gains dépassent les apports",
      "asmRate": "Rendement attendu",
      "asmTiming": "Date de versement",
      "asmTimingVal": "fin de mois",
      "asmCompounding": "Capitalisation",
      "asmMonthly": "mensuelle",
      "asmLump": "Capital initial",
      "none": "aucun",
      "decInflation": "Convertir en pouvoir d’achat réel",
      "decCompound": "Comparer avec un versement unique",
      "decGoal": "Trouver la mensualité pour un objectif",
      "q1": "Quelle mensualité faut-il pour un objectif précis ?",
      "q2": "Quel impact si l’on démarre cinq ans plus tôt ?",
      "expLumpTpl": " avec un apport initial de {lump}",
      "explanationTpl": "En plaçant {monthly} par mois{lumpClause} à {rate} par an, le capital atteint {final} en {years} {unit} (versé : {invested}, gain : {gain}).",
      "vizTitle": "Progression du portefeuille",
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
    "heroLabel": "Valeur finale",
    "heroNoteTpl": "après {years} {unit}",
    "cardGain": "Plus-value estimée",
    "cardInvested": "Total versé",
    "cardMonths": "Mensualités",
    "brkLump": "Capital initial",
    "brkMonthly": "Mensualités",
    "brkGrowth": "Croissance",
    "insShareTpl": "La croissance du marché représente {pct}% de la valeur finale; le reste provient de votre épargne.",
    "insAvg": "En versant la même somme chaque mois, vous achetez davantage de parts lorsque les cours baissent (DCA).",
    "msDoubled": "Apports doublés",
    "msExceeds": "Les gains dépassent les apports",
    "asmRate": "Rendement attendu",
    "asmTiming": "Date de versement",
    "asmTimingVal": "fin de mois",
    "asmCompounding": "Capitalisation",
    "asmMonthly": "mensuelle",
    "asmLump": "Capital initial",
    "none": "aucun",
    "decInflation": "Convertir en pouvoir d’achat réel",
    "decCompound": "Comparer avec un versement unique",
    "decGoal": "Trouver la mensualité pour un objectif",
    "q1": "Quelle mensualité faut-il pour un objectif précis ?",
    "q2": "Quel impact si l’on démarre cinq ans plus tôt ?",
    "expLumpTpl": " avec un apport initial de {lump}",
    "explanationTpl": "En plaçant {monthly} par mois{lumpClause} à {rate} par an, le capital atteint {final} en {years} {unit} (versé : {invested}, gain : {gain}).",
    "vizTitle": "Progression du portefeuille",
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
    "monthly": {
      "label": "Versement mensuel"
    },
    "rate": {
      "label": "Rendement annuel attendu"
    },
    "years": {
      "label": "Durée d’investissement",
      "unit": "ans"
    },
    "initial": {
      "label": "Apport initial optionnel",
      "help": "Optionnel. Placé dès le départ en plus des versements mensuels."
    }
  }
};
