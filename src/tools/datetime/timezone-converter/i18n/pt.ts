import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de fuso horário",
  "seoTitle": "Conversor de Fuso Horário - Horário Mundial e UTC",
  "description": "Converta datas e horários entre fusos do mundo inteiro com hora UTC, diferença exata e horário de verão automático no navegador.",
  "tagline": "Converta horários entre fusos com horário de verão automático.",
  "lead": "Converta qualquer data e hora entre fusos IANA no navegador exibindo hora UTC, diferença exata de horas e mudanças de dia.",
  "craft": {
    "solves": "Quando relógios atrasam no fim do horário de verão, uma hora local acontece duas vezes; offsets datados eliminam ambiguidade."
  },
  "guide": {
    "title": "Como converter horários entre fusos horários",
    "description": "Como um horário local passa pelo UTC até outra cidade, como funciona o horário de verão e como evitar confusões de data."
  },
  "fields": {
    "datetime": {
      "label": "Data e hora"
    },
    "fromZone": {
      "label": "Fuso de origem"
    },
    "toZone": {
      "label": "Fuso de destino"
    }
  },
  "ui": {
    "emptyText": "Informe data e hora e escolha dois fusos horários para realizar a conversão.",
    "engine": {
      "vLabel_datetime": "uma data e hora",
      "errBadZone": "Escolha um fuso horário válido na lista.",
      "sameTimePhrase": "é o mesmo horário de",
      "aheadTpl": "está {span} à frente de",
      "behindTpl": "está {span} atrás de",
      "timeInTpl": "Hora em {zone}",
      "inZoneTpl": "Em {zone}",
      "inUtc": "Em UTC",
      "diffLabel": "Diferença de horário",
      "sameTime": "Mesmo horário",
      "offsetTpl": "Offset de {zone}",
      "fromUtcNote": "Em relação ao UTC nesta data",
      "sameDay": "Ambos os fusos estão no mesmo dia do calendário neste horário.",
      "nextDayTpl": "Em {zone} já é o dia seguinte.",
      "prevDayTpl": "Em {zone} ainda é o dia anterior.",
      "dstMissingTpl": "{time} não existiu em {zone} (salto de horário de verão); ajustado para {after}.",
      "dstAmbigTpl": "{time} ocorreu duas vezes em {zone} na mudança de horário; adotado o primeiro instante ({offset}).",
      "dstReadTpl": "Horário de verão calculado para a data exata de {date}, e não pela data de hoje.",
      "msWholeHour": "Fusos diferem por horas inteiras",
      "msCrossDay": "A conversão muda o dia do calendário",
      "decUnix": "Converter a data em timestamp Unix",
      "decDateDiff": "Contar os dias entre duas datas",
      "q1": "Que horas são em UTC?",
      "q2": "Quantas horas de diferença existem entre as cidades?",
      "explanationTpl": "{srcTime} em {srcZone} ({srcOffset}) equivale ao mesmo instante de {dstTime} em {dstZone} ({dstOffset}), ou seja, {utcTime} UTC. A diferença nessa data é {diff}."
    }
  },
  "knowledge": {
    "summary": "Converte horários entre fusos IANA mundiais com UTC, diferença horária e regras de horário de verão para a data informada.",
    "useCases": [
      "Agendar reuniões internacionais sem erro com horário de verão",
      "Calcular horário local de chegada de voos internacionais",
      "Comparar logs em UTC com o horário local da equipe"
    ],
    "mistakes": [
      "Achar que a diferença entre duas cidades é sempre igual no ano inteiro",
      "Esquecer que o horário convertido pode cair no dia seguinte ou anterior"
    ]
  },
  "faqs": [
    {
      "id": "timezone-converter-faq-1",
      "question": "Como converto um horário entre dois fusos horários?",
      "answer": "Informe data e hora, escolha origem e destino e veja imediatamente o horário convertido, o UTC e a diferença exata na data."
    },
    {
      "id": "timezone-converter-faq-2",
      "question": "Como aparece a diferença entre duas cidades?",
      "answer": "Mostra o valor exato (como +13:00 ou +5:30) e a relação direta calculada para a data escolhida."
    },
    {
      "id": "timezone-converter-faq-3",
      "question": "Considera horário de verão automaticamente?",
      "answer": "Sim. Utiliza a base IANA do seu navegador exatamente para a data digitada."
    },
    {
      "id": "timezone-converter-faq-4",
      "question": "Por que o horário convertido mostra outro dia?",
      "answer": "Quando os fusos são distantes, o fim da tarde nas Américas já corresponde à manhã do dia seguinte na Ásia."
    },
    {
      "id": "timezone-converter-faq-5",
      "question": "Meus horários de voos ou reuniões vão para a internet?",
      "answer": "Não. Toda resolução ocorre localmente no navegador sem enviar dados a servidores."
    }
  ]
};
