import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "タイムゾーン・時差変換ツール",
  "seoTitle": "タイムゾーン変換・世界時差とサマータイム自動計算",
  "description": "世界中のタイムゾーン間で日時を即座に変換する無料ツール。指定日のサマータイム（夏時間）自動対応、UTC時刻・時差・日付変更も一目で分かります。",
  "tagline": "サマータイム自動対応で世界中の時差を正確に変換。",
  "lead": "ブラウザ内蔵のIANAタイムゾーン情報を参照し、指定した日付固有のサマータイムを考慮した世界各都市の現地時間・UTC時刻・時差を一括計算します。",
  "craft": {
    "solves": "秋にサマータイムが終了すると同じ時計時刻が1日に2回現れますが、指定日の正確なUTCオフセット基準により取り違えを防ぎます。"
  },
  "guide": {
    "title": "世界のタイムゾーン変換・時差とサマータイムの仕組み",
    "description": "現地時刻がUTCオフセットを介して別都市の時間へ変換される仕組み、サマータイムで時差が変動する理由、日付変更線の見方を解説します。"
  },
  "fields": {
    "datetime": {
      "label": "日時"
    },
    "fromZone": {
      "label": "変換元のタイムゾーン"
    },
    "toZone": {
      "label": "変換先のタイムゾーン"
    }
  },
  "ui": {
    "emptyText": "日時と変換元・変換先のタイムゾーンを選択すると正確な現地時間が表示されます。",
    "engine": {
      "vLabel_datetime": "日時",
      "errBadZone": "一覧から有効なタイムゾーンを選択してください。",
      "sameTimePhrase": "と同じ時刻です（時差なし）：",
      "aheadTpl": "より {span} 進んでいます（対 ",
      "behindTpl": "より {span} 遅れています（対 ",
      "timeInTpl": "{zone} の時刻",
      "inZoneTpl": "{zone}",
      "inUtc": "UTC（協定世界時）",
      "diffLabel": "時差",
      "sameTime": "時差なし",
      "offsetTpl": "{zone} のオフセット",
      "fromUtcNote": "この日付時点のUTC差",
      "sameDay": "この時刻では両地域とも同じカレンダー日付です。",
      "nextDayTpl": "{zone} ではすでに翌日になっています。",
      "prevDayTpl": "{zone} ではまだ前日です。",
      "dstMissingTpl": "{zone} では {time} はサマータイム開始によりスキップされたため {after} として計算しました。",
      "dstAmbigTpl": "{zone} では {time} がサマータイム終了により2回存在するため最初の時刻（{offset}）で計算しました。",
      "dstReadTpl": "現在の季節ではなく指定日 {date} 時点の夏時間ルールを適用しています。",
      "msWholeHour": "時差がちょうど1時間単位です",
      "msCrossDay": "日付が前日または翌日にまたがります",
      "decUnix": "この日時をUnixタイムスタンプへ変換",
      "decDateDiff": "2つの日付間の日数を数える",
      "q1": "UTC（世界標準時）では何時になりますか？",
      "q2": "2都市間は何時間の時差がありますか？",
      "explanationTpl": "{srcZone}（{srcOffset}）の {srcTime} は、{dstZone}（{dstOffset}）の {dstTime} と同じ瞬間であり、UTCでは {utcTime} です。この日の時差は {diff} です。"
    }
  },
  "knowledge": {
    "summary": "指定日付のサマータイムを含めて世界中のIANAタイムゾーン間で日時を変換し、UTCや日付跨ぎも同時に表示します。",
    "useCases": [
      "夏時間切り替え時期を含む海外とのWeb会議スケジュール調整",
      "国際線フライトの出発・到着現地時間の正確な確認",
      "サーバーのUTCログ時刻を日本時間（JST）などに換算"
    ],
    "mistakes": [
      "2都市間の時差が年中ずっと固定だと決めつけること",
      "時刻だけでなく「前日」「翌日」の日付ズレを見落とすこと"
    ]
  },
  "faqs": [
    {
      "id": "timezone-converter-faq-1",
      "question": "2つのタイムゾーン間で時間を変換するには？",
      "answer": "日時を入力して「変換元」と「変換先」を選ぶだけで、指定日に合わせた変換後時刻・UTC時刻・時差が即座に表示されます。"
    },
    {
      "id": "timezone-converter-faq-2",
      "question": "2都市間の時差はどのように表示されますか？",
      "answer": "+13:00 のような数値差と文章の両方で、入力した日付時点の正確な時間差を提示します。"
    },
    {
      "id": "timezone-converter-faq-3",
      "question": "サマータイム（夏時間・DST）には対応していますか？",
      "answer": "はい。ブラウザのIANAタイムゾーンデータベースを使い、入力日そのものが夏時間か標準時間かを自動判定します。"
    },
    {
      "id": "timezone-converter-faq-4",
      "question": "変換後の時刻が別の日に表示されることがあるのはなぜ？",
      "answer": "アメリカと日本のように大きく離れたタイムゾーンでは、夜間の時刻が相手側では翌朝や前夜になるためです。"
    },
    {
      "id": "timezone-converter-faq-5",
      "question": "入力した会議やフライト予定が外部に送信されますか？",
      "answer": "いいえ。タイムゾーン変換はすべてブラウザ内ローカルAPIのみで完結し、予定が外部へ送信されることはありません。"
    }
  ]
};
