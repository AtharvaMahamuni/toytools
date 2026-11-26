import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'text-compare',
  name: 'Comparador de Textos',
  seoTitle: 'Comparador de Textos Online – Diff Lado a Lado',
  description:
    'Compara dos textos lado a lado y comprueba al instante qué líneas se añadieron o eliminaron. Todo lo que escribes permanece en tu dispositivo.',
  tagline: 'Compara dos versiones de un texto y detecta qué líneas cambiaron.',
  knowledge: {
    primaryConcepts: ['comparación de textos', 'diff online'],
    realWorldUseCases: [
      'Comprobar qué cambió entre dos borradores de un documento',
      'Revisar las ediciones realizadas por un colaborador',
      'Comparar dos fragmentos de configuración o código',
      'Corregir una versión revisada frente al texto original',
    ],
    commonMistakes: [
      'Comparar textos sin normalizar espacios antes, inflando las diferencias visuales',
      'Esperar una fusión automática en lugar de un informe de diferencias de solo lectura',
    ],
  },
  faqs: [
    {
      id: 'tc-faq-1',
      question: '¿Cómo comparo dos textos online?',
      answer:
        'Pega el texto original en el primer cuadro y el texto nuevo en el segundo. La herramienta resalta al instante qué líneas se añadieron, cuáles se eliminaron y cuáles no cambiaron, junto con el porcentaje de similitud.',
    },
    {
      id: 'tc-faq-2',
      question: '¿La comparación es carácter por carácter o línea por línea?',
      answer:
        'Es una comparación línea por línea (line diff), igual que git diff. Si cambias una palabra dentro de una frase, toda la línea aparece marcada como eliminada en el original y añadida en el nuevo, lo que facilita revisar documentos, contratos y archivos de configuración.',
    },
    {
      id: 'tc-faq-3',
      question: '¿Qué significan los símbolos + y - en el resultado?',
      answer:
        'Una línea con + fue añadida en el texto nuevo (no estaba en el original). Una línea con - fue eliminada del original (no está en el texto nuevo). Las líneas sin cambios aparecen atenuadas sin marcador.',
    },
    {
      id: 'tc-faq-4',
      question: '¿Se sube mi texto a algún servidor al compararlo?',
      answer:
        'No. Toda la comparación se ejecuta en tu navegador mediante JavaScript. Ningún texto sale de tu dispositivo.',
    },
    {
      id: 'tc-faq-5',
      question: '¿Qué indica el porcentaje de similitud?',
      answer:
        'Muestra la proporción de líneas compartidas entre ambas versiones. Un 100% indica textos idénticos; un 0% significa que no comparten ninguna línea. Si 9 de cada 10 líneas coinciden, la similitud es del 90%.',
    },
    {
      id: 'tc-faq-6',
      question: '¿Distingue entre mayúsculas y minúsculas?',
      answer:
        'Sí. La comparación distingue mayúsculas y minúsculas por defecto: «Hola» y «hola» cuentan como líneas distintas, siguiendo el comportamiento estándar de herramientas diff profesionales.',
    },
    {
      id: 'tc-faq-7',
      question: '¿Puedo comparar más de dos textos a la vez?',
      answer:
        'La herramienta compara dos textos por vez. Para revisar varias revisiones sucesivas, compáralas por pares: original frente a revisión 1, revisión 1 frente a revisión 2 y así sucesivamente.',
    },
    {
      id: 'tc-faq-8',
      question: '¿En qué se diferencia de Buscar y Reemplazar?',
      answer:
        'Comparar Textos es de solo lectura: te muestra exactamente qué cambió entre dos borradores sin modificarlos. Buscar y Reemplazar modifica activamente un texto sustituyendo patrones.',
    },
    {
      id: 'tc-faq-9',
      question: '¿Por qué los espacios al final de línea aparecen como diferencias?',
      answer:
        'Porque las líneas solo coinciden si son idénticas carácter a carácter. Un espacio invisible al final convierte «Hola» y «Hola » en cadenas distintas. Si detecta diferencias puramente de espacios o saltos de línea CRLF/LF, la propia herramienta te ofrece ignorarlas con un clic.',
    },
    {
      id: 'tc-faq-10',
      question: '¿Por qué un párrafo movido de orden parece reescrito por completo?',
      answer:
        'Porque el algoritmo alinea las líneas en orden secuencial. Si mueves un bloque completo a otro lugar del documento, se marca como eliminado en su posición anterior y añadido en la nueva aunque no hayas cambiado ninguna palabra.',
    },
  ],
  guide: {
    title: 'Comparar textos online: cómo leer un diff paso a paso',
    description:
      'Aprende a comparar dos versiones de un texto, interpretar líneas añadidas y eliminadas y detectar cambios en documentos o código.',
    readMinutes: 4,
  },
  ui: {
    btnSampleAria: 'Cargar texto de ejemplo para comparar',
    panelOriginal: 'Original',
    phOriginal: 'Pega el texto original...',
    ariaOriginal: 'Texto original',
    panelNew: 'Texto nuevo',
    phNew: 'Pega el texto nuevo...',
    ariaNew: 'Texto nuevo',
    ariaDiffResult: 'Resultado de la comparación',
    sampleA: 'La primera línea sigue igual.\nEsta línea será eliminada.\nTercera línea con pequeño error.\nCuarta línea sin cambios.',
    sampleB: 'La primera línea sigue igual.\nTercera línea sin errores.\nCuarta línea sin cambios.\nEsta línea nueva fue añadida.',
    msgIdentical: 'Los dos textos son idénticos.',
    msgSummaryTpl: 'Los textos tienen un {sim}% de similitud: {added} añadidas, {removed} eliminadas.',
    wsIgnoringTpl: 'Ignorando {level}. ',
    wsOtherwiseIdentical: 'Quitando eso, los dos textos son idénticos.',
    wsNormChangedTpl: '{norm} de {raw} líneas cambiadas presentan diferencias visibles.',
    wsOnlyDiffTpl: 'Solo difieren en {level}. Las {raw} líneas marcadas se leen igual.',
    wsSomeDiffTpl: '{diff} de {raw} líneas cambiadas solo difieren en {level}.',
    btnShowRaw: 'Mostrar diff exacto',
    btnIgnorePrefix: 'Ignorar ',
    lblAdded: 'Añadidas',
    lblRemoved: 'Eliminadas',
    lblUnchanged: 'Sin cambios',
    lblSimilarity: 'Similitud',
    unchangedRunTpl: '⋯ {n} líneas sin cambios',
  },
};
