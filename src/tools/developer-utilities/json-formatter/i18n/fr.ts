import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'json-formatter',
  name: 'Formateur JSON',
  seoTitle: 'Formateur JSON en Ligne – Formater et Indenter JSON',
  description:
    'Formatez et embellissez votre JSON en ligne avec une indentation claire pour le rendre lisible. Tout reste traité localement sur votre appareil.',
  tagline: 'Mettez en forme vos données JSON compactes avec une indentation nette.',
  citation: {
    problem: 'Utilisez ce Formateur JSON pour indenter ou inspecter du code JSON sans jamais l’envoyer sur un serveur.',
    nonGoal: 'appeler un modèle d’IA ni interpréter la signification métier des données.',
  },
  knowledge: {
    primaryConcepts: ['formateur json', 'indentation json'],
    realWorldUseCases: [
      'Déboguer la réponse minifiée d’une API web',
      'Lire clairement un fichier de configuration compacté',
      'Inspecter le payload JSON d’un webhook issu des journaux serveur',
      'Produire des diffs propres dans Git pour les fichiers de configuration',
    ],
    commonMistakes: [
      'Tenter de formater un JSON contenant une erreur de syntaxe sans le corriger avant',
      'Servir du JSON indenté sur des routes critiques sensibles à la taille des paquets',
    ],
  },
  faqs: [
    {
      id: 'json-fmt-faq-1',
      question: 'Comment formater du JSON en ligne ?',
      answer:
        'Collez votre JSON dans la zone d’entrée : l’outil le reformate immédiatement avec indentation et retours à la ligne s’il est valide. En cas d’erreur de syntaxe, un message indique l’emplacement exact du problème. Rien ne quitte votre navigateur.',
    },
    {
      id: 'json-fmt-faq-2',
      question: 'Que fait un formateur JSON ?',
      answer:
        'Il prend un JSON valide et le réécrit avec une indentation régulière et des sauts de ligne. Les données restent strictement identiques : mêmes clés, mêmes valeurs, même hiérarchie. Seuls les espaces blancs changent.',
    },
    {
      id: 'json-fmt-faq-3',
      question: 'Le formatage modifie-t-il les données JSON ?',
      answer:
        'Non. En JSON, les espaces entre les jetons ne sont pas significatifs. `{"a":1}`, `{ "a": 1 }` et la version indentée sur plusieurs lignes représentent exactement le même objet pour tout analyseur JSON.',
    },
    {
      id: 'json-fmt-faq-4',
      question: 'Quelle est la différence entre formater et minifier du JSON ?',
      answer:
        'Ce sont deux opérations inverses. Formater ajoute des espaces et retours à la ligne pour la lecture humaine. Minifier les supprime pour réduire le poids du transfert. Les deux conservent 100% des données.',
    },
    {
      id: 'json-fmt-faq-5',
      question: 'Quelle différence entre formater et valider du JSON ?',
      answer:
        'Formater améliore la présentation visuelle d’un JSON valide. Valider vérifie si le texte respecte la grammaire officielle JSON et signale les erreurs. Si le formateur rejette votre texte, corrigez d’abord la syntaxe.',
    },
    {
      id: 'json-fmt-faq-6',
      question: 'Ce formateur JSON est-il confidentiel ?',
      answer:
        'Oui. Le traitement s’exécute intégralement dans votre navigateur. Vos données JSON ne sont jamais transmises ni stockées sur un serveur.',
    },
    {
      id: 'json-fmt-faq-7',
      question: 'Quelle indentation choisir : 2 ou 4 espaces ?',
      answer:
        'Deux espaces est le choix le plus courant en JavaScript et dans les projets web, tandis que quatre espaces reste fréquent en Python. Techniquement, les parseurs ignorent cette différence.',
    },
    {
      id: 'json-fmt-faq-8',
      question: 'Pourquoi les réponses d’API arrivent-elles sur une seule ligne ?',
      answer:
        'La plupart des API renvoient du JSON minifié sans sauts de ligne afin de limiter la bande passante en production. C’est parfait pour le réseau, mais difficile à lire sans outil de formatage.',
    },
    {
      id: 'json-fmt-faq-9',
      question: 'Que signifie « pretty-print » en JSON ?',
      answer:
        'Le « pretty-printing » consiste à mettre en page un texte structuré grâce à des retours à la ligne et une indentation cohérente. Pour JSON, cela désigne exactement le formatage lisible.',
    },
    {
      id: 'json-fmt-faq-10',
      question: 'Puis-je formater du JSON sans rien téléverser ?',
      answer:
        'Oui. ToyTools effectue l’opération directement en local dans votre navigateur sans envoi de fichier.',
    },
    {
      id: 'json-fmt-faq-11',
      question: 'Ce formateur utilise-t-il une IA ?',
      answer:
        'Non. Il réindente votre JSON de façon déterministe côté client et ne contacte ni ChatGPT, ni Claude, ni Gemini, ni aucun autre modèle.',
    },
    {
      id: 'json-fmt-faq-12',
      question: 'Puis-je formater du JSON généré par un assistant IA ?',
      answer:
        'Oui. Collez simplement le bloc retourné pour vérifier sa structure et copier la version mise en forme sans l’envoyer ailleurs.',
    },
    {
      id: 'json-fmt-faq-13',
      question: 'Les grands entiers et clés dupliquées sont-ils préservés ?',
      answer:
        'Oui. L’outil réindente les jetons d’origine sans passer par JSON.stringify, donc 12345678901234567890 n’est pas arrondi, 1.0 reste 1.0 et 1e5 reste 1e5. Une clé répétée dans un objet est conservée et signalée par un avertissement.',
    },
  ],
  guide: {
    title: 'Qu’est-ce que le formatage JSON ?',
    description:
      'Ce que fait le formatage JSON, pourquoi l’indentation et la minification gardent exactement les mêmes données et quand utiliser chacune.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrée JSON',
    placeholder: 'Collez votre JSON ici',
    emptyOutput: 'Collez du JSON à gauche pour le formater.',
    validLabel: 'JSON valide',
    invalidLabel: 'JSON invalide',
    appliedPrefix: 'Correction appliquée :',
    loadError: 'Impossible de charger le processeur JSON.',
    moreAboutHeading: 'Fonctionnement du Formateur JSON',
    insight:
      'Le formatage (pretty-printing) ajoute une indentation constante et des retours à la ligne pour rendre le JSON facile à lire et à comparer. Seuls les espaces changent, jamais vos données.',
    technical: [
      { term: 'Norme', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Opération', detail: 'Réindente les jetons d’origine sur 2 espaces sans resérialiser les valeurs' },
      { term: 'Données', detail: 'Inchangées : grands entiers, 1.0, 1e5 et séquences d’échappement conservés tels quels' },
      { term: 'Clés dupliquées', detail: 'Conservées telles quelles avec un avertissement' },
      { term: 'Erreurs', detail: 'Signale la première erreur de syntaxe avec sa position' },
    ],
  },
};
