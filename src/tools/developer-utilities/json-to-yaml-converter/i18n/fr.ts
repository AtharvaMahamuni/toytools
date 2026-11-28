import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur JSON vers YAML",
  "seoTitle": "Convertisseur JSON vers YAML - Outil Config en ligne",
  "description": "Convertissez JSON en YAML propre pour Kubernetes, Docker Compose, Ansible et CI/CD. Indentation soignée et locale au navigateur.",
  "tagline": "Convertissez JSON en YAML lisible pour vos configs.",
  "lead": "Transformez vos objets JSON en syntaxe YAML fiable pour Kubernetes, Docker Compose et GitHub Actions sur votre appareil.",
  "guide": {
    "title": "Convertisseur JSON vers YAML : guide complet",
    "description": "Différences entre JSON et YAML, règles d’indentation par espaces, protection des chaînes réservées et usages DevOps."
  },
  "ui": {
    "inputLabel": "Entrée JSON",
    "placeholder": "Collez votre JSON ici",
    "moreAboutHeading": "Fonctionnement du Convertisseur JSON vers YAML",
    "insight": "Convertit le JSON en YAML, format plus lisible très utilisé pour la configuration. Les données restent intactes ; seule la syntaxe change.",
    "technical": [
      {
        "term": "Opération",
        "detail": "Sérialise à nouveau le JSON analysé en YAML"
      },
      {
        "term": "Usage",
        "detail": "Fichiers de config, CI/CD, manifestes"
      },
      {
        "term": "Données",
        "detail": "Préservées : YAML 1.2 est un surensemble de JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Convertit JSON vers YAML pour Kubernetes, Docker Compose, Ansible et CI/CD avec échappement sûr des chaînes.",
    "useCases": [
      "Convertir un JSON d’API en manifeste Kubernetes",
      "Créer un fichier Docker Compose depuis une définition JSON",
      "Adapter des variables JSON pour Ansible",
      "Préparer un workflow GitHub Actions depuis JSON",
      "Rendre un extrait OpenAPI lisible en YAML"
    ],
    "mistakes": [
      "Utiliser des tabulations en YAML au lieu d’espaces",
      "Oublier de citer des valeurs numériques textuelles",
      "Décaler l’indentation lors d’éditions manuelles",
      "Croire qu’un YAML sans --- initial est invalide"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "Quelle différence entre JSON et YAML ?",
      "answer": "Les deux stockent des données hiérarchiques. JSON utilise accolades, crochets et guillemets stricts ; YAML repose sur l’indentation et les tirets pour simplifier la lecture humaine."
    },
    {
      "id": "jyaml-faq-2",
      "question": "Pourquoi convertir du JSON en YAML ?",
      "answer": "Kubernetes, Docker Compose, Ansible et GitHub Actions utilisent YAML comme format standard. La conversion évite toute réécriture manuelle."
    },
    {
      "id": "jyaml-faq-3",
      "question": "Pourquoi convertir ensuite du YAML vers JSON ?",
      "answer": "Les API web et schémas JSON Schema consomment du JSON ; notre outil complémentaire assure l’aller-retour complet."
    },
    {
      "id": "jyaml-faq-4",
      "question": "L’indentation est-elle obligatoire en YAML ?",
      "answer": "Oui. L’indentation par espaces (jamais de tabulations) détermine la hiérarchie. Deux espaces par niveau représentent la convention courante."
    },
    {
      "id": "jyaml-faq-5",
      "question": "Pourquoi certaines chaînes sont-elles mises entre guillemets en YAML ?",
      "answer": "Des mots comme true, false, yes, no ou des nombres comme 10001 seraient interprétés en booléens ou entiers sans guillemets. Les guillemets garantissent leur type texte."
    },
    {
      "id": "jyaml-faq-6",
      "question": "À quoi sert le style inline pour les tableaux ?",
      "answer": "Il écrit les petites listes simples sur une ligne ([a, b, c]) plutôt qu’avec un tiret par ligne, compactant la configuration."
    },
    {
      "id": "jyaml-faq-7",
      "question": "À quoi sert le marqueur --- en tête de fichier YAML ?",
      "answer": "Le triple tiret marque explicitement le début d’un document YAML, utile notamment dans les flux multi-documents sous Kubernetes ou Helm."
    },
    {
      "id": "jyaml-faq-8",
      "question": "Mes fichiers de configuration restent-ils privés ?",
      "answer": "Oui. Tout s’exécute localement dans votre navigateur sans envoi ni conservation sur serveur."
    }
  ]
};
