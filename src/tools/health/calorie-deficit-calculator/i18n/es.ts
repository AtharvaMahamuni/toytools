import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de déficit calórico",
  "seoTitle": "Calculadora de Déficit Calórico - Objetivo y Semanas",
  "description": "Calcula tu déficit calórico diario para perder peso de forma segura, tu suelo de BMR y el tiempo estimado hasta tu meta.",
  "tagline": "Calorías diarias para tu ritmo de pérdida elegido y duración estimada.",
  "lead": "Estima tus calorías diarias para bajar peso respetando el mínimo de tu tasa metabólica basal (BMR) y consulta los hitos hasta tu objetivo.",
  "craft": {
    "solves": "Un déficit fijado una sola vez se queda obsoleto al bajar de peso, ya que tu consumo de mantenimiento también cae y el plan parece estancarse."
  },
  "guide": {
    "title": "Cómo fijar un déficit calórico sostenible",
    "description": "De dónde sale la cifra de 7.700 kcal por kilo, por qué no bajar del BMR y cómo reajustar tu meta conforme pierdes peso."
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
        "male": "Hombre",
        "female": "Mujer"
      },
      "help": "Usado en la fórmula BMR; elige el sexo metabólico que corresponda."
    },
    "age": {
      "label": "Edad",
      "suffix": "años"
    },
    "weight": {
      "label": "Peso actual",
      "help": "Kilogramos en métrico, libras en imperial."
    },
    "height": {
      "label": "Altura",
      "help": "Centímetros en métrico, pulgadas totales en imperial."
    },
    "activity": {
      "label": "Nivel de actividad",
      "options": {
        "sedentary": "Sedentario (oficina, sin ejercicio)",
        "light": "Ligero (1-3 días/semana)",
        "moderate": "Moderado (3-5 días/semana)",
        "active": "Activo (6-7 días/semana)",
        "very-active": "Muy activo (entrenamiento intenso o trabajo físico)"
      }
    },
    "rate": {
      "label": "Ritmo de pérdida semanal",
      "options": {
        "1": "1 kg por semana (muy exigente)",
        "0.25": "0,25 kg por semana (suave)",
        "0.5": "0,5 kg por semana (estándar)",
        "0.75": "0,75 kg por semana (exigente)"
      }
    },
    "goal": {
      "label": "Peso objetivo",
      "help": "Déjalo vacío si prefieres omitir la línea temporal."
    }
  },
  "ui": {
    "emptyText": "Introduce tus datos y el ritmo de pérdida elegido para calcular tus calorías diarias y semanas estimadas.",
    "engine": {
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errMinTpl": "{label} no puede ser menor que {min}.",
      "errMaxTpl": "{label} no puede ser mayor que {max}.",
      "fieldUnit": "tu sistema de unidades",
      "fieldSex": "el sexo para el cálculo BMR",
      "fieldActivity": "tu nivel de actividad",
      "fieldRate": "un ritmo de pérdida",
      "fieldAge": "tu edad",
      "fieldWeight": "tu peso",
      "fieldHeight": "tu altura",
      "fieldGoal": "tu peso objetivo",
      "errWeightZero": "Introduce un peso actual mayor que cero para planificar el déficit.",
      "errHeightZero": "Introduce una altura mayor que cero para planificar el déficit.",
      "heroLabel": "Comer al día",
      "noteFloorTpl": "el máximo que sugiere esta herramienta, unos {kg} kg por semana",
      "noteRateTpl": "para perder {kg} kg por semana",
      "cardMaint": "Calorías de mantenimiento",
      "cardDailyDef": "Déficit diario",
      "cardWeeklyDef": "Déficit semanal",
      "cardBmr": "BMR (mínimo base)",
      "cardLeft": "Pendiente por perder",
      "cardWeeks": "Tiempo a este ritmo",
      "weeksTpl": "{n} semanas",
      "msQuarterTpl": "Un cuarto del camino, {w}",
      "msHalfTpl": "A mitad de camino, {w}",
      "msGoalTpl": "Peso objetivo, {w}",
      "insMainTpl": "Tu mantenimiento ronda las {maint}. Comer {target} deja un déficit de {daily} kcal diarias ({weekly} kcal a la semana).",
      "insFloorTpl": "Perder {kg} kg semanales requeriría bajar de tu BMR ({bmr}), por lo que mantenemos ese suelo como límite de seguridad.",
      "insWater": "Un kilo de grasa corporal ronda las 7.700 kcal. La pérdida real varía por retención de agua y ligera adaptación metabólica al bajar peso.",
      "stepMetric": "4 o 5 kg",
      "stepImp": "10 lb",
      "insRecalcTpl": "Recalcula cada {step} perdidos porque tu gasto de mantenimiento disminuirá con el peso.",
      "vizEat": "Ingesta",
      "vizGap": "Déficit",
      "vizTitle": "Tu ingesta diaria frente al mantenimiento",
      "vizDescTpl": "Un recorte del {pct} % sobre tu mantenimiento estimado de {maint}.",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (kg, cm)",
      "asmImp": "imperial (lb, in)",
      "asmFormula": "Fórmula BMR",
      "asmEnergy": "Energía por kg",
      "asmFloor": "Suelo de ingesta",
      "decTdee": "Calcular solo tu TDEE de mantenimiento",
      "decMacro": "Repartir esas calorías en macros",
      "decTrack": "Registrar tu evolución semanal de peso",
      "q1": "¿De cuánto debe ser un déficit calórico?",
      "q2": "¿Cuánto tardaré en alcanzar mi objetivo?",
      "q3": "¿Por qué se ha estancado mi bajada de peso?",
      "explanation": "Un déficit calórico es la diferencia entre las calorías que gastas al día y las que ingieres. Partiendo del BMR Mifflin-St Jeor ajustado por actividad y de unas 7.700 kcal por kilo de tejido graso, perder medio kilo semanal requiere unas 550 kcal de déficit diario. Nunca se recomienda bajar sistemáticamente del BMR."
    }
  },
  "knowledge": {
    "summary": "Calcula el objetivo calórico diario según el ritmo de pérdida elegido respetando tu BMR y proyectando la evolución semanal.",
    "useCases": [
      "Fijar una meta realista de calorías diarias sin pasar hambre extrema",
      "Estimar cuántas semanas llevará pasar del peso actual al objetivo",
      "Comprobar si perder 1 kg semanal excede el suelo mínimo metabólico"
    ],
    "mistakes": [
      "Elegir el déficit máximo y quedarse por debajo de la tasa basal",
      "No recalcular las calorías tras perder varios kilos",
      "Juzgar la evolución por una sola pesada aislada"
    ]
  },
  "faqs": [
    {
      "id": "calorie-deficit-calculator-faq-1",
      "question": "¿De cuánto debe ser un déficit calórico?",
      "answer": "Un ritmo sostenible ronda el 0,5 % al 1 % del peso corporal por semana (unas 440 a 880 kcal diarias para 80 kg), protegiendo la masa muscular."
    },
    {
      "id": "calorie-deficit-calculator-faq-2",
      "question": "¿De dónde sale la cifra de 7.700 kcal por kilo?",
      "answer": "Equivale aproximadamente a la energía utilizable en un kilogramo de tejido adiposo humano: dividida en 7 días da cerca de 1.100 kcal/día para 1 kg semanal."
    },
    {
      "id": "calorie-deficit-calculator-faq-3",
      "question": "¿Por qué se estancó mi pérdida de peso?",
      "answer": "Al bajar kilos tu gasto diario disminuye y el déficit inicial se estrecha; además el agua corporal oculta cambios durante días. Recalcula cada 4-5 kg."
    },
    {
      "id": "calorie-deficit-calculator-faq-4",
      "question": "¿Es mejor comer menos o moverse más?",
      "answer": "Combinar ambos funciona mejor: recortar comida es más exacto de medir y sumar actividad física permite comer algo más con el mismo déficit."
    },
    {
      "id": "calorie-deficit-calculator-faq-5",
      "question": "¿Qué pasa si como por debajo de mi BMR?",
      "answer": "Se acelera la pérdida de masa muscular, empeora la fatiga y cae la adherencia. Por eso la calculadora aplica tu BMR como suelo mínimo."
    },
    {
      "id": "calorie-deficit-calculator-faq-6",
      "question": "¿Qué precisión tiene el plazo en semanas?",
      "answer": "Es una estimación lineal optimista asumiendo cumplimiento constante; úsalo para comparar ritmos entre sí y ajusta según tu media semanal real."
    }
  ]
};
