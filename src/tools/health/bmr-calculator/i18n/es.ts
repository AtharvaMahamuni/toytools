import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'bmr-calculator',
  name: 'Calculadora BMR (Tasa Metabólica Basal)',
  seoTitle: 'Calculadora BMR – Tasa Metabólica Basal Online',
  description:
    'Calcula tu tasa metabólica basal (BMR) con la ecuación de Mifflin-St Jeor en tu navegador y descubre cuánto añade cada nivel de actividad.',
  tagline: 'Tu tasa metabólica basal y el gasto añadido por actividad.',
  craft: {
    solves:
      'Un gasto basal por debajo de 1.400 kcal suele parecer un metabolismo lento; expresarlo por kilo de peso muestra si es completamente normal.',
  },
  knowledge: {
    primaryConcepts: ['tasa metabólica basal', 'metabolismo en reposo'],
    realWorldUseCases: [
      'Conocer el gasto base en reposo antes de aplicar factores de actividad',
      'Fijar un mínimo calórico saludable que no debes rebasar al bajar peso',
      'Comparar cuánto del gasto diario corresponde al reposo frente al movimiento',
    ],
    commonMistakes: [
      'Comer exactamente las calorías del BMR creyendo que es tu mantenimiento',
      'Esperar que la fórmula mida masa muscular solo con peso y altura',
      'Interpretar un BMR bajo por menor estatura como un fallo metabólico',
    ],
  },
  fields: {
    unit: { label: 'Unidades', options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Sexo', options: { male: 'Hombre', female: 'Mujer' } },
    age: { label: 'Edad', suffix: 'años' },
    weight: { label: 'Peso', help: 'En kilogramos (o libras en imperial).' },
    height: { label: 'Altura', help: 'En centímetros (o pulgadas en imperial).' },
  },
  faqs: [
    {
      id: 'bmr-calculator-faq-1',
      question: '¿Qué es un BMR normal?',
      answer:
        'Depende del tamaño corporal. Un hombre de 30 años, 175 cm y 70 kg ronda 1.650 kcal/día, mientras una mujer de 165 cm y 60 kg ronda 1.320 kcal/día. Un valor más bajo por ser de menor estatura es totalmente normal.',
    },
    {
      id: 'bmr-calculator-faq-2',
      question: '¿Qué diferencia hay entre BMR y TDEE?',
      answer:
        'El BMR es la energía mínima en reposo absoluto. El TDEE añade caminar, digerir y entrenar (normalmente entre 1,2 y 1,9 veces el BMR) y es la cifra que marca cuánto comer.',
    },
    {
      id: 'bmr-calculator-faq-3',
      question: '¿Debo comer exactamente mi BMR para adelgazar?',
      answer:
        'No. Comer solo tu BMR ignora toda tu actividad diaria y crea un déficit demasiado agresivo. Ajusta tu déficit respecto a tu TDEE de mantenimiento sin bajar de tu BMR sin supervisión.',
    },
    {
      id: 'bmr-calculator-faq-4',
      question: '¿Por qué se usa Mifflin-St Jeor en vez de Harris-Benedict?',
      answer:
        'Harris-Benedict data de 1919 y suele sobrestimar el gasto basal alrededor de un 5 %. Mifflin-St Jeor (1990) se ajusta mejor a las poblaciones actuales.',
    },
    {
      id: 'bmr-calculator-faq-5',
      question: '¿Tener más músculo aumenta mucho el BMR?',
      answer:
        'Aumenta el gasto en reposo, aunque de forma moderada: cada kilo extra de músculo quema unas 13 kcal al día en reposo frente a ~4,5 kcal de la grasa. La ecuación usa peso, talla, edad y sexo sin distinguir composición.',
    },
    {
      id: 'bmr-calculator-faq-6',
      question: '¿Es lo mismo BMR que RMR?',
      answer:
        'Son muy parecidos: el BMR se mide en condiciones estrictas de ayuno y reposo clínico y el RMR (metabolismo en reposo) bajo condiciones algo más relajadas, saliendo ~10 % más alto.',
    },
  ],
  guide: {
    title: 'Qué mide realmente tu BMR y cómo convertirlo en TDEE',
    description:
      'Cómo estima el reposo la ecuación de Mifflin-St Jeor, por qué no debes comer tu BMR y diferencias con RMR y TDEE.',
    readMinutes: 5,
  },
  ui: {
    emptyText: 'Introduce sexo, edad, peso y altura para calcular tu BMR.',
    engine: {
      fieldUnit: 'Unidades',
      fieldSex: 'Sexo',
      fieldAge: 'Edad',
      fieldWeight: 'Peso',
      fieldHeight: 'Altura',
      errWeightZero: 'El peso debe ser mayor que cero.',
      errHeightZero: 'La altura debe ser mayor que cero.',
      errBmrNonPos: 'El resultado debe ser positivo; revisa tus medidas.',
      heroLabel: 'Tasa metabólica basal (BMR)',
      heroNote: 'Calorías en reposo absoluto (no es tu objetivo diario)',
      cardPerHour: 'Por hora en reposo',
      levels: {
        sedentary: 'Sedentario (×1,2)',
        light: 'Ligero (×1,375)',
        moderate: 'Moderado (×1,55)',
        active: 'Activo (×1,725)',
        'very-active': 'Muy activo (×1,9)',
      },
      insightRestingTpl: 'Incluso en reposo total tu cuerpo consume {bmr} al día, unos {perHour} kcal cada hora.',
      insightNotEatTpl: 'El BMR no es lo que debes comer; un día sedentario ya gasta unos {sedentary}. Comer tu BMR supone un déficit brusco.',
      insightDrivers: 'El peso corporal, la edad y la altura explican la mayor parte de este valor basal.',
      vizRest: 'Basal (BMR)',
      vizModerate: 'Actividad moderada',
      vizTitle: 'Reposo frente a día moderadamente activo',
      vizDescTpl: 'Tu metabolismo basal supone el {pct} % de un día moderadamente activo ({moderate}).',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'Métrico (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Ecuación',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpBodyTerm: 'Composición',
      assumpBodyVal: 'No distingue masa muscular frente a grasa',
      decTdee: 'Elegir tu nivel de actividad en la Calculadora TDEE',
      decMacro: 'Distribuir calorías en proteína, grasas y carbohidratos',
      decBodyFat: 'Estimar composición corporal y porcentaje graso',
      nextQuestions: [
        '¿Cuál es mi mantenimiento total real según mis días de entrenamiento?',
        '¿Cuánto déficit diario es seguro sin bajar de mi metabolismo basal?',
        '¿Cómo cambia mi BMR por cada 5 años de edad?',
      ],
      explanation:
        'La ecuación de Mifflin-St Jeor estima la energía mínima necesaria para funciones vitales en reposo completo a partir de sexo, edad, peso y altura.',
    },
  },
};
