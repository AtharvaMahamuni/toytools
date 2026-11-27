import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'json-validator',
  name: 'Validador JSON',
  seoTitle: 'Validador JSON Online – Comprobar Sintaxis Gratis',
  description:
    'Valida sintaxis JSON (RFC 8259) al instante en tu navegador. Localiza comas finales, comillas simples y fallos exactos sin subir tus datos.',
  tagline: 'Comprueba la sintaxis JSON y detecta el punto exacto donde falla.',
  knowledge: {
    primaryConcepts: ['validación JSON'],
    realWorldUseCases: [
      'Diagnosticar un error 400 "invalid JSON" devuelto por una API',
      'Revisar archivos package.json o tsconfig.json editados a mano',
      'Comprobar cargas útiles de webhooks sacadas de registros',
      'Detectar fallos sintácticos JSON antes del despliegue',
    ],
    commonMistakes: [
      'Dejar una coma final después del último elemento en objeto o matriz',
      'Confundir validación sintáctica con validación de esquema JSON Schema',
    ],
  },
  faqs: [
    {
      id: 'json-val-faq-1',
      question: '¿Qué hace la validación de JSON?',
      answer:
        'Comprueba si el texto cumple exactamente la sintaxis oficial JSON (RFC 8259). Si es válido confirma la estructura; si falla, señala qué falló y en qué posición ocurrió.',
    },
    {
      id: 'json-val-faq-2',
      question: '¿Cuáles son los errores de sintaxis JSON más frecuentes?',
      answer:
        'Comas finales tras el último elemento, comillas simples en lugar de dobles, claves sin comillas, comentarios y valores de JavaScript como `undefined`, `NaN` o `Infinity` que JSON no admite.',
    },
    {
      id: 'json-val-faq-3',
      question: '¿Qué diferencia hay entre JSON y un objeto de JavaScript?',
      answer:
        'JSON es mucho más estricto. JavaScript permite claves sin comillas, comillas simples, comas finales y comentarios; JSON exige siempre comillas dobles en claves y cadenas, cero comas finales y ningún comentario.',
    },
    {
      id: 'json-val-faq-4',
      question: '¿Por qué no se permiten comas finales en JSON?',
      answer:
        'Para mantener la gramática simple y sin ambigüedades al analizar (`[1, 2, 3,]`). Aunque JavaScript y TypeScript sí las aceptan, el estándar JSON las prohíbe expresamente.',
    },
    {
      id: 'json-val-faq-5',
      question: '¿Por qué JSON no admite comentarios?',
      answer:
        'Por decisión de diseño de Douglas Crockford, para que JSON fuese únicamente un formato puro de intercambio de datos sin instrucciones ocultas. Si necesitas comentarios en configuración usa JSONC o JSON5.',
    },
    {
      id: 'json-val-faq-6',
      question: '¿En qué se diferencia la validación sintáctica de JSON Schema?',
      answer:
        'La validación sintáctica comprueba corchetes, comillas y formato RFC 8259. JSON Schema valida el contenido de un documento ya bien formado: campos obligatorios, rangos numéricos o tipos esperados.',
    },
    {
      id: 'json-val-faq-7',
      question: 'Mi objeto JS funciona, pero JSON.parse falla. ¿Por qué?',
      answer:
        'Suele ocurrir cuando el texto no se generó con `JSON.stringify`, sino copiándolo desde consola o registros donde hay comillas simples, claves sin comillas o `undefined`. Pégalo aquí para ver el fallo exacto.',
    },
    {
      id: 'json-val-faq-8',
      question: '¿Son JSON válido los formatos JSONC o JSON5?',
      answer:
        'No. Son extensiones que añaden comentarios, comas finales y comillas simples. Funcionan en herramientas específicas como VS Code, pero todo analizador JSON estándar los rechaza.',
    },
    {
      id: 'json-val-faq-9',
      question: '¿Puede un objeto JSON tener claves repetidas?',
      answer:
        'La especificación recomienda evitar claves duplicadas aunque no las prohíbe de forma rígida. Distintos analizadores se quedan con el primer o último valor de forma inconsistente, por lo que conviene corregirlas.',
    },
  ],
  guide: {
    title: 'Cómo validar sintaxis JSON sin errores comunes',
    description: 'Reglas RFC 8259, comas finales, comillas simples y diferencia entre sintaxis y JSON Schema.',
    readMinutes: 5,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Pega tu JSON aquí',
    emptyOutput: 'Pega un JSON para comprobar su sintaxis.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON no válido',
    appliedPrefix: 'Corrección aplicada:',
    loadError: 'No se pudo cargar el procesador JSON.',
    moreAboutHeading: 'Cómo funciona el Validador JSON',
    insight:
      'Analiza el texto y confirma si cumple la gramática JSON oficial (RFC 8259), localizando el primer fallo sintáctico sin validar esquemas externos.',
    technical: [
      { term: 'Estándar', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Comprueba', detail: 'Sintaxis y estructura' },
      { term: 'No comprueba', detail: 'Esquemas, tipos de negocio ni campos obligatorios' },
      { term: 'Resultado', detail: 'Válido o primer error con ubicación' },
    ],
    engine: {
      validJsonOut: 'JSON válido',
      repairBoth: 'Corregir comillas tipográficas y coma final',
      repairQuotes: 'Sustituir comillas tipográficas',
      repairComma: 'Quitar coma final',
    },
  },
};
