import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'reading-time-calculator',
  name: 'Calculadora de Tiempo de Lectura',
  seoTitle: 'Calculadora de Tiempo de Lectura y Locución',
  description:
    'Calcula cuántos minutos se tarda en leer en silencio o exponer en voz alta cualquier texto al instante en tu navegador, sin subir nada.',
  tagline: 'Minutos de lectura y locución calculados localmente.',
  craft: {
    solves:
      'El tiempo estimado parte de una velocidad media supuesta en palabras por minuto; mostrarla evita confusiones según el ritmo de cada lector.',
  },
  knowledge: {
    primaryConcepts: ['tiempo de lectura'],
    realWorldUseCases: [
      'Añadir una etiqueta realista de minutos de lectura a un artículo',
      'Ajustar un guion o charla a una franja horaria fija',
      'Estimar el tiempo de estudio de un boletín o lección',
      'Decidir si conviene dividir un artículo demasiado extenso',
    ],
    commonMistakes: [
      'Aplicar la misma velocidad de lectura a documentos muy técnicos',
      'Olvidar que imágenes, tablas y bloques de código alargan la lectura real',
    ],
  },
  faqs: [
    {
      id: 'rtc-faq-1',
      question: '¿Cómo se calcula el tiempo de lectura?',
      answer:
        'Se divide el número total de palabras por una velocidad media estándar de lectura silenciosa en adultos, fijada en 200 palabras por minuto (ppm). Así, 1.000 palabras equivalen aproximadamente a 5 minutos.',
    },
    {
      id: 'rtc-faq-2',
      question: '¿Cuál es la velocidad media de lectura de un adulto?',
      answer:
        'En prosa general oscila entre 200 y 250 palabras por minuto con buena comprensión. En textos científicos o técnicos baja a 100–150 ppm, por lo que 200 ppm es una referencia equilibrada.',
    },
    {
      id: 'rtc-faq-3',
      question: '¿Cuánto se tarda en leer un artículo de 1.000 palabras?',
      answer:
        'A 200 ppm se tarda alrededor de 5 minutos, y a 250 ppm unos 4 minutos, variando según la complejidad del tema y la densidad de párrafos.',
    },
    {
      id: 'rtc-faq-4',
      question: '¿Qué es el tiempo de habla o locución y en qué se diferencia?',
      answer:
        'Estima cuánto tiempo lleva leer el texto en voz alta en una presentación o pódcast. La velocidad media al hablar es de unas 130–150 ppm, bastante menor que la lectura silenciosa.',
    },
    {
      id: 'rtc-faq-5',
      question: '¿Cuántas palabras debe tener un artículo para durar cierto tiempo?',
      answer:
        'A 200 ppm: 2 minutos son ~400 palabras, 5 minutos ~1.000, 10 minutos ~2.000 y 15 minutos ~3.000 palabras.',
    },
    {
      id: 'rtc-faq-6',
      question: '¿Por qué distintas calculadoras muestran tiempos ligeramente diferentes?',
      answer:
        'Porque cada herramienta asume un ritmo distinto (200 ppm, 225 ppm o 238 ppm) y cuenta palabras con puntuación de forma algo diferente.',
    },
    {
      id: 'rtc-faq-7',
      question: '¿Mostrar el tiempo de lectura ayuda al SEO?',
      answer:
        'Ayuda a mejorar la experiencia de usuario y reducir rebotes al fijar expectativas claras desde el principio, aunque no sea un factor directo de posicionamiento.',
    },
    {
      id: 'rtc-faq-8',
      question: '¿Esta calculadora sube mi texto a algún servidor?',
      answer:
        'No. Todo el cálculo se ejecuta directamente en tu navegador sin enviar ni almacenar tu borrador en ningún servidor.',
    },
  ],
  guide: {
    title: 'Calcular tiempo de lectura y habla (ppm)',
    description:
      'Fórmula de palabras por minuto para blogs y discursos, diferencias según densidad técnica y por qué varían los estimadores.',
    readMinutes: 5,
  },
  ui: {
    emptyMessage: 'Escribe o pega tu texto arriba para estimar el tiempo de lectura y habla.',
    sampleText:
      'Pega aquí tu artículo, ensayo o guion de presentación para calcular al instante los minutos aproximados de lectura silenciosa y exposición en voz alta.',
    statReadingTime: 'Tiempo de lectura',
    statSpeakingTime: 'Tiempo de habla',
    statWords: 'Palabras',
    statAvgSentence: 'Prom. por frase',
  },
};
