import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de ingestão de proteína",
  "seoTitle": "Calculadora de Proteína Diária - Gramas por Quilo",
  "description": "Calcule quanta proteína por dia seu peso corporal e objetivo de treino pedem, em g/kg e divisão diária por refeição.",
  "tagline": "A faixa diária de proteína ideal para seu peso e treino.",
  "lead": "Descubra sua faixa recomendada de proteína em gramas por dia, em g/kg e por refeição conforme seu objetivo físico no navegador.",
  "craft": {
    "solves": "A síntese proteica muscular responde por refeição; dividir a meta ao longo do dia funciona muito melhor do que concentrar tudo no jantar."
  },
  "guide": {
    "title": "Quanta proteína você realmente precisa por dia",
    "description": "Por que diretrizes trazem uma faixa em vez de número único, o que muda com o treino e por que dividir nas refeições importa."
  },
  "fields": {
    "unit": {
      "label": "Unidades",
      "options": {
        "metric": "Métrico (kg)",
        "imperial": "Imperial (lb)"
      }
    },
    "weight": {
      "label": "Peso corporal",
      "help": "Quilos no métrico, libras no imperial."
    },
    "goal": {
      "label": "Seu objetivo de treino",
      "options": {
        "sedentary": "Maioria sedentário, saúde geral",
        "active": "Geralmente ativo, sem treino fixo",
        "endurance": "Treino de resistência (corrida, ciclismo)",
        "strength": "Musculação ou ganho de força/massa",
        "fat-loss": "Perder gordura preservando músculos"
      }
    },
    "meals": {
      "label": "Refeições por dia",
      "suffix": "refeições"
    }
  },
  "ui": {
    "emptyText": "Informe seu peso corporal e objetivo de treino para ver a faixa de proteína recomendada.",
    "engine": {
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} deve ser um número.",
      "errMinTpl": "{label} não pode ser menor que {min}.",
      "errMaxTpl": "{label} não pode ser maior que {max}.",
      "fieldUnit": "seu sistema de unidades",
      "fieldGoal": "seu objetivo de treino",
      "fieldWeight": "seu peso corporal",
      "fieldMeals": "refeições por dia",
      "errWeightZero": "Informe um peso acima de zero para calcular a meta proteica.",
      "goals": {
        "sedentary": "saúde geral sedentária",
        "active": "atividade física geral",
        "endurance": "treino de resistência",
        "strength": "treino de força e hipertrofia",
        "fat-loss": "perda de gordura mantendo músculos"
      },
      "heroLabel": "Proteína por dia",
      "rangeTpl": "{lo} a {hi}",
      "cardMid": "Alvo central único",
      "cardMealTpl": "Por refeição em {n} refeições",
      "cardPerKg": "Gramas por quilo",
      "perKgTpl": "{lo} a {hi} g/kg",
      "cardKcal": "Calorias da proteína",
      "bandGen": "Saúde geral",
      "bandActive": "Ativo",
      "bandTrain": "Treino intenso",
      "bandCut": "Definição",
      "insRangeTpl": "Com {kg} kg e foco em {goal}, a meta fica entre {loKg} e {hiKg} g/kg ({lo} a {hi} ao dia).",
      "insMealTpl": "Distribuindo em {n} refeições, equivale a cerca de {meal} por refeição.",
      "insBand": "Estudos trabalham com faixas por causa das variações individuais; qualquer ponto dentro da sua faixa funciona muito bem.",
      "vizTitle": "Seu alvo na faixa das diretrizes (g/kg)",
      "vizDescTpl": "Sua faixa recomendada vai de {lo} a {hi} gramas por quilo.",
      "vizHighlight": "sua faixa",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (kg)",
      "asmImp": "imperial (lb)",
      "asmSource": "Fontes",
      "asmSourceVal": "Posicionamentos ISSN e ACSM",
      "asmBasis": "Base",
      "asmBasisVal": "peso total, não massa magra",
      "decMacro": "Converter em divisão completa de macros",
      "decTdee": "Calcular antes seu gasto TDEE",
      "decBf": "Refinar pela massa magra via gordura corporal",
      "q1": "Quanta proteína preciso por dia?",
      "q2": "Muita proteína faz mal?",
      "q3": "Calcular pelo peso total ou massa magra?",
      "explanation": "A necessidade proteica varia conforme peso e exigência muscular. O mínimo de 0,8 g/kg evita deficiência; posicionamentos da ISSN e ACSM apontam 1,2-1,6 g/kg para ativos e 1,6-2,2 g/kg para musculação."
    }
  },
  "knowledge": {
    "summary": "Calcula sua faixa diária de proteína por peso e objetivo, mostrando g/kg e divisão por refeição.",
    "useCases": [
      "Definir ingestão proteica para hipertrofia ou déficit calórico",
      "Fracionar o total diário em 3 a 5 refeições equilibradas",
      "Ajustar meta por peso total ou massa magra"
    ],
    "mistakes": [
      "Tomar 0,8 g/kg (mínimo nutricional) como ideal para quem treina",
      "Concentrar quase toda a proteína em uma única refeição noturna"
    ]
  },
  "faqs": [
    {
      "id": "protein-intake-calculator-faq-1",
      "question": "Quanta proteína preciso por dia?",
      "answer": "Para alguém de 70 kg: cerca de 56-70 g sedentário, 84-112 g ativo, 112-154 g na musculação e até 126-168 g em déficit calórico."
    },
    {
      "id": "protein-intake-calculator-faq-2",
      "question": "Por que mostra uma faixa em vez de número único?",
      "answer": "Diretrizes da ISSN e ACSM trazem intervalos porque volume de treino e dieta influenciam a necessidade real; o ponto central é ótimo guia."
    },
    {
      "id": "protein-intake-calculator-faq-3",
      "question": "Excesso de proteína faz mal?",
      "answer": "Em pessoas com rins saudáveis, estudos até 2 g/kg ou mais não apontam danos; em casos de doença renal prévia siga orientação médica."
    },
    {
      "id": "protein-intake-calculator-faq-4",
      "question": "Basear no peso total ou na massa magra?",
      "answer": "Com percentual de gordura elevado, aplicar os mesmos g/kg à massa magra gera um alvo mais exato."
    },
    {
      "id": "protein-intake-calculator-faq-5",
      "question": "Importa como divido a proteína ao longo do dia?",
      "answer": "Sim. Doses regulares perto de 0,4 g/kg por refeição estimulam melhor a síntese proteica do que um único prato gigante."
    },
    {
      "id": "protein-intake-calculator-faq-6",
      "question": "Preciso de whey ou suplemento para atingir a meta?",
      "answer": "Não. Ovos, frango, peixes, laticínios e leguminosas suprem facilmente 150 g; suplementos são apenas conveniência."
    }
  ]
};
