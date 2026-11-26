import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'no-sleep-website',
  name: 'Garder l\'écran allumé (No Sleep Website)',
  seoTitle: 'Garder l\'écran allumé en ligne – No Sleep Website',
  description:
    'Site gratuit pour garder votre écran allumé en ligne. Empêchez la mise en veille automatique sur mobile, tablette ou PC directement dans votre navigateur.',
  tagline: 'Gardez votre écran éveillé dans le navigateur sans installer d\'application.',
  citation: {
    problem:
      'Utilisez cette page pour empêcher la mise en veille de l\'écran de votre téléphone, tablette ou ordinateur sans installer de logiciel ni modifier les réglages système.',
    nonGoal: 'contourner le bouton d\'alimentation, empêcher l\'extinction sur batterie critique ou fonctionner en arrière-plan.',
  },
  knowledge: {
    primaryConcepts: ['garder écran allumé', 'no sleep website'],
    realWorldUseCases: [
      'Garder l\'écran lisible en cuisinant devant une recette sans toucher le téléphone',
      'Éviter l\'extinction de l\'écran durant une présentation, démonstration ou réunion en ligne',
      'Maintenir un tableau de bord ou une documentation affichée sur un second écran',
      'Lire de longs articles ou tutoriels sans avoir à déverrouiller l\'appareil régulièrement',
    ],
    commonMistakes: [
      'Croire que le verrouillage reste actif après avoir changé d\'onglet ou réduit le navigateur',
      'Penser que l\'API navigateur annule le mode économie d\'énergie ou la fermeture du capot d\'un portable',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: 'Qu\'est-ce qu\'un site « no sleep » pour garder l\'écran allumé ?',
      answer:
        'C\'est une page web qui demande au système d\'exploitation de maintenir l\'affichage actif grâce à l\'API standard W3C Screen Wake Lock. Tant que l\'onglet reste ouvert et visible, il empêche la baisse de luminosité et la mise en veille automatique de l\'écran.',
    },
    {
      id: 'nsw-faq-2',
      question: 'Comment garder mon écran allumé en ligne ?',
      answer:
        'Ouvrez cette page puis cliquez ou appuyez sur Garder l\'écran allumé. Votre navigateur demande aussitôt un verrouillage d\'éveil. Tant que l\'onglet demeure visible au premier plan, l\'écran reste allumé sans interaction.',
    },
    {
      id: 'nsw-faq-3',
      question: 'Cet outil fonctionne-t-il sur Android ?',
      answer:
        'Oui. Il fonctionne nativement dans Google Chrome, Microsoft Edge, Brave, Samsung Internet et la majorité des navigateurs Chromium sous Android tant que l\'onglet reste visible.',
    },
    {
      id: 'nsw-faq-4',
      question: 'Fonctionne-t-il sur iPhone et iPad ?',
      answer:
        'Oui. Apple prend en charge l\'API Screen Wake Lock depuis iOS 16.4 et iPadOS 16.4 dans Safari et les navigateurs iOS basés sur WebKit, tant que la page reste ouverte et affichée.',
    },
    {
      id: 'nsw-faq-5',
      question: 'Puis-je empêcher l\'écran de mon ordinateur portable ou de bureau de s\'éteindre ?',
      answer:
        'Oui. Chrome, Edge et Safari sous Windows et macOS gèrent nativement Wake Lock, et Firefox depuis la version 126. Attention : fermer le capot d\'un portable déclenche toujours la mise en veille matérielle.',
    },
    {
      id: 'nsw-faq-6',
      question: 'La page reste-t-elle active si je change d\'onglet ou réduis la fenêtre ?',
      answer:
        'Non. Par mesure d\'économie d\'énergie, tous les navigateurs libèrent le verrouillage d\'écran dès qu\'un onglet est masqué. Dès que vous revenez sur cet onglet, l\'outil tente de réacquérir automatiquement le verrouillage.',
    },
    {
      id: 'nsw-faq-7',
      question: 'Garder l\'écran allumé consomme-t-il davantage de batterie ?',
      answer:
        'Oui. L\'écran allumé représente la principale dépense énergétique d\'un appareil mobile. Vous pouvez activer la protection batterie optionnelle dans Alertes et affichage afin de libérer l\'écran automatiquement sous 15 % de batterie.',
    },
    {
      id: 'nsw-faq-8',
      question: 'Ce service est-il gratuit et sans publicité intrusive ?',
      answer:
        'Oui. L\'outil est entièrement gratuit, sans création de compte, et fonctionne intégralement en local dans votre navigateur.',
    },
    {
      id: 'nsw-faq-9',
      question: 'Dois-je installer une application ou une extension ?',
      answer:
        'Non. L\'outil s\'appuie sur l\'API web standard intégrée aux navigateurs récents : il suffit d\'ouvrir la page.',
    },
    {
      id: 'nsw-faq-10',
      question: 'Pourquoi mon écran finit-il parfois par s\'éteindre malgré tout ?',
      answer:
        'Les modes d\'économie d\'énergie, les politiques système strictes, le bouton marche/arrêt ou la fermeture du capot ont priorité sur le navigateur. L\'outil détecte immédiatement toute perte de verrouillage et tente une reconnexion lorsque l\'onglet est visible.',
    },
  ],
  guide: {
    title: 'Comment garder votre écran allumé dans le navigateur',
    description: 'Fonctionnement de l\'API Screen Wake Lock, compatibilité par appareil, autonomie et limites système.',
    readMinutes: 6,
  },
  ui: {
    panelScreen: 'Écran',
    panelSession: 'Session',
    heroReady: 'Prêt',
    heroPlanned: 'Prévu',
    heroRemaining: 'Restant',
    heroAwakeFor: 'Éveillé depuis',
    heroTotalAwake: 'Durée totale',
    btnStart: 'Garder l\'écran allumé',
    btnStop: 'Arrêter',
    lockReady: 'Prêt quand vous l\'êtes.',
    lockHeld: 'Verrouillage d\'éveil maintenu par votre appareil.',
    lockLost: 'Verrouillage perdu. Reconnexion...',
    lockComplete: 'Session terminée.',
    lockUnsupported: 'Utilisez les réglages de votre appareil.',
    metaStarted: 'Début',
    metaEnds: 'Fin',
    btnAmbient: 'Mode ambiant',
    unsupTitle: 'Ce navigateur ne prend pas en charge Wake Lock.',
    keepAwakeFor: 'Maintenir actif pendant',
    sessionLengthAria: 'Durée de la session',
    durUntilStop: 'Jusqu\'à l\'arrêt',
    dur15m: '15 min',
    dur30m: '30 min',
    dur1h: '1 heure',
    dur2h: '2 heures',
    customLabel: 'Personnalisé',
    customPlaceholder: 'minutes',
    alertsSummary: 'Alertes et affichage',
    optChime: 'Signal sonore à la fin',
    optNotify: 'Notification navigateur à la fin',
    optGuard: 'Libérer sous 15 % de batterie',
    clockFormatAria: 'Format d\'heure',
    clockLabel: 'Horloge',
    ambSleeping: 'En veille',
    ambAwake: 'Allumé',
    ambReconnecting: 'Reconnexion',
    ambCompleted: 'Terminé',
    ambEndsAt: 'Termine à',
    ambBtnStart: 'Maintenir allumé',
    ambBtnDim: 'Assombrir',
    ambBtnExit: 'Quitter',
    unitMinShort: 'min',
    unitHourShort: 'h',
    todayPrefix: 'Aujourd\'hui : ',
    todayOne: 'session',
    todayMany: 'sessions',
    todayAwakeSuffix: 'allumé',
    titleActive: 'Actif · Garder l\'écran allumé',
    annLockLost: 'Verrouillage perdu. Reconnexion en cours.',
    annAcquireFail: 'Impossible d\'obtenir le verrouillage d\'écran.',
    annStartedTimed: 'Écran maintenu allumé pendant {dur}.',
    annStartedOpen: 'Écran maintenu allumé.',
    annCompleted: 'Session terminée après {dur}.',
    notifyTitle: 'Écran libéré',
    notifyBody: 'Votre session de {dur} est terminée.',
    batteryLabel: 'Batterie ',
    batteryCharging: ' en charge',
    batteryGuardStop: 'Arrêt à {pct} % de batterie pour préserver l\'autonomie.',
    hintIos: 'Sur iOS : Réglages > Luminosité et affichage > Verrouillage auto > Jamais.',
    hintAndroid: 'Sur Android : Paramètres > Affichage > Mise en veille de l\'écran.',
    hintMac: 'Sur macOS : Réglages Système > Écran verrouillé > Désactiver l\'écran.',
    hintWin: 'Sur Windows : Paramètres > Système > Marche/arrêt et batterie > Écran et veille.',
    hintOther: 'Réglez le délai d\'extinction dans les paramètres d\'affichage de votre appareil.',
  },
};
