import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "title-case-converter",
  "name": "Convertisseur Casse Titre",
  "seoTitle": "Convertir un Texte en Casse Titre (Title Case)",
  "description": "Mettez en majuscule la première lettre de chaque mot pour vos titres et en-têtes en un clic sur votre appareil.",
  "tagline": "Mettez une majuscule à l’initiale de chaque mot.",
  "knowledge": {
    "primaryConcepts": [
      "casse titre (title case)"
    ],
    "realWorldUseCases": [
      "Mettre en forme des titres d’articles ou présentations",
      "Harmoniser des titres d’ouvrages ou vidéos",
      "Uniformiser des menus et en-têtes",
      "Corriger des titres saisis en minuscules"
    ],
    "commonMistakes": [
      "Appliquer la casse titre à des paragraphes entiers",
      "Oublier d’abaisser articles et prépositions selon son guide stylistique"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "Qu’est-ce que le Title Case ?",
      "answer": "Le Title Case met en majuscule l’initiale de chaque mot, utilisé pour les titres en anglais et certains en-têtes."
    },
    {
      "id": "tc-faq-2",
      "question": "Quels mots capitaliser dans un titre ?",
      "answer": "L’outil met une majuscule à chaque mot comme base rapide; selon les guides anglophones AP/Chicago, articles et prépositions courts peuvent ensuite être remis en minuscules."
    },
    {
      "id": "tc-faq-3",
      "question": "Différence avec la casse de phrase ?",
      "answer": "La casse de phrase ne met une majuscule qu’au premier mot et aux noms propres, contrairement au Title Case."
    },
    {
      "id": "tc-faq-4",
      "question": "Faut-il l’utiliser dans le corps d’un article ?",
      "answer": "Non, cela alourdit la lecture de longs paragraphes."
    },
    {
      "id": "tc-faq-5",
      "question": "Chiffres et ponctuation changent-ils ?",
      "answer": "Non, seule la première lettre de chaque mot est affectée."
    },
    {
      "id": "tc-faq-6",
      "question": "Comment convertir un titre d’article ?",
      "answer": "Collez-le et copiez le résultat instantané."
    },
    {
      "id": "tc-faq-7",
      "question": "Faut-il capitaliser « of » ou « the » ?",
      "answer": "Au milieu d’un titre anglais, AP et Chicago les laissent en minuscules."
    },
    {
      "id": "tc-faq-8",
      "question": "Pourquoi les petits mots ont-ils une majuscule ici ?",
      "answer": "Le convertisseur applique une règle uniforme simple et signale combien de mots courts méritent vérification."
    },
    {
      "id": "tc-faq-9",
      "question": "Comment sont gérés les mots à trait d’union ?",
      "answer": "Chaque composante après un tiret reçoit une majuscule initiale (« Well-Known »)."
    }
  ],
  "guide": {
    "title": "Comment mettre un texte en Title Case",
    "description": "Différence entre Title Case et casse de phrase, mots courts en anglais et mots composés."
  },
  "ui": {
    "placeholder": "Collez votre titre ou texte ici",
    "outputPlaceholder": "Le résultat en casse titre apparaîtra ici",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "{n} mot(s) court(s) ont aussi reçu une majuscule alors que les guides Chicago et AP les laissent en minuscules.",
      "siblings": {
        "sentence-case-converter": "Casse de phrase",
        "kebab-case-converter": "Kebab-case",
        "trim-text": "Rogner les espaces",
        "lowercase-converter": "Minuscules"
      }
    }
  }
};
