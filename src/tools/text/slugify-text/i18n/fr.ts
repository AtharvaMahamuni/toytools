import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "slugify-text",
  "name": "Générateur de Slugs URL",
  "seoTitle": "Générateur de Slugs URL Propres en Ligne",
  "description": "Transformez vos titres en slugs URL propres en minuscules, sans accents et reliés par des tirets, ligne par ligne dans le navigateur.",
  "tagline": "Slugs URL propres en minuscules et sans accents.",
  "knowledge": {
    "primaryConcepts": [
      "slug URL (slugify)"
    ],
    "realWorldUseCases": [
      "Générer des permaliens d’articles propres",
      "Créer des identifiants d’ancres HTML",
      "Produire des noms de fichiers sûrs pour le Web",
      "Traiter par lots des titres pour un CMS"
    ],
    "commonMistakes": [
      "Attendre le maintien des accents ou majuscules",
      "Confondre slugify avec le kebab-case"
    ]
  },
  "faqs": [
    {
      "id": "slugify-text-faq-1",
      "question": "Qu’est-ce qu’un slug URL ?",
      "answer": "La partie lisible d’une adresse Web identifiant une page, en minuscules et séparée par des tirets."
    },
    {
      "id": "slugify-text-faq-2",
      "question": "Comment sont gérés accents et symboles ?",
      "answer": "Les accents sont ramenés à leur lettre ASCII (« Café » → « cafe »), ß devient ss, et les séries d’espaces ou ponctuations deviennent un tiret unique."
    },
    {
      "id": "slugify-text-faq-3",
      "question": "Puis-je convertir toute une liste en une fois ?",
      "answer": "Oui, chaque ligne est transformée indépendamment."
    },
    {
      "id": "slugify-text-faq-4",
      "question": "Qu’est-ce qu’un bon slug SEO ?",
      "answer": "Court, en minuscules, avec des mots-clés séparés par des tirets sans mots vides superflus."
    },
    {
      "id": "slugify-text-faq-5",
      "question": "Différence entre slugify et kebab-case ?",
      "answer": "Slugify supprime les accents vers l’ASCII pour le Web; kebab-case relie les mots par tirets tout en gardant les accents."
    },
    {
      "id": "slugify-text-faq-6",
      "question": "Le slug est-il tout le chemin URL ?",
      "answer": "Non, seulement le dernier segment après le dernier slash."
    },
    {
      "id": "slugify-text-faq-7",
      "question": "Garde-t-il les caractères accentués ?",
      "answer": "Non, afin d’éviter des URL encodées illisibles de type %C3%A9."
    },
    {
      "id": "slugify-text-faq-8",
      "question": "Pourquoi tout mettre en minuscules ?",
      "answer": "Car les serveurs Web distinguent souvent la casse, ce qui risquerait de dupliquer les URLs."
    },
    {
      "id": "slugify-text-faq-9",
      "question": "Mes titres restent-ils confidentiels ?",
      "answer": "Oui, tout se traite localement dans votre navigateur."
    }
  ],
  "guide": {
    "title": "Comment transformer un texte en slug URL",
    "description": "Règles de suppression des accents pour le SEO et différence entre slugify et kebab-case."
  },
  "ui": {
    "placeholder": "Collez un titre ou une liste ici",
    "outputPlaceholder": "Vos slugs URL apparaîtront ici",
    "sampleText": "Recette de Crème Brûlée : 10 Astuces 2026",
    "handoff": {
      "msgTpl": "{n} ligne(s) dépourvue(s) de lettres latines ou chiffres ont donné un slug vide.",
      "siblings": {
        "sentence-case-converter": "Casse de phrase",
        "kebab-case-converter": "Kebab-case",
        "trim-text": "Rogner les espaces",
        "lowercase-converter": "Minuscules"
      }
    }
  }
};
