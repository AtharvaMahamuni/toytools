import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'json-minifier',
  name: 'Minificador JSON',
  seoTitle: 'Minificador JSON Online – Comprimir JSON Gratis',
  description:
    'Minifica y compacta JSON online eliminando espacios innecesarios al instante en tu navegador. Conserva números grandes y decimales exactos sin envíos.',
  tagline: 'Elimina los espacios en blanco del JSON para reducir su tamaño.',
  knowledge: {
    primaryConcepts: ['minificación JSON'],
    realWorldUseCases: [
      'Reducir el tamaño de las respuestas JSON en APIs de producción',
      'Compactar archivos JSON estáticos servidos por HTTP',
      'Reducir paquetes de configuración generados durante la compilación',
    ],
    commonMistakes: [
      'Minificar archivos JSON guardados en control de versiones dificultando las comparaciones',
      'Intentar minificar archivos con comentarios estilo JSONC o JSON5',
    ],
  },
  faqs: [
    {
      id: 'json-min-faq-1',
      question: '¿Qué hace la minificación de JSON?',
      answer:
        'Elimina todos los espacios, tabulaciones y saltos de línea no significativos entre tokens JSON sin alterar los datos. `{ "a": 1 }` y `{"a":1}` significan exactamente lo mismo, pero la versión minificada ocupa menos bytes.',
    },
    {
      id: 'json-min-faq-2',
      question: '¿Cuánto reduce el tamaño la minificación de JSON?',
      answer:
        'Depende de cuánta sangría tuviera el original. Un JSON con mucha anidación suele encogerse entre un 20% y un 40%, mientras que un objeto plano reduce solo un pequeño porcentaje. Combinado con gzip o Brotli, la carga limpia mejora la compresión final.',
    },
    {
      id: 'json-min-faq-3',
      question: '¿El JSON minificado sigue siendo JSON válido?',
      answer:
        'Sí. La especificación oficial RFC 8259 ignora el espacio en blanco entre tokens. Cualquier analizador JSON conforme lee el JSON minificado exactamente igual que el formateado.',
    },
    {
      id: 'json-min-faq-4',
      question: '¿Puedo volver a formatear un JSON minificado?',
      answer:
        'Sí, es totalmente reversible. Pega el resultado minificado en el Formateador JSON para recuperar la sangría legible. Ninguna de las dos operaciones reserializa tus valores, así que el ida y vuelta no pierde datos.',
    },
    {
      id: 'json-min-faq-5',
      question: '¿Cuándo conviene minificar JSON?',
      answer:
        'Cuando optimizas tráfico en producción: respuestas de API, archivos estáticos por red o bundles de compilación. En desarrollo o repositorios Git conviene mantenerlo formateado para poder leerlo y compararlo.',
    },
    {
      id: 'json-min-faq-6',
      question: '¿Qué diferencia hay entre minificar JSON y comprimirlo con gzip?',
      answer:
        'Actúan en capas distintas. Minificar quita espacios a nivel de texto; gzip o Brotli comprimen bytes antes de viajar por la red. Minificar primero entrega texto más limpio al compresor y reduce aún más el tamaño transferido.',
    },
    {
      id: 'json-min-faq-7',
      question: '¿Minificar altera el orden de las claves o la estructura?',
      answer:
        'No. El orden de claves, los tipos y los valores se conservan intactos. Solo desaparecen los espacios en blanco exteriores.',
    },
    {
      id: 'json-min-faq-8',
      question: '¿La minificación elimina comentarios en JSON?',
      answer:
        'JSON estándar no admite comentarios. Si tu archivo incluye comentarios (JSONC o JSON5), no es JSON válido y el minificador indicará error hasta que se retiren.',
    },
    {
      id: 'json-min-faq-9',
      question: '¿Debo minificar a mano las respuestas de mi API?',
      answer:
        'Normalmente no hace falta hacerlo a mano porque los frameworks serializan compacto por defecto (por ejemplo `JSON.stringify(data)` en Node.js sin tercer argumento).',
    },
    {
      id: 'json-min-faq-10',
      question: '¿Minificar puede redondear IDs largos o decimales como 19.90?',
      answer:
        'No. Aquí solo se borran espacios entre tokens originales copiando cada valor carácter por carácter. Un ID como 9007199254740993 no se redondea y 19.90 conserva el cero final. Si hay claves repetidas se mantienen con advertencia.',
    },
  ],
  guide: {
    title: '¿Qué es la minificación JSON y cuándo aplicarla?',
    description: 'Cómo reduce el tamaño la minificación JSON, diferencias con gzip y conservación exacta de números y claves.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Pega tu JSON aquí',
    emptyOutput: 'Pega un JSON a la izquierda para minificarlo.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON no válido',
    appliedPrefix: 'Corrección aplicada:',
    loadError: 'No se pudo cargar el procesador JSON.',
    moreAboutHeading: 'Cómo funciona el Minificador JSON',
    insight:
      'Minificar elimina todo espacio en blanco innecesario para obtener el JSON válido más compacto posible, conservando intactos los datos y los tokens originales.',
    technical: [
      { term: 'Operación', detail: 'Copia los tokens originales sin espacios en blanco ni reserialización' },
      { term: 'Uso', detail: 'Reducir respuestas API, configuraciones y almacenamiento' },
      { term: 'Datos', detail: 'Intactos: enteros grandes, 1.0, 1e5, escapes y orden de claves preservados' },
      { term: 'Claves duplicadas', detail: 'Se conservan tal como aparecen y se muestran con advertencia' },
    ],
    engine: {
      repairBoth: 'Corregir comillas tipográficas y coma final',
      repairQuotes: 'Sustituir comillas tipográficas',
      repairComma: 'Quitar coma final',
    },
  },
};
