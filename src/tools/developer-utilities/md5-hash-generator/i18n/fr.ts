import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Générateur de hash MD5",
  "seoTitle": "Générateur MD5 en ligne - Calculer un hash 32 caractères",
  "description": "Générez une empreinte MD5 de 32 caractères ou somme de contrôle depuis n’importe quel texte dans votre navigateur, privé et instantané.",
  "tagline": "Calculez une empreinte MD5 de 128 bits en local.",
  "lead": "Obtenez l’empreinte hexadécimale MD5 de tout texte dans votre navigateur pour vos clés de cache ou contrôles simples de corruption.",
  "guide": {
    "title": "Qu’est-ce que MD5 ? Fonctionnement et limites",
    "description": "Comprenez le hachage MD5 128 bits, pourquoi les collisions le rendent impropre aux mots de passe et quand l’utiliser sans risque."
  },
  "ui": {
    "displayName": "MD5",
    "inputAriaLabel": "Texte à hacher en MD5",
    "comparePlaceholder": "Collez un condensat MD5 de 32 caractères à comparer",
    "historyTitle": "Historique récent",
    "insight": "MD5 génère une somme de contrôle de 128 bits rapide mais vulnérable aux collisions : réservez-le aux clés de cache ou à la déduplication, jamais aux mots de passe ni signatures.",
    "technical": [
      {
        "term": "Standard",
        "detail": "RFC 1321"
      },
      {
        "term": "Sortie",
        "detail": "128 bits, 32 caractères hexadécimaux"
      },
      {
        "term": "Sens",
        "detail": "Sens unique : impossible à inverser"
      },
      {
        "term": "Sécurité",
        "detail": "Obsolète : collisions pratiques connues"
      }
    ]
  },
  "knowledge": {
    "summary": "Calcule une empreinte MD5 de 32 caractères en local ; utile pour les sommes de contrôle non cryptographiques.",
    "useCases": [
      "Contrôler un téléchargement contre une altération accidentelle",
      "Créer des clés de cache déterministes depuis des URL",
      "Dédupliquer des fichiers par empreinte de contenu",
      "Répartir des lignes entre partitions de base"
    ],
    "mistakes": [
      "Utiliser MD5 pour stocker des mots de passe",
      "Faire confiance à MD5 contre une falsification volontaire"
    ]
  },
  "faqs": [
    {
      "id": "md5-faq-1",
      "question": "Qu’est-ce que MD5 ?",
      "answer": "MD5 est une fonction de hachage créée en 1991 produisant une empreinte fixe de 32 caractères hexadécimaux (128 bits) à partir de n’importe quelle donnée."
    },
    {
      "id": "md5-faq-2",
      "question": "À quoi ressemble un hash MD5 ?",
      "answer": "C’est toujours 32 caractères hexadécimaux minuscules. Par exemple \"hello\" donne 5d41402abc4b2a76b9719d911017c592."
    },
    {
      "id": "md5-faq-3",
      "question": "Peut-on inverser un hash MD5 pour retrouver le texte ?",
      "answer": "Mathématiquement non, c’est une fonction à sens unique. En pratique les mots courants figurent dans des tables précalculées."
    },
    {
      "id": "md5-faq-4",
      "question": "MD5 est-il sûr ?",
      "answer": "Oui pour des usages techniques sans enjeu de sécurité ; non pour tout besoin cryptographique à cause des attaques par collision."
    },
    {
      "id": "md5-faq-5",
      "question": "Puis-je utiliser MD5 pour les mots de passe ?",
      "answer": "Non. Sa rapidité facilite les attaques par force brute sur GPU ; préférez Argon2, bcrypt ou scrypt."
    },
    {
      "id": "md5-faq-6",
      "question": "Qu’est-ce qu’une collision de hash ?",
      "answer": "Deux entrées différentes qui donnent exactement le même condensat. Pour MD5, générer une collision ne prend aujourd’hui que quelques secondes."
    },
    {
      "id": "md5-faq-7",
      "question": "À quoi MD5 sert-il encore aujourd’hui ?",
      "answer": "Aux sommes de contrôle anti-corruption accidentelle, clés de cache, déduplication et partitionnement de bases."
    },
    {
      "id": "md5-faq-8",
      "question": "Quelle différence entre MD5 et SHA-256 ?",
      "answer": "MD5 produit 128 bits (32 car.) et est vulnérable ; SHA-256 produit 256 bits (64 car.) et reste sûr contre les collisions."
    },
    {
      "id": "md5-faq-9",
      "question": "Pourquoi la même entrée donne-t-elle toujours le même MD5 ?",
      "answer": "Parce que le hachage est déterministe : des octets identiques produisent toujours la même empreinte."
    },
    {
      "id": "md5-faq-10",
      "question": "Puis-je calculer un MD5 sans rien envoyer en ligne ?",
      "answer": "Oui. Le calcul s’exécute directement en JavaScript dans votre navigateur sans transfert réseau."
    },
    {
      "id": "md5-faq-11",
      "question": "Une IA peut-elle inverser un hash MD5 ?",
      "answer": "Non. MD5 détruit de l’information de façon irréversible ; aucun modèle ne peut déduire mathématiquement l’entrée."
    }
  ]
};
