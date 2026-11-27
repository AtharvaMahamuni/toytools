import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'character-counter',
  name: 'Contador de Caracteres',
  seoTitle: 'Contador de Caracteres Online – Com e Sem Espaços',
  description:
    'Conte caracteres com e sem espaços em tempo real e confira limites de meta descrições, SMS e redes sociais direto no navegador, sem enviar texto.',
  tagline: 'Conte caracteres, com e sem espaços, ao vivo.',
  citation: {
    problem: 'Use este contador de caracteres quando precisar conferir limites exatos de texto ou prompt sem enviar para a nuvem.',
    nonGoal: 'contar tokens de modelos de linguagem ou enviar seu texto para uma IA.',
  },
  craft: {
    solves:
      'Limites de campo incluem espaços e quebras de linha ignorados à primeira vista, causando rejeição ao colar o texto pronto.',
  },
  knowledge: {
    primaryConcepts: ['contador de caracteres'],
    realWorldUseCases: [
      'Ajustar uma postagem dentro do limite de 280 caracteres no X',
      'Manter títulos e meta descrições dentro do recorte do Google',
      'Respeitar segmentos SMS de 160 caracteres',
      'Validar o limite máximo de campos de formulário ou banco de dados',
    ],
    commonMistakes: [
      'Medir sem espaços quando a plataforma os inclui na conta',
      'Assumir que todo emoji conta sempre como apenas 1 caractere',
    ],
  },
  faqs: [
    {
      id: 'cc-faq-1',
      question: 'Como contar caracteres em um texto?',
      answer:
        'Cole ou digite seu texto e os números atualizam na hora: total com espaços, sem espaços, palavras, frases e distribuição por tipo.',
    },
    {
      id: 'cc-faq-2',
      question: 'Espaços contam como caracteres?',
      answer:
        'Sim. Cada espaço entra na contagem total com espaços, adotada pela maioria das redes sociais (X, LinkedIn, Instagram) e meta tags.',
    },
    {
      id: 'cc-faq-3',
      question: 'Emoji conta como um caractere?',
      answer:
        'Varia conforme a codificação: muitas redes (como X em UTF-16) contam emojis comuns como 2 caracteres e sequências combinadas ainda mais.',
    },
    {
      id: 'cc-faq-4',
      question: 'Meu texto é enviado para algum lugar?',
      answer:
        'Não. Toda a contagem acontece em JavaScript local no navegador, sem servidor nem cadastro.',
    },
    {
      id: 'cc-faq-5',
      question: 'Qual a diferença entre caracteres com e sem espaços?',
      answer:
        'Com espaços soma todos os espaços, tabulações e quebras de linha; sem espaços ignora todo tipo de espaço em branco.',
    },
    {
      id: 'cc-faq-6',
      question: 'Quais são os limites das principais plataformas?',
      answer:
        'X/Twitter permite 280 caracteres, meta descrições ~160, SMS GSM-7 160 (70 em Unicode), Instagram 2.200 e LinkedIn 3.000.',
    },
    {
      id: 'cc-faq-7',
      question: 'Qual a diferença entre contagem de caracteres e bytes?',
      answer:
        'Caracteres contam símbolos visíveis; bytes medem espaço de armazenamento. Em UTF-8, acentos e emojis consomem de 2 a 4 bytes.',
    },
    {
      id: 'cc-faq-8',
      question: 'Como encaixar um texto em 280 caracteres?',
      answer:
        'Selecione a predefinição X/Twitter e corte advérbios ou expressões longas até ficar abaixo de 280 contando espaços e links.',
    },
    {
      id: 'cc-faq-9',
      question: 'Quebras de linha contam como caracteres?',
      answer:
        'Sim, cada quebra de linha soma 1 no total com espaços e é descartada no total sem espaços.',
    },
    {
      id: 'cc-faq-10',
      question: 'Posso conferir rascunhos ou prompts confidenciais com privacidade?',
      answer:
        'Sim. Toda a análise roda apenas na memória local do seu dispositivo sem envio a terceiros.',
    },
    {
      id: 'cc-faq-11',
      question: 'Contagem de caracteres é o mesmo que contagem de tokens?',
      answer:
        'Não. Esta ferramenta mede caracteres com e sem espaços e não calcula tokens de modelos de IA.',
    },
  ],
  guide: {
    title: 'Contar caracteres e limites de plataformas',
    description:
      'Diferença entre com/sem espaços, peso de emojis UTF-16, quebras de linha e comparação com bytes UTF-8.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Digite ou cole um texto acima para começar a contar.',
    sampleText:
      'Escreva ou cole seu rascunho aqui para testar ao vivo limites de 160 caracteres (meta descrição ou SMS) e 280 caracteres.',
    statCharacters: 'Caracteres (com espaços)',
    statNoSpaces: 'Sem espaços',
    statWords: 'Palavras',
    statSentences: 'Frases',
    statParagraphs: 'Parágrafos',
    statAvgWordLength: 'Tam. médio da palavra',
    btnDownloadReport: 'Baixar relatório',
    headingLimits: 'Limites de plataformas',
    ariaPresets: 'Predefinições de limite de caracteres',
    presetMetaDesc: 'Meta descrição (160)',
    headingBreakdown: 'Detalhamento de caracteres',
    limitRemainingTpl: '{chars} / {limit} caracteres, faltam {remaining} ({pct}%)',
    limitOverTpl: '{chars} / {limit} caracteres, {over} acima do limite',
    lblLetters: 'Letras',
    lblDigits: 'Dígitos',
    lblSpaces: 'Espaços',
    lblPunctuation: 'Pontuação',
    lblOther: 'Outros',
    nothingToDownload: 'Nenhum texto para baixar.',
    reportTitle: 'Relatório do Contador de Caracteres',
    reportActiveLimit: 'Limite ativo:',
    reportRemaining: 'Caracteres restantes:',
    reportGenerated: 'Gerado com ToyTools',
    reportDownloaded: 'Relatório baixado',
  },
};
