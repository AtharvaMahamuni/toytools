import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "uppercase-converter",
  "name": "Convertidor a Mayúsculas",
  "seoTitle": "Convertir Texto a Mayúsculas Online",
  "description": "Convierte cualquier texto a MAYÚSCULAS en un clic y cópialo al instante sin subir archivos ni salir de tu navegador.",
  "tagline": "Convierte cualquier texto a MAYÚSCULAS al instante.",
  "knowledge": {
    "primaryConcepts": [
      "convertir a mayúsculas"
    ],
    "realWorldUseCases": [
      "Formatear títulos o etiquetas en mayúsculas fijas",
      "Escribir nombres de constantes como MAX_SIZE en código",
      "Unificar siglas pegadas en formatos mixtos",
      "Destacar un aviso breve o llamada a la acción"
    ],
    "commonMistakes": [
      "Escribir párrafos largos todo en mayúsculas dificultando la lectura",
      "Confiar en CSS text-transform cuando el texto almacenado debe ser real"
    ]
  },
  "faqs": [
    {
      "id": "uc-faq-1",
      "question": "¿Cómo convierto un texto a mayúsculas?",
      "answer": "Pega o escribe el texto en el panel de entrada y el resultado en MAYÚSCULAS aparecerá al instante listo para copiar."
    },
    {
      "id": "uc-faq-2",
      "question": "¿Afecta a números o signos de puntuación?",
      "answer": "No. Únicamente cambia las letras; los números, espacios y símbolos permanecen exactamente iguales."
    },
    {
      "id": "uc-faq-3",
      "question": "¿Por qué un texto se ve en mayúsculas en una web pero se pega en minúsculas?",
      "answer": "Porque esa web usa CSS text-transform: uppercase solo visualmente; al copiar recibes el texto original y necesitas convertirlo aquí si quieres mayúsculas reales."
    },
    {
      "id": "uc-faq-4",
      "question": "¿Se sube mi texto a algún servidor?",
      "answer": "No. Toda la conversión ocurre localmente en JavaScript dentro de tu navegador."
    },
    {
      "id": "uc-faq-5",
      "question": "¿Cuándo conviene usar todo en mayúsculas?",
      "answer": "En siglas (HTML, NASA), constantes de código, etiquetas breves o avisos cortos; conviene evitarlo en párrafos largos porque frena la lectura."
    },
    {
      "id": "uc-faq-6",
      "question": "¿Uso CSS text-transform o convierto los caracteres?",
      "answer": "Usa CSS si es solo diseño visual y convierte los caracteres reales si vas a guardar, comparar o exportar el dato en mayúsculas."
    },
    {
      "id": "uc-faq-7",
      "question": "¿Funciona igual en todos los idiomas?",
      "answer": "Usa el mapeo estándar Unicode: conserva tildes y expande caracteres especiales como la alemana ß a SS."
    },
    {
      "id": "uc-faq-8",
      "question": "¿Por qué las letras con tilde conservan su acento?",
      "answer": "Porque en Unicode las mayúsculas acentuadas mantienen su tilde (café pasa a CAFÉ). Si buscas quitar tildes, usa un eliminador de acentos."
    }
  ],
  "guide": {
    "title": "Cómo convertir texto a mayúsculas",
    "description": "Qué hace la conversión a mayúsculas, cuándo conviene evitar bloques enteros en altas y reglas Unicode."
  },
  "ui": {
    "placeholder": "Pega o escribe tu texto aquí",
    "outputPlaceholder": "El texto en mayúsculas aparecerá aquí",
    "sampleText": "El veloz zorro marrón salta sobre el perro perezoso"
  }
};
