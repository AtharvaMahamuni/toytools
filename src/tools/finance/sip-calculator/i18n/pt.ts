import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "sip-calculator",
  "name": "Calculadora SIP",
  "seoTitle": "Calculadora SIP: Investimento Mensal Recorrente",
  "description": "Simule o valor futuro de aportes mensais regulares (SIP), o total investido e o ganho com rendimento composto direto no seu navegador.",
  "tagline": "Valor futuro de investimentos mensais e ganho composto.",
  "methodology": {
    "name": "Valor futuro de anuidade",
    "detail": "Cada parcela mensal rende pelo prazo restante, tornando o tempo o maior fator do resultado."
  },
  "knowledge": {
    "primaryConcepts": [
      "plano de investimento sistemático"
    ],
    "realWorldUseCases": [
      "Planejar aplicações mensais recorrentes em fundos ou ETFs",
      "Estimar quanto uma reserva mensal do salário acumula no prazo",
      "Comparar parcelas mensais para metas de longo prazo",
      "Mostrar o ganho de começar a investir mais cedo"
    ],
    "commonMistakes": [
      "Tratar retorno elevado estimado como garantia",
      "Esquecer a inflação ao ler o saldo futuro"
    ]
  },
  "faqs": [
    {
      "id": "sip-faq-1",
      "question": "O que é um SIP?",
      "answer": "É um plano de investimento sistemático no qual você aplica um valor fixo todo mês em fundos ou carteiras, sem precisar tentar acertar o melhor dia do mercado."
    },
    {
      "id": "sip-faq-2",
      "question": "Como o valor final é calculado?",
      "answer": "Cada parcela mensal rende juros compostos até o fim do prazo pela fórmula FV = P · ((1 + i)^n − 1) / i."
    },
    {
      "id": "sip-faq-3",
      "question": "Qual taxa de retorno devo informar?",
      "answer": "Use uma expectativa conservadora compatível com o ativo. Renda variável diversificada costuma ser projetada em taxas moderadas de longo prazo."
    },
    {
      "id": "sip-faq-4",
      "question": "SIP é melhor que aporte único?",
      "answer": "Quando o valor já está disponível, o aporte único passa mais tempo investido. O SIP é ideal para quem investe parte do salário mensal e suaviza oscilações."
    },
    {
      "id": "sip-faq-5",
      "question": "O que é preço médio (cost averaging)?",
      "answer": "Com aportes fixos mensais você compra mais cotas quando os preços caem e menos quando sobem, reduzindo o risco de entrar tudo em um pico."
    },
    {
      "id": "sip-faq-6",
      "question": "Por que começar cedo faz tanta diferença?",
      "answer": "As primeiras parcelas permanecem investidas por todo o horizonte, aproveitando muito mais ciclos compostos."
    },
    {
      "id": "sip-faq-7",
      "question": "O cálculo desconta inflação ou impostos?",
      "answer": "Não. Mostra o valor bruto nominal. Utilize a calculadora de inflação para conferir o poder de compra real."
    },
    {
      "id": "sip-faq-8",
      "question": "Vale mais aumentar o valor mensal ou o prazo?",
      "answer": "Para o mesmo total investido, aumentar o prazo entrega um resultado bem maior graças ao efeito composto dos últimos anos."
    },
    {
      "id": "sip-faq-9",
      "question": "Por que dobrar o prazo mais que dobra o resultado?",
      "answer": "Porque os juros sobre juros aceleram de forma exponencial no terço final do plano."
    },
    {
      "id": "sip-faq-10",
      "question": "Por que o ganho é pequeno nos primeiros anos?",
      "answer": "No começo quase tudo ainda é dinheiro que saiu do seu bolso; a curva de rendimento só inclina após vários anos."
    },
    {
      "id": "sip-faq-11",
      "question": "Por que diverge do extrato real da corretora?",
      "answer": "Fundos reais têm oscilações diárias de cota, taxas de administração e datas distintas de liquidação."
    },
    {
      "id": "sip-faq-12",
      "question": "Meus valores financeiros ficam salvos em algum servidor?",
      "answer": "Não. Todo o processamento ocorre localmente no seu navegador."
    }
  ],
  "guide": {
    "title": "Como funciona um plano de investimento mensal (SIP)",
    "description": "Entenda preço médio, fórmula de aportes mensais e exemplos práticos em 10 e 20 anos."
  },
  "ui": {
    "scenarios": {
      "First salary SIP": "Primeiro salário",
      "Wealth building": "Construção de patrimônio",
      "Short-term goal": "Meta de curto prazo"
    },
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "heroLabel": "Valor acumulado",
      "heroNoteTpl": "após {years} {unit}",
      "cardGain": "Ganho de rendimento",
      "cardInvested": "Total investido",
      "cardMonths": "Parcelas mensais",
      "brkLump": "Aporte inicial",
      "brkMonthly": "Aportes mensais",
      "brkGrowth": "Rendimento",
      "insShareTpl": "O crescimento do mercado representa {pct}% do saldo final; o resto foi investido por você.",
      "insAvg": "Aplicar um valor fixo todo mês reduz o risco de entrar no topo, comprando mais cotas nas quedas.",
      "msDoubled": "Patrimônio dobrou os aportes",
      "msExceeds": "Rendimento supera o total investido",
      "asmRate": "Retorno esperado",
      "asmTiming": "Momento do aporte",
      "asmTimingVal": "fim de cada mês",
      "asmCompounding": "Capitalização",
      "asmMonthly": "mensal",
      "asmLump": "Aporte inicial",
      "none": "nenhum",
      "decInflation": "Veja o poder de compra real após a inflação",
      "decCompound": "Comparar com aporte único inicial",
      "decGoal": "Calcular aporte necessário para uma meta",
      "q1": "Qual aporte mensal preciso para bater uma meta?",
      "q2": "Qual a diferença de começar cinco anos antes?",
      "expLumpTpl": " mais um aporte inicial de {lump}",
      "explanationTpl": "Investindo {monthly} por mês{lumpClause} a {rate} ao ano, o total chega a {final} em {years} {unit} (investido: {invested}, ganho: {gain}).",
      "vizTitle": "Valor do investimento ao longo do tempo",
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
    "heroLabel": "Valor acumulado",
    "heroNoteTpl": "após {years} {unit}",
    "cardGain": "Ganho de rendimento",
    "cardInvested": "Total investido",
    "cardMonths": "Parcelas mensais",
    "brkLump": "Aporte inicial",
    "brkMonthly": "Aportes mensais",
    "brkGrowth": "Rendimento",
    "insShareTpl": "O crescimento do mercado representa {pct}% do saldo final; o resto foi investido por você.",
    "insAvg": "Aplicar um valor fixo todo mês reduz o risco de entrar no topo, comprando mais cotas nas quedas.",
    "msDoubled": "Patrimônio dobrou os aportes",
    "msExceeds": "Rendimento supera o total investido",
    "asmRate": "Retorno esperado",
    "asmTiming": "Momento do aporte",
    "asmTimingVal": "fim de cada mês",
    "asmCompounding": "Capitalização",
    "asmMonthly": "mensal",
    "asmLump": "Aporte inicial",
    "none": "nenhum",
    "decInflation": "Veja o poder de compra real após a inflação",
    "decCompound": "Comparar com aporte único inicial",
    "decGoal": "Calcular aporte necessário para uma meta",
    "q1": "Qual aporte mensal preciso para bater uma meta?",
    "q2": "Qual a diferença de começar cinco anos antes?",
    "expLumpTpl": " mais um aporte inicial de {lump}",
    "explanationTpl": "Investindo {monthly} por mês{lumpClause} a {rate} ao ano, o total chega a {final} em {years} {unit} (investido: {invested}, ganho: {gain}).",
    "vizTitle": "Valor do investimento ao longo do tempo",
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
    "monthly": {
      "label": "Aporte mensal"
    },
    "rate": {
      "label": "Retorno anual esperado"
    },
    "years": {
      "label": "Prazo do plano",
      "unit": "anos"
    },
    "initial": {
      "label": "Aporte inicial único",
      "help": "Opcional. Aplicado uma vez no início junto ao plano mensal."
    }
  }
};
