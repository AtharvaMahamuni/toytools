import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'sha256-hash-generator',
  name: 'Générateur de Hash SHA-256',
  seoTitle: 'Générateur SHA-256 en Ligne – Empreinte & Vérification',
  description:
    'Calculez une empreinte SHA-256 (64 caractères hexadécimaux) et vérifiez un condensat attendu directement dans votre navigateur via WebCrypto sans envoi.',
  tagline: 'Générez une empreinte SHA-256 à partir de tout texte.',
  citation: {
    problem: 'Utilisez cet outil SHA-256 pour obtenir ou contrôler l’empreinte d’un texte localement sans le téléverser.',
    nonGoal: 'inverser un hachage cryptographique ni envoyer la saisie vers une IA.',
  },
  craft: {
    solves:
      'Une empreinte ne sert qu’à vérifier une égalité exacte, mais comparer 64 chiffres hexadécimaux à l’œil nu est source d’erreurs ou de confusion entre algorithmes.',
  },
  knowledge: {
    primaryConcepts: ['SHA-256'],
    realWorldUseCases: [
      'Contrôler l’empreinte de certificats TLS/SSL',
      'Signer des paquets logiciels et manifestes de publication',
      'Calculer les preuves de travail et identifiants Bitcoin',
      'Vérifier l’intégrité de chaînes contre toute altération',
    ],
    commonMistakes: [
      'Utiliser SHA-256 nu pour stocker des mots de passe sans sel ni coût',
      'Confondre hachage unidirectionnel et chiffrement réversible',
    ],
  },
  faqs: [
    {
      id: 'sha256-faq-1',
      question: 'Qu’est-ce que SHA-256 ?',
      answer:
        'Une fonction de hachage cryptographique de la famille SHA-2 produisant toujours une empreinte de 256 bits affichée sur 64 caractères hexadécimaux, sans attaque pratique par collision connue.',
    },
    {
      id: 'sha256-faq-2',
      question: 'À quoi ressemble un hash SHA-256 ?',
      answer:
        'Toujours 64 caractères hexadécimaux minuscules (`0–9`, `a–f`). Modifier un seul caractère d’entrée bouleverse l’ensemble du condensat (effet avalanche).',
    },
    {
      id: 'sha256-faq-3',
      question: 'Peut-on inverser un hash SHA-256 ?',
      answer:
        'Non. C’est une fonction à sens unique : on ne peut pas déduire le texte source depuis son empreinte.',
    },
    {
      id: 'sha256-faq-4',
      question: 'Pourquoi SHA-256 est-il jugé sûr ?',
      answer:
        'Aucune attaque pratique n’affecte ses 64 tours complets après plus de vingt ans d’audit public.',
    },
    {
      id: 'sha256-faq-5',
      question: 'SHA-256 convient-il au stockage des mots de passe ?',
      answer:
        'Non, car il est extrêmement rapide sur GPU. Pour les mots de passe, utilisez des fonctions lentes et salées comme Argon2, bcrypt ou scrypt.',
    },
    {
      id: 'sha256-faq-6',
      question: 'Comment Bitcoin utilise-t-il SHA-256 ?',
      answer:
        'Pour la preuve de travail du minage (`SHA-256(SHA-256(entête))`) ainsi que pour les identifiants de transactions et arbres de Merkle.',
    },
    {
      id: 'sha256-faq-7',
      question: 'Quelle différence entre SHA-256 et SHA-512 ?',
      answer:
        'SHA-256 produit 256 bits (64 hex, 64 tours sur mots de 32 bits) contre 512 bits (128 hex, 80 tours sur mots de 64 bits) pour SHA-512.',
    },
    {
      id: 'sha256-faq-8',
      question: 'Comment SHA-256 se compare-t-il à MD5 et SHA-1 ?',
      answer:
        'MD5 (128 bits) et SHA-1 (160 bits) présentent des collisions pratiques et sont obsolètes en sécurité. SHA-256 (256 bits) constitue la référence actuelle.',
    },
    {
      id: 'sha256-faq-9',
      question: 'Qu’est-ce que la famille SHA-2 ?',
      answer:
        'Un ensemble de fonctions normalisées par le NIST (SHA-224, SHA-256, SHA-384, SHA-512) fondées sur Merkle–Damgård, distinct de SHA-3 (Keccak).',
    },
    {
      id: 'sha256-faq-10',
      question: 'Puis-je calculer un hash SHA-256 sans envoyer mon texte ?',
      answer:
        'Oui. L’API WebCrypto calcule l’empreinte localement dans votre navigateur sans aucun transfert réseau.',
    },
    {
      id: 'sha256-faq-11',
      question: 'La génération SHA-256 fait-elle appel à l’IA ?',
      answer:
        'Non. Elle applique uniquement les opérations binaires déterministes définies par FIPS PUB 180-4.',
    },
  ],
  guide: {
    title: 'Qu’est-ce que SHA-256 ? Sommes de contrôle et usages',
    description:
      'Vérifier un checksum SHA-256 sous Windows, macOS et Linux, effet avalanche et pourquoi privilégier Argon2 pour les mots de passe.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'SHA-256',
    forwardLabel: 'Calculer SHA-256',
    inverseLabel: 'Vérifier l’empreinte',
    outputLabel: 'Condensat SHA-256 (hex)',
    placeholder: 'Tapez ou collez un texte UTF-8 à hacher…',
    outputPlaceholder: 'L’empreinte de 64 caractères hex apparaîtra ici…',
    emptyOutput: 'Saisissez un texte pour calculer son condensat SHA-256.',
    insight:
      'SHA-256 produit une empreinte déterministe et irréversible de 256 bits (64 caractères hex). Utile pour l’intégrité ; utilisez Argon2 ou bcrypt pour les mots de passe.',
    technical: [
      { term: 'Algorithme', detail: 'SHA-256 (FIPS 180-4) via l’API WebCrypto SubtleCrypto' },
      { term: 'Format', detail: '256 bits représentés sur 64 chiffres hexadécimaux minuscules' },
      { term: 'Confidentialité', detail: 'Calcul local sur votre appareil sans envoi au serveur' },
    ],
    compareLabel: 'Vérifier le hash attendu',
    comparePlaceholder: 'Collez un SHA-256 de 64 caractères pour comparer',
    modeAriaLabel: 'Mode SHA-256',
    inputAriaLabel: 'Texte source',
    outputAriaLabel: 'Empreinte SHA-256 générée',
    swapLabel: 'Inverser',
    swapAriaLabel: 'Permuter les panneaux',
    metaAriaLabel: 'Métadonnées du hachage',
    byteAriaLabel: 'Inspecteur d’octets',
    historyTitle: 'Historique récent',
    historyAriaLabel: 'Entrées récentes',
    insightAriaLabel: 'Note technique',
    appliedPrefix: 'Correction appliquée :',
    checkInputMsg: 'Vérifiez votre saisie.',
    invalidInputMsg: 'Impossible de générer le condensat.',
    couldNotConvertMsg: 'Erreur lors du hachage.',
    detectedPrefix: 'Détecté :',
    validPrefix: 'Valide',
    digestPrefix: 'Comparaison :',
    digestSuffix: 'avec la sortie calculée.',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texte',
      'Percent-encoded': 'Encodé URL',
      'HTML entities': 'Entités HTML',
      Markup: 'Balisage',
    },
    engine: {
      bitsTpl: '{bits} bits',
      metaAlgorithm: 'Algorithme',
      metaOutput: 'Taille',
      metaHexChars: 'Caractères hex',
      metaInputBytes: 'Octets entrée',
      errHash: 'Impossible de calculer SHA-256 dans ce navigateur.',
      digestUnreadable: 'Format méconnu : 64 caractères hexadécimaux attendus pour SHA-256.',
      digestWrongNamedTpl: 'Cette empreinte ressemble à {algo} ({len} car.), pas à SHA-256 (64 car.).',
      digestWrongLenTpl: 'Longueur invalide ({len} caractères hex) ; SHA-256 en compte exactement 64.',
      digestMatch: 'Correspond exactement au condensat SHA-256 calculé.',
      digestMismatch: 'Non conforme : le condensat comparé diffère de la sortie actuelle.',
    },
  },
};
