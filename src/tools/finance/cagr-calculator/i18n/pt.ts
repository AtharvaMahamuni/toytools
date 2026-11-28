import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "cagr-calculator",
  "name": "Calculadora CAGR",
  "seoTitle": "Calculadora CAGR: Taxa Anual Composta de Crescimento",
  "description": "Calcule o CAGR (taxa de crescimento anual composta), crescimento total, múltiplo e tempo para dobrar entre valor inicial e final.",
  "tagline": "Taxa anual composta (CAGR), múltiplo e tempo de dobra.",
  "methodology": {
    "name": "Taxa anual composta (CAGR)",
    "detail": "Encontra a taxa única (Final/Inicial)^(1/t) − 1 que liga os valores inicial e final no período."
  },
  "knowledge": {
    "primaryConcepts": [
      "CAGR (crescimento anual composto)"
    ],
    "realWorldUseCases": [
      "Anualizar retornos plurianuais de ações ou fundos",
      "Medir crescimento composto de faturamento empresarial",
      "Comparar investimentos de prazos distintos",
      "Validar projeções contra histórico"
    ],
    "commonMistakes": [
      "Dividir o ganho total pelos anos em vez de usar potência 1/t",
      "Usar CAGR quando houve aportes no meio do caminho"
    ]
  },
  "faqs": [
    {
      "id": "cagr-faq-1",
      "question": "O que é CAGR?",
      "answer": "É a taxa de crescimento anual composta que transforma o valor inicial no valor final de forma uniforme durante os t anos."
    },
    {
      "id": "cagr-faq-2",
      "question": "Como o CAGR é calculado?",
      "answer": "CAGR = (Valor final / Valor inicial)^(1 / anos) − 1. Passar de 10.000 para 25.000 em 10 anos dá cerca de 9,6% ao ano."
    },
    {
      "id": "cagr-faq-3",
      "question": "Por que é menor que dividir o crescimento total pelos anos?",
      "answer": "Porque os ganhos se acumulam uns sobre os outros anualmente, exigindo uma taxa anual menor para o mesmo resultado final."
    },
    {
      "id": "cagr-faq-4",
      "question": "Qual a diferença entre CAGR e ROI?",
      "answer": "ROI mostra o retorno total do período; CAGR expressa esse retorno como taxa anual equivalente comparável."
    },
    {
      "id": "cagr-faq-5",
      "question": "O CAGR pode ser negativo?",
      "answer": "Sim. Se o valor final ficar menor que o inicial, o CAGR mostra a taxa anual média de retração."
    },
    {
      "id": "cagr-faq-6",
      "question": "Quais as limitações do CAGR?",
      "answer": "Ele esconde a volatilidade no meio do caminho e distorce resultados se houve depósitos ou saques intermediários."
    },
    {
      "id": "cagr-faq-7",
      "question": "O que é tempo de dobra?",
      "answer": "É o prazo exato para multiplicar por 2 àquela taxa anual: ln(2) / ln(1 + CAGR), próximo de 72 dividido pelo percentual."
    },
    {
      "id": "cagr-faq-8",
      "question": "Como anualizar crescimento de vários anos?",
      "answer": "Eleve o múltiplo (Final / Inicial) a 1/anos e subtraia 1. Dobrar em 5 anos é 14,87% ao ano, não 20%."
    },
    {
      "id": "cagr-faq-9",
      "question": "Diferença entre CAGR e média aritmética anual?",
      "answer": "A média simples superestima em ativos voláteis (+100% e −50% dão +25% na média aritmética mas 0% em CAGR)."
    },
    {
      "id": "cagr-faq-10",
      "question": "Dois ativos com igual CAGR podem ter risco distinto?",
      "answer": "Sim: oscilações fortes no meio do caminho não aparecem no cálculo entre duas datas."
    },
    {
      "id": "cagr-faq-11",
      "question": "Por que o CAGR parece baixo perto do ganho total?",
      "answer": "400% (5×) em 20 anos corresponde a 8,4% ao ano devido à potência exponencial."
    },
    {
      "id": "cagr-faq-12",
      "question": "Os números saem do meu dispositivo?",
      "answer": "Não. Toda conta roda localmente no navegador."
    }
  ],
  "guide": {
    "title": "O que é CAGR e como calcular",
    "description": "Fórmula do CAGR, por que supera médias simples e ROI bruto, e quando evitar distorções."
  },
  "ui": {
    "scenarios": {
      "Index fund decade": "Década em índice",
      "Fast-growing revenue": "Receita em alta",
      "Slow saver": "Crescimento leve"
    },
    "engine": {
      "heroLabel": "CAGR (crescimento anual composto)",
      "heroNoteTpl": "ao ano em {period}",
      "cardGrowth": "Crescimento total",
      "cardDecline": "Queda total",
      "cardMultiple": "Múltiplo",
      "cardDoubles": "Dobra a cada",
      "insPosTpl": "Um avanço de {total} em {period} equivale a {cagr} ao ano : menos que dividir pelos anos por causa da composição.",
      "insNegTpl": "O valor caiu em média {cagr} ao ano ao longo deste intervalo.",
      "insShort": "Anualizar períodos abaixo de um ano extrapola uma janela curta; analise com cautela.",
      "insSmooth": "O CAGR assume trajetória uniforme e não revela oscilações intermediárias entre início e fim.",
      "msDoubled": "Valor ao menos dobrou",
      "msDoubleDigit": "Crescimento anual de dois dígitos",
      "asmGrowth": "Crescimento",
      "asmGrowthVal": "constante com capitalização anual",
      "asmCash": "Fluxos",
      "asmCashVal": "sem aportes ou resgates durante o período",
      "asmFigures": "Valores",
      "asmFiguresVal": "antes de impostos e taxas",
      "decRoi": "Ver retorno acumulado simples no ROI",
      "decRule72": "Estimar dobra pela Regra dos 72",
      "decCompound": "Projetar futuro usando esta taxa",
      "q1": "Quanto essa taxa renderia nos próximos dez anos?",
      "q2": "Este número está antes ou depois da inflação?",
      "gainWord": "alta",
      "declineWord": "queda",
      "explanationTpl": "Crescer de {start} para {end} em {period} resulta em CAGR de {cagr}, a taxa anual constante que gera essa mesma {dir}.",
      "vizTitle": "Curva anualizada equivalente",
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
    "heroLabel": "CAGR (crescimento anual composto)",
    "heroNoteTpl": "ao ano em {period}",
    "cardGrowth": "Crescimento total",
    "cardDecline": "Queda total",
    "cardMultiple": "Múltiplo",
    "cardDoubles": "Dobra a cada",
    "insPosTpl": "Um avanço de {total} em {period} equivale a {cagr} ao ano : menos que dividir pelos anos por causa da composição.",
    "insNegTpl": "O valor caiu em média {cagr} ao ano ao longo deste intervalo.",
    "insShort": "Anualizar períodos abaixo de um ano extrapola uma janela curta; analise com cautela.",
    "insSmooth": "O CAGR assume trajetória uniforme e não revela oscilações intermediárias entre início e fim.",
    "msDoubled": "Valor ao menos dobrou",
    "msDoubleDigit": "Crescimento anual de dois dígitos",
    "asmGrowth": "Crescimento",
    "asmGrowthVal": "constante com capitalização anual",
    "asmCash": "Fluxos",
    "asmCashVal": "sem aportes ou resgates durante o período",
    "asmFigures": "Valores",
    "asmFiguresVal": "antes de impostos e taxas",
    "decRoi": "Ver retorno acumulado simples no ROI",
    "decRule72": "Estimar dobra pela Regra dos 72",
    "decCompound": "Projetar futuro usando esta taxa",
    "q1": "Quanto essa taxa renderia nos próximos dez anos?",
    "q2": "Este número está antes ou depois da inflação?",
    "gainWord": "alta",
    "declineWord": "queda",
    "explanationTpl": "Crescer de {start} para {end} em {period} resulta em CAGR de {cagr}, a taxa anual constante que gera essa mesma {dir}.",
    "vizTitle": "Curva anualizada equivalente",
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
    "start": {
      "label": "Valor inicial"
    },
    "end": {
      "label": "Valor final"
    },
    "years": {
      "label": "Período",
      "unit": "anos"
    }
  }
};
