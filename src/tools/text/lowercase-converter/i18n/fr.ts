import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "lowercase-converter",
  "name": "Convertisseur Minuscules",
  "seoTitle": "Convertir un Texte en Minuscules en Ligne",
  "description": "Convertissez tout texte en minuscules instantanément dans votre navigateur pour normaliser e-mails, tags et chaînes.",
  "tagline": "Convertissez tout texte en minuscules instantanément.",
  "knowledge": {
    "primaryConcepts": [
      "minuscules"
    ],
    "realWorldUseCases": [
      "Normaliser les adresses e-mail avant stockage",
      "Uniformiser des tags pour supprimer les doublons",
      "Préparer des comparaisons de chaînes fiables",
      "Corriger un texte saisi par erreur en Verr. Maj"
    ],
    "commonMistakes": [
      "Aplatir des noms propres ou acronymes techniques utiles",
      "Ne passer en minuscules qu’un seul côté d’une comparaison"
    ]
  },
  "faqs": [
    {
      "id": "lc-faq-1",
      "question": "Comment convertir en minuscules ?",
      "answer": "Collez votre texte à gauche ; le résultat tout en minuscules s’affiche aussitôt à droite prêt à être copié."
    },
    {
      "id": "lc-faq-2",
      "question": "Où les minuscules sont-elles nécessaires ?",
      "answer": "Pour les adresses e-mail, slugs URL, hashtags, identifiants et normalisations avant comparaison."
    },
    {
      "id": "lc-faq-3",
      "question": "Comment normaliser des adresses e-mail ?",
      "answer": "Passez toute la liste en minuscules afin que « Jean@Exemple.COM » et « jean@exemple.com » correspondent à un seul compte."
    },
    {
      "id": "lc-faq-4",
      "question": "Normaliser en minuscules ou en majuscules ?",
      "answer": "En minuscules : c’est la convention standard sur le Web pour les URL, e-mails et étiquettes."
    },
    {
      "id": "lc-faq-5",
      "question": "Pourquoi ma comparaison échoue-t-elle encore ?",
      "answer": "Il faut convertir les deux chaînes comparées et vérifier les espaces superflus aux extrémités."
    },
    {
      "id": "lc-faq-6",
      "question": "Les chiffres ou symboles sont-ils modifiés ?",
      "answer": "Non, seuls les caractères alphabétiques changent."
    },
    {
      "id": "lc-faq-7",
      "question": "Pourquoi certains caractères ne changent-ils pas ?",
      "answer": "Les chiffres, emojis et écritures sans casse (japonais, chinois, arabe) restent inchangés."
    },
    {
      "id": "lc-faq-8",
      "question": "Est-ce que cela détruit les acronymes et noms propres ?",
      "answer": "Oui (« NASA » devient « nasa »). Conservez le texte source pour la lecture humaine."
    },
    {
      "id": "lc-faq-9",
      "question": "L’outil fonctionne-t-il hors ligne ?",
      "answer": "Oui, il fonctionne sans connexion une fois chargé dans le navigateur."
    }
  ],
  "guide": {
    "title": "Comment convertir un texte en minuscules",
    "description": "Normalisation d’adresses e-mail, slugs et comparaisons insensibles à la casse."
  },
  "ui": {
    "placeholder": "Collez ou saisissez votre texte ici",
    "outputPlaceholder": "Le résultat en minuscules apparaîtra ici",
    "sampleText": "Bonjour MONDE, API_HTTP et Contact@Exemple.FR",
    "handoff": {
      "msgTpl": "{n} acronyme(s) ont perdu leurs majuscules ({list}) de manière irréversible ici."
    }
  }
};
