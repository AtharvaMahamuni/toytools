import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'percentage-calculator',
  name: 'Calculadora de Porcentajes',
  seoTitle: 'Calculadora de Porcentajes Online Gratis',
  description:
    '¿Cuánto es el 15% de 80? Es 12. Calcula porcentajes, variación porcentual y qué porcentaje es X de Y en tu dispositivo.',
  tagline: 'Calcula el porcentaje de un número o la variación entre dos valores en tu dispositivo.',
  knowledge: {
    primaryConcepts: ['porcentaje', 'variación porcentual', 'puntos porcentuales'],
    realWorldUseCases: [
      'Calcular un descuento, rebaja o margen comercial sobre un precio',
      'Medir cuánto creció o bajó una cifra en términos porcentuales',
      'Obtener el importe de propina o impuestos como porcentaje de una factura',
      'Convertir una puntuación o proporción en un porcentaje sobre 100',
    ],
    commonMistakes: [
      'Confundir variación porcentual con puntos porcentuales al comparar dos tasas',
      'Intercambiar la parte y el total al calcular qué porcentaje representa X de Y',
    ],
  },
  faqs: [
    {
      id: 'pct-faq-1',
      question: '¿Qué es un porcentaje?',
      answer:
        'Un porcentaje es un número expresado como una fracción de 100. El término proviene del latín «per centum», que significa «por cada cien». Cuando dices 25%, te refieres a 25 partes de cada 100, es decir, un cuarto del total. Los porcentajes permiten comparar cantidades de distinto tamaño sobre una misma escala.',
    },
    {
      id: 'pct-faq-2',
      question: '¿Cómo calcular el porcentaje de una cantidad?',
      answer:
        'Multiplica el número por el porcentaje y divide entre 100. Por ejemplo, el 20% de 150 = (20 × 150) ÷ 100 = 30. Un atajo mental rápido consiste en mover la coma un lugar a la izquierda para obtener el 10% (150 → 15) y duplicarlo para obtener el 20% (15 × 2 = 30). Esta calculadora lo resuelve al instante.',
    },
    {
      id: 'pct-faq-3',
      question: '¿Cómo calcular qué porcentaje es un número de otro?',
      answer:
        'Divide la parte entre el total y multiplica el resultado por 100. Por ejemplo, para saber qué porcentaje representa 45 de 200: (45 ÷ 200) × 100 = 22,5%. Resulta muy útil para notas académicas, resultados de encuestas y seguimiento de objetivos.',
    },
    {
      id: 'pct-faq-4',
      question: '¿Cuál es la diferencia entre porcentaje y puntos porcentuales?',
      answer:
        'Un punto porcentual es la diferencia aritmética directa entre dos porcentajes. Si un tipo de interés sube del 3% al 5%, aumenta en 2 puntos porcentuales, pero supone un incremento relativo del 66,7% sobre la tasa original. Confundir ambos conceptos es un error frecuente en economía y noticias.',
    },
    {
      id: 'pct-faq-5',
      question: '¿Cómo se calcula el aumento o disminución porcentual?',
      answer:
        'Resta el valor inicial al valor final, divide entre el tamaño del valor inicial y multiplica por 100. La fórmula es ((Nuevo − Anterior) ÷ |Anterior|) × 100. Si un precio pasa de 80 € a 100 €: ((100 − 80) ÷ 80) × 100 = 25% de aumento. Un resultado negativo indica una bajada. Si el valor inicial es negativo, omite el signo menos al dividir para conservar el sentido correcto del cambio.',
    },
    {
      id: 'pct-faq-6',
      question: '¿Cómo calcular un descuento sobre un precio?',
      answer:
        'Multiplica el precio original por el porcentaje de descuento y divide entre 100 para hallar el ahorro, y luego réstalo del precio inicial. Para un 30% de descuento sobre 120 $: descuento = (30 × 120) ÷ 100 = 36 $; precio final = 120 $ − 36 $ = 84 $. También puedes multiplicar directamente por (1 − 0,30) = 0,70.',
    },
    {
      id: 'pct-faq-7',
      question: '¿Por qué aplicar un 50% de descuento y luego subir un 50% no vuelve al precio original?',
      answer:
        'Porque cada porcentaje se calcula sobre una base distinta. Un artículo de 100 $ rebajado un 50% pasa a costar 50 $. Sumar un 50% sobre esos 50 $ da 75 $, no 100 $. La segunda operación parte del precio ya reducido, por lo que las variaciones porcentuales no son simétricas.',
    },
    {
      id: 'pct-faq-8',
      question: '¿Cómo calcular el IVA o impuesto a partir de un porcentaje?',
      answer:
        'Multiplica el precio base sin impuestos por el tipo impositivo y divide entre 100. Para un 21% de IVA sobre 100 €: impuesto = (21 × 100) ÷ 100 = 21 €; total = 121 €. Para obtener la base imponible a partir del total con IVA incluido, divide entre (1 + tipo / 100), es decir, 121 € ÷ 1,21 = 100 €.',
    },
  ],
  guide: {
    title: 'Cómo calcular porcentajes: 3 fórmulas esenciales',
    description:
      'Las tres fórmulas de porcentajes con ejemplos resueltos: X% de Y, qué porcentaje es X de Y y variación porcentual, además de puntos porcentuales.',
    readMinutes: 6,
  },
  ui: {
    panelValues: 'Valores',
    lblMode: 'Cálculo',
    optOf: '¿Cuánto es el A% de B?',
    optChange: 'Variación porcentual de A a B',
    optIs: '¿Qué porcentaje es A de B?',
    lblA: 'A',
    phA: 'Ejemplo: 20',
    lblB: 'B',
    phB: 'Ejemplo: 150',
    emptyHint: 'Introduce los valores para calcular.',
    errInvalid: 'Introduce números válidos.',
    errFirstZero: 'El primer valor no puede ser cero.',
    errSecondZero: 'El segundo valor no puede ser cero.',
    fmlOf: '{a}% de {b}',
    dirIncrease: 'Aumento',
    dirDecrease: 'Disminución',
    dirNone: 'Sin cambios',
    fmlChange: '{dir} de {a} a {b}',
    fmlIs: '{a} es este % de {b}',
    toastEmptyCopy: '¡Nada que copiar!',
    btnCopied: '✓ Copiado',
    btnCopy: 'Copiar',
    btnClear: 'Limpiar',
    btnConfirmClear: 'Confirmar limpieza',
  },
};
