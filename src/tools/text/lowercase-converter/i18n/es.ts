import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "lowercase-converter",
  "name": "Convertidor a Minúsculas",
  "seoTitle": "Convertir Texto a Minúsculas Online",
  "description": "Convierte todo el texto a minúsculas al instante en tu navegador, ideal para correos, etiquetas y comparaciones sin subir datos.",
  "tagline": "Convierte cualquier texto a minúsculas y cópialo al instante.",
  "knowledge": {
    "primaryConcepts": [
      "minúsculas"
    ],
    "realWorldUseCases": [
      "Normalizar correos o usuarios antes de guardarlos",
      "Unificar etiquetas para evitar duplicados",
      "Preparar texto para comparaciones sin distinción de caso",
      "Corregir textos escritos con Bloq Mayús"
    ],
    "commonMistakes": [
      "Convertir nombres propios o siglas que necesitaban mayúscula",
      "Normalizar solo uno de los dos textos al comparar"
    ]
  },
  "faqs": [
    {
      "id": "lc-faq-1",
      "question": "¿Cómo convierto un texto a minúsculas?",
      "answer": "Pega o escribe el texto y verás al instante todas sus letras en minúsculas en el panel derecho listo para copiar."
    },
    {
      "id": "lc-faq-2",
      "question": "¿Dónde hace falta usar minúsculas?",
      "answer": "Son el estándar para direcciones de correo, slugs de URL, hashtags y nombres de módulos o variables en programación."
    },
    {
      "id": "lc-faq-3",
      "question": "¿Cómo normalizo correos antes de guardarlos?",
      "answer": "Pasa la columna de correos por aquí para que Jane.Doe@Example.COM quede como jane.doe@example.com y evitar duplicados en registros."
    },
    {
      "id": "lc-faq-4",
      "question": "¿Normalizar en minúsculas o en mayúsculas?",
      "answer": "Usa minúsculas: es la convención web universal para correos, URLs y etiquetas."
    },
    {
      "id": "lc-faq-5",
      "question": "¿Por qué sigue fallando mi comparación tras pasar a minúsculas?",
      "answer": "Porque debes convertir ambos lados de la comparación y revisar espacios al inicio o al final."
    },
    {
      "id": "lc-faq-6",
      "question": "¿Cambia los números o los símbolos?",
      "answer": "No, dígitos, signos y puntuación quedan intactos."
    },
    {
      "id": "lc-faq-7",
      "question": "¿Por qué ciertos caracteres no cambiaron?",
      "answer": "Los dígitos, emojis y alfabetos sin distinción de caja (japonés, chino, árabe) no tienen minúsculas equivalentes y se mantienen iguales."
    },
    {
      "id": "lc-faq-8",
      "question": "¿Se pierden siglas y nombres propios?",
      "answer": "Sí: «NASA» pasa a «nasa». Conserva el texto original para lectura humana y usa la copia en minúsculas para claves o URLs."
    },
    {
      "id": "lc-faq-9",
      "question": "¿Funciona sin conexión?",
      "answer": "Sí, una vez cargada la página funciona offline en tu navegador."
    }
  ],
  "guide": {
    "title": "Cómo convertir texto a minúsculas",
    "description": "Cuándo normalizar correos, slugs y etiquetas en minúsculas y qué debes vigilar con siglas y nombres."
  },
  "ui": {
    "placeholder": "Pega o escribe tu texto aquí",
    "outputPlaceholder": "El texto en minúsculas aparecerá aquí",
    "sampleText": "Hola MUNDO, API_KEY y Correo@Ejemplo.COM",
    "handoff": {
      "msgTpl": "Se perdió la mayúscula de {n} sigla(s) ({list}) y este conversor no puede restaurarla."
    }
  }
};
