import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "loan-calculator",
  "name": "Simulateur de Prêt",
  "seoTitle": "Simulateur de Prêt & Mensualités en Ligne",
  "description": "Calculez votre mensualité de crédit immobilier ou conso, le coût total des intérêts et l’économie des remboursements anticipés.",
  "tagline": "Mensualité fixe, intérêts totaux et économie sur capital.",
  "methodology": {
    "name": "Amortissement à taux fixe",
    "detail": "Le taux annuel est divisé par 12 pour fixer des échéances constantes; tout versement supplémentaire réduit le capital."
  },
  "knowledge": {
    "primaryConcepts": [
      "simulateur de prêt",
      "mensualité"
    ],
    "realWorldUseCases": [
      "Vérifier la mensualité d’un crédit personnel avant signature",
      "Comparer un prêt immobilier sur 20 ans ou 30 ans",
      "Évaluer les intérêts gagnés par remboursement anticipé mensuel",
      "Isoler le capital emprunté après apport initial"
    ],
    "commonMistakes": [
      "Saisir un taux mensuel de 2 dans le champ annuel",
      "Confondre années et mois dans la durée",
      "Croire qu’un versement anticipé réduit l’échéance suivante"
    ]
  },
  "faqs": [
    {
      "id": "loan-faq-payment",
      "question": "Comment est calculée la mensualité d’un prêt ?",
      "answer": "Le taux annuel est divisé par 12 pour fixer l’échéance constante sur la durée totale. Par exemple, 100 000 à 12% sur 5 ans donnent 2 224,44 par mois et 33 466,83 d’intérêts."
    },
    {
      "id": "loan-faq-rate-unit",
      "question": "Que signifie saisir 2% dans le champ taux ?",
      "answer": "C’est toujours un taux annuel (2% mensuel ferait 24% par an). Sous 3% ou au-dessus de 36%, un avertissement rappelle l’équivalent annuel/mensuel."
    },
    {
      "id": "loan-faq-extra",
      "question": "Un remboursement anticipé mensuel réduit-il les intérêts ?",
      "answer": "Oui. Ce supplément vient en déduction directe du capital restant dû, réduisant la durée et le coût total des intérêts."
    },
    {
      "id": "loan-faq-home",
      "question": "Un prêt immobilier suit-il la même formule ?",
      "answer": "Exactement. Saisissez le prix du bien, l’apport initial et la durée en années pour connaître l’échéance hors assurance."
    },
    {
      "id": "loan-faq-left-out",
      "question": "Assurance emprunteur et frais de dossier sont-ils inclus ?",
      "answer": "Non. Le simulateur calcule uniquement le capital et les intérêts à taux fixe hors assurance et taxes."
    },
    {
      "id": "loan-faq-high-rate",
      "question": "Pourquoi la dette ne diminue-t-elle pas avec un taux extrême ?",
      "answer": "Lorsque les intérêts mensuels absorbent toute l’échéance, le capital ne s’amortit plus. Réduisez le taux ou ajoutez un complément."
    },
    {
      "id": "loan-faq-privacy",
      "question": "Mes informations sont-elles transmises ?",
      "answer": "Non. Tout reste strictement dans votre navigateur."
    }
  ],
  "guide": {
    "title": "Comment fonctionne la mensualité d’un prêt",
    "description": "Formule de mensualité constante, apport personnel et impact d’un remboursement anticipé mensuel."
  },
  "ui": {
    "scenarios": {
      "Personal loan": "Prêt perso",
      "Home loan, 15 years": "Immo 15 ans",
      "Home loan, 20 years": "Immo 20 ans",
      "Home loan, 30 years": "Immo 30 ans"
    },
    "engine": {
      "yearOne": "an",
      "yearMany": "ans",
      "monthOne": "mois",
      "monthMany": "mois",
      "none": "aucun",
      "yearlyRateToken": "est un taux annuel",
      "noteLowRateTpl": "{rate} est un taux annuel. {rate} par mois équivaudrait à {annualized} par an, ce que ce calcul n’applique pas.",
      "noteHighRateTpl": "{rate} est un taux annuel, soit environ {monthly} par mois. La mensualité utilise le taux annuel.",
      "errShortTerm": "La durée minimale est d’un mois (saisissez 0.08 pour 1 mois ou 0.5 pour 6).",
      "errNoBorrow": "Avec cet apport, il ne reste rien à emprunter.",
      "errUnpaid": "Ce taux et cette durée ne permettent jamais d’amortir le prêt. Baissez le taux ou ajoutez un complément.",
      "underTpl": "Moins de {amt}",
      "heroLabel": "Mensualité",
      "cardBorrowed": "Capital emprunté",
      "cardInterest": "Coût des intérêts",
      "cardTotal": "Coût total",
      "cardPayoff": "Durée finale",
      "cardSaved": "Intérêts économisés",
      "insExtraTpl": "Ajouter {extra} par mois solde le crédit en {payoff} et économise {saved} d’intérêts.",
      "insZero": "À taux nul, le capital est réparti en mensualités égales sans intérêts.",
      "insShareTpl": "Les intérêts représentent {pct}% du montant total remboursé.",
      "insTiny": "Les intérêts sur ce montant sont inférieurs à un demi-centime.",
      "msPaid": "Prêt remboursé",
      "msShortened": "Complément mensuel réduisant la durée",
      "asmRate": "Taux annuel",
      "asmSchedule": "Échéancier",
      "asmScheduleVal": "Mensuel (taux annuel divisé par 12).",
      "asmDown": "Apport",
      "asmExtra": "Mensualité extra",
      "asmExtraTpl": "{extra} / mois déduits du capital",
      "brkPrincipal": "Capital",
      "brkInterest": "Intérêts",
      "decSip": "Simuler le placement de cette même mensualité",
      "decCompound": "Comparer avec les intérêts composés d’un capital",
      "q1": "Combien de mois gagnés avec un remboursement anticipé ?",
      "q2": "Que vaudrait cette mensualité investie en bourse ?",
      "expShortTpl": " Avec {extra} en plus chaque mois, le prêt s’achève en {payoff}.",
      "explanationTpl": "Emprunter {principal} à {rate} par an sur {term} demande {payment} par mois, pour {interest} d’intérêts.{shortened}",
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
    "monthOne": "mois",
    "monthMany": "mois",
    "none": "aucun",
    "yearlyRateToken": "est un taux annuel",
    "noteLowRateTpl": "{rate} est un taux annuel. {rate} par mois équivaudrait à {annualized} par an, ce que ce calcul n’applique pas.",
    "noteHighRateTpl": "{rate} est un taux annuel, soit environ {monthly} par mois. La mensualité utilise le taux annuel.",
    "errShortTerm": "La durée minimale est d’un mois (saisissez 0.08 pour 1 mois ou 0.5 pour 6).",
    "errNoBorrow": "Avec cet apport, il ne reste rien à emprunter.",
    "errUnpaid": "Ce taux et cette durée ne permettent jamais d’amortir le prêt. Baissez le taux ou ajoutez un complément.",
    "underTpl": "Moins de {amt}",
    "heroLabel": "Mensualité",
    "cardBorrowed": "Capital emprunté",
    "cardInterest": "Coût des intérêts",
    "cardTotal": "Coût total",
    "cardPayoff": "Durée finale",
    "cardSaved": "Intérêts économisés",
    "insExtraTpl": "Ajouter {extra} par mois solde le crédit en {payoff} et économise {saved} d’intérêts.",
    "insZero": "À taux nul, le capital est réparti en mensualités égales sans intérêts.",
    "insShareTpl": "Les intérêts représentent {pct}% du montant total remboursé.",
    "insTiny": "Les intérêts sur ce montant sont inférieurs à un demi-centime.",
    "msPaid": "Prêt remboursé",
    "msShortened": "Complément mensuel réduisant la durée",
    "asmRate": "Taux annuel",
    "asmSchedule": "Échéancier",
    "asmScheduleVal": "Mensuel (taux annuel divisé par 12).",
    "asmDown": "Apport",
    "asmExtra": "Mensualité extra",
    "asmExtraTpl": "{extra} / mois déduits du capital",
    "brkPrincipal": "Capital",
    "brkInterest": "Intérêts",
    "decSip": "Simuler le placement de cette même mensualité",
    "decCompound": "Comparer avec les intérêts composés d’un capital",
    "q1": "Combien de mois gagnés avec un remboursement anticipé ?",
    "q2": "Que vaudrait cette mensualité investie en bourse ?",
    "expShortTpl": " Avec {extra} en plus chaque mois, le prêt s’achève en {payoff}.",
    "explanationTpl": "Emprunter {principal} à {rate} par an sur {term} demande {payment} par mois, pour {interest} d’intérêts.{shortened}",
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
    "price": {
      "label": "Prix ou montant emprunté"
    },
    "down": {
      "label": "Apport personnel",
      "help": "Optionnel. Déduit du montant financé."
    },
    "rate": {
      "label": "Taux d’intérêt annuel"
    },
    "years": {
      "label": "Durée",
      "unit": "ans",
      "help": "Pour moins d’un an, utilisez une fraction (0.5 pour 6 mois)."
    },
    "extra": {
      "label": "Remboursement anticipé / mois",
      "help": "Optionnel. Ajouté à l’échéance pour réduire le capital."
    }
  }
};
