import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de ciclos de sono",
  "seoTitle": "Calculadora Ciclos de Sono - Hora de Dormir e Acordar",
  "description": "Calcule o horário ideal para dormir ou despertar em ciclos de 90 minutos somando os minutos reais para pegar no sono.",
  "tagline": "Horários em ciclos de 90 minutos mais tempo para adormecer.",
  "lead": "Encontre os melhores horários para ir dormir ou despertar alinhados a ciclos completos de 90 minutos no navegador, somando sua latência.",
  "craft": {
    "solves": "Contar 90 minutos para trás desde o despertador esquece o tempo na cama antes de pegar no sono, fazendo o alarme tocar no meio de um ciclo."
  },
  "guide": {
    "title": "Hora de dormir com ciclos de 90 minutos",
    "description": "Entenda o ciclo de 90 minutos, por que somar os 15 minutos iniciais antes de dormir e como calcular por horário de acordar ou dormir."
  },
  "fields": {
    "direction": {
      "label": "Eu sei quando",
      "options": {
        "wake": "Vou acordar",
        "sleep": "Vou para a cama"
      }
    },
    "time": {
      "label": "Horário no relógio",
      "help": "Exemplos: 07:00, 19:00 ou 7:00 am."
    },
    "latency": {
      "label": "Minutos para adormecer",
      "help": "Em média 15 minutos. Zero assume sono instantâneo."
    },
    "cycle": {
      "label": "Duração do ciclo (min)",
      "help": "Um ciclo adulto típico dura cerca de 90 minutos."
    }
  },
  "ui": {
    "emptyText": "Informe um horário de acordar ou ir para a cama para ver as quatro sugestões de ciclos.",
    "engine": {
      "vLabel_latency": "Minutos para adormecer",
      "vLabel_cycle": "Duração do ciclo",
      "errEnterTpl": "Informe {label}.",
      "errWholeTpl": "{label} deve ser um número inteiro.",
      "errRangeTpl": "{label} deve ficar entre {min} e {max}.",
      "errBadClock": "Digite uma hora válida como 07:00, 19:00 ou 7:00 am.",
      "heroWake": "Ir para a cama",
      "heroSleep": "Acordar às",
      "heroInstant": "5 ciclos. Assume que você dorme no instante em que se deita.",
      "heroLatencyTpl": "5 ciclos, após {latency} minutos para adormecer.",
      "cycleCardTpl": "{n} ciclos",
      "cycleNoteTpl": "{n} × {cycle} min dormindo",
      "insWakeTpl": "Acordar às {time}. Cada hora de deitar conta {latency} min para pegar no sono mais 3 a 6 ciclos de {cycle} min.",
      "insSleepTpl": "Deitar às {time}. Cada alarme considera {latency} min para adormecer e 3 a 6 ciclos de {cycle} min.",
      "insInstant": "Estes horários assumem sono instantâneo. Adicione os minutos que costuma levar para não acordar no meio de um ciclo.",
      "asmCycle": "Duração do ciclo",
      "asmLatency": "Tempo para adormecer",
      "asmInstant": "nenhum (sono instantâneo)",
      "minTpl": "{n} minutos",
      "decDateDiff": "Contar dias entre duas datas",
      "explanationTpl": "Um ciclo dura aqui {cycle} minutos de sono, e os {latency} minutos anteriores não integram o ciclo. As opções mostram 6, 5, 4 e 3 ciclos completos."
    }
  },
  "knowledge": {
    "summary": "Calcula horários ideais para dormir ou acordar em ciclos de 90 minutos incorporando os minutos reais para adormecer.",
    "useCases": [
      "Saber a que horas deitar para acordar bem às 07:00",
      "Calcular o alarme ideal se for dormir agora",
      "Ajustar o tempo real que você leva para pegar no sono"
    ],
    "mistakes": [
      "Deixar a latência zerada e acordar no meio do último ciclo",
      "Tratar 90 minutos como regra fixa imutável para toda pessoa",
      "Usar a calculadora como diagnóstico médico de distúrbios do sono"
    ]
  },
  "faqs": [
    {
      "id": "sleep-cycle-calculator-faq-1",
      "question": "Que horas devo ir dormir para fechar ciclos de 90 minutos?",
      "answer": "Escolha \"Vou acordar\", digite 07:00 e mantenha 15 minutos de latência: 5 ciclos indicam 23:15 e 6 ciclos 21:45."
    },
    {
      "id": "sleep-cycle-calculator-faq-2",
      "question": "Por que a lista começa 15 minutos antes do primeiro ciclo?",
      "answer": "Porque o tempo acordado na cama não faz parte do sono; incluí-lo evita que o alarme toque 15 minutos antes do fim do último ciclo."
    },
    {
      "id": "sleep-cycle-calculator-faq-3",
      "question": "Quantos ciclos há em uma noite?",
      "answer": "Exibimos 6, 5, 4 e 3 ciclos (9 h, 7,5 h, 6 h e 4,5 h dormindo). Cinco ou seis costumam formar uma noite plena adulta."
    },
    {
      "id": "sleep-cycle-calculator-faq-4",
      "question": "Posso calcular a partir da hora de deitar em vez da hora de acordar?",
      "answer": "Sim. Troque para \"Vou para a cama\", digite por exemplo 22:30 e veja os quatro horários ideais para despertar."
    },
    {
      "id": "sleep-cycle-calculator-faq-5",
      "question": "Um ciclo de 90 minutos serve para todo mundo?",
      "answer": "Não. Noventa minutos é uma média didática; ajuste entre 60 e 120 minutos conforme seu ritmo."
    },
    {
      "id": "sleep-cycle-calculator-faq-6",
      "question": "O que acontece se deixar zero minutos para adormecer?",
      "answer": "Os horários ajustam para múltiplos exatos do ciclo e um alerta avisa que foi assumido sono instantâneo."
    },
    {
      "id": "sleep-cycle-calculator-faq-7",
      "question": "Esta ferramenta envia minha rotina para algum servidor?",
      "answer": "Não. Todos os cálculos acontecem localmente no navegador e continuam funcionando offline."
    },
    {
      "id": "sleep-cycle-calculator-faq-8",
      "question": "Por que 6 ciclos ficam mais de nove horas antes do alarme?",
      "answer": "Porque 6 × 90 min são 9 horas de sono somadas aos 15 minutos previstos na cama antes de dormir."
    },
    {
      "id": "sleep-cycle-calculator-faq-9",
      "question": "Isso detecta algum distúrbio do sono?",
      "answer": "Não. Trata-se apenas de aritmética horária; procure um médico se sentir cansaço crônico."
    },
    {
      "id": "sleep-cycle-calculator-faq-10",
      "question": "Qual a vantagem sobre fazer contas de 90 minutos de cabeça?",
      "answer": "Inclui o intervalo para adormecer, exibe quatro opções nos dois sentidos e trata viradas de meia-noite automaticamente."
    }
  ]
};
