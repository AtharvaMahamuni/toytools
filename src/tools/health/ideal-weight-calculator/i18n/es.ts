import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de peso ideal",
  "seoTitle": "Calculadora de Peso Ideal - Fórmulas Devine y Rango IMC",
  "description": "Estima tu peso ideal según estatura y sexo con las fórmulas Devine, Robinson, Miller y Hamwi junto al rango saludable de IMC.",
  "tagline": "Peso ideal con cuatro fórmulas clásicas y rango IMC saludable.",
  "lead": "Consulta las cuatro fórmulas clínicas clásicas (Devine, Robinson, Miller y Hamwi) comparadas frente al rango moderno de IMC saludable (18,5 a 24,9).",
  "craft": {
    "solves": "Cada fórmula clásica ofrece un punto distinto que ignora complexión y músculo; mostrar el rango saludable de IMC evita fijarse un número único rígido."
  },
  "guide": {
    "title": "Fórmulas de peso ideal y rango de IMC",
    "description": "Cómo funcionan Devine, Robinson, Miller y Hamwi, por qué difieren entre sí y por qué un peso sano es un intervalo amplio."
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
        "male": "Hombre",
        "female": "Mujer"
      }
    },
    "height": {
      "label": "Altura",
      "help": "Centímetros en métrico, pulgadas totales en imperial."
    }
  },
  "ui": {
    "emptyText": "Elige unidades, sexo y altura para consultar tu peso ideal y el rango saludable.",
    "engine": {
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errMinTpl": "{label} no puede ser menor que {min}.",
      "errMaxTpl": "{label} no puede ser mayor que {max}.",
      "fieldUnit": "tu sistema de unidades",
      "fieldSex": "el sexo para las fórmulas",
      "fieldHeight": "tu altura",
      "errHeightZero": "Introduce una altura mayor que cero para estimar el peso ideal.",
      "heroLabel": "Peso ideal",
      "heroNote": "promedio de cuatro fórmulas",
      "cardHealthy": "Rango saludable (IMC)",
      "cardDevine": "Fórmula Devine",
      "cardRobinson": "Fórmula Robinson",
      "cardMiller": "Fórmula Miller",
      "cardHamwi": "Fórmula Hamwi",
      "bandBelow": "Por debajo",
      "bandHealthy": "Rango saludable",
      "bandAbove": "Por encima",
      "insSpreadTpl": "Las cuatro fórmulas oscilan entre {lo} y {hi}, con un promedio de {avg}.",
      "insBandTpl": "Para tu estatura, el rango saludable de IMC (18,5 a 24,9) va de {range}.",
      "insAnchor": "Estas fórmulas solo usan altura y sexo, ignorando estructura ósea, edad y masa muscular. Úsalas como referencia general.",
      "vizTitleTpl": "Tu peso ideal frente al rango saludable en {unit}",
      "vizDescTpl": "Las cuatro fórmulas caen entre {fRange}, dentro del rango IMC {bRange}.",
      "vizHighlight": "las cuatro fórmulas",
      "asmUnits": "Unidades",
      "asmMetric": "métrico (cm)",
      "asmImp": "imperial (in)",
      "asmFormulas": "Fórmulas",
      "asmHealthy": "Rango saludable",
      "asmHealthyVal": "IMC 18,5 a 24,9",
      "decBmi": "Comprobar tu IMC actual",
      "decBf": "Estimar tu porcentaje de grasa corporal",
      "decTrack": "Registrar tu evolución de peso",
      "q1": "¿Cuánto debería pesar según mi estatura?",
      "q2": "¿Es lo mismo peso ideal que peso saludable?",
      "q3": "¿Por qué no coinciden las fórmulas entre sí?",
      "explanation": "Las fórmulas Devine, Robinson, Miller y Hamwi nacieron hace décadas principalmente para dosificar fármacos a partir de altura y sexo. Como no miden músculo ni complexión, conviene tomarlas como punto central dentro de la franja saludable de IMC."
    }
  },
  "knowledge": {
    "summary": "Estima el peso ideal por altura y sexo mediante Devine, Robinson, Miller y Hamwi junto al rango saludable moderno por IMC.",
    "useCases": [
      "Comprobar un intervalo realista de peso según la estatura",
      "Comparar en qué difieren las cuatro ecuaciones médicas históricas",
      "Fijar un rango objetivo sensato junto con medidas de grasa corporal"
    ],
    "mistakes": [
      "Tratar un único resultado decimal como el único peso válido",
      "Ignorar masa muscular o complexión ósea al interpretar el resultado"
    ]
  },
  "faqs": [
    {
      "id": "ideal-weight-calculator-faq-1",
      "question": "¿Cuánto debería pesar para mi estatura?",
      "answer": "No existe una cifra única: aquí ves el promedio de Devine, Robinson, Miller y Hamwi junto al amplio rango saludable de IMC (18,5 a 24,9)."
    },
    {
      "id": "ideal-weight-calculator-faq-2",
      "question": "¿Por qué dan resultados distintos las cuatro fórmulas?",
      "answer": "Nacieron en épocas distintas usando diferentes pesos base a partir de 5 pies y distintos incrementos por pulgada. Hamwi suele dar más alto y Miller más bajo."
    },
    {
      "id": "ideal-weight-calculator-faq-3",
      "question": "¿Es lo mismo peso ideal que peso saludable?",
      "answer": "No exactamente: las fórmulas buscaban una cifra de dosificación clínica, mientras que el peso saludable moderno es un rango amplio según complexión."
    },
    {
      "id": "ideal-weight-calculator-faq-4",
      "question": "¿Tienen en cuenta el músculo o la estructura ósea?",
      "answer": "No, solo consideran sexo y altura. Una persona muy musculada puede pesar por encima del ideal manteniendo poca grasa."
    },
    {
      "id": "ideal-weight-calculator-faq-5",
      "question": "¿Cómo uso estos valores para marcarme una meta?",
      "answer": "Apunta a una zona cómoda dentro del rango saludable de IMC y sigue tu media semanal localmente en el navegador."
    }
  ]
};
