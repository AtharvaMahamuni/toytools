import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de números romanos",
  "seoTitle": "Conversor de Números Romanos - I a MMMCMXCIX",
  "description": "Convierte números arábigos a romanos y viceversa (I a MMMCMXCIX). Lee fechas antiguas de relojes o créditos y sugiere la forma moderna.",
  "tagline": "De números a romanos y viceversa, desde I hasta MMMCMXCIX.",
  "lead": "Traduce cifras del 1 al 3999 entre numeración decimal y romana en tu navegador, detectando formas antiguas como IIII o MDCCCCX.",
  "guide": {
    "title": "Cómo leer y escribir números romanos sin adivinar",
    "description": "Los seis pares sustractivos, por qué los relojes usan IIII, por qué el sistema termina en 3999 y cómo leer un año en créditos de cine."
  },
  "ui": {
    "displayName": "Número romano",
    "forwardLabel": "A romano →",
    "inverseLabel": "A número ←",
    "outputLabel": "Resultado",
    "placeholder": "Escribe un número (1 a 3999) o un número romano.",
    "modeAriaLabel": "Dirección de conversión",
    "inputAriaLabel": "Número o cifra romana",
    "outputAriaLabel": "Resultado convertido",
    "outputPlaceholder": "Aquí aparece el resultado. También puedes editar este lado.",
    "swapLabel": "Intercambiar",
    "swapAriaLabel": "Intercambiar entrada y salida",
    "insight": [
      "Los números romanos suman sus letras de mayor a menor, salvo cuando una letra menor precede a otra mayor para restar: así IV es cuatro y VI es seis.",
      "Solo existen seis pares sustractivos estándar: IV, IX, XL, XC, CD y CM. Formas como IC para 99 son invenciones modernas y no romanas.",
      "En texto plano el límite es 3999 (MMMCMXCIX), pues valores mayores requieren una barra superior (vinculum) para multiplicar por mil."
    ],
    "technical": [
      {
        "term": "Rango",
        "detail": "1 a 3999 (MMMCMXCIX). Cero y negativos no existen"
      },
      {
        "term": "Letras",
        "detail": "I=1, V=5, X=10, L=50, C=100, D=500, M=1000"
      },
      {
        "term": "Pares sustractivos",
        "detail": "IV, IX, XL, XC, CD, CM y ningún otro"
      },
      {
        "term": "Lectura",
        "detail": "Flexible: lee IIII o VIIII y avisa de la forma moderna"
      },
      {
        "term": "Escritura",
        "detail": "Estricta: siempre emite la forma canónica sustractiva"
      }
    ],
    "engine": {
      "detNumber": "Número",
      "detRoman": "Número romano",
      "errWhole": "Introduce un número entero solo con dígitos.",
      "errZero": "Roma no tenía numeral para el cero. El menor es I.",
      "errNegative": "Los números romanos no tienen signo negativo.",
      "errOverbarTpl": "{n} necesita una barra superior (vinculum), así que el texto plano llega hasta {max} (MMMCMXCIX).",
      "errBadRomanTpl": "\"{ch}\" no es una letra romana válida. Solo valen I, V, X, L, C, D y M.",
      "warnNonStd": "Legible, pero no es la grafía estándar moderna.",
      "metaValue": "Valor",
      "metaLetters": "Letras",
      "metaSubtractive": "Pares sustractivos",
      "recCanonicalTpl": "Reescribir como {canonical}, la grafía estándar de {value}"
    }
  },
  "knowledge": {
    "summary": "Convierte números a romanos y viceversa, interpreta variantes clásicas como IIII y ofrece la ortografía moderna en un clic.",
    "useCases": [
      "Leer el año de estreno en créditos de películas o portadas de libros",
      "Numerar capítulos, siglos, tomos o apéndices en documentos",
      "Comprobar una fecha antes de grabarla en un anillo o tatuaje",
      "Identificar a qué monarca o edición numerada corresponde una cifra"
    ],
    "mistakes": [
      "Escribir IC para 99 en lugar de XCIX",
      "Copiar IIII de un reloj esperando que devuelva esa misma grafía al revertir",
      "Intentar superar 3999 en texto ASCII sin barra multiplicadora"
    ]
  },
  "faqs": [
    {
      "id": "roman-faq-1",
      "question": "¿Qué año es MCMXCIX?",
      "answer": "Es 1999: M (1000) + CM (900) + XC (90) + IX (9). Al descomponer los tres pares sustractivos se lee al instante cualquier fecha en créditos o monumentos."
    },
    {
      "id": "roman-faq-2",
      "question": "¿Por qué los relojes muestran IIII en lugar de IV?",
      "answer": "Por equilibrio visual frente al VIII del lado opuesto y por economía tradicional al fundir moldes de esferas metálicas. Este conversor acepta IIII y propone IV."
    },
    {
      "id": "roman-faq-3",
      "question": "¿Por qué terminan en 3999?",
      "answer": "Porque 4000 requeriría cuatro M seguidas o una barra horizontal superior (vinculum) que multiplique por mil, imposible de escribir como letra estándar ASCII."
    },
    {
      "id": "roman-faq-4",
      "question": "¿Es válido escribir IC para el 99?",
      "answer": "No. Solo se resta con los dos escalones inmediatamente superiores: el 99 correcto es XCIX (90 + 9)."
    },
    {
      "id": "roman-faq-5",
      "question": "¿Por qué indica que mi numeral no es estándar?",
      "answer": "Porque lee grafías aditivas antiguas como IIII, VIIII o MDCCCCX, muestra su valor correcto y te ofrece actualizarlo a la forma moderna con un clic."
    },
    {
      "id": "roman-faq-6",
      "question": "¿Existe número romano para el cero?",
      "answer": "No. El sistema romano servía para contar y registrar cantidades positivas; el cero no tenía símbolo y los escribas medievales escribían nulla."
    }
  ]
};
