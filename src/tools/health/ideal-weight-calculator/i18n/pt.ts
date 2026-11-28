import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de peso ideal",
  "seoTitle": "Calculadora de Peso Ideal - Devine e Faixa IMC",
  "description": "Calcule seu peso ideal pela altura e sexo com as fórmulas Devine, Robinson, Miller e Hamwi junto da faixa saudável de IMC.",
  "tagline": "Peso ideal por quatro fórmulas clássicas e faixa saudável de IMC.",
  "lead": "Compare as fórmulas médicas clássicas (Devine, Robinson, Miller e Hamwi) lado a lado com a faixa saudável moderna de IMC direto no navegador.",
  "craft": {
    "solves": "Cada fórmula aponta um valor fixo sem considerar massa muscular ou estrutura óssea; mostrar junto a faixa de IMC evita metas rígidas."
  },
  "guide": {
    "title": "Como interpretar fórmulas de peso ideal e faixa de IMC",
    "description": "Como funcionam Devine, Robinson, Miller e Hamwi, por que divergem entre si e por que pensar em faixa saudável funciona melhor."
  },
  "fields": {
    "unit": {
      "label": "Unidades",
      "options": {
        "metric": "Métrico (cm)",
        "imperial": "Imperial (in)"
      }
    },
    "sex": {
      "label": "Sexo",
      "options": {
        "male": "Masculino",
        "female": "Feminino"
      }
    },
    "height": {
      "label": "Altura",
      "help": "Centímetros no métrico, polegadas totais no imperial."
    }
  },
  "ui": {
    "emptyText": "Selecione unidades, sexo e altura para ver as quatro fórmulas e a faixa saudável de peso.",
    "engine": {
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} deve ser um número.",
      "errMinTpl": "{label} não pode ser menor que {min}.",
      "errMaxTpl": "{label} não pode ser maior que {max}.",
      "fieldUnit": "seu sistema de unidades",
      "fieldSex": "o sexo para as fórmulas",
      "fieldHeight": "sua altura",
      "errHeightZero": "Informe uma altura acima de zero para estimar o peso ideal.",
      "heroLabel": "Peso ideal",
      "heroNote": "média de quatro fórmulas",
      "cardHealthy": "Faixa saudável (IMC)",
      "cardDevine": "Fórmula de Devine",
      "cardRobinson": "Fórmula de Robinson",
      "cardMiller": "Fórmula de Miller",
      "cardHamwi": "Fórmula de Hamwi",
      "bandBelow": "Abaixo",
      "bandHealthy": "Faixa saudável",
      "bandAbove": "Acima",
      "insSpreadTpl": "As quatro fórmulas variam de {lo} a {hi}, com média de {avg}.",
      "insBandTpl": "Para sua altura, a faixa saudável de IMC (18,5 a 24,9) vai de {range}.",
      "insAnchor": "Essas equações consideram apenas altura e sexo, ignorando músculos e estrutura corporal. Use como referência central.",
      "vizTitleTpl": "Seu peso ideal frente à faixa saudável em {unit}",
      "vizDescTpl": "As fórmulas ficam entre {fRange}, dentro da faixa IMC {bRange}.",
      "vizHighlight": "as quatro fórmulas",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (cm)",
      "asmImp": "imperial (in)",
      "asmFormulas": "Fórmulas",
      "asmHealthy": "Faixa saudável",
      "asmHealthyVal": "IMC 18,5 a 24,9",
      "decBmi": "Conferir seu IMC atual",
      "decBf": "Estimar seu percentual de gordura",
      "decTrack": "Registrar evolução do peso",
      "q1": "Quanto devo pesar para minha altura?",
      "q2": "Peso ideal é o mesmo que peso saudável?",
      "q3": "Por que as fórmulas dão resultados diferentes?",
      "explanation": "As fórmulas Devine, Robinson, Miller e Hamwi surgiram décadas atrás para calcular dosagens médicas a partir de altura e sexo. Ao exibi-las junto à faixa saudável de IMC (18,5-24,9), você obtém uma âncora equilibrada e realista."
    }
  },
  "knowledge": {
    "summary": "Estima o peso ideal via Devine, Robinson, Miller e Hamwi junto da faixa saudável moderna de IMC.",
    "useCases": [
      "Visualizar uma faixa realista de peso segundo a altura",
      "Comparar lado a lado quatro fórmulas clínicas clássicas",
      "Definir uma meta sensata combinando com gordura corporal"
    ],
    "mistakes": [
      "Perseguir um único número exato como único saudável",
      "Ignorar massa muscular e estrutura física na leitura"
    ]
  },
  "faqs": [
    {
      "id": "ideal-weight-calculator-faq-1",
      "question": "Quanto devo pesar para minha altura?",
      "answer": "Não há um valor único exato. Mostramos a média de Devine, Robinson, Miller e Hamwi mais toda a faixa saudável do IMC (18,5 a 24,9)."
    },
    {
      "id": "ideal-weight-calculator-faq-2",
      "question": "Por que as fórmulas dão respostas diferentes?",
      "answer": "Foram criadas em épocas diferentes com pesos iniciais e incrementos distintos acima de 5 pés; Hamwi costuma dar mais alto e Miller mais baixo."
    },
    {
      "id": "ideal-weight-calculator-faq-3",
      "question": "Peso ideal é igual a peso saudável?",
      "answer": "Não exatamente: fórmulas antigas buscavam um alvo clínico único, enquanto saúde corresponde a um intervalo amplo de IMC."
    },
    {
      "id": "ideal-weight-calculator-faq-4",
      "question": "Essas fórmulas consideram músculos ou estrutura óssea?",
      "answer": "Não, apenas altura e sexo. Pessoas musculosas podem ficar acima da fórmula mantendo ótima composição corporal."
    },
    {
      "id": "ideal-weight-calculator-faq-5",
      "question": "Como usar isso para traçar um objetivo?",
      "answer": "Use a faixa saudável de IMC como zona-alvo e acompanhe sua média semanal de forma privada no navegador."
    }
  ]
};
