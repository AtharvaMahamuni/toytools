import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Eliminar espacios extra",
  "seoTitle": "Eliminar espacios extra - Quitar dobles espacios online",
  "description": "Convierte varios espacios seguidos y tabuladores en un solo espacio online, conservando saltos de línea intactos.",
  "tagline": "Reduce espacios repetidos y tabulaciones. Todo en tu dispositivo.",
  "lead": "Limpia dobles espacios tras los puntos o textos pegados desde PDF convirtiendo cada racha de espacios y tabuladores en uno solo.",
  "guide": {
    "title": "Cómo eliminar espacios dobles en Word, Excel y texto",
    "description": "Aprende a reducir espacios dobles en Word, Google Docs y Excel, por qué TRIM en Excel cambia los huecos internos y ejemplos antes y después."
  },
  "ui": {
    "placeholder": "Pega o escribe texto con espacios de más aquí",
    "outputPlaceholder": "El texto con espacios limpios aparecerá aquí",
    "sampleText": "Factura   enviada.   Pago    pendiente   el   viernes.",
    "handoff": {
      "msgTpl": "Aún queda(n) {n} espacio(s) al inicio o final de las líneas.",
      "siblings": {
        "trim-text": "Recortar bordes"
      }
    }
  },
  "knowledge": {
    "summary": "Colapsa espacios repetidos y tabuladores entre palabras a un solo espacio, corrigiendo textos copiados de PDF o correos.",
    "useCases": [
      "Corregir el hábito de poner dos espacios después del punto",
      "Limpiar bloques copiados desde archivos PDF o correos electrónicos",
      "Ordenar texto antes de pegarlo en formularios o bases de datos",
      "Preparar párrafos con espaciado uniforme para maquetación"
    ],
    "mistakes": [
      "Esperar que elimine un único espacio suelto al comienzo o fin de línea (para eso sirve recortar texto)",
      "Creer que borra también los saltos de línea cuando estos se conservan"
    ]
  },
  "faqs": [
    {
      "id": "res-faq-1",
      "question": "¿Qué hace exactamente eliminar espacios extra?",
      "answer": "Convierte cualquier secuencia de dos o más espacios o tabuladores en un único espacio normal, de modo que \"hola     mundo\" pasa a \"hola mundo\". Los saltos de línea se mantienen para conservar tus párrafos."
    },
    {
      "id": "res-faq-2",
      "question": "¿Por qué aparecen espacios dobles o huecos en el texto?",
      "answer": "Suelen venir de copiar texto desde PDFs o correos, escribir dos espacios tras un punto, alinear columnas a mano o exportar tablas mal formateadas."
    },
    {
      "id": "res-faq-3",
      "question": "¿También elimina los saltos de línea?",
      "answer": "No. Esta herramienta solo contrae secuencias de espacios y tabulaciones dentro de cada línea. Si además necesitas unir líneas en una sola, usa el normalizador de espacios en blanco."
    },
    {
      "id": "res-faq-4",
      "question": "¿Recorta los espacios al principio y final de cada línea?",
      "answer": "Reduce varios espacios seguidos a uno solo, pero si queda un espacio único en los bordes lo deja ahí. Para quitar por completo los espacios iniciales y finales, usa la herramienta de recortar texto."
    },
    {
      "id": "res-faq-5",
      "question": "¿Cómo limpio el espaciado de un texto copiado de PDF o correo?",
      "answer": "Pégalo aquí y copia la salida: todas las rachas repetidas pasan a un único espacio mientras los párrafos conservan sus saltos de línea originales."
    },
    {
      "id": "res-faq-6",
      "question": "¿Cuándo usar eliminar espacios extra frente a recortar bordes?",
      "answer": "Usa eliminar espacios extra cuando sobran espacios entre palabras; recorta los bordes cuando el fallo está al principio o al final de cada línea. Por ejemplo, \"  dato   :   10  \" aquí queda \" dato : 10 \"."
    },
    {
      "id": "res-faq-7",
      "question": "¿Qué diferencia hay entre colapsar espacios y normalizar todo el blanco?",
      "answer": "Colapsar espacios arregla los huecos dentro de cada línea respetando la estructura de párrafos; normalizar espacios reescribe todo carácter blanco, incluidos los saltos de línea, en una sola línea continua."
    },
    {
      "id": "res-faq-8",
      "question": "¿Por qué siguen viéndose huecos grandes después de limpiar?",
      "answer": "Los huecos que sobreviven suelen ser espacios duros no separables (U+00A0) procedentes de Word o páginas web, que no son espacios estándar ni tabuladores. Un normalizador Unicode completo sí los unifica."
    },
    {
      "id": "res-faq-9",
      "question": "¿Es seguro pegar documentos privados aquí?",
      "answer": "Sí. Toda la limpieza ocurre localmente en tu navegador con JavaScript sin enviar datos a ningún servidor ni almacenar historial."
    }
  ]
};
