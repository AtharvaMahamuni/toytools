import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "roi-calculator",
  "name": "Calculadora de ROI",
  "seoTitle": "Calculadora de ROI: Retorno y Tasa Anualizada",
  "description": "Calcula el retorno de inversión (ROI), la ganancia neta y la tasa anualizada equivalente según el periodo invertido. 100% privado.",
  "tagline": "Retorno sobre la inversión total y tasa anualizada.",
  "methodology": {
    "name": "ROI con anualización",
    "detail": "Divide la ganancia neta entre el costo y convierte el resultado en tasa compuesta anual cuando indicas el plazo."
  },
  "knowledge": {
    "primaryConcepts": [
      "retorno de inversión (ROI)"
    ],
    "realWorldUseCases": [
      "Evaluar el rendimiento real de una acción tras vender",
      "Comparar la venta de un inmueble frente a renta variable",
      "Medir si un proyecto recuperó el capital invertido",
      "Traducir ganancias de varios años a una tasa anual"
    ],
    "commonMistakes": [
      "Comparar ROI simples de distintos plazos sin anualizar",
      "Omitir comisiones, impuestos o dividendos cobrados"
    ]
  },
  "faqs": [
    {
      "id": "roi-faq-1",
      "question": "¿Cómo se calcula el ROI?",
      "answer": "Se resta el importe invertido al valor final, se divide entre el importe invertido y se multiplica por 100: ((Valor final − Costo) / Costo) × 100."
    },
    {
      "id": "roi-faq-2",
      "question": "¿Qué es un buen ROI?",
      "answer": "Depende totalmente del plazo. Un 50% en un año es excelente, pero en quince años equivale apenas al 2,7% anual. Usa el retorno anualizado para juzgarlo."
    },
    {
      "id": "roi-faq-3",
      "question": "¿Qué diferencia hay entre ROI y retorno anualizado?",
      "answer": "El ROI mide la ganancia total acumulada sin mirar el reloj; el retorno anualizado la traduce a una tasa anual compuesta comparable entre activos."
    },
    {
      "id": "roi-faq-4",
      "question": "¿Esta calculadora admite pérdidas?",
      "answer": "Sí. Si el valor final es inferior al invertido, verás el ROI negativo y la pérdida neta exacta."
    },
    {
      "id": "roi-faq-5",
      "question": "¿Debo incluir comisiones, impuestos y dividendos?",
      "answer": "Sí, para un ROI honesto suma las comisiones de compra al costo e incluye dividendos o rentas cobradas en el valor final neto."
    },
    {
      "id": "roi-faq-6",
      "question": "¿En qué se diferencia el ROI del CAGR?",
      "answer": "El ROI responde cuánto ganaste en total, y el CAGR indica qué tasa anual constante representa esa ganancia."
    },
    {
      "id": "roi-faq-7",
      "question": "¿Se suben mis datos financieros?",
      "answer": "No. Los cálculos ocurren localmente en tu navegador."
    }
  ],
  "guide": {
    "title": "Cómo calcular el ROI y el retorno anualizado",
    "description": "Fórmula del ROI, diferencia frente al retorno anualizado y cómo incluir comisiones, dividendos y pérdidas."
  },
  "ui": {
    "scenarios": {
      "Stock position": "Acción bursátil",
      "Property sale": "Venta inmueble",
      "Losing trade": "Operación con pérdida"
    },
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "yrUnit": "año",
      "notSpecified": "no especificado",
      "heroLabel": "Retorno de inversión (ROI)",
      "noteGainTpl": "ganancia neta de {amt}",
      "noteLossTpl": "pérdida de {amt}",
      "cardGain": "Ganancia neta",
      "cardLoss": "Pérdida neta",
      "cardFinal": "Valor final",
      "cardAnnualized": "Retorno anualizado",
      "insGainTpl": "Cada {base} invertido regresó convertido en {back}.",
      "insLossTpl": "Esta posición perdió {loss}, un retroceso del {pct} respecto al costo.",
      "insAnnualTpl": "El ROI simple omite el tiempo. En {years} años equivale al {annual} anual para comparar justamente.",
      "insNoPeriod": "Añade los años de tenencia para ver el retorno anualizado.",
      "msDoubled": "Inversión al menos duplicada",
      "msAhead": "Saldo positivo frente al costo",
      "asmFigures": "Cifras",
      "asmFiguresVal": "antes de impuestos y comisiones",
      "asmCash": "Flujos",
      "asmCashVal": "una compra y una salida final sin flujos intermedios",
      "asmPeriod": "Tenencia",
      "decCagr": "Analiza esta tasa como CAGR limpia",
      "decCompound": "Proyecta qué podría crecer a futuro",
      "decInflation": "Compara esta ganancia frente a la inflación",
      "q1": "¿A qué rentabilidad anual equivale?",
      "q2": "¿Cómo se compara frente a un fondo indexado?",
      "returnWord": "retorno",
      "lossWord": "pérdida",
      "expAnnualTpl": " ({annual} al año durante {years} {unit})",
      "explanationTpl": "Invertiste {cost} y cerraste en {final}, un {pct} de {dir}{annualClause}.",
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
    "yrUnit": "año",
    "notSpecified": "no especificado",
    "heroLabel": "Retorno de inversión (ROI)",
    "noteGainTpl": "ganancia neta de {amt}",
    "noteLossTpl": "pérdida de {amt}",
    "cardGain": "Ganancia neta",
    "cardLoss": "Pérdida neta",
    "cardFinal": "Valor final",
    "cardAnnualized": "Retorno anualizado",
    "insGainTpl": "Cada {base} invertido regresó convertido en {back}.",
    "insLossTpl": "Esta posición perdió {loss}, un retroceso del {pct} respecto al costo.",
    "insAnnualTpl": "El ROI simple omite el tiempo. En {years} años equivale al {annual} anual para comparar justamente.",
    "insNoPeriod": "Añade los años de tenencia para ver el retorno anualizado.",
    "msDoubled": "Inversión al menos duplicada",
    "msAhead": "Saldo positivo frente al costo",
    "asmFigures": "Cifras",
    "asmFiguresVal": "antes de impuestos y comisiones",
    "asmCash": "Flujos",
    "asmCashVal": "una compra y una salida final sin flujos intermedios",
    "asmPeriod": "Tenencia",
    "decCagr": "Analiza esta tasa como CAGR limpia",
    "decCompound": "Proyecta qué podría crecer a futuro",
    "decInflation": "Compara esta ganancia frente a la inflación",
    "q1": "¿A qué rentabilidad anual equivale?",
    "q2": "¿Cómo se compara frente a un fondo indexado?",
    "returnWord": "retorno",
    "lossWord": "pérdida",
    "expAnnualTpl": " ({annual} al año durante {years} {unit})",
    "explanationTpl": "Invertiste {cost} y cerraste en {final}, un {pct} de {dir}{annualClause}.",
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
    "cost": {
      "label": "Importe invertido"
    },
    "final": {
      "label": "Valor final",
      "help": "Valor actual o importe obtenido al vender."
    },
    "years": {
      "label": "Periodo de tenencia",
      "unit": "años",
      "help": "Opcional. Añade el retorno anualizado para comparar con referencias anuales."
    }
  }
};
