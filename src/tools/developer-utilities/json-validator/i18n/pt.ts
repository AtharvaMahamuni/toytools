import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'json-validator',
  name: 'Validador de JSON',
  seoTitle: 'Validador de JSON Online – Verificar Sintaxe Grátis',
  description:
    'Valide sintaxe JSON (RFC 8259) na hora direto no navegador. Encontre vírgulas finais, aspas simples e erros exatos sem enviar dados.',
  tagline: 'Verifique a sintaxe JSON e descubra exatamente onde o código quebra.',
  knowledge: {
    primaryConcepts: ['validação JSON'],
    realWorldUseCases: [
      'Diagnosticar um erro 400 "JSON inválido" em chamadas de API',
      'Conferir arquivos package.json ou tsconfig.json editados manualmente',
      'Validar payloads de webhooks copiados de registros do servidor',
      'Detectar falhas sintáticas em arquivos JSON antes do deploy',
    ],
    commonMistakes: [
      'Deixar vírgula sobrando após o último elemento de um objeto ou array',
      'Confundir validação de sintaxe com validação de JSON Schema',
    ],
  },
  faqs: [
    {
      id: 'json-val-faq-1',
      question: 'O que a validação de JSON faz?',
      answer:
        'Verifica se o texto segue rigorosamente a especificação JSON (RFC 8259). Se estiver correto confirma a validade; se falhar, mostra o erro exato e sua posição.',
    },
    {
      id: 'json-val-faq-2',
      question: 'Quais são os erros de sintaxe JSON mais comuns?',
      answer:
        'Vírgula final após o último item, aspas simples no lugar de duplas, chaves sem aspas, comentários e valores do JavaScript como `undefined`, `NaN` ou `Infinity`.',
    },
    {
      id: 'json-val-faq-3',
      question: 'Qual a diferença entre JSON e um objeto JavaScript literal?',
      answer:
        'JSON é muito mais rígido. No JavaScript você pode omitir aspas nas chaves, usar aspas simples, colocar vírgula final e comentários; no JSON tudo exige aspas duplas e zero comentários.',
    },
    {
      id: 'json-val-faq-4',
      question: 'Por que vírgulas finais são inválidas no JSON?',
      answer:
        'Para manter a gramática simples e sem ambiguidade (`[1, 2, 3,]`). JavaScript e TypeScript aceitam vírgula final, mas o padrão JSON a rejeita.',
    },
    {
      id: 'json-val-faq-5',
      question: 'Por que o JSON não aceita comentários?',
      answer:
        'Douglas Crockford excluiu comentários propositalmente para que JSON continuasse um formato puro de troca de dados. Quando precisar comentar arquivos de configuração, use JSONC ou JSON5.',
    },
    {
      id: 'json-val-faq-6',
      question: 'Qual a diferença entre validação sintática e JSON Schema?',
      answer:
        'A sintaxe valida chaves, colchetes e aspas pela RFC 8259. Já o JSON Schema verifica regras de negócio (campos obrigatórios, tipos, faixas numéricas) em um JSON já bem formado.',
    },
    {
      id: 'json-val-faq-7',
      question: 'Meu objeto JS funciona, mas JSON.parse falha. Por quê?',
      answer:
        'Geralmente porque o trecho não veio de `JSON.stringify`, mas foi copiado de logs ou console contendo aspas simples, chaves sem aspas ou `undefined`.',
    },
    {
      id: 'json-val-faq-8',
      question: 'JSONC ou JSON5 contam como JSON válido?',
      answer:
        'Não. São formatos estendidos com comentários e vírgulas finais (como nas configs do VS Code) que falham em qualquer parser JSON padrão.',
    },
    {
      id: 'json-val-faq-9',
      question: 'Um objeto JSON pode ter chaves duplicadas?',
      answer:
        'A especificação recomenda evitar chaves repetidas. Como cada parser escolhe arbitrariamente o primeiro ou o último valor, o ideal é eliminar duplicatas.',
    },
  ],
  guide: {
    title: 'Como validar JSON e corrigir erros de sintaxe',
    description: 'Regras RFC 8259, vírgulas sobrando, aspas simples e diferença para JSON Schema.',
    readMinutes: 5,
  },
  ui: {
    inputLabel: 'Entrada JSON',
    placeholder: 'Cole seu JSON aqui',
    emptyOutput: 'Cole um JSON para validar a sintaxe.',
    validLabel: 'JSON válido',
    invalidLabel: 'JSON inválido',
    appliedPrefix: 'Correção aplicada:',
    loadError: 'Não foi possível carregar o processador JSON.',
    moreAboutHeading: 'Como funciona o Validador de JSON',
    insight:
      'Analisa a entrada conforme a especificação RFC 8259 e aponta o primeiro erro sintático com correção automática para vírgulas finais e aspas tipográficas.',
    technical: [
      { term: 'Padrão', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Verifica', detail: 'Sintaxe e estrutura' },
      { term: 'Não verifica', detail: 'Esquemas JSON Schema, tipos de domínio ou campos obrigatórios' },
      { term: 'Saída', detail: 'Válido ou primeiro erro com posição' },
    ],
    engine: {
      validJsonOut: 'JSON válido',
      repairBoth: 'Corrigir aspas tipográficas e vírgula final',
      repairQuotes: 'Substituir aspas tipográficas',
      repairComma: 'Remover vírgula final',
    },
  },
};
