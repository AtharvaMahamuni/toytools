import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Calculadora de ciclos de sueño",
  "seoTitle": "Calculadora Ciclos de Sueño - Hora de Dormir y Despertar",
  "description": "Calcula a qué hora acostarte o despertarte según ciclos de 90 minutos sumando los minutos reales que tardas en quedarte dormido.",
  "tagline": "Horas de dormir y despertar en ciclos de 90 min más tiempo hasta dormirse.",
  "lead": "Encuentra horas óptimas para acostarte o poner la alarma alineadas con ciclos completos de sueño en tu navegador, sumando tu latencia real.",
  "craft": {
    "solves": "Contar hacia atrás bloques de 90 minutos desde la alarma olvida el tiempo en cama hasta dormirte, haciendo que el despertador suene en mitad de un ciclo."
  },
  "guide": {
    "title": "Hora de dormir con ciclos de 90 minutos",
    "description": "Por qué los ciclos suelen durar 90 minutos, cómo influyen los 15 minutos iniciales hasta dormirte y diferencias entre calcular por despertar o por acostarte."
  },
  "fields": {
    "direction": {
      "label": "Sé a qué hora",
      "options": {
        "wake": "Quiero despertarme",
        "sleep": "Me acuesto en la cama"
      }
    },
    "time": {
      "label": "Hora del reloj",
      "help": "Ejemplo: 7:00 am, 07:00 o 19:00. Es la hora de la alarma o de meterte en la cama."
    },
    "latency": {
      "label": "Minutos para dormirse",
      "help": "Suele rondar 15 minutos. Pon 0 si quieres asumir sueño instantáneo."
    },
    "cycle": {
      "label": "Duración del ciclo (min)",
      "help": "Un ciclo adulto típico dura unos 90 minutos."
    }
  },
  "ui": {
    "emptyText": "Introduce tu hora de despertar o de acostarte para ver los cuatro horarios de ciclo completo.",
    "engine": {
      "vLabel_latency": "Minutos para dormirse",
      "vLabel_cycle": "Duración del ciclo",
      "errEnterTpl": "Introduce {label}.",
      "errWholeTpl": "{label} debe ser un número entero.",
      "errRangeTpl": "{label} debe estar entre {min} y {max}.",
      "errBadClock": "Introduce una hora válida como 7:00 am, 07:00 o 19:00.",
      "heroWake": "Ir a la cama",
      "heroSleep": "Despertar a las",
      "heroInstant": "5 ciclos. Se asume que te duermes al instante al tumbarte.",
      "heroLatencyTpl": "5 ciclos, sumando {latency} minutos para dormirte.",
      "cycleCardTpl": "{n} ciclos",
      "cycleNoteTpl": "{n} × {cycle} min de sueño",
      "insWakeTpl": "Alarma a las {time}. Cada hora de acostarte incluye {latency} min para dormirte y de 3 a 6 ciclos de {cycle} minutos.",
      "insSleepTpl": "En la cama a las {time}. Cada alarma contempla {latency} min para dormirte y de 3 a 6 ciclos de {cycle} minutos.",
      "insInstant": "Estas horas asumen que te duermes al instante. Añade los minutos que sueles tardar para no cortar el último ciclo.",
      "asmCycle": "Duración del ciclo",
      "asmLatency": "Tiempo para dormirse",
      "asmInstant": "ninguno (sueño instantáneo)",
      "minTpl": "{n} minutos",
      "decDateDiff": "Contar los días entre dos fechas",
      "explanationTpl": "Cada ciclo aquí dura {cycle} minutos y los {latency} minutos previos no forman parte del sueño. Los cuatro resultados cubren 6, 5, 4 y 3 ciclos completos."
    }
  },
  "knowledge": {
    "summary": "Calcula horas de ir a la cama o despertar en ciclos completos de 90 minutos incorporando los minutos reales para quedarse dormido.",
    "useCases": [
      "Saber a qué hora acostarte para un despertador de las 7:00 sin groguiness",
      "Calcular la alarma óptima si te metes en la cama ahora mismo",
      "Personalizar la latencia de conciliación (15 min u otro valor real)"
    ],
    "mistakes": [
      "Dejar la latencia en 0 y retrasar todos los ciclos sin querer",
      "Asumir que todo adulto tiene exactamente 90 minutos cada noche",
      "Tratar la calculadora como herramienta de diagnóstico médico"
    ]
  },
  "faqs": [
    {
      "id": "sleep-cycle-calculator-faq-1",
      "question": "¿A qué hora debo acostarme con ciclos de 90 minutos?",
      "answer": "Elige \"Quiero despertarme\", pon tu alarma (ej. 07:00) y deja 15 min para dormirte: 5 ciclos marcan las 23:15 y 6 ciclos las 21:45."
    },
    {
      "id": "sleep-cycle-calculator-faq-2",
      "question": "¿Por qué la lista empieza 15 minutos antes del primer ciclo?",
      "answer": "Porque estar en la cama antes de dormirte no es tiempo de sueño. Sumar esos 15 min evita que la alarma te corte justo en mitad del último ciclo."
    },
    {
      "id": "sleep-cycle-calculator-faq-3",
      "question": "¿Cuántos ciclos caben en una noche?",
      "answer": "Mostramos 6, 5, 4 y 3 ciclos (9 h, 7,5 h, 6 h y 4,5 h de sueño efectivo). Cinco o seis suelen ser una noche completa adulta."
    },
    {
      "id": "sleep-cycle-calculator-faq-4",
      "question": "¿Puedo calcular desde la hora de acostarme en lugar de la alarma?",
      "answer": "Sí. Cambia a \"Me acuesto en la cama\", introduce la hora (ej. 22:30) y verás las mejores horas para poner el despertador."
    },
    {
      "id": "sleep-cycle-calculator-faq-5",
      "question": "¿Dura exactamente 90 minutos en todo el mundo?",
      "answer": "No; 90 minutos es una media orientativa de sueño ligero, profundo y REM. Puedes ajustar entre 60 y 120 minutos."
    },
    {
      "id": "sleep-cycle-calculator-faq-6",
      "question": "¿Qué pasa si dejo en cero los minutos para dormirme?",
      "answer": "Todas las horas se ajustan exactamente a múltiplos del ciclo y aparece un aviso aclarando que asume sueño instantáneo."
    },
    {
      "id": "sleep-cycle-calculator-faq-7",
      "question": "¿Se suben mis horarios o alarmas a algún sitio?",
      "answer": "No. Todo se calcula localmente en tu navegador y funciona incluso sin conexión tras cargar la página."
    },
    {
      "id": "sleep-cycle-calculator-faq-8",
      "question": "¿Por qué 6 ciclos quedan más de 9 horas antes de la alarma?",
      "answer": "Porque 6 × 90 min son 9 horas dormidas más los 15 minutos previos despierto en la cama."
    },
    {
      "id": "sleep-cycle-calculator-faq-9",
      "question": "¿Sirve para diagnosticar trastornos del sueño?",
      "answer": "No. Solo realiza aritmética de ciclos elegidos; si descansas mal de forma persistente consulta a un especialista."
    },
    {
      "id": "sleep-cycle-calculator-faq-10",
      "question": "¿En qué mejora esto respecto a restar 90 minutos mentalmente?",
      "answer": "Incorpora el desfase de conciliación, ofrece cuatro opciones completas en ambos sentidos y ajusta automáticamente saltos de medianoche."
    }
  ]
};
