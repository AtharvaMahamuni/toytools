import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'pomodoro-timer',
  name: 'Timer Pomodoro',
  seoTitle: 'Timer Pomodoro Online Grátis – 25 Minutos de Foco',
  description:
    'Timer Pomodoro gratuito online com blocos de 25 minutos de foco e 5 de pausa, opção 50/10, alertas sonoros e histórico salvo no dispositivo.',
  tagline: 'Mantenha o foco com blocos cronometrados de trabalho e pausas reais.',
  knowledge: {
    primaryConcepts: ['timer pomodoro', 'técnica pomodoro', 'relógio de foco'],
    realWorldUseCases: [
      'Escrever textos e relatórios técnicos em blocos cronometrados',
      'Estudar conteúdos extensos com intervalos regulares para fixação',
      'Revisar código e avançar em tarefas sem cair em distrações',
    ],
    commonMistakes: [
      'Pular as pausas curtas por achar que está no fluxo e esgotar a mente cedo',
      'Checar mensagens ou redes sociais durante os cinco minutos de pausa',
      'Iniciar o timer sem definir exatamente o que fazer no bloco',
    ],
  },
  faqs: [
    {
      id: 'pt-faq-1',
      question: 'O que é um Pomodoro?',
      answer:
        'Um Pomodoro é um único bloco cronometrado de trabalho, tradicionalmente de 25 minutos de foco seguido por 5 minutos de pausa. O nome vem da palavra italiana para tomate, em referência ao timer de cozinha que Francesco Cirillo usou ao criar o método.',
    },
    {
      id: 'pt-faq-2',
      question: 'Quanto tempo dura um ciclo Pomodoro?',
      answer:
        'O formato clássico tem 25 minutos de foco e 5 minutos de pausa curta. Após quatro blocos completos, faz-se uma pausa longa de 15 minutos. Você também pode ajustar para 50/10 ou qualquer duração personalizada.',
    },
    {
      id: 'pt-faq-3',
      question: 'Por que se chama Técnica Pomodoro?',
      answer:
        'Francesco Cirillo batizou o método no fim dos anos 1980 por causa do timer mecânico em formato de tomate (pomodoro, em italiano) que utilizava na faculdade.',
    },
    {
      id: 'pt-faq-4',
      question: 'Posso personalizar os minutos do timer?',
      answer:
        'Sim. Clique em Personalizar para ajustar o tempo de foco (1 a 180 min), pausa curta (1 a 60 min), pausa longa (1 a 120 min) e sessões por ciclo (1 a 12). Tudo fica salvo localmente no seu navegador.',
    },
    {
      id: 'pt-faq-5',
      question: 'Posso usar intervalos 50/10 em vez de 25/5?',
      answer:
        'Sim. Abra Personalizar e defina 50 minutos de foco e 10 minutos de pausa curta. Muitos programadores e redatores preferem blocos de 50 minutos.',
    },
    {
      id: 'pt-faq-6',
      question: 'Quantos Pomodoros devo fazer por dia?',
      answer:
        'A maioria das pessoas sustenta de 8 a 12 blocos de 25 minutos de trabalho concentrado em um dia cheio, embora 4 a 6 sessões sólidas já sejam uma meta excelente para começar.',
    },
    {
      id: 'pt-faq-7',
      question: 'O que fazer durante as pausas?',
      answer:
        'Nas pausas de 5 minutos, levante-se, alongue o corpo, beba água e descanse os olhos longe da tela. Evite e-mails e redes sociais. Na pausa longa de 15 minutos, caminhe um pouco ou relaxe sem telas.',
    },
    {
      id: 'pt-faq-8',
      question: 'A técnica Pomodoro funciona para estudar?',
      answer:
        'Sim, funciona muito bem quando você divide o estudo em metas concretas, como ler um capítulo ou resolver exercícios. As pausas programadas evitam fadiga mental.',
    },
    {
      id: 'pt-faq-9',
      question: 'O método Pomodoro ajuda programadores?',
      answer:
        'Depende da tarefa. É ótimo para corrigir bugs pontuais ou revisar pull requests. Para arquitetura profunda, usar 50/10 ou 90/20 evita interromper o raciocínio antes da hora.',
    },
    {
      id: 'pt-faq-16',
      question: 'A técnica Pomodoro funciona para TDAH?',
      answer:
        'Para muitas pessoas com TDAH ela ajuda bastante porque limita tarefas abertas a "apenas 25 minutos" e cria pausas que evitam exaustão após hiperfoco. Se 25 parecer longo no início, experimente 15 minutos.',
    },
    {
      id: 'pt-faq-17',
      question: 'Pomodoro ou time blocking: qual é melhor?',
      answer:
        'Eles se complementam. O time blocking reserva blocos maiores na agenda (por exemplo, 10h às 12h para projeto), enquanto o Pomodoro estrutura o ritmo dentro desse bloco com pausas obrigatórias.',
    },
    {
      id: 'pt-faq-18',
      question: 'Existe respaldo prático para a Técnica Pomodoro?',
      answer:
        'Os mecanismos envolvidos são bem conhecidos na psicologia cognitiva: compromissos curtos reduzem a procrastinação para começar e pausas regulares preservam a atenção sustentada.',
    },
    {
      id: 'pt-faq-14',
      question: 'Para quem é indicada a Técnica Pomodoro?',
      answer:
        'Estudantes, desenvolvedores, escritores e profissionais que enfrentam interrupções frequentes ou dificuldade para iniciar tarefas grandes.',
    },
    {
      id: 'pt-faq-10',
      question: 'Este timer funciona sem internet?',
      answer:
        'Sim. Depois de carregar a página, o relógio e os avisos sonoros funcionam totalmente no navegador, mesmo offline.',
    },
    {
      id: 'pt-faq-11',
      question: 'O ToyTools salva meu histórico ou ajustes em algum servidor?',
      answer:
        'Não. Configurações e contagem diária ficam guardadas somente no armazenamento local do dispositivo e podem ser exportadas em JSON.',
    },
    {
      id: 'pt-faq-12',
      question: 'O relógio continua contando se eu trocar de aba?',
      answer:
        'Sim. A contagem usa timestamps reais do sistema, então o tempo exibido permanece exato ao retornar para a aba.',
    },
    {
      id: 'pt-faq-13',
      question: 'Funciona bem no celular?',
      answer:
        'Sim, foi projetado primeiro para dispositivos móveis. Como o celular pausa scripts quando a tela bloqueia, você pode usá-lo junto com nossa ferramenta Manter Tela Ligada.',
    },
    {
      id: 'pt-faq-15',
      question: 'Posso instalar na tela inicial do smartphone?',
      answer:
        'Sim. Use a opção de instalar ou adicionar à tela inicial do navegador; suas preferências continuam salvas localmente.',
    },
  ],
  guide: {
    title: 'Técnica Pomodoro: guia prático completo',
    description: 'Como funciona um ciclo Pomodoro, variações 50/10 e 90/20, estudo, TDAH e erros mais comuns.',
    readMinutes: 6,
  },
  ui: {
    btnCustomize: 'Personalizar',
    lblFocusMins: 'Foco',
    lblShortBreak: 'Pausa curta',
    lblLongBreak: 'Pausa longa',
    lblSessionsPerCycle: 'Sessões por ciclo',
    unitMin: 'min',
    lblSound: 'Tocar som ao terminar',
    lblNotif: 'Notificações do navegador',
    lblAutoStart: 'Iniciar próxima fase automaticamente',
    ariaModePrefix: 'Modo atual:',
    ariaTimer: 'Timer Pomodoro',
    modeFocus: 'FOCO',
    modeShortBreak: 'PAUSA CURTA',
    modeLongBreak: 'PAUSA LONGA',
    btnStart: 'Iniciar',
    btnPause: 'Pausar',
    btnReset: 'Reiniciar',
    msgFocusComplete: 'Foco concluído ✓',
    ariaProgress: 'Progresso das sessões',
    sessionInitial: 'Sessão 1 de 4',
    sessionTpl: 'Sessão {n} de {total}',
    btnFullScreen: 'Tela cheia',
    btnRemoveDistractions: 'Sem distrações',
    ariaBackup: 'Gerenciamento de backup',
    btnExportJson: 'Exportar JSON',
    btnImportJson: 'Importar JSON',
    lblPasteBackup: 'Cole o JSON de backup',
    ariaChooseFile: 'Escolher arquivo JSON de backup',
    btnImport: 'Importar',
    statsInitial: 'Hoje ● 0 sessões ● 0 minutos',
    todayWord: 'Hoje',
    unitSessionOne: 'sessão',
    unitSessionMany: 'sessões',
    unitMinuteOne: 'minuto',
    unitMinuteMany: 'minutos',
    ariaExitFs: 'Sair da tela cheia',
    dotDone: 'Sessão {i}: concluída',
    dotCurrent: 'Sessão {i}: em andamento',
    dotRemaining: 'Sessão {i}: pendente',
    notifBreakTitle: 'Hora da pausa',
    notifBreakBody: 'Respire um pouco. Toque para voltar ao timer.',
    notifFocusTitle: '● Pomodoro em andamento',
    notifFocusBody: 'Sessão de foco ativa. Toque para voltar.',
    msgFocusNotif: 'Sessão de foco concluída. Hora da pausa.',
    msgLongBreakNotif: 'Pausa longa terminada. Hora de voltar ao foco.',
    msgShortBreakNotif: 'Pausa concluída. De volta ao trabalho.',
    msgRestored: 'Sessão restaurada. Clique em Iniciar para continuar.',
  },
};
