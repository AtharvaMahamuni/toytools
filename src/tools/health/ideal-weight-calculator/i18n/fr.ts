import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur de poids idéal",
  "seoTitle": "Calculateur Poids Idéal - Formules Devine & Plage IMC",
  "description": "Estimez votre poids idéal selon la taille et le sexe avec Devine, Robinson, Miller et Hamwi, plus la zone saine d’IMC.",
  "tagline": "Poids idéal via quatre formules classiques et fourchette IMC saine.",
  "lead": "Comparez les quatre formules médicales historiques (Devine, Robinson, Miller, Hamwi) avec l’intervalle sain moderne de l’IMC dans votre navigateur.",
  "craft": {
    "solves": "Chaque formule renvoie un chiffre isolé ignorant ossature et muscles ; afficher en parallèle la fourchette IMC évite un objectif rigide."
  },
  "guide": {
    "title": "Comprendre les formules de poids idéal et la zone IMC",
    "description": "Comment fonctionnent Devine, Robinson, Miller et Hamwi, pourquoi elles divergent et comment choisir une zone cible réaliste."
  },
  "fields": {
    "unit": {
      "label": "Unités",
      "options": {
        "metric": "Métrique (cm)",
        "imperial": "Impérial (in)"
      }
    },
    "sex": {
      "label": "Sexe",
      "options": {
        "male": "Homme",
        "female": "Femme"
      }
    },
    "height": {
      "label": "Taille",
      "help": "Centimètres en métrique, pouces au total en impérial."
    }
  },
  "ui": {
    "emptyText": "Choisissez les unités, le sexe et votre taille pour calculer le poids idéal et la plage saine.",
    "engine": {
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errMinTpl": "{label} ne peut être inférieur à {min}.",
      "errMaxTpl": "{label} ne peut dépasser {max}.",
      "fieldUnit": "votre système d’unités",
      "fieldSex": "le sexe pour les formules",
      "fieldHeight": "votre taille",
      "errHeightZero": "Indiquez une taille supérieure à zéro.",
      "heroLabel": "Poids idéal",
      "heroNote": "moyenne des quatre formules",
      "cardHealthy": "Zone saine (IMC)",
      "cardDevine": "Formule de Devine",
      "cardRobinson": "Formule de Robinson",
      "cardMiller": "Formule de Miller",
      "cardHamwi": "Formule de Hamwi",
      "bandBelow": "En dessous",
      "bandHealthy": "Zone saine",
      "bandAbove": "Au-dessus",
      "insSpreadTpl": "Les quatre formules s’étalent de {lo} à {hi}, avec une moyenne de {avg}.",
      "insBandTpl": "Pour votre taille, la fourchette saine d’IMC (18,5 à 24,9) couvre {range}.",
      "insAnchor": "Ces formules n’utilisent que taille et sexe, sans tenir compte de la carrure ni du muscle : prenez-les comme repère.",
      "vizTitleTpl": "Votre poids idéal face à la zone saine en {unit}",
      "vizDescTpl": "Les quatre formules couvrent {fRange}, au cœur de la plage IMC {bRange}.",
      "vizHighlight": "les quatre formules",
      "asmUnits": "Unités",
      "asmMetric": "métrique (cm)",
      "asmImp": "impérial (in)",
      "asmFormulas": "Formules",
      "asmHealthy": "Zone saine",
      "asmHealthyVal": "IMC 18,5 à 24,9",
      "decBmi": "Calculer votre IMC actuel",
      "decBf": "Estimer votre masse grasse",
      "decTrack": "Suivre votre poids hebdomadaire",
      "q1": "Combien devrais-je peser pour ma taille ?",
      "q2": "Poids idéal et poids sain sont-ils identiques ?",
      "q3": "Pourquoi les formules donnent-elles des valeurs différentes ?",
      "explanation": "Devine, Robinson, Miller et Hamwi ont été conçues il y a plusieurs décennies pour le dosage médical selon la taille et le sexe. Associées à la zone saine d’IMC, elles offrent un repère central réaliste."
    }
  },
  "knowledge": {
    "summary": "Calcule le poids idéal par taille et sexe via Devine, Robinson, Miller et Hamwi avec la fourchette d’IMC saine.",
    "useCases": [
      "Situer une plage de poids cohérente pour votre stature",
      "Comparer les quatre équations médicales classiques côte à côte",
      "Fixer un objectif pondéral réaliste avec un calcul de masse grasse"
    ],
    "mistakes": [
      "Prendre un résultat unique au dixième près comme vérité absolue",
      "Oublier le rôle de l’ossature et de la musculature"
    ]
  },
  "faqs": [
    {
      "id": "ideal-weight-calculator-faq-1",
      "question": "Quel poids devrais-je faire pour ma taille ?",
      "answer": "Aucun chiffre unique ne fait autorité : cet outil présente la moyenne des quatre formules classiques ainsi que la plage saine complète d’IMC."
    },
    {
      "id": "ideal-weight-calculator-faq-2",
      "question": "Pourquoi les formules donnent-elles des réponses différentes ?",
      "answer": "Chacune a été ajustée sur des données différentes avec une base distincte à 5 pieds ; Hamwi tend vers le haut de la fourchette et Miller vers le bas."
    },
    {
      "id": "ideal-weight-calculator-faq-3",
      "question": "Le poids idéal est-il synonyme de poids sain ?",
      "answer": "Pas tout à fait : les formules visaient des dosages cliniques, alors que la santé correspond mieux à un intervalle (IMC 18,5–24,9)."
    },
    {
      "id": "ideal-weight-calculator-faq-4",
      "question": "Ces formules tiennent-elles compte des muscles ?",
      "answer": "Non, seulement du sexe et de la taille. Un athlète musclé peut dépasser le repère tout en restant très sec."
    },
    {
      "id": "ideal-weight-calculator-faq-5",
      "question": "Comment m’en servir pour fixer un objectif ?",
      "answer": "Visez une zone confortable dans l’intervalle IMC sain et suivez la moyenne hebdomadaire plutôt qu’une valeur fixe."
    }
  ]
};
