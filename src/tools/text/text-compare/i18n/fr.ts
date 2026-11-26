import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'text-compare',
  name: 'Comparateur de Textes',
  seoTitle: 'Comparateur de Textes en Ligne – Diff Côte à Côte',
  description:
    'Comparez deux textes côte à côte pour repérer instantanément les lignes ajoutées ou supprimées. Tout ce que vous saisissez reste sur votre appareil.',
  tagline: 'Comparez deux textes et visualisez exactement quelles lignes ont changé.',
  knowledge: {
    primaryConcepts: ['comparaison de textes', 'outil diff'],
    realWorldUseCases: [
      'Vérifier ce qui a changé entre deux brouillons d’un document',
      'Relire les modifications apportées par un collaborateur',
      'Comparer deux extraits de configuration ou de code',
      'Contrôler une version révisée par rapport au texte original',
    ],
    commonMistakes: [
      'Comparer sans harmoniser les espaces au préalable, ce qui gonfle le diff',
      'Attendre une fusion automatique alors qu’un diff affiche uniquement les écarts',
    ],
  },
  faqs: [
    {
      id: 'tc-faq-1',
      question: 'Comment comparer deux textes en ligne ?',
      answer:
        'Collez votre texte original dans le premier cadre et la nouvelle version dans le second. L’outil met aussitôt en évidence les lignes ajoutées, supprimées ou inchangées ainsi que le taux de similarité.',
    },
    {
      id: 'tc-faq-2',
      question: 'La comparaison se fait-elle par caractère ou par ligne ?',
      answer:
        'Il s’agit d’un diff ligne par ligne, comme git diff. Modifier un mot dans une phrase affiche la ligne entière comme supprimée puis ajoutée, ce qui rend la relecture de contrats, articles ou fichiers de configuration plus claire.',
    },
    {
      id: 'tc-faq-3',
      question: 'Que signifient les signes + et - dans le résultat ?',
      answer:
        'Une ligne marquée + a été ajoutée dans le nouveau texte. Une ligne marquée - a été supprimée de l’original. Les lignes inchangées apparaissent atténuées sans symbole.',
    },
    {
      id: 'tc-faq-4',
      question: 'Mon texte est-il envoyé vers un serveur lors de la comparaison ?',
      answer:
        'Non. Toute la comparaison s’exécute localement dans votre navigateur en JavaScript. Aucune donnée ne quitte votre appareil.',
    },
    {
      id: 'tc-faq-5',
      question: 'Que signifie le pourcentage de similarité ?',
      answer:
        'Il mesure la part de lignes communes entre les deux textes. 100% signifie qu’ils sont identiques ; 0% qu’ils n’ont aucune ligne en commun. Si 9 lignes sur 10 concordent, la similarité atteint 90%.',
    },
    {
      id: 'tc-faq-6',
      question: 'La comparaison tient-elle compte des majuscules et minuscules ?',
      answer:
        'Oui. Elle est sensible à la casse par défaut : « Bonjour » et « bonjour » sont traités comme deux lignes distinctes, conformément aux outils diff classiques.',
    },
    {
      id: 'tc-faq-7',
      question: 'Puis-je comparer plus de deux textes à la fois ?',
      answer:
        'L’outil compare deux textes à la fois. Pour suivre plusieurs révisions, procédez étape par étape : original vs révision 1, puis révision 1 vs révision 2.',
    },
    {
      id: 'tc-faq-8',
      question: 'Quelle différence entre comparer des textes et Rechercher et remplacer ?',
      answer:
        'Le comparateur est en lecture seule : il révèle les écarts sans toucher au contenu. Rechercher et remplacer modifie directement le texte en substituant un motif par un autre.',
    },
    {
      id: 'tc-faq-9',
      question: 'Pourquoi les espaces en fin de ligne apparaissent-ils comme des différences ?',
      answer:
        'Parce que deux lignes ne concordent que si elles sont strictement identiques caractère pour caractère. Une espace invisible ou un saut de ligne différent (CRLF/LF) suffit à créer un écart ; lorsqu’il le détecte, l’outil propose d’ignorer ces différences blanches en un clic.',
    },
    {
      id: 'tc-faq-10',
      question: 'Pourquoi des lignes déplacées ressemblent-elles à une réécriture complète ?',
      answer:
        'Parce que le diff compare les lignes dans leur ordre d’apparition. Un paragraphe déplacé plus bas apparaît supprimé à son ancienne position et ajouté à la nouvelle même si son texte n’a pas changé.',
    },
  ],
  guide: {
    title: 'Comparateur de textes : lire un diff en ligne',
    description:
      'Apprenez à comparer deux versions d’un texte, comprendre les lignes ajoutées et retirées et vérifier documents ou code sans quitter le navigateur.',
    readMinutes: 4,
  },
  ui: {
    btnSampleAria: 'Charger deux exemples de texte à comparer',
    panelOriginal: 'Original',
    phOriginal: 'Collez le texte original...',
    ariaOriginal: 'Texte original',
    panelNew: 'Nouveau texte',
    phNew: 'Collez le nouveau texte...',
    ariaNew: 'Nouveau texte',
    ariaDiffResult: 'Résultat de comparaison de texte',
    sampleA: 'La première ligne reste identique.\nCette ligne va être supprimée.\nTroisième ligne avec petite coquille.\nQuatrième ligne inchangée.',
    sampleB: 'La première ligne reste identique.\nTroisième ligne corrigée.\nQuatrième ligne inchangée.\nCette nouvelle ligne a été ajoutée.',
    msgIdentical: 'Les deux textes sont identiques.',
    msgSummaryTpl: 'Les textes sont similaires à {sim}% : {added} ajoutée(s), {removed} supprimée(s).',
    wsIgnoringTpl: 'Ignorer : {level}. ',
    wsOtherwiseIdentical: 'Sans cela, les deux textes sont identiques.',
    wsNormChangedTpl: '{norm} des {raw} lignes modifiées présentent un écart visible.',
    wsOnlyDiffTpl: 'Ces lignes ne diffèrent que par {level}. Toutes les {raw} lignes sont identiques à la lecture.',
    wsSomeDiffTpl: '{diff} des {raw} lignes modifiées ne diffèrent que par {level}.',
    btnShowRaw: 'Afficher le diff brut',
    btnIgnorePrefix: 'Ignorer ',
    lblAdded: 'Ajoutées',
    lblRemoved: 'Supprimées',
    lblUnchanged: 'Inchangées',
    lblSimilarity: 'Similarité',
    unchangedRunTpl: '⋯ {n} lignes inchangées',
  },
};
