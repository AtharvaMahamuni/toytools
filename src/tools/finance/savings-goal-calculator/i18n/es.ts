import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "savings-goal-calculator",
  "name": "Calculadora de Meta de Ahorro",
  "seoTitle": "Calculadora de Meta de Ahorro Mensual Online",
  "description": "Calcula cuánto necesitas ahorrar cada mes para alcanzar un objetivo financiero en una fecha dada, considerando tus ahorros actuales.",
  "tagline": "Cuánto apartar al mes para lograr una meta a tiempo.",
  "methodology": {
    "name": "Anualidad inversa",
    "detail": "Despeja la cuota mensual necesaria para alcanzar el objetivo contando el crecimiento compuesto del saldo previo."
  },
  "knowledge": {
    "primaryConcepts": [
      "meta de ahorro"
    ],
    "realWorldUseCases": [
      "Ahorrar para la entrada de una vivienda",
      "Planificar boda, viaje o compra de vehículo",
      "Definir transferencia automática mensual hacia un objetivo",
      "Evaluar si un plazo es realista"
    ],
    "commonMistakes": [
      "Suponer tasas irreales de retorno a corto plazo",
      "Olvidar descontar el ahorro inicial ya disponible"
    ]
  },
  "faqs": [
    {
      "id": "sg-faq-1",
      "question": "¿Cuánto debo ahorrar cada mes para lograr mi objetivo?",
      "answer": "Depende de tu meta, ahorro previo, plazo y rentabilidad esperada. La herramienta calcula la cuota mensual constante exacta para llegar justo a tiempo."
    },
    {
      "id": "sg-faq-2",
      "question": "¿Cómo reducen los rendimientos lo que debo ahorrar?",
      "answer": "Un rendimiento positivo cubre parte del camino con intereses compuestos; cuanto mayor sea el retorno, menor la cuota mensual, aunque con más riesgo."
    },
    {
      "id": "sg-faq-3",
      "question": "¿Qué rentabilidad conviene suponer?",
      "answer": "Para metas cortas de 1 a 2 años usa tasas bajas seguras; para plazos largos puedes probar retornos moderados de carteras diversificadas."
    },
    {
      "id": "sg-faq-4",
      "question": "¿Qué ocurre si empiezo a ahorrar más tarde?",
      "answer": "Un plazo menor reduce el efecto compuesto y obliga a aportar bastante más cada mes."
    },
    {
      "id": "sg-faq-5",
      "question": "¿Debo incluir mis ahorros actuales?",
      "answer": "Sí, porque siguen creciendo durante todo el horizonte y reducen la cuota mensual necesaria."
    },
    {
      "id": "sg-faq-6",
      "question": "¿Conviene crear un fondo de emergencia antes?",
      "answer": "Generalmente sí, para que un imprevisto no interrumpa tus metas. Puedes calcularlo con la calculadora de fondo de emergencia."
    },
    {
      "id": "sg-faq-7",
      "question": "¿Tiene en cuenta la inflación?",
      "answer": "No directamente; para metas a muchos años ajusta primero tu meta en la calculadora de inflación."
    },
    {
      "id": "sg-faq-8",
      "question": "¿Se suben mis cifras a Internet?",
      "answer": "No, todo ocurre localmente en tu navegador."
    }
  ],
  "guide": {
    "title": "Cómo planificar y alcanzar una meta de ahorro",
    "description": "Fórmula de ahorro mensual, papel del rendimiento esperado y por qué el plazo reduce tu esfuerzo mensual."
  },
  "ui": {
    "scenarios": {
      "Home down payment": "Entrada vivienda",
      "Wedding": "Boda",
      "New car": "Coche nuevo"
    },
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "heroLabel": "Ahorra cada mes",
      "heroNoteTpl": "durante {months} meses",
      "cardInvested": "Total aportado por ti",
      "cardInterest": "Crecimiento por retornos",
      "cardGoal": "Meta",
      "errMinMonths": "Introduce al menos unos meses para ahorrar.",
      "insMet": "Tus ahorros actuales ya alcanzan esta meta.",
      "insReturnsTpl": "Los rendimientos cubren {interest} del objetivo, así que aportas menos dinero propio.",
      "insEarlier": "Empezar antes permite que los intereses trabajen más y baja la cuota mensual necesaria.",
      "msMet": "Meta ya alcanzada",
      "msReturns": "Los retornos ayudan a cubrir la meta",
      "asmRate": "Rentabilidad esperada",
      "asmHorizon": "Horizonte",
      "asmStart": "Saldo inicial",
      "decCompound": "Mira cómo capitaliza el saldo mes a mes",
      "decInflation": "Comprueba la meta frente a la inflación",
      "decEmergency": "Asegura primero tu fondo de emergencia",
      "q1": "¿Y si la rentabilidad resulta inferior a la esperada?",
      "q2": "¿Cómo cambia la meta por la inflación?",
      "expMetTpl": "Con {current} ya ahorrados alcanzaste la meta de {goal}.",
      "explanationTpl": "Para reunir {goal} en {years} {unit} partiendo de {current} al {rate} anual, aparta {monthly} al mes.",
      "errEnterTpl": "Introduce {label} para calcular.",
      "errNotNumberTpl": "{label} debe ser un número.",
      "errNotNegativeTpl": "{Label} no puede ser negativo. Introduce 0 o más.",
      "errMinTpl": "{Label} no puede ser menor que {min}.",
      "errMaxTpl": "{Label} no puede ser mayor que {max}.",
      "errPositiveTpl": "{label} debe ser mayor que cero.",
      "yearSingular": "año",
      "yearsPlural": "años",
      "neverLabel": "nunca",
      "vLabels": {
        "amount": "el importe",
        "rate": "la tasa",
        "years": "los años",
        "goal": "la meta de ahorro",
        "current": "el ahorro actual",
        "start": "el valor inicial",
        "end": "el valor final"
      }
    },
    "yearOne": "año",
    "yearMany": "años",
    "heroLabel": "Ahorra cada mes",
    "heroNoteTpl": "durante {months} meses",
    "cardInvested": "Total aportado por ti",
    "cardInterest": "Crecimiento por retornos",
    "cardGoal": "Meta",
    "errMinMonths": "Introduce al menos unos meses para ahorrar.",
    "insMet": "Tus ahorros actuales ya alcanzan esta meta.",
    "insReturnsTpl": "Los rendimientos cubren {interest} del objetivo, así que aportas menos dinero propio.",
    "insEarlier": "Empezar antes permite que los intereses trabajen más y baja la cuota mensual necesaria.",
    "msMet": "Meta ya alcanzada",
    "msReturns": "Los retornos ayudan a cubrir la meta",
    "asmRate": "Rentabilidad esperada",
    "asmHorizon": "Horizonte",
    "asmStart": "Saldo inicial",
    "decCompound": "Mira cómo capitaliza el saldo mes a mes",
    "decInflation": "Comprueba la meta frente a la inflación",
    "decEmergency": "Asegura primero tu fondo de emergencia",
    "q1": "¿Y si la rentabilidad resulta inferior a la esperada?",
    "q2": "¿Cómo cambia la meta por la inflación?",
    "expMetTpl": "Con {current} ya ahorrados alcanzaste la meta de {goal}.",
    "explanationTpl": "Para reunir {goal} en {years} {unit} partiendo de {current} al {rate} anual, aparta {monthly} al mes.",
    "errEnterTpl": "Introduce {label} para calcular.",
    "errNotNumberTpl": "{label} debe ser un número.",
    "errNotNegativeTpl": "{Label} no puede ser negativo. Introduce 0 o más.",
    "errMinTpl": "{Label} no puede ser menor que {min}.",
    "errMaxTpl": "{Label} no puede ser mayor que {max}.",
    "errPositiveTpl": "{label} debe ser mayor que cero.",
    "yearSingular": "año",
    "yearsPlural": "años",
    "neverLabel": "nunca",
    "vLabels": {
      "amount": "el importe",
      "rate": "la tasa",
      "years": "los años",
      "goal": "la meta de ahorro",
      "current": "el ahorro actual",
      "start": "el valor inicial",
      "end": "el valor final"
    }
  },
  "fields": {
    "goal": {
      "label": "Objetivo de ahorro"
    },
    "current": {
      "label": "Ahorro actual"
    },
    "rate": {
      "label": "Rentabilidad anual esperada"
    },
    "years": {
      "label": "Años para ahorrar",
      "unit": "años"
    }
  }
};
