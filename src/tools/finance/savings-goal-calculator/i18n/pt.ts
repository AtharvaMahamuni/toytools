import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "savings-goal-calculator",
  "name": "Calculadora de Meta Financeira",
  "seoTitle": "Calculadora de Meta de Economia Mensal",
  "description": "Descubra quanto poupar por mês para alcançar seu objetivo financeiro no prazo certo, somando saldo atual e rendimento esperado.",
  "tagline": "Quanto guardar por mês para atingir sua meta no prazo.",
  "methodology": {
    "name": "Cálculo inverso de anuidade",
    "detail": "Encontra a parcela mensal exata para atingir o alvo somando rendimentos do valor já poupado."
  },
  "knowledge": {
    "primaryConcepts": [
      "meta de economia"
    ],
    "realWorldUseCases": [
      "Planejar entrada de imóvel",
      "Organizar orçamento de casamento ou viagem",
      "Definir transferência mensal automática",
      "Testar se o prazo cabe no orçamento"
    ],
    "commonMistakes": [
      "Assumir taxa irreal para prazos curtos",
      "Esquecer de incluir o valor já guardado"
    ]
  },
  "faqs": [
    {
      "id": "sg-faq-1",
      "question": "Quanto devo poupar por mês para bater a meta?",
      "answer": "O valor mensal depende da meta, do saldo já reservado, da taxa esperada e do prazo em anos."
    },
    {
      "id": "sg-faq-2",
      "question": "Como o rendimento diminui o esforço mensal?",
      "answer": "Parte da meta passa a ser coberta pelos juros compostos sobre seu saldo e aportes."
    },
    {
      "id": "sg-faq-3",
      "question": "Qual taxa de retorno usar?",
      "answer": "Para prazos curtos de 1 a 2 anos seja conservador; para prazos longos teste cenários moderados."
    },
    {
      "id": "sg-faq-4",
      "question": "O que acontece se eu começar mais tarde?",
      "answer": "Com menos tempo de juros compostos, a parcela mensal exigida sobe rapidamente."
    },
    {
      "id": "sg-faq-5",
      "question": "Devo incluir o dinheiro que já tenho guardado?",
      "answer": "Sim, ele continua rendendo até o final do prazo e reduz o aporte mensal necessário."
    },
    {
      "id": "sg-faq-6",
      "question": "Devo montar a reserva de emergência antes?",
      "answer": "Sim, ter uma reserva evita resgatar objetivos no meio do caminho por causa de imprevistos."
    },
    {
      "id": "sg-faq-7",
      "question": "A calculadora considera a inflação?",
      "answer": "Não diretamente; para metas longas ajuste antes o valor alvo na calculadora de inflação."
    },
    {
      "id": "sg-faq-8",
      "question": "Os números saem do meu navegador?",
      "answer": "Não, todo cálculo ocorre localmente no dispositivo."
    }
  ],
  "guide": {
    "title": "Como atingir uma meta de economia mensal",
    "description": "Fórmula da parcela mensal, efeito do prazo e cuidados com taxas e inflação."
  },
  "ui": {
    "scenarios": {
      "Home down payment": "Entrada imóvel",
      "Wedding": "Casamento",
      "New car": "Carro novo"
    },
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "heroLabel": "Guarde por mês",
      "heroNoteTpl": "por {months} meses",
      "cardInvested": "Total contribuído",
      "cardInterest": "Ganho de rendimento",
      "cardGoal": "Meta",
      "errMinMonths": "Informe ao menos alguns meses para poupar.",
      "insMet": "Sua economia atual já alcança essa meta.",
      "insReturnsTpl": "Os rendimentos cobrem {interest} do objetivo, exigindo menos esforço do seu bolso.",
      "insEarlier": "Começar mais cedo deixa os juros trabalharem por você e reduz o valor mensal.",
      "msMet": "Meta já alcançada",
      "msReturns": "Rendimento ajuda a bater a meta",
      "asmRate": "Retorno esperado",
      "asmHorizon": "Prazo",
      "asmStart": "Saldo inicial",
      "decCompound": "Acompanhar evolução composta mês a mês",
      "decInflation": "Ajustar meta frente à inflação",
      "decEmergency": "Conferir reserva de emergência antes",
      "q1": "E se o retorno ficar abaixo do esperado?",
      "q2": "Como a inflação altera minha meta?",
      "expMetTpl": "Com {current} já guardados você já superou a meta de {goal}.",
      "explanationTpl": "Para juntar {goal} em {years} {unit} começando com {current} e retorno de {rate}, poupe {monthly} por mês.",
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
    "yearOne": "ano",
    "yearMany": "anos",
    "heroLabel": "Guarde por mês",
    "heroNoteTpl": "por {months} meses",
    "cardInvested": "Total contribuído",
    "cardInterest": "Ganho de rendimento",
    "cardGoal": "Meta",
    "errMinMonths": "Informe ao menos alguns meses para poupar.",
    "insMet": "Sua economia atual já alcança essa meta.",
    "insReturnsTpl": "Os rendimentos cobrem {interest} do objetivo, exigindo menos esforço do seu bolso.",
    "insEarlier": "Começar mais cedo deixa os juros trabalharem por você e reduz o valor mensal.",
    "msMet": "Meta já alcançada",
    "msReturns": "Rendimento ajuda a bater a meta",
    "asmRate": "Retorno esperado",
    "asmHorizon": "Prazo",
    "asmStart": "Saldo inicial",
    "decCompound": "Acompanhar evolução composta mês a mês",
    "decInflation": "Ajustar meta frente à inflação",
    "decEmergency": "Conferir reserva de emergência antes",
    "q1": "E se o retorno ficar abaixo do esperado?",
    "q2": "Como a inflação altera minha meta?",
    "expMetTpl": "Com {current} já guardados você já superou a meta de {goal}.",
    "explanationTpl": "Para juntar {goal} em {years} {unit} começando com {current} e retorno de {rate}, poupe {monthly} por mês.",
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
    "goal": {
      "label": "Meta financeira"
    },
    "current": {
      "label": "Economia atual"
    },
    "rate": {
      "label": "Retorno anual esperado"
    },
    "years": {
      "label": "Prazo (anos)",
      "unit": "anos"
    }
  }
};
