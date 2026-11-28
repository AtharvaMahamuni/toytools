import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "roi-calculator",
  "name": "Calculadora de ROI",
  "seoTitle": "Calculadora de ROI: Retorno e Taxa Anualizada",
  "description": "Calcule o Retorno sobre Investimento (ROI), o lucro líquido e o rendimento anualizado pelo período investido direto no navegador.",
  "tagline": "Retorno sobre o investimento e taxa anual equivalente.",
  "methodology": {
    "name": "ROI com anualização",
    "detail": "Divide o ganho líquido pelo valor investido e converte em taxa anual composta pelo prazo."
  },
  "knowledge": {
    "primaryConcepts": [
      "retorno sobre investimento (ROI)"
    ],
    "realWorldUseCases": [
      "Conferir o retorno real de uma ação após a venda",
      "Comparar venda de imóvel contra renda variável indexada",
      "Avaliar se um projeto pagou o capital investido",
      "Traduzir ganhos de vários anos para taxa anual comparável"
    ],
    "commonMistakes": [
      "Comparar ROI bruto de prazos diferentes sem anualizar",
      "Deixar custos, tributos e dividendos fora da conta"
    ]
  },
  "faqs": [
    {
      "id": "roi-faq-1",
      "question": "Como o ROI é calculado?",
      "answer": "ROI% = ((Valor final − Valor investido) / Valor investido) × 100. Transformar 10.000 em 15.000 resulta em 50%."
    },
    {
      "id": "roi-faq-2",
      "question": "O que é um bom ROI?",
      "answer": "Depende do tempo investido: 50% em 1 ano é excelente, mas em 15 anos dá cerca de 2,7% ao ano. Avalie sempre pelo retorno anualizado."
    },
    {
      "id": "roi-faq-3",
      "question": "Qual a diferença entre ROI e retorno anualizado?",
      "answer": "O ROI mede o ganho acumulado total; o retorno anualizado converte esse ganho em uma taxa anual composta comparável."
    },
    {
      "id": "roi-faq-4",
      "question": "A calculadora aceita prejuízos?",
      "answer": "Sim. Valores finais abaixo do investido mostram ROI negativo e a perda financeira exata."
    },
    {
      "id": "roi-faq-5",
      "question": "Devo incluir corretagem, impostos e dividendos?",
      "answer": "Sim: some custos de aquisição ao valor investido e adicione proventos líquidos ao valor final para obter o retorno real."
    },
    {
      "id": "roi-faq-6",
      "question": "Qual a diferença entre ROI e CAGR?",
      "answer": "ROI responde quanto se ganhou no total; CAGR traduz esse resultado na taxa anual composta equivalente."
    },
    {
      "id": "roi-faq-7",
      "question": "Os números saem do meu dispositivo?",
      "answer": "Não. O cálculo é realizado exclusivamente no seu navegador."
    }
  ],
  "guide": {
    "title": "Como calcular ROI e retorno anualizado",
    "description": "Fórmula do ROI, por que comparar prazos pela taxa anual e como considerar custos e dividendos."
  },
  "ui": {
    "scenarios": {
      "Stock position": "Ação na bolsa",
      "Property sale": "Venda de imóvel",
      "Losing trade": "Operação no prejuízo"
    },
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "yrUnit": "ano",
      "notSpecified": "não informado",
      "heroLabel": "Retorno (ROI)",
      "noteGainTpl": "ganho de {amt}",
      "noteLossTpl": "perda de {amt}",
      "cardGain": "Lucro líquido",
      "cardLoss": "Prejuízo líquido",
      "cardFinal": "Valor final",
      "cardAnnualized": "Retorno anualizado",
      "insGainTpl": "Cada {base} investido retornou como {back}.",
      "insLossTpl": "Esta posição perdeu {loss}, recuo de {pct} sobre o capital aplicado.",
      "insAnnualTpl": "O ROI simples ignora o tempo. Em {years} anos isso equivale a {annual} ao ano.",
      "insNoPeriod": "Informe os anos para ver a taxa anual equivalente.",
      "msDoubled": "Investimento pelo menos dobrou",
      "msAhead": "Resultado positivo",
      "asmFigures": "Valores",
      "asmFiguresVal": "antes de impostos e taxas",
      "asmCash": "Fluxo",
      "asmCashVal": "uma aplicação inicial e uma saída final",
      "asmPeriod": "Prazo",
      "decCagr": "Analisar a taxa pura no cálculo de CAGR",
      "decCompound": "Projetar o saldo nos próximos anos",
      "decInflation": "Conferir ganho frente à inflação",
      "q1": "Qual taxa anual esse ganho representa?",
      "q2": "Como se compara a um índice de ações?",
      "returnWord": "retorno",
      "lossWord": "prejuízo",
      "expAnnualTpl": " ({annual} ao ano em {years} {unit})",
      "explanationTpl": "Você aplicou {cost} e terminou com {final}, um {dir} de {pct}{annualClause}.",
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
    "yrUnit": "ano",
    "notSpecified": "não informado",
    "heroLabel": "Retorno (ROI)",
    "noteGainTpl": "ganho de {amt}",
    "noteLossTpl": "perda de {amt}",
    "cardGain": "Lucro líquido",
    "cardLoss": "Prejuízo líquido",
    "cardFinal": "Valor final",
    "cardAnnualized": "Retorno anualizado",
    "insGainTpl": "Cada {base} investido retornou como {back}.",
    "insLossTpl": "Esta posição perdeu {loss}, recuo de {pct} sobre o capital aplicado.",
    "insAnnualTpl": "O ROI simples ignora o tempo. Em {years} anos isso equivale a {annual} ao ano.",
    "insNoPeriod": "Informe os anos para ver a taxa anual equivalente.",
    "msDoubled": "Investimento pelo menos dobrou",
    "msAhead": "Resultado positivo",
    "asmFigures": "Valores",
    "asmFiguresVal": "antes de impostos e taxas",
    "asmCash": "Fluxo",
    "asmCashVal": "uma aplicação inicial e uma saída final",
    "asmPeriod": "Prazo",
    "decCagr": "Analisar a taxa pura no cálculo de CAGR",
    "decCompound": "Projetar o saldo nos próximos anos",
    "decInflation": "Conferir ganho frente à inflação",
    "q1": "Qual taxa anual esse ganho representa?",
    "q2": "Como se compara a um índice de ações?",
    "returnWord": "retorno",
    "lossWord": "prejuízo",
    "expAnnualTpl": " ({annual} ao ano em {years} {unit})",
    "explanationTpl": "Você aplicou {cost} e terminou com {final}, um {dir} de {pct}{annualClause}.",
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
    "cost": {
      "label": "Valor investido"
    },
    "final": {
      "label": "Valor final",
      "help": "Quanto vale hoje ou por quanto foi vendido."
    },
    "years": {
      "label": "Prazo mantido",
      "unit": "anos",
      "help": "Opcional. Exibe a taxa anual para comparar investimentos."
    }
  }
};
