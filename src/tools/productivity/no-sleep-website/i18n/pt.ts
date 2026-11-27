import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'no-sleep-website',
  name: 'Manter Tela Ligada (No Sleep Website)',
  seoTitle: 'No Sleep Website – Manter Tela Ligada Online Grátis',
  description:
    'Site gratuito para manter a tela do celular, tablet ou notebook sempre ligada sem instalar apps. Funciona no navegador com a API Screen Wake Lock.',
  tagline: 'Mantenha sua tela acesa direto no navegador, sem instalar aplicativos.',
  citation: {
    problem:
      'Use esta página para impedir que a tela do telefone, tablet ou notebook apague automaticamente sem instalar programas ou alterar ajustes do sistema.',
    nonGoal: 'anular o botão físico de energia, impedir desligamento por bateria crítica ou rodar oculto em segundo plano.',
  },
  knowledge: {
    primaryConcepts: ['manter tela ligada', 'no sleep website', 'wake lock'],
    realWorldUseCases: [
      'Manter a tela do celular acesa na cozinha enquanto lê uma receita',
      'Evitar bloqueio do notebook durante apresentações ou reuniões em vídeo',
      'Deixar painéis de monitoramento, logs ou letras visíveis sem mexer no mouse',
      'Ler artigos longos ou estudar anotações sem interrupções da tela',
    ],
    commonMistakes: [
      'Esperar que a trava continue ativa ao trocar de aba ou minimizar o navegador',
      'Achar que o navegador anula o botão de bloqueio ou o modo de economia extrema do sistema',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: 'O que é um No Sleep Website (site para não apagar a tela)?',
      answer:
        'É uma página da web que solicita ao sistema operacional que mantenha o monitor ou visor aceso usando o padrão Screen Wake Lock API do W3C. Enquanto a aba estiver aberta e visível, o dispositivo evita escurecer ou bloquear a tela automaticamente.',
    },
    {
      id: 'nsw-faq-2',
      question: 'Como faço para manter a tela ligada online com esta ferramenta?',
      answer:
        'Abra esta página e toque em Manter tela ligada. O navegador solicita imediatamente o bloqueio de suspensão da tela. Enquanto esta aba permanecer visível em primeiro plano, a tela segue acesa sem precisar tocar no aparelho.',
    },
    {
      id: 'nsw-faq-3',
      question: 'Funciona em celulares e tablets Android?',
      answer:
        'Sim. Funciona nativamente no Google Chrome, Microsoft Edge, Brave, Samsung Internet e demais navegadores baseados em Chromium no Android enquanto a aba continuar visível.',
    },
    {
      id: 'nsw-faq-4',
      question: 'Funciona no iPhone e no iPad?',
      answer:
        'Sim. A Apple adicionou suporte nativo à Screen Wake Lock API no Safari a partir do iOS 16.4 e iPadOS 16.4, assim como nos navegadores baseados em WebKit no iOS. Mantenha a página visível na tela.',
    },
    {
      id: 'nsw-faq-5',
      question: 'Consigo impedir que meu notebook Windows ou Mac apague a tela?',
      answer:
        'Sim. Chrome, Edge e Safari oferecem suporte nativo no Windows e macOS, e o Firefox suporta desde a versão 126. Lembre-se de que fechar a tampa do notebook ou apertar o botão ligar ainda suspenderá o sistema.',
    },
    {
      id: 'nsw-faq-6',
      question: 'Continua funcionando se eu trocar de aba ou minimizar o navegador?',
      answer:
        'Não. Por economia de energia, todo navegador libera o wake lock automaticamente assim que a aba fica oculta. Ao voltar para esta aba, a página tenta reativar o bloqueio automaticamente.',
    },
    {
      id: 'nsw-faq-7',
      question: 'Deixar a tela ligada consome mais bateria?',
      answer:
        'Sim. A iluminação da tela é o componente que mais consome energia em celulares e notebooks. Você pode ativar a proteção opcional de bateria nas opções para encerrar automaticamente abaixo de 15%.',
    },
    {
      id: 'nsw-faq-8',
      question: 'Esta ferramenta é gratuita e privada?',
      answer:
        'Sim. É totalmente gratuita, não exige cadastro e roda localmente no seu navegador sem enviar dados a servidores.',
    },
    {
      id: 'nsw-faq-9',
      question: 'Preciso instalar algum aplicativo ou extensão?',
      answer:
        'Não. A página utiliza recursos nativos dos navegadores modernos e funciona na hora, direto pelo navegador.',
    },
    {
      id: 'nsw-faq-10',
      question: 'Por que minha tela ainda pode apagar em algumas situações?',
      answer:
        'Modo de economia de bateria, políticas corporativas de energia, botão físico de bloqueio ou tampa fechada têm prioridade sobre o navegador. Quando o sistema revoga o bloqueio, o painel informa o estado real imediatamente.',
    },
  ],
  guide: {
    title: 'Como manter a tela acesa direto pelo navegador',
    description: 'Entenda a API Screen Wake Lock, compatibilidade em Android, iPhone e PC, gasto de bateria e limites do sistema.',
    readMinutes: 6,
  },
  ui: {
    panelScreen: 'Tela',
    panelSession: 'Sessão',
    heroReady: 'Pronto',
    heroPlanned: 'Programado',
    heroRemaining: 'Restante',
    heroAwakeFor: 'Ativa há',
    heroTotalAwake: 'Tempo total ativa',
    btnStart: 'Manter tela ligada',
    btnStop: 'Parar',
    lockReady: 'Pronto quando você quiser.',
    lockHeld: 'Bloqueio de tela ativo no seu aparelho.',
    lockLost: 'Bloqueio perdido. Reconectando...',
    lockComplete: 'Sessão concluída.',
    lockUnsupported: 'Ajuste o tempo de tela nas configurações do aparelho.',
    metaStarted: 'Início',
    metaEnds: 'Fim',
    btnAmbient: 'Modo ambiente',
    unsupTitle: 'Este navegador não suporta Screen Wake Lock.',
    keepAwakeFor: 'Manter ativa por',
    sessionLengthAria: 'Duração da sessão',
    durUntilStop: 'Até eu parar',
    dur15m: '15 min',
    dur30m: '30 min',
    dur1h: '1 hora',
    dur2h: '2 horas',
    customLabel: 'Personalizado',
    customPlaceholder: 'minutos',
    alertsSummary: 'Alertas e tela',
    optChime: 'Tocar som ao finalizar a sessão',
    optNotify: 'Enviar notificação do navegador ao concluir',
    optGuard: 'Liberar abaixo de 15% de bateria',
    clockFormatAria: 'Formato do relógio',
    clockLabel: 'Relógio',
    ambSleeping: 'Em repouso',
    ambAwake: 'Tela ativa',
    ambReconnecting: 'Reconectando',
    ambCompleted: 'Concluída',
    ambEndsAt: 'Termina às',
    ambBtnStart: 'Ativar tela',
    ambBtnDim: 'Escurecer',
    ambBtnExit: 'Sair',
    unitMinShort: 'm',
    unitHourShort: 'h',
    todayPrefix: 'Hoje: ',
    todayOne: 'sessão',
    todayMany: 'sessões',
    todayAwakeSuffix: 'ativa',
    titleActive: 'Ativa · Manter Tela Ligada',
    annLockLost: 'Bloqueio de tela interrompido. Reconectando.',
    annAcquireFail: 'Não foi possível ativar o bloqueio de tela.',
    annStartedTimed: 'Tela mantida ligada por {dur}.',
    annStartedOpen: 'Tela mantida ligada.',
    annCompleted: 'Sessão concluída após {dur}.',
    notifyTitle: 'Tela liberada',
    notifyBody: 'Sua sessão de {dur} foi concluída.',
    batteryLabel: 'Bateria ',
    batteryCharging: ' e carregando',
    batteryGuardStop: 'Encerrado aos {pct}% de bateria para poupar carga.',
    hintIos: 'No iOS: Ajustes > Tela e Brilho > Bloqueio Automático > Nunca.',
    hintAndroid: 'No Android: Configurações > Visor > Tempo limite da tela.',
    hintMac: 'No macOS: Ajustes do Sistema > Tela Bloqueada > Desativar tela.',
    hintWin: 'No Windows: Configurações > Sistema > Energia e bateria > Tela e suspensão.',
    hintOther: 'Altere o tempo limite nas configurações de tela do seu dispositivo.',
  },
};
