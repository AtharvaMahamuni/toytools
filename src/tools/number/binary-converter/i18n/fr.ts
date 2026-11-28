import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur binaire",
  "seoTitle": "Convertisseur Binaire - Décimal vers Binaire en ligne",
  "description": "Convertissez un entier décimal en base 2 et inversement jusqu’à 512 bits sans arrondi, avec hexadécimal, octal et nombre de bits.",
  "tagline": "Décimal vers binaire et retour, avec hexadécimal et octal.",
  "lead": "Convertissez des entiers jusqu’à 512 bits via BigInt dans votre navigateur tout en nettoyant préfixes 0b et séparateurs.",
  "guide": {
    "title": "Décimal, binaire, hexadécimal et largeur en bits",
    "description": "Comprenez le système en base 2, pourquoi un chiffre hex représente quatre bits et la différence avec le texte binaire."
  },
  "ui": {
    "displayName": "Binaire",
    "forwardLabel": "En binaire →",
    "inverseLabel": "En décimal ←",
    "outputLabel": "Résultat",
    "placeholder": "Tapez un entier décimal ou collez des chiffres binaires.",
    "modeAriaLabel": "Sens de conversion",
    "inputAriaLabel": "Nombre décimal ou binaire",
    "outputAriaLabel": "Résultat converti",
    "outputPlaceholder": "Le résultat apparaît ici. Ce champ est aussi éditable.",
    "swapLabel": "Inverser",
    "swapAriaLabel": "Échanger entrée et sortie",
    "insight": [
      "Le binaire compte avec deux chiffres (0 et 1) : chaque rang vaut le double de celui à sa droite, donc 1011 vaut 8 + 2 + 1 = 11.",
      "L’hexadécimal sert de raccourci au binaire : un chiffre hex équivaut exactement à quatre bits (0xFF = 1111 1111).",
      "La largeur en bits explique pourquoi les zéros en tête comptent dans un registre ou un octet."
    ],
    "technical": [
      {
        "term": "Plage",
        "detail": "Exact jusqu’à 512 bits en BigInt (aucun arrondi passé 2^53)"
      },
      {
        "term": "Accepte",
        "detail": "Préfixe 0b, espaces, underscores, virgules et apostrophes"
      },
      {
        "term": "Négatifs",
        "detail": "Signe et amplitude (-1011), pas complément à deux"
      },
      {
        "term": "Associés",
        "detail": "Hexadécimal, octal, nombre de bits et d’octets"
      },
      {
        "term": "Hors champ",
        "detail": "Ne convertit pas de texte ; utilisez texte vers binaire"
      }
    ],
    "engine": {
      "detBinary": "Binaire",
      "detNumber": "Nombre",
      "errEnterNumber": "Entrez un nombre.",
      "errBadBinTpl": "\"{ch}\" n’est pas un chiffre binaire. Le binaire n’utilise que 0 et 1.",
      "errWhole": "Entrez un entier composé uniquement de chiffres.",
      "errMaxBitsTpl": "Cela représente {bits} bits. Le plafond ici est de {max} bits.",
      "metaHex": "Hex",
      "metaOctal": "Octal",
      "metaBits": "Bits",
      "metaBytes": "Octets",
      "recUseTpl": "Utiliser {cleaned}"
    }
  },
  "knowledge": {
    "summary": "Convertit nombres décimaux et binaires avec précision exacte sur 512 bits ainsi qu’en hexadécimal et octal.",
    "useCases": [
      "Lire un masque de permissions ou drapeaux binaires",
      "Comparer la valeur d’un registre matériel avec le code",
      "Repérer quels bits ont basculé lors du débogage",
      "Illustrer la base 2 et le décalage de bits"
    ],
    "mistakes": [
      "Oublier les zéros initiaux pour aligner sur un octet",
      "Confondre binaire numérique et codage binaire de texte UTF-8",
      "Utiliser des nombres flottants qui perdent en précision passé 2^53"
    ]
  },
  "faqs": [
    {
      "id": "binconv-faq-1",
      "question": "Comment convertir un nombre décimal en binaire ?",
      "answer": "Divisez successivement par 2 et relevez les restes de bas en haut. Pour 11 : restes 1, 1, 0, 1 donnent 1011."
    },
    {
      "id": "binconv-faq-2",
      "question": "Quelle différence entre nombres binaires et texte binaire ?",
      "answer": "Le nombre 65 devient 1000001 ; la lettre \"A\" occupe le point de code 65 et s’écrit sur un octet complet 01000001."
    },
    {
      "id": "binconv-faq-3",
      "question": "Pourquoi préférer l’hexadécimal au binaire pour lire des données ?",
      "answer": "Un chiffre hexadécimal regroupe exactement quatre bits, réduisant un mot de 32 bits à seulement 8 caractères."
    },
    {
      "id": "binconv-faq-4",
      "question": "À quoi sert le compteur de bits et quid des zéros initiaux ?",
      "answer": "Il indique la longueur naturelle du nombre (7 bits pour 65) afin de savoir combien de zéros ajouter pour remplir un registre de 8 ou 16 bits."
    },
    {
      "id": "binconv-faq-5",
      "question": "Mon entrée binaire a un préfixe 0b ou des espaces : est-ce pris en charge ?",
      "answer": "Oui. L’outil détecte 0b, espaces et underscores et propose le nettoyage automatique en un clic."
    },
    {
      "id": "binconv-faq-6",
      "question": "Le calcul reste-t-il exact sur de très grands nombres ?",
      "answer": "Oui, jusqu’à 512 bits en arithmétique entière BigInt, sans aucun arrondi flottant au-dessus de 2^53."
    }
  ]
};
