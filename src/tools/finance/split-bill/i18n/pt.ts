import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "split-bill",
  "name": "Dividir Conta",
  "seoTitle": "Dividir Conta do Restaurante com Gorjeta Exata",
  "description": "Divida a conta do jantar com gorjeta opcional entre 2 e 30 pessoas garantindo que os centavos restantes fechem a soma exata.",
  "tagline": "Divisão justa de conta e gorjeta que fecha o total exato.",
  "methodology": {
    "name": "Divisão exata com ajuste de resto",
    "detail": "Calcula a cota base igual para todos e soma o resto indivisível à última pessoa para fechar 100% da conta."
  },
  "knowledge": {
    "primaryConcepts": [
      "dividir conta"
    ],
    "realWorldUseCases": [
      "Dividir conta de jantar e gorjeta entre amigos"
    ],
    "commonMistakes": [
      "Arredondar cada parte isoladamente quebrando a soma final",
      "Confundir com calculadora de taxa de maquininha"
    ]
  },
  "faqs": [
    {
      "id": "bill-faq-1",
      "question": "O que faz o Dividir Conta?",
      "answer": "Divide uma conta de jantar com gorjeta opcional (0 a 30%) entre 2 e 30 pessoas garantindo soma exata."
    },
    {
      "id": "bill-faq-2",
      "question": "Como funciona o resto indivisível?",
      "answer": "Calcula na menor fração (paise/centavos), aplica a cota base a todos e soma o resto à última pessoa."
    },
    {
      "id": "bill-faq-3",
      "question": "Exemplo: 1000 com 10% entre 3 pessoas?",
      "answer": "Total de 1100 resulta em 366,66, 366,66 e 366,68 : fechando exatamente 1100."
    },
    {
      "id": "bill-faq-4",
      "question": "E se a conta dividir igualmente?",
      "answer": "Todos pagam exatamente a mesma quantia, sem resto extra."
    },
    {
      "id": "bill-faq-5",
      "question": "Quais percentuais de gorjeta são aceitos?",
      "answer": "Inteiros de 0 a 30% (em branco equivale a 0%)."
    },
    {
      "id": "bill-faq-6",
      "question": "Quantas pessoas podem dividir?",
      "answer": "De 2 a 30 pessoas em números inteiros."
    },
    {
      "id": "bill-faq-7",
      "question": "Salva listas ou contas?",
      "answer": "Não. Sem cadastro, sem lista de amigos e sem histórico."
    },
    {
      "id": "bill-faq-8",
      "question": "É uma ferramenta de taxa de pagamento?",
      "answer": "Não, apenas divisão de jantar com gorjeta escolhida."
    },
    {
      "id": "bill-faq-9",
      "question": "Meus dados vão para a nuvem?",
      "answer": "Não, tudo fica apenas no seu navegador."
    },
    {
      "id": "bill-faq-10",
      "question": "Dividir Conta vs Calculadora de Gorjeta",
      "answer": "A de gorjeta calcula apenas o total; esta divide o valor exato de cada pessoa."
    }
  ],
  "guide": {
    "title": "Como dividir a conta sem sobrar nem faltar centavos",
    "description": "Entenda a divisão em centavos/paise, limites de gorjeta opcional e diferença para calculadora de gorjeta."
  },
  "ui": {
    "engine": {
      "billNote1": "Se o total não dividir exatamente, a última pessoa assume os paise/centavos restantes para a soma fechar.",
      "billNote2": "Ferramenta simples de jantar sem cadastro nem histórico; nada sai do dispositivo.",
      "heroLabel": "Total com gorjeta",
      "eachLineTpl": "Cada pessoa paga {each}.",
      "noteEvenTpl": "{n} pessoas. {eachLine}",
      "noteOddTpl": "{n} pessoas. {eachLine} A última pessoa paga {last}.",
      "insEven": "Todas as partes têm o mesmo valor.",
      "insOdd": "A última pessoa assume os centavos/paise restantes.",
      "msSum": "As partes somam o total exato",
      "asmTip": "Gorjeta",
      "noTip": "Sem gorjeta",
      "asmPeople": "Pessoas",
      "asmRem": "Resto em paise",
      "decTip": "Calcular apenas a gorjeta à parte",
      "errBillEmpty": "Informe o valor total da conta.",
      "errBillNaN": "O valor da conta precisa ser um número.",
      "errBillPos": "A conta deve ser maior que zero.",
      "errBillDec": "Informe no máximo duas casas decimais.",
      "errBillCap": "Este valor ultrapassa o limite máximo da página.",
      "errPeopleEmpty": "Informe quantas pessoas vão dividir (2 a 30).",
      "errPeopleNaN": "Pessoas precisa ser um número.",
      "errPeopleInt": "Pessoas precisa ser um número inteiro.",
      "errPeopleRange": "Informe de 2 a 30 pessoas.",
      "errTipNaN": "A gorjeta precisa ser um número.",
      "errTipRange": "A gorjeta deve ficar entre 0 e 30%.",
      "errTipInt": "A gorjeta deve ser um número inteiro.",
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} precisa ser um número.",
      "errNotNegativeTpl": "{Label} não pode ser negativo. Informe 0 ou mais.",
      "errMinTpl": "{Label} não pode ser menor que {min}.",
      "errMaxTpl": "{Label} não pode ser maior que {max}.",
      "errPositiveTpl": "{label} deve ser maior que zero.",
      "yearSingular": "ano",
      "yearsPlural": "anos",
      "neverLabel": "nunca",
      "vLabels": {
        "amount": "o valor",
        "rate": "a taxa",
        "years": "os anos",
        "goal": "a meta de economia",
        "current": "a economia atual",
        "start": "o valor inicial",
        "end": "o valor final"
      }
    },
    "billNote1": "Se o total não dividir exatamente, a última pessoa assume os paise/centavos restantes para a soma fechar.",
    "billNote2": "Ferramenta simples de jantar sem cadastro nem histórico; nada sai do dispositivo.",
    "heroLabel": "Total com gorjeta",
    "eachLineTpl": "Cada pessoa paga {each}.",
    "noteEvenTpl": "{n} pessoas. {eachLine}",
    "noteOddTpl": "{n} pessoas. {eachLine} A última pessoa paga {last}.",
    "insEven": "Todas as partes têm o mesmo valor.",
    "insOdd": "A última pessoa assume os centavos/paise restantes.",
    "msSum": "As partes somam o total exato",
    "asmTip": "Gorjeta",
    "noTip": "Sem gorjeta",
    "asmPeople": "Pessoas",
    "asmRem": "Resto em paise",
    "decTip": "Calcular apenas a gorjeta à parte",
    "errBillEmpty": "Informe o valor total da conta.",
    "errBillNaN": "O valor da conta precisa ser um número.",
    "errBillPos": "A conta deve ser maior que zero.",
    "errBillDec": "Informe no máximo duas casas decimais.",
    "errBillCap": "Este valor ultrapassa o limite máximo da página.",
    "errPeopleEmpty": "Informe quantas pessoas vão dividir (2 a 30).",
    "errPeopleNaN": "Pessoas precisa ser um número.",
    "errPeopleInt": "Pessoas precisa ser um número inteiro.",
    "errPeopleRange": "Informe de 2 a 30 pessoas.",
    "errTipNaN": "A gorjeta precisa ser um número.",
    "errTipRange": "A gorjeta deve ficar entre 0 e 30%.",
    "errTipInt": "A gorjeta deve ser um número inteiro.",
    "errEnterTpl": "Informe {label} para calcular.",
    "errNotNumberTpl": "{label} precisa ser um número.",
    "errNotNegativeTpl": "{Label} não pode ser negativo. Informe 0 ou mais.",
    "errMinTpl": "{Label} não pode ser menor que {min}.",
    "errMaxTpl": "{Label} não pode ser maior que {max}.",
    "errPositiveTpl": "{label} deve ser maior que zero.",
    "yearSingular": "ano",
    "yearsPlural": "anos",
    "neverLabel": "nunca",
    "vLabels": {
      "amount": "o valor",
      "rate": "a taxa",
      "years": "os anos",
      "goal": "a meta de economia",
      "current": "a economia atual",
      "start": "o valor inicial",
      "end": "o valor final"
    }
  },
  "fields": {
    "bill": {
      "label": "Valor da conta",
      "help": "Aceita até duas casas decimais. Apenas para dividir a mesa."
    },
    "people": {
      "label": "Pessoas",
      "unit": "pessoas",
      "help": "De 2 a 30 pessoas."
    },
    "tip": {
      "label": "Gorjeta (%)",
      "help": "Opcional, inteiro de 0 a 30. Vazio = sem gorjeta."
    }
  }
};
