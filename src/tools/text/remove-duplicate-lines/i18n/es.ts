import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Eliminar líneas duplicadas",
  "seoTitle": "Eliminar líneas duplicadas - Quitar repetidos online",
  "description": "Elimina líneas repetidas conservando la primera aparición y el orden original, gratis y privado en tu navegador.",
  "tagline": "Elimina líneas repetidas conservando la primera aparición.",
  "lead": "Depura listas de correos, URLs o registros eliminando duplicados exactos al instante en tu dispositivo sin alterar el orden original.",
  "guide": {
    "title": "Cómo eliminar líneas duplicadas de un texto",
    "description": "Aprende a depurar listas manteniendo el primer elemento, cómo influyen espacios y mayúsculas, y cuándo limpiar antes de importar datos."
  },
  "ui": {
    "placeholder": "Pega aquí tu lista con una entrada por línea",
    "outputPlaceholder": "Las líneas únicas aparecerán aquí",
    "sampleText": "manzana\nplátano\nmanzana\nnaranja\nplátano",
    "handoff": {
      "trimTpl": "{n} línea(s) solo se diferencian por espacios en los bordes.",
      "lowerTpl": "{n} línea(s) solo se diferencian por mayúsculas/minúsculas.",
      "siblings": {
        "trim-text": "Recortar bordes",
        "lowercase-converter": "Pasar a minúsculas"
      }
    }
  },
  "knowledge": {
    "summary": "Conserva únicamente la primera aparición de cada línea para depurar listas, registros y exportaciones sin perder el orden.",
    "useCases": [
      "Depurar listas de correos o suscriptores repetidos",
      "Extraer URLs o identificadores únicos de una hoja de cálculo",
      "Limpiar mensajes repetidos en archivos de registro (logs)",
      "Construir listados limpios de palabras clave"
    ],
    "mistakes": [
      "No recortar espacios finales antes de depurar, dejando duplicados aparentes",
      "Olvidar que mayúsculas y minúsculas se consideran distintas"
    ]
  },
  "faqs": [
    {
      "id": "rdl-faq-1",
      "question": "¿Cómo se detectan las líneas duplicadas?",
      "answer": "Dos líneas se consideran duplicadas cuando coinciden carácter por carácter. Se conserva la primera aparición de cada una y se eliminan las repeticiones posteriores manteniendo el orden original."
    },
    {
      "id": "rdl-faq-2",
      "question": "¿Solo borra líneas repetidas que están seguidas?",
      "answer": "No. Detecta repetidos en todo el documento, estén juntas o separadas por cientos de líneas."
    },
    {
      "id": "rdl-faq-3",
      "question": "¿Distingue entre mayúsculas y minúsculas?",
      "answer": "Sí, la comparación es exacta. \"Manzana\" y \"manzana\" se mantienen como distintas. Si prefieres ignorar mayúsculas, convierte primero toda la lista a minúsculas."
    },
    {
      "id": "rdl-faq-4",
      "question": "¿Influyen los espacios al principio o al final?",
      "answer": "Sí. \"  dato\" y \"dato\" cuentan como líneas distintas por los espacios extra. Recorta los bordes antes si quieres fusionarlas."
    },
    {
      "id": "rdl-faq-5",
      "question": "¿Cómo elimino correos repetidos de una lista de difusión?",
      "answer": "Pega los correos con uno por línea y se conservará una sola vez cada dirección en su posición inicial. Conviene pasar la lista a minúsculas antes para unificar variantes como \"Info@...\" e \"info@...\"."
    },
    {
      "id": "rdl-faq-6",
      "question": "¿Cómo saco líneas únicas de un archivo de log?",
      "answer": "Pega el registro y obtendrás cada error o evento distinto una única vez. Ten en cuenta que si cada línea lleva marca de hora distinta, habrá que quitar la fecha primero."
    },
    {
      "id": "rdl-faq-7",
      "question": "¿Qué diferencia hay con eliminar líneas en blanco?",
      "answer": "Eliminar líneas duplicadas quita contenido repetido; eliminar líneas en blanco quita filas vacías dejando los datos repetidos. Aquí dos líneas vacías cuentan como duplicadas y sobrevive una sola."
    },
    {
      "id": "rdl-faq-8",
      "question": "¿Por qué parece que cambió el orden de algunas líneas?",
      "answer": "El orden relativo de las primeras apariciones nunca cambia: simplemente desaparecen las copias posteriores y las filas de abajo suben a ocupar su sitio."
    },
    {
      "id": "rdl-faq-9",
      "question": "¿Es seguro pegar una lista de clientes o correos aquí?",
      "answer": "Sí. El proceso ocurre íntegramente en memoria dentro de tu navegador, sin subir datos a ningún servidor ni guardar nada al cerrar la pestaña."
    }
  ]
};
