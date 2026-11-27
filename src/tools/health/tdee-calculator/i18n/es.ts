import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'tdee-calculator',
  name: 'Calculadora TDEE',
  seoTitle: 'Calculadora TDEE y Calorías Diarias Online',
  description:
    'Calcula tu gasto energético diario total (TDEE) y las calorías para bajar, mantener o subir de peso con la fórmula Mifflin-St Jeor en tu navegador.',
  tagline: 'Tu gasto calórico diario total y calorías objetivo.',
  craft: {
    solves:
      'El nivel de actividad es el parámetro más fácil de sobreestimar y un solo escalón de más infla el objetivo en cientos de calorías.',
  },
  knowledge: {
    primaryConcepts: ['gasto energético diario total', 'tasa metabólica basal'],
    realWorldUseCases: [
      'Fijar un objetivo calórico diario antes de definir o ganar volumen',
      'Entender cuánto suma la actividad cotidiana al metabolismo en reposo',
      'Contrastar las calorías sugeridas por una app deportiva',
    ],
    commonMistakes: [
      'Sobreestimar el nivel de actividad física semanal',
      'Tomar el TDEE calculado como exacto sin ajustar según el peso real',
      'Bajar las calorías por debajo de la tasa metabólica basal (BMR)',
    ],
  },
  fields: {
    unit: { label: 'Unidades', options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Sexo', options: { male: 'Hombre', female: 'Mujer' } },
    age: { label: 'Edad', suffix: 'años' },
    weight: { label: 'Peso', help: 'En kilogramos (o libras en imperial).' },
    height: { label: 'Altura', help: 'En centímetros (o pulgadas en imperial).' },
    activity: {
      label: 'Nivel de actividad',
      options: {
        sedentary: 'Sedentario (oficina, sin ejercicio)',
        light: 'Ligero (1 a 3 entrenos/semana)',
        moderate: 'Moderado (3 a 5 entrenos/semana)',
        active: 'Activo (6 a 7 entrenos/semana)',
        'very-active': 'Muy activo (entrenamiento intenso diario o trabajo físico)',
      },
    },
  },
  faqs: [
    {
      id: 'tdee-calculator-faq-1',
      question: '¿Qué diferencia hay entre BMR y TDEE?',
      answer:
        'El BMR (tasa metabólica basal) es la energía mínima en reposo absoluto para respirar y mantener tus órganos. El TDEE suma a esa base todo tu movimiento diario, digestión y ejercicio.',
    },
    {
      id: 'tdee-calculator-faq-2',
      question: '¿Cuántas calorías debo comer para perder peso?',
      answer:
        'Come por debajo de tu TDEE de mantenimiento. Un déficit diario de unas 500–550 kcal equivale aproximadamente a medio kilo semanal, sin bajar de tu BMR sin supervisión médica.',
    },
    {
      id: 'tdee-calculator-faq-3',
      question: '¿Qué nivel de actividad debo elegir?',
      answer:
        'Sé conservador y elige el escalón inferior si dudas. Sedentario equivale a trabajo de oficina; ligero 1–3 sesiones semanales; moderado 3–5; activo 6–7 y muy activo doble sesión o trabajo físico duro.',
    },
    {
      id: 'tdee-calculator-faq-4',
      question: '¿Qué precisión tiene una calculadora TDEE?',
      answer:
        'Mifflin-St Jeor es una de las ecuaciones más fiables, pero sigue siendo una estimación. Úsala como punto de partida durante dos o tres semanas y ajusta según la tendencia media de tu báscula.',
    },
    {
      id: 'tdee-calculator-faq-5',
      question: '¿Por qué no cambia mi peso con las calorías calculadas?',
      answer:
        'Suele deberse a un nivel de actividad sobreestimado o porciones infraestimadas. Observa el promedio de 2 a 3 semanas y, si no hay variación real, reduce unas 150–200 kcal.',
    },
    {
      id: 'tdee-calculator-faq-6',
      question: '¿Son privados mis datos?',
      answer:
        'Sí. Todo el cálculo se ejecuta localmente en tu navegador; edad, peso, altura y actividad nunca se envían a ningún servidor.',
    },
  ],
  guide: {
    title: 'Cómo calcular tu TDEE y calorías diarias',
    description:
      'Qué significan TDEE y BMR, cómo funciona la fórmula Mifflin-St Jeor y cómo definir tu déficit o superávit calórico.',
    readMinutes: 6,
  },
  ui: {
    emptyText: 'Introduce edad, peso, altura y actividad para estimar tu TDEE.',
    engine: {
      fieldUnit: 'Unidades',
      fieldSex: 'Sexo',
      fieldActivity: 'Actividad',
      fieldAge: 'Edad',
      fieldWeight: 'Peso',
      fieldHeight: 'Altura',
      errWeightZero: 'El peso debe ser mayor que cero.',
      errHeightZero: 'La altura debe ser mayor que cero.',
      heroLabel: 'Gasto energético diario total (TDEE)',
      heroNote: 'Calorías estimadas de mantenimiento al día',
      cardBmr: 'Basal (BMR)',
      cardMildLoss: 'Déficit suave (-250 kcal)',
      cardLoss: 'Bajar peso (-500 kcal)',
      cardGain: 'Superávit (+300 kcal)',
      insightRestingTpl: 'En reposo completo quemas {bmr}; la actividad diaria lo eleva a {maintain} al día.',
      insightGoal: 'Un déficit de 500 kcal diarias apunta a ~0,45 kg por semana sin bajar de tu BMR.',
      insightCaveat: 'Es una estimación Mifflin-St Jeor; revísala tras 2 o 3 semanas según tu peso real.',
      actShort: {
        sedentary: 'Sedentario',
        light: 'Ligero',
        moderate: 'Moderado',
        active: 'Activo',
        'very-active': 'Muy activo',
      },
      vizRest: 'Reposo (BMR)',
      vizActivity: 'Actividad',
      vizTitle: 'Desglose del gasto diario',
      vizDescTpl: 'El metabolismo en reposo supone el {pct} % de tu mantenimiento diario de {maintain}.',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'Métrico (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Ecuación',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpActivityTerm: 'Multiplicador',
      decBmi: 'Comprobar rango de IMC para tu estatura',
      decBodyFat: 'Estimar porcentaje de grasa corporal',
      decWeight: 'Registrar tendencia de peso semanal',
      nextQuestions: [
        '¿Cuántos gramos de proteína, carbohidratos y grasa corresponden a este objetivo?',
        '¿Cómo se comporta mi peso medio tras 14 días con estas calorías?',
        '¿Qué cambia si paso a un nivel de actividad inferior?',
      ],
      explanation:
        'Primero calculamos tu BMR en reposo con la ecuación de Mifflin-St Jeor a partir de sexo, edad, peso y estatura, y después lo multiplicamos por tu factor de actividad (de 1,2 a 1,9).',
    },
  },
};
