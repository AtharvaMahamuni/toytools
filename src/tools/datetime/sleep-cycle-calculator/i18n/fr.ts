import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculateur de cycles de sommeil",
  "seoTitle": "Calculateur Cycles de Sommeil - Heure Coucher & Réveil",
  "description": "Calculez l’heure idéale pour dormir ou vous réveiller par cycles de 90 minutes en incluant votre temps d’endormissement.",
  "tagline": "Horaires en cycles de 90 minutes plus délai d’endormissement.",
  "lead": "Planifiez vos heures de coucher ou de réveil alignées sur des cycles complets de 90 minutes dans votre navigateur, latence incluse.",
  "craft": {
    "solves": "Compter 90 minutes à rebours depuis le réveil oublie le temps mis à s’endormir, faisant sonner l’alarme en plein milieu d’un cycle."
  },
  "guide": {
    "title": "Choisir son heure de coucher par cycles de 90 minutes",
    "description": "Qu’est-ce qu’un cycle de sommeil, pourquoi ajouter les 15 minutes d’endormissement et comment calculer dans les deux sens."
  },
  "fields": {
    "direction": {
      "label": "Je connais mon heure de",
      "options": {
        "wake": "Réveil souhaité",
        "sleep": "Coucher au lit"
      }
    },
    "time": {
      "label": "Heure affichée",
      "help": "Ex. 07:00, 19:00 ou 7:00 am selon votre horaire."
    },
    "latency": {
      "label": "Minutes pour s’endormir",
      "help": "En moyenne 15 minutes ; 0 suppose un endormissement immédiat."
    },
    "cycle": {
      "label": "Durée d’un cycle (min)",
      "help": "Un cycle adulte typique dure environ 90 minutes."
    }
  },
  "ui": {
    "emptyText": "Entrez votre heure de réveil ou de coucher pour voir les quatre horaires conseillés.",
    "engine": {
      "vLabel_latency": "Minutes pour s’endormir",
      "vLabel_cycle": "Durée du cycle",
      "errEnterTpl": "Saisissez {label}.",
      "errWholeTpl": "{label} doit être un nombre entier.",
      "errRangeTpl": "{label} doit être compris entre {min} et {max}.",
      "errBadClock": "Entrez une heure valide comme 07:00, 19:00 ou 7:00 am.",
      "heroWake": "Aller au lit à",
      "heroSleep": "Se réveiller à",
      "heroInstant": "5 cycles. Endormissement supposé instantané au coucher.",
      "heroLatencyTpl": "5 cycles, plus {latency} minutes pour s’endormir.",
      "cycleCardTpl": "{n} cycles",
      "cycleNoteTpl": "{n} × {cycle} min de sommeil",
      "insWakeTpl": "Réveil à {time}. Chaque horaire ajoute {latency} min d’endormissement avant 3 à 6 cycles de {cycle} min.",
      "insSleepTpl": "Au lit à {time}. Chaque alarme prévoit {latency} min pour s’endormir puis 3 à 6 cycles de {cycle} min.",
      "insInstant": "Ces horaires supposent un sommeil instantané. Ajoutez votre temps habituel pour éviter que l’alarme ne coupe un cycle.",
      "asmCycle": "Durée du cycle",
      "asmLatency": "Endormissement",
      "asmInstant": "aucun (sommeil instantané)",
      "minTpl": "{n} minutes",
      "decDateDiff": "Compter les jours entre deux dates",
      "explanationTpl": "Un cycle dure ici {cycle} minutes et les {latency} minutes préalables ne comptent pas dans le cycle. Les quatre résultats couvrent 6, 5, 4 et 3 cycles complets."
    }
  },
  "knowledge": {
    "summary": "Calcule vos heures de coucher ou réveil par cycles complets de 90 minutes en intégrant la latence d’endormissement.",
    "useCases": [
      "Déterminer l’heure de coucher idéale pour un réveil à 07:00",
      "Trouver l’heure d’alarme optimale au moment d’aller se coucher",
      "Tenir compte du temps réel nécessaire pour trouver le sommeil"
    ],
    "mistakes": [
      "Laisser la latence sur 0 minute et se réveiller en plein cycle",
      "Considérer que chaque individu a exactement 90 minutes fixes",
      "Interpréter cet outil horaire comme un bilan médical du sommeil"
    ]
  },
  "faqs": [
    {
      "id": "sleep-cycle-calculator-faq-1",
      "question": "À quelle heure se coucher pour des cycles de 90 minutes ?",
      "answer": "Choisissez \"Réveil souhaité\", entrez 07:00 avec 15 min d’endormissement : 5 cycles indiquent 23:15 et 6 cycles 21:45."
    },
    {
      "id": "sleep-cycle-calculator-faq-2",
      "question": "Pourquoi la liste ajoute-t-elle 15 minutes avant le premier cycle ?",
      "answer": "Ces minutes éveillées au lit précèdent le sommeil ; les intégrer évite que le réveil sonne en plein milieu du dernier cycle."
    },
    {
      "id": "sleep-cycle-calculator-faq-3",
      "question": "Combien de cycles compte une nuit ?",
      "answer": "L’outil affiche 6, 5, 4 et 3 cycles (9 h, 7,5 h, 6 h et 4,5 h de sommeil). Cinq ou six forment une nuit complète adulte."
    },
    {
      "id": "sleep-cycle-calculator-faq-4",
      "question": "Puis-je calculer depuis l’heure du coucher plutôt que du réveil ?",
      "answer": "Oui. Sélectionnez \"Coucher au lit\", saisissez votre heure et obtenez les heures de réveil correspondantes."
    },
    {
      "id": "sleep-cycle-calculator-faq-5",
      "question": "Un cycle de 90 minutes convient-il à tout le monde ?",
      "answer": "C’est une moyenne courante ; vous pouvez modifier la durée entre 60 et 120 minutes selon votre rythme."
    },
    {
      "id": "sleep-cycle-calculator-faq-6",
      "question": "Que se passe-t-il si je laisse l’endormissement à zéro ?",
      "answer": "Toutes les heures se décalent exactement de ce délai et une alerte précise que le calcul suppose un endormissement immédiat."
    },
    {
      "id": "sleep-cycle-calculator-faq-7",
      "question": "Mes horaires de sommeil sont-ils envoyés en ligne ?",
      "answer": "Non. Le calcul reste strictement local dans votre navigateur et fonctionne aussi hors ligne."
    },
    {
      "id": "sleep-cycle-calculator-faq-8",
      "question": "Pourquoi 6 cycles sont-ils à plus de neuf heures avant l’alarme ?",
      "answer": "Parce qu’aux 9 heures de 6 cycles complets s’ajoute la période d’endormissement éveillé dans le lit."
    },
    {
      "id": "sleep-cycle-calculator-faq-9",
      "question": "Ce calculateur détecte-t-il un trouble du sommeil ?",
      "answer": "Non. Il n’effectue qu’un calcul horaire et ne remplace pas un avis médical."
    },
    {
      "id": "sleep-cycle-calculator-faq-10",
      "question": "Quelle différence avec un calcul de tête par tranches de 90 min ?",
      "answer": "Il intègre la latence d’endormissement, affiche quatre choix dans les deux sens et gère les passages de minuit sans erreur."
    }
  ]
};
