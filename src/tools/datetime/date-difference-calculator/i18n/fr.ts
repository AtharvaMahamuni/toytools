import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'date-difference-calculator',
  name: 'Calculateur d’Écart entre Dates',
  seoTitle: 'Calculateur de Jours entre Deux Dates en Ligne',
  description:
    'Calculez la durée exacte entre deux dates en années, mois et jours, le total de semaines et les jours ouvrés du lundi au vendredi dans votre navigateur.',
  tagline: 'Temps exact entre deux dates, y compris jours ouvrés.',
  craft: {
    solves:
      'Confondre durée calendaire et jours ouvrables inclus entraîne souvent des erreurs d’un jour sur les réservations ou échéances.',
  },
  knowledge: {
    primaryConcepts: ['écart entre dates', 'jours entre deux dates', 'durée calendaire'],
    realWorldUseCases: [
      'Compter les jours restants avant une échéance ou un événement',
      'Mesurer un projet en semaines complètes et jours ouvrés',
      'Calculer précisément combien de temps s’est écoulé depuis une date',
    ],
    commonMistakes: [
      'Compter chaque mois à 30 jours au lieu des mois réels du calendrier',
      'Compter des jours calendaires quand une tâche dépend des jours ouvrés',
      'Croire que l’inversion des deux dates modifie la durée totale',
    ],
  },
  fields: {
    startDate: { label: 'Date de début' },
    endDate: { label: 'Date de fin' },
  },
  faqs: [
    {
      id: 'date-difference-calculator-faq-1',
      question: 'Combien de jours séparent deux dates ?',
      answer:
        'Indiquez la date de début et de fin pour obtenir le nombre exact de jours calendaires, les semaines complètes et le détail ans/mois/jours avec années bissextiles.',
    },
    {
      id: 'date-difference-calculator-faq-2',
      question: 'Combien de jours ouvrés y a-t-il entre ces dates ?',
      answer:
        'Le décompte compte les jours du lundi au vendredi dans la plage en excluant les week-ends (hors jours fériés nationaux).',
    },
    {
      id: 'date-difference-calculator-faq-3',
      question: 'À combien de semaines et de mois cela correspond-il ?',
      answer:
        'Le total en semaines indique les tranches complètes de 7 jours ; la décomposition en mois respecte la longueur réelle de chaque mois depuis la date de départ.',
    },
    {
      id: 'date-difference-calculator-faq-4',
      question: 'L’ordre des dates a-t-il une importance ?',
      answer:
        'Non. L’outil mesure la même durée absolue dans les deux sens et signale simplement si les dates sont inversées.',
    },
  ],
  guide: {
    title: 'Compter les jours et jours ouvrés entre dates',
    description:
      'Calcul calendaire réel mois par mois, semaines complètes et distinction entre jours calendaires et ouvrables.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Choisissez une date de début et de fin pour calculer l’écart.',
    engine: {
      fieldStartDate: 'Date de début',
      fieldEndDate: 'Date de fin',
      heroLabel: 'Durée entre les dates',
      listSep: ', ',
      units: {
        year: ['an', 'ans'],
        month: ['mois', 'mois'],
        day: ['jour', 'jours'],
        week: ['semaine', 'semaines'],
        'business day': ['jour ouvré', 'jours ouvrés'],
      },
      months: [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      ],
      weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      dateTpl: '{d} {m} {y}',
      totalDaysNoteTpl: '{n} au total',
      cardTotalDays: 'Jours totaux',
      cardTotalWeeks: 'Semaines complètes',
      cardTotalMonths: 'Mois complets',
      cardWeekdays: 'Jours ouvrés (L–V)',
      weekendNoteTpl: '{n} jours de week-end',
      insightDowTpl: 'Le début tombe un {start} et la fin un {end}.',
      insightSameDay: 'Les deux dates correspondent au même jour.',
      insightWeeksDaysTpl: 'Équivaut à {weeks} et {days}.',
      insightReversed: 'La date de fin précède celle de début ; durée positive affichée.',
      insightBusinessTpl: 'Hors week-ends, cela représente {days}.',
      msWeek: 'Au moins 1 semaine complète',
      msYear: 'Au moins 1 année complète',
      decAge: 'Calculer un âge exact depuis une naissance',
      decUnix: 'Convertir ces dates en timestamp Unix',
      nextQuestions: [
        'Quels jours fériés tombent dans cet intervalle ?',
        'Combien d’heures ou de secondes représente ce délai ?',
        'Quel âge exact correspond à cette période ?',
      ],
      explanationTpl: 'Entre le {from} et le {to}, il y a {phrase} (soit {totalDays} jours au total).',
    },
  },
};
