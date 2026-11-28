import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Compteur de fréquence de mots",
  "seoTitle": "Fréquence des mots - Compter les occurrences en ligne",
  "description": "Comptez les occurrences de chaque mot avec densité en pourcentage et filtre des mots courants, localement dans votre navigateur.",
  "tagline": "Nombre d’apparitions et part de chaque mot.",
  "lead": "Repérez immédiatement les répétitions dans votre texte, triez par fréquence ou ordre alphabétique et masquez les mots outils.",
  "guide": {
    "title": "Comment analyser la fréquence des mots dans un texte",
    "description": "Découvrez comment fonctionne l’analyse de fréquence lexicale, l’intérêt du filtre de mots vides et comment vérifier la densité de mots-clés."
  },
  "ui": {
    "stats": {
      "uniqueWords": "Mots uniques",
      "words": "Mots",
      "sentences": "Phrases",
      "averageWordLength": "Longueur moyenne"
    },
    "emptyMessage": "Collez ou saisissez un texte pour compter la fréquence des mots.",
    "sampleText": "Le rapide renard brun saute par-dessus le chien paresseux près de la vieille ferme. Une douce brise agitait les feuilles du grand chêne au-dessus du pré ensoleillé.",
    "heading": "Fréquence des mots",
    "hideCommon": "Masquer les mots courants",
    "ignoreNumbers": "Ignorer les nombres",
    "byFrequency": "Par fréquence",
    "alphabetical": "Alphabétique",
    "listAria": "Mots par fréquence",
    "noWords": "Aucun mot trouvé.",
    "topWordsTpl": "Affichage des {limit} premiers sur {total} mots distincts."
  },
  "knowledge": {
    "summary": "Mesure la fréquence et le pourcentage de chaque mot avec tri par occurrences ou alphabétique et filtre de mots outils.",
    "useCases": [
      "Repérer les répétitions stylistiques avant publication",
      "Contrôler la densité sémantique d’un article SEO",
      "Établir le profil lexical d’un document ou corpus",
      "Identifier les thèmes récurrents dans des avis clients"
    ],
    "mistakes": [
      "Comparer des comptes bruts plutôt que des pourcentages entre textes de longueurs variées",
      "Oublier de filtrer les mots vides avant d’interpréter les sujets clés"
    ]
  },
  "faqs": [
    {
      "id": "wf-faq-1",
      "question": "Que fait un compteur de fréquence de mots ?",
      "answer": "Il compte combien de fois chaque mot distinct figure dans le texte, affiche son effectif et sa part en pourcentage, et classe le tout par fréquence ou par ordre alphabétique."
    },
    {
      "id": "wf-faq-2",
      "question": "Comment les mots sont-ils comptés ? Est-ce sensible à la casse ?",
      "answer": "Les mots sont séparés aux espaces, retours à la ligne, tirets longs et virgules hors nombres, sans tenir compte des majuscules : \"Maison\" et \"maison\" comptent ensemble, tout en gardant apostrophes et traits d’union internes."
    },
    {
      "id": "wf-faq-3",
      "question": "Que retire le filtre \"Masquer les mots courants\" ?",
      "answer": "Il écarte les mots fonctionnels anglais très fréquents (\"the\", \"a\", \"of\", \"and\") afin de faire remonter les termes porteurs de sens."
    },
    {
      "id": "wf-faq-4",
      "question": "À quoi sert l’analyse de fréquence des mots ?",
      "answer": "Les rédacteurs chassent les tics de langage, les référenceurs surveillent la densité de mots-clés et les analystes dégagent les motifs fréquents dans les retours utilisateurs."
    },
    {
      "id": "wf-faq-5",
      "question": "Qu’est-ce que la densité de mots-clés ?",
      "answer": "C’est le pourcentage d’apparition d’un terme par rapport au nombre total de mots, affiché sur chaque ligne. Une proportion autour de 1 à 2 % reste généralement naturelle."
    },
    {
      "id": "wf-faq-6",
      "question": "Pourquoi le nombre de mots uniques varie-t-il selon les outils ?",
      "answer": "Chaque analyseur traite différemment traits d’union, apostrophes et nombres. Nos règles alignées sur le compteur général garantissent un classement comparatif cohérent."
    },
    {
      "id": "wf-faq-7",
      "question": "Quelle quantité de texte puis-je analyser ?",
      "answer": "Le calcul parcourt des documents longs en une fraction de seconde. Le tableau affiche les 50 termes les plus fréquents avec le total complet de mots distincts."
    },
    {
      "id": "wf-faq-8",
      "question": "Mon texte est-il envoyé sur un serveur ?",
      "answer": "Non. L’analyse s’effectue intégralement dans votre navigateur ; rien n’est transmis et l’outil continue à fonctionner hors connexion."
    }
  ]
};
