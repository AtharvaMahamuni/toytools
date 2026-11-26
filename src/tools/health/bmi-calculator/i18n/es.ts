import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'bmi-calculator',
  name: 'Calculadora de IMC',
  seoTitle: 'Calculadora de IMC Online – Índice de Masa Corporal',
  description:
    'Calcula tu Índice de Masa Corporal (IMC) con peso y altura en sistema métrico o imperial, consulta tu categoría OMS y el rango saludable.',
  tagline: 'Tu IMC a partir de altura y peso, junto con el rango saludable para tu estatura.',
  methodology: {
    name: 'Clasificación del IMC según la OMS',
    detail:
      'Peso en kilogramos dividido entre la altura en metros al cuadrado, clasificado según los umbrales de la Organización Mundial de la Salud para adultos: 18,5, 25 y 30.',
  },
  knowledge: {
    primaryConcepts: ['índice de masa corporal', 'rango de peso saludable'],
    realWorldUseCases: [
      'Comprobar en qué franja se sitúa tu peso respecto al rango saludable antes de fijar un objetivo.',
      'Interpretar una cifra de IMC indicada en consulta médica o en un formulario.',
      'Calcular cuántos kilos o libras te separan de la banda de peso saludable para tu altura.',
    ],
    commonMistakes: [
      'Tomar el IMC como un diagnóstico médico en lugar de un indicador orientativo poblacional.',
      'Mezclar unidades, por ejemplo introducir el peso en libras manteniendo la altura en centímetros.',
      'Aplicar las categorías de adultos a menores de 18 años o deportistas muy musculados.',
    ],
  },
  faqs: [
    {
      id: 'bmi-calculator-faq-1',
      question: '¿Cuál es un rango de IMC saludable?',
      answer:
        'Para adultos, la Organización Mundial de la Salud sitúa el rango saludable entre 18,5 y 24,9. Por debajo de 18,5 corresponde a bajo peso; de 25 a 29,9 a sobrepeso; y 30 o más se clasifica como obesidad. La calculadora muestra tu valor, su categoría y el rango concreto de peso saludable para tu estatura.',
    },
    {
      id: 'bmi-calculator-faq-2',
      question: '¿Cómo se calcula el IMC?',
      answer:
        'El IMC se obtiene dividiendo tu peso en kilogramos entre el cuadrado de tu altura en metros. Una persona de 70 kg y 1,75 m tiene un IMC de 70 / (1,75 × 1,75), es decir, unos 22,9. Si usas unidades imperiales, la herramienta convierte primero libras y pulgadas a kilos y metros.',
    },
    {
      id: 'bmi-calculator-faq-3',
      question: '¿Es preciso el IMC en personas musculosas o deportistas?',
      answer:
        'No siempre. El IMC solo utiliza altura y peso, por lo que no distingue entre masa muscular y grasa corporal. Un atleta con mucha musculatura puede figurar en sobrepeso con muy poca grasa, mientras que una persona mayor con pérdida muscular puede marcar rango normal con exceso adiposo. Conviene combinarlo con otras medidas como porcentaje de grasa corporal.',
    },
    {
      id: 'bmi-calculator-faq-4',
      question: '¿Cómo calcular el IMC en libras y pulgadas?',
      answer:
        'Cambia el selector de unidades a imperial e introduce el peso en libras (lb) y la estatura total en pulgadas (in). Si ya habías escrito valores métricos, se convierten automáticamente al cambiar de sistema y se aplican las mismas categorías de la OMS.',
    },
    {
      id: 'bmi-calculator-faq-5',
      question: '¿Sirve esta calculadora de IMC para niños y adolescentes?',
      answer:
        'No. Los umbrales de adultos (18,5, 25 y 30) no son válidos para menores de 18 años. En infancia y adolescencia se emplean curvas y percentiles de IMC por edad y sexo porque la composición corporal cambia durante el crecimiento. Para menores, consulta las tablas pediátricas o a un profesional sanitario.',
    },
    {
      id: 'bmi-calculator-faq-6',
      question: '¿Son privados mis datos de peso y altura?',
      answer:
        'Sí. Todo el cálculo se ejecuta directamente en tu navegador. Tu peso y tu estatura no se envían ni se almacenan en ningún servidor; solo se conserva en tu navegador la preferencia de unidades.',
    },
  ],
  guide: {
    title: 'Cómo calcular el IMC (y qué indica realmente)',
    description:
      'Aprende la fórmula del IMC, las categorías de la OMS, cómo interpretar el rango de peso saludable y las limitaciones reales de este indicador.',
    readMinutes: 5,
  },
  fields: {
    unit: {
      label: 'Unidades',
      options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, in)' },
    },
    weight: {
      label: 'Peso',
      help: 'Introduce tu peso corporal actual.',
    },
    height: {
      label: 'Altura',
      help: 'Introduce tu estatura en centímetros o en pulgadas totales.',
    },
  },
  ui: {
    emptyText: 'Introduce tu peso y altura para calcular tu IMC.',
    engine: {
      fieldUnit: 'tu sistema de unidades',
      fieldWeight: 'tu peso',
      fieldHeight: 'tu altura',
      errWeightZero: 'Introduce un peso mayor que cero para calcular tu IMC.',
      errHeightZero: 'Introduce una altura mayor que cero para calcular tu IMC.',
      heroLabel: 'Índice de Masa Corporal',
      categoryLabel: 'Categoría',
      healthyRangeLabel: 'Peso saludable para tu altura',
      weightToLoseLabel: 'Peso que bajar para alcanzar el rango saludable',
      weightToGainLabel: 'Peso que subir para alcanzar el rango saludable',
      insightNormal: 'Un IMC de {bmi} se sitúa dentro del rango saludable (18,5 a 24,9) para adultos.',
      insightOther: 'Un IMC de {bmi} entra en la categoría «{label}». El rango saludable para tu estatura es {range}.',
      insightCaveat:
        'El IMC es un índice rápido de referencia, no un diagnóstico clínico. No distingue músculo de grasa, por lo que conviene valorarlo junto con otras medidas corporales.',
      cats: {
        underweight: 'Bajo peso',
        normal: 'Peso saludable',
        overweight: 'Sobrepeso',
        obese: 'Obesidad',
      },
      bands: {
        underweight: 'Bajo peso',
        normal: 'Saludable',
        overweight: 'Sobrepeso',
        obese: 'Obesidad',
      },
      vizTitle: 'Tu IMC de {bmi} en la escala OMS para adultos',
      vizDesc: 'Peso saludable para tu estatura: {range}.',
      milestoneHealthy: 'El peso se encuentra dentro del rango saludable de IMC',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'métrico (kg, cm)',
      assumpImperial: 'imperial (lb, in)',
      assumpFormulaTerm: 'Fórmula',
      assumpFormulaVal: 'peso (kg) / altura (m)²',
      assumpCatsTerm: 'Categorías',
      assumpCatsVal: 'rangos de la OMS para adultos (18,5 / 25 / 30)',
      decTdee: 'Estima cuántas calorías quemas al día',
      decBodyFat: 'Calcula tu porcentaje de grasa corporal, algo que el IMC no mide',
      decWeight: 'Haz un seguimiento de tu peso con el tiempo',
      nextQuestions: [
        '¿Cuántas calorías quemo al día?',
        '¿Cuál es mi porcentaje de grasa corporal?',
        '¿Es preciso el IMC en deportistas?',
      ],
      explanation:
        'El IMC divide tu peso en kilogramos entre el cuadrado de tu altura en metros y compara el resultado con las franjas estándar de la Organización Mundial de la Salud para adultos. Al utilizar solo altura y peso, no distingue masa muscular de grasa ni complexión ósea, por lo que sirve como orientación general y no como diagnóstico individual.',
    },
  },
};
