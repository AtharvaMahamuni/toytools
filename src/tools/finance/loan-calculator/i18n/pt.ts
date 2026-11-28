import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "loan-calculator",
  "name": "Calculadora de Empréstimo",
  "seoTitle": "Calculadora de Financiamento e Parcelas Online",
  "description": "Calcule a parcela mensal de um empréstimo ou financiamento, juros totais e economia com amortização extra direto no navegador.",
  "tagline": "Parcela mensal, juros totais e economia com pagamentos extras.",
  "methodology": {
    "name": "Tabela Price (taxa fixa)",
    "detail": "Divide a taxa anual por 12 meses; pagamentos adicionais abatem diretamente o saldo devedor."
  },
  "knowledge": {
    "primaryConcepts": [
      "calculadora de empréstimo",
      "parcela mensal"
    ],
    "realWorldUseCases": [
      "Conferir a parcela de um empréstimo pessoal antes de contratar",
      "Comparar financiamento imobiliário de 20 versus 30 anos",
      "Medir quanto uma amortização mensal extra economiza em juros",
      "Separar o valor de entrada do saldo financiado"
    ],
    "commonMistakes": [
      "Digitar taxa mensal como 2 no campo de taxa anual",
      "Confundir prazo em anos com número de meses",
      "Achar que amortização extra reduz o próximo boleto em vez do saldo"
    ]
  },
  "faqs": [
    {
      "id": "loan-faq-payment",
      "question": "Como a parcela mensal é calculada?",
      "answer": "Divide-se a taxa anual por 12 para aplicar a fórmula de parcelas fixas (Tabela Price). Por exemplo, 100.000 a 12% ao ano em 5 anos resultam em 2.224,44 por mês e 33.466,83 em juros."
    },
    {
      "id": "loan-faq-rate-unit",
      "question": "O que significa digitar 2% na taxa?",
      "answer": "Significa 2% ao ano (2% ao mês equivale a 24% ao ano). Abaixo de 3% ou acima de 36%, a calculadora alerta qual leitura foi aplicada."
    },
    {
      "id": "loan-faq-extra",
      "question": "Amortizar todo mês reduz os juros?",
      "answer": "Sim. O pagamento adicional abate diretamente o principal devido, reduzindo os juros futuros e encurtando o prazo."
    },
    {
      "id": "loan-faq-home",
      "question": "Financiamento imobiliário usa a mesma fórmula?",
      "answer": "Na modalidade prefixada (Tabela Price), sim: informe valor do imóvel, entrada e prazo em anos."
    },
    {
      "id": "loan-faq-left-out",
      "question": "Inclui seguro, IOF ou tarifas do banco?",
      "answer": "Não. O cálculo cobre apenas principal e juros nominais; taxas bancárias, seguros e tributos devem ser somados à parte."
    },
    {
      "id": "loan-faq-high-rate",
      "question": "Por que taxas extremas não quitam o saldo?",
      "answer": "Quando os juros mensais superam a amortização, a dívida não cai. Reduza a taxa, encurte o prazo ou adicione amortização extra."
    },
    {
      "id": "loan-faq-privacy",
      "question": "Meus dados do empréstimo ficam privados?",
      "answer": "Sim. Toda a simulação roda localmente no navegador sem enviar nada a servidores."
    }
  ],
  "guide": {
    "title": "Como funciona a parcela de um empréstimo fixo",
    "description": "Fórmula da Tabela Price, impacto da entrada e economia ao antecipar parcelas no saldo devedor."
  },
  "ui": {
    "scenarios": {
      "Personal loan": "Crédito pessoal",
      "Home loan, 15 years": "Imóvel 15 anos",
      "Home loan, 20 years": "Imóvel 20 anos",
      "Home loan, 30 years": "Imóvel 30 anos"
    },
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "monthOne": "mês",
      "monthMany": "meses",
      "none": "nenhum",
      "yearlyRateToken": "é uma taxa anual",
      "noteLowRateTpl": "{rate} é uma taxa anual. {rate} ao mês equivaleria a {annualized} ao ano, que não é o cálculo usado aqui.",
      "noteHighRateTpl": "{rate} é uma taxa anual, cerca de {monthly} ao mês. A parcela usa a taxa anual.",
      "errShortTerm": "O prazo mínimo é 1 mês (digite 0.08 para 1 mês ou 0.5 para 6 meses).",
      "errNoBorrow": "Com essa entrada não há valor restante a financiar.",
      "errUnpaid": "Com esta taxa e prazo a dívida nunca é quitada. Reduza os juros, encurte o prazo ou adicione amortização extra.",
      "underTpl": "Abaixo de {amt}",
      "heroLabel": "Parcela mensal",
      "cardBorrowed": "Valor financiado",
      "cardInterest": "Juros totais",
      "cardTotal": "Total pago",
      "cardPayoff": "Quitação",
      "cardSaved": "Juros economizados",
      "insExtraTpl": "Um extra de {extra} por mês quita em {payoff} e economiza {saved} em juros.",
      "insZero": "Com juros zero, o saldo é dividido igualmente pelos meses sem acréscimo.",
      "insShareTpl": "Os juros representam {pct}% do total pago no contrato.",
      "insTiny": "Os juros totais são menores que meio centavo.",
      "msPaid": "Financiamento quitado",
      "msShortened": "Amortização encurtou o prazo",
      "asmRate": "Taxa anual",
      "asmSchedule": "Cronograma",
      "asmScheduleVal": "Mensal (taxa anual dividida por 12).",
      "asmDown": "Entrada",
      "asmExtra": "Amortização extra",
      "asmExtraTpl": "{extra} mensais abatendo o saldo devedor",
      "brkPrincipal": "Principal",
      "brkInterest": "Juros",
      "decSip": "Veja quanto renderia investir esse valor mensalmente",
      "decCompound": "Simular um aporte único a juros compostos",
      "q1": "Quanto tempo antes o pagamento extra quita a dívida?",
      "q2": "Quanto essa parcela mensal renderia investida?",
      "expShortTpl": " Um pagamento extra de {extra} por mês quita tudo em {payoff}.",
      "explanationTpl": "Financiar {principal} a {rate} ao ano por {term} exige {payment} por mês e soma {interest} em juros.{shortened}",
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
        "principal": "o capital inicial",
        "rate": "a taxa de juros",
        "years": "o prazo em anos",
        "contribution": "o aporte mensal",
        "price": "o valor do bem ou empréstimo",
        "down": "a entrada",
        "extra": "o pagamento mensal extra",
        "monthly": "o aporte mensal",
        "initial": "o valor inicial",
        "cost": "o valor investido",
        "final": "o valor final",
        "amount": "o valor atual",
        "goal": "a meta de economia",
        "current": "a economia atual",
        "start": "o valor inicial",
        "end": "o valor final"
      }
    },
    "yearOne": "ano",
    "yearMany": "anos",
    "monthOne": "mês",
    "monthMany": "meses",
    "none": "nenhum",
    "yearlyRateToken": "é uma taxa anual",
    "noteLowRateTpl": "{rate} é uma taxa anual. {rate} ao mês equivaleria a {annualized} ao ano, que não é o cálculo usado aqui.",
    "noteHighRateTpl": "{rate} é uma taxa anual, cerca de {monthly} ao mês. A parcela usa a taxa anual.",
    "errShortTerm": "O prazo mínimo é 1 mês (digite 0.08 para 1 mês ou 0.5 para 6 meses).",
    "errNoBorrow": "Com essa entrada não há valor restante a financiar.",
    "errUnpaid": "Com esta taxa e prazo a dívida nunca é quitada. Reduza os juros, encurte o prazo ou adicione amortização extra.",
    "underTpl": "Abaixo de {amt}",
    "heroLabel": "Parcela mensal",
    "cardBorrowed": "Valor financiado",
    "cardInterest": "Juros totais",
    "cardTotal": "Total pago",
    "cardPayoff": "Quitação",
    "cardSaved": "Juros economizados",
    "insExtraTpl": "Um extra de {extra} por mês quita em {payoff} e economiza {saved} em juros.",
    "insZero": "Com juros zero, o saldo é dividido igualmente pelos meses sem acréscimo.",
    "insShareTpl": "Os juros representam {pct}% do total pago no contrato.",
    "insTiny": "Os juros totais são menores que meio centavo.",
    "msPaid": "Financiamento quitado",
    "msShortened": "Amortização encurtou o prazo",
    "asmRate": "Taxa anual",
    "asmSchedule": "Cronograma",
    "asmScheduleVal": "Mensal (taxa anual dividida por 12).",
    "asmDown": "Entrada",
    "asmExtra": "Amortização extra",
    "asmExtraTpl": "{extra} mensais abatendo o saldo devedor",
    "brkPrincipal": "Principal",
    "brkInterest": "Juros",
    "decSip": "Veja quanto renderia investir esse valor mensalmente",
    "decCompound": "Simular um aporte único a juros compostos",
    "q1": "Quanto tempo antes o pagamento extra quita a dívida?",
    "q2": "Quanto essa parcela mensal renderia investida?",
    "expShortTpl": " Um pagamento extra de {extra} por mês quita tudo em {payoff}.",
    "explanationTpl": "Financiar {principal} a {rate} ao ano por {term} exige {payment} por mês e soma {interest} em juros.{shortened}",
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
      "principal": "o capital inicial",
      "rate": "a taxa de juros",
      "years": "o prazo em anos",
      "contribution": "o aporte mensal",
      "price": "o valor do bem ou empréstimo",
      "down": "a entrada",
      "extra": "o pagamento mensal extra",
      "monthly": "o aporte mensal",
      "initial": "o valor inicial",
      "cost": "o valor investido",
      "final": "o valor final",
      "amount": "o valor atual",
      "goal": "a meta de economia",
      "current": "a economia atual",
      "start": "o valor inicial",
      "end": "o valor final"
    }
  },
  "fields": {
    "price": {
      "label": "Valor do bem ou empréstimo"
    },
    "down": {
      "label": "Entrada",
      "help": "Opcional. Subtraída do valor financiado."
    },
    "rate": {
      "label": "Taxa de juros anual"
    },
    "years": {
      "label": "Prazo",
      "unit": "anos",
      "help": "Para menos de 1 ano use fração: 0.5 equivale a 6 meses."
    },
    "extra": {
      "label": "Amortização mensal extra",
      "help": "Opcional. Somada à parcela para abater o saldo principal."
    }
  }
};
