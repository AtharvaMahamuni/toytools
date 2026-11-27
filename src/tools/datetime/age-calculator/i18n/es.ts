import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'age-calculator',
  name: 'Calculadora de Edad',
  seoTitle: 'Calculadora de Edad Exacta en Años, Meses y Días',
  description:
    'Calcula tu edad exacta en años, meses y días desde tu fecha de nacimiento, además de días totales y cuenta atrás al próximo cumpleaños.',
  tagline: 'Tu edad exacta en años, meses y días con cuenta atrás.',
  craft: {
    solves:
      'Quien nace el 29 de febrero cambia de edad legal entre el 28 de febrero y el 1 de marzo según la convención de cada país.',
  },
  knowledge: {
    primaryConcepts: ['cálculo de edad', 'fecha de nacimiento', 'edad cronológica'],
    realWorldUseCases: [
      'Confirmar la edad exacta para trámites, requisitos o formularios',
      'Saber cuántos días ha vivido una persona para celebrar un hito',
      'Medir la edad exacta en una fecha pasada o futura',
    ],
    commonMistakes: [
      'Restar solo el año actual menos el año de nacimiento sin mirar mes y día',
      'Asumir meses fijos de 30 días en lugar de usar el calendario real',
      'Dividir días entre 365,25 en vez de respetar años bisiestos reales',
    ],
  },
  fields: {
    birthDate: { label: 'Fecha de nacimiento' },
    asOf: { label: 'Edad a fecha de', help: 'Déjalo vacío para calcular respecto a hoy.' },
  },
  faqs: [
    {
      id: 'age-calculator-faq-1',
      question: '¿Cómo se calcula mi edad exacta?',
      answer:
        'Cuenta los años y meses completos desde tu nacimiento sin superar la fecha de referencia y luego suma los días restantes respetando la duración real de cada mes y los años bisiestos.',
    },
    {
      id: 'age-calculator-faq-2',
      question: '¿Puedo calcular mi edad en una fecha pasada o futura?',
      answer:
        'Sí. Introduce cualquier fecha en el campo "Edad a fecha de" para saber cuántos años tenías o tendrás ese día, o déjalo vacío para usar hoy.',
    },
    {
      id: 'age-calculator-faq-3',
      question: '¿Cómo maneja la calculadora un cumpleaños del 29 de febrero?',
      answer:
        'En los años no bisiestos la convención civil sitúa el cumpleaños el 28 de febrero, tanto en la edad calculada como en la cuenta atrás.',
    },
    {
      id: 'age-calculator-faq-4',
      question: '¿Por qué la edad no es simplemente año actual menos año de nacimiento?',
      answer:
        'Porque esa resta solo acierta cuando ya pasó tu cumpleaños del año en curso; antes de esa fecha falla por un año entero.',
    },
  ],
  guide: {
    title: 'Cómo calcular tu edad exacta en años, meses y días',
    description:
      'Por qué influyen los meses reales y los años bisiestos, cómo contar cumpleaños del 29 de febrero y totales en días.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Selecciona una fecha de nacimiento para calcular la edad.',
    engine: {
      fieldBirthDate: 'Fecha de nacimiento',
      fieldAsOf: 'Fecha de referencia',
      errBirthAfterRef: 'La fecha de nacimiento no puede ser posterior a la fecha de referencia.',
      heroLabel: 'Edad exacta',
      units: {
        year: ['año', 'años'],
        month: ['mes', 'meses'],
        day: ['día', 'días'],
      },
      months: [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      ],
      weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dateTpl: '{d} de {m} de {y}',
      cardMonths: 'Meses completos',
      cardWeeks: 'Semanas totales',
      cardDays: 'Días totales vividos',
      cardNextBday: 'Próximo cumpleaños',
      today: '¡Hoy!',
      inDaysTpl: 'en {days}',
      insightBornTpl: 'Naciste en {weekday}.',
      insightHappyBday: '¡Feliz cumpleaños en la fecha de referencia!',
      insightNextBdayTpl: 'Tu próximo cumpleaños será el {date} (faltan {days}).',
      ms18: 'Mayoría de edad (18+)',
      msWithinMonth: 'Cumpleaños próximo (menos de 30 días)',
      decDateDiff: 'Contar días exactos entre dos fechas distintas',
      decUnix: 'Convertir fechas a marcas Unix Epoch',
      nextQuestions: [
        '¿Cuántos días laborables hay entre dos fechas concretas?',
        '¿Qué edad exacta tendré en una fecha futura determinada?',
        '¿Qué timestamp Unix corresponde a mi fecha de nacimiento?',
      ],
      explanationTpl: 'Entre el {birth} y el {ref} han transcurrido exactamente {totalDays} días de calendario real.',
    },
  },
};
