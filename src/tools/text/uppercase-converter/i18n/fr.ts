import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "fr",
  "slug": "uppercase-converter",
  "name": "Convertisseur Majuscules",
  "seoTitle": "Convertir un Texte en Majuscules en Ligne",
  "description": "Transformez n’importe quel texte en MAJUSCULES en un clic et copiez-le aussitôt dans votre navigateur, sans envoi ni inscription.",
  "tagline": "Convertissez tout texte en MAJUSCULES instantanément.",
  "knowledge": {
    "primaryConcepts": [
      "convertir en majuscules"
    ],
    "realWorldUseCases": [
      "Mettre en forme des libellés ou titres en capitales",
      "Écrire des constantes de code comme MAX_SIZE",
      "Uniformiser des acronymes saisis en casse mixte",
      "Accentuer un bref bouton ou avertissement"
    ],
    "commonMistakes": [
      "Composer de longs paragraphes tout en majuscules",
      "Confondre l’affichage CSS text-transform et le texte réellement stocké"
    ]
  },
  "faqs": [
    {
      "id": "uc-faq-1",
      "question": "Comment passer un texte en majuscules ?",
      "answer": "Collez votre texte à gauche : la version tout en MAJUSCULES s’affiche immédiatement à droite prête à copier."
    },
    {
      "id": "uc-faq-2",
      "question": "Les chiffres et la ponctuation sont-ils modifiés ?",
      "answer": "Non, seules les lettres alphabétiques changent de casse."
    },
    {
      "id": "uc-faq-3",
      "question": "Pourquoi un texte affiché en majuscules sur un site se colle-t-il en minuscules ?",
      "answer": "Le site applique CSS text-transform: uppercase uniquement à l’affichage sans changer le texte source réel."
    },
    {
      "id": "uc-faq-4",
      "question": "Mon texte est-il envoyé sur un serveur ?",
      "answer": "Non. La transformation s’exécute localement dans votre navigateur."
    },
    {
      "id": "uc-faq-5",
      "question": "Quand utiliser les majuscules ?",
      "answer": "Pour des sigles, constantes de code ou libellés courts; évitez-les sur de longs paragraphes peu lisibles."
    },
    {
      "id": "uc-faq-6",
      "question": "CSS text-transform ou conversion réelle ?",
      "answer": "CSS suffit pour le style visuel, mais convertissez le texte réel pour des bases de données, exports ou codes promo."
    },
    {
      "id": "uc-faq-7",
      "question": "Est-ce identique dans toutes les langues ?",
      "answer": "Le convertisseur applique le standard Unicode (par ex. l’allemand ß devient SS)."
    },
    {
      "id": "uc-faq-8",
      "question": "Pourquoi les accents restent-ils présents ?",
      "answer": "En Unicode standard, é devient É (« café » devient « CAFÉ »), ce qui respecte la typographie française."
    }
  ],
  "guide": {
    "title": "Comment convertir un texte en majuscules",
    "description": "Comportement Unicode des accents, différence avec CSS text-transform et bonnes pratiques."
  },
  "ui": {
    "placeholder": "Collez ou saisissez votre texte ici",
    "outputPlaceholder": "Le résultat en majuscules apparaîtra ici",
    "sampleText": "Portez ce vieux whisky au juge blond qui fume"
  }
};
