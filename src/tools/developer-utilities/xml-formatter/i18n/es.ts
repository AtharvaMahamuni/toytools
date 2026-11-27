import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'xml-formatter',
  name: 'Formateador y Validador XML',
  seoTitle: 'Formateador y Validador XML Online Gratis',
  description:
    'Formatea o minifica XML online y detecta errores de buena formación con número de línea en tu navegador. Privado y sin subir archivos.',
  tagline: 'Indenta o minifica XML y localiza errores de estructura al instante.',
  citation: {
    problem: 'Utiliza este Formateador y Validador XML cuando necesites ordenar un documento XML o comprobar su buena formación sin subirlo.',
    nonGoal: 'validar contra esquemas externos XSD, DTD o Schematron.',
  },
  knowledge: {
    primaryConcepts: ['formateo XML', 'validador XML'],
    realWorldUseCases: [
      'Ordenar respuestas SOAP o fuentes RSS compactadas en una sola línea',
      'Comprobar que un archivo de configuración XML está bien formado antes de desplegar',
      'Minificar XML para incrustaciones sensibles al tamaño',
    ],
    commonMistakes: [
      'Esperar validación de esquema XSD en una comprobación de buena formación',
      'Asumir que las etiquetas XML ignoran mayúsculas y minúsculas como suele pasar en HTML',
    ],
  },
  faqs: [
    {
      id: 'xml-fmt-1',
      question: '¿Qué cambia exactamente el Formateador XML?',
      answer:
        'Solo la disposición visual cuando el documento está bien formado. El modo legible sangra los elementos anidados con dos espacios en líneas separadas; Minificar quita el espacio en blanco innecesario. Nombres, atributos, comentarios y CDATA se mantienen intactos.',
    },
    {
      id: 'xml-fmt-2',
      question: '¿Qué significa validar XML aquí?',
      answer:
        'Comprueba la buena formación sintáctica: un único elemento raíz, etiquetas de apertura y cierre coincidentes y nombres válidos. No valida esquemas externos XSD, DTD ni Schematron.',
    },
    {
      id: 'xml-fmt-3',
      question: '¿Por qué XML distingue entre mayúsculas y minúsculas?',
      answer:
        'En XML `<Libro>` y `<libro>` son etiquetas distintas, a diferencia del HTML tolerante de los navegadores. Si la etiqueta de cierre no coincide exactamente en mayúsculas, el documento no está bien formado.',
    },
    {
      id: 'xml-fmt-4',
      question: '¿Cómo se manejan los espacios de nombres (namespaces) XML?',
      answer:
        'Los prefijos vinculados mediante `xmlns` y atributos predeterminados se conservan exactamente tal como los escribiste. No se descargan DTD ni esquemas externos desde la red.',
    },
    {
      id: 'xml-fmt-5',
      question: '¿Se envía mi archivo XML a algún servidor?',
      answer:
        'No. El análisis con DOMParser y el formateo se ejecutan localmente en tu navegador sin enviar datos fuera de esta pestaña.',
    },
    {
      id: 'xml-fmt-6',
      question: '¿De dónde procede el número de línea del error?',
      answer:
        'Proviene del mensaje nativo de DOMParser en tu navegador cuando incluye línea y columna. Si el navegador no indica posición, se muestra igualmente el diagnóstico de XML mal formado.',
    },
    {
      id: 'xml-fmt-7',
      question: '¿Puedo también minificar XML además de formatearlo?',
      answer:
        'Sí. Selecciona Minificar en el selector superior de modo para eliminar los espacios en blanco superfluos entre etiquetas y reducir el tamaño del documento.',
    },
    {
      id: 'xml-fmt-8',
      question: '¿Formatear altera el significado de mi documento XML?',
      answer:
        'No en cuanto a estructura de elementos ni atributos. Los nodos de texto compuestos solo de espacios entre etiquetas se normalizan al reindentar.',
    },
  ],
  guide: {
    title: 'Formateador XML: sangría legible sin subir archivos',
    description: 'Cómo funciona el formateo y la validación XML en el navegador, distinción de mayúsculas y namespaces.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada XML',
    placeholder: 'Pega tu XML aquí',
    emptyOutput: 'Pega XML a la izquierda para formatearlo o minificarlo.',
    validLabel: 'XML válido',
    invalidLabel: 'XML no válido',
    loadError: 'No se pudo cargar el procesador XML.',
    modePretty: 'Sangría legible',
    modeMinify: 'Minificar',
    modeAriaLabel: 'Modo',
    toolNote: 'Cuando el navegador lo informa, el primer error sintáctico muestra el número de línea.',
    insight:
      'Reindenta XML bien formado para facilitar su lectura y comprueba la buena formación mediante el DOMParser nativo del navegador sin enviar datos.',
    technical: [
      { term: 'Operación', detail: 'Analiza con DOMParser y serializa con sangría de 2 espacios o minifica' },
      { term: 'Validación', detail: 'Buena formación: etiquetas cerradas, raíz única y nombres válidos' },
      { term: 'No comprueba', detail: 'Esquemas DTD, XSD o Schematron' },
      { term: 'Preservado', detail: 'Elementos, atributos, texto, comentarios y secciones CDATA' },
      { term: 'Privacidad', detail: 'Ejecución local en el navegador sin salir de esta pestaña' },
    ],
    engine: {
      errNoParser: 'El análisis XML no está disponible en este entorno.',
      whereLineColTpl: ' (línea {line}, columna {col})',
      whereLineTpl: ' (línea {line})',
      errMalformed: 'XML mal formado',
      errNoRoot: 'XML mal formado: falta el elemento raíz.',
    },
  },
};
