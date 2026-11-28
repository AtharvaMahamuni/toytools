import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de ingesta de proteínas",
  "seoTitle": "Calculadora de Proteína Diaria - Gramos por Peso y Meta",
  "description": "Calcula cuántos gramos de proteína diarios necesitas según tu peso y objetivo, en g/kg y reparto por comida para ganar músculo o definir.",
  "tagline": "El rango de proteína diario que respaldan tu peso y objetivo.",
  "lead": "Obtén tu intervalo recomendado de gramos de proteína al día, la dosis por comida y la equivalencia calórica según tu entrenamiento.",
  "craft": {
    "solves": "La síntesis proteica muscular responde por toma (unas 30-40 g por comida), por lo que repartir el total diario entre comidas importa tanto como la suma total."
  },
  "guide": {
    "title": "Cuánta proteína necesitas realmente al día",
    "description": "Por qué las guías dan un rango y no una cifra única, cómo cambia al entrenar fuerza o definir y por qué repartirla por toma ayuda más."
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
      "help": "Kilogramos en métrico, libras en imperial."
    },
    "goal": {
      "label": "Para qué entrenas",
      "options": {
        "sedentary": "Mayormente sedentario, salud general",
        "active": "Activo en general, sin plan concreto",
        "endurance": "Resistencia (correr, ciclismo)",
        "strength": "Entrenamiento de fuerza o hipertrofia",
        "fat-loss": "Perder grasa conservando músculo"
      }
    },
    "meals": {
      "label": "Comidas al día",
      "suffix": "comidas"
    }
  },
  "ui": {
    "emptyText": "Introduce tu peso corporal y tu objetivo para conocer el rango diario de proteína.",
    "engine": {
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errMinTpl": "{label} no puede ser menor que {min}.",
      "errMaxTpl": "{label} no puede ser mayor que {max}.",
      "fieldUnit": "tu sistema de unidades",
      "fieldGoal": "tu objetivo de entrenamiento",
      "fieldWeight": "tu peso corporal",
      "fieldMeals": "comidas al día",
      "errWeightZero": "Introduce un peso corporal superior a cero para calcular la meta.",
      "goals": {
        "sedentary": "salud general y vida sedentaria",
        "active": "actividad física general",
        "endurance": "entrenamiento de resistencia",
        "strength": "fuerza e hipertrofia muscular",
        "fat-loss": "pérdida de grasa preservando músculo"
      },
      "heroLabel": "Proteína al día",
      "rangeTpl": "{lo} a {hi}",
      "cardMid": "Objetivo central único",
      "cardMealTpl": "Por toma en {n} comidas",
      "cardPerKg": "Gramos por kilogramo",
      "perKgTpl": "{lo} a {hi} g/kg",
      "cardKcal": "Calorías en proteína",
      "bandGen": "Salud general",
      "bandActive": "Activo",
      "bandTrain": "Entrenamiento",
      "bandCut": "Definición",
      "insRangeTpl": "Con {kg} kg y objetivo de {goal}, el rango se sitúa entre {loKg} y {hiKg} g/kg ({lo} a {hi} diarios).",
      "insMealTpl": "Repartido en {n} comidas equivale a unos {meal} de proteína por toma.",
      "insBand": "Las investigaciones reportan rangos, no cifras únicas rígidas: cualquier punto dentro de tu banda es adecuado.",
      "vizTitle": "Tu objetivo dentro del rango recomendado (g/kg)",
      "vizDescTpl": "Tu meta se ubica entre {lo} y {hi} gramos por kilo de peso corporal.",
      "vizHighlight": "tu rango",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (kg)",
      "asmImp": "imperial (lb)",
      "asmSource": "Fuente",
      "asmSourceVal": "Posicionamientos ISSN y ACSM",
      "asmBasis": "Base de cálculo",
      "asmBasisVal": "peso total, no masa magra",
      "decMacro": "Convertir en reparto completo de macros",
      "decTdee": "Comprobar antes tu gasto TDEE",
      "decBf": "Ajustar por masa magra midiendo grasa corporal",
      "q1": "¿Cuánta proteína necesito al día?",
      "q2": "¿Es perjudicial tomar demasiada proteína?",
      "q3": "¿Se calcula sobre peso total o masa magra?",
      "explanation": "Las necesidades proteicas dependen del peso y de la exigencia muscular. El mínimo oficial de 0,8 g/kg solo previene carencias; entidades como ISSN y ACSM recomiendan 1,2-1,6 g/kg en personas activas y 1,6-2,2 g/kg en fuerza."
    }
  },
  "knowledge": {
    "summary": "Calcula tu rango diario de proteína según peso corporal y objetivo deportivo junto al reparto por comida y g/kg.",
    "useCases": [
      "Saber cuánta proteína tomar para ganar músculo o conservarlo en déficit",
      "Repartir la proteína total diaria entre 3 o 4 comidas equilibradas",
      "Calcular los gramos por kilo sobre peso total o masa magra"
    ],
    "mistakes": [
      "Confundir el mínimo de 0,8 g/kg (RDA) con el óptimo para deportistas",
      "Concentrar casi toda la proteína únicamente en la cena"
    ]
  },
  "faqs": [
    {
      "id": "protein-intake-calculator-faq-1",
      "question": "¿Cuánta proteína necesito al día?",
      "answer": "Para 70 kg, ronda 56-70 g en sedentarios, 84-112 g si eres activo, 112-154 g entrenando fuerza y hasta ~126-168 g en definición estricta."
    },
    {
      "id": "protein-intake-calculator-faq-2",
      "question": "¿Por qué da un rango en lugar de una cifra exacta?",
      "answer": "Porque los consensos científicos ISSN y ACSM publican intervalos según volumen de entrenamiento y balance energético; el punto medio sirve como guía práctica."
    },
    {
      "id": "protein-intake-calculator-faq-3",
      "question": "¿Es malo tomar demasiada proteína?",
      "answer": "En riñones sanos, ingestas de hasta ~2 g/kg y superiores en ensayos controlados no mostraron daño; con enfermedad renal previa consulta a tu médico."
    },
    {
      "id": "protein-intake-calculator-faq-4",
      "question": "¿Conviene calcular sobre peso total o masa magra?",
      "answer": "Con porcentaje graso elevado, usar peso total sobreestima un poco; aplicar los mismos g/kg sobre tu masa magra afina mucho el objetivo."
    },
    {
      "id": "protein-intake-calculator-faq-5",
      "question": "¿Importa cómo reparto la proteína a lo largo del día?",
      "answer": "Sí. Repartir en tomas de unos 0,4 g/kg (p. ej. 4 comidas de 35 g frente a 100 g en una sola cena) estimula mejor la síntesis proteica muscular."
    },
    {
      "id": "protein-intake-calculator-faq-6",
      "question": "¿Necesito suplementos o batidos para llegar?",
      "answer": "No. Huevos, pollo, pescado, lácteos y legumbres cubren fácilmente 150 g; el batido solo es una comodidad práctica si vas con prisa."
    }
  ]
};
