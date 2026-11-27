import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'bmi-calculator',
  name: 'Calculadora de IMC',
  seoTitle: 'Calculadora de IMC Online – Índice de Massa Corporal',
  description:
    'Calcule seu IMC (Índice de Massa Corporal) em kg/cm ou lb/in, confira sua classificação segundo a OMS e veja a faixa de peso saudável para sua altura.',
  tagline: 'Calcule seu IMC com base em altura e peso e veja a faixa saudável.',
  methodology: {
    name: 'Classificação do IMC pela OMS',
    detail:
      'Peso em quilogramas dividido pelo quadrado da altura em metros, avaliado pelas faixas adultas da Organização Mundial da Saúde (18,5, 25 e 30).',
  },
  knowledge: {
    primaryConcepts: ['índice de massa corporal', 'imc', 'peso saudável'],
    realWorldUseCases: [
      'Verificar em que faixa seu peso se encontra antes de definir uma meta',
      'Interpretar um valor de IMC informado em consulta médica ou exame',
      'Descobrir quantos quilos ou libras separam você da faixa saudável',
    ],
    commonMistakes: [
      'Tratar o IMC como diagnóstico médico em vez de índice populacional orientativo',
      'Misturar sistemas de medidas, digitando peso em libras e altura em centímetros',
      'Aplicar limites de adultos em menores de 18 anos ou atletas muito musculosos',
    ],
  },
  faqs: [
    {
      id: 'bmi-calculator-faq-1',
      question: 'Qual é uma faixa de IMC saudável?',
      answer:
        'Para adultos, a Organização Mundial da Saúde considera saudável o IMC entre 18,5 e 24,9. Abaixo de 18,5 indica baixo peso; de 25 a 29,9 indica sobrepeso; e 30 ou mais corresponde a obesidade. A calculadora mostra sua categoria e a faixa exata de peso saudável para sua altura.',
    },
    {
      id: 'bmi-calculator-faq-2',
      question: 'Como o IMC é calculado?',
      answer:
        'Divide-se o peso em quilogramas pela altura em metros ao quadrado. Uma pessoa de 70 kg e 1,75 m tem IMC = 70 / (1,75 × 1,75) = 22,9. Em unidades imperiais, a ferramenta converte libras e polegadas antes do cálculo.',
    },
    {
      id: 'bmi-calculator-faq-3',
      question: 'O IMC é preciso para pessoas musculosas ou atletas?',
      answer:
        'Nem sempre. Como usa apenas altura e peso, o IMC não distingue músculo de gordura corporal. Atletas com muita massa magra podem aparecer como sobrepeso tendo baixa gordura, enquanto idosos com perda muscular podem parecer normais com excesso adiposo.',
    },
    {
      id: 'bmi-calculator-faq-4',
      question: 'Como calcular o IMC em libras e polegadas?',
      answer:
        'Alterne o seletor de unidades para imperial e informe o peso em libras (lb) e a estatura total em polegadas (in). Os valores já preenchidos também são convertidos automaticamente.',
    },
    {
      id: 'bmi-calculator-faq-5',
      question: 'Esta calculadora de IMC serve para crianças e adolescentes?',
      answer:
        'Não. As faixas adultas (18,5, 25 e 30) não valem para menores de 18 anos. Crianças e adolescentes exigem curvas e percentis de IMC por idade e sexo, acompanhados por pediatra.',
    },
    {
      id: 'bmi-calculator-faq-6',
      question: 'Meus dados de peso e altura ficam privados?',
      answer:
        'Sim. Todo cálculo acontece diretamente no navegador. Seu peso e altura nunca são enviados nem armazenados em servidores externos.',
    },
  ],
  guide: {
    title: 'Como calcular o IMC e interpretar o resultado',
    description: 'Fórmula do IMC, classificação da OMS para adultos, faixa saudável por altura e limitações do índice.',
    readMinutes: 5,
  },
  fields: {
    unit: {
      label: 'Unidades',
      options: { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, in)' },
    },
    weight: {
      label: 'Peso',
      help: 'Informe seu peso corporal atual.',
    },
    height: {
      label: 'Altura',
      help: 'Informe sua altura em centímetros ou polegadas totais.',
    },
  },
  ui: {
    emptyText: 'Informe peso e altura para calcular seu IMC.',
    engine: {
      fieldUnit: 'o sistema de unidades',
      fieldWeight: 'o peso',
      fieldHeight: 'a altura',
      errWeightZero: 'Informe um peso maior que zero para calcular o IMC.',
      errHeightZero: 'Informe uma altura maior que zero para calcular o IMC.',
      heroLabel: 'Índice de Massa Corporal',
      categoryLabel: 'Classificação',
      healthyRangeLabel: 'Peso saudável para sua altura',
      weightToLoseLabel: 'Peso a reduzir para alcançar a faixa saudável',
      weightToGainLabel: 'Peso a ganhar para alcançar a faixa saudável',
      insightNormal: 'Um IMC de {bmi} está dentro da faixa saudável (18,5 a 24,9) para adultos.',
      insightOther: 'Um IMC de {bmi} fica na faixa "{label}". O peso saudável para sua altura vai de {range}.',
      insightCaveat:
        'O IMC é um indicador rápido de triagem, não um diagnóstico clínico. Ele não separa músculo de gordura; use-o como referência inicial.',
      cats: {
        underweight: 'Abaixo do peso',
        normal: 'Peso saudável',
        overweight: 'Sobrepeso',
        obese: 'Obesidade',
      },
      bands: {
        underweight: 'Abaixo do peso',
        normal: 'Saudável',
        overweight: 'Sobrepeso',
        obese: 'Obesidade',
      },
      vizTitle: 'Seu IMC de {bmi} na escala OMS para adultos',
      vizDesc: 'Faixa de peso saudável para sua altura: {range}.',
      milestoneHealthy: 'O peso está dentro da faixa saudável de IMC',
      assumpUnitsTerm: 'Unidades',
      assumpMetric: 'métrico (kg, cm)',
      assumpImperial: 'imperial (lb, in)',
      assumpFormulaTerm: 'Fórmula',
      assumpFormulaVal: 'peso (kg) / altura (m)²',
      assumpCatsTerm: 'Categorias',
      assumpCatsVal: 'faixas adultas da OMS (18,5 / 25 / 30)',
      decTdee: 'Estime quantas calorias você gasta por dia',
      decBodyFat: 'Estime a gordura corporal, que o IMC não mede',
      decWeight: 'Acompanhe seu peso ao longo do tempo',
      nextQuestions: [
        'Quantas calorias eu gasto por dia?',
        'Qual é o meu percentual de gordura corporal?',
        'O IMC funciona para atletas?',
      ],
      explanation:
        'O IMC divide o peso em quilos pelo quadrado da altura em metros e compara o resultado com as faixas padrão da Organização Mundial da Saúde para adultos. Como considera apenas altura e peso, serve como triagem populacional inicial, sem substituir avaliação clínica da composição corporal.',
    },
  },
};
