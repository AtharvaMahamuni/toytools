import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de macros",
  "seoTitle": "Calculadora de Macros - Proteína, Carbos y Grasas",
  "description": "Divide tu objetivo diario de calorías en gramos de proteínas, carbohidratos y grasas con presets equilibrados, alto en proteína o keto.",
  "tagline": "Reparte tus calorías en proteínas, carbohidratos y grasas.",
  "lead": "Convierte tu objetivo calórico diario en gramos exactos de proteína, carbohidratos y grasas según tu estilo de dieta directamente en tu dispositivo.",
  "craft": {
    "solves": "Muchos eligen porcentajes arbitrarios de macronutrientes que no suman el 100 %, generando excesos o déficits calóricos involuntarios."
  },
  "guide": {
    "title": "Cómo calcular tus macronutrientes desde calorías",
    "description": "Aprende qué son los macros, cómo pasan las calorías a gramos de proteína, hidratos y grasa, y cómo elegir un reparto sostenible."
  },
  "fields": {
    "calories": {
      "label": "Calorías diarias",
      "suffix": "kcal",
      "help": "Tu meta diaria de calorías (puedes hallarla con la calculadora TDEE)."
    },
    "diet": {
      "label": "Estilo de dieta",
      "options": {
        "balanced": "Equilibrada (45% carbos / 25% proteína / 30% grasa)",
        "high-protein": "Alta en proteína (40 / 35 / 25)",
        "low-carb": "Baja en carbos (25 / 35 / 40)",
        "keto": "Keto (5 / 25 / 70)"
      }
    }
  },
  "ui": {
    "emptyText": "Introduce tus calorías diarias y elige un reparto para calcular tus gramos de proteína, carbohidratos y grasas.",
    "engine": {
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errMinTpl": "{label} no puede ser menor que {min}.",
      "errMaxTpl": "{label} no puede ser mayor que {max}.",
      "fieldDiet": "un estilo de dieta",
      "fieldCalories": "tus calorías diarias",
      "errCalZero": "Introduce un objetivo de calorías superior a cero.",
      "heroProtein": "Proteína",
      "notePctKcalTpl": "{pct} % de {kcal} kcal",
      "notePctTpl": "{pct} % de las calorías",
      "cardCarb": "Carbohidratos",
      "cardFat": "Grasas",
      "cardSplit": "Reparto (C/P/G)",
      "vizCarb": "Carbohidratos",
      "vizProtein": "Proteína",
      "vizFat": "Grasas",
      "vizTitle": "Tu reparto de macronutrientes",
      "vizDescTpl": "{carb} % carbohidratos, {protein} % proteína y {fat} % grasas sobre {kcal} kcal.",
      "diets": {
        "balanced": "Equilibrada",
        "high-protein": "Alta en proteína",
        "low-carb": "Baja en carbos",
        "keto": "Cetogénica (Keto)"
      },
      "insSplitTpl": "En el estilo {diet} con {kcal} kcal te corresponden unos {protein} g de proteína, {carb} g de carbohidratos y {fat} g de grasa.",
      "insEnergy": "Proteína y carbohidratos aportan 4 kcal/g y las grasas 9 kcal/g. Elige una proporción que puedas sostener en tu rutina.",
      "insTotal": "Cumplir el total diario de calorías pesa más que clavar el porcentaje exacto cada día.",
      "asmDiet": "Estilo de dieta",
      "asmEnergy": "Energía por gramo",
      "asmEnergyVal": "proteína 4, carbos 4, grasa 9 kcal",
      "decTdee": "Calcular tus calorías TDEE antes",
      "decBmi": "Consultar también tu IMC",
      "q1": "¿Cuántas calorías debo consumir al día?",
      "q2": "¿Cuánta proteína necesito realmente?",
      "q3": "¿Qué reparto de macros funciona mejor para perder grasa?",
      "explanation": "Los macronutrientes son proteína (4 kcal/g), carbohidratos (4 kcal/g) y grasas (9 kcal/g). Multiplicando cada porcentaje por tus calorías diarias y dividiendo por su densidad calórica obtienes tus gramos diarios."
    }
  },
  "knowledge": {
    "summary": "Convierte calorías diarias en gramos de proteína, carbohidratos y grasa mediante presets equilibrado, alto en proteína, bajo en carbos o keto.",
    "useCases": [
      "Traducir un objetivo calórico TDEE en metas reales de comida",
      "Comparar cuánta proteína o carbohidrato implica un estilo keto frente a equilibrado",
      "Planificar menús semanales para definir o ganar músculo"
    ],
    "mistakes": [
      "Elegir porcentajes sueltos que no suman 100 %",
      "Observar solo porcentajes olvidando los gramos totales de proteína por peso",
      "Obsesionarse por clavar el gramo exacto descuidando las calorías totales"
    ]
  },
  "faqs": [
    {
      "id": "macro-calculator-faq-1",
      "question": "¿Cómo calculo mis macros diarios?",
      "answer": "Parte de tus calorías totales, asigna un porcentaje a cada nutriente y divide sus calorías entre 4 (proteína y carbos) o 9 (grasas) para pasar a gramos."
    },
    {
      "id": "macro-calculator-faq-2",
      "question": "¿Cuál es un buen reparto de macros para perder grasa?",
      "answer": "Un enfoque alto en proteína (como 40 % carbos / 35 % proteína / 25 % grasas) ayuda a conservar músculo y saciedad dentro del déficit."
    },
    {
      "id": "macro-calculator-faq-3",
      "question": "¿Cuánta proteína conviene tomar?",
      "answer": "Para personas activas suele oscilar entre 1,6 y 2,2 g por kilo de peso corporal; con los presets de 25 % a 35 % la mayoría se sitúa dentro de ese margen."
    },
    {
      "id": "macro-calculator-faq-4",
      "question": "¿Qué diferencia a los distintos presets de dieta?",
      "answer": "Equilibrada reparte 45/25/30, alta en proteína sube proteína a 35 %, baja en carbos reduce carbos a 25 % y keto los limita al 5 % priorizando grasas (70 %)."
    },
    {
      "id": "macro-calculator-faq-5",
      "question": "¿Tengo que acertar cada gramo al milímetro?",
      "answer": "No. Acercarte a las proteínas y mantener las calorías semanales en rango aporta prácticamente todo el resultado."
    },
    {
      "id": "macro-calculator-faq-6",
      "question": "¿Dónde obtengo mi objetivo de calorías?",
      "answer": "Calcula primero tu TDEE diario según edad, estatura, peso y actividad y réstale o súmale según tu meta."
    }
  ]
};
