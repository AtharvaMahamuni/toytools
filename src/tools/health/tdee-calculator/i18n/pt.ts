import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'tdee-calculator',
  name: 'Calculadora de TDEE',
  seoTitle: 'Calculadora de TDEE e Gasto Calórico Diário',
  description:
    'Estime seu gasto energético total diário (TDEE) e as calorias para emagrecer, manter ou ganhar massa pela equação de Mifflin-St Jeor no navegador.',
  tagline: 'Seu gasto calórico diário e metas para secar ou ganhar massa.',
  craft: {
    solves:
      'O nível de atividade costuma ser superestimado; escolher apenas um degrau acima eleva a meta diária em centenas de calorias.',
  },
  knowledge: {
    primaryConcepts: ['gasto energético total diário', 'taxa metabólica basal'],
    realWorldUseCases: [
      'Definir meta diária de calorias antes de iniciar cutting ou bulking',
      'Entender quanto a rotina diária soma ao gasto em repouso',
      'Conferir a coerência de metas sugeridas por aplicativos fitness',
    ],
    commonMistakes: [
      'Superestimar o nível de atividade física semanal',
      'Encarar o resultado como exato sem ajustar pela balança',
      'Cortar calorias abaixo da taxa metabólica basal (TMB)',
    ],
  },
  fields: {
    unit: { label: 'Unidades', options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Sexo', options: { male: 'Masculino', female: 'Feminino' } },
    age: { label: 'Idade', suffix: 'anos' },
    weight: { label: 'Peso', help: 'Em quilogramas (ou libras em imperial).' },
    height: { label: 'Altura', help: 'Em centímetros (ou polegadas em imperial).' },
    activity: {
      label: 'Nível de atividade',
      options: {
        sedentary: 'Sedentário (escritório, pouco exercício)',
        light: 'Leve (1 a 3 treinos/semana)',
        moderate: 'Moderado (3 a 5 treinos/semana)',
        active: 'Ativo (6 a 7 treinos/semana)',
        'very-active': 'Muito ativo (treino pesado diário ou trabalho físico)',
      },
    },
  },
  faqs: [
    {
      id: 'tdee-calculator-faq-1',
      question: 'Qual a diferença entre TMB (BMR) e TDEE?',
      answer:
        'A TMB é o mínimo que o corpo gasta em repouso absoluto para respirar e manter os órgãos. O TDEE soma a isso caminhadas, digestão e treinos, sendo o valor usado para planejar a dieta.',
    },
    {
      id: 'tdee-calculator-faq-2',
      question: 'Quantas calorias devo consumir para emagrecer?',
      answer:
        'Consuma abaixo do seu TDEE de manutenção. Um déficit de cerca de 500 kcal por dia promove em torno de 0,45 kg por semana sem ficar abaixo da sua TMB.',
    },
    {
      id: 'tdee-calculator-faq-3',
      question: 'Qual nível de atividade escolher?',
      answer:
        'Na dúvida escolha o degrau menor. Sedentário refere-se a rotina sentada; leve a 1–3 treinos semanais; moderado a 3–5 e ativo a 6–7 treinos.',
    },
    {
      id: 'tdee-calculator-faq-4',
      question: 'Qual a precisão da calculadora de TDEE?',
      answer:
        'A equação de Mifflin-St Jeor é a mais recomendada na prática clínica, mas continua sendo uma estimativa. Acompanhe a média de peso por 2 a 3 semanas e ajuste conforme a resposta real.',
    },
    {
      id: 'tdee-calculator-faq-5',
      question: 'Por que meu peso não muda com as calorias calculadas?',
      answer:
        'Em geral o nível de atividade foi superestimado ou as porções subestimadas. Se após 2 a 3 semanas a tendência estiver estável, reduza cerca de 150 a 200 kcal.',
    },
    {
      id: 'tdee-calculator-faq-6',
      question: 'Meus dados ficam privados?',
      answer:
        'Sim. Todo cálculo roda localmente no navegador; idade, peso e altura não são enviados para nenhum servidor.',
    },
  ],
  guide: {
    title: 'Como calcular seu TDEE e definir calorias diárias',
    description:
      'Entenda TMB vs TDEE, a fórmula de Mifflin-St Jeor e como ajustar déficit ou superávit com segurança.',
    readMinutes: 6,
  },
  ui: {
    emptyText: 'Informe idade, peso, altura e atividade para estimar seu TDEE.',
    engine: {
      fieldUnit: 'Unidades',
      fieldSex: 'Sexo',
      fieldActivity: 'Atividade',
      fieldAge: 'Idade',
      fieldWeight: 'Peso',
      fieldHeight: 'Altura',
      errWeightZero: 'O peso deve ser maior que zero.',
      errHeightZero: 'A altura deve ser maior que zero.',
      heroLabel: 'Gasto energético total diário (TDEE)',
      heroNote: 'Calorias estimadas para manter seu peso atual',
      cardBmr: 'Basal (BMR)',
      cardMildLoss: 'Perda leve (-250 kcal)',
      cardLoss: 'Emagrecer (-500 kcal)',
      cardGain: 'Ganhar peso (+300 kcal)',
      insightRestingTpl: 'Em repouso total seu corpo gasta {bmr}; com movimento e treinos chega a {maintain} por dia.',
      insightGoal: 'Um déficit de 500 kcal por dia mira ~0,45 kg por semana preservando sua TMB.',
      insightCaveat: 'Estimativa por Mifflin-St Jeor: reavalie após 2 a 3 semanas conforme seu peso real.',
      actShort: {
        sedentary: 'Sedentário',
        light: 'Leve',
        moderate: 'Moderado',
        active: 'Ativo',
        'very-active': 'Muito ativo',
      },
      vizRest: 'Repouso (BMR)',
      vizActivity: 'Atividade',
      vizTitle: 'Composição do gasto diário',
      vizDescTpl: 'O metabolismo em repouso corresponde a {pct}% da sua manutenção de {maintain}.',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'Métrico (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Equação',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpActivityTerm: 'Fator de atividade',
      decBmi: 'Conferir faixa de IMC para sua altura',
      decBodyFat: 'Estimar percentual de gordura corporal',
      decWeight: 'Acompanhar evolução semanal de peso',
      nextQuestions: [
        'Como dividir essas calorias entre proteínas, carboidratos e gorduras?',
        'Como meu peso médio reage após 14 dias nessa meta?',
        'Quanto muda a estimativa se eu baixar um nível de atividade?',
      ],
      explanation:
        'Primeiro estimamos sua TMB em repouso pela equação de Mifflin-St Jeor usando sexo, idade, peso e altura, e depois aplicamos o multiplicador de atividade (1,2 a 1,9).',
    },
  },
};
