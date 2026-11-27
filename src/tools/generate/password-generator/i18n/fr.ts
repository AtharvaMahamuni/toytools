import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'password-generator',
  name: 'Générateur de Mot de Passe',
  seoTitle: 'Générateur de Mot de Passe Fort en Ligne',
  description:
    'Créez des mots de passe aléatoires robustes avec longueur, jeux de caractères et calcul d’entropie en direct dans votre navigateur, sans envoi.',
  tagline: 'Mots de passe aléatoires forts avec estimation d’entropie en direct.',
  citation: {
    problem: 'Utilisez ce générateur pour créer un mot de passe aléatoire fort directement dans le navigateur.',
    nonGoal: 'enregistrer le mot de passe ni le transmettre à un serveur ou modèle d’IA.',
  },
  craft: {
    solves:
      'Lorsqu’un mot de passe est recopié à l’écran ou dicté au téléphone, O/0 et l/1 se confondent dans la plupart des polices.',
  },
  knowledge: {
    primaryConcepts: ['génération de mots de passe', 'robustesse et entropie'],
    realWorldUseCases: [
      'Créer un mot de passe unique pour un nouveau compte',
      'Remplacer un ancien mot de passe réutilisé',
      'Générer le mot de passe maître d’un coffre-fort',
      'Produire un identifiant temporaire pour un accès partagé',
    ],
    commonMistakes: [
      'Réutiliser le même mot de passe sur plusieurs services',
      'Choisir un mot de passe court en pensant que les symboles suffisent',
      'Noter les mots de passe dans un fichier texte non chiffré',
      'Désactiver presque tous les jeux de caractères et réduire le pool',
    ],
  },
  fields: {
    length: { label: 'Longueur', help: 'De 4 à 128 caractères. 16 caractères ou plus recommandés.' },
    uppercase: { label: 'Majuscules (A-Z)', group: 'Jeux de caractères' },
    lowercase: { label: 'Minuscules (a-z)', group: 'Jeux de caractères' },
    numbers: { label: 'Chiffres (0-9)', group: 'Jeux de caractères' },
    symbols: { label: 'Symboles (!@#$...)', group: 'Jeux de caractères' },
    excludeAmbiguous: { label: 'Exclure les caractères ambigus (0, O, 1, l, I)', group: 'Options' },
  },
  faqs: [
    {
      id: 'password-generator-faq-1',
      question: 'Qu’est-ce qu’un générateur de mot de passe ?',
      answer:
        'C’est un outil qui assemble un mot de passe aléatoire à partir des jeux de caractères choisis. Contrairement aux mots choisis par un humain, il ne suit aucun schéma prévisible.',
    },
    {
      id: 'password-generator-faq-2',
      question: 'Comment utiliser ce générateur ?',
      answer:
        'Indiquez la longueur puis activez majuscules, minuscules, chiffres et symboles selon vos besoins. Le mot de passe apparaît aussitôt ; cliquez sur Régénérer ou Copier.',
    },
    {
      id: 'password-generator-faq-3',
      question: 'Quelle longueur choisir pour un mot de passe ?',
      answer:
        'Plus il est long, plus il est sûr. Utilisez 16 caractères minimum pour les comptes courants et 20 ou plus pour votre messagerie ou gestionnaire de mots de passe.',
    },
    {
      id: 'password-generator-faq-4',
      question: 'Ce générateur en ligne est-il sûr ?',
      answer:
        'Oui. Chaque mot de passe est créé localement dans votre navigateur. Aucune donnée n’est envoyée sur le réseau ni stockée sur un serveur.',
    },
    {
      id: 'password-generator-faq-5',
      question: 'Fonctionne-t-il hors ligne ?',
      answer:
        'Oui. Une fois la page chargée, toute la génération s’exécute en JavaScript local sans connexion internet.',
    },
    {
      id: 'password-generator-faq-6',
      question: 'Les mots de passe sont-ils vraiment aléatoires ?',
      answer:
        'Il utilise l’API cryptographique Web Crypto (`crypto.getRandomValues`) sans biais de modulo, garantissant une probabilité identique pour chaque caractère du pool.',
    },
    {
      id: 'password-generator-faq-7',
      question: 'Qu’est-ce que l’entropie d’un mot de passe ?',
      answer:
        'L’entropie mesure en bits la difficulté de deviner un mot de passe. Chaque bit supplémentaire double le nombre d’essais requis : sous 40 bits c’est faible, 60 à 80 bits solide et 100 bits ou plus très fort.',
    },
    {
      id: 'password-generator-faq-8',
      question: 'Comment l’entropie est-elle calculée ?',
      answer:
        'C’est la longueur multipliée par le logarithme en base 2 de la taille du pool de caractères. Avec les quatre jeux actifs (~88 caractères) et 16 caractères, on dépasse 100 bits.',
    },
    {
      id: 'password-generator-faq-9',
      question: 'Que signifie l’indicateur de robustesse ?',
      answer:
        'Il résume l’entropie en clair : Très faible, Faible, Moyen, Fort ou Très fort. Visez au minimum Fort pour vos comptes importants.',
    },
    {
      id: 'password-generator-faq-10',
      question: 'Faut-il inclure des symboles ?',
      answer:
        'Oui si le site l’accepte, mais la longueur prime. Ajouter quatre caractères augmente bien davantage l’entropie que d’activer les symboles.',
    },
    {
      id: 'password-generator-faq-11',
      question: 'Que sont les caractères ambigus et pourquoi les exclure ?',
      answer:
        'Des caractères visuellement proches comme O et 0 ou l, I et 1. Les exclure évite les erreurs lorsque vous devez taper ou dicter le mot de passe manuellement.',
    },
    {
      id: 'password-generator-faq-12',
      question: 'Puis-je créer un mot de passe uniquement numérique ?',
      answer:
        'Oui, en désactivant lettres et symboles pour obtenir un code PIN aléatoire. Comme il n’y a que 10 chiffres possibles, augmentez sensiblement la longueur.',
    },
    {
      id: 'password-generator-faq-13',
      question: 'Pourquoi un site refuse-t-il mon mot de passe ?',
      answer:
        'Certains sites limitent la longueur maximale ou interdisent certains symboles. Adaptez la longueur autorisée ou retirez les symboles avant de régénérer.',
    },
    {
      id: 'password-generator-faq-14',
      question: 'Deux personnes peuvent-elles obtenir le même mot de passe ?',
      answer:
        'En théorie oui, mais la probabilité est infime : avec 16 caractères sur l’ensemble complet, il existe plus de 10^31 combinaisons.',
    },
    {
      id: 'password-generator-faq-15',
      question: 'Où enregistrer un mot de passe généré ?',
      answer:
        'Dans un gestionnaire de mots de passe chiffré. Évitez les fichiers texte non protégés, les notes ou les tableurs.',
    },
    {
      id: 'password-generator-faq-16',
      question: 'L’outil mémorise-t-il mes mots de passe ?',
      answer:
        'Non. Les mots de passe ne sont jamais sauvegardés. Seuls vos réglages d’interface restent en stockage local sur votre appareil.',
    },
    {
      id: 'password-generator-faq-17',
      question: 'Puis-je générer plusieurs mots de passe à la fois ?',
      answer:
        'Cet outil génère un mot de passe par tirage avec renouvellement instantané via Régénérer. Pour des listes en lot, le générateur de chaînes aléatoires est plus adapté.',
    },
    {
      id: 'password-generator-faq-18',
      question: 'Quelle différence entre mot de passe et phrase secrète ?',
      answer:
        'Le mot de passe mêle des caractères aléatoires, tandis que la phrase secrète assemble plusieurs mots au hasard plus faciles à mémoriser. Cet outil convient parfaitement aux gestionnaires.',
    },
    {
      id: 'password-generator-faq-19',
      question: 'Un mot de passe long vaut-il mieux qu’un court complexe ?',
      answer:
        'Presque toujours oui : 20 lettres minuscules offrent plus d’entropie que 10 caractères mêlant tous les symboles.',
    },
    {
      id: 'password-generator-faq-20',
      question: 'Sur quels navigateurs fonctionne-t-il ?',
      answer:
        'Tous les navigateurs récents sur ordinateur et mobile (Chrome, Firefox, Safari, Edge) dotés de l’API Web Crypto.',
    },
    {
      id: 'password-generator-faq-21',
      question: 'Puis-je l’utiliser pour des clés API ou jetons ?',
      answer:
        'Oui pour un secret ponctuel assez long, bien que le générateur de chaînes aléatoires offre plus de maîtrise de l’alphabet.',
    },
    {
      id: 'password-generator-faq-22',
      question: 'À quelle fréquence changer ses mots de passe ?',
      answer:
        'Uniquement en cas de fuite de données, de suspicion de compromission ou de réutilisation passée. Les rotations forcées régulières ne sont plus recommandées.',
    },
    {
      id: 'password-generator-faq-23',
      question: 'Le presse-papiers présente-t-il un risque ?',
      answer:
        'Un historique de presse-papiers peut conserver la valeur copiée. Après collage, copiez un texte anodin ou effacez votre historique.',
    },
    {
      id: 'password-generator-faq-24',
      question: 'Mes données sont-elles envoyées ou partagées ?',
      answer:
        'Non. Aucun compte, aucun appel serveur ni suivi sur ce que vous générez.',
    },
    {
      id: 'password-generator-faq-25',
      question: 'Est-ce un outil d’intelligence artificielle ?',
      answer:
        'Non. L’outil repose uniquement sur le générateur aléatoire cryptographique du navigateur sans appel à un modèle d’IA.',
    },
  ],
  guide: {
    title: 'Créer un mot de passe fort et comprendre l’entropie',
    description:
      'Pourquoi la longueur prime sur les symboles, comment se calcule l’entropie en bits et bonnes pratiques de stockage.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Réglez les options puis lancez la génération.',
    engine: {
      errNoSet: 'Activez au moins un jeu de caractères.',
      bitsTpl: '{bits} bits',
      charsTpl: '{n} car.',
      metaEntropy: 'Entropie',
      metaLength: 'Longueur',
      metaPool: 'Jeu total',
      strength: {
        veryWeak: 'Très faible',
        weak: 'Faible',
        fair: 'Moyen',
        strong: 'Fort',
        veryStrong: 'Très fort',
      },
    },
  },
};
