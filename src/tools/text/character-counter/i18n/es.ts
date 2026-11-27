import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'character-counter',
  name: 'Contador de Caracteres',
  seoTitle: 'Contador de Caracteres Online – Con y Sin Espacios',
  description:
    'Cuenta caracteres con y sin espacios al instante y comprueba límites de meta descripciones, SMS y X/Twitter en tu navegador. Privado y sin subidas.',
  tagline: 'Cuenta caracteres con y sin espacios en tiempo real.',
  citation: {
    problem: 'Usa este contador de caracteres cuando necesites verificar longitudes exactas o límites de texto sin subirlo a internet.',
    nonGoal: 'contar tokens de modelos de lenguaje ni enviar tu texto a una IA.',
  },
  craft: {
    solves:
      'Los límites cuentan espacios y saltos de línea que mucha gente pasa por alto, provocando rechazos al pegar en un formulario.',
  },
  knowledge: {
    primaryConcepts: ['contador de caracteres'],
    realWorldUseCases: [
      'Ajustar una publicación al límite de 280 caracteres en X',
      'Mantener títulos y meta descripciones dentro del recorte de Google',
      'Respetar el segmento SMS de 160 caracteres',
      'Validar la longitud máxima de un campo de formulario o base de datos',
    ],
    commonMistakes: [
      'Medir caracteres sin espacios cuando la plataforma sí los incluye',
      'Suponer que cada emoji cuenta siempre como un único carácter',
    ],
  },
  faqs: [
    {
      id: 'cc-faq-1',
      question: '¿Cómo cuento los caracteres de un texto?',
      answer:
        'Pega o escribe tu texto y los contadores se actualizan en vivo: total con espacios, sin espacios, palabras, frases y desglose por tipo de carácter.',
    },
    {
      id: 'cc-faq-2',
      question: '¿Los espacios cuentan como caracteres?',
      answer:
        'Sí. Cada espacio cuenta como un carácter en el total con espacios, que es la referencia usada por X/Twitter, LinkedIn, Instagram y formularios web.',
    },
    {
      id: 'cc-faq-3',
      question: '¿Un emoji cuenta como un carácter?',
      answer:
        'Depende de la plataforma y codificación: muchos emojis sencillos cuentan como 2 caracteres en UTF-16 (como hace X/Twitter) y las secuencias combinadas aún más.',
    },
    {
      id: 'cc-faq-4',
      question: '¿Se sube mi texto a algún servidor?',
      answer:
        'No. Todo el recuento se ejecuta localmente en tu navegador mediante JavaScript, sin servidor ni registro.',
    },
    {
      id: 'cc-faq-5',
      question: '¿Cuál es la diferencia entre caracteres con y sin espacios?',
      answer:
        'El conteo con espacios mide toda la cadena incluyendo espacios, tabulaciones y saltos de línea; sin espacios excluye todo espacio en blanco.',
    },
    {
      id: 'cc-faq-6',
      question: '¿Cuáles son los límites de las plataformas más usadas?',
      answer:
        'X/Twitter permite 280 caracteres (enlaces cuentan como 23), meta descripciones suelen mostrarse hasta ~155–160, SMS estándar 160 en GSM-7 (70 en Unicode) y LinkedIn hasta 3.000.',
    },
    {
      id: 'cc-faq-7',
      question: '¿Qué diferencia hay entre caracteres y bytes?',
      answer:
        'Cada símbolo visible cuenta como carácter en pantalla, mientras que en UTF-8 un carácter con tilde o emoji ocupa entre 2 y 4 bytes en disco o base de datos.',
    },
    {
      id: 'cc-faq-8',
      question: '¿Cómo adapto un borrador al límite de 280 caracteres?',
      answer:
        'Activa el preajuste de X/Twitter y recorta conectores largos o adverbios hasta bajar de 280, recordando que espacios y enlaces cuentan dentro del tope.',
    },
    {
      id: 'cc-faq-9',
      question: '¿Los saltos de línea cuentan como caracteres?',
      answer:
        'Sí. Cada salto de línea suma 1 en el conteo con espacios y se excluye por completo en el conteo sin espacios.',
    },
    {
      id: 'cc-faq-10',
      question: '¿Puedo revisar borradores o prompts confidenciales de forma privada?',
      answer:
        'Sí. El análisis se realiza únicamente en memoria local sin enviar tus borradores a terceros ni a modelos externos.',
    },
    {
      id: 'cc-faq-11',
      question: '¿El recuento de caracteres equivale a tokens de IA?',
      answer:
        'No. Esta herramienta mide caracteres y no estima ni contabiliza tokens de modelos lingüísticos.',
    },
  ],
  guide: {
    title: 'Contar caracteres y límites de plataformas',
    description:
      'Diferencias entre con/sin espacios, emojis UTF-16, saltos de línea y bytes UTF-8 en SEO, SMS y redes.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Escribe o pega texto arriba para empezar a contar.',
    sampleText:
      'Escribe o pega tu borrador aquí para verificar límites de 160 caracteres (meta descripción o SMS) y 280 caracteres al instante.',
    statCharacters: 'Caracteres (con espacios)',
    statNoSpaces: 'Sin espacios',
    statWords: 'Palabras',
    statSentences: 'Frases',
    statParagraphs: 'Párrafos',
    statAvgWordLength: 'Long. media palabra',
    btnDownloadReport: 'Descargar informe',
    headingLimits: 'Límites de plataformas',
    ariaPresets: 'Preajustes de límites de caracteres',
    presetMetaDesc: 'Meta descripción (160)',
    headingBreakdown: 'Desglose de caracteres',
    limitRemainingTpl: '{chars} / {limit} caracteres, quedan {remaining} ({pct}%)',
    limitOverTpl: '{chars} / {limit} caracteres, excedido en {over}',
    lblLetters: 'Letras',
    lblDigits: 'Dígitos',
    lblSpaces: 'Espacios',
    lblPunctuation: 'Puntuación',
    lblOther: 'Otros',
    nothingToDownload: 'No hay texto para exportar.',
    reportTitle: 'Informe del Contador de Caracteres',
    reportActiveLimit: 'Límite activo:',
    reportRemaining: 'Caracteres restantes:',
    reportGenerated: 'Generado con ToyTools',
    reportDownloaded: 'Informe descargado',
  },
};
