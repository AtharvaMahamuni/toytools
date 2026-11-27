import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'reading-time-calculator',
  name: 'Calculadora de Tempo de Leitura',
  seoTitle: 'Calculadora de Tempo de Leitura e Fala Online',
  description:
    'Calcule quantos minutos leva para ler em silêncio ou apresentar em voz alta qualquer texto direto no navegador, sem enviar dados.',
  tagline: 'Minutos para ler ou falar um texto no próprio dispositivo.',
  craft: {
    solves:
      'A estimativa usa uma taxa média presumida de palavras por minuto; explicitar a base ajuda leitores com ritmos distintos.',
  },
  knowledge: {
    primaryConcepts: ['tempo de leitura'],
    realWorldUseCases: [
      'Exibir um selo de minutos de leitura em posts de blog',
      'Ajustar o roteiro de uma palestra a um tempo limitado',
      'Estimar a duração de newsletters e aulas escritas',
      'Avaliar se um artigo longo deve ser dividido em partes',
    ],
    commonMistakes: [
      'Aplicar a mesma velocidade a artigos técnicos e textos leves',
      'Esquecer que gráficos, tabelas e códigos aumentam o tempo real',
    ],
  },
  faqs: [
    {
      id: 'rtc-faq-1',
      question: 'Como o tempo de leitura é calculado?',
      answer:
        'Divide-se o total de palavras pela velocidade média adulta de leitura silenciosa, definida em 200 palavras por minuto (ppm). Assim, 1.000 palavras levam cerca de 5 minutos.',
    },
    {
      id: 'rtc-faq-2',
      question: 'Qual é a velocidade média de leitura de um adulto?',
      answer:
        'Para leitura compreensiva comum fica entre 200 e 250 ppm; em materiais técnicos cai para 100 a 150 ppm. A base de 200 ppm oferece estimativa equilibrada.',
    },
    {
      id: 'rtc-faq-3',
      question: 'Quanto tempo leva para ler um artigo de 1.000 palavras?',
      answer:
        'A 200 ppm leva cerca de 5 minutos; a 250 ppm cerca de 4 minutos, variando conforme a complexidade do vocabulário.',
    },
    {
      id: 'rtc-faq-4',
      question: 'O que é tempo de fala e qual a diferença para leitura?',
      answer:
        'É a duração estimada para ler o texto em voz alta ou apresentar um discurso, com média de 130 a 150 palavras por minuto, bem mais lenta que a leitura mental.',
    },
    {
      id: 'rtc-faq-5',
      question: 'Quantas palavras deve ter um texto para certa duração?',
      answer:
        'A 200 ppm: 2 minutos equivalem a ~400 palavras, 5 minutos a ~1.000, 10 minutos a ~2.000 e 15 minutos a ~3.000 palavras.',
    },
    {
      id: 'rtc-faq-6',
      question: 'Por que outras calculadoras mostram tempos ligeiramente diferentes?',
      answer:
        'Algumas adotam 200 ppm, outras 238 ppm ou contam hífens e pontuação de forma distinta, gerando pequenas variações esperadas.',
    },
    {
      id: 'rtc-faq-7',
      question: 'Mostrar o tempo de leitura ajuda no SEO?',
      answer:
        'Ajuda na experiência do visitante ao alinhar expectativas e reduzir rejeição imediata, fortalecendo sinais de engajamento na página.',
    },
    {
      id: 'rtc-faq-8',
      question: 'Esta calculadora envia meu texto para servidores?',
      answer:
        'Não. Tudo roda localmente no navegador; o seu texto permanece privado no dispositivo.',
    },
  ],
  guide: {
    title: 'Calcular tempo de leitura e fala (200 ppm)',
    description:
      'Entenda a fórmula de palavras por minuto, a diferença para leitura em voz alta e quando textos técnicos exigem margem extra.',
    readMinutes: 5,
  },
  ui: {
    emptyMessage: 'Digite ou cole um texto acima para estimar os tempos.',
    sampleText:
      'Cole seu artigo, newsletter ou roteiro de apresentação aqui para calcular na hora os minutos aproximados de leitura e fala.',
    statReadingTime: 'Tempo de leitura',
    statSpeakingTime: 'Tempo de fala',
    statWords: 'Palavras',
    statAvgSentence: 'Média por frase',
  },
};
