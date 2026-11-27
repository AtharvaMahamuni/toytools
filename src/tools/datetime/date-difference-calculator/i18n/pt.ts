import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'date-difference-calculator',
  name: 'Calculadora de Diferença entre Datas',
  seoTitle: 'Calculadora de Dias entre Duas Datas Online',
  description:
    'Conte o tempo exato entre duas datas em anos, meses e dias, total de semanas e quantidade de dias úteis (segunda a sexta) direto no navegador.',
  tagline: 'Tempo exato entre duas datas, incluindo contagem de dias úteis.',
  craft: {
    solves:
      'Confundir duração do calendário com dias úteis inclusivos faz prazos de entrega ou viagens saírem com erro de um dia.',
  },
  knowledge: {
    primaryConcepts: ['diferença entre datas', 'dias entre duas datas', 'duração entre datas'],
    realWorldUseCases: [
      'Contar quantos dias faltam até um prazo ou evento',
      'Medir a duração de um projeto em semanas e dias úteis',
      'Calcular exatamente há quanto tempo ocorreu uma data passada',
    ],
    commonMistakes: [
      'Aproximar cada mês como 30 dias em vez de seguir os meses reais do calendário',
      'Contar dias corridos quando a tarefa depende apenas de dias úteis',
      'Achar que inverter data inicial e final muda o tamanho do intervalo',
    ],
  },
  fields: {
    startDate: { label: 'Data inicial' },
    endDate: { label: 'Data final' },
  },
  faqs: [
    {
      id: 'date-difference-calculator-faq-1',
      question: 'Quantos dias existem entre duas datas?',
      answer:
        'Informe a data inicial e a final para obter o número exato de dias corridos, semanas completas e a decomposição em anos, meses e dias respeitando anos bissextos.',
    },
    {
      id: 'date-difference-calculator-faq-2',
      question: 'Quantos dias úteis há entre duas datas?',
      answer:
        'O resultado conta os dias de segunda a sexta dentro do intervalo, excluindo fins de semana (sem abater feriados nacionais ou locais).',
    },
    {
      id: 'date-difference-calculator-faq-3',
      question: 'Quantas semanas e meses tem esse intervalo?',
      answer:
        'Mostramos semanas completas de 7 dias e o equivalente em anos, meses e dias avançando mês a mês no calendário real.',
    },
    {
      id: 'date-difference-calculator-faq-4',
      question: 'A ordem das datas faz diferença?',
      answer:
        'Não. Medimos o tamanho absoluto do intervalo nos dois sentidos e avisamos se a data final for anterior à inicial.',
    },
  ],
  guide: {
    title: 'Como contar os dias e dias úteis entre duas datas',
    description:
      'Entenda o avanço por meses reais, contagem em semanas completas e diferença entre dias corridos e úteis.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Escolha as datas inicial e final para calcular a diferença.',
    engine: {
      fieldStartDate: 'Data inicial',
      fieldEndDate: 'Data final',
      heroLabel: 'Duração entre datas',
      listSep: ', ',
      units: {
        year: ['ano', 'anos'],
        month: ['mês', 'meses'],
        day: ['dia', 'dias'],
        week: ['semana', 'semanas'],
        'business day': ['dia útil', 'dias úteis'],
      },
      months: [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
      ],
      weekdays: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      dateTpl: '{d} de {m} de {y}',
      totalDaysNoteTpl: '{n} no total',
      cardTotalDays: 'Total de dias',
      cardTotalWeeks: 'Semanas completas',
      cardTotalMonths: 'Meses completos',
      cardWeekdays: 'Dias úteis (seg–sex)',
      weekendNoteTpl: '{n} dias de fim de semana',
      insightDowTpl: 'A data inicial cai em {start} e a final em {end}.',
      insightSameDay: 'As duas datas apontam para o mesmo dia.',
      insightWeeksDaysTpl: 'Equivale a {weeks} e {days}.',
      insightReversed: 'A data final é anterior à inicial; exibindo duração positiva.',
      insightBusinessTpl: 'Excluindo fins de semana, são {days}.',
      msWeek: 'Ao menos 1 semana completa',
      msYear: 'Ao menos 1 ano completo',
      decAge: 'Calcular idade exata por data de nascimento',
      decUnix: 'Converter datas para Unix Timestamp',
      nextQuestions: [
        'Quais feriados nacionais caem nesse período?',
        'Quantas horas ou segundos equivalem a esse prazo?',
        'Qual é a idade exata referente a essas datas?',
      ],
      explanationTpl: 'Entre {from} e {to} há {phrase} ({totalDays} dias no total).',
    },
  },
};
