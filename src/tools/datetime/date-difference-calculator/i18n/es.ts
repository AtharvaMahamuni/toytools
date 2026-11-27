import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'date-difference-calculator',
  name: 'Calculadora de Diferencia de Fechas',
  seoTitle: 'Calculadora de Días entre Dos Fechas Online',
  description:
    'Cuenta la duración exacta entre dos fechas en años, meses y días, total de semanas y días laborables de lunes a viernes directamente en tu navegador.',
  tagline: 'Tiempo exacto entre dos fechas, incluidos días laborables.',
  craft: {
    solves:
      'Confundir duración del calendario con días laborables inclusivos suele provocar reservas de viaje o plazos de entrega erróneos por un día.',
  },
  knowledge: {
    primaryConcepts: ['diferencia entre fechas', 'días entre dos fechas', 'duración entre fechas'],
    realWorldUseCases: [
      'Contar cuántos días quedan hasta una entrega o evento',
      'Medir la duración de un proyecto en semanas y días laborables',
      'Calcular cuánto tiempo exacto pasó desde una fecha anterior',
    ],
    commonMistakes: [
      'Aproximar cada mes como 30 días en vez de contar meses reales del calendario',
      'Contar días naturales cuando una tarea requiere solo días laborables',
      'Pensar que invertir la fecha inicial y la final altera la longitud del intervalo',
    ],
  },
  fields: {
    startDate: { label: 'Fecha de inicio' },
    endDate: { label: 'Fecha de fin' },
  },
  faqs: [
    {
      id: 'date-difference-calculator-faq-1',
      question: '¿Cuántos días hay entre dos fechas?',
      answer:
        'Introduce fecha de inicio y fin para ver el número exacto de días naturales, semanas y el desglose en años, meses y días respetando cada mes real y los años bisiestos.',
    },
    {
      id: 'date-difference-calculator-faq-2',
      question: '¿Cuántos días laborables hay entre dos fechas?',
      answer:
        'El cálculo cuenta los días de lunes a viernes comprendidos en el intervalo excluyendo sábados y domingos. No descuenta festivos porque cambian en cada país.',
    },
    {
      id: 'date-difference-calculator-faq-3',
      question: '¿Cuántas semanas y meses equivale ese plazo?',
      answer:
        'Se muestran las semanas completas de 7 días y el equivalente calendario en años, meses y días siguiendo la longitud exacta de cada mes.',
    },
    {
      id: 'date-difference-calculator-faq-4',
      question: '¿Importa el orden en que introduzco las fechas?',
      answer:
        'No. La calculadora mide la amplitud absoluta entre ambas fechas aunque pongas primero la fecha posterior, avisando si el rango está invertido.',
    },
  ],
  guide: {
    title: 'Cómo contar los días y semanas entre dos fechas',
    description:
      'Cómo funciona el desglose en meses y días reales, semanas completas y diferencia con días laborables.',
    readMinutes: 4,
  },
  ui: {
    emptyText: 'Selecciona fecha de inicio y de fin para calcular la diferencia.',
    engine: {
      fieldStartDate: 'Fecha de inicio',
      fieldEndDate: 'Fecha de fin',
      heroLabel: 'Duración entre fechas',
      listSep: ', ',
      units: {
        year: ['año', 'años'],
        month: ['mes', 'meses'],
        day: ['día', 'días'],
        week: ['semana', 'semanas'],
        'business day': ['día laborable', 'días laborables'],
      },
      months: [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      ],
      weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dateTpl: '{d} de {m} de {y}',
      totalDaysNoteTpl: '{n} en total',
      cardTotalDays: 'Días totales',
      cardTotalWeeks: 'Semanas completas',
      cardTotalMonths: 'Meses completos',
      cardWeekdays: 'Días laborables (L–V)',
      weekendNoteTpl: '{n} días de fin de semana',
      insightDowTpl: 'La fecha inicial es {start} y la final es {end}.',
      insightSameDay: 'Ambas fechas coinciden en el mismo día.',
      insightWeeksDaysTpl: 'Equivale a {weeks} y {days}.',
      insightReversed: 'La fecha final es anterior a la inicial; se muestra la duración positiva.',
      insightBusinessTpl: 'Excluyendo fines de semana, son {days}.',
      msWeek: 'Al menos 1 semana completa',
      msYear: 'Al menos 1 año completo',
      decAge: 'Calcular edad exacta desde nacimiento',
      decUnix: 'Convertir fechas a Unix Timestamp',
      nextQuestions: [
        '¿Qué días son festivos nacionales dentro de este rango?',
        '¿Cuántas horas o segundos supone este plazo?',
        '¿Cuál es la edad exacta respecto a una de estas fechas?',
      ],
      explanationTpl: 'Entre el {from} y el {to} hay {phrase} ({totalDays} días en total).',
    },
  },
};
