import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'css-minifier',
  name: 'Minificador e Formatador CSS',
  seoTitle: 'Minificador e Formatador CSS Online Grátis',
  description:
    'Minifique folhas CSS para produção ou expanda CSS compacto com recuo legível direto no navegador, vendo exatamente quantos bytes economizou.',
  tagline: 'Enxugue seu CSS para produção ou deixe CSS minificado legível de novo.',
  citation: {
    problem: 'Use este Minificador CSS quando precisar compactar ou reindentar uma folha de estilo sem enviá-la a servidores.',
    nonGoal: 'adicionar prefixos automáticos, transpilar ou mesclar regras duplicadas.',
  },
  knowledge: {
    primaryConcepts: ['minificação CSS', 'beautifier CSS'],
    realWorldUseCases: [
      'Enxugar CSS escrito à mão antes de incorporar em produção',
      'Expandir um arquivo CSS minificado de terceiros para depurar uma regra',
      'Medir quantos bytes comentários e espaços ocupam no arquivo',
    ],
    commonMistakes: [
      'Esperar remoção de regras CSS não usadas sem analisar o HTML',
      'Minificar a única cópia editável do seu CSS sem guardar o original',
    ],
  },
  faqs: [
    {
      id: 'css-min-1',
      question: 'O que a minificação de CSS remove?',
      answer:
        'Comentários e espaços em branco dispensáveis fora de strings entre aspas e `url()`. Seletores, variáveis CSS e expressões `calc()` ficam intactos.',
    },
    {
      id: 'css-min-2',
      question: 'O que a minificação não remove com segurança?',
      answer:
        'Regras não usadas, mesclagem de seletores repetidos ou abreviação de cores. Isso exige ferramentas de build que leiam todo o HTML do projeto.',
    },
    {
      id: 'css-min-3',
      question: 'O que o modo Formatar (Beautify) faz?',
      answer:
        'Expande o CSS compacto adicionando recuo de dois espaços e quebra de linha após cada ponto e vírgula e chave para leitura e edição fáceis.',
    },
    {
      id: 'css-min-4',
      question: 'Meu código CSS é enviado a algum servidor?',
      answer:
        'Não. Toda a leitura léxica, compactação e formatação acontece dentro do seu navegador.',
    },
    {
      id: 'css-min-5',
      question: 'Minificar altera a aparência da página?',
      answer:
        'Em folhas CSS comuns, não, pois espaços entre tokens não mudam o visual.',
    },
    {
      id: 'css-min-6',
      question: 'Ele lida com @media e regras aninhadas?',
      answer:
        'Sim no nível de tokens: abre e fecha blocos perfeitamente ao minificar ou formatar.',
    },
    {
      id: 'css-min-7',
      question: 'Por que mostrar quantos bytes foram economizados?',
      answer:
        'Para saber se vale publicar o corte: arquivos pequenos mudam pouco após gzip, enquanto CSS extensos cheios de comentários caem em quilobytes.',
    },
    {
      id: 'css-min-8',
      question: 'Quando não devo minificar CSS?',
      answer:
        'Enquanto ainda edita o código manualmente ou se seu pipeline de build (Vite, Webpack) já minifica automaticamente ao publicar.',
    },
  ],
  guide: {
    title: 'Minificador CSS: compacte ou formate folhas de estilo',
    description: 'Como funcionam minificação e formatação CSS no navegador, o que é preservado e boas práticas.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada CSS',
    placeholder: 'Cole seu CSS aqui',
    emptyOutput: 'Cole um código CSS à esquerda para formatar ou minificar.',
    validLabel: 'CSS processado',
    invalidLabel: 'Erro CSS',
    loadError: 'Não foi possível carregar o processador CSS.',
    modeBeautify: 'Formatar',
    modeMinify: 'Minificar',
    modeAriaLabel: 'Modo',
    toolNote: 'Ao minificar, o status informa quantos bytes foram removidos.',
    insight:
      'Minificar remove comentários e espaços desnecessários para diminuir o envio; Formatar expande CSS compacto com recuo limpo.',
    technical: [
      { term: 'Minificar', detail: 'Remove comentários e contrai espaços fora de strings e url()' },
      { term: 'Formatar', detail: 'Indenta blocos com dois espaços mantendo strings e url()' },
      { term: 'Seguro', detail: 'Não reescreve seletores nem altera cálculos calc()' },
      { term: 'Privacidade', detail: 'Roda localmente no seu navegador sem envios' },
    ],
    engine: {
      savedBytesTpl: 'Economizados {saved} bytes ({before} → {after}).',
      errCss: 'Falha ao processar o CSS.',
    },
  },
};
