import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur CSV vers JSON",
  "seoTitle": "Convertisseur CSV vers JSON - Outil en ligne gratuit",
  "description": "Convertissez un CSV en tableau JSON d’objets pour API et bases de données, avec détection de types et règles RFC 4180.",
  "tagline": "Transformez un CSV en tableau d’objets JSON avec typage.",
  "lead": "Convertissez vos exports CSV et TSV en tableaux JSON exploitables directement dans votre navigateur tout en protégeant les zéros initiaux.",
  "guide": {
    "title": "Convertisseur CSV vers JSON : guide complet",
    "description": "Découvrez le fonctionnement de la conversion CSV vers JSON, la gestion des types et guillemets RFC 4180, et évitez les erreurs fréquentes."
  },
  "ui": {
    "inputLabel": "Entrée CSV",
    "placeholder": "Collez votre CSV ici",
    "craftNote": "Les zéros en tête et grands entiers des colonnes CSV sont préservés en toute sécurité lors de la sérialisation JSON.",
    "moreAboutHeading": "Fonctionnement du Convertisseur CSV vers JSON",
    "insight": "Transforme des lignes CSV en tableau JSON d’objets en utilisant la première ligne d’en-tête comme clés. Idéal pour préparer des données prêtes pour une API.",
    "technical": [
      {
        "term": "En-tête",
        "detail": "La première ligne fournit les clés des objets"
      },
      {
        "term": "Sortie",
        "detail": "Un tableau d’objets, un par ligne de données"
      },
      {
        "term": "Valeurs",
        "detail": "Chaînes par défaut sauf nombres, booléens ou null avérés"
      }
    ],
    "errInvalidCsv": "CSV invalide.",
    "errNoHeaders": "Aucune ligne d’en-tête trouvée : la première ligne doit lister les noms de colonnes.",
    "errNoRows": "Aucune ligne de données trouvée : ajoutez au moins une ligne sous l’en-tête."
  },
  "knowledge": {
    "summary": "Convertit des fichiers CSV en tableaux JSON d’objets avec détection automatique de types, délimiteurs et guillemets RFC 4180.",
    "useCases": [
      "Convertir un export de tableur en tableau JSON pour une app web",
      "Transformer un export CSV de base de données en charge API",
      "Créer des jeux de test JavaScript à partir d’un CSV",
      "Préparer des données pour des bibliothèques de graphiques",
      "Importer des fichiers TSV tabulés dans un pipeline JSON"
    ],
    "mistakes": [
      "Omettre la ligne d’en-tête contenant les noms de colonnes",
      "Croire que des codes à zéros initiaux restent intacts s’ils sont convertis en nombres",
      "Utiliser la virgule alors que le fichier emploie le point-virgule",
      "Oublier les guillemets autour d’une valeur contenant le séparateur"
    ]
  },
  "faqs": [
    {
      "id": "c2j-faq-1",
      "question": "Quel format CSV le convertisseur attend-il ?",
      "answer": "La première ligne doit contenir les en-têtes de colonnes, suivie d’une ligne par enregistrement. Chaque en-tête devient la clé correspondante dans les objets JSON."
    },
    {
      "id": "c2j-faq-2",
      "question": "Comment fonctionne la détection des types ?",
      "answer": "Les nombres, booléens (true/false) et null sont convertis en types natifs JSON tandis que les autres valeurs restent des chaînes."
    },
    {
      "id": "c2j-faq-3",
      "question": "Pourquoi une valeur comme 007 reste-t-elle en texte ?",
      "answer": "Les codes postaux ou matricules commençant par zéro perdraient leurs zéros en devenant des nombres. Ils restent en chaîne pour éviter toute altération."
    },
    {
      "id": "c2j-faq-4",
      "question": "Comment sont gérés virgules et guillemets dans une cellule ?",
      "answer": "Selon la norme RFC 4180 : les valeurs encadrées de guillemets doubles préservent virgules, retours à la ligne et guillemets doublés (\"\")."
    },
    {
      "id": "c2j-faq-5",
      "question": "Puis-je utiliser un autre séparateur que la virgule ?",
      "answer": "Oui. Virgule, point-virgule (courant sous Excel en français), tabulation et barre verticale sont pris en charge."
    },
    {
      "id": "c2j-faq-6",
      "question": "Que se passe-t-il si une ligne comporte moins de colonnes ?",
      "answer": "Les cellules manquantes en fin de ligne reçoivent une chaîne vide afin que tous les objets du tableau conservent les mêmes clés."
    },
    {
      "id": "c2j-faq-7",
      "question": "Puis-je reconvertir le JSON produit en CSV ?",
      "answer": "Oui. Basculez vers le convertisseur JSON vers CSV pour effectuer le trajet inverse sans ressaisie."
    },
    {
      "id": "c2j-faq-8",
      "question": "Mes tableaux CSV sont-ils envoyés sur un serveur ?",
      "answer": "Non. Le parseur et la sérialisation s’exécutent localement dans votre navigateur ; aucune donnée ne transite sur le réseau."
    }
  ]
};
