import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "loan-calculator",
  "name": "Calculadora de Préstamos",
  "seoTitle": "Calculadora de Préstamos e Hipotecas (Cuota)",
  "description": "Calcula la cuota mensual de tu préstamo o hipoteca, los intereses totales y el ahorro al amortizar extra cada mes. Privado y sin servidor.",
  "tagline": "Cuota mensual, intereses totales y ahorro por pagos extra.",
  "methodology": {
    "name": "Amortización a tasa fija",
    "detail": "Divide la tasa anual entre 12 para calcular cuotas iguales; cada pago extra reduce directamente el capital."
  },
  "knowledge": {
    "primaryConcepts": [
      "calculadora de préstamos",
      "cuota mensual"
    ],
    "realWorldUseCases": [
      "Comprobar la cuota mensual de un préstamo personal antes de firmar",
      "Comparar una hipoteca a 20 años frente a 30 años",
      "Calcular intereses ahorrados con pagos extra mensuales",
      "Separar la entrada inicial del capital prestado"
    ],
    "commonMistakes": [
      "Escribir una tasa mensual como 2 en el campo de tasa anual",
      "Leer el plazo en años como si fuesen meses",
      "Creer que un pago extra descuenta la siguiente cuota mensual"
    ]
  },
  "faqs": [
    {
      "id": "loan-faq-payment",
      "question": "¿Cómo se calcula la cuota mensual del préstamo?",
      "answer": "Se divide la tasa anual entre 12 para obtener la tasa mensual y se aplica la fórmula de cuota fija. Por ejemplo, 100.000 al 12% anual a 5 años resultan en 2.224,44 al mes y 33.466,83 de intereses."
    },
    {
      "id": "loan-faq-rate-unit",
      "question": "¿Qué significa escribir un 2% en la tasa?",
      "answer": "Significa 2% anual, nunca mensual (un 2% mensual equivale al 24% anual). Si pones menos del 3% o más del 36%, la herramienta te muestra la equivalencia para evitar errores."
    },
    {
      "id": "loan-faq-extra",
      "question": "¿Un pago adicional mensual ahorra intereses?",
      "answer": "Sí. Cada euro adicional se suma a la cuota y reduce directamente el capital pendiente, acortando la duración del préstamo sin cambiar la cuota contractual."
    },
    {
      "id": "loan-faq-home",
      "question": "¿Una hipoteca usa la misma fórmula?",
      "answer": "Sí. Introduce el precio del inmueble, tu entrada inicial y los años del préstamo. Una entrada mayor reduce el capital financiado y el total de intereses."
    },
    {
      "id": "loan-faq-left-out",
      "question": "¿Incluye seguros, impuestos o comisiones bancarias?",
      "answer": "No. Calcula únicamente capital e intereses a tipo fijo; los seguros vinculados, impuestos y comisiones deben evaluarse aparte."
    },
    {
      "id": "loan-faq-high-rate",
      "question": "¿Por qué con tasas extremas no baja el capital?",
      "answer": "Si los intereses mensuales igualan o superan la cuota mensual, el saldo no disminuye nunca. Necesitas bajar la tasa, acortar el plazo o aportar amortización extra."
    },
    {
      "id": "loan-faq-privacy",
      "question": "¿Se suben los datos de mi préstamo?",
      "answer": "No. Toda la tabla de amortización se calcula localmente en tu navegador."
    }
  ],
  "guide": {
    "title": "Cómo se calcula la cuota de un préstamo fijo",
    "description": "Fórmula de amortización francesa, efecto de la entrada inicial y ahorro con pagos extra a capital."
  },
  "ui": {
    "scenarios": {
      "Personal loan": "Préstamo personal",
      "Home loan, 15 years": "Hipoteca 15 años",
      "Home loan, 20 years": "Hipoteca 20 años",
      "Home loan, 30 years": "Hipoteca 30 años"
    },
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "monthOne": "mes",
      "monthMany": "meses",
      "none": "ninguno",
      "yearlyRateToken": "es una tasa anual",
      "noteLowRateTpl": "{rate} es una tasa anual. {rate} mensual sería un {annualized} anual, y no es eso lo que aplica esta cuota.",
      "noteHighRateTpl": "{rate} es una tasa anual, aproximadamente {monthly} al mes. La cuota usa la tasa anual.",
      "errShortTerm": "El plazo mínimo es de un mes (escribe 0.08 para 1 mes o 0.5 para 6).",
      "errNoBorrow": "Con esa entrada inicial no queda capital por financiar.",
      "errUnpaid": "Esta tasa y plazo nunca amortizan la deuda. Reduce la tasa, acorta el plazo o añade un pago extra.",
      "underTpl": "Menos de {amt}",
      "heroLabel": "Cuota mensual",
      "cardBorrowed": "Importe financiado",
      "cardInterest": "Intereses totales",
      "cardTotal": "Total a pagar",
      "cardPayoff": "Duración real",
      "cardSaved": "Intereses ahorrados",
      "insExtraTpl": "Aportar {extra} extra al mes liquida el préstamo en {payoff} y ahorra {saved} en intereses.",
      "insZero": "Con interés cero, el capital se divide en mensualidades iguales sin coste financiero.",
      "insShareTpl": "Los intereses suponen el {pct}% del total que devuelves.",
      "insTiny": "Los intereses totales son inferiores a medio céntimo.",
      "msPaid": "Préstamo amortizado",
      "msShortened": "El pago extra acortó el plazo",
      "asmRate": "Tasa anual",
      "asmSchedule": "Frecuencia",
      "asmScheduleVal": "Mensual (tasa anual dividida entre 12).",
      "asmDown": "Entrada inicial",
      "asmExtra": "Pago adicional",
      "asmExtraTpl": "{extra} al mes directos al capital",
      "brkPrincipal": "Capital",
      "brkInterest": "Intereses",
      "decSip": "Mira cuánto crecería esa cuota si la invirtieses",
      "decCompound": "Compara con interés compuesto sobre un capital",
      "q1": "¿Cuánto se acorta el plazo con pagos anticipados?",
      "q2": "¿Qué pasaría si invirtieses esa cuota mensual?",
      "expShortTpl": " Un aporte extra de {extra} al mes lo liquida en {payoff}.",
      "explanationTpl": "Financiar {principal} al {rate} anual durante {term} requiere {payment} al mes y genera {interest} en intereses.{shortened}",
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
    "monthOne": "mes",
    "monthMany": "meses",
    "none": "ninguno",
    "yearlyRateToken": "es una tasa anual",
    "noteLowRateTpl": "{rate} es una tasa anual. {rate} mensual sería un {annualized} anual, y no es eso lo que aplica esta cuota.",
    "noteHighRateTpl": "{rate} es una tasa anual, aproximadamente {monthly} al mes. La cuota usa la tasa anual.",
    "errShortTerm": "El plazo mínimo es de un mes (escribe 0.08 para 1 mes o 0.5 para 6).",
    "errNoBorrow": "Con esa entrada inicial no queda capital por financiar.",
    "errUnpaid": "Esta tasa y plazo nunca amortizan la deuda. Reduce la tasa, acorta el plazo o añade un pago extra.",
    "underTpl": "Menos de {amt}",
    "heroLabel": "Cuota mensual",
    "cardBorrowed": "Importe financiado",
    "cardInterest": "Intereses totales",
    "cardTotal": "Total a pagar",
    "cardPayoff": "Duración real",
    "cardSaved": "Intereses ahorrados",
    "insExtraTpl": "Aportar {extra} extra al mes liquida el préstamo en {payoff} y ahorra {saved} en intereses.",
    "insZero": "Con interés cero, el capital se divide en mensualidades iguales sin coste financiero.",
    "insShareTpl": "Los intereses suponen el {pct}% del total que devuelves.",
    "insTiny": "Los intereses totales son inferiores a medio céntimo.",
    "msPaid": "Préstamo amortizado",
    "msShortened": "El pago extra acortó el plazo",
    "asmRate": "Tasa anual",
    "asmSchedule": "Frecuencia",
    "asmScheduleVal": "Mensual (tasa anual dividida entre 12).",
    "asmDown": "Entrada inicial",
    "asmExtra": "Pago adicional",
    "asmExtraTpl": "{extra} al mes directos al capital",
    "brkPrincipal": "Capital",
    "brkInterest": "Intereses",
    "decSip": "Mira cuánto crecería esa cuota si la invirtieses",
    "decCompound": "Compara con interés compuesto sobre un capital",
    "q1": "¿Cuánto se acorta el plazo con pagos anticipados?",
    "q2": "¿Qué pasaría si invirtieses esa cuota mensual?",
    "expShortTpl": " Un aporte extra de {extra} al mes lo liquida en {payoff}.",
    "explanationTpl": "Financiar {principal} al {rate} anual durante {term} requiere {payment} al mes y genera {interest} en intereses.{shortened}",
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
    "price": {
      "label": "Precio o importe solicitado"
    },
    "down": {
      "label": "Entrada inicial",
      "help": "Opcional. Se descuenta del importe financiado."
    },
    "rate": {
      "label": "Tasa de interés anual"
    },
    "years": {
      "label": "Plazo",
      "unit": "años",
      "help": "Para menos de un año usa decimales: 0.5 son 6 meses."
    },
    "extra": {
      "label": "Pago mensual adicional",
      "help": "Opcional. Se suma a la cuota y reduce el capital pendiente."
    }
  }
};
