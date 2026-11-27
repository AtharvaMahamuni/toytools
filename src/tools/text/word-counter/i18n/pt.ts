import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'word-counter',
  name: 'Contador de Palavras',
  seoTitle: 'Contador de Palavras e Caracteres Online Grátis',
  description:
    'Conte palavras, caracteres, frases, parágrafos e tempo de leitura em tempo real. Defina uma meta de palavras no navegador sem enviar texto a servidores.',
  tagline: 'Conte palavras e caracteres na hora e acompanhe uma meta de tamanho.',
  citation: {
    problem:
      'Use este contador de palavras quando precisar conferir o tamanho exato de uma redação ou texto sem enviá-lo pela internet.',
    nonGoal: 'reescrever seu texto ou enviá-lo para algum modelo de inteligência artificial.',
  },
  knowledge: {
    primaryConcepts: ['contador de palavras', 'contagem de caracteres'],
    realWorldUseCases: [
      'Respeitar o limite exato de palavras em redações acadêmicas ou editais',
      'Controlar o tamanho ideal de artigos, guias e textos de SEO',
      'Calcular orçamentos de revisão ou tradução cobrados por palavra',
      'Ajustar cartas de apresentação ou resumos a um limite rígido',
    ],
    commonMistakes: [
      'Presumir que todos os editores contam palavras hifenizadas do mesmo jeito',
      'Esquecer de verificar se notas de rodapé e referências entram no limite',
    ],
  },
  faqs: [
    {
      id: 'wc-faq-1',
      question: 'Como funciona um contador de palavras?',
      answer:
        'Um contador divide o texto em palavras usando delimitadores visíveis. Esta ferramenta separa por espaços, quebras de linha, travessões e vírgulas fora de números, preservando links completos e atualizando os números em tempo real.',
    },
    {
      id: 'wc-faq-2',
      question: 'O que conta como uma palavra nesta ferramenta?',
      answer:
        'Qualquer sequência separada por espaço, quebra de linha ou vírgula não numérica ("azul,verde" conta 2 palavras). Números ("42"), termos com hífen ("bem-vindo") e URLs inteiras contam como uma palavra.',
    },
    {
      id: 'wc-faq-3',
      question: 'Qual a diferença entre contar palavras e contar caracteres?',
      answer:
        'A contagem de palavras mede termos separados; a de caracteres soma todas as letras, espaços e sinais de pontuação. "Olá, mundo!" tem 2 palavras e 11 caracteres. Use palavras para textos longos e caracteres para SMS, redes sociais e meta descrições.',
    },
    {
      id: 'wc-faq-4',
      question: 'Meu texto é enviado para algum servidor?',
      answer:
        'Não. Toda a análise roda localmente no seu navegador via JavaScript e nada sai do seu dispositivo.',
    },
    {
      id: 'wc-faq-5',
      question: 'Quanto tempo leva para ler 1.000 palavras?',
      answer:
        'Em velocidade média de leitura silenciosa (200 a 250 palavras por minuto), 1.000 palavras levam cerca de 4 a 5 minutos. Esta ferramenta usa 200 palavras por minuto como referência padrão.',
    },
    {
      id: 'wc-faq-6',
      question: 'Qual é o limite de caracteres no X ou no LinkedIn?',
      answer:
        'O X (Twitter) permite até 280 caracteres em postagens padrão; o LinkedIn aceita até 3.000 caracteres em publicações no feed e 125.000 em artigos.',
    },
    {
      id: 'wc-faq-7',
      question: 'Por que diferentes contadores dão totais ligeiramente diferentes?',
      answer:
        'Porque cada programa aplica regras próprias em casos de fronteira: palavras hifenizadas, travessões colados em palavras, siglas com pontos ou linhas só com pontuação.',
    },
    {
      id: 'wc-faq-8',
      question: 'Como o tempo de leitura é calculado?',
      answer:
        'Divide-se o total de palavras por 200 palavras por minuto, média padrão de leitura silenciosa para prosa geral (textos técnicos costumam ficar entre 100 e 150 ppm).',
    },
    {
      id: 'wc-faq-9',
      question: 'Títulos e subtítulos entram na contagem?',
      answer:
        'Sim. Tudo o que estiver colado no campo de texto entra na contagem. Se quiser medir apenas o corpo do texto, cole somente essa parte.',
    },
    {
      id: 'wc-faq-10',
      question: 'Posso colar documentos confidenciais com segurança?',
      answer:
        'Sim. Contagem, frequência de termos e barra de meta rodam exclusivamente na memória da aba do seu navegador, sem requisições externas.',
    },
    {
      id: 'wc-faq-11',
      question: 'Esta ferramenta conta tokens de IA?',
      answer:
        'Não. Ela mede palavras, caracteres, frases e parágrafos legíveis por pessoas. Tokens de modelos de linguagem seguem subunidades próprias.',
    },
  ],
  guide: {
    title: 'Como contar palavras e controlar o tamanho',
    description: 'Regras reais de contagem de palavras, por que Word e editores divergem, tempo de leitura e limites.',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'Cole ou digite um texto para contar palavras.',
    sampleText:
      'A rápida raposa marrom salta sobre o cão preguiçoso perto da velha fazenda. Uma brisa suave balançava as folhas do alto carvalho, trazendo o perfume das flores silvestres pelo campo. Os pássaros cantavam nos galhos iluminados pelo sol da tarde enquanto um riacho serpenteava entre pedras cobertas de musgo.',
    statWords: 'Palavras',
    statCharacters: 'Caracteres',
    statSentences: 'Frases',
    statParagraphs: 'Parágrafos',
    statReadingTime: 'Tempo de leitura',
    statUniqueWords: 'Palavras únicas',
    btnDownloadReport: 'Baixar relatório',
    lblGoal: 'Meta de palavras',
    goalPlaceholder: 'ex. 500',
    btnClearGoal: 'Limpar meta',
    headingTopWords: 'Palavras mais usadas',
    lblHideCommon: 'Ocultar palavras comuns',
    btnSortFreq: 'Por frequência',
    btnSortAlpha: 'Ordem alfabética',
    summaryInsights: 'Detalhes de vocabulário',
    stopWords: 'a o as os um uma uns umas e ou mas em de do da dos das no na nos nas ao aos à às por para com sem sobre entre desde até é são foi era ser estar ter fazer como mais muito já não sim seu sua seus suas meu minha meus minhas se lhe lo me te nos que quem qual',
    goalRemainTpl: '{cur} / {goal} palavras ({rem} restantes, {pct}%)',
    goalDoneTpl: '{cur} / {goal} palavras (meta alcançada)',
    noWordsFound: 'Nenhuma palavra encontrada.',
    insightLongest: 'Palavra mais longa',
    insightShortest: 'Palavra mais curta',
    insightRepeated: 'Palavras repetidas',
    toastEmptyDownload: 'Nada para baixar!',
    reportHeading: 'Relatório de Contagem de Palavras',
    reportGoalPrefix: 'Meta: ',
    reportWordsSuffix: 'palavras',
    reportGeneratedPrefix: 'Gerado: ',
    toastDownloaded: 'Relatório baixado',
  },
};
