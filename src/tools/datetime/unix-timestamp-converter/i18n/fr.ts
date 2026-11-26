import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'unix-timestamp-converter',
  name: 'Convertisseur de Timestamp Unix',
  seoTitle: 'Convertisseur Timestamp Unix – Epoch en Date et Inverse',
  description:
    'Convertissez un timestamp Unix (epoch) en date lisible ou inversement, en secondes ou millisecondes, avec heure UTC, ISO 8601 et heure locale.',
  tagline: 'Convertissez un timestamp Unix en date et inversement en secondes ou millisecondes.',
  knowledge: {
    primaryConcepts: ['conversion timestamp Unix', 'convertisseur epoch'],
    realWorldUseCases: [
      'Décoder un timestamp Unix issu d’un journal serveur, base de données ou réponse API.',
      'Transformer une date précise en timestamp pour une requête ou configuration.',
      'Vérifier si un horodatage reçu est exprimé en secondes ou en millisecondes.',
    ],
    commonMistakes: [
      'Lire un timestamp en millisecondes comme des secondes, projetant la date des millénaires dans le futur.',
      'Croire qu’un timestamp Unix dépend du fuseau local alors qu’il est toujours compté depuis UTC.',
      'Oublier que l’époque Unix débute le 1er janvier 1970 et que les dates antérieures sont négatives.',
    ],
  },
  faqs: [
    {
      id: 'unix-timestamp-converter-faq-1',
      question: 'Comment convertir un timestamp Unix en date ?',
      answer:
        'Laissez le sens sur « Timestamp vers date », collez le nombre et choisissez secondes ou millisecondes. L’outil affiche aussitôt l’heure UTC, la chaîne ISO 8601, votre heure locale et le jour de la semaine. Par exemple, 1700000000 secondes donne le mardi 14 novembre 2023 à 22:13:20 UTC.',
    },
    {
      id: 'unix-timestamp-converter-faq-2',
      question: 'Comment convertir une date en timestamp Unix ?',
      answer:
        'Passez en mode « Date vers timestamp » et saisissez la date et l’heure souhaitées. L’heure est interprétée en UTC afin d’obtenir exactement le même timestamp partout dans le monde, en secondes et en millisecondes.',
    },
    {
      id: 'unix-timestamp-converter-faq-3',
      question: 'Un timestamp Unix est-il en secondes ou en millisecondes ?',
      answer:
        'Les deux existent. L’horodatage Unix classique compte les secondes (10 chiffres aujourd’hui), tandis que JavaScript et de nombreuses API web utilisent les millisecondes (13 chiffres, 1000 fois plus grand). Si une date tombe dans des milliers d’années, changez l’unité en millisecondes.',
    },
    {
      id: 'unix-timestamp-converter-faq-4',
      question: 'Qu’est-ce que l’époque Unix (Unix epoch) ?',
      answer:
        'L’époque Unix est fixée au 1er janvier 1970 à 00:00:00 UTC. Un timestamp mesure simplement le nombre de secondes ou de millisecondes écoulées depuis cet instant ; les dates antérieures sont négatives et indépendantes de tout fuseau horaire.',
    },
    {
      id: 'unix-timestamp-converter-faq-5',
      question: 'Mes timestamps de base de données ou de logs sont-ils envoyés à un serveur ?',
      answer:
        'Non. Tous les calculs et le formatage ISO 8601 s’exécutent localement dans votre navigateur sans aucune transmission réseau.',
    },
  ],
  guide: {
    title: 'Comment convertir un timestamp Unix en date',
    description:
      'Comprendre le timestamp Unix, l’époque du 1er janvier 1970, la différence entre secondes et millisecondes et la conversion dans le navigateur.',
    readMinutes: 4,
  },
  fields: {
    mode: {
      label: 'Sens',
      options: {
        'to-date': 'Timestamp vers date',
        'to-timestamp': 'Date vers timestamp',
      },
    },
    timestamp: {
      label: 'Timestamp Unix',
      help: 'Saisissez un entier positif ou négatif.',
    },
    unit: {
      label: 'Unité du timestamp',
      options: {
        seconds: 'Secondes (10 chiffres aujourd’hui)',
        milliseconds: 'Millisecondes (13 chiffres aujourd’hui)',
      },
    },
    datetime: {
      label: 'Date et heure (UTC)',
      help: 'Interprétée en temps universel UTC.',
    },
  },
  ui: {
    emptyText: 'Entrez un timestamp Unix ou une date à convertir.',
    resultNote: 'Conversion instantanée sur votre appareil.',
    engine: {
      errEnterTs: 'Entrez un timestamp Unix à convertir en date.',
      errNotNumber: 'Le timestamp doit être un nombre valide.',
      errOutOfRange: 'Ce timestamp dépasse la plage prise en charge.',
      heroUtc: 'Heure UTC',
      labelLocal: 'Votre heure locale',
      labelWeekday: 'Jour de la semaine',
      labelMillis: 'En millisecondes',
      rightNow: 'à l’instant',
      unitSeconds: 'secondes',
      unitMillis: 'millisecondes',
      insightMillis: '13 chiffres ressemblent à des millisecondes. En millisecondes, cela donne {iso}. Passez l’unité sur Millisecondes.',
      insightUtc: 'En UTC, il est {time} le {date}.',
      insightRel: 'Cet instant est {rel}.',
      msAfterEpoch: 'Postérieur à l’époque Unix (1970)',
      ms32Bit: 'Dans la plage 32 bits en secondes',
      decTimezone: 'Convertir cet instant vers un autre fuseau horaire',
      decDiff: 'Compter les jours entre deux dates',
      nextQsToDate: [
        'Quelle heure est-il dans un autre fuseau ?',
        'Combien de jours séparent ces deux dates ?',
      ],
      explToDate: 'Un timestamp Unix compte les secondes écoulées depuis le 1er janvier 1970 UTC (époque Unix). {val} {unit} correspond à {iso}, soit {utc} UTC.',
      fieldDatetime: 'une date et une heure',
      heroUnix: 'Timestamp Unix',
      heroUnixNote: 'Secondes depuis le 1er janvier 1970 UTC',
      labelInterpreted: 'Interprété comme',
      noteUtc: 'Heure saisie lue en UTC',
      insightUtcInput: 'La date et l’heure saisies sont lues en UTC, donnant le même timestamp partout dans le monde.',
      decAge: 'Calculer votre âge exact',
      nextQsToTs: [
        'Quelle date correspond à un timestamp Unix ?',
        'Pourquoi la limite 32 bits arrive-t-elle en 2038 ?',
      ],
      explToTs: 'Lu en UTC, {utc} équivaut à {sec} secondes depuis le 1er janvier 1970, soit {ms} millisecondes.',
    },
  },
};
