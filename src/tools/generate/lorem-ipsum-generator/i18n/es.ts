import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'lorem-ipsum-generator',
  name: 'Generador Lorem Ipsum',
  seoTitle: 'Generador Lorem Ipsum Online – Texto de Relleno',
  description:
    'Genera texto de relleno Lorem Ipsum por párrafos, frases o palabras al instante en tu navegador. Texto plano sin HTML y con contador de palabras.',
  tagline: 'Texto de relleno por párrafos, frases o palabras.',
  craft: {
    solves:
      'Quien diseña suele preguntarse si el texto ficticio tiene sentido oculto; la herramienta contextualiza la fuente clásica de Cicerón.',
  },
  knowledge: {
    primaryConcepts: ['lorem ipsum', 'texto de relleno'],
    realWorldUseCases: [
      'Rellenar maquetas de diseño antes de tener el texto final',
      'Comprobar cómo responde una interfaz con textos cortos o largos',
      'Mostrar plantillas y temas editoriales con proporción realista',
      'Evaluar tipografía, interlineado y ancho de columna en un boceto',
    ],
    commonMistakes: [
      'Publicar texto Lorem Ipsum por descuido en producción',
      'Usar texto de relleno cuando el contenido real condicionaría el diseño',
      'Creer que las palabras latinas forman un mensaje literal coherente',
      'Generar bloques mucho más largos de lo que necesita el diseño',
    ],
  },
  fields: {
    unit: {
      label: 'Unidad',
      options: { paragraphs: 'Párrafos', sentences: 'Frases', words: 'Palabras' },
    },
    count: { label: 'Cantidad' },
    startWithLorem: { label: 'Empezar con "Lorem ipsum"', group: 'Opciones' },
  },
  faqs: [
    {
      id: 'lorem-ipsum-generator-faq-1',
      question: '¿Qué es Lorem Ipsum?',
      answer:
        'Es el texto de relleno estándar de la tipografía y el diseño gráfico: palabras de aspecto latino usadas para evaluar la composición visual sin distraer con el significado del contenido.',
    },
    {
      id: 'lorem-ipsum-generator-faq-2',
      question: '¿Cómo se usa este generador?',
      answer:
        'Elige si quieres párrafos, frases o palabras, define la cantidad y decide si empezar por "Lorem ipsum dolor sit amet". Pulsa Copiar para llevarte el texto plano al portapapeles.',
    },
    {
      id: 'lorem-ipsum-generator-faq-3',
      question: '¿De dónde viene el texto Lorem Ipsum?',
      answer:
        'Proviene de una adaptación alterada de la obra filosófica *De finibus bonorum et malorum* escrita por Cicerón en el año 45 a. C. y popularizada en imprenta desde hace siglos.',
    },
    {
      id: 'lorem-ipsum-generator-faq-4',
      question: '¿Por qué usar texto simulado en lugar de texto real?',
      answer:
        'Porque el texto comprensible desvía la atención hacia la lectura. Con texto neutro puedes centrarte en jerarquía visual, tipografía, espaciado y saltos de línea.',
    },
    {
      id: 'lorem-ipsum-generator-faq-5',
      question: '¿Significa algo concreto el Lorem Ipsum?',
      answer:
        'No forma un discurso traducible. Aunque parte de raíces latinas reales, las palabras fueron recortadas y mezcladas intencionadamente para actuar solo como relleno visual.',
    },
    {
      id: 'lorem-ipsum-generator-faq-6',
      question: '¿Puedo generar palabras exactas en lugar de párrafos?',
      answer:
        'Sí. Cambia la unidad a Palabras o Frases e indica la cantidad exacta para ajustar titulares, tarjetas o descripciones cortas.',
    },
    {
      id: 'lorem-ipsum-generator-faq-7',
      question: '¿Qué hace la opción "Empezar con Lorem ipsum"?',
      answer:
        'Cuando está activa inicia con el clásico "Lorem ipsum dolor sit amet". Si la desactivas obtendrás bloques más variados extraídos directamente del banco de palabras.',
    },
    {
      id: 'lorem-ipsum-generator-faq-8',
      question: '¿Funciona sin conexión a internet?',
      answer:
        'Sí. Tras cargar la página una vez, la generación se ejecuta completamente en tu navegador sin enviar datos ni requerir red.',
    },
    {
      id: 'lorem-ipsum-generator-faq-9',
      question: '¿Cuánto texto puedo generar de una vez?',
      answer:
        'Hasta 100 unidades por vez: 100 párrafos, 100 frases o 100 palabras, suficiente para cualquier maqueta o prueba de maquetación.',
    },
    {
      id: 'lorem-ipsum-generator-faq-10',
      question: '¿La salida es texto plano?',
      answer:
        'Sí, texto sin etiquetas HTML ni estilos ocultos, con los párrafos separados por líneas en blanco para pegar limpio en Figma, Word o código.',
    },
    {
      id: 'lorem-ipsum-generator-faq-11',
      question: '¿Puedo copiar el resultado con un clic?',
      answer:
        'Sí. Pulsa Copiar y todo el bloque generado pasa de inmediato al portapapeles.',
    },
    {
      id: 'lorem-ipsum-generator-faq-12',
      question: '¿El texto cambia cada vez que lo genero?',
      answer:
        'Sí. Las palabras y longitudes de frase se eligen al azar en cada tirada; pulsa Regenerar para obtener otra variación manteniendo tu configuración.',
    },
    {
      id: 'lorem-ipsum-generator-faq-13',
      question: '¿Cuándo conviene evitar Lorem Ipsum?',
      answer:
        'Cuando la longitud exacta del texto definitivo o su idioma puedan romper botones, tarjetas o encabezados críticos. En esas pruebas usa contenido realista.',
    },
    {
      id: 'lorem-ipsum-generator-faq-14',
      question: '¿Qué diferencia hay frente a palabras aleatorias del idioma?',
      answer:
        'Las palabras reales de tu idioma distraen al lector porque el cerebro intenta leerlas. Las pseudo-latinas mantienen una textura visual de prosa sin robar atención.',
    },
    {
      id: 'lorem-ipsum-generator-faq-15',
      question: '¿Puedo usar Lorem Ipsum en proyectos comerciales?',
      answer:
        'Sí, no tiene restricciones de derechos de autor y es un estándar libre de uso para prototipos, demos y clientes, siempre reemplazándolo antes del lanzamiento.',
    },
    {
      id: 'lorem-ipsum-generator-faq-16',
      question: '¿Por qué algunos diseñadores recomiendan limitar su uso?',
      answer:
        'Porque ocultar problemas de copy largo o microcopys reales durante la revisión puede provocar rediseños tardíos al introducir los textos finales.',
    },
    {
      id: 'lorem-ipsum-generator-faq-17',
      question: '¿Puedo generar un único párrafo?',
      answer:
        'Sí. Selecciona Párrafos y pon la cantidad en 1 para obtener un solo bloque limpio.',
    },
    {
      id: 'lorem-ipsum-generator-faq-18',
      question: '¿La herramienta recuerda mis ajustes?',
      answer:
        'Solo guarda tus preferencias de unidad y cantidad localmente en tu navegador; nunca almacena los textos generados.',
    },
    {
      id: 'lorem-ipsum-generator-faq-19',
      question: '¿En qué navegadores funciona?',
      answer:
        'En todos los navegadores modernos de escritorio y móvil mediante JavaScript estándar sin dependencias externas.',
    },
    {
      id: 'lorem-ipsum-generator-faq-20',
      question: '¿Puedo pedir un número exacto de caracteres?',
      answer:
        'Trabaja por palabras, frases o párrafos y muestra el conteo exacto de palabras y caracteres del bloque generado para que ajustes al vuelo.',
    },
    {
      id: 'lorem-ipsum-generator-faq-21',
      question: '¿Es útil para probar tipografías y legibilidad?',
      answer:
        'Sí, es uno de sus mejores usos porque reproduce longitudes de palabras naturales para evaluar fuentes, interlineado y ancho de línea.',
    },
    {
      id: 'lorem-ipsum-generator-faq-22',
      question: '¿Se sube o comparte algún dato?',
      answer:
        'No. Todo ocurre en tu dispositivo sin cuentas, servidores ni seguimiento.',
    },
  ],
  guide: {
    title: 'Qué es Lorem Ipsum, origen y cuándo usarlo al diseñar',
    description:
      'Historia de Cicerón, ventajas tipográficas del texto simulado frente a palabras reales y cuándo sustituirlo por copy definitivo.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Elige unidad y cantidad para generar texto.',
    engine: {
      metaWords: 'Palabras',
      metaChars: 'Caracteres',
    },
  },
};
