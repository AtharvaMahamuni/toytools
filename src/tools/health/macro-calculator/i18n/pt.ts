import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de macros",
  "seoTitle": "Calculadora de Macros - Proteína, Carbo e Gordura",
  "description": "Divida sua meta diária de calorias em gramas de proteínas, carboidratos e gorduras com perfis equilibrado, proteico, low-carb ou keto.",
  "tagline": "Divida suas calorias em proteínas, carboidratos e gorduras.",
  "lead": "Converta sua meta calórica em gramas exatos de proteína, carboidratos e gorduras conforme seu estilo alimentar direto no navegador.",
  "craft": {
    "solves": "Muitas pessoas escolhem porcentagens aleatórias que não somam 100%, criando déficits ou superávits involuntários."
  },
  "guide": {
    "title": "Como calcular seus macronutrientes pelas calorias",
    "description": "Entenda o que são macros, como converter calorias em gramas de proteína, carboidratos e gorduras e como escolher uma divisão sustentável."
  },
  "fields": {
    "calories": {
      "label": "Calorias diárias",
      "suffix": "kcal",
      "help": "Sua meta calórica diária (calcule pelo TDEE se ainda não tiver)."
    },
    "diet": {
      "label": "Estilo de dieta",
      "options": {
        "balanced": "Equilibrada (45% carb. / 25% prot. / 30% gord.)",
        "high-protein": "Alta proteína (40 / 35 / 25)",
        "low-carb": "Low-Carb (25 / 35 / 40)",
        "keto": "Cetogênica / Keto (5 / 25 / 70)"
      }
    }
  },
  "ui": {
    "emptyText": "Informe suas calorias diárias e escolha um estilo de dieta para calcular proteínas, carboidratos e gorduras.",
    "engine": {
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} deve ser um número.",
      "errMinTpl": "{label} não pode ser menor que {min}.",
      "errMaxTpl": "{label} não pode ser maior que {max}.",
      "fieldDiet": "um estilo de dieta",
      "fieldCalories": "suas calorias diárias",
      "errCalZero": "Digite uma meta de calorias acima de zero.",
      "heroProtein": "Proteína",
      "notePctKcalTpl": "{pct}% de {kcal} kcal",
      "notePctTpl": "{pct}% das calorias",
      "cardCarb": "Carboidratos",
      "cardFat": "Gorduras",
      "cardSplit": "Divisão (C/P/G)",
      "vizCarb": "Carboidratos",
      "vizProtein": "Proteína",
      "vizFat": "Gorduras",
      "vizTitle": "Sua divisão de macros",
      "vizDescTpl": "{carb}% carboidratos, {protein}% proteína, {fat}% gorduras em {kcal} kcal.",
      "diets": {
        "balanced": "Equilibrada",
        "high-protein": "Alta proteína",
        "low-carb": "Low-Carb",
        "keto": "Cetogênica"
      },
      "insSplitTpl": "No perfil {diet} com {kcal} kcal, são cerca de {protein} g de proteína, {carb} g de carboidratos e {fat} g de gordura.",
      "insEnergy": "Proteína e carboidratos têm 4 kcal/g e gorduras 9 kcal/g. Escolha uma proporção sustentável para você.",
      "insTotal": "Atingir o total diário de calorias importa mais do que acertar cada grama perfeitamente.",
      "asmDiet": "Estilo de dieta",
      "asmEnergy": "Energia por grama",
      "asmEnergyVal": "proteína 4, carb 4, gordura 9 kcal",
      "decTdee": "Calcular primeiro seu gasto TDEE",
      "decBmi": "Conferir também seu IMC",
      "q1": "Quantas calorias devo consumir por dia?",
      "q2": "De quanta proteína preciso diariamente?",
      "q3": "Qual divisão de macros ajuda no emagrecimento?",
      "explanation": "Os três macronutrientes fornecem 4 kcal/g (proteína e carboidratos) e 9 kcal/g (gorduras). A partir da soma exata de 100%, você vê as metas diárias em gramas."
    }
  },
  "knowledge": {
    "summary": "Transforma uma meta de calorias em gramas de proteína, carboidratos e gorduras com presets equilibrado, alto teor proteico, low-carb ou keto.",
    "useCases": [
      "Traduzir uma meta TDEE em metas práticas de refeição",
      "Comparar rapidamente os gramas entre perfil equilibrado e cetogênico",
      "Planejar cardápios de definição ou ganho de massa"
    ],
    "mistakes": [
      "Escolher porcentagens que não fecham exatamente 100%",
      "Olhar apenas percentuais sem checar proteína por quilo corporal",
      "Obsessão por gramas exatos deixando o total calórico de lado"
    ]
  },
  "faqs": [
    {
      "id": "macro-calculator-faq-1",
      "question": "Como calculo meus macronutrientes?",
      "answer": "Multiplique suas calorias diárias pela porcentagem de cada macro e divida por 4 (proteína e carboidratos) ou 9 (gorduras)."
    },
    {
      "id": "macro-calculator-faq-2",
      "question": "Qual é uma boa divisão de macros para emagrecer?",
      "answer": "Uma divisão mais alta em proteína (como 40% carboidratos, 35% proteína e 25% gorduras) ajuda a manter músculos e saciedade."
    },
    {
      "id": "macro-calculator-faq-3",
      "question": "Quanta proteína devo consumir?",
      "answer": "Pessoas ativas costumam ficar bem entre 1,6 e 2,2 g por kg de peso corporal."
    },
    {
      "id": "macro-calculator-faq-4",
      "question": "Qual é a diferença entre os perfis de dieta?",
      "answer": "Equilibrada usa 45/25/30, Alta proteína eleva proteína para 35%, Low-Carb reduz carbo para 25% e Keto limita a 5%."
    },
    {
      "id": "macro-calculator-faq-5",
      "question": "Preciso bater os gramas exatamente?",
      "answer": "Não. Trate os valores como guias próximos mantendo o foco nas calorias totais e na proteína."
    },
    {
      "id": "macro-calculator-faq-6",
      "question": "Onde descubro minha meta calórica?",
      "answer": "Use nossa calculadora TDEE considerando altura, peso, idade e atividade."
    }
  ]
};
