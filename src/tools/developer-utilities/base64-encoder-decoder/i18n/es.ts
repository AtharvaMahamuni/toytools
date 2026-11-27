import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'base64-encoder-decoder',
  name: 'Codificador y Decodificador Base64',
  seoTitle: 'Codificar y Decodificar Base64 Online Gratis',
  description:
    'Convierte texto UTF-8 a Base64 y decodifica cadenas Base64 o Base64URL al instante en tu navegador. Detección automática y reparación de relleno sin envíos.',
  tagline: 'Codifica y decodifica Base64 y texto al instante.',
  craft: {
    solves:
      'Los prefijos Data URI, variantes Base64URL sin relleno o espacios copiados suelen romper la decodificación y parecer un fallo del navegador.',
  },
  knowledge: {
    primaryConcepts: ['Base64'],
    realWorldUseCases: [
      'Incrustar imágenes pequeñas como Data URI en HTML o CSS',
      'Transportar datos binarios dentro de respuestas JSON',
      'Inspeccionar la cabecera y el payload de un token JWT',
      'Codificar adjuntos y cabeceras MIME en correo electrónico',
    ],
    commonMistakes: [
      'Confundir Base64 con un método de cifrado o seguridad',
      'Olvidar que Base64 aumenta el tamaño alrededor de un 33 %',
    ],
  },
  faqs: [
    {
      id: 'b64-faq-1',
      question: '¿Qué es Base64?',
      answer:
        'Es un esquema de codificación binario a texto que representa bytes arbitrarios usando 64 caracteres ASCII imprimibles (`A–Z`, `a–z`, `0–9`, `+`, `/`) más relleno `=`, pensado para atravesar sistemas basados en texto.',
    },
    {
      id: 'b64-faq-2',
      question: '¿Cómo codifico texto a Base64?',
      answer:
        'Pega o escribe tu texto en la entrada y selecciona el modo «Codificar → Base64». El resultado UTF-8 convertido aparece al instante listo para copiar.',
    },
    {
      id: 'b64-faq-3',
      question: '¿Cómo decodifico una cadena Base64 a texto?',
      answer:
        'Pega la cadena en la entrada y elige «Decodificar ← Base64». Si incluye prefijo Data URI o formato Base64URL, la herramienta ofrece repararlo con un clic.',
    },
    {
      id: 'b64-faq-4',
      question: '¿Base64 es un tipo de cifrado?',
      answer:
        'No. Base64 es codificación reversible sin clave secreta: cualquiera puede decodificarlo al momento. Para proteger confidencialidad usa cifrado real como AES o TLS.',
    },
    {
      id: 'b64-faq-5',
      question: '¿Son seguros los datos codificados en Base64?',
      answer:
        'No ofrece ninguna seguridad por sí solo. Sirve únicamente para transporte compatible por texto, nunca para ocultar secretos o credenciales.',
    },
    {
      id: 'b64-faq-6',
      question: '¿Por qué a veces termina en "=" o "=="?',
      answer:
        'Base64 agrupa la entrada en bloques de 3 bytes (24 bits). Cuando los bytes no son múltiplo de 3, añade uno o dos signos `=` para completar el último bloque de 4 caracteres.',
    },
    {
      id: 'b64-faq-7',
      question: '¿Qué es Base64URL y en qué se diferencia del Base64 estándar?',
      answer:
        'Base64URL sustituye `+` por `-` y `/` por `_` (y suele omitir `=`) para evitar conflictos con URLs y nombres de archivo. Es el formato utilizado en tokens JWT.',
    },
    {
      id: 'b64-faq-8',
      question: '¿Base64 puede codificar imágenes o archivos binarios?',
      answer:
        'Sí, cualquier flujo de bytes puede representarse en Base64 como Data URI (`data:image/png;base64,...`). Esta utilidad trabaja directamente con cadenas de texto y UTF-8.',
    },
    {
      id: 'b64-faq-9',
      question: '¿Por qué la salida Base64 pesa más que el original?',
      answer:
        'Cada 3 bytes de entrada generan 4 caracteres ASCII de salida, aumentando el tamaño en torno a un 33 % a cambio de compatibilidad textual universal.',
    },
  ],
  guide: {
    title: 'Qué es Base64, relleno "=" y diferencia con Base64URL',
    description:
      'Cómo convierte Base64 grupos de 3 bytes en 4 caracteres, por qué incrementa un 33 % el tamaño y por qué no es cifrado.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'Base64',
    forwardLabel: 'Codificar → Base64',
    inverseLabel: 'Decodificar ← Base64',
    outputLabel: 'Salida',
    placeholder: 'Escribe o pega texto o Base64 aquí…',
    outputPlaceholder: 'El resultado aparecerá aquí…',
    emptyOutput: 'Introduce texto o una cadena Base64 para empezar.',
    insight:
      'Base64 representa bytes arbitrarios usando 64 caracteres ASCII seguros (~33 % más grande). Es codificación de transporte reversible, no cifrado.',
    technical: [
      { term: 'Codificación', detail: 'Texto UTF-8 convertido a alfabeto RFC 4648 (A-Z, a-z, 0-9, +, /)' },
      { term: 'Expansión', detail: '4 caracteres por cada 3 bytes (~33 % de sobrecarga más relleno =)' },
      { term: 'Privacidad', detail: 'Ejecución 100 % local en tu navegador sin llamadas al servidor' },
    ],
    compareLabel: 'Comparar',
    comparePlaceholder: 'Valor esperado opcional',
    modeAriaLabel: 'Modo de conversión',
    inputAriaLabel: 'Entrada',
    outputAriaLabel: 'Resultado convertido',
    swapLabel: 'Intercambiar',
    swapAriaLabel: 'Intercambiar entrada y salida',
    metaAriaLabel: 'Metadatos de conversión',
    byteAriaLabel: 'Vista hexadecimal de bytes',
    historyTitle: 'Historial reciente',
    historyAriaLabel: 'Entradas recientes',
    insightAriaLabel: 'Explicación técnica',
    appliedPrefix: 'Corrección aplicada:',
    checkInputMsg: 'Revisa la entrada: contiene caracteres inválidos para decodificar.',
    invalidInputMsg: 'Entrada Base64 no válida.',
    couldNotConvertMsg: 'No se pudo convertir la entrada.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificación URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcado',
    },
    engine: {
      errDecode: 'No se pudo decodificar como Base64 válido.',
      errEncode: 'No se pudo codificar a Base64.',
      errBadCharTpl: 'Carácter Base64 no válido «{ch}» en la posición {pos}.',
      errBadPadTpl: 'Relleno = inesperado cerca de la posición {pos}; solo puede ir al final.',
      warnLen: 'La longitud sin relleno no es múltiplo de 4; es posible que falte relleno =.',
      recDataUri: 'Quitar prefijo Data URI (data:...;base64,)',
      recBase64Url: 'Convertir de Base64URL (- / _) a Base64 estándar',
      recPadding: 'Añadir relleno (=) faltante al final',
      metaInputBytes: 'Bytes entrada',
      metaB64Length: 'Long. Base64',
      metaExpansion: 'Expansión',
    },
  },
};
