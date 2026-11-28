import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur JSON vers CSV",
  "seoTitle": "Convertisseur JSON vers CSV - Exporter vers Excel",
  "description": "Convertissez vos tableaux JSON en fichiers CSV pour Excel et bases de données, avec gestion des objets imbriqués en local.",
  "tagline": "Transformez vos tableaux JSON en CSV proprement.",
  "lead": "Exportez réponses d’API et listes JSON au format CSV prêt pour Excel et Google Sheets sans quitter votre navigateur.",
  "guide": {
    "title": "Convertisseur JSON vers CSV : guide complet",
    "description": "Découvrez la conversion JSON vers CSV, la gestion des champs imbriqués ou clairsemés et les bonnes pratiques d’export."
  },
  "ui": {
    "inputLabel": "Entrée JSON",
    "placeholder": "Collez votre JSON ici",
    "moreAboutHeading": "Fonctionnement du Convertisseur JSON vers CSV",
    "insight": "Transforme un tableau d’objets JSON en lignes CSV en utilisant les clés comme en-têtes. Les structures imbriquées sont sérialisées pour rester dans une cellule.",
    "technical": [
      {
        "term": "Entrée",
        "detail": "Un tableau d’objets aux clés homogènes"
      },
      {
        "term": "En-tête",
        "detail": "Dérivé des clés trouvées dans les objets"
      },
      {
        "term": "Valeurs imbriquées",
        "detail": "Sérialisées dans une cellule unique"
      }
    ],
    "errMustBeArray": "L’entrée doit être un tableau JSON.",
    "errEmptyArray": "Le tableau est vide : rien à convertir."
  },
  "knowledge": {
    "summary": "Convertit des tableaux JSON en CSV pour tableurs et bases de données en échappant virgules et caractères spéciaux.",
    "useCases": [
      "Exporter une réponse API vers Excel pour un rapport client",
      "Importer un jeu de données JSON dans une base SQL en CSV",
      "Analyser des fichiers journaux JSON dans un tableur",
      "Partager des listes structurées sous Google Sheets"
    ],
    "mistakes": [
      "Fournir un objet unique au lieu d’un tableau JSON",
      "Attendre des colonnes hiérarchiques sans aplatir les objets",
      "Oublier les guillemets autour de chaînes contenant des virgules"
    ]
  },
  "faqs": [
    {
      "id": "jtc-faq-1",
      "question": "Quel format d’entrée est attendu ?",
      "answer": "Un tableau JSON d’objets tel que [{\"nom\":\"Alice\",\"age\":30}]. Chaque objet produit une ligne et chaque clé devient une colonne."
    },
    {
      "id": "jtc-faq-2",
      "question": "Comment sont traités les objets imbriqués ?",
      "answer": "Ils sont convertis en notation aplatie ou sérialisés sous forme de texte dans leur cellule afin de préserver la grille bidimensionnelle du CSV."
    },
    {
      "id": "jtc-faq-3",
      "question": "Comment sont gérés les champs absents sur certaines lignes ?",
      "answer": "Le convertisseur réunit toutes les clés présentes dans le tableau ; toute ligne dépourvue d’un champ reçoit une cellule vide à cet endroit."
    },
    {
      "id": "jtc-faq-4",
      "question": "Puis-je ouvrir le résultat dans Excel ou Google Sheets ?",
      "answer": "Oui. Copiez la sortie ou téléchargez le fichier .csv : les deux logiciels reconnaissent la ligne d’en-tête et les guillemets."
    },
    {
      "id": "jtc-faq-5",
      "question": "Pourquoi d’autres outils affichent-ils [object Object] ?",
      "answer": "Cela survient lorsqu’un objet JavaScript n’est pas sérialisé proprement avant d’être écrit dans une cellule."
    },
    {
      "id": "jtc-faq-6",
      "question": "Que se passe-t-il si une valeur contient une virgule ?",
      "answer": "La cellule entière est encadrée de guillemets doubles pour éviter que le tableur ne la coupe en deux colonnes."
    },
    {
      "id": "jtc-faq-7",
      "question": "Mes données JSON sensibles restent-elles confidentielles ?",
      "answer": "Oui. La conversion et l’échappement CSV s’effectuent localement dans votre navigateur sans aucun transfert serveur."
    },
    {
      "id": "jtc-faq-8",
      "question": "Puis-je filtrer les colonnes exportées ?",
      "answer": "Toutes les clés découvertes sont incluses. Supprimez les propriétés superflues dans le JSON ou masquez les colonnes dans votre tableur."
    },
    {
      "id": "jtc-faq-9",
      "question": "Quelle différence entre JSON et CSV ?",
      "answer": "Le JSON modélise des données arborescentes et typées pour les API ; le CSV sert au stockage tabulaire compact pour les tableurs."
    }
  ]
};
