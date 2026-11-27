import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'json-minifier',
  name: 'Minificador de JSON',
  seoTitle: 'Minificador de JSON Online – Compactar JSON Grátis',
  description:
    'Minifique e compacte JSON online removendo espaços em branco no navegador. Preserva números grandes e decimais exatos sem enviar dados a servidores.',
  tagline: 'Remova espaços em branco do JSON para reduzir o tamanho do arquivo.',
  knowledge: {
    primaryConcepts: ['minificação JSON'],
    realWorldUseCases: [
      'Reduzir o tamanho de respostas JSON em APIs de produção',
      'Compactar arquivos JSON estáticos servidos via HTTP',
      'Enxugar configurações empacotadas na etapa de build',
    ],
    commonMistakes: [
      'Minificar JSON salvo no Git tornando o diff ilegível',
      'Tentar minificar arquivos que contêm comentários JSONC ou JSON5',
    ],
  },
  faqs: [
    {
      id: 'json-min-faq-1',
      question: 'O que a minificação de JSON faz?',
      answer:
        'Remove todos os espaços, tabulações e quebras de linha não significativos entre tokens JSON sem alterar nenhum dado. `{ "a": 1 }` e `{"a":1}` são idênticos para qualquer parser, porém menores em bytes.',
    },
    {
      id: 'json-min-faq-2',
      question: 'Quanto a minificação reduz o tamanho do JSON?',
      answer:
        'Depende de quanta indentação havia antes. Um JSON bem indentado costuma encolher de 20% a 40%, somando economia extra quando enviado com compressão gzip ou Brotli.',
    },
    {
      id: 'json-min-faq-3',
      question: 'O JSON minificado continua válido?',
      answer:
        'Sim. A especificação oficial RFC 8259 ignora espaços entre tokens; qualquer parser padrão lê a versão compacta exatamente igual.',
    },
    {
      id: 'json-min-faq-4',
      question: 'Posso formatar de volta o JSON minificado?',
      answer:
        'Sim, é totalmente reversível. Cole o JSON minificado no Formatador de JSON para recuperar a indentação sem perda de precisão nos dados.',
    },
    {
      id: 'json-min-faq-5',
      question: 'Quando devo minificar JSON?',
      answer:
        'Ao otimizar tráfego e armazenamento em produção (respostas de API, arquivos estáticos e bundles). Durante o desenvolvimento e no Git, prefira JSON formatado.',
    },
    {
      id: 'json-min-faq-6',
      question: 'Qual a diferença entre minificação e gzip?',
      answer:
        'Minificar remove espaços em nível de texto; gzip ou Brotli comprimem os bytes enviados pela rede. Aplicando minificação primeiro, o compressor trabalha melhor.',
    },
    {
      id: 'json-min-faq-7',
      question: 'Minificar altera a ordem das chaves ou a estrutura?',
      answer:
        'Não. Ordem das chaves, tipos e valores ficam idênticos; apenas espaços externos desaparecem.',
    },
    {
      id: 'json-min-faq-8',
      question: 'A minificação remove comentários do JSON?',
      answer:
        'JSON padrão não aceita comentários. Arquivos com comentários (JSONC/JSON5) acusam erro até que os comentários sejam removidos.',
    },
    {
      id: 'json-min-faq-9',
      question: 'Preciso minificar respostas da minha API manualmente?',
      answer:
        'Normalmente não, porque frameworks e `JSON.stringify(data)` sem terceiro argumento já produzem saída compacta por padrão.',
    },
    {
      id: 'json-min-faq-10',
      question: 'Minificar pode arredondar IDs longos ou preços como 19.90?',
      answer:
        'Não. A ferramenta apenas apaga espaços entre os tokens originais, copiando tudo caractere por caractere: IDs de 64 bits não são arredondados e 19.90 mantém o zero final.',
    },
  ],
  guide: {
    title: 'O que é minificação JSON e quando usar',
    description: 'Entenda como a minificação reduz o payload, como combina com gzip e preserva números exatos.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Cole seu JSON aqui',
    emptyOutput: 'Cole um JSON à esquerda para minificar.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON inválido',
    appliedPrefix: 'Correção aplicada:',
    loadError: 'Não foi possível carregar o processador JSON.',
    moreAboutHeading: 'Como funciona o Minificador de JSON',
    insight:
      'Minificar remove todo espaço em branco desnecessário produzindo o menor JSON válido possível, mantendo intactos os valores originais.',
    technical: [
      { term: 'Operação', detail: 'Copia tokens originais sem espaços e sem resserialização' },
      { term: 'Uso', detail: 'Reduzir respostas de API, configurações e pacotes' },
      { term: 'Dados', detail: 'Intactos: inteiros grandes, 1.0, 1e5, escapes e ordem mantidos' },
      { term: 'Chaves duplicadas', detail: 'Preservadas com aviso explícito' },
    ],
    engine: {
      repairBoth: 'Corrigir aspas tipográficas e vírgula final',
      repairQuotes: 'Substituir aspas tipográficas',
      repairComma: 'Remover vírgula final',
    },
  },
};
