import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'unix-timestamp-converter',
  name: 'Conversor de Timestamp Unix',
  seoTitle: 'Conversor de Timestamp Unix Online – Epoch para Data',
  description:
    'Converta timestamp Unix (epoch) para data legível e vice-versa em segundos ou milissegundos, com UTC, ISO 8601 e horário local no navegador.',
  tagline: 'Converta timestamps Unix em datas legíveis e o inverso em segundos ou milissegundos.',
  knowledge: {
    primaryConcepts: ['conversor unix timestamp', 'epoch time', 'timestamp para data'],
    realWorldUseCases: [
      'Ler rapidamente um timestamp Unix vindo de logs, bancos de dados ou APIs',
      'Gerar o timestamp Unix de uma data específica para queries SQL ou configurações',
      'Descobrir se um número está em segundos (10 dígitos) ou milissegundos (13 dígitos)',
    ],
    commonMistakes: [
      'Interpretar um timestamp em milissegundos como segundos e cair milhares de anos no futuro',
      'Achar que um timestamp Unix carrega fuso horário local em vez de partir sempre do UTC',
      'Esquecer que datas anteriores a 1º de janeiro de 1970 geram números negativos',
    ],
  },
  faqs: [
    {
      id: 'unix-timestamp-converter-faq-1',
      question: 'Como converter um timestamp Unix para data?',
      answer:
        'Mantenha a direção em "Timestamp para data", cole o número e selecione segundos ou milissegundos. O resultado exibe o horário em UTC, o padrão ISO 8601, seu horário local e o dia da semana. Por exemplo, 1700000000 segundos corresponde a terça-feira, 14 de novembro de 2023 às 22:13:20 UTC.',
    },
    {
      id: 'unix-timestamp-converter-faq-2',
      question: 'Como converter uma data para timestamp Unix?',
      answer:
        'Troque a direção para "Data para timestamp" e preencha data e hora. O valor informado é interpretado em UTC para garantir consistência global e retorna tanto em segundos quanto em milissegundos.',
    },
    {
      id: 'unix-timestamp-converter-faq-3',
      question: 'O timestamp Unix é medido em segundos ou milissegundos?',
      answer:
        'Ambos existem na prática. O Unix tradicional e muitos logs usam segundos (10 dígitos hoje em dia), enquanto JavaScript e APIs modernas usam milissegundos (13 dígitos). Se a data resultante parecer muito distante no futuro, mude para milissegundos.',
    },
    {
      id: 'unix-timestamp-converter-faq-4',
      question: 'O que é a época Unix (Unix epoch)?',
      answer:
        'É o instante zero de referência fixado às 00:00:00 UTC de 1º de janeiro de 1970. Um timestamp Unix conta os segundos ou milissegundos decorridos desde esse momento, usando valores negativos para datas anteriores a 1970.',
    },
    {
      id: 'unix-timestamp-converter-faq-5',
      question: 'Meus timestamps ou logs são enviados a algum servidor?',
      answer:
        'Não. Toda a matemática de época e formatação ISO 8601 roda localmente no seu navegador.',
    },
  ],
  guide: {
    title: 'Como converter Timestamp Unix (Epoch) para Data',
    description: 'O que é Unix timestamp, como funciona o epoch de 1970, segundos vs. milissegundos e fuso UTC.',
    readMinutes: 4,
  },
  fields: {
    mode: {
      label: 'Direção',
      options: {
        'to-date': 'Timestamp para data',
        'to-timestamp': 'Data para timestamp',
      },
    },
    timestamp: {
      label: 'Timestamp Unix',
      help: 'Digite um número inteiro positivo ou negativo.',
    },
    unit: {
      label: 'Unidade do timestamp',
      options: {
        seconds: 'Segundos (10 dígitos hoje)',
        milliseconds: 'Milissegundos (13 dígitos hoje)',
      },
    },
    datetime: {
      label: 'Data e hora (UTC)',
      help: 'Interpretado como horário UTC.',
    },
  },
  ui: {
    emptyText: 'Digite um timestamp Unix ou uma data para converter.',
    resultNote: 'Convertido instantaneamente no dispositivo.',
    engine: {
      errEnterTs: 'Informe um timestamp Unix para converter em data.',
      errNotNumber: 'O timestamp deve ser um número válido.',
      errOutOfRange: 'Este timestamp está fora do intervalo suportado.',
      heroUtc: 'Horário UTC',
      labelLocal: 'Seu horário local',
      labelWeekday: 'Dia da semana',
      labelMillis: 'Em milissegundos',
      rightNow: 'agora mesmo',
      unitSeconds: 'segundos',
      unitMillis: 'milissegundos',
      insightMillis: '13 dígitos indicam milissegundos. Lido em milissegundos equivale a {iso}. Troque a unidade para Milissegundos.',
      insightUtc: 'Em UTC são {time} de {date}.',
      insightRel: 'Esse instante ocorreu ou ocorrerá {rel}.',
      msAfterEpoch: 'Após a época Unix (1970)',
      ms32Bit: 'Dentro do limite de 32 bits em segundos',
      decTimezone: 'Converter esse horário para outro fuso horário',
      decDiff: 'Contar os dias entre duas datas',
      nextQsToDate: [
        'Que horas são em outro fuso horário?',
        'Quantos dias faltam ou se passaram até hoje?',
      ],
      explToDate: 'Um timestamp Unix conta o tempo desde 1º de janeiro de 1970 UTC (época Unix). {val} {unit} equivale a {iso}, ou seja, {utc} UTC.',
      fieldDatetime: 'uma data e hora',
      heroUnix: 'Timestamp Unix',
      heroUnixNote: 'Segundos desde 1º de janeiro de 1970 UTC',
      labelInterpreted: 'Interpretado como',
      noteUtc: 'A data digitada é lida em UTC',
      insightUtcInput: 'A data e hora informadas são tratadas como UTC, gerando o mesmo timestamp em qualquer país.',
      decAge: 'Calcular a idade exata a partir de uma data',
      nextQsToTs: [
        'Que data representa este timestamp Unix?',
        'Como funciona o limite do ano 2038 em 32 bits?',
      ],
      explToTs: 'Lido em UTC, {utc} equivale a {sec} segundos desde a época Unix de 1º de janeiro de 1970, ou {ms} milissegundos.',
    },
  },
};
