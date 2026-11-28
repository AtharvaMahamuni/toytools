import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "slugify-text",
  "name": "Generador de Slugs URL",
  "seoTitle": "Generador de Slugs URL - Slugify Text Online",
  "description": "Convierte títulos en slugs URL limpios en minúsculas con guiones y sin tildes. Procesa listas enteras línea a línea en tu navegador.",
  "tagline": "Convierte títulos en slugs URL limpios y sin acentos.",
  "knowledge": {
    "primaryConcepts": [
      "slug URL (slugify)"
    ],
    "realWorldUseCases": [
      "Crear permalinks limpios desde títulos de artículos",
      "Generar IDs de anclas HTML legibles",
      "Normalizar nombres de archivos o carpetas sin espacios",
      "Convertir por lotes una lista de títulos para tu CMS"
    ],
    "commonMistakes": [
      "Esperar que conserve mayúsculas o tildes",
      "Confundirlo con kebab-case, que no convierte letras acentuadas a ASCII"
    ]
  },
  "faqs": [
    {
      "id": "slugify-text-faq-1",
      "question": "¿Qué es un slug URL?",
      "answer": "Es el fragmento legible al final de una dirección web, en minúsculas y separado por guiones, como «como-crear-un-slug»."
    },
    {
      "id": "slugify-text-faq-2",
      "question": "¿Cómo maneja tildes y símbolos especiales?",
      "answer": "Convierte vocales acentuadas a ASCII («Café» → «cafe»), expande caracteres como ß→ss o æ→ae y sustituye espacios y símbolos por un único guion."
    },
    {
      "id": "slugify-text-faq-3",
      "question": "¿Puedo convertir toda una lista a la vez?",
      "answer": "Sí. Procesa cada línea de forma independiente y devuelve un slug por línea."
    },
    {
      "id": "slugify-text-faq-4",
      "question": "¿Qué hace que un slug sea bueno para SEO?",
      "answer": "Ser corto, en minúsculas, separado por guiones y centrado en las palabras clave reales de búsqueda."
    },
    {
      "id": "slugify-text-faq-5",
      "question": "¿Diferencia entre slugify y kebab-case?",
      "answer": "Slugify limpia acentos y símbolos dejándolos aptos para URLs; kebab-case mantiene los acentos pensando en identificadores de código."
    },
    {
      "id": "slugify-text-faq-6",
      "question": "¿Es lo mismo el slug que toda la ruta URL?",
      "answer": "No: el slug es únicamente el segmento final legible tras la última barra."
    },
    {
      "id": "slugify-text-faq-7",
      "question": "¿Conserva letras con tilde como «é» o «ñ»?",
      "answer": "No, las pliega intencionalmente a ASCII («e», «n») para evitar codificaciones ilegibles tipo %C3%A9 en la barra de direcciones."
    },
    {
      "id": "slugify-text-faq-8",
      "question": "¿Por qué pasa todo a minúsculas?",
      "answer": "Porque muchos servidores web distinguen mayúsculas de minúsculas; unificar siempre en minúsculas evita páginas duplicadas en Google."
    },
    {
      "id": "slugify-text-faq-9",
      "question": "¿Es seguro pegar títulos privados o borradores?",
      "answer": "Sí, la generación se ejecuta al 100% en tu navegador sin enviar nada."
    }
  ],
  "guide": {
    "title": "Cómo convertir texto en un slug URL limpio",
    "description": "Qué es un slug SEO, cómo se eliminan tildes y caracteres especiales y diferencia frente a kebab-case."
  },
  "ui": {
    "placeholder": "Pega un título o lista de títulos",
    "outputPlaceholder": "Los slugs URL aparecerán aquí",
    "sampleText": "Guía rápida: 10 recetas de café crème\nStraße Øresund 2026",
    "handoff": {
      "msgTpl": "{n} línea(s) sin letras latinas ni dígitos quedaron vacías al convertir a slug.",
      "siblings": {
        "sentence-case-converter": "Tipo Oración",
        "kebab-case-converter": "Kebab Case",
        "trim-text": "Recortar Espacios",
        "lowercase-converter": "Minúsculas"
      }
    }
  }
};
