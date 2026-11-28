import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur YAML vers JSON",
  "seoTitle": "Convertisseur YAML vers JSON - Config vers JSON",
  "description": "Convertissez YAML en JSON valide instantanément pour APIs et JSON Schema. Déplie les ancres et dates ISO en local.",
  "tagline": "Transformez vos configurations YAML en JSON valide.",
  "lead": "Convertissez manifestes Kubernetes et fichiers YAML en JSON strict directement dans votre navigateur avec résolution des ancres.",
  "guide": {
    "title": "Convertisseur YAML vers JSON : guide complet",
    "description": "Découvrez comment commentaires, ancres, alias et dates YAML sont convertis en JSON et comment éviter les erreurs d’indentation."
  },
  "ui": {
    "inputLabel": "Entrée YAML",
    "placeholder": "Collez votre YAML ici",
    "craftNote": "YAML interdit les tabulations pour l’indentation ; une indentation de deux espaces est la norme.",
    "moreAboutHeading": "Fonctionnement du Convertisseur YAML vers JSON",
    "insight": "Transforme une configuration YAML en JSON pour les API et outils exigeant du JSON. L’indentation YAML devient imbrication JSON.",
    "technical": [
      {
        "term": "Opération",
        "detail": "Analyse le YAML et le sérialise en JSON"
      },
      {
        "term": "Usage",
        "detail": "Alimenter des API et validateurs JSON"
      },
      {
        "term": "Indentation",
        "detail": "L’arbre YAML devient objets et tableaux JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Convertit YAML vers JSON pour APIs et JSON Schema tout en développant les ancres et dates au format ISO.",
    "useCases": [
      "Convertir un manifeste Kubernetes YAML pour un outil JSON",
      "Valider une config YAML via un schéma JSON Schema",
      "Transmettre des paramètres YAML à une API JSON",
      "Lire des données YAML sans bibliothèque dédiée",
      "Importer des documents dans une base JSON"
    ],
    "mistakes": [
      "Indenter le fichier YAML avec des tabulations",
      "Croire que les commentaires # survivent en JSON",
      "Penser que les dates restent un type natif en JSON",
      "Oublier de citer des valeurs comportant deux-points ou caractères spéciaux"
    ]
  },
  "faqs": [
    {
      "id": "y2j-faq-1",
      "question": "Pourquoi convertir du YAML en JSON ?",
      "answer": "JSON est la référence pour les API web et la validation par JSON Schema. La conversion préserve toutes vos données partagées sans perte."
    },
    {
      "id": "y2j-faq-2",
      "question": "YAML est-il un surensemble de JSON ?",
      "answer": "Oui. Depuis YAML 1.2, tout JSON valide est du YAML valide, mais YAML ajoute commentaires et ancres qui sont résolus ou retirés en passant vers JSON."
    },
    {
      "id": "y2j-faq-3",
      "question": "Qu’advient-il des commentaires # lors de la conversion ?",
      "answer": "Ils sont supprimés car la syntaxe JSON ne supporte pas les commentaires. Seules les clés et données subsistent."
    },
    {
      "id": "y2j-faq-4",
      "question": "Comment sont gérées les ancres et alias YAML ?",
      "answer": "Les ancres (&nom) et alias (*nom) sont développés : le bloc référencé est recopié intégralement afin que le JSON reste autonome."
    },
    {
      "id": "y2j-faq-5",
      "question": "Que deviennent les dates et horodatages YAML ?",
      "answer": "JSON ne disposant pas de type date natif, les dates YAML sont sérialisées proprement en chaînes ISO 8601."
    },
    {
      "id": "y2j-faq-6",
      "question": "Pourquoi mon YAML échoue-t-il à se convertir ?",
      "answer": "La cause principale reste l’indentation invalide (présence de tabulations ou espace manquant) ou un caractère spécial non entouré de guillemets."
    },
    {
      "id": "y2j-faq-7",
      "question": "Comment reconvertir le JSON obtenu vers YAML ?",
      "answer": "Utilisez le sélecteur vers JSON vers YAML au-dessus de l’éditeur pour repasser immédiatement au format YAML."
    },
    {
      "id": "y2j-faq-8",
      "question": "Mes fichiers YAML restent-ils confidentiels ?",
      "answer": "Oui. Tout le traitement s’effectue localement dans votre navigateur ; rien n’est transmis à un serveur."
    }
  ]
};
