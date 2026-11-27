import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'age-calculator',
  name: 'Calculadora de Idade',
  seoTitle: 'Calculadora de Idade Exata em Anos, Meses e Dias',
  description:
    'Calcule sua idade exata em anos, meses e dias pela data de nascimento, além do total de dias vividos e contagem regressiva para o próximo aniversário.',
  tagline: 'Sua idade exata em anos, meses e dias e dias para o aniversário.',
  craft: {
    solves:
      'Aniversariantes de 29 de fevereiro mudam de idade civil entre 28 de fevereiro e 1º de março conforme a regra de cada jurisdição.',
  },
  knowledge: {
    primaryConcepts: ['cálculo de idade', 'data de nascimento', 'idade cronológica'],
    realWorldUseCases: [
      'Confirmar idade exata para formulários, matrículas ou regras legais',
      'Descobrir quantos dias exatos alguém já viveu para comemorar marcos',
      'Calcular a idade em uma data específica do passado ou futuro',
    ],
    commonMistakes: [
      'Subtrair apenas o ano atual pelo ano de nascimento ignorando mês e dia',
      'Assumir todos os meses com 30 dias em vez de seguir o calendário real',
      'Usar média de 365,25 dias por ano sem contar anos bissextos reais',
    ],
  },
  fields: {
    birthDate: { label: 'Data de nascimento' },
    asOf: { label: 'Idade na data', help: 'Deixe em branco para usar a data de hoje.' },
  },
  faqs: [
    {
      id: 'age-calculator-faq-1',
      question: 'Como minha idade exata é calculada?',
      answer:
        'A ferramenta conta anos e meses completos a partir da data de nascimento sem ultrapassar a data de referência e soma os dias restantes conforme cada mês real e anos bissextos.',
    },
    {
      id: 'age-calculator-faq-2',
      question: 'Posso calcular minha idade em uma data passada ou futura?',
      answer:
        'Sim. Informe qualquer data no campo "Idade na data" ou deixe vazio para calcular com a data atual.',
    },
    {
      id: 'age-calculator-faq-3',
      question: 'Como a calculadora trata quem nasceu em 29 de fevereiro?',
      answer:
        'Em anos não bissextos considera-se o aniversário em 28 de fevereiro pela convenção civil padrão, inclusive na contagem regressiva.',
    },
    {
      id: 'age-calculator-faq-4',
      question: 'Por que idade não é só ano atual menos ano de nascimento?',
      answer:
        'Porque essa conta só acerta depois que você já fez aniversário neste ano; antes da data, erra por um ano inteiro.',
    },
  ],
  guide: {
    title: 'Como calcular sua idade exata em anos, meses e dias',
    description:
      'Como meses reais e anos bissextos afetam a conta, regra de 29 de fevereiro e conversão em dias totais.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Escolha uma data de nascimento para calcular a idade.',
    engine: {
      fieldBirthDate: 'Data de nascimento',
      fieldAsOf: 'Data de referência',
      errBirthAfterRef: 'A data de nascimento não pode ser posterior à data de referência.',
      heroLabel: 'Idade exata',
      units: {
        year: ['ano', 'anos'],
        month: ['mês', 'meses'],
        day: ['dia', 'dias'],
      },
      months: [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
      ],
      weekdays: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      dateTpl: '{d} de {m} de {y}',
      cardMonths: 'Meses completos',
      cardWeeks: 'Total de semanas',
      cardDays: 'Total de dias vividos',
      cardNextBday: 'Próximo aniversário',
      today: 'Hoje!',
      inDaysTpl: 'em {days}',
      insightBornTpl: 'Você nasceu em uma {weekday}.',
      insightHappyBday: 'Feliz aniversário na data de referência!',
      insightNextBdayTpl: 'Seu próximo aniversário será em {date} (faltam {days}).',
      ms18: 'Maioridade (18+)',
      msWithinMonth: 'Aniversário em menos de 30 dias',
      decDateDiff: 'Contar dias exatos entre duas outras datas',
      decUnix: 'Converter datas para Unix Epoch',
      nextQuestions: [
        'Quantos dias úteis existem entre duas datas específicas?',
        'Qual será minha idade exata em uma data futura?',
        'Qual é o timestamp Unix da minha data de nascimento?',
      ],
      explanationTpl: 'Entre {birth} e {ref} decorreram exatamente {totalDays} dias corridos no calendário real.',
    },
  },
};
