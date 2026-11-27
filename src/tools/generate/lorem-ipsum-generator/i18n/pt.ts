import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'lorem-ipsum-generator',
  name: 'Gerador de Lorem Ipsum',
  seoTitle: 'Gerador de Lorem Ipsum – Texto de Preenchimento',
  description:
    'Gere texto Lorem Ipsum por parágrafos, frases ou palavras direto no navegador. Saída em texto puro sem HTML, com contagem de palavras e caracteres.',
  tagline: 'Texto de preenchimento por parágrafos, frases ou palavras.',
  craft: {
    solves:
      'Muitos usuários se perguntam se o texto fictício tem sentido oculto; a ferramenta situa a origem clássica na obra de Cícero.',
  },
  knowledge: {
    primaryConcepts: ['lorem ipsum', 'texto de preenchimento'],
    realWorldUseCases: [
      'Preencher protótipos e layouts antes de existir o texto final',
      'Testar como componentes lidam com textos curtos ou longos',
      'Demonstrar temas e templates editoriais com proporção realista',
      'Avaliar tipografia, entrelinha e largura de coluna em layouts',
    ],
    commonMistakes: [
      'Publicar texto Lorem Ipsum por engano em produção',
      'Usar texto fictício quando o conteúdo real mudaria o design',
      'Achar que o latim adaptado transmite uma mensagem secreta',
      'Gerar blocos bem maiores do que a interface precisa',
    ],
  },
  fields: {
    unit: {
      label: 'Unidade',
      options: { paragraphs: 'Parágrafos', sentences: 'Frases', words: 'Palavras' },
    },
    count: { label: 'Quantidade' },
    startWithLorem: { label: 'Começar com "Lorem ipsum"', group: 'Opções' },
  },
  faqs: [
    {
      id: 'lorem-ipsum-generator-faq-1',
      question: 'O que é Lorem Ipsum?',
      answer:
        'É o texto padrão de preenchimento usado em design e tipografia para testar layouts antes da redação final, evitando que o leitor se distraia com o conteúdo.',
    },
    {
      id: 'lorem-ipsum-generator-faq-2',
      question: 'Como usar este gerador?',
      answer:
        'Escolha entre parágrafos, frases ou palavras, defina a quantidade e decida se deseja iniciar com "Lorem ipsum dolor sit amet". Depois clique em Copiar.',
    },
    {
      id: 'lorem-ipsum-generator-faq-3',
      question: 'De onde vem o Lorem Ipsum?',
      answer:
        'Foi adaptado de um tratado filosófico escrito pelo autor romano Cícero em 45 a.C. e embaralhado por tipógrafos séculos depois como texto neutro.',
    },
    {
      id: 'lorem-ipsum-generator-faq-4',
      question: 'Por que usar texto de preenchimento?',
      answer:
        'Textos reais atraem atenção para o significado. O Lorem Ipsum permite avaliar espaçamento, fontes, alinhamento e ritmo visual com imparcialidade.',
    },
    {
      id: 'lorem-ipsum-generator-faq-5',
      question: 'O texto Lorem Ipsum tem algum significado?',
      answer:
        'Não em sentido literal. Apesar das raízes latinas, a passagem foi embaralhada para funcionar apenas como massa de texto visual.',
    },
    {
      id: 'lorem-ipsum-generator-faq-6',
      question: 'Posso gerar apenas palavras ou frases em vez de parágrafos?',
      answer:
        'Sim. Mude a unidade para Palavras ou Frases e informe a quantidade exata desejada.',
    },
    {
      id: 'lorem-ipsum-generator-faq-7',
      question: 'Para que serve a opção "Começar com Lorem ipsum"?',
      answer:
        'Quando ligada, abre com o clássico "Lorem ipsum dolor sit amet". Desligada, varia desde a primeira palavra para blocos menos repetitivos.',
    },
    {
      id: 'lorem-ipsum-generator-faq-8',
      question: 'Funciona sem conexão com a internet?',
      answer:
        'Sim. Depois de carregada, toda a geração roda localmente em JavaScript no navegador sem envio de dados.',
    },
    {
      id: 'lorem-ipsum-generator-faq-9',
      question: 'Quanto texto consigo gerar de uma vez?',
      answer:
        'Até 100 unidades por geração: 100 parágrafos, 100 frases ou 100 palavras.',
    },
    {
      id: 'lorem-ipsum-generator-faq-10',
      question: 'O resultado vem em texto puro?',
      answer:
        'Sim, sem tags HTML nem formatação oculta, separando parágrafos por linhas em branco.',
    },
    {
      id: 'lorem-ipsum-generator-faq-11',
      question: 'Consigo copiar o texto com um clique?',
      answer:
        'Sim. Basta clicar em Copiar para enviar o bloco completo para a área de transferência.',
    },
    {
      id: 'lorem-ipsum-generator-faq-12',
      question: 'O texto sai igual toda vez?',
      answer:
        'Não. As palavras e o tamanho das frases mudam aleatoriamente a cada nova geração.',
    },
    {
      id: 'lorem-ipsum-generator-faq-13',
      question: 'Quando não devo usar Lorem Ipsum?',
      answer:
        'Quando títulos longos ou textos reais curtos possam alterar decisões de interface, e nunca deixe texto fictício no site publicado.',
    },
    {
      id: 'lorem-ipsum-generator-faq-14',
      question: 'Qual a diferença para palavras aleatórias em português?',
      answer:
        'Palavras conhecidas distraem porque o cérebro tenta lê-las. O pseudo-latim mantém aparência de texto corrido sem competir pela atenção.',
    },
    {
      id: 'lorem-ipsum-generator-faq-15',
      question: 'Posso usar em projetos comerciais?',
      answer:
        'Sim. Não possui direitos autorais e é livre para mockups e apresentações a clientes.',
    },
    {
      id: 'lorem-ipsum-generator-faq-16',
      question: 'Por que alguns designers evitam texto falso?',
      answer:
        'Porque textos equilibrados demais podem esconder falhas de layout que só aparecem com o copy real.',
    },
    {
      id: 'lorem-ipsum-generator-faq-17',
      question: 'Posso gerar apenas um parágrafo?',
      answer:
        'Sim. Deixe a unidade em Parágrafos e a quantidade em 1.',
    },
    {
      id: 'lorem-ipsum-generator-faq-18',
      question: 'A ferramenta salva minhas preferências?',
      answer:
        'Apenas suas escolhas de unidade e quantidade ficam no navegador, nunca o texto gerado.',
    },
    {
      id: 'lorem-ipsum-generator-faq-19',
      question: 'Em quais navegadores funciona?',
      answer:
        'Em todos os navegadores modernos de computador e celular sem dependências externas.',
    },
    {
      id: 'lorem-ipsum-generator-faq-20',
      question: 'Posso gerar um número exato de caracteres?',
      answer:
        'Você escolhe por palavras, frases ou parágrafos e acompanha a contagem exata de caracteres exibida na hora.',
    },
    {
      id: 'lorem-ipsum-generator-faq-21',
      question: 'Serve bem para testar fontes e tipografia?',
      answer:
        'Sim, seu ritmo natural de palavras facilita avaliar legibilidade, peso de fonte e altura de linha.',
    },
    {
      id: 'lorem-ipsum-generator-faq-22',
      question: 'Algum dado é enviado ou compartilhado?',
      answer:
        'Não. Tudo acontece no seu navegador sem contas ou servidores.',
    },
  ],
  guide: {
    title: 'O que é Lorem Ipsum e como usar em design',
    description:
      'Origem histórica em Cícero, benefícios em testes de tipografia e quando substituir texto fictício por conteúdo real.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Escolha unidade e quantidade para gerar texto.',
    engine: {
      metaWords: 'Palavras',
      metaChars: 'Caracteres',
    },
  },
};
