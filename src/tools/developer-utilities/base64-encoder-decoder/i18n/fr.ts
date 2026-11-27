import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'base64-encoder-decoder',
  name: 'Encodeur & Décodeur Base64',
  seoTitle: 'Encoder et Décoder Base64 en Ligne Gratuit',
  description:
    'Convertissez du texte UTF-8 en Base64 et décodez Base64 ou Base64URL directement dans votre navigateur. Détection auto et correction de padding locales.',
  tagline: 'Encodez et décodez instantanément Base64 et texte brut.',
  craft: {
    solves:
      'Un préfixe Data URI, du Base64URL sans remplissage ou un espace parasite font souvent échouer le décodage et ressemblent à un bug de l’outil.',
  },
  knowledge: {
    primaryConcepts: ['Base64'],
    realWorldUseCases: [
      'Intégrer de petites images en Data URI dans du HTML ou CSS',
      'Transporter des données binaires dans une réponse JSON',
      'Inspecter l’en-tête et la charge utile d’un jeton JWT',
      'Encoder des pièces jointes pour les protocoles texte comme SMTP',
    ],
    commonMistakes: [
      'Prendre le Base64 pour un chiffrement sécurisé',
      'Oublier que le Base64 augmente la taille d’environ 33 %',
    ],
  },
  faqs: [
    {
      id: 'b64-faq-1',
      question: 'Qu’est-ce que le Base64 ?',
      answer:
        'Un encodage binaire-texte convertissant n’importe quelle suite d’octets en 64 caractères ASCII imprimables (`A–Z`, `a–z`, `0–9`, `+`, `/`) complétés par `=` pour traverser les canaux texte.',
    },
    {
      id: 'b64-faq-2',
      question: 'Comment encoder du texte en Base64 ?',
      answer:
        'Collez votre texte en entrée puis choisissez « Encoder → Base64 ». Le résultat UTF-8 apparaît immédiatement prêt à copier.',
    },
    {
      id: 'b64-faq-3',
      question: 'Comment décoder du Base64 vers du texte ?',
      answer:
        'Collez la chaîne Base64 et sélectionnez « Décoder ← Base64 ». Si l’entrée contient un en-tête Data URI ou du Base64URL, un bouton propose la réparation en un clic.',
    },
    {
      id: 'b64-faq-4',
      question: 'Le Base64 est-il une forme de chiffrement ?',
      answer:
        'Non. C’est un simple encodage réversible sans clé secrète : n’importe qui peut le décoder aussitôt. Utilisez AES ou TLS pour protéger la confidentialité.',
    },
    {
      id: 'b64-faq-5',
      question: 'Les données encodées en Base64 sont-elles confidentielles ?',
      answer:
        'Non, le Base64 n’apporte aucune sécurité. Il sert à transporter des données sans corruption, jamais à protéger des secrets.',
    },
    {
      id: 'b64-faq-6',
      question: 'Pourquoi une chaîne Base64 finit-elle parfois par "=" ou "==" ?',
      answer:
        'Le Base64 découpe l’entrée par blocs de 3 octets. Lorsque la longueur n’est pas multiple de 3, un ou deux `=` complètent le dernier bloc de 4 caractères.',
    },
    {
      id: 'b64-faq-7',
      question: 'Qu’est-ce que Base64URL par rapport au Base64 standard ?',
      answer:
        'Base64URL remplace `+` par `-` et `/` par `_` (et omet souvent `=`) pour passer sans échappement dans les URLs, noms de fichiers et jetons JWT.',
    },
    {
      id: 'b64-faq-8',
      question: 'Le Base64 peut-il encoder des images ou fichiers binaires ?',
      answer:
        'Oui, notamment via les Data URIs (`data:image/png;base64,...`) dans le code HTML/CSS. Cet outil traite directement les chaînes de texte et UTF-8.',
    },
    {
      id: 'b64-faq-9',
      question: 'Pourquoi la sortie Base64 est-elle plus lourde que l’original ?',
      answer:
        'Chaque groupe de 3 octets produit 4 caractères ASCII, soit une hausse d’environ 33 % en contrepartie de la compatibilité texte.',
    },
  ],
  guide: {
    title: 'Qu’est-ce que Base64 ? Padding & sécurité',
    description:
      'Comment 3 octets deviennent 4 caractères ASCII, surcoût de 33 % et pourquoi Base64 ne chiffre rien.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'Base64',
    forwardLabel: 'Encoder → Base64',
    inverseLabel: 'Décoder ← Base64',
    outputLabel: 'Sortie',
    placeholder: 'Collez du texte ou du Base64 ici…',
    outputPlaceholder: 'Le résultat s’affichera ici…',
    emptyOutput: 'Saisissez du texte ou une chaîne Base64 pour commencer.',
    insight:
      'Le Base64 représente des octets avec 64 caractères ASCII sûrs (~33 % plus lourd). Encodage réversible pour le transport, jamais du chiffrement.',
    technical: [
      { term: 'Encodage', detail: 'Octets UTF-8 vers alphabet RFC 4648 (A-Z, a-z, 0-9, +, /)' },
      { term: 'Expansion', detail: '4 caractères pour 3 octets (~33 % plus remplissage =)' },
      { term: 'Confidentialité', detail: 'Exécution 100 % locale dans votre navigateur sans serveur' },
    ],
    compareLabel: 'Comparer',
    comparePlaceholder: 'Valeur attendue optionnelle',
    modeAriaLabel: 'Mode de conversion',
    inputAriaLabel: 'Entrée',
    outputAriaLabel: 'Résultat converti',
    swapLabel: 'Inverser',
    swapAriaLabel: 'Permuter l’entrée et la sortie',
    metaAriaLabel: 'Métadonnées de conversion',
    byteAriaLabel: 'Inspecteur d’octets hexadécimal',
    historyTitle: 'Historique récent',
    historyAriaLabel: 'Entrées récentes',
    insightAriaLabel: 'Note technique',
    appliedPrefix: 'Correction appliquée :',
    checkInputMsg: 'Vérifiez l’entrée : caractères invalides pour le décodage.',
    invalidInputMsg: 'Entrée Base64 invalide.',
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
      errDecode: 'Impossible de décoder en Base64 valide.',
      errEncode: 'Impossible d’encoder en Base64.',
      errBadCharTpl: 'Caractère Base64 invalide « {ch} » à la position {pos}.',
      errBadPadTpl: 'Remplissage = inattendu près de la position {pos} ; uniquement admis en fin.',
      warnLen: 'La longueur sans remplissage n’est pas multiple de 4 ; un = manque peut-être.',
      recDataUri: 'Retirer le préfixe Data URI (data:...;base64,)',
      recBase64Url: 'Convertir Base64URL (- / _) vers Base64 standard',
      recPadding: 'Ajouter les caractères = manquants en fin de chaîne',
      metaInputBytes: 'Octets entrée',
      metaB64Length: 'Long. Base64',
      metaExpansion: 'Expansion',
    },
  },
};
