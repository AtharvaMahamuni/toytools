import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'json-formatter',
  name: 'Formateador JSON',
  seoTitle: 'Formateador JSON Online – Embellecer JSON Gratis',
  description:
    'Formatea y embellece JSON online con sangría clara. Ordena y presenta JSON compacto para leerlo fácilmente. Todo permanece en tu dispositivo.',
  tagline: 'Da formato legible a JSON compacto con sangría adecuada en tu navegador.',
  citation: {
    problem: 'Utiliza este Formateador JSON cuando necesites dar formato o inspeccionar código JSON sin subirlo a ningún servidor.',
    nonGoal: 'llamar a un modelo de IA ni interpretar el significado de los datos.',
  },
  knowledge: {
    primaryConcepts: ['formateador json', 'embellecer json'],
    realWorldUseCases: [
      'Depurar la respuesta minificada de una API en desarrollo',
      'Leer archivos de configuración empaquetados con claridad',
      'Inspeccionar cargas útiles de webhooks extraídas de registros',
      'Generar comparaciones limpias de archivos de configuración en control de versiones',
    ],
    commonMistakes: [
      'Intentar formatear JSON con errores de sintaxis sin corregirlo primero',
      'Almacenar JSON formateado en rutas de producción sensibles al tamaño de transferencia',
    ],
  },
  faqs: [
    {
      id: 'json-fmt-faq-1',
      question: '¿Cómo formatear JSON online?',
      answer:
        'Pega tu JSON en el cuadro de entrada y el formateador lo procesará al instante. Si es válido, aparece con sangría y saltos de línea. Si contiene algún error sintáctico, se muestra el aviso para corregirlo. Nada sale de tu navegador.',
    },
    {
      id: 'json-fmt-faq-2',
      question: '¿Qué hace exactamente un formateador JSON?',
      answer:
        'Toma un JSON válido y lo reescribe con sangría uniforme y saltos de línea. Los datos no cambian: conserva exactamente las mismas claves, valores y estructura. Solo cambia el espacio en blanco para transformar una línea compacta en un texto fácil de explorar.',
    },
    {
      id: 'json-fmt-faq-3',
      question: '¿Formatear JSON modifica su contenido o significado?',
      answer:
        'No. Los espacios entre símbolos no tienen significado en JSON. `{"a":1}`, `{ "a": 1 }` y su versión multilínea con sangría representan exactamente la misma estructura para cualquier analizador JSON.',
    },
    {
      id: 'json-fmt-faq-4',
      question: '¿Qué diferencia hay entre formatear y minificar JSON?',
      answer:
        'Son operaciones opuestas. Formatear añade sangría y saltos de línea para facilitar la lectura humana. Minificar los elimina para reducir el tamaño del archivo. Ambos producen JSON válido sin alterar ningún dato.',
    },
    {
      id: 'json-fmt-faq-5',
      question: '¿En qué se diferencia formatear de validar JSON?',
      answer:
        'Formatear organiza visualmente un JSON válido mediante sangría. Validar comprueba si el texto cumple la sintaxis oficial y localiza el primer fallo si es inválido. Si el formateador rechaza la entrada, corrige primero el error sintáctico.',
    },
    {
      id: 'json-fmt-faq-6',
      question: '¿Es privado este Formateador JSON?',
      answer:
        'Sí. Todo el formateo se ejecuta localmente en tu navegador mediante JavaScript. Tu JSON nunca se envía ni se guarda en ningún servidor externo.',
    },
    {
      id: 'json-fmt-faq-7',
      question: '¿Qué nivel de sangría conviene usar?',
      answer:
        'Dos espacios es el estándar más habitual en proyectos web y JavaScript, mientras que cuatro espacios es frecuente en Python y otros entornos. Desde el punto de vista técnico, cualquier analizador interpreta ambas opciones por igual.',
    },
    {
      id: 'json-fmt-faq-8',
      question: '¿Por qué las respuestas de una API suelen verse en una sola línea?',
      answer:
        'La mayoría de API devuelven JSON minificado (sin espacios ni saltos de línea) para ahorrar ancho de banda y acelerar la red. Es ideal en producción, pero incómodo al depurar. Pegarlo aquí lo vuelve legible al momento.',
    },
    {
      id: 'json-fmt-faq-9',
      question: '¿Qué significa hacer pretty-print en JSON?',
      answer:
        'Pretty-print significa imprimir con formato legible: añadir sangría y saltos de línea para que una estructura compacta sea fácil de leer por personas. En JSON es sinónimo de formatear o embellecer.',
    },
    {
      id: 'json-fmt-faq-10',
      question: '¿Puedo formatear JSON sin subir archivos?',
      answer:
        'Sí. ToyTools formatea el texto directamente en tu dispositivo sin necesidad de subir archivos ni iniciar sesión.',
    },
    {
      id: 'json-fmt-faq-11',
      question: '¿Utiliza inteligencia artificial este formateador?',
      answer:
        'No. Es una utilidad puramente sintáctica y determinista. No envía tus datos a ChatGPT, Claude, Gemini ni ningún otro modelo.',
    },
    {
      id: 'json-fmt-faq-12',
      question: '¿Sirve para revisar JSON generado por un chatbot o modelo?',
      answer:
        'Sí. Puedes pegar aquí el bloque devuelto para inspeccionarlo, detectar errores de comas o llaves y copiar la versión ordenada sin compartirlo con terceros.',
    },
    {
      id: 'json-fmt-faq-13',
      question: '¿Conserva números grandes, decimales exactos y claves duplicadas?',
      answer:
        'Sí. La herramienta reindenta tus símbolos originales sin reconstruir objetos en JavaScript, de modo que 12345678901234567890 no se redondea, 1.0 sigue siendo 1.0 y 1e5 se mantiene intacto. Si hay claves repetidas, las conserva y muestra una advertencia.',
    },
  ],
  guide: {
    title: '¿Qué es el formateo JSON y para qué sirve?',
    description:
      'Qué hace un formateador JSON, por qué pretty-print y minificación conservan exactamente los mismos datos y cuándo usar cada uno en tu dispositivo.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Pega tu JSON aquí',
    emptyOutput: 'Pega un JSON a la izquierda para formatearlo.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON no válido',
    appliedPrefix: 'Corrección aplicada:',
    loadError: 'No se pudo cargar el procesador JSON.',
    moreAboutHeading: 'Cómo funciona el Formateador JSON',
    insight:
      'Formatear (pretty-print) añade sangría uniforme y saltos de línea para leer y comparar JSON fácilmente. Solo modifica los espacios en blanco, nunca los datos originales.',
    technical: [
      { term: 'Estándar', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Operación', detail: 'Reindenta los tokens originales con 2 espacios sin volver a serializar los valores' },
      { term: 'Datos', detail: 'Intactos: enteros grandes, 1.0, 1e5 y escapes de texto se conservan tal cual' },
      { term: 'Claves duplicadas', detail: 'Se conservan tal como aparecen y se muestran con advertencia' },
      { term: 'Errores', detail: 'Indica el primer error sintáctico con su ubicación exacta' },
    ],
  },
};
