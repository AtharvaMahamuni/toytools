import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Generador de hash MD5",
  "seoTitle": "Generador de Hash MD5 - Sumas de Verificación Online",
  "description": "Genera un hash MD5 de 32 caracteres o suma de verificación desde cualquier texto en tu navegador, rápido y privado.",
  "tagline": "Genera al instante un hash MD5 de 128 bits desde cualquier texto.",
  "lead": "Calcula resúmenes MD5 de 32 caracteres hexadecimales localmente en tu dispositivo para claves de caché o verificación de integridad básica.",
  "guide": {
    "title": "¿Qué es MD5? Cómo funciona y usos seguros",
    "description": "Comprende cómo funciona el algoritmo MD5 de 128 bits, por qué es inseguro para contraseñas y en qué verificaciones sigue siendo práctico."
  },
  "ui": {
    "displayName": "MD5",
    "inputAriaLabel": "Texto a resumir con MD5",
    "comparePlaceholder": "Pega un resumen MD5 de 32 caracteres para compararlo",
    "historyTitle": "Historial reciente",
    "insight": "MD5 produce un resumen hexadecimal de 128 bits. Es rápido pero criptográficamente roto frente a colisiones, así que úsalo solo para deduplicación o claves de caché, nunca para contraseñas ni firmas.",
    "technical": [
      {
        "term": "Estándar",
        "detail": "RFC 1321"
      },
      {
        "term": "Salida",
        "detail": "128 bits, 32 caracteres hexadecimales"
      },
      {
        "term": "Dirección",
        "detail": "Unidireccional: un hash no puede revertirse al texto"
      },
      {
        "term": "Seguridad",
        "detail": "Roto: colisiones prácticas, no apto para seguridad"
      }
    ]
  },
  "knowledge": {
    "summary": "Genera un resumen MD5 de 32 caracteres al instante en tu navegador; útil para checksums rápidos no criptográficos.",
    "useCases": [
      "Verificar descargas frente a corrupción accidental de bits",
      "Generar claves de caché deterministas desde URLs o parámetros",
      "Detectar archivos duplicados por contenido idéntico",
      "Repartir filas uniformemente entre particiones de base de datos"
    ],
    "mistakes": [
      "Almacenar contraseñas de usuarios usando MD5",
      "Confiar en MD5 para detectar manipulaciones maliciosas"
    ]
  },
  "faqs": [
    {
      "id": "md5-faq-1",
      "question": "¿Qué es MD5?",
      "answer": "MD5 es una función hash diseñada en 1991 por Ronald Rivest que convierte cualquier entrada en una huella fija de 32 caracteres hexadecimales (128 bits)."
    },
    {
      "id": "md5-faq-2",
      "question": "¿Cómo es un resumen MD5?",
      "answer": "Siempre consta de 32 dígitos hexadecimales. \"hello\" da 5d41402abc4b2a76b9719d911017c592, mientras que \"Hello\" cambia por completo la salida por el efecto avalancha."
    },
    {
      "id": "md5-faq-3",
      "question": "¿Se puede revertir un hash MD5 al texto original?",
      "answer": "No matemáticamente, pues es unidireccional. Sin embargo, entradas cortas o comunes aparecen en tablas arcoíris precomputadas, por lo que no sirve para contraseñas."
    },
    {
      "id": "md5-faq-4",
      "question": "¿Es seguro utilizar MD5?",
      "answer": "Para usos no relacionados con seguridad sí; para firmas digitales, certificados o protección frente a atacantes no, debido a colisiones conocidas."
    },
    {
      "id": "md5-faq-5",
      "question": "¿Puedo usar MD5 para guardar contraseñas?",
      "answer": "Nunca. MD5 es demasiado rápido para hardware moderno; usa algoritmos lentos con sal como Argon2id, bcrypt o scrypt."
    },
    {
      "id": "md5-faq-6",
      "question": "¿Qué es una colisión de hash?",
      "answer": "Ocurre cuando dos entradas distintas generan el mismo resumen. En MD5 hoy se pueden fabricar colisiones intencionadas en segundos."
    },
    {
      "id": "md5-faq-7",
      "question": "¿Para qué sigue siendo útil MD5 hoy en día?",
      "answer": "Para comprobar descargas frente a errores de transmisión accidentales, claves de caché, ETag internos, deduplicación y sharding."
    },
    {
      "id": "md5-faq-8",
      "question": "¿En qué se diferencia MD5 de SHA-256?",
      "answer": "MD5 produce 128 bits (32 caracteres hex) y está roto; SHA-256 genera 256 bits (64 hex) y mantiene resistencia criptográfica frente a colisiones."
    },
    {
      "id": "md5-faq-9",
      "question": "¿Por qué la misma entrada siempre genera el mismo MD5?",
      "answer": "Porque las funciones hash son deterministas: idénticos bytes de entrada siempre producen exactamente el mismo resumen."
    },
    {
      "id": "md5-faq-10",
      "question": "¿Puedo calcular MD5 sin subir el texto?",
      "answer": "Sí. El cálculo corre íntegramente en JavaScript en tu navegador sin enviar texto por red."
    },
    {
      "id": "md5-faq-11",
      "question": "¿Puede una IA revertir un hash MD5 al texto original?",
      "answer": "No. MD5 es una operación matemática unidireccional con pérdida de información, no un texto cifrado reversible."
    }
  ]
};
