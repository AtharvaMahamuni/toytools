import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'json-validator',
  name: 'Validateur JSON',
  seoTitle: 'Validateur JSON en Ligne – Vérifier Syntaxe Gratuit',
  description:
    'Validez votre syntaxe JSON (RFC 8259) instantanément dans votre navigateur. Repérez virgules finales et guillemets fautifs sans envoi serveur.',
  tagline: 'Vérifiez la syntaxe JSON et repérez immédiatement la moindre erreur.',
  knowledge: {
    primaryConcepts: ['validation JSON'],
    realWorldUseCases: [
      'Diagnostiquer une erreur API 400 "JSON invalide"',
      'Contrôler un package.json ou tsconfig.json édité à la main',
      'Vérifier une charge utile webhook issue de journaux serveur',
      'Détecter les fautes JSON avant un déploiement',
    ],
    commonMistakes: [
      'Laisser une virgule finale après le dernier élément',
      'Confondre validation syntaxique et validation par schéma JSON Schema',
    ],
  },
  faqs: [
    {
      id: 'json-val-faq-1',
      question: 'Que vérifie la validation JSON ?',
      answer:
        'Elle contrôle la conformité du texte à la norme RFC 8259. Si l’analyse réussit, le JSON est valide ; sinon, l’outil indique la nature de l’erreur et sa position.',
    },
    {
      id: 'json-val-faq-2',
      question: 'Quelles sont les erreurs de syntaxe JSON les plus courantes ?',
      answer:
        'Virgules finales en trop, apostrophes au lieu de guillemets doubles, clés non encadrées par des guillemets, commentaires ou valeurs JavaScript comme `undefined` et `NaN`.',
    },
    {
      id: 'json-val-faq-3',
      question: 'Quelle différence entre JSON et un objet JavaScript ?',
      answer:
        'JSON est bien plus strict : clés obligatoirement entre guillemets doubles, chaînes entre guillemets doubles, aucune virgule finale ni commentaire.',
    },
    {
      id: 'json-val-faq-4',
      question: 'Pourquoi les virgules finales sont-elles interdites en JSON ?',
      answer:
        'Pour garder une grammaire simple et sans ambiguïté (`[1, 2, 3,]`). JavaScript moderne les tolère, pas JSON.',
    },
    {
      id: 'json-val-faq-5',
      question: 'Pourquoi JSON n’accepte-t-il pas de commentaires ?',
      answer:
        'Douglas Crockford les a retirés volontairement afin que JSON reste un pur format d’échange de données. Pour des configurations commentées, utilisez JSONC ou JSON5.',
    },
    {
      id: 'json-val-faq-6',
      question: 'Quelle différence entre validation de syntaxe et JSON Schema ?',
      answer:
        'La syntaxe valide les guillemets, accolades et types JSON de base. JSON Schema contrôle la structure métier (champs requis, formats, bornes) d’un JSON déjà syntaxiquement valide.',
    },
    {
      id: 'json-val-faq-7',
      question: 'Mon objet JS semble bon mais JSON.parse échoue, pourquoi ?',
      answer:
        'La chaîne provient souvent d’un affichage console ou d’un log JS plutôt que de `JSON.stringify`, d’où des apostrophes ou clés sans guillemets.',
    },
    {
      id: 'json-val-faq-8',
      question: 'JSONC ou JSON5 sont-ils du JSON valide ?',
      answer:
        'Non. Ces sur-ensembles ajoutent commentaires et virgules finales acceptés par VS Code, mais rejetés par tout parseur JSON standard.',
    },
    {
      id: 'json-val-faq-9',
      question: 'Un objet JSON peut-il contenir des clés en double ?',
      answer:
        'La spécification déconseille les doublons sans les interdire formellement ; comme les parseurs réagissent de façon variable, mieux vaut les corriger.',
    },
  ],
  guide: {
    title: 'Comment valider du JSON sans erreurs courantes',
    description: 'Règles RFC 8259, virgules finales, guillemets simples et différence entre syntaxe et JSON Schema.',
    readMinutes: 5,
  },
  ui: {
    inputLabel: 'Entrée JSON',
    placeholder: 'Collez votre JSON ici',
    emptyOutput: 'Collez du JSON pour vérifier sa syntaxe.',
    validLabel: 'JSON valide',
    invalidLabel: 'JSON invalide',
    appliedPrefix: 'Correction appliquée :',
    loadError: 'Impossible de charger le processeur JSON.',
    moreAboutHeading: 'Fonctionnement du Validateur JSON',
    insight:
      'Analyse l’entrée selon la norme RFC 8259 et localise la première faute de syntaxe, sans contrôle de schéma métier.',
    technical: [
      { term: 'Norme', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Vérifie', detail: 'Syntaxe et structure' },
      { term: 'Ne vérifie pas', detail: 'Votre schéma, types métier ou champs obligatoires' },
      { term: 'Sortie', detail: 'Valide ou première erreur avec position' },
    ],
    engine: {
      validJsonOut: 'JSON valide',
      repairBoth: 'Corriger guillemets typographiques et virgule finale',
      repairQuotes: 'Remplacer les guillemets typographiques',
      repairComma: 'Supprimer la virgule finale',
    },
  },
};
