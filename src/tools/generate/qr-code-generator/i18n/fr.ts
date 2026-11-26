import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'qr-code-generator',
  name: 'Générateur de Code QR',
  seoTitle: 'Générateur de Code QR en Ligne – Texte, URL, Wi-Fi et vCard',
  description:
    'Créez un code QR depuis du texte, une URL, un e-mail, un téléphone, un réseau Wi-Fi ou une fiche contact. Export PNG ou SVG sur votre appareil.',
  tagline: 'Codes QR pour URL, Wi-Fi, contact ou texte en PNG ou SVG localement.',
  knowledge: {
    primaryConcepts: ['génération de code QR', 'codes qr'],
    realWorldUseCases: [
      'Relier une affiche, un flyer ou une étiquette produit vers une page web',
      'Partager l’accès Wi-Fi aux invités sans dicter ni saisir le mot de passe',
      'Placer des coordonnées vCard sur une carte de visite ou signature e-mail',
      'Afficher un menu numérique ou formulaire sur table ou reçu',
    ],
    commonMistakes: [
      'Encoder une URL trop longue rendant le motif trop dense et difficile à lire',
      'Imprimer le code QR trop petit par rapport à la distance de scan',
      'Choisir une correction d’erreur faible sur une surface exposée aux frottements',
      'Couper la zone calme (marge blanche obligatoire autour du code QR)',
    ],
  },
  faqs: [
    {
      id: 'qr-code-generator-faq-1',
      question: 'Qu’est-ce qu’un code QR ?',
      answer:
        'Un code QR (Quick Response) est un code-barres carré composé de modules noirs et blancs. L’appareil photo d’un smartphone le décode quasi instantanément pour ouvrir un lien, rejoindre un réseau Wi-Fi ou enregistrer un contact.',
    },
    {
      id: 'qr-code-generator-faq-2',
      question: 'Comment utiliser ce générateur de code QR ?',
      answer:
        'Choisissez le type de contenu (texte, URL, e-mail, téléphone, Wi-Fi ou fiche contact), puis remplissez les champs. Le QR code apparaît à mesure que vous tapez. Téléchargez-le ensuite en PNG ou SVG ou copiez la chaîne générée.',
    },
    {
      id: 'qr-code-generator-faq-3',
      question: 'Quels types de données puis-je encoder ?',
      answer:
        'Six formats courants : texte brut, URL, adresse e-mail, numéro de téléphone, identifiants Wi-Fi et carte de contact vCard. Chaque format respecte la syntaxe attendue par les appareils photo mobiles.',
    },
    {
      id: 'qr-code-generator-faq-4',
      question: 'Comment créer un code QR Wi-Fi ?',
      answer:
        'Sélectionnez le type Wi-Fi, indiquez le nom du réseau (SSID), son mot de passe et le protocole de sécurité (généralement WPA/WPA2). Cochez Réseau masqué si le SSID n’est pas diffusé. Un scan propose alors de se connecter directement.',
    },
    {
      id: 'qr-code-generator-faq-5',
      question: 'Puis-je télécharger le code QR ?',
      answer:
        'Oui. Vous pouvez l’exporter en PNG pour les écrans et partages rapides, ou en fichier vectoriel SVG qui conserve une netteté parfaite à toute échelle pour l’impression.',
    },
    {
      id: 'qr-code-generator-faq-6',
      question: 'Quelle est la différence entre PNG et SVG ?',
      answer:
        'Le PNG est une image en pixels à définition fixe pouvant pixeliser si on l’agrandit fortement. Le SVG utilise des formes vectorielles nettes quelle que soit la taille d’impression sur affiche ou dépliant.',
    },
    {
      id: 'qr-code-generator-faq-7',
      question: 'Le générateur fonctionne-t-il hors ligne ?',
      answer:
        'Oui. Une fois la page chargée, aucune connexion n’est requise : toute la génération du QR code et des fichiers PNG/SVG s’exécute localement en JavaScript.',
    },
    {
      id: 'qr-code-generator-faq-8',
      question: 'Mes données restent-elles confidentielles ?',
      answer:
        'Oui. Tout ce que vous saisissez, y compris vos mots de passe Wi-Fi et coordonnées personnelles, reste strictement dans votre navigateur sans aucun envoi vers un serveur.',
    },
    {
      id: 'qr-code-generator-faq-9',
      question: 'Qu’est-ce que la correction d’erreur ?',
      answer:
        'Le code QR intègre des données redondantes permettant sa lecture même s’il est partiellement rayé, sali ou masqué. Plus le niveau (de Basse à Haute) est élevé, mieux il résiste aux dégâts mais plus le motif devient dense. Moyen convient le mieux par défaut.',
    },
    {
      id: 'qr-code-generator-faq-10',
      question: 'Quel niveau de correction d’erreur choisir ?',
      answer:
        'Moyen (15%) convient à la majorité des usages. Utilisez Quartile ou Haute pour une petite impression, une surface exposée ou l’ajout d’un logo, et Basse uniquement lorsque l’espace est très contraint sur support parfaitement propre.',
    },
    {
      id: 'qr-code-generator-faq-11',
      question: 'Puis-je créer un code QR pour une URL ?',
      answer:
        'Oui. Choisissez le type URL et collez votre lien complet. Privilégiez des URL courtes pour garder un motif aéré et plus rapide à scanner sur smartphone.',
    },
    {
      id: 'qr-code-generator-faq-12',
      question: 'Comment faire un QR code pour une fiche contact ?',
      answer:
        'Sélectionnez Carte de contact puis renseignez le nom complet, le téléphone, l’e-mail et l’organisation éventuelle. Le QR génère une fiche vCard standard reconnue par les carnets d’adresses.',
    },
    {
      id: 'qr-code-generator-faq-13',
      question: 'Pourquoi mon code QR ne se scanne-t-il pas ?',
      answer:
        'Les causes fréquentes sont un texte trop long, une taille d’impression insuffisante, un manque de contraste ou l’absence de marge blanche autour du motif. Raccourcissez le contenu, agrandissez l’impression et préservez la bordure claire.',
    },
    {
      id: 'qr-code-generator-faq-14',
      question: 'Quelle taille minimale prévoir à l’impression ?',
      answer:
        'Prévoyez au moins 2 × 2 cm pour une URL courte scannée de près, et davantage si le code est dense ou lu à distance. Testez toujours avec un téléphone avant un tirage en série.',
    },
    {
      id: 'qr-code-generator-faq-15',
      question: 'Qu’est-ce que la zone calme (quiet zone) ?',
      answer:
        'C’est la marge blanche vierge entourant le QR code, indispensable pour que les lecteurs repèrent ses bords. Les exports PNG et SVG l’incluent déjà automatiquement : ne la rognez pas.',
    },
    {
      id: 'qr-code-generator-faq-16',
      question: 'Puis-je modifier un code QR après l’avoir imprimé ?',
      answer:
        'Non. Un QR code généré ici est statique : son contenu est gravé dans le dessin. Pour changer de destination sans réimprimer, encodez une URL de redirection que vous contrôlez.',
    },
    {
      id: 'qr-code-generator-faq-17',
      question: 'Les codes QR expirent-ils ?',
      answer:
        'Jamais. Le code contient directement vos données sans passer par un intermédiaire payant. Il ne cesse de fonctionner que si le lien web ou le mot de passe Wi-Fi sous-jacent change.',
    },
    {
      id: 'qr-code-generator-faq-18',
      question: 'Quelle quantité de texte un code QR peut-il contenir ?',
      answer:
        'Jusqu’à plusieurs milliers de caractères en théorie, mais moins il y a de données, mieux le code se lit. Gardez textes et liens concis pour préserver une grille lisible.',
    },
    {
      id: 'qr-code-generator-faq-25',
      question: 'Un code QR accepte-t-il les accents, emojis et autres écritures ?',
      answer:
        'Oui. L’encodage utilise UTF-8 : accents, emojis et alphabets chinois, japonais, arabe ou cyrillique sont restitués à l’identique. Comme ces caractères occupent 2 à 4 octets, la grille se densifie plus vite qu’en ASCII simple.',
    },
    {
      id: 'qr-code-generator-faq-19',
      question: 'Puis-je copier le texte encodé au lieu de télécharger l’image ?',
      answer:
        'Oui. Le bouton Copier copie la chaîne exacte encodée dans le motif (URL complète ou chaîne Wi-Fi) pour la vérifier ou la réutiliser ailleurs.',
    },
    {
      id: 'qr-code-generator-faq-20',
      question: 'Les codes QR sont-ils gratuits et sans filigrane ?',
      answer:
        'Oui. Tous vos exports sont utilisables librement à titre personnel ou commercial, sans compte, sans frais et sans filigrane.',
    },
    {
      id: 'qr-code-generator-faq-21',
      question: 'Quels navigateurs sont compatibles ?',
      answer:
        'Tous les navigateurs récents sur ordinateur et mobile : Chrome, Firefox, Safari et Edge. Les fichiers PNG et SVG s’ouvrent dans tout logiciel de mise en page.',
    },
    {
      id: 'qr-code-generator-faq-22',
      question: 'Le code QR fonctionne-t-il en mode sombre ?',
      answer:
        'Oui. Le motif reste toujours dessiné en modules sombres sur fond blanc, quel que soit le thème du site, afin de garantir un contraste fiable pour toutes les caméras.',
    },
    {
      id: 'qr-code-generator-faq-23',
      question: 'L’outil conserve-t-il ce que je saisis ?',
      answer:
        'Seuls vos réglages d’interface (type de contenu et niveau de correction) sont mémorisés localement. Vos textes, identifiants Wi-Fi et images générées ne sont jamais sauvegardés.',
    },
    {
      id: 'qr-code-generator-faq-24',
      question: 'Une donnée est-elle envoyée ou partagée avec des tiers ?',
      answer:
        'Non. Aucun compte, aucun appel serveur ni suivi analytique de vos saisies : tout se passe localement dans votre navigateur.',
    },
  ],
  guide: {
    title: 'Comment créer un code QR : guide complet',
    description:
      'Comment fonctionnent les codes QR, la correction d’erreur et la création de codes pour texte, URL, Wi-Fi et contacts directement dans le navigateur.',
    readMinutes: 9,
  },
  fields: {
    contentType: {
      label: 'Contenu',
      options: {
        text: 'Texte',
        url: 'URL',
        email: 'E-mail',
        phone: 'Téléphone',
        wifi: 'Wi-Fi',
        vcard: 'Fiche contact',
      },
    },
    text: {
      label: 'Valeur',
      placeholder: 'Texte, https://exemple.fr, nom@exemple.fr ou +33 6 00 00 00 00',
      help: 'Ce que le code QR va contenir.',
    },
    ssid: { label: 'Nom du réseau (SSID)', placeholder: 'MonReseau' },
    wifiPassword: { label: 'Mot de passe Wi-Fi', placeholder: 'Mot de passe du réseau' },
    encryption: {
      label: 'Sécurité',
      options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'Aucune' },
    },
    hidden: { label: 'Réseau masqué' },
    fullName: { label: 'Nom complet', placeholder: 'Ada Lovelace' },
    vcardPhone: { label: 'Téléphone', placeholder: '+33 6 00 00 00 00' },
    vcardEmail: { label: 'E-mail', placeholder: 'nom@exemple.fr' },
    org: { label: 'Organisation', placeholder: 'Entreprise (facultatif)' },
    errorCorrection: {
      label: 'Correction d’erreur',
      group: 'Options',
      options: {
        L: 'Basse (7%)',
        M: 'Moyenne (15%)',
        Q: 'Quartile (25%)',
        H: 'Haute (30%)',
      },
    },
  },
  ui: {
    emptyText: 'Configurez le contenu pour générer votre code QR.',
    engine: {
      enterContent: 'Saisissez le contenu à encoder.',
      tooMuchTpl: 'Trop de données pour un code QR ({bytes} octets ; limite au niveau {level} : {limit}). Raccourcissez le texte ou baissez la correction.',
      modulesLabel: 'Modules',
      ecLabel: 'Correction d’erreur',
    },
  },
};
