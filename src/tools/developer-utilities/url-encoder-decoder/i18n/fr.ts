import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'url-encoder-decoder',
  name: 'Encodeur & Décodeur URL',
  seoTitle: 'Encoder et Décoder URL (%XX) en Ligne Gratuit',
  description:
    'Encodez ou décodez des paramètres URL (`encodeURIComponent`) dans votre navigateur. %20 vs +, correction de double encodage et traitement 100 % local.',
  tagline: 'Encodez et décodez les composants URL avec %XX.',
  craft: {
    solves:
      'Un double encodage, un « + » de formulaire ou un « % » isolé font souvent échouer le décodage alors qu’une simple réparation corrige la chaîne.',
  },
  knowledge: {
    primaryConcepts: ['encodage URL'],
    realWorldUseCases: [
      'Encoder des termes de recherche dans une chaîne de requête',
      'Passer une adresse e-mail ou une URL de redirection OAuth en paramètre',
      'Sécuriser des chemins contenant espaces ou caractères accentués',
    ],
    commonMistakes: [
      'Encoder toute l’URL au lieu de chaque valeur ou segment séparément',
      'Double-encoder une valeur déjà encodée (%20 devient %2520)',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: 'À quoi sert l’encodage URL (percent-encoding) ?',
      answer:
        'Il remplace les caractères réservés ou non sûrs dans une URL par `%` suivi de deux chiffres hexadécimaux représentant leur octet UTF-8 (comme `%20` pour un espace).',
    },
    {
      id: 'url-enc-faq-2',
      question: 'Quelle différence entre %20 et + pour les espaces ?',
      answer:
        '`%20` est la norme RFC 3986 pour chemins et requêtes URL. `+` ne vaut que dans les formulaires `application/x-www-form-urlencoded` ; dans un chemin ou JSON, il reste un plus littéral.',
    },
    {
      id: 'url-enc-faq-3',
      question: 'Quand utiliser encodeURIComponent plutôt que encodeURI ?',
      answer:
        'Utilisez `encodeURIComponent` pour chaque valeur de paramètre pouvant contenir `&`, `=`, `/` ou `?`. Réservez `encodeURI` à une URL complète dont la structure doit rester intacte.',
    },
    {
      id: 'url-enc-faq-4',
      question: 'Quels caractères doivent être encodés ?',
      answer:
        'Les espaces, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, les accents, emojis et tout caractère non-ASCII, ainsi que `&`, `=`, `/`, `?`, `#` lorsqu’ils servent de valeur.',
    },
    {
      id: 'url-enc-faq-5',
      question: 'Qu’est-ce que le double encodage et comment l’éviter ?',
      answer:
        'C’est encoder une chaîne déjà encodée (`%20` devient `%2520`). N’encodez les données brutes qu’une seule fois juste avant de construire l’URL.',
    },
    {
      id: 'url-enc-faq-6',
      question: 'L’encodage URL concerne-t-il aussi les chemins ?',
      answer:
        'Oui : un nom de dossier ou fichier contenant un espace doit devenir `/mon%20dossier/texte.txt` comme les paramètres `?nom=Jean%20Dupont`.',
    },
    {
      id: 'url-enc-faq-7',
      question: 'URL encoding et percent-encoding désignent-ils la même chose ?',
      answer:
        'Oui. La RFC 3986 utilise le terme percent-encoding tandis que les développeurs parlent d’URL encoding ou d’échappement URL.',
    },
    {
      id: 'url-enc-faq-8',
      question: 'Que se passe-t-il si j’oublie d’encoder un paramètre ?',
      answer:
        'Un `&` coupe votre paramètre en deux, un `?` ouvre une autre requête et un `#` transforme la suite en ancre locale jamais transmise au serveur.',
    },
    {
      id: 'url-enc-faq-9',
      question: 'Comment fonctionne cet outil exactement ?',
      answer:
        'Il exécute `encodeURIComponent` et `decodeURIComponent` sur vos chaînes UTF-8 localement dans votre navigateur.',
    },
  ],
  guide: {
    title: 'Encodage URL : %20 vs + et double encodage',
    description:
      'Fonctionnement du percent-encoding RFC 3986, encodeURI vs encodeURIComponent et prévention du %2520.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'Encoder → URL',
    inverseLabel: 'Décoder ← URL',
    outputLabel: 'Sortie',
    placeholder: 'Collez du texte ou une chaîne %XX ici…',
    outputPlaceholder: 'Le résultat s’affichera ici…',
    emptyOutput: 'Saisissez du texte ou une URL encodée pour commencer.',
    insight:
      'Le percent-encoding remplace les caractères réservés ou non-ASCII par %XX en UTF-8 (`encodeURIComponent`) afin d’éviter que &, = ou ? cassent l’URL.',
    technical: [
      { term: 'Méthode', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: 'Espaces', detail: '%20 dans les URIs standard ; + dans les formulaires x-www-form-urlencoded' },
      { term: 'Confidentialité', detail: 'Exécution 100 % locale sans transmission d’URLs ou jetons' },
    ],
    compareLabel: 'Comparer',
    comparePlaceholder: 'Valeur attendue optionnelle',
    modeAriaLabel: 'Mode de conversion',
    inputAriaLabel: 'Entrée',
    outputAriaLabel: 'Résultat converti',
    swapLabel: 'Inverser',
    swapAriaLabel: 'Permuter l’entrée et la sortie',
    metaAriaLabel: 'Métadonnées',
    byteAriaLabel: 'Inspecteur hexadécimal',
    historyTitle: 'Historique récent',
    historyAriaLabel: 'Entrées récentes',
    insightAriaLabel: 'Note technique',
    appliedPrefix: 'Correction appliquée :',
    checkInputMsg: 'Vérifiez l’entrée : séquence % mal formée.',
    invalidInputMsg: 'Chaîne percent-encoded invalide.',
    couldNotConvertMsg: 'Impossible de convertir l’entrée.',
    detectedPrefix: 'Détecté :',
    validPrefix: 'Valide',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texte',
      'Percent-encoded': 'Encodé URL',
      'HTML entities': 'Entités HTML',
      Markup: 'Balisage',
    },
    engine: {
      errDecode: 'Impossible de décoder la chaîne URL.',
      errEncode: 'Impossible d’encoder en composant URL.',
      errInvalidPctTpl: 'Séquence % invalide ou tronquée à la position {pos}.',
      recDouble: 'Double encodage détecté (%25XX) : décoder un niveau de plus',
      recStrayPct: 'Échapper les signes % isolés en %25 avant décodage',
      recPlus: 'Remplacer + par des espaces (format x-www-form-urlencoded)',
      metaEscapes: 'Séquences %XX',
      escCountTpl: '{n} séquences',
      metaInputLen: 'Long. entrée',
      metaOutputBytes: 'Octets sortie',
    },
  },
};
