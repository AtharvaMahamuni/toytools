import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de grasa corporal",
  "seoTitle": "Calculadora de Grasa Corporal - Método Marina EE.UU.",
  "description": "Calcula tu porcentaje de grasa corporal con cinta métrica (método U.S. Navy), además de masa grasa y masa magra en métrico o imperial.",
  "tagline": "Porcentaje de grasa corporal con cinta métrica, más masa grasa y magra.",
  "lead": "Estima tu porcentaje de grasa corporal, categoría ACE y reparto de masa grasa frente a masa magra localmente en tu navegador.",
  "craft": {
    "solves": "Las fórmulas de cinta arrojan un margen de 3 a 4 puntos según cómo se tense la cinta, por lo que una sola medición es menos fiable que la tendencia."
  },
  "guide": {
    "title": "Cómo medir la grasa corporal con cinta métrica",
    "description": "Aprende el método de la Marina de EE. UU., dónde tomar cuello, cintura y cadera, su precisión y diferencias respecto al IMC."
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
        "male": "Hombre",
        "female": "Mujer"
      }
    },
    "height": {
      "label": "Altura",
      "help": "Centímetros en métrico, pulgadas en imperial."
    },
    "neck": {
      "label": "Contorno de cuello",
      "help": "Medido justo debajo de la nuez/laringe."
    },
    "waist": {
      "label": "Contorno de cintura",
      "help": "Hombres a la altura del ombligo; mujeres en la parte más estrecha."
    },
    "hip": {
      "label": "Contorno de cadera",
      "help": "Solo mujeres, en la zona más ancha (se ignora en hombres)."
    },
    "weight": {
      "label": "Peso corporal (opcional)",
      "help": "Añádelo para calcular masa grasa y masa magra."
    }
  },
  "ui": {
    "emptyText": "Introduce altura y medidas de cuello y cintura (más cadera en mujeres) para estimar tu grasa corporal.",
    "engine": {
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errMinTpl": "{label} no puede ser menor que {min}.",
      "errMaxTpl": "{label} no puede ser mayor que {max}.",
      "errPositiveTpl": "{label} debe ser mayor que cero.",
      "fieldUnit": "tu sistema de unidades",
      "fieldSex": "el sexo para la fórmula",
      "fieldHeight": "tu altura",
      "fieldNeck": "la medida del cuello",
      "fieldWaist": "la medida de la cintura",
      "fieldHip": "la medida de la cadera",
      "fieldWeight": "tu peso corporal",
      "errWaistNeck": "La cintura debe ser mayor que el cuello. Revisa ambas medidas.",
      "errWaistHipNeck": "Cintura más cadera deben superar la medida del cuello. Revisa los datos.",
      "errInvalidEst": "Esas medidas no producen una estimación válida. Revísalas e inténtalo de nuevo.",
      "heroLabel": "Grasa corporal",
      "cardCat": "Categoría",
      "cardFat": "Masa grasa",
      "cardLean": "Masa magra",
      "men": "hombres",
      "women": "mujeres",
      "cats": {
        "essential": "Esencial",
        "athletes": "Atletas",
        "fitness": "Fitness",
        "average": "Promedio",
        "obese": "Por encima del promedio"
      },
      "insCatTpl": "Tu estimación es del {bf} %, categoría \"{cat}\" en las tablas ACE para {sex}.",
      "insTape": "El método de cinta tiene un margen de 3 a 4 puntos porcentuales. Mídete siempre a la misma hora sin comprimir la piel y sigue la tendencia.",
      "vizTitleTpl": "Tu grasa corporal del {bf} % en la escala ACE",
      "vizDescTpl": "Rangos ACE para {sex}. Observa la tendencia entre semanas más que una sola lectura.",
      "asmMethod": "Método",
      "asmMethodVal": "Circunferencias U.S. Navy",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (cm, kg)",
      "asmImp": "imperial (in, lb)",
      "asmCats": "Categorías",
      "asmCatsVal": "American Council on Exercise",
      "decBmi": "Comparar con tu IMC",
      "decTdee": "Calcular tus calorías TDEE",
      "decTrack": "Registrar el progreso semanal de peso",
      "q1": "¿Cuál es un porcentaje saludable de grasa corporal?",
      "q2": "¿Qué precisión tiene el método Navy?",
      "q3": "¿En qué se diferencia la grasa corporal del IMC?",
      "explanation": "El método de la Marina de EE. UU. estima la grasa corporal a partir de las proporciones de cintura, cuello (y cadera en mujeres) respecto a la estatura. Con una simple cinta métrica ofrece una referencia práctica para seguir evolución en semanas."
    }
  },
  "knowledge": {
    "summary": "Estima el porcentaje de grasa corporal por circunferencias (U.S. Navy), más masa grasa y masa magra en sistema métrico o imperial.",
    "useCases": [
      "Seguir cambios de composición corporal cuando la báscula se estanca",
      "Calcular cuánta masa libre de grasa conservas durante una definición",
      "Complementar el IMC cuando tienes masa muscular por encima de la media"
    ],
    "mistakes": [
      "Apretar demasiado la cinta o meter tripa al medir la cintura",
      "Comparar una medición matinal con otra tras una comida copiosa",
      "Tomar la estimación con cinta como diagnóstico DEXA exacto"
    ]
  },
  "faqs": [
    {
      "id": "body-fat-calculator-faq-1",
      "question": "¿Cómo funciona el método de grasa corporal de la Marina de EE. UU.?",
      "answer": "Compara cintura y cuello (más cadera en mujeres) frente a la estatura con ecuaciones ajustadas mediante pesaje hidrostático."
    },
    {
      "id": "body-fat-calculator-faq-2",
      "question": "¿Dónde exactamente debo colocar la cinta métrica?",
      "answer": "Cuello justo bajo la laringe; cintura a la altura del ombligo en hombres y en la parte más estrecha en mujeres; cadera en la zona más ancha."
    },
    {
      "id": "body-fat-calculator-faq-3",
      "question": "¿Qué precisión tiene?",
      "answer": "Suele situarse en un margen de 3 a 4 puntos frente a métodos clínicos si mides de forma constante cada semana."
    },
    {
      "id": "body-fat-calculator-faq-4",
      "question": "¿Cuál es un porcentaje de grasa corporal saludable?",
      "answer": "En la escala ACE, el rango fitness ronda el 14-17 % en hombres y 21-24 % en mujeres, siendo menor en atletas."
    },
    {
      "id": "body-fat-calculator-faq-5",
      "question": "¿En qué se diferencia la grasa corporal del IMC?",
      "answer": "El IMC solo usa altura y peso sin distinguir músculo de grasa; la grasa corporal estima composición real y masa magra."
    },
    {
      "id": "body-fat-calculator-faq-6",
      "question": "¿Se mantienen privados mis datos y medidas?",
      "answer": "Sí. Toda la fórmula corre localmente en tu navegador sin enviar ni almacenar tus medidas en ningún servidor."
    }
  ]
};
