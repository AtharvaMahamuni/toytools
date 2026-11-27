import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'age-calculator',
  name: 'Calculateur d’Âge',
  seoTitle: 'Calculateur d’Âge Exact en Ans, Mois et Jours',
  description:
    'Calculez votre âge exact en années, mois et jours depuis votre date de naissance, ainsi que le total de jours vécus et le compte à rebours anniversaire.',
  tagline: 'Votre âge exact en ans, mois et jours avec décompte d’anniversaire.',
  craft: {
    solves:
      'Pour une naissance le 29 février, l’âge légal lors des années non bissextiles bascule au 28 février ou au 1er mars selon les juridictions.',
  },
  knowledge: {
    primaryConcepts: ['calcul d’âge', 'date de naissance', 'âge chronologique'],
    realWorldUseCases: [
      'Vérifier un âge exact pour un dossier administratif ou un seuil',
      'Calculer le nombre total de jours écoulés pour un anniversaire marquant',
      'Connaître son âge à une date passée ou future donnée',
    ],
    commonMistakes: [
      'Soustraire simplement les années sans tenir compte du mois et du jour',
      'Compter des mois uniformes de 30 jours au lieu des vrais mois civils',
      'Approcher par 365,25 jours au lieu des années bissextiles réelles',
    ],
  },
  fields: {
    birthDate: { label: 'Date de naissance' },
    asOf: { label: 'Âge à la date du', help: 'Laissez vide pour comparer à aujourd’hui.' },
  },
  faqs: [
    {
      id: 'age-calculator-faq-1',
      question: 'Comment est calculé mon âge exact ?',
      answer:
        'L’outil avance mois entiers et années complètes depuis la date de naissance sans dépasser la date de référence, puis compte les jours restants selon le calendrier réel et les années bissextiles.',
    },
    {
      id: 'age-calculator-faq-2',
      question: 'Puis-je connaître mon âge à une date passée ou future ?',
      answer:
        'Oui. Saisissez n’importe quelle date dans « Âge à la date du », ou laissez ce champ vide pour calculer à la date d’aujourd’hui.',
    },
    {
      id: 'age-calculator-faq-3',
      question: 'Comment sont gérées les naissances du 29 février ?',
      answer:
        'Les années ordinaires, l’anniversaire est rattaché au 28 février selon la convention civile la plus courante, y compris pour le compte à rebours.',
    },
    {
      id: 'age-calculator-faq-4',
      question: 'Pourquoi ne pas simplement soustraire l’année de naissance ?',
      answer:
        'Cette soustraction n’est exacte qu’après la date d’anniversaire dans l’année ; avant ce jour, elle surestime l’âge d’un an.',
    },
  ],
  guide: {
    title: 'Calculer son âge exact en ans, mois et jours',
    description:
      'Principe du calcul calendaire réel, cas particulier du 29 février et conversion en mois, semaines et jours.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Sélectionnez une date de naissance pour calculer l’âge.',
    engine: {
      fieldBirthDate: 'Date de naissance',
      fieldAsOf: 'Date de référence',
      errBirthAfterRef: 'La date de naissance ne peut pas être postérieure à la date de référence.',
      heroLabel: 'Âge exact',
      units: {
        year: ['an', 'ans'],
        month: ['mois', 'mois'],
        day: ['jour', 'jours'],
      },
      months: [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      ],
      weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      dateTpl: '{d} {m} {y}',
      cardMonths: 'Mois complets',
      cardWeeks: 'Semaines totales',
      cardDays: 'Jours vécus',
      cardNextBday: 'Prochain anniversaire',
      today: 'Aujourd’hui !',
      inDaysTpl: 'dans {days}',
      insightBornTpl: 'Vous êtes né(e) un {weekday}.',
      insightHappyBday: 'Joyeux anniversaire à cette date !',
      insightNextBdayTpl: 'Prochain anniversaire le {date} (dans {days}).',
      ms18: 'Majorité (18+)',
      msWithinMonth: 'Anniversaire dans moins de 30 jours',
      decDateDiff: 'Calculer l’écart entre deux autres dates',
      decUnix: 'Convertir une date en timestamp Unix',
      nextQuestions: [
        'Combien de jours ouvrés séparent deux dates précises ?',
        'Quel âge aurai-je à une échéance future donnée ?',
        'Quel est le timestamp Unix de ma date de naissance ?',
      ],
      explanationTpl: 'Entre le {birth} et le {ref}, il s’est écoulé exactement {totalDays} jours calendaires.',
    },
  },
};
