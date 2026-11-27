import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'json-minifier',
  name: 'Minificateur JSON',
  seoTitle: 'Minificateur JSON en Ligne – Compresser JSON Gratuit',
  description:
    'Minifiez et compressez du JSON en ligne dans votre navigateur en supprimant les espaces superflus. Grands entiers et décimaux préservés sans envoi serveur.',
  tagline: 'Supprimez les espaces inutiles d’un JSON pour réduire sa taille.',
  knowledge: {
    primaryConcepts: ['minification JSON'],
    realWorldUseCases: [
      'Alléger les réponses JSON des API en production',
      'Réduire la taille de fichiers JSON statiques servis via HTTP',
      'Compacter des configurations dans des bundles de build',
    ],
    commonMistakes: [
      'Minifier du JSON suivi dans Git et rendre les diffs illisibles',
      'Tenter de minifier des fichiers contenant des commentaires JSONC/JSON5',
    ],
  },
  faqs: [
    {
      id: 'json-min-faq-1',
      question: 'Que fait la minification JSON ?',
      answer:
        'Elle supprime tous les espaces, tabulations et retours à la ligne non significatifs entre les jetons JSON sans toucher aux données. `{ "a": 1 }` et `{"a":1}` sont identiques pour tout analyseur, en moins d’octets.',
    },
    {
      id: 'json-min-faq-2',
      question: 'Quel gain de taille obtient-on en minifiant du JSON ?',
      answer:
        'Selon l’indentation d’origine, un JSON imbriqué diminue souvent de 20 à 40 %. Combiné ensuite avec gzip ou Brotli, le gain réseau est optimal.',
    },
    {
      id: 'json-min-faq-3',
      question: 'Un JSON minifié reste-t-il valide ?',
      answer:
        'Oui. La norme RFC 8259 ignore les blancs entre jetons. Tout parseur JSON conforme interprète de la même manière un document formaté ou minifié.',
    },
    {
      id: 'json-min-faq-4',
      question: 'Puis-je reformater un JSON minifié pour le relire ?',
      answer:
        'Oui, la minification est réversible sans perte. Collez simplement la sortie dans notre Formateur JSON : les jetons d’origine sont copiés tels quels.',
    },
    {
      id: 'json-min-faq-5',
      question: 'Quand faut-il minifier un JSON ?',
      answer:
        'Pour optimiser le transfert en production (API, fichiers statiques, builds). En développement et dans les dépôts Git, gardez le JSON indenté.',
    },
    {
      id: 'json-min-faq-6',
      question: 'Quelle différence entre minification et compression gzip ?',
      answer:
        'La minification retire les blancs au niveau du texte ; gzip ou Brotli compressent les octets avant le transfert réseau. Les deux approches se complètent très bien.',
    },
    {
      id: 'json-min-faq-7',
      question: 'La minification modifie-t-elle l’ordre des clés ou la structure ?',
      answer:
        'Non. L’ordre des clés, les types et les valeurs restent strictement identiques.',
    },
    {
      id: 'json-min-faq-8',
      question: 'Supprime-t-elle les commentaires JSON ?',
      answer:
        'Le format JSON standard interdit les commentaires. Si votre fichier contient des commentaires (JSONC/JSON5), il est invalide jusqu’à leur retrait.',
    },
    {
      id: 'json-min-faq-9',
      question: 'Dois-je minifier manuellement les réponses de mon API ?',
      answer:
        'Généralement non : les frameworks HTTP sérialisent de manière compacte par défaut (comme `JSON.stringify(data)` sans 3e argument).',
    },
    {
      id: 'json-min-faq-10',
      question: 'La minification risque-t-elle d’altérer un grand identifiant ou 19.90 ?',
      answer:
        'Non. Ici, seuls les blancs entre jetons d’origine sont retirés caractère par caractère. Un identifiant comme 9007199254740993 n’est pas arrondi et 19.90 garde son zéro final.',
    },
  ],
  guide: {
    title: 'Minification JSON : rôle et bonnes pratiques',
    description: 'Réduire la taille des charges JSON sans perte, lien avec gzip et préservation exacte des nombres.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrée JSON',
    placeholder: 'Collez votre JSON ici',
    emptyOutput: 'Collez du JSON à gauche pour le minifier.',
    validLabel: 'JSON valide',
    invalidLabel: 'JSON invalide',
    appliedPrefix: 'Correction appliquée :',
    loadError: 'Impossible de charger le processeur JSON.',
    moreAboutHeading: 'Fonctionnement du Minificateur JSON',
    insight:
      'La minification retire tout espace inutile pour produire le JSON valide le plus compact possible, sans modifier aucune donnée.',
    technical: [
      { term: 'Opération', detail: 'Copie les jetons d’origine sans espaces et sans resérialisation' },
      { term: 'Usage', detail: 'Alléger les réponses API, fichiers statiques et configurations' },
      { term: 'Données', detail: 'Intactes : grands entiers, 1.0, 1e5, échappements et ordre préservés' },
      { term: 'Clés en double', detail: 'Conservées telles quelles avec un avertissement' },
    ],
    engine: {
      repairBoth: 'Corriger guillemets typographiques et virgule finale',
      repairQuotes: 'Remplacer les guillemets typographiques',
      repairComma: 'Supprimer la virgule finale',
    },
  },
};
