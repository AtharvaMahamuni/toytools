import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'lorem-ipsum-generator',
  name: 'Générateur Lorem Ipsum',
  seoTitle: 'Générateur Lorem Ipsum – Faux Texte en Ligne',
  description:
    'Générez du faux texte Lorem Ipsum par paragraphes, phrases ou mots dans votre navigateur. Texte brut sans HTML avec compteur de mots et caractères.',
  tagline: 'Faux texte par paragraphe, phrase ou mot.',
  craft: {
    solves:
      'On se demande souvent si ce texte a un sens caché ; l’outil précise qu’il remonte à un texte philosophique classique de Cicéron.',
  },
  knowledge: {
    primaryConcepts: ['lorem ipsum', 'faux texte'],
    realWorldUseCases: [
      'Remplir une maquette avant la rédaction du contenu final',
      'Tester la tenue d’une interface face à des textes courts ou longs',
      'Présenter un thème éditorial ou gabarit avec un volume réaliste',
      'Évaluer la typographie, l’interlignage et la justification',
    ],
    commonMistakes: [
      'Laisser du faux texte sur un site mis en production',
      'Utiliser Lorem ipsum quand la longueur réelle conditionne la mise en page',
      'Croire que les mots latins cachent un message cohérent',
      'Générer beaucoup plus de texte que nécessaire pour le bloc prévu',
    ],
  },
  fields: {
    unit: {
      label: 'Unité',
      options: { paragraphs: 'Paragraphes', sentences: 'Phrases', words: 'Mots' },
    },
    count: { label: 'Quantité' },
    startWithLorem: { label: 'Commencer par « Lorem ipsum »', group: 'Options' },
  },
  faqs: [
    {
      id: 'lorem-ipsum-generator-faq-1',
      question: 'Qu’est-ce que le Lorem ipsum ?',
      answer:
        'C’est un faux texte standard d’imprimerie et de design composé de mots d’allure latine afin d’évaluer une mise en page sans être distrait par le sens du texte.',
    },
    {
      id: 'lorem-ipsum-generator-faq-2',
      question: 'Comment utiliser ce générateur ?',
      answer:
        'Sélectionnez paragraphes, phrases ou mots, définissez la quantité et choisissez de démarrer ou non par « Lorem ipsum dolor sit amet », puis cliquez sur Copier.',
    },
    {
      id: 'lorem-ipsum-generator-faq-3',
      question: 'D’où vient le Lorem ipsum ?',
      answer:
        'Il provient d’un passage remanié de l’œuvre philosophique *De finibus bonorum et malorum* de Cicéron (45 av. J.-C.), adopté comme référence typographique depuis la Renaissance.',
    },
    {
      id: 'lorem-ipsum-generator-faq-4',
      question: 'Pourquoi utiliser du texte factice ?',
      answer:
        'Un texte réel attire l’attention du relecteur sur les idées ou fautes. Le faux texte focalise l’œil sur l’équilibre visuel, les polices et les marges.',
    },
    {
      id: 'lorem-ipsum-generator-faq-5',
      question: 'Le Lorem ipsum veut-il dire quelque chose ?',
      answer:
        'Non. Bien que les mots aient des racines latines, ils ont été tronqués et mélangés pour n’offrir qu’une texture visuelle neutre.',
    },
    {
      id: 'lorem-ipsum-generator-faq-6',
      question: 'Puis-je générer un nombre précis de mots plutôt que des paragraphes ?',
      answer:
        'Oui. Passez l’unité sur Mots ou Phrases afin d’ajuster précisément un titre, un encart ou une vignette.',
    },
    {
      id: 'lorem-ipsum-generator-faq-7',
      question: 'À quoi sert l’option « Commencer par Lorem ipsum » ?',
      answer:
        'Activée, elle débute par le célèbre « Lorem ipsum dolor sit amet ». Désactivée, le générateur pioche librement dès le premier mot.',
    },
    {
      id: 'lorem-ipsum-generator-faq-8',
      question: 'Le générateur fonctionne-t-il hors ligne ?',
      answer:
        'Oui. Une fois la page chargée, toute la création se fait en JavaScript local dans votre navigateur sans accès réseau.',
    },
    {
      id: 'lorem-ipsum-generator-faq-9',
      question: 'Combien de texte puis-je générer ?',
      answer:
        'Jusqu’à 100 unités à la fois (100 paragraphes, 100 phrases ou 100 mots), largement assez pour la majorité des maquettes.',
    },
    {
      id: 'lorem-ipsum-generator-faq-10',
      question: 'La sortie est-elle en texte brut ?',
      answer:
        'Oui, sans balise HTML ni mise en forme parasites, avec saut de ligne double entre les paragraphes.',
    },
    {
      id: 'lorem-ipsum-generator-faq-11',
      question: 'Puis-je copier le texte en un clic ?',
      answer:
        'Oui, le bouton Copier place tout le bloc généré directement dans votre presse-papiers.',
    },
    {
      id: 'lorem-ipsum-generator-faq-12',
      question: 'Le texte obtenu est-il toujours identique ?',
      answer:
        'Non. Chaque clic sur Régénérer produit une nouvelle combinaison aléatoire de mots et de longueurs de phrases.',
    },
    {
      id: 'lorem-ipsum-generator-faq-13',
      question: 'Quand faut-il éviter le Lorem ipsum ?',
      answer:
        'Lorsque les contraintes réelles de libellé risquent de faire déborder un bouton ou une carte, et toujours avant la publication finale.',
    },
    {
      id: 'lorem-ipsum-generator-faq-14',
      question: 'Quelle différence avec des mots aléatoires courants ?',
      answer:
        'Des mots français courants captent l’attention par leur sens immédiat. Le pseudo-latin préserve un rythme typographique naturel tout en restant neutre.',
    },
    {
      id: 'lorem-ipsum-generator-faq-15',
      question: 'Puis-je l’utiliser dans un projet commercial ?',
      answer:
        'Oui, le Lorem ipsum est libre de droits pour tout prototype ou présentation client, tant qu’il est remplacé avant mise en ligne.',
    },
    {
      id: 'lorem-ipsum-generator-faq-16',
      question: 'Pourquoi certains déconseillent-ils parfois le faux texte ?',
      answer:
        'Parce qu’un texte trop lisse peut masquer des défauts de maquette qui apparaîtront avec le vrai contenu.',
    },
    {
      id: 'lorem-ipsum-generator-faq-17',
      question: 'Puis-je générer un seul paragraphe ?',
      answer:
        'Oui, réglez simplement l’unité sur Paragraphes et la quantité sur 1.',
    },
    {
      id: 'lorem-ipsum-generator-faq-18',
      question: 'L’outil conserve-t-il mes réglages ?',
      answer:
        'Uniquement vos options d’interface en stockage local ; le texte produit n’est jamais sauvegardé.',
    },
    {
      id: 'lorem-ipsum-generator-faq-19',
      question: 'Dans quels navigateurs fonctionne-t-il ?',
      answer:
        'Dans tous les navigateurs récents sur ordinateur et mobile sans dépendance externe.',
    },
    {
      id: 'lorem-ipsum-generator-faq-20',
      question: 'Puis-je viser un nombre exact de caractères ?',
      answer:
        'La génération se fait par mots, phrases ou paragraphes et affiche le décompte exact de mots et de caractères afin d’ajuster vite.',
    },
    {
      id: 'lorem-ipsum-generator-faq-21',
      question: 'Est-ce adapté pour tester des polices ?',
      answer:
        'Oui, ses longueurs de mots réalistes permettent d’apprécier facilement le gris typographique et la lisibilité.',
    },
    {
      id: 'lorem-ipsum-generator-faq-22',
      question: 'Des données sont-elles envoyées ou partagées ?',
      answer:
        'Non. Tout s’exécute sur votre appareil sans appel serveur ni suivi.',
    },
  ],
  guide: {
    title: 'Qu’est-ce que le Lorem ipsum et quand l’utiliser',
    description:
      'Origine chez Cicéron, intérêt pour tester typographie et mises en page, et limites face au contenu réel.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Choisissez une unité et une quantité.',
    engine: {
      metaWords: 'Mots',
      metaChars: 'Caractères',
    },
  },
};
