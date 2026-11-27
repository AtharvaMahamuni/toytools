import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'px-to-rem-converter',
  name: 'Conversor PX a REM',
  seoTitle: 'Conversor PX a REM, EM y PT Online (CSS)',
  description:
    'Convierte píxeles a rem, em, pt y porcentaje según un tamaño base raíz configurable en tu navegador, con copia en un toque y cero envíos.',
  tagline: 'px a rem, em y pt según tu tamaño tipográfico raíz.',
  craft: {
    solves:
      'Convertir `em` frente al tamaño raíz solo acierta en el nivel superior; dentro de elementos con tamaño propio el anidamiento acumula múltiplos inesperados.',
  },
  knowledge: {
    primaryConcepts: ['conversión de unidades CSS'],
    realWorldUseCases: [
      'Pasar una guía de diseño en píxeles a unidades rem escalables',
      'Traducir medidas en puntos (pt) de diseño gráfico a píxeles web',
      'Construir una escala de espaciado en rem a partir de px',
      'Comprobar a qué equivale un rem con tamaño base personalizado',
    ],
    commonMistakes: [
      'Asumir que 1rem equivale siempre a 16px sin revisar el tamaño raíz html',
      'Usar em para márgenes globales y sufrir escalado compuesto al anidar',
    ],
  },
  faqs: [
    {
      id: 'px-to-rem-converter-faq-1',
      question: '¿Cómo convierto px a rem?',
      answer:
        'Divide el valor en píxeles entre el tamaño de fuente raíz. Con la base por defecto de 16 px, 24 px ÷ 16 = 1,5 rem. Si tu CSS usa otro tamaño raíz, ajusta la base arriba.',
    },
    {
      id: 'px-to-rem-converter-faq-2',
      question: '¿Qué diferencia hay entre rem y em?',
      answer:
        '`rem` siempre se refiere al tamaño de fuente del elemento raíz (`html`), por lo que es constante en toda la página. `em` se calcula respecto al elemento padre o actual y se multiplica al anidar.',
    },
    {
      id: 'px-to-rem-converter-faq-3',
      question: '¿Por qué usar rem en lugar de px?',
      answer:
        'Porque `rem` respeta la preferencia de tamaño de texto que configura el usuario en el navegador o sistema operativo, mejorando accesibilidad y legibilidad sin romper proporciones.',
    },
    {
      id: 'px-to-rem-converter-faq-4',
      question: '¿Qué tamaño base de fuente debo usar?',
      answer:
        'Deja 16 px (el estándar de todos los navegadores) salvo que tu CSS cambie `html { font-size }`. Si usas el truco clásico de `62,5 %` (10 px), escribe `10` en el campo raíz.',
    },
    {
      id: 'px-to-rem-converter-faq-5',
      question: '¿Qué relación hay entre pt y px?',
      answer:
        'En CSS una pulgada equivale exactamente a 96 px y a 72 pt, de modo que 1 px = 0,75 pt y 16 px = 12 pt.',
    },
  ],
  guide: {
    title: 'PX, REM, EM y PT: relación y conversión en CSS',
    description:
      'Cómo se relacionan px, rem, em y pt, por qué importa html font-size y cuándo elegir rem por accesibilidad.',
    readMinutes: 5,
  },
  ui: {
    panelValue: 'Valor a convertir',
    lblValue: 'Valor',
    ariaUnit: 'Unidad de entrada',
    lblBase: 'Tamaño raíz (px)',
    rootNote: 'El predeterminado del navegador es 16 px (o 10 px si usas 62,5 %).',
    panelConverted: 'Unidades convertidas',
    copyLabel: 'Copiar',
    errInvalid: 'Introduce un número finito positivo para convertir.',
    engine: {
      emHintTpl: 'Equivalente frente a base de {base} px en nivel raíz (puede multiplicarse dentro de hijos anidados).',
    },
  },
};
