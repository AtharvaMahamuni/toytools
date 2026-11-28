import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "compound-interest-calculator",
  "name": "Calculadora de Interés Compuesto",
  "seoTitle": "Calculadora de Interés Compuesto Online",
  "description": "Calcula el crecimiento del interés compuesto con aportaciones mensuales y frecuencia de capitalización. Todo se calcula en tu dispositivo.",
  "tagline": "Proyecta tu capital con interés compuesto y aportaciones mensuales.",
  "methodology": {
    "name": "Fórmula de capitalización periódica",
    "detail": "El valor futuro sigue FV = P(1 + r/n)^(n × t), más el valor futuro de tus aportaciones periódicas."
  },
  "knowledge": {
    "primaryConcepts": [
      "interés compuesto"
    ],
    "realWorldUseCases": [
      "Proyectar el crecimiento de ahorros o fondos a varios años",
      "Medir el efecto de aportar una cuota mensual constante",
      "Comparar capitalización mensual frente a anual",
      "Planificar ahorro para jubilación o estudios"
    ],
    "commonMistakes": [
      "Confundir la tasa anual con la tasa de cada periodo",
      "Suponer que el rendimiento compuesto está garantizado en renta variable"
    ]
  },
  "faqs": [
    {
      "id": "ci-faq-1",
      "question": "¿Qué es el interés compuesto?",
      "answer": "Es el interés calculado tanto sobre tu capital inicial como sobre los intereses ya acumulados. Cada periodo genera rendimiento sobre un saldo mayor, acelerando el crecimiento exponencialmente con el tiempo."
    },
    {
      "id": "ci-faq-2",
      "question": "¿Cómo se calcula el interés compuesto?",
      "answer": "Se utiliza la fórmula FV = P(1 + r/n)^(n × t), donde P es el capital, r la tasa anual decimal, n las capitalizaciones por año y t los años. Por ejemplo, 10.000 al 7% mensual durante 20 años alcanzan unos 40.387."
    },
    {
      "id": "ci-faq-3",
      "question": "¿Qué diferencia hay entre capitalización mensual y anual?",
      "answer": "Capitalizar mensualmente suma intereses antes al saldo, generando un rendimiento ligeramente mayor que la capitalización anual a igualdad de tasa nominal. No obstante, el plazo y la tasa pesan mucho más."
    },
    {
      "id": "ci-faq-4",
      "question": "¿El interés compuesto es igual que la TACC o CAGR?",
      "answer": "Son perspectivas complementarias: el interés compuesto proyecta un valor futuro desde una tasa conocida, mientras que la CAGR calcula hacia atrás la tasa anual constante entre un inicio y un final."
    },
    {
      "id": "ci-faq-5",
      "question": "¿Se puede perder dinero con interés compuesto?",
      "answer": "La fórmula matemática siempre suma rendimientos positivos, pero en inversiones reales de renta variable existen años negativos. Usa tasas conservadoras y trátalo como proyección estimada."
    },
    {
      "id": "ci-faq-6",
      "question": "¿Cuánto influyen las aportaciones mensuales?",
      "answer": "Muchísimo en plazos largos: cada depósito mensual compone durante el tiempo restante, superando a menudo al capital inicial en el saldo final."
    },
    {
      "id": "ci-faq-7",
      "question": "¿Incluye impuestos o comisiones esta calculadora?",
      "answer": "No. Muestra rendimiento bruto sin retenciones ni comisiones ni inflación. Para descontar gastos, reduce la tasa ingresada o usa la calculadora de inflación después."
    },
    {
      "id": "ci-faq-8",
      "question": "¿Cuánto es 1.000 al 5% durante 10 años?",
      "answer": "Con capitalización anual son unos 1.629 y con capitalización mensual unos 1.647, ya que el interés se reinvierte doce veces al año."
    },
    {
      "id": "ci-faq-9",
      "question": "¿Se suben mis cifras financieras a algún servidor?",
      "answer": "No. Toda la matemática se ejecuta en tu navegador y tus cifras permanecen en tu dispositivo."
    }
  ],
  "guide": {
    "title": "Cómo funciona el interés compuesto",
    "description": "Aprende cómo crecen tus ahorros con frecuencia de capitalización, aportes mensuales y ejemplos reales."
  },
  "ui": {
    "scenarios": {
      "Retirement": "Jubilación",
      "Child education": "Estudios",
      "Dream house": "Vivienda"
    },
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "heroLabel": "Monto final",
      "heroNoteTpl": "tras {years} {unit}",
      "cardInterest": "Intereses ganados",
      "cardPrincipal": "Capital invertido",
      "cardContrib": "Aportaciones totales",
      "brkPrincipal": "Capital inicial",
      "brkContrib": "Aportaciones",
      "brkInterest": "Intereses",
      "freqs": {
        "1": "anual",
        "4": "trimestral",
        "12": "mensual",
        "365": "diaria"
      },
      "insShareTpl": "Los intereses representan el {pct}% del saldo final; el resto es dinero aportado por ti.",
      "insContrib": "A largo plazo, la mayor parte del patrimonio suele provenir del interés compuesto más que del depósito inicial.",
      "msDoubled": "Capital duplicado",
      "msExceeds": "Los intereses superan tus aportes",
      "asmRate": "Tasa anual",
      "asmCompounding": "Capitalización",
      "asmContrib": "Aportación",
      "moUnit": "mes",
      "none": "ninguna",
      "decInflation": "Comprueba cómo afecta la inflación a este monto",
      "decRule72": "Estima cuántos años tarda en duplicarse",
      "decGoal": "Calcula desde un objetivo de ahorro",
      "q1": "¿Cuánto debería aportar al mes para lograr una meta?",
      "q2": "¿Qué valor real tendrá tras la inflación?",
      "expContribTpl": " y añadiendo {amount} al mes",
      "explanationTpl": "Partiendo de {principal}{contribClause} al {rate} con capitalización {freq}, el saldo crece hasta {final} tras {years} {unit}.",
      "vizTitle": "Evolución del saldo en el tiempo",
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
    "heroLabel": "Monto final",
    "heroNoteTpl": "tras {years} {unit}",
    "cardInterest": "Intereses ganados",
    "cardPrincipal": "Capital invertido",
    "cardContrib": "Aportaciones totales",
    "brkPrincipal": "Capital inicial",
    "brkContrib": "Aportaciones",
    "brkInterest": "Intereses",
    "freqs": {
      "1": "anual",
      "4": "trimestral",
      "12": "mensual",
      "365": "diaria"
    },
    "insShareTpl": "Los intereses representan el {pct}% del saldo final; el resto es dinero aportado por ti.",
    "insContrib": "A largo plazo, la mayor parte del patrimonio suele provenir del interés compuesto más que del depósito inicial.",
    "msDoubled": "Capital duplicado",
    "msExceeds": "Los intereses superan tus aportes",
    "asmRate": "Tasa anual",
    "asmCompounding": "Capitalización",
    "asmContrib": "Aportación",
    "moUnit": "mes",
    "none": "ninguna",
    "decInflation": "Comprueba cómo afecta la inflación a este monto",
    "decRule72": "Estima cuántos años tarda en duplicarse",
    "decGoal": "Calcula desde un objetivo de ahorro",
    "q1": "¿Cuánto debería aportar al mes para lograr una meta?",
    "q2": "¿Qué valor real tendrá tras la inflación?",
    "expContribTpl": " y añadiendo {amount} al mes",
    "explanationTpl": "Partiendo de {principal}{contribClause} al {rate} con capitalización {freq}, el saldo crece hasta {final} tras {years} {unit}.",
    "vizTitle": "Evolución del saldo en el tiempo",
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
    "principal": {
      "label": "Capital inicial"
    },
    "rate": {
      "label": "Tasa de interés anual"
    },
    "frequency": {
      "label": "Frecuencia de capitalización",
      "options": {
        "1": "Anual",
        "4": "Trimestral",
        "12": "Mensual",
        "365": "Diaria"
      }
    },
    "years": {
      "label": "Años",
      "unit": "años"
    },
    "contribution": {
      "label": "Aportación mensual",
      "help": "Opcional. Se añade al final de cada mes."
    }
  }
};
