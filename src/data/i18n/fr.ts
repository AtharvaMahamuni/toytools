import type { SiteUiStrings } from '@lib/i18n/types';

export const FR_UI: SiteUiStrings = {
  locale: 'fr',
  nav: {
    home: 'ToyTools',
    homeAria: 'Accueil ToyTools',
    searchPlaceholder: 'Rechercher un outil',
    searchAria: 'Rechercher des outils',
    changelogAria: 'voir le journal des modifications',
    languageLabel: 'Langue',
    languageAria: 'Choisir la langue',
    themeLabel: 'Thème',
  },
  footer: {
    lightweight: 'Léger',
    lightweightTip: 'Chargement rapide. Sans complexité inutile. Conçu pour aller à l\'essentiel.',
    privateLabel: 'Privé',
    privacyByVariant: {
      private: 'Ce que vous saisissez reste sur votre appareil.',
      offline: 'Fonctionne hors ligne après le premier chargement.',
      local: 'Aucune synchronisation, aucun cloud. Vos données restent sur cet appareil.',
      lookup: 'Votre navigateur interroge un service écho IP. ToyTools ne voit jamais la réponse.',
    },
    contactAndFeedback: 'Contact et commentaires',
    platform: 'Plateforme',
    about: 'À propos',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    changelog: 'Nouveautés',
    settings: 'Paramètres',
    shortcuts: 'Raccourcis',
    siteInfoAria: 'Informations du site',
    madeBy: 'Conçu par',
  },
  tool: {
    moreAbout: 'En savoir plus',
    moreAboutAria: 'En savoir plus sur {name}',
    usesOf: 'Usages de {concept}',
    pitfallsOf: 'Erreurs courantes avec {concept}',
    questionsOf: 'Questions sur {concept}',
    relatedTo: 'Outils liés à {concept}',
    allCategory: 'Tous les outils {category}',
    methodPrefix: 'Méthode',
    poweredBy: 'Propulsé par ToyTools',
    poweredByTitle: 'Fonctionnement de cet outil',
    clearSavedInput: 'Effacer la saisie enregistrée',
    guideFallback: 'Guide',
    favoriteAria: 'Ajouter aux favoris',
    installLabel: 'Installer',
    currency: 'EUR',
  },
  guide: {
    openTool: 'Ouvrir l\'outil',
    backToTool: 'Ouvrir {name}',
    readTimeSuffix: 'min de lecture',
    updatedPrefix: 'Mis à jour',
    inCategory: 'Catégorie',
    relatedHeading: 'Outils associés',
  },
  category: {
    toolCountSingular: 'outil',
    toolCountPlural: 'outils',
    guidesHeading: 'Guides de cette catégorie',
    toolsHeading: 'Tous les outils',
    builtOn: 'Basé sur',
  },
  home: {
    title: 'Outils en Ligne Gratuits : Calculer, Convertir, Formater',
    description:
      'Utilitaires web rapides et privés pour texte, calcul, dates, code, design et productivité. Exécution directe dans votre navigateur.',
    h1: 'Des outils en ligne utiles et privés',
    subtitle: 'Des utilitaires gratuits exécutés directement dans votre navigateur. Ce que vous saisissez reste sur votre appareil.',
    browseCategories: 'Parcourir les catégories',
    featuredTools: 'Outils populaires',
    viewAll: 'Tout voir',
  },
  titles: {
    home: 'Outils en Ligne Gratuits : Calculer, Convertir, Formater',
    guideSuffix: 'Guide',
    faqSuffix: 'FAQ',
    search: 'Rechercher',
    platform: 'La plateforme derrière les outils',
    feedback: 'Contact et commentaires',
    privacy: 'Confidentialité',
    terms: 'Conditions d\'utilisation',
    about: 'À propos',
    changelog: 'Nouveautés',
    settings: 'Paramètres',
    offline: 'Hors ligne',
    notFound: 'Page introuvable',
  },
  categories: {
    'text-utilities': {
      name: 'Outils Texte',
      description: 'Comptez, transformez, nettoyez et comparez vos textes directement dans le navigateur.',
      tagline: 'Compter, convertir, nettoyer et comparer du texte.',
      intro: [
        'Les outils texte répondent à trois besoins distincts souvent confondus. Compter indique le volume exact : mots, caractères, lignes ou temps de lecture. Transformer modifie la casse ou génère des slugs d\'URL. Nettoyer supprime ce qui reste invisible : tabulations parasites, doubles espaces, lignes vides ou caractères de largeur nulle.',
        'Chaque compteur précise clairement ses règles de décompte, car le nombre de mots ou de caractères avec espaces varie selon les plateformes. Tout est calculé localement sur votre appareil sans aucun envoi vers un serveur.',
      ],
    },
    'number-utilities': {
      name: 'Outils Numériques',
      description: 'Calculez pourcentages, remises, pourboires, marges et opérations mathématiques instantanément.',
      tagline: 'Pourcentages, remises, marges et calcul quotidien.',
      intro: [
        'Des calculs fréquents où il est facile de se tromper de base : pourcentage d\'écart, remise commerciale, TVA, marge et taux de marque.',
        'La distinction entre marge et majoration (markup) évite les erreurs de tarification : nos calculateurs affichent les étapes intermédiaires en même temps que le résultat.',
      ],
    },
    'developer-utilities': {
      name: 'Outils Développeurs',
      description: 'Formatez et validez du JSON, encodez en Base64, calculez des empreintes et inspectez des sous-réseaux.',
      tagline: 'Formater, encoder, valider et inspecter des données.',
      intro: [
        'Le pôle technique du site regroupe les opérations quotidiennes des développeurs : indenter et valider des charges JSON, convertir vers CSV ou YAML, explorer des arbres JSON ou comparer deux fichiers.',
        'S\'ajoutent les paires d\'encodage (Base64, URL, entités HTML, Punycode), le calcul de hachages, la lecture de jetons JWT et les outils réseau IPv4.',
      ],
    },
    productivity: {
      name: 'Productivité',
      description: 'Minuteur Pomodoro, maintien d\'écran allumé, bloc-notes et liste de tâches locaux.',
      tagline: 'Concentration, suivi et maintien d\'écran actif.',
      intro: [
        'Un ensemble ciblé d\'outils pour rester concentré : minuteur Pomodoro, bloc-notes local, liste de tâches, suivi d\'habitudes et maintien d\'écran éveillé.',
        'L\'ensemble fonctionne exclusivement dans le stockage local de votre navigateur sur cet appareil, sans compte ni cloud.',
      ],
    },
    'money-finance': {
      name: 'Finances et Argent',
      description: 'Calculez intérêts composés, épargne, mensualités et inflation avec des hypothèses claires.',
      tagline: 'Intérêts composés, épargne et inflation projetés.',
      intro: [
        'Intérêts composés, objectifs d\'épargne, remboursement d\'emprunt et inflation reposent sur l\'évolution de la valeur de l\'argent dans le temps.',
        'La fréquence de capitalisation modifie sensiblement le total final : chaque outil affiche ses hypothèses plutôt que de les masquer.',
      ],
    },
    generate: {
      name: 'Générateurs',
      description: 'Générez des mots de passe sûrs, UUID, codes QR et textes factices directement en local.',
      tagline: 'Mots de passe, UUID, codes QR et textes de test.',
      intro: [
        'Des générateurs alimentés par l\'API cryptographique native de votre navigateur pour créer des mots de passe robustes, des UUID et des codes QR instantanés sans aucun journal serveur.',
      ],
    },
    physics: {
      name: 'Physique',
      headline: 'Simulations de Physique',
      description: 'Simulations interactives de physique sur les ondes, oscillations, mécanique, chaleur et circuits.',
      tagline: 'Mouvement, ondes, chaleur et circuits interactifs.',
      intro: [
        'Des simulations interactives à manipuler directement pour observer comment les grandeurs physiques réagissent en temps réel avec la formule correspondante.',
      ],
    },
    'applied-math': {
      name: 'Mathématiques Appliquées',
      headline: 'Calculateurs et Simulations Mathématiques',
      description: 'Résolvez triangles, matrices, fractions, équations quadratiques et explorez trigonométrie et probabilités.',
      tagline: 'Triangles, matrices, fractions, probabilités et trigonométrie.',
      intro: [
        'Des outils mathématiques visuels et analytiques avec étapes de résolution détaillées et graphiques interactifs dans le navigateur.',
      ],
    },
    chemistry: {
      name: 'Chimie',
      headline: 'Simulations de Chimie',
      description: 'Simulations interactives de chimie organique, liaisons, géométrie VSEPR et cinétique chimique.',
      tagline: 'Conformères, liaisons, géométrie VSEPR et cinétique.',
      intro: [
        'Manipulez projections de Newman, diagrammes de champ cristallin et géométries moléculaires directement dans votre navigateur sans connexion serveur.',
      ],
    },
    'date-time': {
      name: 'Date et Heure',
      description: 'Calculez âges, durées, fuseaux horaires, timestamps Unix et cycles de sommeil.',
      tagline: 'Durées, fuseaux horaires, timestamps Unix et calendrier.',
      intro: [
        'Convertissez instantanément des timestamps Unix en secondes ou millisecondes, comparez des fuseaux horaires avec gestion des changements d\'heure et calculez des intervalles exacts.',
      ],
    },
    'health-fitness': {
      name: 'Santé et Forme',
      description: 'Calculez IMC, besoins caloriques, métabolisme de base et macronutriments selon les formules publiées.',
      tagline: 'IMC, calories, macronutriments et entraînement.',
      intro: [
        'Des calculateurs de santé basés sur des équations scientifiques publiées et nommées sur chaque page. Les indicateurs comme l\'IMC sont des repères statistiques et ne remplacent pas un avis médical.',
      ],
    },
    'design-tools': {
      name: 'Design et CSS',
      description: 'Convertissez des couleurs, vérifiez le contraste WCAG, calculez ratios d\'aspect et unités CSS.',
      tagline: 'Couleurs, contraste WCAG, ratios d\'image et CSS.',
      intro: [
        'Des utilitaires précis pour passer de la maquette au CSS : conversion HEX/RGB/HSL/OKLCH, audit de contraste WCAG AA/AAA, calcul de ratio d\'aspect et conversion px vers rem.',
      ],
    },
    'music-audio': {
      name: 'Musique et Audio',
      description: 'Concevez des réglages d\'égaliseur audio selon le rendu recherché.',
      tagline: 'Réglages d\'égaliseur clairs et exploitables.',
      intro: [
        'Générez des courbes d\'égalisation par bande de fréquences adaptées à votre écoute sans modifier ni écouter votre flux audio.',
      ],
    },
    fidgets: {
      name: 'Objets Anti-stress',
      headline: 'Jouets Anti-stress en Ligne',
      description: 'Surfaces tactiles interactives dans le navigateur avec son et vibrations haptiques en option.',
      tagline: 'Jouets anti-stress en ligne sans application.',
      intro: [
        'Des surfaces tactiles simples (boutons, engrenages, bulles) accessibles sans installation, respectant la préférence de réduction des mouvements.',
      ],
    },
    prep: {
      name: 'Préparation pour IA',
      description: 'Préparez, nettoyez et structurez vos textes et schémas JSON avant de les soumettre à un modèle.',
      tagline: 'Préparez textes et contextes localement.',
      intro: [
        'Outils déterministes pour structurer des prompts, nettoyer des historiques de conversation et vérifier la taille de contexte sans appeler d\'API externe.',
      ],
    },
    games: {
      name: 'Jeux',
      headline: 'Jeux à Deux sur un Appareil',
      description: 'Jeux de plateau locaux pour deux personnes sur le même écran, sans compte.',
      tagline: 'Deux joueurs, un écran, sans inscription.',
      intro: [
        'Des jeux classiques au tour par tour pensés pour deux personnes partageant un même téléphone ou ordinateur, sans compte ni suivi.',
      ],
    },
  },
};
