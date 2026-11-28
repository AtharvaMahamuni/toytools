import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur de fuseaux horaires",
  "seoTitle": "Convertisseur Fuseaux Horaires - Heure Mondiale & UTC",
  "description": "Convertissez date et heure entre fuseaux horaires du monde avec heure UTC, écart exact et passage automatique à l’heure d’été.",
  "tagline": "Convertissez une heure entre fuseaux avec heure d’été gérée.",
  "lead": "Convertissez n’importe quel rendez-vous entre fuseaux IANA dans votre navigateur avec équivalent UTC, décalage exact et changement de jour.",
  "craft": {
    "solves": "Lors du passage à l’heure d’hiver une heure locale se répète : nos décalages IANA datés lèvent toute ambiguïté."
  },
  "guide": {
    "title": "Comment convertir une heure entre fuseaux horaires",
    "description": "Comment les horaires locaux passent par UTC, pourquoi l’heure d’été modifie les écarts et comment anticiper les changements de jour."
  },
  "fields": {
    "datetime": {
      "label": "Date et heure"
    },
    "fromZone": {
      "label": "Fuseau d’origine"
    },
    "toZone": {
      "label": "Fuseau de destination"
    }
  },
  "ui": {
    "emptyText": "Entrez une date et une heure puis choisissez deux fuseaux horaires à convertir.",
    "engine": {
      "vLabel_datetime": "une date et une heure",
      "errBadZone": "Sélectionnez un fuseau horaire valide dans la liste.",
      "sameTimePhrase": "correspond à la même heure que",
      "aheadTpl": "a {span} d’avance sur",
      "behindTpl": "a {span} de retard sur",
      "timeInTpl": "Heure à {zone}",
      "inZoneTpl": "À {zone}",
      "inUtc": "En UTC",
      "diffLabel": "Décalage horaire",
      "sameTime": "Même heure",
      "offsetTpl": "Décalage à {zone}",
      "fromUtcNote": "Par rapport à UTC à cette date",
      "sameDay": "Les deux fuseaux partagent le même jour calendaire à cet instant.",
      "nextDayTpl": "À {zone}, on est déjà le lendemain.",
      "prevDayTpl": "À {zone}, on est encore la veille.",
      "dstMissingTpl": "{time} n’existait pas à {zone} (saut d’heure d’été) ; ajusté à {after}.",
      "dstAmbigTpl": "{time} s’est produit deux fois à {zone} au changement d’heure ; premier instant ({offset}) retenu.",
      "dstReadTpl": "Heure d’été évaluée exactement à la date du {date}.",
      "msWholeHour": "Les fuseaux diffèrent d’heures entières",
      "msCrossDay": "La conversion change de jour calendaire",
      "decUnix": "Convertir en timestamp Unix",
      "decDateDiff": "Compter les jours entre deux dates",
      "q1": "Quelle heure cela fait-il en UTC ?",
      "q2": "Combien d’heures séparent ces deux villes ?",
      "explanationTpl": "{srcTime} à {srcZone} ({srcOffset}) correspond au même instant que {dstTime} à {dstZone} ({dstOffset}), soit {utcTime} UTC. L’écart est de {diff} à cette date."
    }
  },
  "knowledge": {
    "summary": "Convertit date et heure entre fuseaux horaires IANA avec heure UTC, écart exact et gestion automatique de l’heure d’été.",
    "useCases": [
      "Planifier des réunions internationales sans erreur d’heure d’été",
      "Vérifier l’heure locale d’arrivée d’un vol long-courrier",
      "Corréler un horodatage local avec l’heure serveur UTC"
    ],
    "mistakes": [
      "Supposer un écart constant toute l’année entre deux pays",
      "Oublier le décalage d’un jour lors des traversées de fuseaux éloignés"
    ]
  },
  "faqs": [
    {
      "id": "timezone-converter-faq-1",
      "question": "Comment convertir une heure entre deux fuseaux horaires ?",
      "answer": "Indiquez date, heure, fuseau d’origine et fuseau cible : l’outil calcule l’heure exacte convertie et son équivalent UTC."
    },
    {
      "id": "timezone-converter-faq-2",
      "question": "Comment connaître l’écart exact entre deux villes ?",
      "answer": "Le résultat affiche le décalage exact (ex. +13:00 ou +5:30) calculé précisément pour le jour saisi."
    },
    {
      "id": "timezone-converter-faq-3",
      "question": "L’heure d’été est-elle prise en compte ?",
      "answer": "Oui. Les règles proviennent de la base IANA de votre navigateur pour la date précise saisie, pas simplement la saison actuelle."
    },
    {
      "id": "timezone-converter-faq-4",
      "question": "Pourquoi la date change-t-elle parfois après conversion ?",
      "answer": "Entre deux continents éloignés, une fin de journée à New York tombe déjà le lendemain matin à Tokyo."
    },
    {
      "id": "timezone-converter-faq-5",
      "question": "Mes horaires de vol ou de réunion sont-ils transmis en ligne ?",
      "answer": "Non. Le calcul s’effectue localement via votre navigateur et reste strictement privé."
    }
  ]
};
