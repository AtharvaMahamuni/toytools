import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'aspect-ratio-calculator',
  name: 'Calculadora de Relación de Aspecto',
  seoTitle: 'Calculadora de Relación de Aspecto Online – 16:9',
  description:
    'Bloquea una proporción como 16:9 y calcula al instante el ancho o alto en píxeles. Redimensiona imágenes o vídeo sin deformar proporciones.',
  tagline: 'Bloquea una proporción como 16:9 y calcula el ancho o alto que falta.',
  knowledge: {
    primaryConcepts: ['relación de aspecto', 'proporción 16:9'],
    realWorldUseCases: [
      'Calcular la altura exacta de un vídeo o banner fijando el ancho',
      'Redimensionar una imagen sin estirarla ni recortarla',
      'Identificar la proporción simplificada de una resolución dada',
      'Dimensionar contenedores e iframes responsivos con una relación fija',
    ],
    commonMistakes: [
      'Modificar ancho y alto por separado rompiendo la proporción original',
      'Confundir la resolución absoluta en píxeles con la relación de aspecto',
    ],
  },
  faqs: [
    {
      id: 'aspect-ratio-calculator-faq-1',
      question: '¿Cómo calcular la altura para una proporción 16:9?',
      answer:
        'Multiplica el ancho por 9 y divide entre 16. Para un elemento de 1600 px de ancho, 1600 × 9 ÷ 16 da 900 px. Selecciona el ajuste predefinido 16:9, introduce tu ancho y la calculadora rellena la altura automáticamente junto con una vista previa proporcional.',
    },
    {
      id: 'aspect-ratio-calculator-faq-2',
      question: '¿Cómo mantengo la relación de aspecto al redimensionar?',
      answer:
        'Bloquea primero la proporción deseada y modifica solo una medida. Al cambiar el ancho se recalcula el alto automáticamente para respetar el formato, y al editar el alto se actualiza el ancho. Así evitas deformaciones al escalar fotos o fotogramas.',
    },
    {
      id: 'aspect-ratio-calculator-faq-3',
      question: '¿Qué relación de aspecto tiene 1920x1080?',
      answer:
        '1920 por 1080 se simplifica a 16:9, la proporción panorámica estándar. Para hallar la relación de cualquier tamaño, divide ambos lados entre su máximo común divisor. Introduce cualquier par ancho y alto aquí para ver al lado la proporción simplificada.',
    },
    {
      id: 'aspect-ratio-calculator-faq-4',
      question: '¿Cuáles son las relaciones de aspecto más comunes?',
      answer:
        '16:9 domina en vídeo y monitores, 4:3 en pantallas clásicas y fotografía tradicional, 3:2 en cámaras DSLR y sin espejo, 21:9 en monitores ultraanchos y cine, 1:1 en publicaciones cuadradas y 9:16 en vídeo vertical móvil. Los preajustes cubren todas y puedes definir cualquier valor personalizado.',
    },
    {
      id: 'aspect-ratio-calculator-faq-5',
      question: '¿Puedo introducir medidas con decimales?',
      answer:
        'Sí. La herramienta acepta números decimales tanto en la relación personalizada como en las dimensiones, útil para proporciones atípicas o cálculos finos de maquetación. Los resultados se redondean hasta cuatro decimales.',
    },
  ],
  guide: {
    title: 'Relación de aspecto: 16:9, escalado y fórmulas',
    description:
      'Qué es una relación de aspecto, cómo calcular el ancho o alto faltante y cómo redimensionar imágenes y vídeo sin distorsión.',
    readMinutes: 5,
  },
  ui: {
    panelDims: 'Dimensiones',
    lblRatio: 'Relación de aspecto',
    opt169: '16:9 (panorámica)',
    opt43: '4:3 (estándar)',
    opt32: '3:2 (fotografía)',
    opt219: '21:9 (ultraancha)',
    opt11: '1:1 (cuadrada)',
    opt916: '9:16 (vertical)',
    optCustom: 'Personalizada',
    ariaRatioW: 'Ancho de proporción',
    ariaRatioH: 'Alto de proporción',
    lblWidth: 'Ancho (px)',
    lblHeight: 'Alto (px)',
    btnCopyDims: 'Copiar dimensiones',
    errInvalidRatio: 'Introduce una relación válida, como 16:9.',
    errNeedDim: 'Introduce un ancho o un alto.',
    errInvalidVals: 'Introduce valores válidos.',
    evenHintText: 'Los códecs H.264/MP4 requieren ancho y alto enteros pares para codificar sin errores.',
    btnUsePrefix: 'Usar ',
    toastEmptyCopy: '¡Nada que copiar!',
    btnCopied: '✓ Copiado',
  },
};
