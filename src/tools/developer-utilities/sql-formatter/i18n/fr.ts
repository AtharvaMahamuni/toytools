import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'sql-formatter',
  name: 'Formateur SQL',
  seoTitle: 'Formateur SQL en Ligne – Indenter Requêtes Gratuit',
  description:
    'Formatez vos requêtes SQL sur une ligne avec mots-clés en majuscules et clauses indentées directement dans votre navigateur, sans envoi serveur.',
  tagline: 'Mettez en forme vos requêtes SQL avec des clauses nettes et indentées.',
  citation: {
    problem: 'Utilisez ce Formateur SQL pour rendre lisible une requête compacte ou issue d’un log sans la téléverser.',
    nonGoal: 'exécuter la requête sur une base de données ni en réécrire la logique.',
  },
  knowledge: {
    primaryConcepts: ['formatage SQL'],
    realWorldUseCases: [
      'Clarifier une requête SQL sur une ligne copiée depuis un log applicatif',
      'Rendre lisible un long JOIN avant une revue de code',
      'Vérifier une requête issue d’un ticket sans la confier à un serveur tiers',
    ],
    commonMistakes: [
      'Coller une requête contenant un mot de passe dans un service en ligne qui stocke les requêtes',
      'Attendre du formateur qu’il optimise le plan d’exécution SQL',
    ],
  },
  faqs: [
    {
      id: 'sql-fmt-1',
      question: 'Que modifie exactement le Formateur SQL ?',
      answer:
        'Uniquement la mise en page. Les mots-clés passent en majuscules, chaque clause majeure démarre sur sa ligne et les sous-listes sont indentées de deux espaces. Chaînes, commentaires, nombres et identifiants restent intacts.',
    },
    {
      id: 'sql-fmt-2',
      question: 'Quels dialectes SQL sont pris en charge ?',
      answer:
        'Les mots-clés courants de PostgreSQL, MySQL et SQLite (SELECT, JOIN, GROUP BY, ORDER BY, WITH, RETURNING, chaînes dollar-quoted). Les extensions spécifiques restent inchangées.',
    },
    {
      id: 'sql-fmt-3',
      question: 'Ma requête SQL est-elle envoyée vers un serveur ?',
      answer:
        'Non. L’analyse et l’indentation s’exécutent entièrement dans votre navigateur et fonctionnent même hors ligne.',
    },
    {
      id: 'sql-fmt-4',
      question: 'Pourquoi éviter les formateurs en ligne avec serveur pour du SQL sensible ?',
      answer:
        'Beaucoup envoient le texte sur un backend où mots de passe, clés API ou données clients peuvent être journalisés. Privilégiez un traitement local.',
    },
    {
      id: 'sql-fmt-5',
      question: 'Que se passe-t-il si un guillemet reste ouvert ?',
      answer:
        'L’outil s’arrête et signale précisément la chaîne non fermée (guillemet simple, double ou backtick) sans tenter de deviner.',
    },
    {
      id: 'sql-fmt-6',
      question: 'L’outil minifie-t-il aussi le SQL ?',
      answer:
        'Cette page effectue une mise en forme lisible (pretty-print). Relisez d’abord la requête indentée avant de la compacter pour un log.',
    },
    {
      id: 'sql-fmt-7',
      question: 'Le formatage modifie-t-il l’exécution de ma requête ?',
      answer:
        'Non. En SQL, les espaces et la casse des mots-clés sont sans impact sémantique.',
    },
    {
      id: 'sql-fmt-8',
      question: 'Les commentaires `--` et `/* ... */` sont-ils préservés ?',
      answer:
        'Oui, chaque commentaire reste sur sa ligne sans jamais être supprimé.',
    },
  ],
  guide: {
    title: 'Formateur SQL : requêtes lisibles sans envoi serveur',
    description: 'Fonctionnement du formatage SQL local, dialectes couverts et vigilance sur les secrets.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrée SQL',
    placeholder: 'Collez votre requête SQL ici',
    emptyOutput: 'Collez du SQL à gauche pour le mettre en forme.',
    validLabel: 'SQL valide',
    invalidLabel: 'Erreur SQL',
    loadError: 'Impossible de charger le processeur SQL.',
    toolNote: 'Un mot de passe ou clé API dans une chaîne déclenche un avertissement avant tout partage.',
    insight:
      'Met les mots-clés SQL en majuscules et place chaque clause principale sur sa ligne tout en laissant littéraux et commentaires intacts.',
    technical: [
      { term: 'Opération', detail: 'Tokenisation, mots-clés en majuscules et indentation des clauses' },
      { term: 'Dialectes', detail: 'Mots-clés courants Postgres, MySQL et SQLite' },
      { term: 'Préservé', detail: 'Littéraux, commentaires -- et /* */, nombres, identifiants' },
      { term: 'Erreurs', detail: 'Signale les guillemets non fermés sans deviner' },
      { term: 'Confidentialité', detail: 'Exécution locale et alerte en cas de secret détecté' },
    ],
    engine: {
      warnSecret: 'Cette requête semble contenir un mot de passe ou secret entre guillemets. Tout reste local dans ce navigateur, évitez de partager ces identifiants.',
      errTooLargeTpl: 'Cette requête dépasse {max} caractères. Raccourcissez-la avant le formatage.',
      errUnclosedTpl: 'Chaîne à guillemets {name} non fermée. Ajoutez le {q} manquant puis réessayez.',
      quoteNames: { single: 'simples', double: 'doubles', backtick: 'inverses (backtick)' },
    },
  },
};
