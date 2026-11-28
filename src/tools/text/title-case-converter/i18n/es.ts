import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "title-case-converter",
  "name": "Convertidor a Tipo Título",
  "seoTitle": "Convertidor a Tipo Título - Mayúscula Cada Palabra",
  "description": "Convierte titulares y encabezados a Tipo Título poniendo en mayúscula la inicial de cada palabra en el navegador sin subir texto.",
  "tagline": "Pon en mayúscula la primera letra de cada palabra.",
  "knowledge": {
    "primaryConcepts": [
      "tipo título (title case)"
    ],
    "realWorldUseCases": [
      "Dar formato a titulares de blogs y artículos",
      "Homogeneizar títulos de libros o presentaciones",
      "Unificar etiquetas de navegación",
      "Corregir títulos pegados en mayúsculas o minúsculas"
    ],
    "commonMistakes": [
      "Aplicar mayúscula inicial a cada palabra en párrafos largos",
      "Asumir que todos los manuales de estilo tratan igual las preposiciones cortas"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "¿Qué es el formato Tipo Título (Title Case)?",
      "answer": "Pone en mayúscula la primera letra de cada palabra («the quick brown fox» pasa a «The Quick Brown Fox»), habitual en titulares y portadas."
    },
    {
      "id": "tc-faq-2",
      "question": "¿Qué palabras deben ir en mayúscula en un título?",
      "answer": "Las guías editoriales en inglés capitalizan sustantivos, verbos y adjetivos, dejando en minúscula artículos y preposiciones cortas salvo al principio o final; esta herramienta capitaliza cada palabra como punto de partida."
    },
    {
      "id": "tc-faq-3",
      "question": "¿Qué diferencia hay con el tipo oración (Sentence Case)?",
      "answer": "El tipo oración solo pone mayúscula inicial en la primera palabra y nombres propios; el Tipo Título la aplica a cada palabra."
    },
    {
      "id": "tc-faq-4",
      "question": "¿Sirve para párrafos de cuerpo de texto?",
      "answer": "No. Dificulta la lectura continua; usa tipo oración para párrafos normales."
    },
    {
      "id": "tc-faq-5",
      "question": "¿Modifica números o signos?",
      "answer": "No. Solo altera la primera letra de cada palabra."
    },
    {
      "id": "tc-faq-6",
      "question": "¿Cómo pongo un titular en Tipo Título?",
      "answer": "Pégalo en el panel izquierdo; la conversión ocurre mientras escribes, y luego puedes bajar manualmente las preposiciones cortas si sigues AP o Chicago."
    },
    {
      "id": "tc-faq-7",
      "question": "¿Se escriben «of» o «the» en mayúscula en inglés?",
      "answer": "En mitad de un título suelen ir en minúscula según AP o Chicago, salvo si abren o cierran el título."
    },
    {
      "id": "tc-faq-8",
      "question": "¿Por qué convirtió palabras cortas como «and» o «in»?",
      "answer": "Porque aplica una regla uniforme sobre cada palabra; el aviso te indica cuántas palabras menores aparecieron para repasarlas si necesitas estilo editorial estricto."
    },
    {
      "id": "tc-faq-9",
      "question": "¿Cómo trata las palabras con guion como «well-known»?",
      "answer": "Capitaliza cada segmento separado por guion («Well-Known»), listo para ajustar a mano palabras interiores si tu guía lo pide."
    }
  ],
  "guide": {
    "title": "Cómo convertir texto a Tipo Título (Title Case)",
    "description": "Diferencias entre Tipo Título y tipo oración, palabras menores en estilo inglés y palabras con guion."
  },
  "ui": {
    "placeholder": "Pega un titular o texto aquí",
    "outputPlaceholder": "El texto en Tipo Título aparecerá aquí",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "Se capitalizaron también {n} palabra(s) corta(s) que estilos como Chicago o AP dejan en minúsculas.",
      "siblings": {
        "sentence-case-converter": "Tipo Oración",
        "kebab-case-converter": "Kebab Case",
        "trim-text": "Recortar Espacios",
        "lowercase-converter": "Minúsculas"
      }
    }
  }
};
