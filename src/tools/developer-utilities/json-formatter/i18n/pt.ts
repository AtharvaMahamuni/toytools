import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'json-formatter',
  name: 'Formatador de JSON',
  seoTitle: 'Formatador de JSON Online – Embelezar JSON Grátis',
  description:
    'Formate e idente JSON online com clareza no navegador. Transforme payloads compactados em blocos legíveis preservando números grandes e chaves. Privado.',
  tagline: 'Transforme JSON compacto em estrutura legível com indentação direto no navegador.',
  citation: {
    problem:
      'Use este Formatador de JSON quando precisar formatar ou inspecionar código JSON sem enviá-lo a nenhum servidor.',
    nonGoal: 'chamar um modelo de IA nem interpretar o significado dos dados.',
  },
  knowledge: {
    primaryConcepts: ['formatador json', 'identar json', 'pretty print'],
    realWorldUseCases: [
      'Depurar a resposta minificada de uma API durante o desenvolvimento',
      'Ler arquivos de configuração compactados com clareza visual',
      'Inspecionar payloads de webhooks copiados de logs de servidor',
      'Padronizar arquivos JSON antes de comparar diffs no controle de versão',
    ],
    commonMistakes: [
      'Tentar formatar JSON com erro de sintaxe sem corrigir vírgulas ou aspas antes',
      'Servir JSON formatado com espaços extras em rotas de alta vazão em produção',
    ],
  },
  faqs: [
    {
      id: 'json-fmt-faq-1',
      question: 'Como formatar JSON online?',
      answer:
        'Cole seu JSON na caixa de entrada e o formatador organiza o código na hora. Se for válido, aparece com recuo e quebras de linha; se houver erro de sintaxe, mostra a linha e posição exatas. Nada sai do seu navegador.',
    },
    {
      id: 'json-fmt-faq-2',
      question: 'O que um formatador JSON faz exatamente?',
      answer:
        'Ele recebe um JSON válido e o reescreve com recuo uniforme e quebras de linha para leitura humana. Chaves, valores, ordem e precisão numérica permanecem exatamente iguais.',
    },
    {
      id: 'json-fmt-faq-3',
      question: 'Formatar JSON muda os dados ou o significado?',
      answer:
        'Não. Espaços em branco fora de strings não têm significado no JSON. `{"a":1}` e sua versão identada em várias linhas representam exatamente os mesmos dados para qualquer parser.',
    },
    {
      id: 'json-fmt-faq-4',
      question: 'Qual a diferença entre formatar e minificar JSON?',
      answer:
        'São operações inversas. Formatar adiciona espaços e quebras de linha para leitura humana; minificar remove todo espaço desnecessário para diminuir o tamanho do arquivo na rede.',
    },
    {
      id: 'json-fmt-faq-5',
      question: 'Qual a diferença entre formatar e validar JSON?',
      answer:
        'Formatar aplica recuo visual a um JSON válido. Validar verifica se o texto obedece à sintaxe oficial e aponta o primeiro erro encontrado.',
    },
    {
      id: 'json-fmt-faq-6',
      question: 'Este formatador JSON é privado?',
      answer:
        'Sim. Toda a formatação roda localmente no navegador com JavaScript; seu JSON nunca é enviado ou armazenado em servidor externo.',
    },
    {
      id: 'json-fmt-faq-7',
      question: 'Qual nível de indentação devo usar?',
      answer:
        'Dois espaços é o padrão mais comum em JavaScript e APIs web, enquanto quatro espaços aparece bastante em projetos Python. Tecnicamente, qualquer parser interpreta igual.',
    },
    {
      id: 'json-fmt-faq-8',
      question: 'Por que respostas de API vêm tudo em uma única linha?',
      answer:
        'A maioria das APIs devolve JSON minificado (sem espaços nem quebras de linha) para economizar banda e acelerar respostas. Colar aqui devolve a leitura instantânea.',
    },
    {
      id: 'json-fmt-faq-9',
      question: 'O que significa "pretty-print" em JSON?',
      answer:
        'Pretty-print significa imprimir em formato legível para humanos com recuo e quebras de linha por nível hierárquico.',
    },
    {
      id: 'json-fmt-faq-10',
      question: 'Posso formatar JSON sem fazer upload de arquivos?',
      answer:
        'Sim. O ToyTools processa o texto diretamente no dispositivo sem envio de arquivo nem login.',
    },
    {
      id: 'json-fmt-faq-11',
      question: 'Esta ferramenta usa inteligência artificial?',
      answer:
        'Não. É um utilitário sintático e determinístico que jamais envia seus dados para ChatGPT, Claude ou Gemini.',
    },
    {
      id: 'json-fmt-faq-12',
      question: 'Serve para inspecionar JSON gerado por um chatbot?',
      answer:
        'Sim. Cole o bloco retornado para checar chaves, vírgulas sobrando e copiar a versão organizada com privacidade.',
    },
    {
      id: 'json-fmt-faq-13',
      question: 'Ele preserva números grandes, casas decimais exatas e chaves duplicadas?',
      answer:
        'Sim. A ferramenta reindenta seus tokens originais sem reconstruir objetos em JavaScript, evitando arredondamento de inteiros acima de 2^53 ou mudança de 1.0 para 1, além de avisar caso existam chaves repetidas.',
    },
  ],
  guide: {
    title: 'O que é formatação JSON e como usar',
    description: 'Como funciona o formatador JSON, pretty-print vs. minificação e preservação fiel de números e chaves.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Cole seu JSON aqui',
    emptyOutput: 'Cole um JSON à esquerda para formatá-lo.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON inválido',
    appliedPrefix: 'Correção aplicada:',
    loadError: 'Não foi possível carregar o processador JSON.',
    moreAboutHeading: 'Como funciona o Formatador de JSON',
    insight:
      'Formatar (pretty-print) adiciona recuo uniforme e quebras de linha sem alterar nenhum valor nem perder precisão em números longos.',
    technical: [
      { term: 'Padrão', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Operação', detail: 'Reindenta os tokens originais com 2 espaços sem resserializar valores' },
      { term: 'Dados', detail: 'Intactos: inteiros grandes, 1.0, 1e5, escapes e ordem de chaves preservados' },
      { term: 'Chaves duplicadas', detail: 'Mantidas como digitadas, acompanhadas de aviso' },
      { term: 'Erros', detail: 'Indica o primeiro problema sintático com posição exata' },
    ],
  },
};
