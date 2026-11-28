import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "es",
  "slug": "split-bill",
  "name": "Dividir la Cuenta",
  "seoTitle": "Dividir la Cuenta con Propina Exacta Online",
  "description": "Divide el total de una cena más propina opcional entre 2 y 30 personas asegurando que todas las partes sumen el importe exacto.",
  "tagline": "Reparte la cuenta y la propina con suma exacta.",
  "methodology": {
    "name": "Reparto exacto en céntimos/paise",
    "detail": "Asigna la cuota base igual para todos y añade el resto indivisible a la última persona para que la suma cuadre exacta."
  },
  "knowledge": {
    "primaryConcepts": [
      "dividir cuenta"
    ],
    "realWorldUseCases": [
      "Repartir una cena entre amigos añadiendo propina opcional"
    ],
    "commonMistakes": [
      "Redondear cada parte por separado haciendo que falten céntimos",
      "Confundirlo con una calculadora de comisiones bancarias"
    ]
  },
  "faqs": [
    {
      "id": "bill-faq-1",
      "question": "¿Qué es Dividir la Cuenta?",
      "answer": "Divide el total de una cena más una propina opcional de 0 a 30% entre 2 y 30 personas logrando que todas las cuotas sumen el total exacto."
    },
    {
      "id": "bill-faq-2",
      "question": "¿Cómo funciona el resto indivisible?",
      "answer": "Calcula en unidades mínimas (paise/céntimos), reparte la parte base igual para todos y añade el resto al último participante."
    },
    {
      "id": "bill-faq-3",
      "question": "¿Cómo se ve 1000 con 10% entre 3 personas?",
      "answer": "El total con propina es 1100; tres personas pagan 366,66, 366,66 y 366,68 sumando exactamente 1100."
    },
    {
      "id": "bill-faq-4",
      "question": "¿Y si la división es exacta?",
      "answer": "Entonces todos pagan exactamente lo mismo y no se menciona resto adicional."
    },
    {
      "id": "bill-faq-5",
      "question": "¿Qué porcentajes de propina acepta?",
      "answer": "Enteros opcionales de 0 a 30%. Dejarlo vacío equivale a 0%."
    },
    {
      "id": "bill-faq-6",
      "question": "¿Cuántas personas pueden compartir?",
      "answer": "Entre 2 y 30 personas en números enteros."
    },
    {
      "id": "bill-faq-7",
      "question": "¿Guarda cuentas o listas de amigos?",
      "answer": "No. No requiere cuentas ni almacena nombres ni deudas."
    },
    {
      "id": "bill-faq-8",
      "question": "¿Es un calculador de comisiones de pago?",
      "answer": "No. Solo divide cuentas de mesa con propina voluntaria."
    },
    {
      "id": "bill-faq-9",
      "question": "¿Se suben mis importes?",
      "answer": "No. Todo permanece en tu navegador."
    },
    {
      "id": "bill-faq-10",
      "question": "Dividir la Cuenta vs Calculadora de Propinas",
      "answer": "La calculadora de propinas calcula el total; esta herramienta además reparte las cuotas exactas por comensal."
    }
  ],
  "guide": {
    "title": "Cómo dividir una cuenta justa con resto exacto",
    "description": "Reparto exacto de céntimos sobrantes, reglas de propina opcional y diferencias frente al calculador de propina."
  },
  "ui": {
    "engine": {
      "billNote1": "Si el total no se divide exacto, la última persona asume los céntimos/paise sobrantes para que las partes cuadren.",
      "billNote2": "Es un divisor de cena sin cuentas ni registros; todo permanece en tu dispositivo.",
      "heroLabel": "Total con propina",
      "eachLineTpl": "Cada persona paga {each}.",
      "noteEvenTpl": "{n} personas. {eachLine}",
      "noteOddTpl": "{n} personas. {eachLine} La última persona paga {last}.",
      "insEven": "Todas las partes son idénticas.",
      "insOdd": "La última persona asume los céntimos/paise sobrantes.",
      "msSum": "Las cuotas suman exactamente el total",
      "asmTip": "Propina",
      "noTip": "Sin propina",
      "asmPeople": "Personas",
      "asmRem": "Resto en paise",
      "decTip": "Calcula solo la propina aparte",
      "errBillEmpty": "Introduce el total de la cuenta.",
      "errBillNaN": "El total debe ser un número.",
      "errBillPos": "El total debe ser mayor que cero.",
      "errBillDec": "Usa como máximo dos decimales.",
      "errBillCap": "Ese importe supera el límite de página (10,00,00,000).",
      "errPeopleEmpty": "Introduce cuántas personas son, de 2 a 30.",
      "errPeopleNaN": "Las personas deben ser un número.",
      "errPeopleInt": "El número de personas debe ser entero.",
      "errPeopleRange": "Deben ser entre 2 y 30 personas.",
      "errTipNaN": "La propina debe ser un número.",
      "errTipRange": "La propina debe estar entre 0 y 30%.",
      "errTipInt": "La propina debe ser un entero.",
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
    "billNote1": "Si el total no se divide exacto, la última persona asume los céntimos/paise sobrantes para que las partes cuadren.",
    "billNote2": "Es un divisor de cena sin cuentas ni registros; todo permanece en tu dispositivo.",
    "heroLabel": "Total con propina",
    "eachLineTpl": "Cada persona paga {each}.",
    "noteEvenTpl": "{n} personas. {eachLine}",
    "noteOddTpl": "{n} personas. {eachLine} La última persona paga {last}.",
    "insEven": "Todas las partes son idénticas.",
    "insOdd": "La última persona asume los céntimos/paise sobrantes.",
    "msSum": "Las cuotas suman exactamente el total",
    "asmTip": "Propina",
    "noTip": "Sin propina",
    "asmPeople": "Personas",
    "asmRem": "Resto en paise",
    "decTip": "Calcula solo la propina aparte",
    "errBillEmpty": "Introduce el total de la cuenta.",
    "errBillNaN": "El total debe ser un número.",
    "errBillPos": "El total debe ser mayor que cero.",
    "errBillDec": "Usa como máximo dos decimales.",
    "errBillCap": "Ese importe supera el límite de página (10,00,00,000).",
    "errPeopleEmpty": "Introduce cuántas personas son, de 2 a 30.",
    "errPeopleNaN": "Las personas deben ser un número.",
    "errPeopleInt": "El número de personas debe ser entero.",
    "errPeopleRange": "Deben ser entre 2 y 30 personas.",
    "errTipNaN": "La propina debe ser un número.",
    "errTipRange": "La propina debe estar entre 0 y 30%.",
    "errTipInt": "La propina debe ser un entero.",
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
    "bill": {
      "label": "Total de la cuenta",
      "help": "Admite decimales hasta céntimos. Es un divisor de cena, no comisiones de pago."
    },
    "people": {
      "label": "Personas",
      "unit": "personas",
      "help": "De 2 a 30 personas."
    },
    "tip": {
      "label": "Porcentaje de propina",
      "help": "Opcional, entero de 0 a 30%. Vacío significa sin propina."
    }
  }
};
