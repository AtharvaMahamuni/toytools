import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de déficit calórico",
  "seoTitle": "Calculadora Déficit Calórico - Meta Diária e Prazo",
  "description": "Calcule o déficit calórico diário para emagrecer com segurança, o piso da sua TMB e o tempo estimado até atingir o peso ideal.",
  "tagline": "O que comer por dia para sua taxa de perda e prazo até a meta.",
  "lead": "Planeje sua ingestão diária respeitando o piso da taxa metabólica basal (BMR/TMB) e acompanhe a previsão em semanas no navegador.",
  "craft": {
    "solves": "Um déficit definido uma única vez encolhe à medida que você emagrece, fazendo a perda parecer estagnada sem motivo aparente."
  },
  "guide": {
    "title": "Como definir um déficit calórico sustentável",
    "description": "De onde vem o valor de 7.700 kcal por quilo, por que não comer abaixo da BMR e quando recalcular sua meta ao longo do processo."
  },
  "fields": {
    "unit": {
      "label": "Unidades",
      "options": {
        "metric": "Métrico (kg, cm)",
        "imperial": "Imperial (lb, in)"
      }
    },
    "sex": {
      "label": "Sexo",
      "options": {
        "male": "Masculino",
        "female": "Feminino"
      },
      "help": "Usado pela fórmula da BMR; escolha o perfil metabólico correspondente."
    },
    "age": {
      "label": "Idade",
      "suffix": "anos"
    },
    "weight": {
      "label": "Peso atual",
      "help": "Quilos no sistema métrico, libras no imperial."
    },
    "height": {
      "label": "Altura",
      "help": "Centímetros no métrico, polegadas totais no imperial."
    },
    "activity": {
      "label": "Nível de atividade",
      "options": {
        "sedentary": "Sedentário (escritório, sem treino)",
        "light": "Leve (1-3 dias/semana)",
        "moderate": "Moderado (3-5 dias/semana)",
        "active": "Ativo (6-7 dias/semana)",
        "very-active": "Muito ativo (treino pesado ou trabalho físico)"
      }
    },
    "rate": {
      "label": "Perda semanal desejada",
      "options": {
        "1": "1 kg por semana (muito agressivo)",
        "0.25": "0,25 kg por semana (suave)",
        "0.5": "0,5 kg por semana (padrão)",
        "0.75": "0,75 kg por semana (agressivo)"
      }
    },
    "goal": {
      "label": "Peso objetivo",
      "help": "Deixe em branco para pular a linha do tempo."
    }
  },
  "ui": {
    "emptyText": "Preencha seus dados e o ritmo desejado para ver a meta diária de calorias e as semanas até o objetivo.",
    "engine": {
      "errEnterTpl": "Informe {label} para calcular.",
      "errNotNumberTpl": "{label} deve ser um número.",
      "errMinTpl": "{label} não pode ser menor que {min}.",
      "errMaxTpl": "{label} não pode ser maior que {max}.",
      "fieldUnit": "seu sistema de unidades",
      "fieldSex": "um sexo para a equação BMR",
      "fieldActivity": "seu nível de atividade",
      "fieldRate": "uma taxa de perda",
      "fieldAge": "sua idade",
      "fieldWeight": "seu peso",
      "fieldHeight": "sua altura",
      "fieldGoal": "seu peso objetivo",
      "errWeightZero": "Digite um peso atual acima de zero para planejar o déficit.",
      "errHeightZero": "Digite uma altura acima de zero.",
      "heroLabel": "Comer por dia",
      "noteFloorTpl": "máximo seguro sugerido aqui, cerca de {kg} kg por semana",
      "noteRateTpl": "para perder {kg} kg por semana",
      "cardMaint": "Calorias de manutenção",
      "cardDailyDef": "Déficit diário",
      "cardWeeklyDef": "Déficit semanal",
      "cardBmr": "BMR (piso mínimo)",
      "cardLeft": "Falta perder",
      "cardWeeks": "Tempo neste ritmo",
      "weeksTpl": "{n} semanas",
      "msQuarterTpl": "Um quarto do caminho, {w}",
      "msHalfTpl": "Metade do caminho, {w}",
      "msGoalTpl": "Peso objetivo, {w}",
      "insMainTpl": "Sua manutenção é de cerca de {maint}. Comer {target} gera déficit diário de {daily} kcal ({weekly} kcal por semana).",
      "insFloorTpl": "Perder {kg} kg/semana ficaria abaixo da sua BMR ({bmr}); mantivemos esse piso por segurança.",
      "insWater": "Um quilo de gordura guarda cerca de 7.700 kcal. Retenção de líquidos pode esconder semanas de progresso na balança.",
      "stepMetric": "4 a 5 kg",
      "stepImp": "10 lb",
      "insRecalcTpl": "Recalcule a cada {step} perdidos porque seu gasto cai conforme o peso diminui.",
      "vizEat": "Ingestão",
      "vizGap": "Déficit",
      "vizTitle": "Sua ingestão frente à manutenção",
      "vizDescTpl": "Corte de {pct}% abaixo da manutenção estimada de {maint}.",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (kg, cm)",
      "asmImp": "imperial (lb, in)",
      "asmFormula": "Fórmula BMR",
      "asmEnergy": "Energia por kg",
      "asmFloor": "Piso calórico",
      "decTdee": "Ver apenas seu TDEE de manutenção",
      "decMacro": "Dividir as calorias em macronutrientes",
      "decTrack": "Registrar evolução semanal de peso",
      "q1": "Qual deve ser o tamanho de um déficit calórico?",
      "q2": "Quanto tempo vou levar para emagrecer?",
      "q3": "Por que minha perda de peso estacionou?",
      "explanation": "O déficit calórico é a diferença entre seu gasto diário (BMR Mifflin-St Jeor multiplicado pela atividade) e o consumo alimentar. Com cerca de 7.700 kcal por quilo de gordura, perder 0,5 kg por semana requer ~550 kcal diárias sem descer abaixo da BMR."
    }
  },
  "knowledge": {
    "summary": "Define a meta diária de calorias para sua taxa de emagrecimento protegendo o piso da BMR e estimando as semanas até o objetivo.",
    "useCases": [
      "Planejar ingestão calórica sustentável sem exaustão muscular",
      "Estimar em quantas semanas alcançar o peso desejado",
      "Verificar se perder 1 kg por semana invade o metabolismo basal"
    ],
    "mistakes": [
      "Escolher o ritmo mais agressivo abaixo da taxa basal",
      "Manter as mesmas calorias após perder vários quilos",
      "Avaliar progresso por uma única pesagem diária"
    ]
  },
  "faqs": [
    {
      "id": "calorie-deficit-calculator-faq-1",
      "question": "Qual é o tamanho ideal de um déficit calórico?",
      "answer": "Para a maioria das pessoas, perder 0,5% a 1% do peso por semana (~440 a 880 kcal/dia aos 80 kg) preserva massa muscular e mantém boa adesão."
    },
    {
      "id": "calorie-deficit-calculator-faq-2",
      "question": "De onde vem o número de 7.700 kcal por quilo?",
      "answer": "É a densidade energética aproximada do tecido adiposo humano: dividida por 7 dias dá cerca de 1.100 kcal/dia para 1 kg por semana."
    },
    {
      "id": "calorie-deficit-calculator-faq-3",
      "question": "Por que minha perda de peso estagnou?",
      "answer": "Com menos peso você gasta menos calorias e o déficit inicial encolhe. Além disso, retenção hídrica mascara resultados por semanas; recalcule a cada 4-5 kg."
    },
    {
      "id": "calorie-deficit-calculator-faq-4",
      "question": "É melhor comer menos ou se exercitar mais?",
      "answer": "Combinar ambos é superior: controlar a alimentação traz precisão, enquanto o exercício permite comer um pouco mais com o mesmo déficit."
    },
    {
      "id": "calorie-deficit-calculator-faq-5",
      "question": "O que acontece ao comer abaixo da BMR?",
      "answer": "Aumentam perda muscular, cansaço e abandono do plano. Por isso o cálculo adota a BMR como piso protetor."
    },
    {
      "id": "calorie-deficit-calculator-faq-6",
      "question": "Quão exato é o prazo em semanas?",
      "answer": "É um cenário linear ideal para comparar ritmos; na prática considere margem para variações reais ao longo dos meses."
    }
  ]
};
