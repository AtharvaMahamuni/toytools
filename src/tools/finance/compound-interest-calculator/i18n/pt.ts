import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "compound-interest-calculator",
  "name": "Calculadora de Juros Compostos",
  "seoTitle": "Calculadora de Juros Compostos Online",
  "description": "Calcule o rendimento de juros compostos com capital inicial e aportes mensais direto no navegador. Seus valores ficam no seu dispositivo.",
  "tagline": "Simule o crescimento do seu patrimônio com aportes mensais.",
  "methodology": {
    "name": "Fórmula de capitalização composta",
    "detail": "O montante segue FV = P(1 + r/n)^(n × t) somado ao valor futuro das contribuições mensais."
  },
  "knowledge": {
    "primaryConcepts": [
      "juros compostos"
    ],
    "realWorldUseCases": [
      "Projetar crescimento de reservas ou aplicações por vários anos",
      "Avaliar o peso de aportes mensais constantes no saldo final",
      "Comparar capitalização mensal contra anual",
      "Planejar aposentadoria ou fundo educacional"
    ],
    "commonMistakes": [
      "Confundir taxa anual com taxa do período",
      "Assumir rentabilidade composta fixa em renda variável"
    ]
  },
  "faqs": [
    {
      "id": "ci-faq-1",
      "question": "O que são juros compostos?",
      "answer": "São juros calculados sobre o capital inicial mais os juros acumulados nos períodos anteriores. Esse efeito de juros sobre juros acelera o crescimento ao longo do tempo."
    },
    {
      "id": "ci-faq-2",
      "question": "Como calcular juros compostos?",
      "answer": "Use a fórmula FV = P(1 + r/n)^(n × t), em que P é o valor inicial, r a taxa anual decimal, n as capitalizações ao ano e t os anos. Por exemplo, 10.000 a 7% ao ano (mensal) por 20 anos chegam a cerca de 40.387."
    },
    {
      "id": "ci-faq-3",
      "question": "Qual a diferença entre capitalização mensal e anual?",
      "answer": "Na capitalização mensal os juros passam a render antes, elevando ligeiramente o saldo final em comparação à anual. Ainda assim, taxa e prazo pesam bem mais."
    },
    {
      "id": "ci-faq-4",
      "question": "Juros compostos são o mesmo que CAGR?",
      "answer": "Não exatamente: juros compostos projetam o valor futuro a partir de uma taxa, enquanto o CAGR encontra a taxa anual constante que liga o valor inicial ao final."
    },
    {
      "id": "ci-faq-5",
      "question": "Juros compostos podem dar prejuízo?",
      "answer": "Na matemática da fórmula o saldo só cresce, mas investimentos reais variam de preço. Simule uma taxa conservadora e trate o valor como estimativa."
    },
    {
      "id": "ci-faq-6",
      "question": "Quanto os aportes mensais fazem diferença?",
      "answer": "Fazem enorme diferença em prazos longos: cada depósito mensal rende pelo resto do horizonte e muitas vezes ultrapassa o capital inicial."
    },
    {
      "id": "ci-faq-7",
      "question": "A calculadora desconta impostos ou taxas?",
      "answer": "Não. Ela mostra o crescimento bruto sem impostos, taxas de administração ou inflação."
    },
    {
      "id": "ci-faq-8",
      "question": "Quanto rende 1.000 a 5% em 10 anos?",
      "answer": "Cerca de 1.629 com capitalização anual ou 1.647 com capitalização mensal."
    },
    {
      "id": "ci-faq-9",
      "question": "Meus dados são enviados para algum servidor?",
      "answer": "Não. Todo cálculo acontece localmente no seu navegador e nada sai do seu dispositivo."
    }
  ],
  "guide": {
    "title": "Como funcionam os juros compostos",
    "description": "Entenda a fórmula dos juros compostos, a frequência de capitalização e o impacto dos aportes mensais."
  },
  "ui": {
    "scenarios": {
      "Retirement": "Aposentadoria",
      "Child education": "Educação",
      "Dream house": "Casa própria"
    },
    "engine": {
      "yearOne": "ano",
      "yearMany": "anos",
      "heroLabel": "Montante final",
      "heroNoteTpl": "após {years} {unit}",
      "cardInterest": "Juros acumulados",
      "cardPrincipal": "Capital inicial",
      "cardContrib": "Total em aportes",
      "brkPrincipal": "Capital inicial",
      "brkContrib": "Aportes",
      "brkInterest": "Juros",
      "freqs": {
        "1": "anual",
        "4": "trimestral",
        "12": "mensal",
        "365": "diária"
      },
      "insShareTpl": "Os juros respondem por {pct}% do montante final; o restante veio do seu próprio bolso.",
      "insContrib": "Em prazos longos, os aportes constantes combinados aos juros compostos superam o depósito inicial.",
      "msDoubled": "Patrimônio dobrado",
      "msExceeds": "Juros superam o valor investido",
      "asmRate": "Taxa anual",
      "asmCompounding": "Capitalização",
      "asmContrib": "Aporte",
      "moUnit": "mês",
      "none": "nenhum",
      "decInflation": "Veja quanto a inflação corrói desse valor",
      "decRule72": "Estime em quanto tempo o dinheiro dobra",
      "decGoal": "Calcule a partir de uma meta financeira",
      "q1": "Quanto preciso poupar por mês para atingir minha meta?",
      "q2": "Qual será o poder de compra real após a inflação?",
      "expContribTpl": " e adicionando {amount} por mês",
      "explanationTpl": "Com {principal}{contribClause} a {rate} ao ano (capitalização {freq}), o saldo chega a {final} em {years} {unit}.",
      "vizTitle": "Evolução do saldo ao longo do tempo",
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
    "heroLabel": "Montante final",
    "heroNoteTpl": "após {years} {unit}",
    "cardInterest": "Juros acumulados",
    "cardPrincipal": "Capital inicial",
    "cardContrib": "Total em aportes",
    "brkPrincipal": "Capital inicial",
    "brkContrib": "Aportes",
    "brkInterest": "Juros",
    "freqs": {
      "1": "anual",
      "4": "trimestral",
      "12": "mensal",
      "365": "diária"
    },
    "insShareTpl": "Os juros respondem por {pct}% do montante final; o restante veio do seu próprio bolso.",
    "insContrib": "Em prazos longos, os aportes constantes combinados aos juros compostos superam o depósito inicial.",
    "msDoubled": "Patrimônio dobrado",
    "msExceeds": "Juros superam o valor investido",
    "asmRate": "Taxa anual",
    "asmCompounding": "Capitalização",
    "asmContrib": "Aporte",
    "moUnit": "mês",
    "none": "nenhum",
    "decInflation": "Veja quanto a inflação corrói desse valor",
    "decRule72": "Estime em quanto tempo o dinheiro dobra",
    "decGoal": "Calcule a partir de uma meta financeira",
    "q1": "Quanto preciso poupar por mês para atingir minha meta?",
    "q2": "Qual será o poder de compra real após a inflação?",
    "expContribTpl": " e adicionando {amount} por mês",
    "explanationTpl": "Com {principal}{contribClause} a {rate} ao ano (capitalização {freq}), o saldo chega a {final} em {years} {unit}.",
    "vizTitle": "Evolução do saldo ao longo do tempo",
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
    "principal": {
      "label": "Valor inicial"
    },
    "rate": {
      "label": "Taxa de juros anual"
    },
    "frequency": {
      "label": "Capitalização",
      "options": {
        "1": "Anual",
        "4": "Trimestral",
        "12": "Mensal",
        "365": "Diária"
      }
    },
    "years": {
      "label": "Prazo (anos)",
      "unit": "anos"
    },
    "contribution": {
      "label": "Aporte mensal",
      "help": "Opcional. Adicionado ao final de cada mês."
    }
  }
};
