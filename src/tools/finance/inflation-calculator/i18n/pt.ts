import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "inflation-calculator",
  "name": "Calculadora de Inflação",
  "seoTitle": "Calculadora de Inflação: Poder de Compra Futuro",
  "description": "Veja quanto seu dinheiro vai valer no futuro após a inflação, o poder de compra perdido e o preço futuro equivalente sem sair do navegador.",
  "tagline": "Quanto seu dinheiro comprará no futuro e quanto os preços sobem.",
  "methodology": {
    "name": "Inflação composta",
    "detail": "A inflação se acumula geometricamente ano após ano, corroendo o poder de compra de forma acelerada."
  },
  "knowledge": {
    "primaryConcepts": [
      "inflação"
    ],
    "realWorldUseCases": [
      "Calcular o valor real de reservas para aposentadoria",
      "Medir o reajuste salarial necessário contra preços",
      "Atualizar metas financeiras para preços futuros",
      "Avaliar ganho real acima da inflação"
    ],
    "commonMistakes": [
      "Confundir valor nominal com poder de compra real",
      "Subestimar quanto a inflação composta acumula em 20+ anos"
    ]
  },
  "faqs": [
    {
      "id": "inf-faq-1",
      "question": "Quanto meu dinheiro valerá após a inflação?",
      "answer": "Divide-se o valor de hoje por (1 + inflação)^anos. Com 3% ao ano por 25 anos, 100.000 compram o equivalente a cerca de 47.761 atuais."
    },
    {
      "id": "inf-faq-2",
      "question": "Qual a diferença entre valor real e nominal?",
      "answer": "Nominal é o número impresso na conta; real é esse montante descontado da inflação para mostrar o poder de compra verdadeiro."
    },
    {
      "id": "inf-faq-3",
      "question": "Como a inflação afeta o dinheiro parado?",
      "answer": "Se a aplicação rende menos que a inflação, o saldo perde poder de compra todos os anos mesmo com valor nominal maior."
    },
    {
      "id": "inf-faq-4",
      "question": "Como calcular o custo futuro de um bem?",
      "answer": "Multiplique o preço atual por (1 + inflação)^anos. A 3% em 25 anos, algo de 100.000 custaria cerca de 209.378."
    },
    {
      "id": "inf-faq-5",
      "question": "Qual taxa de inflação devo usar?",
      "answer": "Economias maduras miram 2%–3% ao ano; no Brasil costuma-se simular de 4% a 6% ao ano para longo prazo."
    },
    {
      "id": "inf-faq-6",
      "question": "Como vencer a inflação?",
      "answer": "Obtendo retorno líquido após impostos superior à taxa de inflação, por exemplo com investimentos indexados ao IPCA ou carteiras diversificadas."
    },
    {
      "id": "inf-faq-7",
      "question": "Por que uma taxa pequena pesa tanto no longo prazo?",
      "answer": "Porque a inflação também é composta: mesmo 3% ao ano cortam mais da metade do poder de compra em 25 anos."
    }
  ],
  "guide": {
    "title": "Como a inflação afeta seu dinheiro",
    "description": "Exemplos práticos a 3%, 5% e 7% ao ano, diferença entre juro real e nominal e regra dos 72."
  },
  "ui": {
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "heroLabel": "Poder de compra futuro",
      "heroNoteTpl": "em dinheiro de hoje após {years} {unit}",
      "cardLost": "Valor perdido para a inflação",
      "cardLostPct": "Perda de poder de compra",
      "cardCost": "Preço futuro dos mesmos bens",
      "insPowerTpl": "A inflação reduz silenciosamente cerca de {pct} do poder de compra desse valor em {years} {unit}.",
      "insImpact": "Em prazos longos a inflação corrói mais do que parece, tornando essencial buscar retornos acima dela.",
      "msHalved": "Poder de compra caiu pela metade",
      "asmRate": "Taxa de inflação",
      "asmPeriod": "Período",
      "decCompound": "Encontre um rendimento acima da inflação",
      "decRule72": "Veja em quantos anos o valor dobra ou cai",
      "q1": "Qual rendimento preciso para superar a inflação?",
      "q2": "Quanto poupar a mais para compensar?",
      "explanationTpl": "Com {rate} de inflação anual, {amount} hoje terão poder de compra de {real} após {years} {unit}, enquanto os mesmos itens custarão {futureCost}.",
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
    "heroLabel": "Poder de compra futuro",
    "heroNoteTpl": "em dinheiro de hoje após {years} {unit}",
    "cardLost": "Valor perdido para a inflação",
    "cardLostPct": "Perda de poder de compra",
    "cardCost": "Preço futuro dos mesmos bens",
    "insPowerTpl": "A inflação reduz silenciosamente cerca de {pct} do poder de compra desse valor em {years} {unit}.",
    "insImpact": "Em prazos longos a inflação corrói mais do que parece, tornando essencial buscar retornos acima dela.",
    "msHalved": "Poder de compra caiu pela metade",
    "asmRate": "Taxa de inflação",
    "asmPeriod": "Período",
    "decCompound": "Encontre um rendimento acima da inflação",
    "decRule72": "Veja em quantos anos o valor dobra ou cai",
    "q1": "Qual rendimento preciso para superar a inflação?",
    "q2": "Quanto poupar a mais para compensar?",
    "explanationTpl": "Com {rate} de inflação anual, {amount} hoje terão poder de compra de {real} após {years} {unit}, enquanto os mesmos itens custarão {futureCost}.",
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
    "amount": {
      "label": "Valor hoje"
    },
    "rate": {
      "label": "Inflação anual"
    },
    "years": {
      "label": "Anos",
      "unit": "anos"
    }
  }
};
