import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'css-minifier',
  name: 'Minificador y Formateador CSS',
  seoTitle: 'Minificador y Embellecedor CSS Online Gratis',
  description:
    'Minifica hojas CSS para producción o embellece CSS compacto para leerlo con sangría clara en tu navegador, mostrando los bytes ahorrados al instante.',
  tagline: 'Reduce hojas de estilo CSS para producción o desminifica CSS compacto.',
  citation: {
    problem: 'Utiliza este Minificador y Embellecedor CSS para compactar una hoja de estilo o expandir CSS minificado sin subirlo a ningún servidor.',
    nonGoal: 'añadir prefijos automáticos, transpilar o fusionar reglas repetidas.',
  },
  knowledge: {
    primaryConcepts: ['minificación CSS', 'embellecedor CSS'],
    realWorldUseCases: [
      'Reducir el peso de una hoja de estilo escrita a mano antes de insertarla',
      'Expandir CSS minificado de terceros para depurar una regla visual',
      'Comprobar cuántos bytes ocupan los comentarios y espacios',
    ],
    commonMistakes: [
      'Esperar que un tokenizador elimine reglas CSS sin uso',
      'Minificar la única copia editable de una hoja de estilo',
    ],
  },
  faqs: [
    {
      id: 'css-min-1',
      question: '¿Qué elimina exactamente la minificación de CSS?',
      answer:
        'Comentarios (`/* ... */`) y espacios en blanco no significativos fuera de comillas y `url()`. Los selectores, nombres de propiedad, variables personalizadas y expresiones `calc()` permanecen intactos.',
    },
    {
      id: 'css-min-2',
      question: '¿Qué no puede eliminar de forma segura este minificador?',
      answer:
        'No borra selectores no usados, no fusiona reglas repetidas ni abrevia colores. Eso exige herramientas de build que conozcan tu HTML; adivinarlo en el navegador podría romper estilos.',
    },
    {
      id: 'css-min-3',
      question: '¿Qué hace la opción Embellecer?',
      answer:
        'Expande el CSS minificado añadiendo sangría de dos espacios y saltos de línea tras cada punto y coma y llave para que vuelva a ser legible y editable.',
    },
    {
      id: 'css-min-4',
      question: '¿Se envía mi código CSS a algún servidor?',
      answer:
        'No. Todo el análisis sintáctico, minificado y formateo corre dentro de tu navegador sin enviar ni almacenar nada externamente.',
    },
    {
      id: 'css-min-5',
      question: '¿Minificar cambia la apariencia de mi página?',
      answer:
        'No en hojas de estilo normales, ya que CSS ignora los espacios entre tokens. Conserva siempre una copia original si usas selectores con espacios muy específicos.',
    },
    {
      id: 'css-min-6',
      question: '¿Admitedeclaraciones @media y bloques anidados?',
      answer:
        'Sí a nivel léxico: abre y cierra correctamente las llaves de bloques `@media` y anidados tanto al minificar como al embellecer.',
    },
    {
      id: 'css-min-7',
      question: '¿Por qué muestra los bytes ahorrados?',
      answer:
        'Para saber de inmediato si el ahorro merece publicarse: un archivo pequeño reduce apenas unos bytes tras gzip, mientras que hojas extensas con comentarios liberan kilobytes.',
    },
    {
      id: 'css-min-8',
      question: '¿Cuándo no conviene minificar CSS?',
      answer:
        'Mientras sigas editando el archivo a mano o si tu empaquetador (Vite, Webpack) ya lo minifica al desplegar. Embellece primero para editar y minifica solo al publicar.',
    },
  ],
  guide: {
    title: 'Minificador CSS: compacta o formatea tus estilos',
    description: 'Cómo funcionan la minificación y el embellecimiento CSS, qué es seguro eliminar y cuándo usar cada modo.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada CSS',
    placeholder: 'Pega tu código CSS aquí',
    emptyOutput: 'Pega código CSS a la izquierda para embellecerlo o minificarlo.',
    validLabel: 'CSS procesado',
    invalidLabel: 'Error CSS',
    loadError: 'No se pudo cargar el procesador CSS.',
    modeBeautify: 'Embellecer',
    modeMinify: 'Minificar',
    modeAriaLabel: 'Modo',
    toolNote: 'Al minificar se muestra cuántos bytes se eliminaron cuando el archivo encoge.',
    insight:
      'Minificar elimina comentarios y espacios en blanco superfluos para reducir el tamaño; embellecer vuelve legible un CSS minificado.',
    technical: [
      { term: 'Minificar', detail: 'Elimina comentarios y contrae espacios fuera de cadenas y url()' },
      { term: 'Embellecer', detail: 'Sangría de 2 espacios respetando cadenas y url()' },
      { term: 'Seguro', detail: 'No reescribe selectores ni altera fórmulas calc()' },
      { term: 'Privacidad', detail: 'Ejecución local en el navegador sin envíos externos' },
    ],
    engine: {
      savedBytesTpl: 'Ahorrados {saved} bytes ({before} → {after}).',
      errCss: 'No se pudo procesar el CSS.',
    },
  },
};
