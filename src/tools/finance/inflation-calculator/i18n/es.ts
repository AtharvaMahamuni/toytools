import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "inflation-calculator",
  "name": "Calculadora de Inflación",
  "seoTitle": "Calculadora de Inflación: Poder Adquisitivo Futuro",
  "description": "Calcula cuánto valdrá tu dinero tras la inflación, el poder adquisitivo perdido y el costo futuro de los mismos bienes en tu navegador.",
  "tagline": "Cuánto valdrá tu dinero mañana y cuánto costarán las cosas.",
  "methodology": {
    "name": "Capitalización compuesta de precios",
    "detail": "La inflación compone igual que los intereses, reduciendo el poder de compra de forma geométrica."
  },
  "knowledge": {
    "primaryConcepts": [
      "inflación"
    ],
    "realWorldUseCases": [
      "Estimar el valor real de los ahorros al jubilarse",
      "Calcular cuánto debe subir un salario para no perder poder de compra",
      "Ajustar metas futuras a precios reales",
      "Comparar rentabilidad nominal frente a inflación"
    ],
    "commonMistakes": [
      "Confundir valor nominal con valor real en poder de compra",
      "Subestimar la composición geométrica de la inflación a 20 años"
    ]
  },
  "faqs": [
    {
      "id": "inf-faq-1",
      "question": "¿Qué valdrá mi dinero tras la inflación?",
      "answer": "La inflación reduce lo que compra una suma fija. Se calcula dividiendo el capital actual entre (1 + tasa)^(años). Por ejemplo, 100.000 al 3% durante 25 años compran lo mismo que unos 47.761 actuales."
    },
    {
      "id": "inf-faq-2",
      "question": "¿Cuál es la diferencia entre valor real y nominal?",
      "answer": "El valor nominal es la cifra escrita en billetes; el valor real ajusta esa cifra por inflación para mostrar su poder adquisitivo equivalente hoy."
    },
    {
      "id": "inf-faq-3",
      "question": "¿Cómo afecta la inflación al dinero guardado en efectivo?",
      "answer": "Si el efectivo rinde 1% pero la inflación sube al 3%, pierdes alrededor de un 2% de poder adquisitivo real cada año."
    },
    {
      "id": "inf-faq-4",
      "question": "¿Cómo se calcula el costo futuro de un producto?",
      "answer": "Multiplica el precio actual por (1 + inflación)^(años). Al 3% anual, algo de 100.000 hoy costará unos 209.378 dentro de 25 años."
    },
    {
      "id": "inf-faq-5",
      "question": "¿Qué tasa de inflación conviene usar?",
      "answer": "Muchos bancos centrales apuntan al 2%–3% anual, pero en planificación a largo plazo suele probarse entre 3% y 5% según país."
    },
    {
      "id": "inf-faq-6",
      "question": "¿Cómo se le gana a la inflación?",
      "answer": "Necesitas una rentabilidad neta superior a la tasa de inflación, por ejemplo mediante inversiones diversificadas en vez de mantener todo en cuenta corriente."
    },
    {
      "id": "inf-faq-7",
      "question": "¿Por qué importa tanto una tasa anual aparentemente baja?",
      "answer": "Porque se acumula de forma compuesta: un 3% sostenido durante 25 años recorta más de la mitad del poder adquisitivo."
    }
  ],
  "guide": {
    "title": "Cómo afecta la inflación a tus ahorros",
    "description": "Cómo erosiona el poder de compra al 3%, 5% y 7%, retorno real vs nominal y regla del 72."
  },
  "ui": {
    "engine": {
      "yearOne": "año",
      "yearMany": "años",
      "heroLabel": "Poder adquisitivo futuro",
      "heroNoteTpl": "en dinero actual tras {years} {unit}",
      "cardLost": "Valor perdido por inflación",
      "cardLostPct": "Pérdida de poder adquisitivo",
      "cardCost": "Costo futuro equivalente",
      "insPowerTpl": "La inflación elimina silenciosamente cerca de un {pct} de tu poder adquisitivo en {years} {unit}.",
      "insImpact": "La inflación acumulada suele golpear más de lo previsto; por eso importa superar su ritmo con inversión.",
      "msHalved": "Poder de compra reducido a la mitad",
      "asmRate": "Tasa de inflación",
      "asmPeriod": "Periodo",
      "decCompound": "Busca una rentabilidad que supere la inflación",
      "decRule72": "Estima el tiempo de duplicación",
      "q1": "¿Qué rentabilidad necesito para empatar con la inflación?",
      "q2": "¿Cuánto debo ahorrar para compensarlo?",
      "explanationTpl": "Con una inflación del {rate}, {amount} de hoy comprarán lo mismo que {real} actuales dentro de {years} {unit}. Los mismos bienes costarán {futureCost}.",
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
    "heroLabel": "Poder adquisitivo futuro",
    "heroNoteTpl": "en dinero actual tras {years} {unit}",
    "cardLost": "Valor perdido por inflación",
    "cardLostPct": "Pérdida de poder adquisitivo",
    "cardCost": "Costo futuro equivalente",
    "insPowerTpl": "La inflación elimina silenciosamente cerca de un {pct} de tu poder adquisitivo en {years} {unit}.",
    "insImpact": "La inflación acumulada suele golpear más de lo previsto; por eso importa superar su ritmo con inversión.",
    "msHalved": "Poder de compra reducido a la mitad",
    "asmRate": "Tasa de inflación",
    "asmPeriod": "Periodo",
    "decCompound": "Busca una rentabilidad que supere la inflación",
    "decRule72": "Estima el tiempo de duplicación",
    "q1": "¿Qué rentabilidad necesito para empatar con la inflación?",
    "q2": "¿Cuánto debo ahorrar para compensarlo?",
    "explanationTpl": "Con una inflación del {rate}, {amount} de hoy comprarán lo mismo que {real} actuales dentro de {years} {unit}. Los mismos bienes costarán {futureCost}.",
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
    "amount": {
      "label": "Importe actual"
    },
    "rate": {
      "label": "Inflación anual"
    },
    "years": {
      "label": "Años",
      "unit": "años"
    }
  }
};
