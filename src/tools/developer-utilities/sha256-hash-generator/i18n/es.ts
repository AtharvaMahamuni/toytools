import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'sha256-hash-generator',
  name: 'Generador de Hash SHA-256',
  seoTitle: 'Generador Hash SHA-256 Online – Comprobar Digest',
  description:
    'Calcula resúmenes criptográficos SHA-256 en hexadecimal (64 caracteres) y verifica hashes esperados directamente en tu navegador mediante WebCrypto, sin envíos.',
  tagline: 'Genera hashes SHA-256 de cualquier texto al instante.',
  citation: {
    problem: 'Usa este generador SHA-256 cuando necesites calcular o verificar el digest de un texto sin subirlo a ningún servidor.',
    nonGoal: 'revertir un hash criptográfico ni enviar los datos a una inteligencia artificial.',
  },
  craft: {
    solves:
      'Un digest solo sirve comparado contra el valor esperado, pero revisar 64 caracteres hexadecimales a ojo falla fácilmente o confunde algoritmos distintos.',
  },
  knowledge: {
    primaryConcepts: ['SHA-256'],
    realWorldUseCases: [
      'Verificar firmas y huellas digitales de certificados TLS/SSL',
      'Firmar paquetes de software y manifiestos de distribución',
      'Identificar transacciones y prueba de trabajo en Bitcoin',
      'Comprobar la integridad de datos frente a manipulaciones',
    ],
    commonMistakes: [
      'Usar SHA-256 directo para guardar contraseñas sin sal ni factor de coste',
      'Confundir una función hash unidireccional con cifrado reversible',
    ],
  },
  faqs: [
    {
      id: 'sha256-faq-1',
      question: '¿Qué es SHA-256?',
      answer:
        'Es una función hash criptográfica de la familia SHA-2 (estandarizada en 2001) que produce siempre un resumen de 256 bits representado en 64 caracteres hexadecimales. No tiene ataques de colisión prácticos conocidos.',
    },
    {
      id: 'sha256-faq-2',
      question: '¿Cómo luce un hash SHA-256?',
      answer:
        'Siempre consta de exactamente 64 dígitos hexadecimales (`0–9`, `a–f`). Cambiar un solo carácter en la entrada transforma por completo la salida por efecto avalancha.',
    },
    {
      id: 'sha256-faq-3',
      question: '¿Se puede revertir un hash SHA-256?',
      answer:
        'No. Es una función unidireccional: no existe operación inversa para recuperar el texto original desde el resumen, aunque entradas cortas conocidas puedan encontrarse en tablas precalculadas.',
    },
    {
      id: 'sha256-faq-4',
      question: '¿Por qué se considera seguro SHA-256?',
      answer:
        'Porque tras más de dos décadas de análisis público no existen ataques prácticos contra las 64 rondas completas ni métodos viables para forjar colisiones.',
    },
    {
      id: 'sha256-faq-5',
      question: '¿Es seguro SHA-256 para guardar contraseñas?',
      answer:
        'No. SHA-256 es rapidísimo (miles de millones de cálculos por segundo en GPU). Para contraseñas usa funciones lentas con sal como Argon2, bcrypt o scrypt.',
    },
    {
      id: 'sha256-faq-6',
      question: '¿Cómo usa Bitcoin el algoritmo SHA-256?',
      answer:
        'En la prueba de trabajo de minería (`SHA-256(SHA-256(cabecera))`) y para calcular identificadores de transacción y árboles de Merkle.',
    },
    {
      id: 'sha256-faq-7',
      question: '¿Qué diferencia hay entre SHA-256 y SHA-512?',
      answer:
        'Ambos pertenecen a SHA-2: SHA-256 produce 256 bits (64 caracteres hex) en 64 rondas de 32 bits, y SHA-512 produce 512 bits (128 hex) en 80 rondas de 64 bits.',
    },
    {
      id: 'sha256-faq-8',
      question: '¿Cómo se compara SHA-256 con MD5 y SHA-1?',
      answer:
        'MD5 (128 bits) y SHA-1 (160 bits) tienen colisiones prácticas demostradas y están obsoletos en seguridad. SHA-256 (256 bits) es el estándar base vigente.',
    },
    {
      id: 'sha256-faq-9',
      question: '¿Qué es la familia SHA-2?',
      answer:
        'Conjunto de funciones hash publicadas por el NIST (SHA-224, SHA-256, SHA-384, SHA-512) basadas en construcción Merkle–Damgård, distintas de SHA-3 (Keccak).',
    },
    {
      id: 'sha256-faq-10',
      question: '¿Puedo calcular hashes SHA-256 sin subir el texto?',
      answer:
        'Sí. El cálculo se realiza íntegramente en la memoria de tu pestaña usando las primitivas WebCrypto del navegador sin enviar datos a la nube.',
    },
    {
      id: 'sha256-faq-11',
      question: '¿Generar SHA-256 utiliza aprendizaje automático o IA?',
      answer:
        'No. SHA-256 ejecuta operaciones bit a bit y rondas deterministas definidas en FIPS PUB 180-4 sin conexión con modelos de IA.',
    },
  ],
  guide: {
    title: 'Qué es SHA-256, checksums y usos reales en seguridad',
    description:
      'Cómo verificar un checksum SHA-256 en Windows, macOS y Linux, efecto avalancha y por qué no sirve para almacenar contraseñas.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'SHA-256',
    forwardLabel: 'Calcular SHA-256',
    inverseLabel: 'Verificar digest',
    outputLabel: 'Digest SHA-256 (hex)',
    placeholder: 'Escribe o pega texto UTF-8 para generar su hash SHA-256…',
    outputPlaceholder: 'El hash de 64 caracteres hex aparecerá aquí…',
    emptyOutput: 'Introduce cualquier texto para calcular su resumen SHA-256.',
    insight:
      'SHA-256 transforma cualquier entrada UTF-8 en una huella fija de 256 bits (64 caracteres hex). Es determinista e irreversible; para contraseñas usa Argon2 o bcrypt.',
    technical: [
      { term: 'Algoritmo', detail: 'SHA-256 (FIPS 180-4) ejecutado con SubtleCrypto WebCrypto API' },
      { term: 'Salida', detail: '256 bits siempre mostrados como 64 dígitos hexadecimales minúsculas' },
      { term: 'Privacidad', detail: 'Cálculo local en tu dispositivo; nunca se envía texto plano' },
    ],
    compareLabel: 'Verificar hash esperado',
    comparePlaceholder: 'Pega aquí un SHA-256 de 64 caracteres para comparar',
    modeAriaLabel: 'Modo SHA-256',
    inputAriaLabel: 'Texto de entrada',
    outputAriaLabel: 'Hash SHA-256 generado',
    swapLabel: 'Intercambiar',
    swapAriaLabel: 'Intercambiar paneles',
    metaAriaLabel: 'Metadatos del hash',
    byteAriaLabel: 'Vista hexadecimal de bytes',
    historyTitle: 'Historial reciente',
    historyAriaLabel: 'Entradas recientes',
    insightAriaLabel: 'Explicación técnica',
    appliedPrefix: 'Corrección aplicada:',
    checkInputMsg: 'Revisa el texto de entrada.',
    invalidInputMsg: 'No se pudo generar el digest.',
    couldNotConvertMsg: 'Error al calcular el hash.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: 'Verificación:',
    digestSuffix: 'contra la salida calculada.',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificación URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcado',
    },
    engine: {
      bitsTpl: '{bits} bits',
      metaAlgorithm: 'Algoritmo',
      metaOutput: 'Tamaño',
      metaHexChars: 'Long. hex',
      metaInputBytes: 'Bytes entrada',
      errHash: 'No se pudo calcular el hash SHA-256 en este navegador.',
      digestUnreadable: 'Formato irreconocible: se esperan 64 dígitos hexadecimales para SHA-256.',
      digestWrongNamedTpl: 'Ese hash parece {algo} ({len} caracteres), no SHA-256 (64 caracteres).',
      digestWrongLenTpl: 'Longitud incorrecta ({len} caracteres hex); SHA-256 tiene exactamente 64.',
      digestMatch: 'Coincide exactamente con el digest SHA-256 generado.',
      digestMismatch: 'No coincide: el valor comparado difiere del digest SHA-256 actual.',
    },
  },
};
