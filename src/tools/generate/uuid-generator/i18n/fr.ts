import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'uuid-generator',
  name: 'Générateur UUID',
  seoTitle: 'Générateur UUID v4 Aléatoires en Ligne',
  description:
    'Générez des identifiants uniques UUID v4 (GUID) directement dans votre navigateur. Créez de 1 à 100 UUID avec ou sans tirets et copiez en un clic.',
  tagline: 'UUID version 4 aléatoires, à l’unité ou par lot.',
  craft: {
    solves:
      'Les UUID v4 incluent des bits fixes de version (4 bits) et de variante RFC 4122 (2 bits) les distinguant des UUID séquentiels v7 ou nuls.',
  },
  knowledge: {
    primaryConcepts: ['génération UUID', 'identifiants uniques'],
    realWorldUseCases: [
      'Attribuer une clé primaire unique à une ligne de base de données',
      'Nommer des fichiers ou objets sans risque de collision',
      'Corréler des journaux entre microservices avec un identifiant de requête',
      'Créer un identifiant stable pour un enregistrement créé hors ligne',
    ],
    commonMistakes: [
      'Prendre un UUID pour un secret cryptographique inviolable',
      'Utiliser un UUID comme jeton de session ou mot de passe',
      'Stocker des UUID en texte brut au lieu du type UUID natif',
      'Attendre que des UUID v4 se trient dans l’ordre chronologique',
    ],
  },
  fields: {
    count: { label: 'Quantité' },
    version: { label: 'Version', options: { v4: 'v4 (aléatoire)' } },
    hyphens: { label: 'Inclure les tirets', group: 'Format' },
    uppercase: { label: 'Majuscules', group: 'Format' },
  },
  faqs: [
    {
      id: 'uuid-generator-faq-1',
      question: 'Qu’est-ce qu’un UUID ?',
      answer:
        'Un UUID (Identifiant Unique Universel) est un nombre de 128 bits écrit sur 36 caractères comme `f47ac10b-58cc-4372-a567-0e02b2c3d479`. Des systèmes séparés peuvent en générer indépendamment sans collision pratique.',
    },
    {
      id: 'uuid-generator-faq-2',
      question: 'Que signifie UUID et est-ce identique à GUID ?',
      answer:
        'UUID signifie Universally Unique Identifier et GUID Globally Unique Identifier (nom employé par Microsoft). Les deux désignent la même norme de 128 bits.',
    },
    {
      id: 'uuid-generator-faq-3',
      question: 'Quelle version génère cet outil ?',
      answer:
        'La version 4 aléatoire selon RFC 4122. Elle n’embarque ni horodatage ni adresse réseau et constitue le choix standard respectueux de la confidentialité.',
    },
    {
      id: 'uuid-generator-faq-4',
      question: 'Comment utiliser ce générateur UUID ?',
      answer:
        'Indiquez combien d’UUID vous souhaitez, choisissez la présence de tirets et la casse, puis cliquez sur Copier ou Régénérer.',
    },
    {
      id: 'uuid-generator-faq-5',
      question: 'À quoi ressemble un UUID version 4 ?',
      answer:
        'Il se compose de cinq groupes hexadécimaux selon le motif 8-4-4-4-12. Le 13e caractère vaut toujours `4` et le 17e vaut `8`, `9`, `a` ou `b`.',
    },
    {
      id: 'uuid-generator-faq-6',
      question: 'L’unicité des UUID est-elle garantie ?',
      answer:
        'Pas au sens mathématique absolu, mais ses 122 bits aléatoires offrent plus de 5 × 10^36 valeurs possibles, rendant toute collision négligeable.',
    },
    {
      id: 'uuid-generator-faq-7',
      question: 'Ce générateur est-il sûr et privé ?',
      answer:
        'Oui. Tous les UUID sont produits localement via Web Crypto API sans appel réseau ni stockage distant.',
    },
    {
      id: 'uuid-generator-faq-8',
      question: 'Fonctionne-t-il hors ligne ?',
      answer:
        'Oui. Une fois la page chargée, toute la génération s’exécute localement en JavaScript sans connexion requise.',
    },
    {
      id: 'uuid-generator-faq-9',
      question: 'Puis-je générer plusieurs UUID simultanément ?',
      answer:
        'Oui, jusqu’à 100 UUID à la fois affichés ligne par ligne pour vos jeux de test ou insertions en lot.',
    },
    {
      id: 'uuid-generator-faq-10',
      question: 'Comment copier tous les UUID générés ?',
      answer:
        'Cliquez sur Copier pour placer toute la liste dans votre presse-papiers en conservant un UUID par ligne.',
    },
    {
      id: 'uuid-generator-faq-11',
      question: 'Puis-je supprimer les tirets ?',
      answer:
        'Oui. Désactivez les tirets pour obtenir une chaîne hexadécimale compacte de 32 caractères représentant la même valeur.',
    },
    {
      id: 'uuid-generator-faq-12',
      question: 'Puis-je obtenir des UUID en majuscules ?',
      answer:
        'Oui. Activez Majuscules pour afficher `A-F` au lieu de `a-f`. La valeur logique reste strictement identique.',
    },
    {
      id: 'uuid-generator-faq-13',
      question: 'Quand préférer un UUID à un ID incrémental ?',
      answer:
        'Lorsque plusieurs clients, microservices ou applications hors ligne doivent créer des identifiants sans se synchroniser avec une base centrale.',
    },
    {
      id: 'uuid-generator-faq-14',
      question: 'Quelle différence entre UUID v4 et v1 ?',
      answer:
        'La version 1 encode l’horodatage et l’adresse MAC de la machine ; la version 4 est aléatoire et ne divulgue rien de l’environnement.',
    },
    {
      id: 'uuid-generator-faq-15',
      question: 'Puis-je utiliser un UUID comme mot de passe ou jeton ?',
      answer:
        'Ce n’est pas conseillé : les bits fixes et son format connu le rendent moins adapté qu’un vrai générateur de mots de passe ou de chaînes aléatoires.',
    },
    {
      id: 'uuid-generator-faq-16',
      question: 'Les UUID v4 se trient-ils par ordre de création ?',
      answer:
        'Non. Étant purement aléatoires, ils ne conservent aucun ordre chronologique. Ajoutez une colonne horodatée séparée pour le tri.',
    },
    {
      id: 'uuid-generator-faq-17',
      question: 'Les UUID sont-ils secrets ou difficiles à deviner ?',
      answer:
        'Difficiles à énumérer mais jamais secrets : ils figurent souvent dans des URLs ou journaux. Utilisez-les comme identifiants, pas comme clés d’accès.',
    },
    {
      id: 'uuid-generator-faq-18',
      question: 'Comment stocker un UUID en base de données ?',
      answer:
        'Privilégiez le type natif `UUID` sur 16 octets lorsque votre moteur le propose, plutôt qu’un texte de 36 caractères.',
    },
    {
      id: 'uuid-generator-faq-19',
      question: 'Pourquoi ma base de données a-t-elle rejeté un UUID ?',
      answer:
        'Souvent parce que les tirets ont été retirés ou qu’une casse spécifique est exigée par une colonne texte.',
    },
    {
      id: 'uuid-generator-faq-20',
      question: 'Dans quels navigateurs fonctionne-t-il ?',
      answer:
        'Dans tous les navigateurs récents sur ordinateur et mobile dotés de l’API Web Crypto.',
    },
    {
      id: 'uuid-generator-faq-21',
      question: 'L’outil conserve-t-il mes UUID générés ?',
      answer:
        'Non. Seules vos préférences d’options restent en stockage local, jamais les identifiants produits.',
    },
    {
      id: 'uuid-generator-faq-22',
      question: 'Des données sont-elles transmises ou partagées ?',
      answer:
        'Non. Aucun compte, aucun appel serveur ni suivi des valeurs générées.',
    },
  ],
  guide: {
    title: 'Qu’est-ce qu’un UUID v4 et comment bien l’utiliser',
    description:
      'Format 8-4-4-4-12 RFC 4122, comparaison entre v4 et v1, stockage natif sur 16 octets et erreurs courantes à éviter.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Réglez les options pour générer des UUID.',
    engine: {
      metaVersion: 'Version',
      versionV4: 'v4 (aléatoire)',
      metaCount: 'Quantité',
    },
  },
};
