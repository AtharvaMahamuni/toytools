import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de gordura corporal",
  "seoTitle": "Calculadora Gordura Corporal - Método Marinha EUA",
  "description": "Estime seu percentual de gordura corporal com fita métrica pelo método da Marinha dos EUA, além de massa gorda e massa magra.",
  "tagline": "Percentual de gordura corporal na fita métrica, mais massa gorda e magra.",
  "lead": "Calcule seu percentual de gordura, faixa ACE e massa gorda versus massa magra no navegador sem enviar medidas a servidores.",
  "craft": {
    "solves": "Medidas com fita métrica variam 3 a 4 pontos conforme o aperto; por isso a tendência semanal é muito mais confiável que uma leitura única."
  },
  "guide": {
    "title": "Como medir gordura corporal com fita métrica",
    "description": "Entenda o método da Marinha dos EUA, onde medir pescoço, cintura e quadril, precisão esperada e diferença para o IMC."
  },
  "fields": {
    "unit": {
      "label": "Unidades",
      "options": {
        "metric": "Métrico (cm, kg)",
        "imperial": "Imperial (in, lb)"
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
      "help": "Centímetros no métrico, polegadas no imperial."
    },
    "neck": {
      "label": "Circunferência do pescoço",
      "help": "Medida logo abaixo do pomo de Adão."
    },
    "waist": {
      "label": "Circunferência da cintura",
      "help": "Homens na altura do umbigo; mulheres no ponto mais estreito."
    },
    "hip": {
      "label": "Circunferência do quadril",
      "help": "Apenas mulheres, na parte mais larga (ignorado para homens)."
    },
    "weight": {
      "label": "Peso corporal (opcional)",
      "help": "Adicione para dividir em massa gorda e massa magra."
    }
  },
  "ui": {
    "emptyText": "Informe altura e medidas de pescoço e cintura (mais quadril para mulheres) para estimar sua gordura corporal.",
    "engine": {
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} deve ser um número.",
      "errMinTpl": "{label} não pode ser menor que {min}.",
      "errMaxTpl": "{label} não pode ser maior que {max}.",
      "errPositiveTpl": "{label} deve ser maior que zero.",
      "fieldUnit": "seu sistema de unidades",
      "fieldSex": "o sexo para a fórmula",
      "fieldHeight": "sua altura",
      "fieldNeck": "a medida do pescoço",
      "fieldWaist": "a medida da cintura",
      "fieldHip": "a medida do quadril",
      "fieldWeight": "seu peso corporal",
      "errWaistNeck": "Sua cintura deve ser maior que o pescoço. Confira as medidas.",
      "errWaistHipNeck": "Cintura mais quadril devem superar o pescoço. Confira os dados.",
      "errInvalidEst": "Essas medidas não produzem uma estimativa válida. Tente conferir.",
      "heroLabel": "Gordura corporal",
      "cardCat": "Categoria",
      "cardFat": "Massa gorda",
      "cardLean": "Massa magra",
      "men": "homens",
      "women": "mulheres",
      "cats": {
        "essential": "Essencial",
        "athletes": "Atletas",
        "fitness": "Fitness",
        "average": "Média",
        "obese": "Acima da média"
      },
      "insCatTpl": "Sua estimativa de {bf}% está na faixa \"{cat}\" da escala ACE para {sex}.",
      "insTape": "O método da fita possui margem de alguns pontos percentuais. Meça no mesmo horário sem apertar a pele e acompanhe a tendência.",
      "vizTitleTpl": "Sua gordura corporal de {bf}% na escala ACE",
      "vizDescTpl": "Faixas ACE para {sex}. Acompanhe a evolução ao longo das semanas.",
      "asmMethod": "Método",
      "asmMethodVal": "Circunferências Marinha dos EUA",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (cm, kg)",
      "asmImp": "imperial (in, lb)",
      "asmCats": "Categorias",
      "asmCatsVal": "American Council on Exercise",
      "decBmi": "Comparar com seu IMC",
      "decTdee": "Calcular seu gasto TDEE",
      "decTrack": "Registrar evolução semanal de peso",
      "q1": "Qual é um percentual saudável de gordura corporal?",
      "q2": "Qual a precisão do método Navy?",
      "q3": "Qual a diferença entre gordura corporal e IMC?",
      "explanation": "O método da Marinha dos EUA estima o percentual de gordura comparando medidas de pescoço, cintura (e quadril nas mulheres) à altura. É rápido e prático para acompanhar evolução semanal com uma fita métrica comum."
    }
  },
  "knowledge": {
    "summary": "Estima o percentual de gordura corporal pelo método US Navy com circunferências, mais massa gorda e massa magra.",
    "useCases": [
      "Acompanhar mudanças corporais quando a balança pouco se mexe",
      "Monitorar preservação de massa magra durante perda de peso",
      "Complementar o IMC em pessoas musculosas"
    ],
    "mistakes": [
      "Apertar demais a fita ou encolher a barriga na leitura",
      "Comparar medidas tiradas em horários muito distintos",
      "Esperar precisão idêntica a exame DEXA de clínica"
    ]
  },
  "faqs": [
    {
      "id": "body-fat-calculator-faq-1",
      "question": "Como funciona o método da Marinha dos EUA?",
      "answer": "Compara medidas de pescoço, cintura (e quadril em mulheres) contra a estatura usando equações calibradas com pesagem hidrostática."
    },
    {
      "id": "body-fat-calculator-faq-2",
      "question": "Onde exatamente devo medir?",
      "answer": "Pescoço logo abaixo do pomo; cintura no umbigo para homens e na menor circunferência para mulheres; quadril na porção mais larga."
    },
    {
      "id": "body-fat-calculator-faq-3",
      "question": "Qual é a precisão desse cálculo?",
      "answer": "Em medições consistentes costuma ficar entre 3 e 4 pontos percentuais de um exame clínico de referência."
    },
    {
      "id": "body-fat-calculator-faq-4",
      "question": "Qual é um percentual de gordura saudável?",
      "answer": "Pela tabela ACE, a faixa fitness gira em torno de 14-17% para homens e 21-24% para mulheres."
    },
    {
      "id": "body-fat-calculator-faq-5",
      "question": "Como a gordura corporal difere do IMC?",
      "answer": "O IMC considera apenas peso e altura sem separar músculo de gordura; esta ferramenta calcula também massa gorda e magra."
    },
    {
      "id": "body-fat-calculator-faq-6",
      "question": "Meus dados ficam privados?",
      "answer": "Sim. Todo cálculo roda localmente no navegador sem enviar ou salvar suas medidas."
    }
  ]
};
