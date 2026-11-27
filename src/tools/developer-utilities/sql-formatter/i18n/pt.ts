import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'sql-formatter',
  name: 'Formatador de SQL',
  seoTitle: 'Formatador de SQL Online – Formatar Queries Grátis',
  description:
    'Formate consultas SQL em uma linha com palavras-chave em maiúsculas e cláusulas indentadas direto no navegador, sem enviar senhas ou queries.',
  tagline: 'Organize SQL confuso com cláusulas alinhadas e indentação limpa.',
  citation: {
    problem: 'Use este Formatador de SQL quando uma consulta em uma linha precisar ficar legível sem envio para servidores.',
    nonGoal: 'executar a consulta em um banco de dados ou reescrever sua lógica.',
  },
  knowledge: {
    primaryConcepts: ['formatação SQL'],
    realWorldUseCases: [
      'Limpar uma query em linha única copiada de logs da aplicação',
      'Deixar JOINs extensos legíveis antes de uma revisão de código',
      'Inspecionar consultas de chamados sem enviar credenciais a sites terceiros',
    ],
    commonMistakes: [
      'Colar consultas com senhas ou chaves de API em formatadores que enviam ao servidor',
      'Esperar que o formatador otimize o plano de execução do banco',
    ],
  },
  faqs: [
    {
      id: 'sql-fmt-1',
      question: 'O que o Formatador de SQL altera?',
      answer:
        'Apenas o layout. Palavras-chave vão para maiúsculas, cada cláusula principal ganha sua própria linha e listas entre parênteses recebem recuo de dois espaços. Strings, comentários, números e identificadores permanecem idênticos.',
    },
    {
      id: 'sql-fmt-2',
      question: 'Quais dialetos SQL ele entende?',
      answer:
        'Cobre as palavras-chave comuns de PostgreSQL, MySQL e SQLite (SELECT, tipos de JOIN, GROUP BY, ORDER BY, WITH, RETURNING, strings com cifrão). Extensões incomuns permanecem intactas.',
    },
    {
      id: 'sql-fmt-3',
      question: 'Minha consulta é enviada para algum servidor?',
      answer:
        'Não. Toda a formatação roda localmente no navegador; nada sai da aba e continua funcionando até offline.',
    },
    {
      id: 'sql-fmt-4',
      question: 'Por que evitar colar queries com credenciais em sites que fazem upload?',
      answer:
        'Muitos formatadores enviam o texto para um backend e podem gravar senhas, tokens ou strings de conexão em logs alheios. Prefira sempre processamento local no navegador.',
    },
    {
      id: 'sql-fmt-5',
      question: 'O que acontece se faltar fechar uma aspa?',
      answer:
        'O formatador para imediatamente e informa qual aspa (simples, dupla ou crase) ficou aberta, sem tentar adivinhar o fechamento.',
    },
    {
      id: 'sql-fmt-6',
      question: 'Ele também minifica SQL?',
      answer:
        'Esta ferramenta faz formatação legível (pretty-print). Primeiro organize para revisar com segurança antes de compactar se precisar pôr em log.',
    },
    {
      id: 'sql-fmt-7',
      question: 'Formatar muda a forma como a query executa?',
      answer:
        'Não. Espaços e maiúsculas de palavras reservadas não alteram a execução nem os valores das strings.',
    },
    {
      id: 'sql-fmt-8',
      question: 'O que acontece com comentários `--` ou `/* ... */`?',
      answer:
        'Todos os comentários de linha e de bloco são preservados exatamente nas suas linhas sem nunca serem apagados.',
    },
  ],
  guide: {
    title: 'Formatador de SQL: queries legíveis sem upload',
    description: 'Como funciona a formatação SQL local, dialetos cobertos e alerta automático de segredos.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada SQL',
    placeholder: 'Cole seu SQL aqui',
    emptyOutput: 'Cole uma consulta SQL à esquerda para formatar.',
    validLabel: 'SQL válido',
    invalidLabel: 'Erro de SQL',
    loadError: 'Não foi possível carregar o processador SQL.',
    toolNote: 'Senhas ou chaves de API entre aspas geram um alerta antes de copiar para compartilhamento.',
    insight:
      'Coloca palavras-chave SQL em maiúsculas e separa cada cláusula em uma nova linha mantendo strings, comentários e nomes preservados.',
    technical: [
      { term: 'Operação', detail: 'Tokeniza, converte palavras-chave em maiúsculas e indenta cláusulas' },
      { term: 'Dialetos', detail: 'Palavras-chave comuns de Postgres, MySQL e SQLite' },
      { term: 'Preservado', detail: 'Strings, comentários -- e /* */, números e identificadores' },
      { term: 'Erros', detail: 'Reporta aspas sem fechamento sem adivinhar' },
      { term: 'Privacidade', detail: 'Roda no navegador com alerta para possíveis credenciais' },
    ],
    engine: {
      warnSecret: 'Esta consulta parece conter uma senha ou segredo entre aspas. Tudo roda apenas no navegador, mas evite copiar credenciais para links públicos.',
      errTooLargeTpl: 'O SQL ultrapassa {max} caracteres. Reduza antes de formatar.',
      errUnclosedTpl: 'String com aspas {name} não fechada. Adicione o {q} faltante e tente novamente.',
      quoteNames: { single: 'simples', double: 'duplas', backtick: 'crase (backtick)' },
    },
  },
};
