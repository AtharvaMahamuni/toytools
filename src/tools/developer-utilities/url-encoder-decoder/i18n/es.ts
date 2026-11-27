import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'url-encoder-decoder',
  name: 'Codificador y Decodificador URL',
  seoTitle: 'Codificar y Decodificar URL (Percent-Encoding) Online',
  description:
    'Codifica o decodifica parámetros y fragmentos de URL (`encodeURIComponent`) en tu navegador. Explica %20 frente a + y repara doble codificación sin envíos.',
  tagline: 'Codifica y decodifica componentes de URL con %XX al instante.',
  craft: {
    solves:
      'Una doble codificación, un "+" heredado de formularios o un "%" suelto rompen la decodificación y hacen creer al usuario que falla la herramienta.',
  },
  knowledge: {
    primaryConcepts: ['codificación URL'],
    realWorldUseCases: [
      'Codificar términos de búsqueda en parámetros de consulta',
      'Pasar una dirección de correo electrónico o redirect_uri OAuth como parámetro',
      'Escapar rutas con espacios o caracteres acentuados',
    ],
    commonMistakes: [
      'Codificar la URL completa en lugar de cada componente o valor por separado',
      'Aplicar doble codificación convirtiendo %20 en %2520',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: '¿Qué hace la codificación URL (percent-encoding)?',
      answer:
        'Sustituye los caracteres reservados o no seguros de una URL por `%` seguido de dos dígitos hexadecimales que representan su byte UTF-8 (por ejemplo `%20` para espacio o `%26` para `&`).',
    },
    {
      id: 'url-enc-faq-2',
      question: '¿Qué diferencia hay entre %20 y + para los espacios?',
      answer:
        '`%20` es el estándar RFC 3986 válido en rutas y consultas URL; `+` solo representa espacio dentro de datos de formulario `application/x-www-form-urlencoded`. En APIs o rutas, `+` suele tratarse como un signo más literal.',
    },
    {
      id: 'url-enc-faq-3',
      question: '¿Cuándo usar encodeURIComponent frente a encodeURI?',
      answer:
        'Usa `encodeURIComponent` para valores de parámetros individuales que puedan llevar `&`, `=`, `/` o `?`. Usa `encodeURI` solo para preservar intacta una URL completa ya formada.',
    },
    {
      id: 'url-enc-faq-4',
      question: '¿Qué caracteres deben codificarse con porcentaje?',
      answer:
        'Espacios, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, acentos, emojis y cualquier carácter no ASCII; además `&`, `=`, `/`, `?`, `#`, `:` cuando aparecen dentro del valor de un parámetro.',
    },
    {
      id: 'url-enc-faq-5',
      question: '¿Qué es la doble codificación y cómo evitarla?',
      answer:
        'Ocurre al codificar una cadena que ya estaba codificada: `%20` pasa a `%2520`. Decodifica primero o codifica una sola vez justo antes de montar la URL final.',
    },
    {
      id: 'url-enc-faq-6',
      question: '¿Se aplica tanto a rutas como a parámetros de consulta?',
      answer:
        'Sí. Tanto los segmentos de ruta (`/mi%20carpeta/archivo.txt`) como los parámetros (`?q=hola%20mundo`) requieren escapar espacios y símbolos reservados.',
    },
    {
      id: 'url-enc-faq-7',
      question: '¿Codificación URL y percent-encoding son lo mismo?',
      answer:
        'Sí. La especificación RFC 3986 lo llama percent-encoding, mientras que en desarrollo web suele denominarse URL encoding o escaping.',
    },
    {
      id: 'url-enc-faq-8',
      question: '¿Qué pasa si olvido codificar un parámetro de consulta?',
      answer:
        'Un `&` sin escapar corta el parámetro en dos, un `?` inicia otra consulta y un `#` trunca todo lo posterior convirtiéndolo en ancla local que no llega al servidor.',
    },
    {
      id: 'url-enc-faq-9',
      question: '¿Cómo codifica y decodifica esta herramienta?',
      answer:
        'Utiliza `encodeURIComponent` y `decodeURIComponent` sobre tu entrada UTF-8 localmente en el navegador, ideal para valores de parámetros y segmentos de ruta.',
    },
  ],
  guide: {
    title: 'Qué es codificación URL, %20 vs + y errores',
    description:
      'Cómo funciona percent-encoding según RFC 3986, diferencia entre encodeURI y encodeURIComponent y errores frecuentes.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'Codificar → URL',
    inverseLabel: 'Decodificar ← URL',
    outputLabel: 'Salida',
    placeholder: 'Escribe o pega texto o cadena %XX aquí…',
    outputPlaceholder: 'El resultado aparecerá aquí…',
    emptyOutput: 'Introduce texto o una URL codificada para empezar.',
    insight:
      'Percent-encoding reemplaza caracteres reservados o no ASCII por %XX en UTF-8 (`encodeURIComponent`). Evita que &, =, ? o espacios rompan la estructura de la URL.',
    technical: [
      { term: 'Método', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: 'Espacios', detail: '%20 en URIs estándar; + en formularios x-www-form-urlencoded' },
      { term: 'Privacidad', detail: 'Procesamiento local en tu navegador sin enviar URLs ni tokens' },
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
    checkInputMsg: 'Revisa la entrada: contiene secuencias % mal formadas.',
    invalidInputMsg: 'Secuencia percent-encoded no válida.',
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
      errDecode: 'No se pudo decodificar la cadena URL.',
      errEncode: 'No se pudo codificar la entrada como componente URL.',
      errInvalidPctTpl: 'Secuencia % incompleta o inválida en la posición {pos}.',
      recDouble: 'Posible doble codificación (%25XX): decodificar un nivel adicional',
      recStrayPct: 'Escapar signos % sueltos como %25 antes de decodificar',
      recPlus: 'Sustituir + por espacios (formato x-www-form-urlencoded)',
      metaEscapes: 'Secuencias %XX',
      escCountTpl: '{n} secuencias',
      metaInputLen: 'Long. entrada',
      metaOutputBytes: 'Bytes salida',
    },
  },
};
