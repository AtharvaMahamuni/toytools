import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "inflation-calculator",
  "name": "Calculatrice d’Inflation",
  "seoTitle": "Calculatrice d’Inflation: Pouvoir d’Achat Futur",
  "description": "Estimez la valeur réelle de votre épargne après inflation, la perte de pouvoir d’achat et le prix futur équivalent sur votre appareil.",
  "tagline": "Pouvoir d’achat futur et hausse cumulée des prix.",
  "methodology": {
    "name": "Érosion composée",
    "detail": "L’inflation se compose année après année comme un taux d’intérêt, réduisant le pouvoir d’achat de façon géométrique."
  },
  "knowledge": {
    "primaryConcepts": [
      "inflation"
    ],
    "realWorldUseCases": [
      "Évaluer le pouvoir d’achat d’un capital retraite",
      "Calculer la revalorisation salariale nécessaire",
      "Ajuster un objectif financier aux prix futurs",
      "Comparer rendement nominal et rendement réel"
    ],
    "commonMistakes": [
      "Confondre valeur nominale et pouvoir d’achat réel",
      "Sous-estimer l’effet composé de 3% sur 25 ans"
    ]
  },
  "faqs": [
    {
      "id": "inf-faq-1",
      "question": "Que vaudra mon argent après inflation ?",
      "answer": "On divise la somme par (1 + taux)^années. À 3% sur 25 ans, 100 000 gardent l’équivalent d’environ 47 761 de pouvoir d’achat actuel."
    },
    {
      "id": "inf-faq-2",
      "question": "Quelle différence entre valeur réelle et valeur nominale ?",
      "answer": "La valeur nominale correspond aux chiffres affichés; la valeur réelle mesure ce que cette somme permet encore d’acheter en monnaie constante."
    },
    {
      "id": "inf-faq-3",
      "question": "Comment l’inflation touche-t-elle l’épargne liquide ?",
      "answer": "Si un livret rapporte 1% quand les prix montent de 3%, vous perdez environ 2% de pouvoir d’achat par an."
    },
    {
      "id": "inf-faq-4",
      "question": "Comment calculer le prix futur d’un bien ?",
      "answer": "Multipliez le prix actuel par (1 + inflation)^années. À 3% sur 25 ans, 100 000 deviennent environ 209 378."
    },
    {
      "id": "inf-faq-5",
      "question": "Quel taux d’inflation choisir ?",
      "answer": "Les banques centrales visent souvent 2%, tandis que les projections prudentes retiennent entre 2% et 4%."
    },
    {
      "id": "inf-faq-6",
      "question": "Comment se protéger de l’inflation ?",
      "answer": "En visant un rendement net après impôt supérieur au rythme des prix via des actifs diversifiés plutôt que de rester tout en liquidités."
    },
    {
      "id": "inf-faq-7",
      "question": "Pourquoi un faible taux annuel pèse autant ?",
      "answer": "Parce que la hausse des prix se compose année après année et finit par diviser le pouvoir d’achat par plus de deux sur un quart de siècle."
    }
  ],
  "guide": {
    "title": "Comment l’inflation érode votre argent",
    "description": "Exemples chiffrés à 3%, 5% et 7%, rendement réel contre nominal et règle de 72."
  },
  "ui": {
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "heroLabel": "Pouvoir d’achat futur",
      "heroNoteTpl": "en euros constants après {years} {unit}",
      "cardLost": "Perte due à l’inflation",
      "cardLostPct": "Pouvoir d’achat perdu",
      "cardCost": "Coût futur équivalent",
      "insPowerTpl": "L’inflation retire silencieusement environ {pct} du pouvoir d’achat de cette somme sur {years} {unit}.",
      "insImpact": "Même modeste, l’inflation cumulée finit par peser lourd : d’où l’intérêt d’un rendement supérieur.",
      "msHalved": "Pouvoir d’achat divisé par deux",
      "asmRate": "Taux d’inflation",
      "asmPeriod": "Durée",
      "decCompound": "Trouver un placement qui bat l’inflation",
      "decRule72": "Estimer le doublement avec la règle de 72",
      "q1": "Quel rendement faut-il pour compenser l’inflation ?",
      "q2": "Combien épargner de plus ?",
      "explanationTpl": "À {rate} d’inflation par an, {amount} d’aujourd’hui vaudront {real} en pouvoir d’achat actuel dans {years} {unit}, et le même panier coûtera {futureCost}.",
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
    "heroLabel": "Pouvoir d’achat futur",
    "heroNoteTpl": "en euros constants après {years} {unit}",
    "cardLost": "Perte due à l’inflation",
    "cardLostPct": "Pouvoir d’achat perdu",
    "cardCost": "Coût futur équivalent",
    "insPowerTpl": "L’inflation retire silencieusement environ {pct} du pouvoir d’achat de cette somme sur {years} {unit}.",
    "insImpact": "Même modeste, l’inflation cumulée finit par peser lourd : d’où l’intérêt d’un rendement supérieur.",
    "msHalved": "Pouvoir d’achat divisé par deux",
    "asmRate": "Taux d’inflation",
    "asmPeriod": "Durée",
    "decCompound": "Trouver un placement qui bat l’inflation",
    "decRule72": "Estimer le doublement avec la règle de 72",
    "q1": "Quel rendement faut-il pour compenser l’inflation ?",
    "q2": "Combien épargner de plus ?",
    "explanationTpl": "À {rate} d’inflation par an, {amount} d’aujourd’hui vaudront {real} en pouvoir d’achat actuel dans {years} {unit}, et le même panier coûtera {futureCost}.",
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
    "amount": {
      "label": "Montant actuel"
    },
    "rate": {
      "label": "Taux d’inflation annuel"
    },
    "years": {
      "label": "Durée",
      "unit": "ans"
    }
  }
};
