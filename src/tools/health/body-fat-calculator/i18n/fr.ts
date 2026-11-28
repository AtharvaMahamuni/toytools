import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur de masse grasse",
  "seoTitle": "Calculateur Masse Grasse - Méthode US Navy",
  "description": "Estimez votre pourcentage de graisse corporelle avec la méthode US Navy au mètre ruban, plus masse grasse et masse maigre.",
  "tagline": "Taux de masse grasse méthode Navy, plus masse grasse et maigre.",
  "lead": "Calculez votre taux de masse grasse corporelle et votre répartition grasse/maigre dans votre navigateur sans partager aucune mesure.",
  "craft": {
    "solves": "Une mesure au mètre ruban varie de 3 à 4 points selon le serrage : la tendance hebdomadaire est bien plus fiable qu’un chiffre isolé."
  },
  "guide": {
    "title": "Mesurer sa masse grasse au mètre ruban",
    "description": "Comment fonctionne la méthode US Navy, où placer le mètre au cou, à la taille et aux hanches et la différence face à l’IMC."
  },
  "fields": {
    "unit": {
      "label": "Unités",
      "options": {
        "metric": "Métrique (cm, kg)",
        "imperial": "Impérial (in, lb)"
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
      "help": "Centimètres en métrique, pouces en impérial."
    },
    "neck": {
      "label": "Tour de cou",
      "help": "Mesuré juste sous le larynx."
    },
    "waist": {
      "label": "Tour de taille",
      "help": "Hommes au niveau du nombril ; femmes au point le plus fin."
    },
    "hip": {
      "label": "Tour de hanches",
      "help": "Femmes uniquement, au point le plus large (ignoré pour les hommes)."
    },
    "weight": {
      "label": "Poids (optionnel)",
      "help": "Ajoutez-le pour séparer masse grasse et masse maigre."
    }
  },
  "ui": {
    "emptyText": "Indiquez votre taille et vos tours de cou et de taille (plus hanches pour les femmes).",
    "engine": {
      "errEnterTpl": "Saisissez {label} pour calculer.",
      "errNotNumberTpl": "{label} doit être un nombre.",
      "errMinTpl": "{label} ne peut être inférieur à {min}.",
      "errMaxTpl": "{label} ne peut dépasser {max}.",
      "errPositiveTpl": "{label} doit être supérieur à zéro.",
      "fieldUnit": "votre système d’unités",
      "fieldSex": "le sexe pour la formule",
      "fieldHeight": "votre taille",
      "fieldNeck": "votre tour de cou",
      "fieldWaist": "votre tour de taille",
      "fieldHip": "votre tour de hanches",
      "fieldWeight": "votre poids",
      "errWaistNeck": "Le tour de taille doit dépasser le tour de cou.",
      "errWaistHipNeck": "Taille plus hanches doivent dépasser le tour de cou.",
      "errInvalidEst": "Ces mesures ne donnent pas une estimation valide. Vérifiez-les.",
      "heroLabel": "Masse grasse",
      "cardCat": "Catégorie",
      "cardFat": "Masse grasse",
      "cardLean": "Masse maigre",
      "men": "les hommes",
      "women": "les femmes",
      "cats": {
        "essential": "Essentielle",
        "athletes": "Athlètes",
        "fitness": "Fitness",
        "average": "Moyenne",
        "obese": "Au-dessus de la moyenne"
      },
      "insCatTpl": "Votre taux estimé de {bf} % se situe dans la plage ACE « {cat} » pour {sex}.",
      "insTape": "La méthode au ruban a une marge de 3 à 4 points. Mesurez à heure fixe sans serrer la peau et suivez la tendance.",
      "vizTitleTpl": "Votre taux de {bf} % sur l’échelle ACE",
      "vizDescTpl": "Plages ACE pour {sex}. Suivez l’évolution sur plusieurs semaines.",
      "asmMethod": "Méthode",
      "asmMethodVal": "Circonférences U.S. Navy",
      "asmUnits": "Unités",
      "asmMetric": "métrique (cm, kg)",
      "asmImp": "impérial (in, lb)",
      "asmCats": "Catégories",
      "asmCatsVal": "American Council on Exercise",
      "decBmi": "Comparer avec votre IMC",
      "decTdee": "Estimer votre TDEE journalier",
      "decTrack": "Suivre votre poids hebdomadaire",
      "q1": "Quel est un taux de masse grasse sain ?",
      "q2": "Quelle est la précision de la méthode Navy ?",
      "q3": "Différence entre masse grasse et IMC ?",
      "explanation": "La méthode US Navy estime le taux de graisse à partir des tours de cou et taille (et hanches chez la femme) rapportés à la stature, offrant un suivi pratique chez soi avec un mètre ruban."
    }
  },
  "knowledge": {
    "summary": "Estime le taux de masse grasse par la méthode US Navy ainsi que la masse grasse et maigre.",
    "useCases": [
      "Suivre la recomposition corporelle même quand la balance stagne",
      "Vérifier la préservation de la masse maigre pendant une sèche",
      "Compléter un IMC faussé par une forte masse musculaire"
    ],
    "mistakes": [
      "Comprimer la peau ou rentrer le ventre en mesurant",
      "Comparer une prise du matin à une mesure du soir",
      "Attendre la précision d’un scanner DEXA médical"
    ]
  },
  "faqs": [
    {
      "id": "body-fat-calculator-faq-1",
      "question": "Comment fonctionne la méthode US Navy ?",
      "answer": "Elle relie les mesures du cou et de la taille (plus hanches pour les femmes) à la stature via des formules calibrées par pesée hydrostatique."
    },
    {
      "id": "body-fat-calculator-faq-2",
      "question": "Où exactement prendre les mesures ?",
      "answer": "Cou juste sous la pomme d’Adam ; taille au nombril pour l’homme et au creux le plus fin pour la femme ; hanches au point le plus large."
    },
    {
      "id": "body-fat-calculator-faq-3",
      "question": "Est-ce précis ?",
      "answer": "À 3 ou 4 points près d’un examen clinique si la mesure reste régulière chaque semaine."
    },
    {
      "id": "body-fat-calculator-faq-4",
      "question": "Quel pourcentage de masse grasse est sain ?",
      "answer": "Selon l’échelle ACE, la zone fitness se situe autour de 14-17 % chez l’homme et 21-24 % chez la femme."
    },
    {
      "id": "body-fat-calculator-faq-5",
      "question": "En quoi cela diffère-t-il de l’IMC ?",
      "answer": "L’IMC ignore la composition musculaire ; le taux de graisse et la masse maigre distinguent muscle et réserves adipeuses."
    },
    {
      "id": "body-fat-calculator-faq-6",
      "question": "Mes données restent-elles confidentielles ?",
      "answer": "Oui. Tout calcul s’effectue localement dans le navigateur sans aucun transfert ni sauvegarde serveur."
    }
  ]
};
