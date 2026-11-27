import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'bmr-calculator',
  name: 'Calculadora de BMR (Taxa Metabólica Basal)',
  seoTitle: 'Calculadora de TMB / BMR – Mifflin-St Jeor',
  description:
    'Calcule sua taxa metabólica basal (TMB/BMR) pela fórmula de Mifflin-St Jeor no navegador e veja quanto cada nível de atividade adiciona ao dia.',
  tagline: 'Sua taxa metabólica basal e o acréscimo de cada nível de atividade.',
  craft: {
    solves:
      'Um gasto basal abaixo de 1.400 kcal parece metabolismo lento, mas dividido por quilo de peso corporal costuma ser totalmente normal.',
  },
  knowledge: {
    primaryConcepts: ['taxa metabólica basal (BMR)', 'taxa metabólica de repouso (RMR)'],
    realWorldUseCases: [
      'Descobrir o gasto mínimo em repouso antes dos fatores de atividade',
      'Definir o piso calórico que não deve ser ultrapassado no corte',
      'Comparar quanto do gasto diário vem do repouso versus movimento',
    ],
    commonMistakes: [
      'Comer exatamente sua TMB achando que é a meta para emagrecer',
      'Esperar que a equação meça massa muscular apenas por peso e altura',
      'Interpretar uma TMB menor por estatura baixa como metabolismo quebrado',
    ],
  },
  fields: {
    unit: { label: 'Unidades', options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, ft/in)' } },
    sex: { label: 'Sexo', options: { male: 'Masculino', female: 'Feminino' } },
    age: { label: 'Idade', suffix: 'anos' },
    weight: { label: 'Peso', help: 'Em quilogramas (ou libras em imperial).' },
    height: { label: 'Altura', help: 'Em centímetros (ou polegadas em imperial).' },
  },
  faqs: [
    {
      id: 'bmr-calculator-faq-1',
      question: 'O que é uma TMB / BMR normal?',
      answer:
        'Não há número único pois depende do tamanho do corpo. Um homem de 30 anos com 175 cm e 70 kg fica perto de 1.650 kcal/dia, e uma mulher de 165 cm e 60 kg perto de 1.320 kcal/dia.',
    },
    {
      id: 'bmr-calculator-faq-2',
      question: 'Qual a diferença entre BMR e TDEE?',
      answer:
        'A BMR é o consumo mínimo em repouso total. O TDEE soma caminhar, digerir e treinar (em torno de 1,2 a 1,9 vez a BMR) e orienta quantas calorias consumir.',
    },
    {
      id: 'bmr-calculator-faq-3',
      question: 'Devo comer apenas minha BMR para emagrecer?',
      answer:
        'Não. Comer só sua BMR ignora toda a atividade física do dia e cria um déficit severo demais. Calcule o corte a partir do TDEE sem baixar da sua BMR.',
    },
    {
      id: 'bmr-calculator-faq-4',
      question: 'Por que usar Mifflin-St Jeor em vez de Harris-Benedict?',
      answer:
        'Harris-Benedict (1919) tende a superestimar o repouso em cerca de 5%. Mifflin-St Jeor (1990) aproxima melhor os padrões corporais atuais.',
    },
    {
      id: 'bmr-calculator-faq-5',
      question: 'Ter mais músculos aumenta muito a BMR?',
      answer:
        'Aumenta de forma moderada: 1 kg de músculo consome cerca de 13 kcal/dia em repouso contra ~4,5 kcal do tecido adiposo. A fórmula porém usa apenas peso, altura, idade e sexo.',
    },
    {
      id: 'bmr-calculator-faq-6',
      question: 'BMR é o mesmo que RMR?',
      answer:
        'São muito próximos, mas BMR é medido sob jejum e repouso rigoroso, enquanto RMR tem condições menos rígidas e resulta cerca de 10% maior.',
    },
  ],
  guide: {
    title: 'O que sua Taxa Metabólica Basal (BMR) realmente mede',
    description:
      'Como funciona Mifflin-St Jeor, por que não comer abaixo da BMR e a relação exata com RMR e TDEE.',
    readMinutes: 5,
  },
  ui: {
    emptyText: 'Informe sexo, idade, peso e altura para calcular sua BMR.',
    engine: {
      fieldUnit: 'Unidades',
      fieldSex: 'Sexo',
      fieldAge: 'Idade',
      fieldWeight: 'Peso',
      fieldHeight: 'Altura',
      errWeightZero: 'O peso deve ser maior que zero.',
      errHeightZero: 'A altura deve ser maior que zero.',
      errBmrNonPos: 'Confira os valores informados.',
      heroLabel: 'Taxa metabólica basal (BMR)',
      heroNote: 'Energia em repouso absoluto (não é sua meta diária)',
      cardPerHour: 'Por hora em repouso',
      levels: {
        sedentary: 'Sedentário (×1,2)',
        light: 'Leve (×1,375)',
        moderate: 'Moderado (×1,55)',
        active: 'Ativo (×1,725)',
        'very-active': 'Muito ativo (×1,9)',
      },
      insightRestingTpl: 'Mesmo em repouso total seu corpo gasta cerca de {bmr} por dia, perto de {perHour} kcal por hora.',
      insightNotEatTpl: 'A BMR não é quanto você deve comer: mesmo um dia sedentário já exige cerca de {sedentary}.',
      insightDrivers: 'Peso corporal, altura e idade explicam a maior parte desse consumo basal.',
      vizRest: 'Basal (BMR)',
      vizModerate: 'Atividade moderada',
      vizTitle: 'Repouso vs. dia moderadamente ativo',
      vizDescTpl: 'O metabolismo em repouso equivale a {pct}% de um dia moderadamente ativo ({moderate}).',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'Métrico (kg / cm)',
      assumpImperial: 'Imperial (lb / in)',
      assumpFormulaTerm: 'Equação',
      assumpFormulaVal: 'Mifflin-St Jeor (1990)',
      assumpBodyTerm: 'Composição',
      assumpBodyVal: 'Não diferencia massa muscular de gordura',
      decTdee: 'Calcular seu TDEE conforme rotina de exercícios',
      decMacro: 'Dividir calorias entre proteínas, carboidratos e gorduras',
      decBodyFat: 'Estimar percentual de gordura corporal',
      nextQuestions: [
        'Qual é minha manutenção diária considerando meus treinos?',
        'Qual déficit seguro posso manter sem cruzar minha taxa basal?',
        'Quanto a BMR muda a cada 5 anos de idade?',
      ],
      explanation:
        'A equação de Mifflin-St Jeor estima o gasto energético mínimo em repouso completo a partir de sexo, idade, peso e altura.',
    },
  },
};
