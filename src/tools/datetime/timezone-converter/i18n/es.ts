import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de zonas horarias",
  "seoTitle": "Conversor de Zonas Horarias - Cambio de Horario e IANA",
  "description": "Convierte cualquier fecha y hora entre zonas horarias del mundo con UTC, diferencia exacta y horario de verano automático en tu navegador.",
  "tagline": "Convierte hora entre zonas horarias con horario de verano incluido.",
  "lead": "Traduce una fecha y hora entre ciudades del mundo con la base IANA de tu navegador, mostrando hora UTC, diferencia exacta y cambios de día.",
  "craft": {
    "solves": "Durante el cambio de hora de otoño una hora local se repite dos veces; los desplazamientos precisos desambiguan el instante exacto sin errores."
  },
  "guide": {
    "title": "Cómo convertir horas entre zonas horarias",
    "description": "Cómo pasa la hora local de una ciudad a otra mediante desplazamientos UTC y horario de verano automático."
  },
  "fields": {
    "datetime": {
      "label": "Fecha y hora"
    },
    "fromZone": {
      "label": "Zona de origen"
    },
    "toZone": {
      "label": "Zona de destino"
    }
  },
  "ui": {
    "emptyText": "Introduce una fecha y hora y elige dos zonas horarias para convertir entre ellas.",
    "engine": {
      "vLabel_datetime": "una fecha y hora",
      "errBadZone": "Elige una zona horaria válida de la lista.",
      "sameTimePhrase": "es la misma hora que",
      "aheadTpl": "va {span} por delante de",
      "behindTpl": "va {span} por detrás de",
      "timeInTpl": "Hora en {zone}",
      "inZoneTpl": "En {zone}",
      "inUtc": "En UTC",
      "diffLabel": "Diferencia horaria",
      "sameTime": "Misma hora",
      "offsetTpl": "Desfase en {zone}",
      "fromUtcNote": "Respecto a UTC en esa fecha",
      "sameDay": "Ambas zonas comparten el mismo día del calendario en esa hora.",
      "nextDayTpl": "En {zone} ya es el día siguiente.",
      "prevDayTpl": "En {zone} todavía es el día anterior.",
      "dstMissingTpl": "{time} no existió en {zone} (salto de horario de verano); se ha ajustado a {after}.",
      "dstAmbigTpl": "{time} ocurrió dos veces en {zone} por el cambio de hora; se usa la primera coincidencia ({offset}).",
      "dstReadTpl": "Horario de verano calculado para la fecha exacta {date}, no según la época actual.",
      "msWholeHour": "Las zonas difieren en horas enteras",
      "msCrossDay": "La conversión cambia de día en el calendario",
      "decUnix": "Convertir la fecha a marca temporal Unix",
      "decDateDiff": "Contar los días entre dos fechas",
      "q1": "¿Qué hora es esta en UTC?",
      "q2": "¿Cuántas horas de diferencia hay entre ambas ciudades?",
      "explanationTpl": "Las {srcTime} en {srcZone} ({srcOffset}) corresponden exactamente a las {dstTime} en {dstZone} ({dstOffset}), es decir, las {utcTime} UTC. La diferencia entre ambas zonas ese día es de {diff}."
    }
  },
  "knowledge": {
    "summary": "Convierte fecha y hora entre zonas IANA mundiales con hora UTC, diferencia horaria y detección automática de cambio de verano.",
    "useCases": [
      "Coordinar videollamadas internacionales sin fallos de horario de verano",
      "Calcular horas locales de llegada de vuelos internacionales",
      "Comprobar qué hora UTC equivale a un instante de registro en servidor"
    ],
    "mistakes": [
      "Suponer que dos ciudades mantienen siempre las mismas horas de diferencia todo el año",
      "Pasar por alto que el resultado cae en el día anterior o siguiente"
    ]
  },
  "faqs": [
    {
      "id": "timezone-converter-faq-1",
      "question": "¿Cómo convierto una hora entre dos zonas horarias?",
      "answer": "Introduce fecha y hora, elige zona origen y destino y verás el horario exacto convertido, la hora UTC y el desfase del día."
    },
    {
      "id": "timezone-converter-faq-2",
      "question": "¿Cómo muestra la diferencia horaria entre ciudades?",
      "answer": "Presenta el salto exacto (p. ej. +13:00 o +5:30) calculado específicamente para la fecha introducida."
    },
    {
      "id": "timezone-converter-faq-3",
      "question": "¿Tiene en cuenta el horario de verano (DST)?",
      "answer": "Sí. Lee las reglas IANA de tu navegador para la fecha concreta introducida, adaptando automáticamente verano e invierno."
    },
    {
      "id": "timezone-converter-faq-4",
      "question": "¿Por qué la hora convertida muestra otro día?",
      "answer": "Al cruzar varias zonas horarias o la línea internacional de fecha, una tarde en América ya es la mañana siguiente en Asia."
    },
    {
      "id": "timezone-converter-faq-5",
      "question": "¿Se envían mis horarios de vuelos o reuniones por internet?",
      "answer": "No. Todo el cálculo de zonas IANA ocurre localmente en la memoria de tu navegador."
    }
  ]
};
