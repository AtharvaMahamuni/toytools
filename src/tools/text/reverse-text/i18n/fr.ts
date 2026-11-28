import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Inverser le texte",
  "seoTitle": "Inverser le texte - Retourner une chaîne en ligne",
  "description": "Inversez un texte caractère par caractère en ligne, gratuitement et en toute confidentialité directement dans votre navigateur.",
  "tagline": "Inversez une chaîne caractère par caractère sur votre appareil.",
  "lead": "Saisissez ou collez votre texte pour inverser immédiatement l’ordre des caractères en gardant accents et emojis intacts.",
  "guide": {
    "title": "Comment inverser du texte caractère par caractère",
    "description": "Découvrez à quoi sert le texte inversé, comment sont traités les accents et sauts de ligne, et comment retourner une chaîne sans erreur."
  },
  "ui": {
    "placeholder": "Collez ou saisissez du texte ici",
    "outputPlaceholder": "Le résultat inversé apparaîtra ici",
    "sampleText": "Engage le jeu que je le gagne",
    "handoff": {
      "msgTpl": "Contient {n} saut(s) de ligne ; inverser tout le bloc retourne aussi l’ordre des lignes."
    }
  },
  "knowledge": {
    "summary": "Retourne le texte caractère par caractère tout en préservant les lettres accentuées et les emojis complexes.",
    "useCases": [
      "Créer des indices ou réponses cachées pour des jeux et quiz",
      "Vérifier rapidement si un mot ou une phrase est un palindrome",
      "Composer un effet miroir pour une biographie ou un message",
      "Lire une longue chaîne technique depuis la fin"
    ],
    "mistakes": [
      "Croire que seuls les mots changent de place au lieu des caractères",
      "Oublier que les retours à la ligne sont aussi inversés dans un bloc multiligne"
    ]
  },
  "faqs": [
    {
      "id": "reverse-text-faq-1",
      "question": "Que fait exactement l’inversion de texte ?",
      "answer": "Elle inverse l’ordre de chaque caractère : le dernier passe en premier et le premier en dernier. Par exemple, \"bonjour\" devient \"ruojnob\". Aucun caractère n’est supprimé."
    },
    {
      "id": "reverse-text-faq-2",
      "question": "L’inversion déplace-t-elle aussi les sauts de ligne ?",
      "answer": "Oui. L’outil traite toute l’entrée comme une séquence unique : les sauts de ligne suivent le mouvement et la dernière ligne passe en premier. Pour garder chaque ligne à sa place, inversez une ligne à la fois."
    },
    {
      "id": "reverse-text-faq-3",
      "question": "Les emojis et accents sont-ils préservés ?",
      "answer": "Oui. La découpe se fait par graphèmes visuels complets et non par unités UTF-16 brutes, ce qui évite de casser les accents combinés ou les emojis composés."
    },
    {
      "id": "reverse-text-faq-5",
      "question": "À quoi sert le texte écrit à l’envers ?",
      "answer": "Il sert à dissimuler une réponse de quiz, tester des palindromes comme \"radar\" ou créer des légendes ludiques sur les réseaux sociaux."
    },
    {
      "id": "reverse-text-faq-6",
      "question": "Comment retourner une chaîne instantanément ?",
      "answer": "Collez votre texte dans la zone prévue : la version inversée s’affiche immédiatement sans bouton à cliquer et peut être copiée d’un geste."
    },
    {
      "id": "reverse-text-faq-7",
      "question": "Comment inverser un mot pour une énigme ?",
      "answer": "Saisissez le mot seul puis copiez sa forme inversée dans votre feuille de jeu, par exemple \"niche\" vers \"ehcin\", facile à lire de tête pour les joueurs."
    },
    {
      "id": "reverse-text-faq-4",
      "question": "Mon texte est-il envoyé vers un serveur ?",
      "answer": "Non. Tout fonctionne localement dans votre navigateur : vos brouillons et notes restent strictement privés."
    }
  ]
};
