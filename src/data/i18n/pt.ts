import type { SiteUiStrings } from '@lib/i18n/types';

export const PT_UI: SiteUiStrings = {
  locale: 'pt',
  nav: {
    home: 'ToyTools',
    homeAria: 'Início ToyTools',
    searchPlaceholder: 'Buscar ferramentas',
    searchAria: 'Buscar ferramentas',
    changelogAria: 'ver histórico de alterações',
    languageLabel: 'Idioma',
    languageAria: 'Selecionar idioma',
    themeLabel: 'Tema',
  },
  footer: {
    lightweight: 'Leve',
    lightweightTip: 'Carrega rápido, sem complexidade extra. Feito para resolver tarefas na hora.',
    privateLabel: 'Privado',
    privacyByVariant: {
      private: 'O que você digita permanece no seu dispositivo.',
      offline: 'Funciona offline após o primeiro carregamento.',
      local: 'Sem nuvem nem sincronização. Seus dados ficam neste aparelho.',
      lookup: 'Seu navegador consulta um serviço de eco IP. O ToyTools nunca vê a resposta.',
    },
    contactAndFeedback: 'Contato e feedback',
    platform: 'Plataforma',
    about: 'Sobre',
    privacy: 'Privacidade',
    terms: 'Termos',
    changelog: 'Mudanças',
    settings: 'Configurações',
    shortcuts: 'Atalhos',
    siteInfoAria: 'Informações do site',
    madeBy: 'Criado por',
  },
  tool: {
    moreAbout: 'Mais informações',
    moreAboutAria: 'Mais sobre {name}',
    usesOf: 'Usos de {concept}',
    pitfallsOf: 'Erros comuns em {concept}',
    questionsOf: 'Perguntas sobre {concept}',
    relatedTo: 'Ferramentas ligadas a {concept}',
    allCategory: 'Ver tudo em {category}',
    methodPrefix: 'Método',
    poweredBy: 'Com tecnologia ToyTools',
    poweredByTitle: 'Como esta ferramenta funciona',
    clearSavedInput: 'Limpar entrada salva',
    guideFallback: 'Guia',
    favoriteAria: 'Salvar nos favoritos',
    installLabel: 'Instalar',
    currency: 'BRL',
  },
  guide: {
    openTool: 'Abrir ferramenta',
    backToTool: 'Abrir {name}',
    readTimeSuffix: 'min de leitura',
    updatedPrefix: 'Atualizado em',
    inCategory: 'Categoria',
    relatedHeading: 'Ferramentas relacionadas',
  },
  category: {
    toolCountSingular: 'ferramenta',
    toolCountPlural: 'ferramentas',
    guidesHeading: 'Guias desta categoria',
    toolsHeading: 'Todas as ferramentas',
    builtOn: 'Baseado em',
  },
  home: {
    title: 'Ferramentas Online Grátis: Calcular, Converter e Formatar',
    description:
      'Utilitários web gratuitos e leves para texto, cálculos, datas, código, design e produtividade. Tudo roda direto no seu dispositivo.',
    h1: 'Ferramentas online rápidas e privadas',
    subtitle: 'Utilitários gratuitos executados direto no navegador. Seus dados ficam no aparelho.',
    browseCategories: 'Explorar categorias',
    featuredTools: 'Ferramentas populares',
    viewAll: 'Ver todas',
  },
  titles: {
    home: 'Ferramentas Online Grátis: Calcular, Converter e Formatar',
    guideSuffix: 'Guia',
    faqSuffix: 'Perguntas frequentes',
    search: 'Buscar',
    platform: 'A plataforma por trás das ferramentas',
    feedback: 'Contato e feedback',
    privacy: 'Privacidade',
    terms: 'Termos de uso',
    about: 'Sobre',
    changelog: 'Histórico de alterações',
    settings: 'Configurações',
    offline: 'Offline',
    notFound: 'Página não encontrada',
  },
  categories: {
    'text-utilities': {
      name: 'Utilitários de Texto',
      description: 'Conte palavras e caracteres, compare textos, limpe espaços e converta formatos no navegador.',
      tagline: 'Contar, converter, limpar e comparar texto.',
      intro: [
        'Ferramentas práticas de texto resolvem três tarefas distintas: contar palavras, caracteres e tempo de leitura; transformar maiúsculas, minúsculas ou slugs; e limpar espaços extras ou caracteres invisíveis.',
        'Cada contador deixa explícitas as regras usadas em limites de redes sociais, SEO ou redação acadêmica, mantendo todo o processamento no seu navegador.',
      ],
    },
    'number-utilities': {
      name: 'Utilitários Numéricos',
      description: 'Calcule porcentagens, descontos, gorjetas, margens e contas científicas rapidamente.',
      tagline: 'Porcentagens, descontos, margens e contas rápidas.',
      intro: [
        'Operações do dia a dia como descontos, variação percentual, gorjetas, impostos e markup mostradas com fórmula transparente e passo a passo claro.',
      ],
    },
    'developer-utilities': {
      name: 'Utilitários para Desenvolvedores',
      description: 'Formate JSON, SQL e XML, codifique Base64 e URLs, gere hashes SHA-256 e inspecione tokens.',
      tagline: 'Formatar, codificar, validar e gerar hashes.',
      intro: [
        'Reúne tarefas essenciais de desenvolvimento: identação e validação de JSON, SQL e XML, codificação Base64, URL e entidades HTML, além de geração local de hashes SHA-256.',
        'Nenhuma carga útil ou chave sai do seu navegador.',
      ],
    },
    productivity: {
      name: 'Produtividade',
      description: 'Mantenha a tela acesa online, cronometre foco com Pomodoro e organize notas e tarefas.',
      tagline: 'Foco, controle de tela e listas locais.',
      intro: [
        'Utilitários diretos para evitar bloqueio de tela durante leituras e apresentações, gerenciar ciclos Pomodoro e manter notas locais sem conta.',
      ],
    },
    'money-finance': {
      name: 'Finanças e Dinheiro',
      description: 'Simule juros compostos, reservas, empréstimos e impacto da inflação com transparência.',
      tagline: 'Juros compostos, empréstimos e projeções.',
      intro: [
        'Simuladores financeiros com fórmulas abertas para comparar capitalização mensal, parcelas de empréstimo e poder de compra sem enviar seus valores a terceiros.',
      ],
    },
    generate: {
      name: 'Geradores',
      description: 'Gere senhas fortes, UUIDs, códigos QR e texto Lorem Ipsum localmente no navegador.',
      tagline: 'Senhas, UUIDs, QR codes e texto de apoio.',
      intro: [
        'Geração criptográfica local pela Web Crypto API do navegador para senhas aleatórias, UUIDs, códigos QR em PNG/SVG e blocos Lorem Ipsum sem marcas d’água.',
      ],
    },
    physics: {
      name: 'Física',
      headline: 'Simulações de Física',
      description: 'Simulações interativas de movimento, ondas, calor e circuitos direto no navegador.',
      tagline: 'Movimento, ondas, calor e circuitos interativos.',
      intro: [
        'Experimente variáveis físicas ao vivo com fórmulas atualizadas em tempo real em vez de tabelas estáticas.',
      ],
    },
    'applied-math': {
      name: 'Matemática Aplicada',
      headline: 'Calculadoras e Simulações de Matemática',
      description: 'Resolva matrizes, frações, triângulos, equações quadráticas e probabilidade interativa.',
      tagline: 'Matrizes, frações, trigonometria e probabilidade.',
      intro: [
        'Calculadoras passo a passo acompanhadas de gráficos interativos para conferir resultados e caminhos.',
      ],
    },
    chemistry: {
      name: 'Química',
      headline: 'Simulações de Química',
      description: 'Explore geometria molecular VSEPR, projeções de Newman, ligações e cinética química.',
      tagline: 'Estrutura molecular, ligações e cinética.',
      intro: [
        'Modelos interativos para visualizar conceitos espaciais de química orgânica e geral direto na página.',
      ],
    },
    'date-time': {
      name: 'Data e Hora',
      description: 'Calcule idade exata, diferença entre datas, fusos horários e timestamps Unix.',
      tagline: 'Idades, intervalo de dias, fusos e epoch Unix.',
      intro: [
        'Conversão confiável entre datas de calendário e epoch Unix em segundos ou milissegundos, além de cálculos exatos de idade e diferença em dias.',
      ],
    },
    'health-fitness': {
      name: 'Saúde e Bem-Estar',
      description: 'Calcule IMC, taxa metabólica basal (TMB), gasto calórico (TDEE) e ritmo de corrida.',
      tagline: 'IMC, TMB, calorias diárias e métricas corporais.',
      intro: [
        'Fórmulas clínicas reconhecidas para estimar IMC, metabolismo basal e gasto energético diário com privacidade total no dispositivo.',
      ],
    },
    'design-tools': {
      name: 'Design e CSS',
      description: 'Calcule proporção 16:9, converta px em rem, minifique CSS e valide contraste WCAG.',
      tagline: 'Proporções, unidades CSS, cores e minificação.',
      intro: [
        'Ferramentas práticas para interface e front-end: proporção de imagens e vídeos, unidades px/rem/em, minificador CSS e contraste WCAG.',
      ],
    },
    'music-audio': {
      name: 'Música e Áudio',
      description: 'Monte curvas de equalização claras por banda de frequência para seu player.',
      tagline: 'Ajustes de equalizador por frequência.',
      intro: [
        'Traduz objetivos sonoros em ganhos por faixa de Hz para aplicar no seu reprodutor ou DAW.',
      ],
    },
    fidgets: {
      name: 'Fidgets Interativos',
      headline: 'Brinquedos Táteis Virtuais',
      description: 'Superfícies táteis leves no navegador com som opcional e respeito a movimento reduzido.',
      tagline: 'Fidgets online leves sem instalar aplicativos.',
      intro: [
        'Brinquedos virtuais rápidos para pausas curtas diretamente no navegador.',
      ],
    },
    prep: {
      name: 'Preparação para IA',
      description: 'Limpe conversas, confira limites de contexto e valide JSON Schema no navegador.',
      tagline: 'Prepare texto e esquemas antes de usar IA.',
      intro: [
        'Utilitários locais para limpar e validar prompts e arquivos antes de colar em modelos de linguagem.',
      ],
    },
    games: {
      name: 'Jogos',
      headline: 'Jogos para Dois no Mesmo Aparelho',
      description: 'Jogos de tabuleiro clássicos por turnos para duas pessoas na mesma tela, sem contas.',
      tagline: 'Dois jogadores no mesmo dispositivo.',
      intro: [
        'Partidas locais para duas pessoas compartilhando o mesmo celular ou tela, sem cadastro.',
      ],
    },
  },
};
