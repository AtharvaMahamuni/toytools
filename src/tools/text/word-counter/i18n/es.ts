import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'word-counter',
  name: 'Contador de Palabras',
  seoTitle: 'Contador de Palabras y Caracteres Online',
  description:
    'Cuenta palabras, caracteres, frases, párrafos y tiempo de lectura mientras escribes. Fija un objetivo de longitud sin subir tu texto a ningún servidor.',
  tagline: 'Cuenta palabras y caracteres al instante y fija un objetivo de extensión.',
  citation: {
    problem: 'Utiliza este contador de palabras cuando necesites verificar la extensión exacta de un texto o ensayo sin subirlo a Internet.',
    nonGoal: 'reescribir tu texto ni enviarlo a ningún modelo de inteligencia artificial.',
  },
  knowledge: {
    primaryConcepts: ['contador de palabras'],
    realWorldUseCases: [
      'Respetar el límite de palabras de un ensayo académico o solicitud',
      'Alcanzar una extensión editorial concreta en artículos o guías',
      'Presupuestar traducciones o redacción cobrada por palabra',
      'Ajustar una carta de presentación a una sola página',
    ],
    commonMistakes: [
      'Suponer que todos los programas cuentan igual las palabras con guion',
      'Olvidar si el límite de un trabajo excluye notas al pie o bibliografía',
    ],
  },
  faqs: [
    {
      id: 'wc-faq-1',
      question: '¿Cómo funciona un contador de palabras?',
      answer:
        'Un contador divide el texto en palabras mediante delimitadores. Esta herramienta separa por espacios, saltos de línea, guiones largos y comas fuera de números, manteniendo intactas las direcciones web y actualizando el resultado en tiempo real.',
    },
    {
      id: 'wc-faq-2',
      question: '¿Qué se considera una palabra en este contador?',
      answer:
        'Toda secuencia de caracteres separada por espacios, saltos de línea o comas fuera de cifras ("rojo,verde" son 2 palabras). Los números ("42"), palabras compuestas con guion ("franco-alemán") y URL completas cuentan como una palabra.',
    },
    {
      id: 'wc-faq-3',
      question: '¿Cuál es la diferencia entre contar palabras y caracteres?',
      answer:
        'El conteo de palabras mide términos discretos; el de caracteres suma cada letra, signo de puntuación y espacio. "¡Hola, mundo!" tiene 2 palabras y 13 caracteres. Usa palabras para redacciones y caracteres para SMS, redes o meta descripciones.',
    },
    {
      id: 'wc-faq-4',
      question: '¿Se sube mi texto a algún servidor?',
      answer:
        'No. Todo el análisis se ejecuta directamente en tu navegador y el texto permanece en tu dispositivo.',
    },
    {
      id: 'wc-faq-5',
      question: '¿Cuánto se tarda en leer 1000 palabras?',
      answer:
        'A una velocidad adulta media de entre 200 y 250 palabras por minuto, leer 1000 palabras lleva aproximadamente entre 4 y 5 minutos. Esta herramienta estima la duración tomando 200 palabras por minuto como referencia estándar.',
    },
    {
      id: 'wc-faq-6',
      question: '¿Cuál es el límite de caracteres en X o LinkedIn?',
      answer:
        'X (Twitter) permite 280 caracteres por publicación estándar, mientras que LinkedIn admite hasta 3.000 caracteres en publicaciones y 125.000 en artículos largos.',
    },
    {
      id: 'wc-faq-7',
      question: '¿Por qué distintos contadores de palabras dan cifras ligeramente diferentes?',
      answer:
        'Porque cada programa aplica reglas propias en casos límite: palabras con guion, abreviaturas con punto, líneas solo con puntuación o signos pegados sin espacio.',
    },
    {
      id: 'wc-faq-8',
      question: '¿Cómo se calcula el tiempo de lectura?',
      answer:
        'Se divide el total de palabras entre una velocidad media de lectura en voz silenciosa de 200 palabras por minuto para prosa general (la documentación técnica suele rondar 100 a 150 ppm).',
    },
    {
      id: 'wc-faq-9',
      question: '¿Cuenta también los títulos y encabezados?',
      answer:
        'Sí. Se contabilizan todas las palabras presentes en el cuadro de texto. Si solo quieres medir el cuerpo principal, pega únicamente esa parte.',
    },
    {
      id: 'wc-faq-10',
      question: '¿Puedo medir documentos confidenciales sin riesgo?',
      answer:
        'Sí. Tanto la frecuencia de palabras como los totales y la gráfica de objetivo se calculan localmente en la memoria de tu pestaña sin envíos externos.',
    },
    {
      id: 'wc-faq-11',
      question: '¿Este contador mide tokens de IA?',
      answer:
        'No. Mide palabras, caracteres, frases y párrafos humanos. Los tokens de los modelos de lenguaje son subunidades distintas.',
    },
  ],
  guide: {
    title: 'Cómo contar palabras y medir la extensión',
    description: 'Reglas reales del conteo de palabras, por qué difieren Word y los editores web, tiempo de lectura y límites.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Pega o escribe texto para contar palabras.',
    sampleText: 'El veloz zorro marrón salta sobre el perro perezoso cerca de la vieja granja. Una brisa suave agitaba las hojas del alto roble, trayendo el aroma de las flores silvestres por el prado. Las aves cantaban entre las ramas iluminadas por el sol de la tarde mientras el arroyo corría entre piedras cubiertas de musgo.',
    statWords: 'Palabras',
    statCharacters: 'Caracteres',
    statSentences: 'Frases',
    statParagraphs: 'Párrafos',
    statReadingTime: 'Tiempo de lectura',
    statUniqueWords: 'Palabras únicas',
    btnDownloadReport: 'Descargar informe',
    lblGoal: 'Objetivo de palabras',
    goalPlaceholder: 'ej. 500',
    btnClearGoal: 'Borrar objetivo',
    headingTopWords: 'Palabras frecuentes',
    lblHideCommon: 'Ocultar palabras comunes',
    btnSortFreq: 'Por frecuencia',
    btnSortAlpha: 'Alfabético',
    summaryInsights: 'Detalles del vocabulario',
    stopWords: 'el la los las un una unos unas y o pero en de del al a por para con sin sobre entre desde hasta es son fue era ser estar tener hacer como más muy ya no sí su sus mi mis tu tus se le lo me te nos que quien cual',
    goalRemainTpl: '{cur} / {goal} palabras ({rem} restantes, {pct}%)',
    goalDoneTpl: '{cur} / {goal} palabras (objetivo cumplido)',
    noWordsFound: 'No se encontraron palabras.',
    insightLongest: 'Palabra más larga',
    insightShortest: 'Palabra más corta',
    insightRepeated: 'Palabras repetidas',
    toastEmptyDownload: 'Nada que descargar',
    reportHeading: 'Informe de conteo de palabras',
    reportGoalPrefix: 'Objetivo: ',
    reportWordsSuffix: 'palabras',
    reportGeneratedPrefix: 'Generado: ',
    toastDownloaded: 'Informe descargado',
  },
};
