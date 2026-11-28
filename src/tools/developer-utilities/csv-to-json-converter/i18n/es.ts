import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de CSV a JSON",
  "seoTitle": "Conversor de CSV a JSON - Herramienta Online Gratis",
  "description": "Convierte CSV en un array JSON de objetos para APIs y bases de datos. Con detección de tipos, delimitadores y comillas RFC 4180.",
  "tagline": "Convierte CSV en un array JSON de objetos con detección de tipos.",
  "lead": "Transforma tablas CSV o TSV en arrays JSON listos para APIs y código JavaScript localmente en tu navegador, conservando ceros iniciales.",
  "guide": {
    "title": "Conversor de CSV a JSON: guía completa",
    "description": "Aprende cómo funciona la conversión de CSV a JSON, cómo se gestionan tipos, delimitadores y comillas RFC 4180, y evita errores comunes."
  },
  "ui": {
    "inputLabel": "Entrada CSV",
    "placeholder": "Pega CSV aquí",
    "craftNote": "Los ceros iniciales y enteros grandes en columnas CSV se conservan de forma segura al serializar JSON.",
    "moreAboutHeading": "Cómo funciona el Conversor de CSV a JSON",
    "insight": "Convierte filas CSV en un array de objetos JSON tomando la primera fila de encabezado como claves. Ideal para transformar hojas de cálculo en datos listos para API.",
    "technical": [
      {
        "term": "Encabezado",
        "detail": "La primera fila define las claves de cada objeto"
      },
      {
        "term": "Salida",
        "detail": "Array de objetos, uno por cada fila de datos"
      },
      {
        "term": "Valores",
        "detail": "Leídos como texto salvo números, booleanos o null claros"
      }
    ],
    "errInvalidCsv": "CSV no válido.",
    "errNoHeaders": "No se encontró fila de encabezado: la primera línea debe contener nombres de columna.",
    "errNoRows": "No se encontraron filas de datos: añade al menos una fila debajo del encabezado."
  },
  "knowledge": {
    "summary": "Convierte CSV a un array JSON de objetos para APIs, JavaScript y bases de datos con detección de tipos y delimitadores personalizados.",
    "useCases": [
      "Transformar exportaciones de hojas de cálculo en arrays JSON para aplicaciones web",
      "Convertir volcados CSV de base de datos en JSON para peticiones API",
      "Generar datos de prueba y fixtures JavaScript a partir de archivos CSV",
      "Preparar informes CSV en formato JSON para librerías de gráficos",
      "Procesar valores separados por tabulaciones (TSV) hacia pipelines JSON"
    ],
    "mistakes": [
      "Omitir la fila de encabezados que da nombre a las columnas",
      "Esperar que códigos con ceros iniciales pasen a número sin perder ceros",
      "Elegir mal el delimitador cuando el archivo usa punto y coma o tabulaciones",
      "Olvidar entrecomillar campos que incluyen el carácter delimitador"
    ]
  },
  "faqs": [
    {
      "id": "c2j-faq-1",
      "question": "¿Qué formato CSV espera el conversor?",
      "answer": "Espera una primera fila de encabezados con los nombres de columna y una fila de datos por línea debajo. Por ejemplo, nombre,edad seguido de Ana,30 produce [{\"nombre\":\"Ana\",\"edad\":30}]. Cada columna pasa a ser una clave."
    },
    {
      "id": "c2j-faq-2",
      "question": "¿Cómo funciona la detección de tipos?",
      "answer": "Convierte automáticamente celdas numéricas puras, true/false y null a tipos nativos JSON (número, booleano o null), manteniendo el resto como cadenas de texto."
    },
    {
      "id": "c2j-faq-3",
      "question": "¿Por qué un valor como 007 se mantiene como texto?",
      "answer": "Códigos postales, extensiones y referencias con ceros a la izquierda perderían esos ceros al pasar a número (007 quedaría como 7). Por seguridad se preservan siempre como cadena."
    },
    {
      "id": "c2j-faq-4",
      "question": "¿Cómo se manejan las comas y comillas dentro de un campo?",
      "answer": "Sigue las reglas RFC 4180: un campo entre comillas dobles puede incluir comas, saltos de línea y comillas escapadas como \"\" para leerse como un único valor."
    },
    {
      "id": "c2j-faq-5",
      "question": "¿Puedo usar un delimitador distinto a la coma?",
      "answer": "Sí. Admite coma, punto y coma, tabulación (TSV) o barra vertical, muy útiles en exportaciones regionales europeas o de bases de datos."
    },
    {
      "id": "c2j-faq-6",
      "question": "¿Qué pasa si una fila tiene menos columnas que el encabezado?",
      "answer": "Los valores faltantes al final se completan con cadena vacía para que todos los objetos del array conserven exactamente el mismo conjunto de claves."
    },
    {
      "id": "c2j-faq-7",
      "question": "¿Puedo volver a convertir el JSON generado en CSV?",
      "answer": "Sí. Cambia a la herramienta hermana de JSON a CSV en la barra superior para transformar la salida en formato tabular al instante."
    },
    {
      "id": "c2j-faq-8",
      "question": "¿Se suben o registran mis tablas CSV en algún servidor?",
      "answer": "No. Tanto el análisis del delimitador como la serialización JSON corren en tu navegador. Ningún dato de cliente ni fila financiera abandona tu dispositivo."
    }
  ]
};
