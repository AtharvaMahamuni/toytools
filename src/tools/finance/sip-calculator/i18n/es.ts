import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "sip-calculator",
  "name": "Calculadora SIP",
  "seoTitle": "Calculadora SIP: Inversión Mensual y Rentabilidad",
  "description": "Calcula el valor futuro de tu plan de inversión sistemática (SIP), el capital aportado y la ganancia compuesta mes a mes sin salir del navegador.",
  "tagline": "Valor futuro de un plan de inversión mensual constante.",
  "methodology": {
    "name": "Valor futuro de una anualidad",
    "detail": "Cada aporte mensual compone durante los meses restantes; los primeros ingresos generan la mayor parte del crecimiento."
  },
  "knowledge": {
    "primaryConcepts": [
      "plan de inversión sistemática (SIP)"
    ],
    "realWorldUseCases": [
      "Planificar aportaciones mensuales en fondos o ETF",
      "Estimar el capital generado apartando parte del salario",
      "Comparar cuotas mensuales según la meta de ahorro",
      "Visualizar la ventaja de empezar varios años antes"
    ],
    "commonMistakes": [
      "Asumir una rentabilidad alta como rendimiento garantizado",
      "No ajustar el monto futuro por inflación"
    ]
  },
  "faqs": [
    {
      "id": "sip-faq-1",
      "question": "¿Qué es un SIP?",
      "answer": "Un plan de inversión sistemática (SIP) consiste en invertir una suma fija periódicamente (por lo general cada mes) en un fondo o cartera, eliminando la necesidad de acertar el momento exacto del mercado."
    },
    {
      "id": "sip-faq-2",
      "question": "¿Cómo se calcula el valor futuro de un SIP?",
      "answer": "Se suma el crecimiento compuesto de cada cuota mensual mediante la fórmula FV = P × ((1 + i)^n − 1) / i, donde i es la tasa mensual y n los meses totales."
    },
    {
      "id": "sip-faq-3",
      "question": "¿Qué rentabilidad esperada conviene usar?",
      "answer": "Usa un supuesto prudente según el activo. La renta variable diversificada suele modelarse con tasas de un dígito alto a largo plazo, mientras que renta fija rinde menos."
    },
    {
      "id": "sip-faq-4",
      "question": "¿Es mejor el SIP o una inversión única?",
      "answer": "Si ya dispones del dinero completo, un aporte único pasa más tiempo invertido en promedio. El SIP es ideal para ahorrar desde tu salario mensual reduciendo la volatilidad de entrada."
    },
    {
      "id": "sip-faq-5",
      "question": "¿Qué significa promediado de costo (cost averaging)?",
      "answer": "Significa invertir una cantidad fija con regularidad: compras más participaciones cuando los precios bajan y menos cuando suben, suavizando el costo medio."
    },
    {
      "id": "sip-faq-6",
      "question": "¿Por qué importa tanto empezar antes?",
      "answer": "Porque las primeras cuotas componen durante todo el plazo restante. Empezar cinco años antes suele generar más patrimonio que aumentar mucho la cuota más tarde."
    },
    {
      "id": "sip-faq-7",
      "question": "¿Incluye inflación o impuestos?",
      "answer": "No. El resultado es nominal antes de impuestos. Pasa el monto final por la calculadora de inflación para conocer el poder de compra real."
    },
    {
      "id": "sip-faq-8",
      "question": "¿Conviene invertir más al mes o durante más años?",
      "answer": "Con el mismo dinero aportado, el tiempo gana ampliamente: 500/mes por 20 años supera por mucho a 1.000/mes por 10 años gracias al interés compuesto final."
    },
    {
      "id": "sip-faq-9",
      "question": "¿Por qué duplicar el plazo multiplica más de dos veces el resultado?",
      "answer": "Porque la curva de capitalización acelera en los últimos años: en 20 años el capital final puede casi cuadruplicar el alcanzado en 10 años."
    },
    {
      "id": "sip-faq-10",
      "question": "¿Por qué las ganancias parecen bajas al principio?",
      "answer": "En los primeros años las cuotas aún tienen poco recorrido compuesto. A partir de la mitad del plazo el peso de los rendimientos acumulados supera a los aportes."
    },
    {
      "id": "sip-faq-11",
      "question": "¿Por qué difiere de mi extracto real del fondo?",
      "answer": "Los fondos reales tienen precios diarios variables, comisiones de gestión y fechas exactas de liquidación, mientras que la calculadora supone una tasa uniforme."
    },
    {
      "id": "sip-faq-12",
      "question": "¿Se suben mis datos a algún servidor?",
      "answer": "No. Todo el cálculo funciona en tu navegador sin enviar datos."
    }
  ],
  "guide": {
    "title": "Cómo un SIP hace crecer tu inversión mensual",
    "description": "Descubre cómo funciona el promedio de costo, la fórmula del plan mensual y ejemplos a 10 y 20 años."
  },
  "ui": {
    "scenarios": {
      "First salary SIP": "Primer sueldo",
      "Wealth building": "Crear patrimonio",
      "Short-term goal": "Meta a 5 años"
    },
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "heroLabel": "Valor de la inversión",
      "heroNoteTpl": "tras {years} {unit}",
      "cardGain": "Ganancia acumulada",
      "cardInvested": "Total aportado",
      "cardMonths": "Cuotas mensuales",
      "brkLump": "Aporte inicial",
      "brkMonthly": "Aportes mensuales",
      "brkGrowth": "Crecimiento",
      "insShareTpl": "El crecimiento del mercado aporta el {pct}% del valor final; el resto es capital depositado.",
      "insAvg": "Al invertir la misma suma cada mes compras más participaciones cuando bajan los precios (promediado de costo).",
      "msDoubled": "El valor duplica lo aportado",
      "msExceeds": "La ganancia supera tus aportes",
      "asmRate": "Rentabilidad esperada",
      "asmTiming": "Momento del aporte",
      "asmTimingVal": "fin de cada mes",
      "asmCompounding": "Capitalización",
      "asmMonthly": "mensual",
      "asmLump": "Aporte inicial",
      "none": "ninguno",
      "decInflation": "Comprueba el valor real descontando la inflación",
      "decCompound": "Compara con un capital único sin cuotas",
      "decGoal": "Calcula qué cuota necesita tu objetivo",
      "q1": "¿Qué cuota SIP necesito para alcanzar una meta?",
      "q2": "¿Cuánto cambia si empiezo cinco años antes?",
      "expLumpTpl": " más un capital inicial de {lump}",
      "explanationTpl": "Invirtiendo {monthly} al mes{lumpClause} con una tasa anual esperada del {rate}, acumulas {final} tras {years} {unit} (aportado: {invested}, ganancia: {gain}).",
      "vizTitle": "Valor del plan en el tiempo",
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
        "principal": "el capital inicial",
        "rate": "la tasa de interés",
        "years": "el plazo en años",
        "contribution": "la aportación mensual",
        "price": "el precio o importe prestado",
        "down": "la entrada inicial",
        "extra": "el pago mensual extra",
        "monthly": "la inversión mensual",
        "initial": "el capital inicial",
        "cost": "el importe invertido",
        "final": "el valor final",
        "amount": "el importe inicial",
        "goal": "el objetivo de ahorro",
        "current": "el ahorro actual",
        "start": "el valor inicial",
        "end": "el valor final"
      }
    },
    "yearOne": "año",
    "yearMany": "años",
    "heroLabel": "Valor de la inversión",
    "heroNoteTpl": "tras {years} {unit}",
    "cardGain": "Ganancia acumulada",
    "cardInvested": "Total aportado",
    "cardMonths": "Cuotas mensuales",
    "brkLump": "Aporte inicial",
    "brkMonthly": "Aportes mensuales",
    "brkGrowth": "Crecimiento",
    "insShareTpl": "El crecimiento del mercado aporta el {pct}% del valor final; el resto es capital depositado.",
    "insAvg": "Al invertir la misma suma cada mes compras más participaciones cuando bajan los precios (promediado de costo).",
    "msDoubled": "El valor duplica lo aportado",
    "msExceeds": "La ganancia supera tus aportes",
    "asmRate": "Rentabilidad esperada",
    "asmTiming": "Momento del aporte",
    "asmTimingVal": "fin de cada mes",
    "asmCompounding": "Capitalización",
    "asmMonthly": "mensual",
    "asmLump": "Aporte inicial",
    "none": "ninguno",
    "decInflation": "Comprueba el valor real descontando la inflación",
    "decCompound": "Compara con un capital único sin cuotas",
    "decGoal": "Calcula qué cuota necesita tu objetivo",
    "q1": "¿Qué cuota SIP necesito para alcanzar una meta?",
    "q2": "¿Cuánto cambia si empiezo cinco años antes?",
    "expLumpTpl": " más un capital inicial de {lump}",
    "explanationTpl": "Invirtiendo {monthly} al mes{lumpClause} con una tasa anual esperada del {rate}, acumulas {final} tras {years} {unit} (aportado: {invested}, ganancia: {gain}).",
    "vizTitle": "Valor del plan en el tiempo",
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
      "principal": "el capital inicial",
      "rate": "la tasa de interés",
      "years": "el plazo en años",
      "contribution": "la aportación mensual",
      "price": "el precio o importe prestado",
      "down": "la entrada inicial",
      "extra": "el pago mensual extra",
      "monthly": "la inversión mensual",
      "initial": "el capital inicial",
      "cost": "el importe invertido",
      "final": "el valor final",
      "amount": "el importe inicial",
      "goal": "el objetivo de ahorro",
      "current": "el ahorro actual",
      "start": "el valor inicial",
      "end": "el valor final"
    }
  },
  "fields": {
    "monthly": {
      "label": "Inversión mensual"
    },
    "rate": {
      "label": "Rentabilidad anual esperada"
    },
    "years": {
      "label": "Plazo de inversión",
      "unit": "años"
    },
    "initial": {
      "label": "Capital inicial opcional",
      "help": "Opcional. Se invierte una sola vez al inicio junto con el plan."
    }
  }
};
