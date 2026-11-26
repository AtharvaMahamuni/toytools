import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'pomodoro-timer',
  name: 'Minuteur Pomodoro',
  seoTitle: 'Minuteur Pomodoro en ligne : Cycles de 25 minutes',
  description:
    'Minuteur Pomodoro gratuit en ligne : 25 minutes de concentration et 5 minutes de pause, ou rythme 50/10 personnalisable localement.',
  tagline: 'Restez concentré grâce aux sessions chronométrées et pauses régulières.',
  knowledge: {
    primaryConcepts: ['minuteur pomodoro', 'méthode pomodoro', 'minuteur de concentration'],
    realWorldUseCases: [
      'Rédiger des documents ou rapports par blocs chronométrés',
      'Réviser des cours avec pauses imposées pour consolider la mémoire',
      'Relire du code ou traiter une liste de tâches sans dispersion',
    ],
    commonMistakes: [
      'Sauter les pauses et épuiser sa concentration dès la deuxième heure',
      'Consulter ses messages ou réseaux sociaux pendant la pause de 5 minutes',
      'Lancer le minuteur sans avoir défini un objectif précis',
    ],
  },
  faqs: [
    {
      id: 'pt-faq-1',
      question: 'Qu\'est-ce qu\'un Pomodoro ?',
      answer:
        'Un Pomodoro est une session de travail chronométrée de 25 minutes suivie de 5 minutes de pause. Le nom vient du mot italien désignant la tomate, en référence au minuteur de cuisine utilisé par Francesco Cirillo.',
    },
    {
      id: 'pt-faq-2',
      question: 'Quelle est la durée d\'un cycle Pomodoro ?',
      answer:
        'Le cycle classique dure 25 minutes de travail et 5 minutes de pause courte. Après quatre sessions, on prend une pause longue de 15 minutes. Vous pouvez aussi régler le minuteur en 50/10 ou sur mesure.',
    },
    {
      id: 'pt-faq-3',
      question: 'Pourquoi cette méthode s\'appelle-t-elle Pomodoro ?',
      answer:
        'À la fin des années 1980, l\'étudiant italien Francesco Cirillo utilisait un minuteur de cuisine en forme de tomate (pomodoro) pour structurer ses révisions.',
    },
    {
      id: 'pt-faq-4',
      question: 'Puis-je personnaliser la durée des sessions ?',
      answer:
        'Oui. Cliquez sur Personnaliser pour définir la durée de concentration (1 à 180 min), la pause courte (1 à 60 min), la pause longue (1 à 120 min) et le nombre de sessions par cycle (1 à 12).',
    },
    {
      id: 'pt-faq-5',
      question: 'Puis-je passer en 50/10 au lieu de 25/5 ?',
      answer:
        'Oui. Ouvrez Personnaliser et réglez la session sur 50 minutes et la pause courte sur 10 minutes. Ce rythme convient souvent mieux au développement ou à la rédaction longue.',
    },
    {
      id: 'pt-faq-6',
      question: 'Combien de Pomodoros faire par jour ?',
      answer:
        'La plupart des personnes tiennent entre 6 et 12 blocs de 25 minutes par journée de travail intellectuel. Quatre sessions constituent déjà un bon objectif de départ.',
    },
    {
      id: 'pt-faq-7',
      question: 'Que faire pendant les pauses ?',
      answer:
        'Pendant 5 minutes : levez-vous, étirez-vous, regardez au loin et hydratez-vous. Évitez les messageries et réseaux sociaux pour laisser votre attention récupérer.',
    },
    {
      id: 'pt-faq-8',
      question: 'La méthode Pomodoro est-elle efficace pour étudier ?',
      answer:
        'Oui, notamment pour les tâches précises : lire un chapitre, résoudre une série d\'exercices ou réviser des fiches.',
    },
    {
      id: 'pt-faq-9',
      question: 'Le Pomodoro convient-il aux développeurs ?',
      answer:
        'Pour corriger des bogues ou relire du code, le format 25/5 est très efficace. Pour l\'architecture complexe, un format 50/10 ou 90/20 évite de couper le fil.',
    },
    {
      id: 'pt-faq-16',
      question: 'La technique Pomodoro aide-t-elle en cas de TDAH ?',
      answer:
        'Pour beaucoup de personnes avec un TDAH, délimiter la tâche à 15 ou 25 minutes abaisse la barrière de démarrage et les pauses évitent l\'épuisement lié à l\'hyperfocalisation.',
    },
    {
      id: 'pt-faq-17',
      question: 'Pomodoro ou time blocking : que choisir ?',
      answer:
        'Ils se complètent : le time blocking réserve les créneaux sur l\'agenda, tandis que le Pomodoro cadence l\'attention à l\'intérieur de chaque créneau.',
    },
    {
      id: 'pt-faq-18',
      question: 'La méthode Pomodoro est-elle vraiment efficace ?',
      answer:
        'Oui. Alterner effort délimité et récupération régulière limite la procrastination au démarrage et soutient l\'attention dans la durée.',
    },
    {
      id: 'pt-faq-14',
      question: 'À qui s\'adresse ce minuteur Pomodoro ?',
      answer:
        'Aux étudiants, rédacteurs, développeurs et travailleurs intellectuels qui souhaitent réduire les distractions et mesurer leur progression.',
    },
    {
      id: 'pt-faq-10',
      question: 'Ce minuteur fonctionne-t-il hors ligne ?',
      answer:
        'Oui. Une fois la page chargée, le décompte et l\'alerte sonore fonctionnent intégralement hors ligne.',
    },
    {
      id: 'pt-faq-11',
      question: 'ToyTools enregistre-t-il mes données sur un serveur ?',
      answer:
        'Non. Vos préférences et statistiques du jour restent exclusivement dans le stockage local de votre navigateur et sont exportables en JSON.',
    },
    {
      id: 'pt-faq-12',
      question: 'Le décompte continue-t-il si je change d\'onglet ?',
      answer:
        'Oui. Le minuteur s\'appuie sur l\'horodatage réel pour compenser automatiquement le ralentissement des onglets en arrière-plan.',
    },
    {
      id: 'pt-faq-13',
      question: 'Fonctionne-t-il sur smartphone ?',
      answer:
        'Oui, l\'interface est pensée mobile-first. Comme les navigateurs mobiles suspendent le script lorsque l\'écran se verrouille, associez-le si besoin à notre page Garder l\'écran allumé.',
    },
    {
      id: 'pt-faq-15',
      question: 'Puis-je l\'installer sur mon écran d\'accueil ?',
      answer:
        'Oui, utilisez le bouton Installer ou « Ajouter à l\'écran d\'accueil ». Vos réglages restent locaux sur cet appareil.',
    },
  ],
  guide: {
    title: 'La méthode Pomodoro : guide pratique complet',
    description: 'Fonctionnement d\'un cycle, variantes 50/10 et 90/20, adaptation TDAH et erreurs fréquentes.',
    readMinutes: 6,
  },
  ui: {
    btnCustomize: 'Personnaliser',
    lblFocusMins: 'Concentration',
    lblShortBreak: 'Pause courte',
    lblLongBreak: 'Pause longue',
    lblSessionsPerCycle: 'Sessions par cycle',
    unitMin: 'min',
    lblSound: 'Signal sonore à la fin',
    lblNotif: 'Notifications navigateur',
    lblAutoStart: 'Démarrer la phase suivante automatiquement',
    ariaModePrefix: 'Mode actuel :',
    ariaTimer: 'Minuteur Pomodoro',
    modeFocus: 'CONCENTRATION',
    modeShortBreak: 'PAUSE COURTE',
    modeLongBreak: 'PAUSE LONGUE',
    btnStart: 'Démarrer',
    btnPause: 'Pause',
    btnReset: 'Réinitialiser',
    msgFocusComplete: 'Session terminée ✓',
    ariaProgress: 'Progression des sessions',
    sessionInitial: 'Session 1 sur 4',
    sessionTpl: 'Session {n} sur {total}',
    btnFullScreen: 'Plein écran',
    btnRemoveDistractions: 'Sans distractions',
    ariaBackup: 'Sauvegarde',
    btnExportJson: 'Exporter JSON',
    btnImportJson: 'Importer JSON',
    lblPasteBackup: 'Collez le JSON de sauvegarde',
    ariaChooseFile: 'Choisir un fichier JSON',
    btnImport: 'Importer',
    statsInitial: 'Aujourd\'hui ● 0 sessions ● 0 minutes',
    todayWord: 'Aujourd\'hui',
    unitSessionOne: 'session',
    unitSessionMany: 'sessions',
    unitMinuteOne: 'minute',
    unitMinuteMany: 'minutes',
    ariaExitFs: 'Quitter le plein écran',
    dotDone: 'Session {i} : terminée',
    dotCurrent: 'Session {i} : en cours',
    dotRemaining: 'Session {i} : restante',
    notifBreakTitle: 'Temps de pause',
    notifBreakBody: 'Faites une pause. Appuyez pour revenir au minuteur.',
    notifFocusTitle: '● Pomodoro en cours',
    notifFocusBody: 'Session de travail active. Appuyez pour revenir.',
    msgFocusNotif: 'Session terminée. Place à la pause !',
    msgLongBreakNotif: 'Pause longue terminée. Au travail !',
    msgShortBreakNotif: 'Pause terminée. C\'est reparti !',
    msgRestored: 'Session restaurée. Appuyez sur Démarrer pour reprendre.',
  },
};
