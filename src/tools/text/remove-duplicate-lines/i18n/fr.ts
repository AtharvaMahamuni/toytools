import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Supprimer les lignes en double",
  "seoTitle": "Supprimer les lignes en double - Dédoublonner en ligne",
  "description": "Supprimez les lignes répétées en conservant la première occurrence et l’ordre initial, directement dans votre navigateur.",
  "tagline": "Supprimez les lignes répétées en gardant la première occurrence.",
  "lead": "Dédoublonnez listes d’e-mails, URL ou journaux en un instant sur votre appareil tout en préservant l’ordre d’origine.",
  "guide": {
    "title": "Comment supprimer les lignes en double d’un texte",
    "description": "Apprenez à dédoublonner une liste sans casser son ordre, gérer la casse et les espaces cachés, et préparer des imports propres."
  },
  "ui": {
    "placeholder": "Collez ici votre liste (une ligne par entrée)",
    "outputPlaceholder": "Les lignes uniques apparaîtront ici",
    "sampleText": "pomme\nbanane\npomme\norange\nbanane",
    "handoff": {
      "trimTpl": "{n} ligne(s) ne diffèrent que par des espaces aux extrémités.",
      "lowerTpl": "{n} ligne(s) ne diffèrent que par la casse (majuscules/minuscules).",
      "siblings": {
        "trim-text": "Rogner les bords",
        "lowercase-converter": "Tout en minuscules"
      }
    }
  },
  "knowledge": {
    "summary": "Ne conserve que la première occurrence de chaque ligne pour dédoublonner listes, logs et exports en gardant l’ordre.",
    "useCases": [
      "Nettoyer une liste d’adresses e-mail ou d’abonnés",
      "Extraire une liste unique d’URL ou d’identifiants",
      "Condenser des messages répétés dans un fichier de log",
      "Construire une liste de mots-clés sans doublons"
    ],
    "mistakes": [
      "Oublier de rogner les espaces en fin de ligne avant le tri",
      "Négliger la sensibilité aux majuscules et minuscules"
    ]
  },
  "faqs": [
    {
      "id": "rdl-faq-1",
      "question": "Comment les doublons sont-ils détectés ?",
      "answer": "Deux lignes sont considérées identiques lorsqu’elles correspondent caractère pour caractère. La première apparition est gardée à sa place et les répétitions suivantes sont supprimées."
    },
    {
      "id": "rdl-faq-2",
      "question": "L’outil ne supprime-t-il que les doublons côte à côte ?",
      "answer": "Non. La détection porte sur l’ensemble du texte, même si des centaines de lignes séparent deux occurrences."
    },
    {
      "id": "rdl-faq-3",
      "question": "La comparaison tient-elle compte des majuscules ?",
      "answer": "Oui, elle est exacte : \"Pomme\" et \"pomme\" restent distincts. Passez d’abord la liste en minuscules si vous voulez fusionner les variantes de casse."
    },
    {
      "id": "rdl-faq-4",
      "question": "Les espaces en début ou fin de ligne comptent-ils ?",
      "answer": "Oui. \"  pomme\" et \"pomme\" diffèrent à cause des espaces. Rognez d’abord les extrémités pour fusionner ces lignes."
    },
    {
      "id": "rdl-faq-5",
      "question": "Comment retirer les e-mails en double d’une liste ?",
      "answer": "Collez les adresses à raison d’une par ligne ; chaque adresse unique reste une seule fois. Convertissez d’abord en minuscules afin de réunir \"Contact@...\" et \"contact@...\"."
    },
    {
      "id": "rdl-faq-6",
      "question": "Comment extraire les lignes uniques d’un journal de log ?",
      "answer": "Collez le log et chaque erreur distincte n’apparaît plus qu’une fois. Si chaque ligne comporte un horodatage différent, retirez d’abord l’horodatage."
    },
    {
      "id": "rdl-faq-7",
      "question": "Quelle différence avec la suppression des lignes vides ?",
      "answer": "Supprimer les doublons élimine les contenus répétés ; supprimer les lignes vides retire toutes les lignes vides. Ici, plusieurs lignes vides deviennent une seule ligne vide."
    },
    {
      "id": "rdl-faq-8",
      "question": "Pourquoi l’ordre semble-t-il décalé après nettoyage ?",
      "answer": "L’ordre des premières occurrences ne change jamais ; seuls les doublons suivants disparaissent, faisant remonter les lignes situées dessous."
    },
    {
      "id": "rdl-faq-9",
      "question": "Est-il sûr d’y coller une base de contacts confidentielle ?",
      "answer": "Oui. Le dédoublonnage tourne entièrement dans votre navigateur sans aucune requête réseau ni stockage distant."
    }
  ]
};
