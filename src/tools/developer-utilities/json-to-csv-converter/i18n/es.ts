import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de JSON a CSV",
  "seoTitle": "Conversor de JSON a CSV - Exportar JSON a Excel Online",
  "description": "Convierte arrays JSON en archivos CSV para Excel y bases de datos. Aplana objetos anidados y escapa comas de forma privada.",
  "tagline": "Convierte arrays JSON en CSV manejando objetos anidados.",
  "lead": "Transforma respuestas de API y listas JSON en archivos CSV compatibles con Excel y Google Sheets localmente en tu navegador.",
  "guide": {
    "title": "Conversor de JSON a CSV: guía completa",
    "description": "Aprende cómo se convierten arrays JSON a CSV, cómo se aplanan objetos anidados y cuándo usar cada formato de datos."
  },
  "ui": {
    "inputLabel": "Entrada JSON",
    "placeholder": "Pega JSON aquí",
    "moreAboutHeading": "Cómo funciona el Conversor de JSON a CSV",
    "insight": "Convierte un array de objetos JSON planos en filas CSV tomando las claves como encabezados. Los valores anidados se serializan para caber en una celda.",
    "technical": [
      {
        "term": "Entrada",
        "detail": "Un array de objetos con claves coherentes"
      },
      {
        "term": "Encabezado",
        "detail": "Generado a partir de las claves del objeto"
      },
      {
        "term": "Valores anidados",
        "detail": "Convertidos a texto en una sola celda"
      }
    ],
    "errMustBeArray": "La entrada debe ser un array JSON.",
    "errEmptyArray": "El array está vacío: no hay nada que convertir."
  },
  "knowledge": {
    "summary": "Convierte arrays JSON en CSV para hojas de cálculo y bases de datos, aplanando objetos y escapando caracteres especiales.",
    "useCases": [
      "Exportar una respuesta API a Excel para un informe",
      "Cargar datos JSON en una base relacional mediante importación CSV",
      "Convertir registros o configuraciones en tabla de análisis",
      "Compartir datos estructurados en Google Sheets"
    ],
    "mistakes": [
      "Pasar un único objeto JSON en lugar de un array de objetos",
      "Esperar columnas automáticas sin aplanar estructuras profundas",
      "Olvidar entrecomillar valores con comas en CSV manuales"
    ]
  },
  "faqs": [
    {
      "id": "jtc-faq-1",
      "question": "¿Qué formato de entrada espera el conversor?",
      "answer": "Espera un array JSON de objetos como [{\"nombre\":\"Ana\",\"edad\":30}]. Cada objeto genera una fila y cada clave única una columna."
    },
    {
      "id": "jtc-faq-2",
      "question": "¿Qué pasa con los objetos anidados al convertir a CSV?",
      "answer": "Se aplanan con notación de punto (por ejemplo usuario.nombre) o se serializan cuando son arrays internos, porque una celda CSV solo almacena valores planos."
    },
    {
      "id": "jtc-faq-3",
      "question": "¿Cómo se manejan claves que faltan en algunas filas?",
      "answer": "Se recopilan todas las claves existentes en el array completo; las filas que no tengan una clave concreta reciben una celda vacía en esa columna."
    },
    {
      "id": "jtc-faq-4",
      "question": "¿Puedo abrir el CSV en Excel o Google Sheets?",
      "answer": "Sí. Copia el resultado o descárgalo como .csv y ábrelo directamente: ambas suites reconocen los encabezados y las comillas dobles."
    },
    {
      "id": "jtc-faq-5",
      "question": "¿Por qué a veces aparece [object Object] en otras conversiones?",
      "answer": "Sucede cuando una herramienta convierte un subobjeto JavaScript sin serializarlo o aplanarlo primero. Aquí evitamos que se pierda su estructura."
    },
    {
      "id": "jtc-faq-6",
      "question": "¿Cómo se manejan valores que contienen comas?",
      "answer": "La celda se envuelve automáticamente entre comillas dobles (\"Pérez, Juan\") siguiendo el estándar RFC 4180 para no dividir columnas."
    },
    {
      "id": "jtc-faq-7",
      "question": "¿Están seguros los datos JSON confidenciales al exportarlos?",
      "answer": "Sí. El procesamiento y escape CSV se realizan íntegramente en tu navegador; ninguna carga útil JSON sale hacia un servidor."
    },
    {
      "id": "jtc-faq-8",
      "question": "¿Puedo elegir qué columnas incluir en la salida?",
      "answer": "El conversor incluye todas las claves encontradas en el array. Si deseas menos columnas, elimina antes las claves sobrantes en el JSON o borra la columna tras abrir en Excel."
    },
    {
      "id": "jtc-faq-9",
      "question": "¿Qué diferencia hay entre JSON y CSV?",
      "answer": "JSON representa datos jerárquicos y tipados ideales para APIs; CSV almacena tablas planas ligeras ideales para hojas de cálculo."
    }
  ]
};
