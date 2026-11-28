import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Zeitzonen-Umrechner",
  "seoTitle": "Zeitzonen Umrechner - Weltzeit & Sommerzeit Online",
  "description": "Rechne Datum und Uhrzeit weltweit zwischen Zeitzonen um inklusive UTC-Zeit, exaktem Abstand und automatischer Sommerzeit im Browser.",
  "tagline": "Zeitzonen exakt umrechnen inklusive Sommer- und Winterzeit.",
  "lead": "Übersetze Termine zwischen Weltstädten anhand der IANA-Datenbank deines Browsers samt UTC-Vergleich, Stundenabstand und Datumswechsel.",
  "craft": {
    "solves": "Bei der Herbst-Zeitumstellung wiederholt sich eine volle Stunde; exakte Offsets für das gewählte Datum verhindern verpasste Meetings."
  },
  "guide": {
    "title": "Uhrzeiten sicher zwischen Zeitzonen umrechnen",
    "description": "Wie Ortszeiten über UTC-Offsets umgerechnet werden, warum Sommerzeitumstellungen Lücken verändern und wie Datumswechsel funktionieren."
  },
  "fields": {
    "datetime": {
      "label": "Datum und Uhrzeit"
    },
    "fromZone": {
      "label": "Von Zeitzone"
    },
    "toZone": {
      "label": "In Zeitzone"
    }
  },
  "ui": {
    "emptyText": "Gib Datum und Uhrzeit ein und wähle Ausgangs- sowie Zielzeitzone.",
    "engine": {
      "vLabel_datetime": "ein Datum und eine Uhrzeit",
      "errBadZone": "Wähle eine gültige Zeitzone aus der Liste.",
      "sameTimePhrase": "entspricht exakt",
      "aheadTpl": "ist {span} voraus gegenüber",
      "behindTpl": "liegt {span} zurück hinter",
      "timeInTpl": "Uhrzeit in {zone}",
      "inZoneTpl": "In {zone}",
      "inUtc": "In UTC",
      "diffLabel": "Zeitunterschied",
      "sameTime": "Zeitgleich",
      "offsetTpl": "Offset in {zone}",
      "fromUtcNote": "Gegenüber UTC an diesem Datum",
      "sameDay": "Beide Zeitzonen befinden sich zu diesem Zeitpunkt am selben Kalendertag.",
      "nextDayTpl": "In {zone} ist bereits der nächste Tag.",
      "prevDayTpl": "In {zone} ist noch der vorherige Tag.",
      "dstMissingTpl": "{time} existierte in {zone} nicht (Sommerzeitsprung); angepasst auf {after}.",
      "dstAmbigTpl": "{time} trat in {zone} wegen Zeitumstellung doppelt auf; erster Zeitpunkt ({offset}) gewählt.",
      "dstReadTpl": "Sommerzeit-Offset exakt für das gewählte Datum {date} berechnet.",
      "msWholeHour": "Abstand beträgt volle Stunden",
      "msCrossDay": "Umrechnung überschreitet Tagesgrenze",
      "decUnix": "Datum in Unix-Timestamp umwandeln",
      "decDateDiff": "Tage zwischen zwei Daten zählen",
      "q1": "Welche Uhrzeit ist das in UTC?",
      "q2": "Wie viele Stunden liegen zwischen den Städten?",
      "explanationTpl": "{srcTime} in {srcZone} ({srcOffset}) entspricht demselben Zeitpunkt wie {dstTime} in {dstZone} ({dstOffset}), also {utcTime} UTC. Der Abstand beträgt {diff} an diesem Tag."
    }
  },
  "knowledge": {
    "summary": "Rechnet Datum und Uhrzeit weltweit mit UTC, exakter Stundendifferenz und automatischer Sommerzeiterkennung um.",
    "useCases": [
      "Internationale Calls trotz unterschiedlicher Sommerzeitdaten präzise planen",
      "Ortszeit bei Ankunft von Langstreckenflügen prüfen",
      "Server-Log-Zeitpunkte zwischen Lokalzeit und UTC abgleichen"
    ],
    "mistakes": [
      "Glauben, zwei Städte hätten das ganze Jahr denselben Zeitabstand",
      "Einen Datumswechsel auf den Vor- oder Folgetag übersehen"
    ]
  },
  "faqs": [
    {
      "id": "timezone-converter-faq-1",
      "question": "Wie rechne ich eine Zeit zwischen zwei Zeitzonen um?",
      "answer": "Wähle Datum, Uhrzeit sowie Ausgangs- und Zielzeitzone. Der Rechner ermittelt die genaue Zielzeit samt UTC-Wert für dieses exakte Datum."
    },
    {
      "id": "timezone-converter-faq-2",
      "question": "Wie wird der Zeitunterschied zwischen zwei Städten angezeigt?",
      "answer": "Sowohl als exakter Offset wie +13:00 oder +5:30 als auch im Klartext passend zum gewählten Kalendertag."
    },
    {
      "id": "timezone-converter-faq-3",
      "question": "Wird die Sommerzeit (DST) automatisch berücksichtigt?",
      "answer": "Ja. Die Offsets stammen direkt aus der IANA-Zeitzonendatenbank für das eingegebene Datum – nicht bloß für heute."
    },
    {
      "id": "timezone-converter-faq-4",
      "question": "Warum zeigt die umgerechnete Zeit einen anderen Tag an?",
      "answer": "Bei großen Längengradabständen springt ein Abendtermin in New York in Tokio bereits in den nächsten Vormittag."
    },
    {
      "id": "timezone-converter-faq-5",
      "question": "Werden meine Flug- oder Meetingzeiten ins Internet übertragen?",
      "answer": "Nein. Alles läuft rein lokal über die Browser-API ohne jede Serveranfrage."
    }
  ]
};
