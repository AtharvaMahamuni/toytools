import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'unix-timestamp-converter',
  name: 'Conversor de Timestamp Unix',
  seoTitle: 'Conversor Timestamp Unix Online – Epoch a Fecha y Viceversa',
  description:
    'Convierte un timestamp Unix (epoch) a fecha legible o una fecha a timestamp en segundos o milisegundos, con hora UTC, ISO 8601 y hora local.',
  tagline: 'Convierte marcas de tiempo Unix a fecha legible y viceversa en segundos o milisegundos.',
  knowledge: {
    primaryConcepts: ['conversión de timestamp Unix', 'conversor epoch'],
    realWorldUseCases: [
      'Leer un timestamp Unix de un registro, fila de base de datos o respuesta API.',
      'Convertir una fecha concreta en timestamp para una configuración o consulta SQL.',
      'Comprobar si un valor está expresado en segundos o milisegundos antes de usarlo.',
    ],
    commonMistakes: [
      'Leer un timestamp en milisegundos como si fueran segundos, desplazando la fecha miles de años al futuro.',
      'Suponer que un timestamp Unix lleva zona horaria local cuando siempre parte de UTC.',
      'Olvidar que la época Unix comienza el 1 de enero de 1970, por lo que las fechas anteriores son negativas.',
    ],
  },
  faqs: [
    {
      id: 'unix-timestamp-converter-faq-1',
      question: '¿Cómo convierto un timestamp Unix a una fecha?',
      answer:
        'Mantén la dirección en «Timestamp a fecha», pega el número y elige si está en segundos o en milisegundos. El conversor muestra el instante en UTC, formato ISO 8601, tu hora local y el día de la semana. Por ejemplo, 1700000000 segundos equivale al martes 14 de noviembre de 2023 a las 22:13:20 UTC.',
    },
    {
      id: 'unix-timestamp-converter-faq-2',
      question: '¿Cómo convierto una fecha a timestamp Unix?',
      answer:
        'Cambia la dirección a «Fecha a timestamp» e introduce una fecha y hora. Ese instante se interpreta en UTC para que el resultado sea idéntico en todo el mundo y obtienes el valor tanto en segundos como en milisegundos.',
    },
    {
      id: 'unix-timestamp-converter-faq-3',
      question: '¿El timestamp Unix se expresa en segundos o milisegundos?',
      answer:
        'Ambos formatos son habituales. El tiempo Unix clásico cuenta segundos desde 1970 (10 dígitos hoy en día), mientras que JavaScript y muchas APIs modernas cuentan milisegundos (13 dígitos, mil veces mayor). Si al convertir sale un año lejano en el futuro, cambia la unidad a milisegundos.',
    },
    {
      id: 'unix-timestamp-converter-faq-4',
      question: '¿Qué es la época Unix (Unix epoch)?',
      answer:
        'Es el instante de referencia fijado a las 00:00:00 UTC del 1 de enero de 1970. Un timestamp Unix mide el número de segundos o milisegundos transcurridos desde ese momento; las fechas previas a 1970 llevan signo negativo y no dependen de ninguna zona horaria.',
    },
    {
      id: 'unix-timestamp-converter-faq-5',
      question: '¿Se envían mis marcas de tiempo o registros de base de datos a un servidor?',
      answer:
        'No. Todos los cálculos de época y formateo ISO 8601 se ejecutan localmente en tu navegador. Los registros de producción e identificadores permanecen seguros en tu equipo.',
    },
  ],
  guide: {
    title: 'Cómo convertir un timestamp Unix a fecha',
    description:
      'Qué es un timestamp Unix, cómo funciona el epoch de 1970, cómo distinguir segundos de milisegundos y cómo convertir fechas en tu navegador.',
    readMinutes: 4,
  },
  fields: {
    mode: {
      label: 'Dirección',
      options: {
        'to-date': 'Timestamp a fecha',
        'to-timestamp': 'Fecha a timestamp',
      },
    },
    timestamp: {
      label: 'Timestamp Unix',
      help: 'Introduce un número entero positivo o negativo.',
    },
    unit: {
      label: 'Unidad del timestamp',
      options: {
        seconds: 'Segundos (10 dígitos hoy)',
        milliseconds: 'Milisegundos (13 dígitos hoy)',
      },
    },
    datetime: {
      label: 'Fecha y hora (UTC)',
      help: 'Se interpreta como hora UTC.',
    },
  },
  ui: {
    emptyText: 'Introduce un timestamp Unix o una fecha para convertir.',
    resultNote: 'Conversión instantánea en tu dispositivo.',
    engine: {
      errEnterTs: 'Introduce un timestamp Unix para convertirlo a fecha.',
      errNotNumber: 'El timestamp debe ser un número válido.',
      errOutOfRange: 'Ese timestamp queda fuera del rango compatible.',
      heroUtc: 'Hora UTC',
      labelLocal: 'Tu hora local',
      labelWeekday: 'Día de la semana',
      labelMillis: 'En milisegundos',
      rightNow: 'ahora mismo',
      unitSeconds: 'segundos',
      unitMillis: 'milisegundos',
      insightMillis: '13 dígitos parecen milisegundos. En milisegundos corresponde a {iso}. Cambia la unidad del timestamp a Milisegundos.',
      insightUtc: 'En UTC son las {time} del {date}.',
      insightRel: 'Ese instante fue o será {rel}.',
      msAfterEpoch: 'Posterior a la época Unix (1970)',
      ms32Bit: 'Dentro del rango de 32 bits en segundos',
      decTimezone: 'Convertir esta hora a otra zona horaria',
      decDiff: 'Contar los días entre dos fechas',
      nextQsToDate: [
        '¿Qué hora es en otra zona horaria?',
        '¿Cuántos días hay hasta hoy?',
      ],
      explToDate: 'Un timestamp Unix cuenta los segundos desde el 1 de enero de 1970 UTC (época Unix). {val} {unit} equivale a {iso}, es decir {utc} UTC.',
      fieldDatetime: 'una fecha y hora',
      heroUnix: 'Timestamp Unix',
      heroUnixNote: 'Segundos desde el 1 de enero de 1970 UTC',
      labelInterpreted: 'Interpretado como',
      noteUtc: 'La fecha introducida se lee en UTC',
      insightUtcInput: 'La fecha y hora introducidas se interpretan como UTC, por lo que el timestamp es idéntico en cualquier país.',
      decAge: 'Calcular tu edad exacta',
      nextQsToTs: [
        '¿Qué fecha representa un timestamp Unix?',
        '¿Cómo funciona el límite del año 2038 en 32 bits?',
      ],
      explToTs: 'Leído en UTC, {utc} equivale a {sec} segundos desde la época Unix del 1 de enero de 1970, o {ms} milisegundos.',
    },
  },
};
