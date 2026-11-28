import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Contador de frecuencia de palabras",
  "seoTitle": "Frecuencia de palabras - Contar repeticiones online",
  "description": "Cuenta cuántas veces aparece cada palabra en tu texto con porcentajes de densidad y filtro de palabras vacías.",
  "tagline": "Cuántas veces aparece cada palabra, con sus porcentajes.",
  "lead": "Analiza la repetición de palabras en tu texto al instante en tu dispositivo, ordena por frecuencia o alfabéticamente y filtra palabras comunes.",
  "guide": {
    "title": "Cómo analizar la frecuencia de palabras",
    "description": "Aprende qué revela la frecuencia léxica, cómo funcionan la tokenización y el filtro de palabras vacías, y cómo evitar repeticiones excesivas."
  },
  "ui": {
    "stats": {
      "uniqueWords": "Palabras únicas",
      "words": "Palabras",
      "sentences": "Oraciones",
      "averageWordLength": "Long. media palabra"
    },
    "emptyMessage": "Pega o escribe un texto para contar la frecuencia de palabras.",
    "sampleText": "El rápido zorro marrón salta sobre el perro perezoso junto a la antigua granja. Una brisa suave agitaba las hojas del alto roble mientras el zorro observaba las colinas doradas al caer la tarde.",
    "heading": "Frecuencia de palabras",
    "hideCommon": "Ocultar palabras comunes",
    "ignoreNumbers": "Ignorar números",
    "byFrequency": "Por frecuencia",
    "alphabetical": "Alfabético",
    "listAria": "Palabras por frecuencia",
    "noWords": "No se encontraron palabras.",
    "topWordsTpl": "Mostrando las {limit} principales de {total} palabras distintas."
  },
  "knowledge": {
    "summary": "Calcula cuántas veces aparece cada palabra en un texto con su porcentaje, orden por frecuencia o alfabético y filtro de stopwords.",
    "useCases": [
      "Detectar muletillas y palabras repetidas antes de publicar un borrador",
      "Revisar la densidad de palabras clave en artículos SEO",
      "Analizar el vocabulario predominante en documentos o corpus",
      "Detectar términos recurrentes en encuestas y reseñas de clientes"
    ],
    "mistakes": [
      "Comparar recuentos absolutos en lugar de porcentajes entre textos de distinta longitud",
      "Dejar activas las palabras vacías y sacar conclusiones erróneas del ranking"
    ]
  },
  "faqs": [
    {
      "id": "wf-faq-1",
      "question": "¿Qué hace un contador de frecuencia de palabras?",
      "answer": "Cuenta cuántas veces aparece cada término distinto y ordena la tabla con su recuento exacto y porcentaje sobre el total. Puedes ordenar de mayor a menor frecuencia o alfabéticamente."
    },
    {
      "id": "wf-faq-2",
      "question": "¿Cómo se dividen las palabras y distingue mayúsculas?",
      "answer": "Se separan por espacios, saltos de línea, guiones largos y comas fuera de números, limpiando la puntuación de los extremos. El conteo no distingue mayúsculas: \"Casa\", \"CASA\" y \"casa\" suman juntas, conservando apóstrofos y guiones internos."
    },
    {
      "id": "wf-faq-3",
      "question": "¿Qué elimina el filtro de ocultar palabras comunes?",
      "answer": "Filtra palabras vacías (stopwords) inglesas muy frecuentes como \"the\", \"a\", \"of\" o \"and\" para que destaquen los términos con significado real del texto."
    },
    {
      "id": "wf-faq-4",
      "question": "¿Para qué se usa el análisis de frecuencia léxica?",
      "answer": "Editores lo usan para detectar repeticiones excesivas, especialistas SEO para revisar densidad temática, estudiantes para resumir vocabulario y equipos de producto para analizar comentarios."
    },
    {
      "id": "wf-faq-5",
      "question": "¿Qué es la densidad de palabras clave y aparece aquí?",
      "answer": "Es el porcentaje que representa cada término sobre el total de palabras, mostrado en cada fila. En artículos largos suele buscarse un 1 % a 2 % natural sin caer en sobreoptimización."
    },
    {
      "id": "wf-faq-6",
      "question": "¿Por qué mi conteo de palabras únicas varía respecto a otras webs?",
      "answer": "Cada herramienta aplica reglas distintas sobre guiones, apóstrofos o cifras. Aquí mantenemos las palabras compuestas con guion y los números decimales unidos, manteniendo consistente el ranking relativo."
    },
    {
      "id": "wf-faq-7",
      "question": "¿Hay límite en la cantidad de texto a analizar?",
      "answer": "El cálculo recorre textos extensos en un solo paso rápido. La lista visible muestra las 50 palabras principales junto con el total real de términos únicos para mantener la fluidez."
    },
    {
      "id": "wf-faq-8",
      "question": "¿Se envía mi texto a algún servidor?",
      "answer": "No. Todo el análisis se realiza localmente en tu navegador, funciona sin conexión tras cargar la página y nada sale de tu dispositivo."
    }
  ]
};
