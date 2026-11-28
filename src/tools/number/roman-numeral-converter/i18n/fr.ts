import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Convertisseur de chiffres romains",
  "seoTitle": "Convertisseur Chiffres Romains - I à MMMCMXCIX",
  "description": "Convertissez nombres en chiffres romains et inversement (1 à 3999). Reconnaît IIII sur les cadrans et propose la forme moderne.",
  "tagline": "Nombres vers chiffres romains et retour, de I à MMMCMXCIX.",
  "lead": "Convertissez vos nombres de 1 à 3999 dans les deux sens directement dans votre navigateur tout en détectant les variantes anciennes.",
  "guide": {
    "title": "Lire et écrire les chiffres romains sans hésiter",
    "description": "Les six paires soustractives, pourquoi les horloges affichent IIII, la limite de 3999 et la lecture des dates de générique."
  },
  "ui": {
    "displayName": "Chiffre romain",
    "forwardLabel": "En romain →",
    "inverseLabel": "En nombre ←",
    "outputLabel": "Résultat",
    "placeholder": "Entrez un entier (1 à 3999) ou un chiffre romain.",
    "modeAriaLabel": "Sens de conversion",
    "inputAriaLabel": "Nombre ou chiffre romain",
    "outputAriaLabel": "Résultat converti",
    "outputPlaceholder": "Le résultat apparaît ici. Ce champ est également éditable.",
    "swapLabel": "Inverser",
    "swapAriaLabel": "Échanger entrée et sortie",
    "insight": [
      "Les chiffres romains s’additionnent du plus grand au plus petit, sauf lorsqu’un symbole moindre précède un plus grand pour être soustrait : IV vaut 4 et VI vaut 6.",
      "Seules six paires soustractives sont reconnues : IV, IX, XL, XC, CD et CM. Écrire IC pour 99 n’appartient pas à la tradition romaine.",
      "En texte brut la notation s’arrête à 3999 (MMMCMXCIX), les valeurs supérieures exigeant une barre supérieure (vinculum) multiplicatrice par mille."
    ],
    "technical": [
      {
        "term": "Plage",
        "detail": "1 à 3999 (MMMCMXCIX). Aucun symbole pour zéro ni négatifs"
      },
      {
        "term": "Lettres",
        "detail": "I=1, V=5, X=10, L=50, C=100, D=500, M=1000"
      },
      {
        "term": "Soustractions",
        "detail": "IV, IX, XL, XC, CD, CM uniquement"
      },
      {
        "term": "Lecture",
        "detail": "Souple : décode IIII ou VIIII et signale la norme"
      },
      {
        "term": "Écriture",
        "detail": "Stricte : toujours la graphie canonique soustractive"
      }
    ],
    "engine": {
      "detNumber": "Nombre",
      "detRoman": "Chiffre romain",
      "errWhole": "Entrez un nombre entier composé uniquement de chiffres.",
      "errZero": "Rome n’avait pas de chiffre pour zéro. Le minimum est I.",
      "errNegative": "Les chiffres romains n’ont pas de signe négatif.",
      "errOverbarTpl": "{n} requiert un surlignage (vinculum) ; le texte brut s’arrête à {max} (MMMCMXCIX).",
      "errBadRomanTpl": "\"{ch}\" n’est pas une lettre romaine valide. Seules I, V, X, L, C, D et M existent.",
      "warnNonStd": "Lisible, mais ce n’est pas l’orthographe moderne standard.",
      "metaValue": "Valeur",
      "metaLetters": "Lettres",
      "metaSubtractive": "Paires soustractives",
      "recCanonicalTpl": "Réécrire en {canonical}, l’écriture standard de {value}"
    }
  },
  "knowledge": {
    "summary": "Convertit nombres et chiffres romains dans les deux sens, décode les cadrans IIII et propose en un clic la forme canonique.",
    "useCases": [
      "Lire l’année au générique d’un film ou sur un frontispice",
      "Numéroter chapitres, siècles ou tomes d’un ouvrage",
      "Vérifier une date avant gravure ou tatouage",
      "Identifier le numéro d’ordre d’un souverain ou d’un événement"
    ],
    "mistakes": [
      "Écrire IC pour 99 au lieu de XCIX",
      "Recopier IIII d’une horloge en croyant que c’est l’écriture moderne",
      "Chercher à dépasser 3999 sans barre multiplicatrice"
    ]
  },
  "faqs": [
    {
      "id": "roman-faq-1",
      "question": "À quelle année correspond MCMXCIX ?",
      "answer": "À 1999 : M (1000) + CM (900) + XC (90) + IX (9). Décomposer ces paires soustractives rend toute date de générique lisible en un clin d’œil."
    },
    {
      "id": "roman-faq-2",
      "question": "Pourquoi les horloges utilisent-elles IIII plutôt que IV ?",
      "answer": "Par symétrie face au VIII opposé sur le cadran et par commodité historique de fonderie. Le convertisseur lit IIII puis vous propose IV."
    },
    {
      "id": "roman-faq-3",
      "question": "Pourquoi les chiffres romains s’arrêtent-ils à 3999 ?",
      "answer": "4000 nécessiterait quatre M ou une barre horizontale au-dessus (vinculum) multipliant par 1000, absente du texte ASCII ordinaire."
    },
    {
      "id": "roman-faq-4",
      "question": "Peut-on écrire 99 sous la forme IC ?",
      "answer": "Non. La soustraction ne s’applique qu’aux deux rangs immédiatement supérieurs : 99 s’écrit obligatoirement XCIX."
    },
    {
      "id": "roman-faq-5",
      "question": "Pourquoi indique-t-il que mon chiffre n’est pas standard ?",
      "answer": "Parce qu’il décode une graphie additive ancienne comme IIII, VIIII ou MDCCCCX puis suggère l’orthographe moderne en un geste."
    },
    {
      "id": "roman-faq-6",
      "question": "Existe-t-il un chiffre romain pour zéro ?",
      "answer": "Non. Le système visait le décompte concret ; les scribes médiévaux écrivaient le mot nulla pour exprimer l’absence."
    }
  ]
};
