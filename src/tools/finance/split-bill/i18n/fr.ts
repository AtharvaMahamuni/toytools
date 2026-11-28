import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "split-bill",
  "name": "Partager l’Addition",
  "seoTitle": "Partager l’Addition Exactement avec Pourboire",
  "description": "Divisez une note de restaurant et un pourboire optionnel entre 2 et 30 convives en attribuant le centime restant pour tomber juste.",
  "tagline": "Partager une addition et son pourboire au centime près.",
  "methodology": {
    "name": "Répartition exacte des restes",
    "detail": "Attribue une part de base identique à chacun et ajoute les centimes/paise restants à la dernière personne."
  },
  "knowledge": {
    "primaryConcepts": [
      "partager addition"
    ],
    "realWorldUseCases": [
      "Partager une addition de restaurant avec pourboire entre amis"
    ],
    "commonMistakes": [
      "Arrondir chaque part isolément et perdre la somme totale",
      "Confondre avec un outil de frais bancaires"
    ]
  },
  "faqs": [
    {
      "id": "bill-faq-1",
      "question": "Qu’est-ce que Partager l’Addition ?",
      "answer": "L’outil divise une note et un pourboire optionnel (0 à 30%) entre 2 et 30 personnes avec somme exacte garantie."
    },
    {
      "id": "bill-faq-2",
      "question": "Comment fonctionne le reliquat ?",
      "answer": "Le calcul s’effectue en centièmes; chacun reçoit la part de base et la dernière personne ajoute le reste indivisible."
    },
    {
      "id": "bill-faq-3",
      "question": "Que donne 1000 avec 10% pour 3 personnes ?",
      "answer": "Total 1100 : deux paient 366,66 et la dernière 366,68, soit exactement 1100."
    },
    {
      "id": "bill-faq-4",
      "question": "Et si la division tombe juste ?",
      "answer": "Chacun paie exactement le même montant sans reliquat."
    },
    {
      "id": "bill-faq-5",
      "question": "Quels pourboires sont acceptés ?",
      "answer": "Tout entier de 0 à 30% (vide = aucun pourboire)."
    },
    {
      "id": "bill-faq-6",
      "question": "Combien de participants ?",
      "answer": "De 2 à 30 personnes en nombre entier."
    },
    {
      "id": "bill-faq-7",
      "question": "Des comptes amis sont-ils conservés ?",
      "answer": "Non, aucune sauvegarde ni liste de contacts."
    },
    {
      "id": "bill-faq-8",
      "question": "Est-ce un outil de frais bancaires ?",
      "answer": "Non, uniquement pour partager une note de table."
    },
    {
      "id": "bill-faq-9",
      "question": "Mes montants sont-ils envoyés ?",
      "answer": "Non, rien ne quitte votre onglet."
    },
    {
      "id": "bill-faq-10",
      "question": "Partager l’Addition vs calculateur de pourboire",
      "answer": "Le calculateur de pourboire s’arrête au total; celui-ci attribue en plus la part exacte de chacun."
    }
  ],
  "guide": {
    "title": "Comment partager une addition sans erreur d’arrondi",
    "description": "Gestion du reliquat indivisible, règles du pourboire optionnel et comparaison avec le calculateur de pourboire."
  },
  "ui": {
    "engine": {
      "billNote1": "Si le total ne tombe pas juste, la dernière personne prend le reliquat pour que l’addition corresponde exactement.",
      "billNote2": "Partage de table sans compte ni suivi; vos montants restent sur votre appareil.",
      "heroLabel": "Total avec pourboire",
      "eachLineTpl": "Chaque personne paie {each}.",
      "noteEvenTpl": "{n} personnes. {eachLine}",
      "noteOddTpl": "{n} personnes. {eachLine} La dernière personne paie {last}.",
      "insEven": "Toutes les parts sont strictement égales.",
      "insOdd": "La dernière personne règle le léger reliquat indivisible.",
      "msSum": "Les parts totalisent exactement la note",
      "asmTip": "Pourboire",
      "noTip": "Aucun pourboire",
      "asmPeople": "Convives",
      "asmRem": "Reliquat en sous-unités",
      "decTip": "Calculer un pourboire seul",
      "errBillEmpty": "Saisissez le montant de l’addition.",
      "errBillNaN": "Le montant doit être un nombre.",
      "errBillPos": "Le total doit être supérieur à zéro.",
      "errBillDec": "Saisissez deux décimales au maximum.",
      "errBillCap": "Ce montant dépasse le plafond de la page.",
      "errPeopleEmpty": "Indiquez un nombre de personnes entre 2 et 30.",
      "errPeopleNaN": "Le nombre de personnes doit être numérique.",
      "errPeopleInt": "Le nombre de convives doit être entier.",
      "errPeopleRange": "Choisissez entre 2 et 30 personnes.",
      "errTipNaN": "Le pourboire doit être un nombre.",
      "errTipRange": "Le pourboire doit aller de 0 à 30%.",
      "errTipInt": "Le pourboire doit être un nombre entier.",
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
    "billNote1": "Si le total ne tombe pas juste, la dernière personne prend le reliquat pour que l’addition corresponde exactement.",
    "billNote2": "Partage de table sans compte ni suivi; vos montants restent sur votre appareil.",
    "heroLabel": "Total avec pourboire",
    "eachLineTpl": "Chaque personne paie {each}.",
    "noteEvenTpl": "{n} personnes. {eachLine}",
    "noteOddTpl": "{n} personnes. {eachLine} La dernière personne paie {last}.",
    "insEven": "Toutes les parts sont strictement égales.",
    "insOdd": "La dernière personne règle le léger reliquat indivisible.",
    "msSum": "Les parts totalisent exactement la note",
    "asmTip": "Pourboire",
    "noTip": "Aucun pourboire",
    "asmPeople": "Convives",
    "asmRem": "Reliquat en sous-unités",
    "decTip": "Calculer un pourboire seul",
    "errBillEmpty": "Saisissez le montant de l’addition.",
    "errBillNaN": "Le montant doit être un nombre.",
    "errBillPos": "Le total doit être supérieur à zéro.",
    "errBillDec": "Saisissez deux décimales au maximum.",
    "errBillCap": "Ce montant dépasse le plafond de la page.",
    "errPeopleEmpty": "Indiquez un nombre de personnes entre 2 et 30.",
    "errPeopleNaN": "Le nombre de personnes doit être numérique.",
    "errPeopleInt": "Le nombre de convives doit être entier.",
    "errPeopleRange": "Choisissez entre 2 et 30 personnes.",
    "errTipNaN": "Le pourboire doit être un nombre.",
    "errTipRange": "Le pourboire doit aller de 0 à 30%.",
    "errTipInt": "Le pourboire doit être un nombre entier.",
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
    "bill": {
      "label": "Total de l’addition",
      "help": "Jusqu’à deux décimales. Outil de partage de dîner, hors frais bancaires."
    },
    "people": {
      "label": "Personnes",
      "unit": "personnes",
      "help": "Entre 2 et 30 convives."
    },
    "tip": {
      "label": "Pourboire (%)",
      "help": "Optionnel, entier de 0 à 30. Vide = sans pourboire."
    }
  }
};
