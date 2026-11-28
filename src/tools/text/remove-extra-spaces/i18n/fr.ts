import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Supprimer les espaces en trop",
  "seoTitle": "Supprimer les espaces en trop - Espaces doubles en ligne",
  "description": "Réduisez les espaces multiples et tabulations en un seul espace en ligne, tout en gardant vos sauts de ligne intacts.",
  "tagline": "Réduisez les espaces répétés et tabulations sur votre appareil.",
  "lead": "Nettoyez immédiatement les doubles espaces issus de PDF ou d’e-mails dans votre navigateur sans casser la structure des paragraphes.",
  "guide": {
    "title": "Supprimer les doubles espaces sous Word et Excel",
    "description": "Apprenez à nettoyer les espaces en trop sous Word, Google Docs et Excel, et pourquoi SUPPRESPACE compresse aussi l’intérieur."
  },
  "ui": {
    "placeholder": "Collez votre texte avec espaces multiples ici",
    "outputPlaceholder": "Le texte nettoyé apparaîtra ici",
    "sampleText": "Facture   envoyée.   Paiement    prévu   vendredi.",
    "handoff": {
      "msgTpl": "Il reste {n} espace(s) en début ou fin de ligne.",
      "siblings": {
        "trim-text": "Rogner les bords"
      }
    }
  },
  "knowledge": {
    "summary": "Condense les suites d’espaces et de tabulations entre les mots en un espace simple tout en préservant les paragraphes.",
    "useCases": [
      "Corriger les doubles espaces après les points",
      "Nettoyer du texte copié depuis un PDF ou un e-mail",
      "Préparer des données propres avant de remplir un formulaire",
      "Uniformiser la mise en forme d’un texte avant publication"
    ],
    "mistakes": [
      "Croire que l’espace unique en tout début ou fin de ligne est aussi supprimé",
      "Penser que les retours à la ligne sont effacés alors qu’ils sont conservés"
    ]
  },
  "faqs": [
    {
      "id": "res-faq-1",
      "question": "Que fait la suppression des espaces en trop ?",
      "answer": "Elle remplace toute suite d’au moins deux espaces ou tabulations par un seul espace normal. \"bonjour     monde\" devient \"bonjour monde\", sans toucher aux retours à la ligne."
    },
    {
      "id": "res-faq-2",
      "question": "Pourquoi trouve-t-on des doubles espaces dans un texte ?",
      "answer": "Ils proviennent souvent de copier-coller depuis des PDF justifiés, de vieilles habitudes dactylographiques après le point ou d’alignements manuels à la barre d’espace."
    },
    {
      "id": "res-faq-3",
      "question": "Supprime-t-elle aussi les sauts de ligne ?",
      "answer": "Non. Seules les séries d’espaces et tabulations sur une même ligne sont réduites. Pour aplatir aussi les sauts de ligne, utilisez la normalisation complète des espaces."
    },
    {
      "id": "res-faq-4",
      "question": "Les espaces en début et fin de ligne sont-ils rognés ?",
      "answer": "Une suite en bord de ligne est réduite à un seul espace mais cet espace résiduel reste présent. Pour supprimer les bords, utilisez un outil de rognage."
    },
    {
      "id": "res-faq-5",
      "question": "Comment nettoyer un texte copié depuis un PDF ?",
      "answer": "Collez votre passage ici et récupérez le résultat : tous les écarts multiples sont réduits à un espace simple tout en conservant les sauts de paragraphe."
    },
    {
      "id": "res-faq-6",
      "question": "Vaut-il mieux réduire les espaces ou rogner les bords ?",
      "answer": "Réduisez les espaces en trop lorsque le souci vient d’écarts entre les mots ; rognez les bords lorsqu’il s’agit d’espaces parasites avant ou après chaque ligne."
    },
    {
      "id": "res-faq-7",
      "question": "Quelle différence entre compresser les espaces et normaliser ?",
      "answer": "Compresser corrige l’intérieur des lignes et préserve la mise en paragraphes ; normaliser convertit tous les blancs, y compris les sauts de ligne, en un flux unique."
    },
    {
      "id": "res-faq-8",
      "question": "Pourquoi reste-t-il parfois de larges vides après nettoyage ?",
      "answer": "Il s’agit probablement d’espaces insécables (U+00A0) courants dans Word ou sur le web, qui ressemblent à des espaces ordinaires sans en être techniquement."
    },
    {
      "id": "res-faq-9",
      "question": "Est-il sûr d’y coller un document confidentiel ?",
      "answer": "Oui. Tout le traitement s’exécute localement dans votre navigateur : aucun texte n’est envoyé ni journalisé sur un serveur."
    }
  ]
};
