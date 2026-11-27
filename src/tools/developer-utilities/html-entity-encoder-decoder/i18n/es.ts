import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'html-entity-encoder-decoder',
  name: 'Codificador y Decodificador de Entidades HTML',
  seoTitle: 'Codificar y Decodificar Entidades HTML Online',
  description:
    'Escapa caracteres reservados (`<`, `>`, `&`, `"`) a entidades HTML o decodifica `&amp;`, `&#38;` y `&#x26;` de vuelta a texto plano en tu navegador.',
  tagline: 'Escapa y decodifica entidades HTML en tu navegador.',
  craft: {
    solves:
      'Las entidades pegadas desde gestores CMS suelen llegar con doble escape o sin punto y coma final, mostrando símbolos literales en lugar del carácter.',
  },
  knowledge: {
    primaryConcepts: ['entidades HTML'],
    realWorldUseCases: [
      'Mostrar fragmentos de código HTML dentro de una página web',
      'Escapar entradas de usuario para prevenir XSS en texto y atributos',
      'Insertar símbolos tipográficos y espacios irrompibles `&nbsp;`',
    ],
    commonMistakes: [
      'Omitir el escape de texto de usuario (riesgo de XSS)',
      'Abusar de `&nbsp;` para maquetar espacios en vez de usar CSS',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: '¿Qué es una entidad HTML?',
      answer:
        'Es una referencia de carácter que permite mostrar símbolos que el navegador interpretaría como etiquetas HTML: `&lt;` se renderiza como `<` sin abrir ninguna etiqueta.',
    },
    {
      id: 'html-ent-faq-2',
      question: '¿Qué caracteres deben escaparse siempre en HTML?',
      answer:
        'Los cuatro caracteres estructurales: `<` como `&lt;`, `>` como `&gt;`, `&` como `&amp;` y `"` dentro de atributos como `&quot;`. Con UTF-8 el resto es opcional.',
    },
    {
      id: 'html-ent-faq-3',
      question: '¿Siguen haciendo falta entidades HTML si la página usa UTF-8?',
      answer:
        'Sí para `<`, `>`, `&` y comillas en atributos, porque el problema no es la codificación del alfabeto sino su significado sintáctico en el analizador HTML.',
    },
    {
      id: 'html-ent-faq-4',
      question: '¿Qué diferencia hay entre &amp; y &#38;?',
      answer:
        'Ambos representan `&`. `&amp;` es la entidad nombrada legible; `&#38;` es la referencia decimal y `&#x26;` la hexadecimal, válidas para cualquier punto Unicode.',
    },
    {
      id: 'html-ent-faq-5',
      question: '¿Por qué &nbsp; se comporta distinto a un espacio normal?',
      answer:
        '`&nbsp;` impide el salto de línea entre dos palabras o valores (`10&nbsp;kg`) y evita que el navegador colapse varios espacios en uno.',
    },
    {
      id: 'html-ent-faq-6',
      question: '¿Qué diferencia hay entre codificación HTML y codificación URL?',
      answer:
        'HTML escapa marcado (`<` pasa a `&lt;`) y URL escapa transporte HTTP (`<` pasa a `%3C`). En un enlace dentro de un atributo HTML conviene escapar parámetros URL y escribir `&amp;` en el atributo.',
    },
    {
      id: 'html-ent-faq-7',
      question: '¿Qué pasa si olvido escapar < o > en texto de usuarios?',
      answer:
        'El navegador puede interpretarlo como etiquetas reales y ejecutar scripts maliciosos (vulnerabilidad XSS) si se inserta con `innerHTML` sin sanear.',
    },
    {
      id: 'html-ent-faq-8',
      question: '¿Codificar entidades HTML previene XSS?',
      answer:
        'Neutraliza los vectores habituales dentro de texto y atributos HTML estándar, pero dentro de `<script>`, estilos CSS o atributos `href` se requieren reglas específicas del contexto.',
    },
    {
      id: 'html-ent-faq-9',
      question: '¿Por qué &apos; no funcionaba en HTML antiguo?',
      answer:
        'Existía en XML y XHTML, pero no entró oficialmente en HTML hasta HTML5. Para compatibilidad con analizadores antiguos de HTML4 se usa `&#39;`.',
    },
  ],
  guide: {
    title: 'Entidades HTML: qué escapar, UTF-8 y prevención XSS',
    description:
      'Los cinco caracteres reservados en HTML, diferencia entre &amp; y &#38;, y cómo evitar doble escape o fallos XSS.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'Entidades HTML',
    forwardLabel: 'Codificar → HTML',
    inverseLabel: 'Decodificar ← HTML',
    outputLabel: 'Salida',
    placeholder: 'Escribe o pega texto o entidades &lt;...&gt; aquí…',
    outputPlaceholder: 'El resultado aparecerá aquí…',
    emptyOutput: 'Introduce texto o entidades HTML para empezar.',
    insight:
      'Escapar `<`, `>`, `&` y `"` como entidades HTML impide que el navegador interprete datos de usuario como etiquetas o código ejecutable.',
    technical: [
      { term: 'Entidades básicas', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: 'Formas admitidas', detail: 'Nombradas (&copy;), decimales (&#169;) y hexadecimales (&#xA9;)' },
      { term: 'Privacidad', detail: 'Procesamiento íntegro en tu navegador sin enviar código' },
    ],
    compareLabel: 'Comparar',
    comparePlaceholder: 'Valor esperado opcional',
    modeAriaLabel: 'Modo de conversión',
    inputAriaLabel: 'Entrada',
    outputAriaLabel: 'Resultado convertido',
    swapLabel: 'Intercambiar',
    swapAriaLabel: 'Intercambiar entrada y salida',
    metaAriaLabel: 'Metadatos',
    byteAriaLabel: 'Vista hexadecimal de bytes',
    historyTitle: 'Historial reciente',
    historyAriaLabel: 'Entradas recientes',
    insightAriaLabel: 'Explicación técnica',
    appliedPrefix: 'Corrección aplicada:',
    checkInputMsg: 'Revisa la entrada antes de convertir.',
    invalidInputMsg: 'Entrada HTML no válida.',
    couldNotConvertMsg: 'No se pudo convertir la entrada.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificación URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcado',
    },
    engine: {
      errDecode: 'No se pudieron decodificar las entidades HTML.',
      errEncode: 'No se pudieron codificar las entidades HTML.',
      infoNoEntities: 'No se detectaron entidades HTML para decodificar.',
      recDoubleEsc: 'Posible doble escape (&amp;lt;): decodificar una capa adicional',
      recMissingSemi: 'Añadir punto y coma faltante en entidades (ej. &amp sin ;)',
      metaEntities: 'Entidades',
      entCountTpl: '{n} entidades',
      metaInputLen: 'Long. entrada',
      metaOutputBytes: 'Bytes salida',
    },
  },
};
