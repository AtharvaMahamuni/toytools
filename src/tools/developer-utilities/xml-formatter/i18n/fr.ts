import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'xml-formatter',
  name: 'Formateur et Validateur XML',
  seoTitle: 'Formateur et Validateur XML en Ligne Gratuit',
  description:
    'Formatez ou minifiez votre XML et repérez les erreurs de syntaxe avec numéro de ligne directement dans votre navigateur, sans aucun envoi.',
  tagline: 'Indentez ou minifiez du XML et détectez les balises invalides.',
  citation: {
    problem: 'Utilisez ce Formateur et Validateur XML pour mettre en forme un document ou vérifier qu’il est bien formé sans l’envoyer.',
    nonGoal: 'valider par rapport à un schéma XSD, DTD ou Schematron.',
  },
  knowledge: {
    primaryConcepts: ['formatage XML', 'validateur XML'],
    realWorldUseCases: [
      'Mettre en forme une réponse SOAP ou un flux RSS sur une seule ligne',
      'Vérifier la bonne formation d’un fichier XML avant déploiement',
      'Minifier du XML pour réduire la taille d’un échange',
    ],
    commonMistakes: [
      'Attendre une validation de schéma XSD d’un test de bonne formation',
      'Oublier que les balises XML sont sensibles à la casse contrairement au HTML',
    ],
  },
  faqs: [
    {
      id: 'xml-fmt-1',
      question: 'Que modifie le Formateur XML ?',
      answer:
        'Uniquement la mise en page quand le document est bien formé : indentation à 2 espaces par niveau en mode lisible, ou suppression des blancs entre balises en mode Minifier. Noms, attributs, commentaires et CDATA restent intacts.',
    },
    {
      id: 'xml-fmt-2',
      question: 'Que signifie « valider » sur cet outil ?',
      answer:
        'Il vérifie la bonne formation syntaxique : un seul élément racine, balises ouvrantes et fermantes appariées et noms conformes. Il ne vérifie pas les schémas XSD, DTD ou Schematron.',
    },
    {
      id: 'xml-fmt-3',
      question: 'Pourquoi XML est-il sensible à la casse ?',
      answer:
        'En XML, `<Livre>` et `<livre>` sont des balises différentes. Si la fermeture ne respecte pas exactement la casse d’ouverture, l’outil signale une erreur.',
    },
    {
      id: 'xml-fmt-4',
      question: 'Comment sont gérés les espaces de noms (namespaces) ?',
      answer:
        'Les préfixes liés par `xmlns` et attributs par défaut restent tels quels. Aucune ressource DTD ou XSD externe n’est téléchargée.',
    },
    {
      id: 'xml-fmt-5',
      question: 'Mon XML est-il envoyé sur un serveur ?',
      answer:
        'Non. Tout s’exécute localement via le DOMParser du navigateur sans quitter cet onglet.',
    },
    {
      id: 'xml-fmt-6',
      question: 'D’où vient le numéro de ligne affiché en cas d’erreur ?',
      answer:
        'Il provient du message du parseur natif du navigateur lorsqu’il indique une ligne et une colonne.',
    },
    {
      id: 'xml-fmt-7',
      question: 'Puis-je aussi minifier mon XML ?',
      answer:
        'Oui. Sélectionnez Minifier dans le menu déroulant pour retirer les espaces superflus entre éléments.',
    },
    {
      id: 'xml-fmt-8',
      question: 'L’indentation modifie-t-elle le sens du XML ?',
      answer:
        'Non pour les éléments et attributs ; seuls les nœuds textuels purement blancs entre balises sont normalisés.',
    },
  ],
  guide: {
    title: 'Formateur XML : indentation et contrôle local',
    description: 'Fonctionnement du formatage XML dans le navigateur, sensibilité à la casse et gestion des namespaces.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrée XML',
    placeholder: 'Collez votre XML ici',
    emptyOutput: 'Collez du XML à gauche pour le formater ou le minifier.',
    validLabel: 'XML valide',
    invalidLabel: 'XML invalide',
    loadError: 'Impossible de charger le processeur XML.',
    modePretty: 'Mise en forme',
    modeMinify: 'Minifier',
    modeAriaLabel: 'Mode',
    toolNote: 'La première erreur de structure affiche un numéro de ligne lorsque le navigateur le fournit.',
    insight:
      'Indente un XML bien formé pour la lecture et signale la première erreur syntaxique via le DOMParser local du navigateur.',
    technical: [
      { term: 'Opération', detail: 'Analyse avec DOMParser puis indentation à 2 espaces ou minification' },
      { term: 'Validation', detail: 'Bonne formation : balises appariées, racine unique, noms valides' },
      { term: 'Non vérifié', detail: 'Schémas DTD, XSD ou Schematron' },
      { term: 'Préservé', detail: 'Éléments, attributs, texte, commentaires et sections CDATA' },
      { term: 'Confidentialité', detail: '100 % local dans votre navigateur' },
    ],
    engine: {
      errNoParser: 'L’analyse XML n’est pas disponible dans cet environnement.',
      whereLineColTpl: ' (ligne {line}, colonne {col})',
      whereLineTpl: ' (ligne {line})',
      errMalformed: 'XML mal formé',
      errNoRoot: 'XML mal formé : aucun élément racine.',
    },
  },
};
