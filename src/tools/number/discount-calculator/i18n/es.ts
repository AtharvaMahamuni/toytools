import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'discount-calculator',
  name: 'Calculadora de Descuentos',
  seoTitle: 'Calculadora de Descuentos y Precio Final Online',
  description:
    'Calcula el precio final y cuánto ahorras tras aplicar un porcentaje de descuento o una rebaja fija en tu navegador, sin subir precios ni datos.',
  tagline: 'Precio rebajado y ahorro exacto por porcentaje o importe fijo.',
  craft: {
    solves:
      'Los carteles con «30 % más 20 % adicional» engañan a casi cualquiera haciéndolo parecer un 50 %, cuando en realidad equivale al 44 %.',
  },
  knowledge: {
    primaryConcepts: ['cálculo de descuentos', 'precio rebajado'],
    realWorldUseCases: [
      'Calcular el precio final de un artículo en rebajas',
      'Comparar un cupón porcentual frente a un vale de importe fijo',
      'Comprobar cuánto ahorras realmente en promociones de temporada',
      'Presupuestar una compra antes de pasar por caja',
    ],
    commonMistakes: [
      'Sumar dos descuentos encadenados directamente en vez de aplicarlos en serie',
      'Aplicar el descuento sobre el precio con IVA cuando se calcula sobre la base',
    ],
  },
  faqs: [
    {
      id: 'disc-faq-1',
      question: '¿Cómo calculo un porcentaje de descuento?',
      answer:
        'Multiplica el precio original por el porcentaje y divide entre 100 para obtener el ahorro; después réstalo al precio original. Con 25 % en 80: ahorras 20 y pagas 60.',
    },
    {
      id: 'disc-faq-2',
      question: '¿Qué diferencia hay entre descuento porcentual y descuento fijo?',
      answer:
        'Un porcentaje escala con el precio (20 % ahorra 10 sobre 50, pero 40 sobre 200), mientras una rebaja fija de 10 descuenta siempre 10 sin importar el precio.',
    },
    {
      id: 'disc-faq-3',
      question: '¿Cuánto voy a ahorrar exactamente?',
      answer:
        'Introduce el precio original y el descuento en porcentaje o importe fijo: verás al instante el dinero ahorrado, el precio final y el porcentaje efectivo.',
    },
    {
      id: 'disc-faq-4',
      question: '¿Cómo funcionan los descuentos acumulados o en cadena?',
      answer:
        'Se aplican uno tras otro sobre el precio ya rebajado, no sumados. Un 20 % seguido de un 10 % extra sobre 100 deja primero 80 y luego 72: un 28 % real, no 30 %.',
    },
    {
      id: 'disc-faq-5',
      question: '¿El descuento se aplica antes o después de impuestos?',
      answer:
        'En comercio habitual el descuento se aplica al precio marcado antes de sumar impuestos locales o sobre la base imponible; calcularlo después altera el total.',
    },
    {
      id: 'disc-faq-6',
      question: '¿Cómo recupero el precio original a partir del precio rebajado?',
      answer:
        'Divide el precio final entre (1 menos la tasa de descuento). Si pagas 60 tras un 25 % de rebaja: 60 ÷ 0,75 = 80 de precio original.',
    },
    {
      id: 'disc-faq-7',
      question: '¿Qué significa realmente «segunda unidad al 50 %»?',
      answer:
        'Al comprar dos artículos del mismo precio (uno al 100 % y otro al 50 %), pagas 150 % por un valor de 200 %, es decir un 25 % de descuento total.',
    },
    {
      id: 'disc-faq-8',
      question: '¿Un descuento sobre venta equivale a reducir el margen comercial?',
      answer:
        'No. El descuento comercial rebaja el precio de venta al público, mientras el margen o recargo parte del coste de compra: las bases matemáticas son distintas.',
    },
    {
      id: 'disc-faq-9',
      question: '¿Se suben o guardan mis precios?',
      answer:
        'No. Cada cálculo se ejecuta íntegramente en tu navegador sin cuentas ni envíos a ningún servidor.',
    },
  ],
  guide: {
    title: 'Calcular descuentos, cascada y ahorro real',
    description:
      'Fórmulas para descuentos porcentuales, por qué 20 % + 10 % es 28 %, y cómo hallar el precio original antes de la rebaja.',
    readMinutes: 4,
  },
  ui: {
    panelDetails: 'Datos del descuento',
    lblMode: 'Tipo de descuento',
    optPercent: 'Porcentaje (%)',
    optFixed: 'Importe fijo',
    lblPrice: 'Precio original',
    phPrice: 'Ej. 80',
    lblAmountPct: 'Descuento (%)',
    lblAmountFixed: 'Rebaja fija',
    phPct: 'Ej. 25',
    phFixed: 'Ej. 15',
    lblFinalPrice: 'Precio final',
    emptyHint: 'Introduce un precio original y un descuento para ver el resultado.',
    lblSaved: 'Ahorras',
    lblRate: 'Descuento efectivo',
    errInvalidPrice: 'Introduce un precio original válido mayor o igual que 0.',
    warnFixedCapTpl: 'La rebaja de {amt} supera el precio; se limita a {price} y queda gratis.',
    warnPctCapTpl: 'Descuento superior al 100 %: {rate} se limita al 100 % y el precio queda en 0.',
    copyLabel: 'Copiar resultado',
    copiedLabel: 'Copiado',
    clearLabel: 'Limpiar',
    confirmClearLabel: 'Pulsa de nuevo para borrar',
    nothingToCopy: 'Calcula primero un descuento para copiar.',
    engine: {
      pitfallChainedTpl: 'Total acumulado con {rate} de ahorro real sobre el precio base de {base}.',
      pitfallSingleTpl: 'Descuento único sobre {price}: precio final {final}.',
      pitfallActionLabel: 'Porcentaje equivalente',
    },
  },
};
