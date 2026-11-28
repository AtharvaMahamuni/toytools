import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "compound-interest-calculator",
  "name": "Calculatrice Intérêts Composés",
  "seoTitle": "Calculatrice Intérêts Composés en Ligne",
  "description": "Simulez vos intérêts composés avec capital initial, versements mensuels et fréquence de capitalisation. Tout reste sur votre appareil.",
  "tagline": "Projetez votre épargne avec versements mensuels.",
  "methodology": {
    "name": "Capitalisation périodique",
    "detail": "La valeur future vaut FV = P(1 + r/n)^(n × t), complétée par la capitalisation des versements mensuels."
  },
  "knowledge": {
    "primaryConcepts": [
      "intérêts composés"
    ],
    "realWorldUseCases": [
      "Projeter la croissance d’une épargne ou d’un placement sur plusieurs années",
      "Mesurer l’effet cumulatif de versements mensuels réguliers",
      "Comparer capitalisation mensuelle et annuelle",
      "Estimer un capital retraite ou études"
    ],
    "commonMistakes": [
      "Confondre taux annuel et taux périodique",
      "Considérer un rendement composé boursier comme garanti"
    ]
  },
  "faqs": [
    {
      "id": "ci-faq-1",
      "question": "Qu’est-ce que l’intérêt composé ?",
      "answer": "L’intérêt composé s’applique à la fois au capital initial et aux intérêts déjà acquis lors des périodes précédentes, créant un effet boule de neige sur la durée."
    },
    {
      "id": "ci-faq-2",
      "question": "Comment calculer les intérêts composés ?",
      "answer": "La formule est FV = P(1 + r/n)^(n × t), où P est le capital, r le taux annuel décimal, n la fréquence annuelle et t les années. Par exemple, 10 000 à 7% mensuel sur 20 ans atteignent environ 40 387."
    },
    {
      "id": "ci-faq-3",
      "question": "Quelle différence entre capitalisation mensuelle et annuelle ?",
      "answer": "Plus la capitalisation est fréquente, plus les intérêts génèrent eux-mêmes des intérêts tôt, mais l’écart reste modéré comparé au taux et à la durée."
    },
    {
      "id": "ci-faq-4",
      "question": "Est-ce identique au CAGR (TCAM) ?",
      "answer": "Ils se répondent : l’intérêt composé projette le futur depuis un taux, tandis que le CAGR déduit le taux annuel constant entre une valeur de départ et d’arrivée."
    },
    {
      "id": "ci-faq-5",
      "question": "Peut-on perdre de l’argent avec les intérêts composés ?",
      "answer": "La formule suppose un taux positif régulier, alors que les marchés fluctuent. Retenez une hypothèse prudente : c’est une estimation mathématique."
    },
    {
      "id": "ci-faq-6",
      "question": "Quel est l’impact des versements mensuels ?",
      "answer": "Sur 15 à 30 ans, les versements réguliers finissent souvent par peser bien plus que le capital de départ dans le montant final."
    },
    {
      "id": "ci-faq-7",
      "question": "Les impôts et frais sont-ils déduits ?",
      "answer": "Non. Le résultat est brut de fiscalité, frais de gestion et inflation. Vous pouvez saisir un taux net ou passer le résultat au calculateur d’inflation."
    },
    {
      "id": "ci-faq-8",
      "question": "Combien donnent 1 000 à 5% pendant 10 ans ?",
      "answer": "Environ 1 629 avec capitalisation annuelle et environ 1 647 avec capitalisation mensuelle."
    },
    {
      "id": "ci-faq-9",
      "question": "Mes montants sont-ils envoyés en ligne ?",
      "answer": "Non. Tout est calculé localement dans votre navigateur sans quitter votre appareil."
    }
  ],
  "guide": {
    "title": "Comment fonctionnent les intérêts composés",
    "description": "Formule, rôle de la fréquence de capitalisation et impact des versements réguliers."
  },
  "ui": {
    "scenarios": {
      "Retirement": "Retraite",
      "Child education": "Études",
      "Dream house": "Immobilier"
    },
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "heroLabel": "Montant final",
      "heroNoteTpl": "après {years} {unit}",
      "cardInterest": "Intérêts gagnés",
      "cardPrincipal": "Capital investi",
      "cardContrib": "Versements cumulés",
      "brkPrincipal": "Capital initial",
      "brkContrib": "Versements",
      "brkInterest": "Intérêts",
      "freqs": {
        "1": "annuelle",
        "4": "trimestrielle",
        "12": "mensuelle",
        "365": "quotidienne"
      },
      "insShareTpl": "Les intérêts représentent {pct}% du solde final; le reste correspond à votre épargne versée.",
      "insContrib": "Sur le long terme, l’effet boule de neige des intérêts composés dépasse souvent l’apport de départ.",
      "msDoubled": "Capital doublé",
      "msExceeds": "Les intérêts dépassent les dépôts",
      "asmRate": "Taux annuel",
      "asmCompounding": "Capitalisation",
      "asmContrib": "Versement",
      "moUnit": "mois",
      "none": "aucun",
      "decInflation": "Mesurer l’impact de l’inflation",
      "decRule72": "Estimer le temps pour doubler la mise",
      "decGoal": "Partir d’un objectif d’épargne",
      "q1": "Combien épargner chaque mois pour atteindre une cible ?",
      "q2": "Quelle valeur réelle après inflation ?",
      "expContribTpl": " et {amount} versés par mois",
      "explanationTpl": "En partant de {principal}{contribClause} à {rate} (capitalisation {freq}), le solde atteint {final} après {years} {unit}.",
      "vizTitle": "Évolution du capital dans le temps",
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
    "heroLabel": "Montant final",
    "heroNoteTpl": "après {years} {unit}",
    "cardInterest": "Intérêts gagnés",
    "cardPrincipal": "Capital investi",
    "cardContrib": "Versements cumulés",
    "brkPrincipal": "Capital initial",
    "brkContrib": "Versements",
    "brkInterest": "Intérêts",
    "freqs": {
      "1": "annuelle",
      "4": "trimestrielle",
      "12": "mensuelle",
      "365": "quotidienne"
    },
    "insShareTpl": "Les intérêts représentent {pct}% du solde final; le reste correspond à votre épargne versée.",
    "insContrib": "Sur le long terme, l’effet boule de neige des intérêts composés dépasse souvent l’apport de départ.",
    "msDoubled": "Capital doublé",
    "msExceeds": "Les intérêts dépassent les dépôts",
    "asmRate": "Taux annuel",
    "asmCompounding": "Capitalisation",
    "asmContrib": "Versement",
    "moUnit": "mois",
    "none": "aucun",
    "decInflation": "Mesurer l’impact de l’inflation",
    "decRule72": "Estimer le temps pour doubler la mise",
    "decGoal": "Partir d’un objectif d’épargne",
    "q1": "Combien épargner chaque mois pour atteindre une cible ?",
    "q2": "Quelle valeur réelle après inflation ?",
    "expContribTpl": " et {amount} versés par mois",
    "explanationTpl": "En partant de {principal}{contribClause} à {rate} (capitalisation {freq}), le solde atteint {final} après {years} {unit}.",
    "vizTitle": "Évolution du capital dans le temps",
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
    "principal": {
      "label": "Capital initial"
    },
    "rate": {
      "label": "Taux d’intérêt annuel"
    },
    "frequency": {
      "label": "Fréquence de capitalisation",
      "options": {
        "1": "Annuelle",
        "4": "Trimestrielle",
        "12": "Mensuelle",
        "365": "Quotidienne"
      }
    },
    "years": {
      "label": "Durée (années)",
      "unit": "ans"
    },
    "contribution": {
      "label": "Versement mensuel",
      "help": "Optionnel. Ajouté à la fin de chaque mois."
    }
  }
};
