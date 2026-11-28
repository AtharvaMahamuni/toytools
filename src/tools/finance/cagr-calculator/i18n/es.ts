import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "cagr-calculator",
  "name": "Calculadora CAGR",
  "seoTitle": "Calculadora CAGR: Tasa de Crecimiento Anual Compuesto",
  "description": "Calcula el CAGR (tasa de crecimiento anual compuesto), crecimiento total, múltiplo y tiempo de duplicación entre valor inicial y final.",
  "tagline": "Tasa anual compuesta (CAGR), crecimiento total y duplicación.",
  "methodology": {
    "name": "Tasa de crecimiento anual compuesto",
    "detail": "La tasa anual única (End/Start)^(1/t) − 1 que convierte el valor inicial en el final durante el periodo."
  },
  "knowledge": {
    "primaryConcepts": [
      "CAGR (crecimiento anual compuesto)"
    ],
    "realWorldUseCases": [
      "Anualizar la rentabilidad plurianual de un fondo o acción",
      "Medir el crecimiento compuesto de ingresos empresariales",
      "Comparar inversiones con distinta duración",
      "Contrastar tasas históricas frente a proyecciones"
    ],
    "commonMistakes": [
      "Dividir el crecimiento total entre los años en vez de usar raíz n-ésima",
      "Usar CAGR cuando hubo ingresos o retiros de efectivo en medio"
    ]
  },
  "faqs": [
    {
      "id": "cagr-faq-1",
      "question": "¿Qué es el CAGR?",
      "answer": "La tasa de crecimiento anual compuesto (CAGR) es la tasa constante anual que lleva una inversión de su valor inicial al final tras t años."
    },
    {
      "id": "cagr-faq-2",
      "question": "¿Cómo se calcula el CAGR?",
      "answer": "Se divide valor final entre valor inicial, se eleva a (1 / años) y se resta 1: (Fin / Inicio)^(1/t) − 1."
    },
    {
      "id": "cagr-faq-3",
      "question": "¿Por qué es menor que dividir el crecimiento total entre los años?",
      "answer": "Porque cada año capitaliza sobre el anterior; una tasa anual menor logra el mismo salto acumulado que una división lineal."
    },
    {
      "id": "cagr-faq-4",
      "question": "¿Qué diferencia hay entre CAGR y ROI?",
      "answer": "El ROI da el cambio porcentual acumulado total; el CAGR lo expresa en términos anuales para poder comparar horizontes distintos."
    },
    {
      "id": "cagr-faq-5",
      "question": "¿Puede ser negativo el CAGR?",
      "answer": "Sí. Si el valor final cae por debajo del inicial, el CAGR refleja la tasa anual media de caída."
    },
    {
      "id": "cagr-faq-6",
      "question": "¿Qué limitaciones tiene el CAGR?",
      "answer": "Oculta la volatilidad intermedia y no sirve si se hicieron depósitos o retiradas durante el intervalo evaluado."
    },
    {
      "id": "cagr-faq-7",
      "question": "¿Cómo se relaciona con el tiempo de duplicación?",
      "answer": "El tiempo exacto para doblar es ln(2) / ln(1 + CAGR), muy próximo a la estimación rápida 72 / porcentaje."
    },
    {
      "id": "cagr-faq-8",
      "question": "¿Cómo anualizo el crecimiento de varios años?",
      "answer": "Calcula el múltiplo (Final / Inicial), elévalo a 1 / años y resta 1; duplicar en 5 años equivale a 14,87% anual, no 20%."
    },
    {
      "id": "cagr-faq-9",
      "question": "¿Qué diferencia hay entre CAGR y media aritmética anual?",
      "answer": "La media aritmética sobreestima siempre que hay oscilaciones: subir 100% y bajar 50% promedia +25% aritmético pero da 0% CAGR."
    },
    {
      "id": "cagr-faq-10",
      "question": "¿Dos activos con igual CAGR pueden tener distinto riesgo?",
      "answer": "Sí. Uno pudo subir de forma estable y otro sufrir caídas del 40% antes de recuperarse al mismo valor final."
    },
    {
      "id": "cagr-faq-11",
      "question": "¿Por qué el CAGR parece bajo frente al crecimiento total?",
      "answer": "Un +400% (5×) en 20 años supone 8,4% CAGR debido al efecto exponencial, mucho menos que 400 / 20."
    },
    {
      "id": "cagr-faq-12",
      "question": "¿Se suben mis cifras financieras?",
      "answer": "No. Todo el cálculo se ejecuta localmente en tu navegador."
    }
  ],
  "guide": {
    "title": "Qué es el CAGR y cómo calcularlo",
    "description": "Fórmula del CAGR, por qué vence a la media aritmética y el ROI simple, y cuándo puede inducir a error."
  },
  "ui": {
    "scenarios": {
      "Index fund decade": "Década en índice",
      "Fast-growing revenue": "Ingresos rápidos",
      "Slow saver": "Ahorro lento"
    },
    "engine": {
      "heroLabel": "CAGR (crecimiento anual compuesto)",
      "heroNoteTpl": "anual durante {period}",
      "cardGrowth": "Crecimiento total",
      "cardDecline": "Caída total",
      "cardMultiple": "Múltiplo de crecimiento",
      "cardDoubles": "Se duplica cada",
      "insPosTpl": "Un crecimiento total del {total} en {period} equivale al {cagr} anual, menor que dividir entre años por efecto compuesto.",
      "insNegTpl": "El valor cayó una media compuesta del {cagr} anual en este periodo.",
      "insShort": "Anualizar periodos menores a un año extrapola un tramo corto a todo un año; interpreta la cifra con cautela.",
      "insSmooth": "El CAGR asume crecimiento uniforme cada año; los mercados reales fluctúan entre principio y fin.",
      "msDoubled": "El valor al menos se duplicó",
      "msDoubleDigit": "Crecimiento anual de dos dígitos",
      "asmGrowth": "Crecimiento",
      "asmGrowthVal": "constante con capitalización anual",
      "asmCash": "Flujos",
      "asmCashVal": "sin aportes ni retiros durante el periodo",
      "asmFigures": "Cifras",
      "asmFiguresVal": "antes de impuestos y comisiones",
      "decRoi": "Ver el retorno total simple en su lugar",
      "decRule72": "Estimar duplicación con la Regla del 72",
      "decCompound": "Proyectar a futuro con esta misma tasa",
      "q1": "¿Cuánto crecería a futuro manteniendo esta tasa?",
      "q2": "¿Es antes o después de la inflación?",
      "gainWord": "ganancia",
      "declineWord": "caída",
      "explanationTpl": "Pasar de {start} a {end} en {period} supone un CAGR del {cagr}: la tasa anual constante equivalente a esa {dir}.",
      "vizTitle": "Trayectoria anualizada equivalente",
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
    "heroLabel": "CAGR (crecimiento anual compuesto)",
    "heroNoteTpl": "anual durante {period}",
    "cardGrowth": "Crecimiento total",
    "cardDecline": "Caída total",
    "cardMultiple": "Múltiplo de crecimiento",
    "cardDoubles": "Se duplica cada",
    "insPosTpl": "Un crecimiento total del {total} en {period} equivale al {cagr} anual, menor que dividir entre años por efecto compuesto.",
    "insNegTpl": "El valor cayó una media compuesta del {cagr} anual en este periodo.",
    "insShort": "Anualizar periodos menores a un año extrapola un tramo corto a todo un año; interpreta la cifra con cautela.",
    "insSmooth": "El CAGR asume crecimiento uniforme cada año; los mercados reales fluctúan entre principio y fin.",
    "msDoubled": "El valor al menos se duplicó",
    "msDoubleDigit": "Crecimiento anual de dos dígitos",
    "asmGrowth": "Crecimiento",
    "asmGrowthVal": "constante con capitalización anual",
    "asmCash": "Flujos",
    "asmCashVal": "sin aportes ni retiros durante el periodo",
    "asmFigures": "Cifras",
    "asmFiguresVal": "antes de impuestos y comisiones",
    "decRoi": "Ver el retorno total simple en su lugar",
    "decRule72": "Estimar duplicación con la Regla del 72",
    "decCompound": "Proyectar a futuro con esta misma tasa",
    "q1": "¿Cuánto crecería a futuro manteniendo esta tasa?",
    "q2": "¿Es antes o después de la inflación?",
    "gainWord": "ganancia",
    "declineWord": "caída",
    "explanationTpl": "Pasar de {start} a {end} en {period} supone un CAGR del {cagr}: la tasa anual constante equivalente a esa {dir}.",
    "vizTitle": "Trayectoria anualizada equivalente",
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
    "start": {
      "label": "Valor inicial"
    },
    "end": {
      "label": "Valor final"
    },
    "years": {
      "label": "Periodo",
      "unit": "años"
    }
  }
};
