import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor binario",
  "seoTitle": "Conversor Binario - Decimal a Binario y Viceversa",
  "description": "Convierte números decimales a base 2 y binario a decimal con exactitud hasta 512 bits, mostrando hex, octal y longitud de bits.",
  "tagline": "De decimal a binario y viceversa, junto con hex y octal.",
  "lead": "Convierte enteros grandes hasta 512 bits entre base 10 y base 2 con BigInt en tu navegador, limpiando prefijos 0b y separadores.",
  "guide": {
    "title": "Decimal, binario, hex y el ancho en bits",
    "description": "Cómo funciona el valor posicional en base 2, por qué un dígito hex equivale a cuatro bits y diferencias frente a texto a binario."
  },
  "ui": {
    "displayName": "Binario",
    "forwardLabel": "A binario →",
    "inverseLabel": "A decimal ←",
    "outputLabel": "Resultado",
    "placeholder": "Escribe un número decimal o pega dígitos binarios.",
    "modeAriaLabel": "Dirección de conversión",
    "inputAriaLabel": "Número decimal o binario",
    "outputAriaLabel": "Resultado convertido",
    "outputPlaceholder": "Aquí aparece el resultado. También puedes editar este lado.",
    "swapLabel": "Intercambiar",
    "swapAriaLabel": "Intercambiar entrada y salida",
    "insight": [
      "El sistema binario usa solo 0 y 1: cada posición vale el doble que la situada a su derecha, de modo que 1011 equivale a 8 + 2 + 1 = 11.",
      "El hexadecimal aparece junto al binario porque un dígito hex equivale exactamente a cuatro bits (0xFF = 1111 1111), facilitando leer volcados o colores.",
      "El ancho en bits define cómo alinear ceros iniciales para registros o canales de color."
    ],
    "technical": [
      {
        "term": "Rango",
        "detail": "Exacto hasta 512 bits con BigInt (sin redondeo tras 2^53)"
      },
      {
        "term": "Acepta",
        "detail": "Prefijo 0b, espacios, guiones bajos, comas y apóstrofos"
      },
      {
        "term": "Negativos",
        "detail": "Signo y magnitud (-1011), no complemento a dos"
      },
      {
        "term": "Metadatos",
        "detail": "Hexadecimal, octal, número de bits y bytes"
      },
      {
        "term": "Diferencia",
        "detail": "No codifica texto; para letras usa texto a binario"
      }
    ],
    "engine": {
      "detBinary": "Binario",
      "detNumber": "Número",
      "errEnterNumber": "Introduce un número.",
      "errBadBinTpl": "\"{ch}\" no es un dígito binario. El binario solo usa 0 y 1.",
      "errWhole": "Introduce un número entero solo con dígitos.",
      "errMaxBitsTpl": "Tiene {bits} bits. El límite aquí es de {max} bits.",
      "metaHex": "Hex",
      "metaOctal": "Octal",
      "metaBits": "Bits",
      "metaBytes": "Bytes",
      "recUseTpl": "Usar {cleaned}"
    }
  },
  "knowledge": {
    "summary": "Convierte números decimales y binarios con precisión exacta de hasta 512 bits junto a hex, octal y conteo de bits.",
    "useCases": [
      "Interpretar máscaras de permisos o flags en configuración",
      "Contrastes entre valores de registros de hardware y código",
      "Ver qué bits concretos cambian entre dos cifras al depurar",
      "Enseñar valor posicional en base 2 observando desplazamientos"
    ],
    "mistakes": [
      "Omitir ceros iniciales al alinear bytes de 8 bits",
      "Confundir conversión de números a binario con texto UTF-8 a bits",
      "Usar calculadoras de coma flotante que redondean por encima de 2^53"
    ]
  },
  "faqs": [
    {
      "id": "binconv-faq-1",
      "question": "¿Cómo convertir un número decimal a binario?",
      "answer": "Divide entre 2 repetidamente anotando los restos y léelos de abajo arriba. Por ejemplo, 11 da restos 1, 1, 0, 1 → 1011."
    },
    {
      "id": "binconv-faq-2",
      "question": "¿Qué diferencia hay entre números binarios y texto binario?",
      "answer": "Aquí el número 65 pasa a 1000001 por valor posicional; en texto binario, el carácter \"A\" ocupa el código 65 y se rellena a 8 bits (01000001)."
    },
    {
      "id": "binconv-faq-3",
      "question": "¿Por qué se usa hexadecimal en lugar de binario?",
      "answer": "Porque cada carácter hexadecimal representa exactamente cuatro bits: 32 bits caben en 8 dígitos hex en lugar de 32 ceros y unos."
    },
    {
      "id": "binconv-faq-4",
      "question": "¿Por qué se muestra el conteo de bits y qué pasa con los ceros iniciales?",
      "answer": "El valor numérico mínimo de 65 ocupa 7 bits (1000001), pero un byte lleva un cero delante (01000001). Conocer los bits te permite rellenar al ancho exacto."
    },
    {
      "id": "binconv-faq-5",
      "question": "¿Funciona si mi binario trae prefijo 0b y espacios o guiones bajos?",
      "answer": "Sí. El conversor detecta prefijos 0b y separadores (1010 1100 o 1010_1100) y ofrece limpiarlos con un toque."
    },
    {
      "id": "binconv-faq-6",
      "question": "¿Es exacto para enteros muy grandes?",
      "answer": "Sí, hasta 512 bits usando enteros BigInt de precisión arbitraria, sin el redondeo silencioso de JavaScript a partir de 2^53."
    }
  ]
};
