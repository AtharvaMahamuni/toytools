import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'unix-timestamp-converter',
  name: 'Unixタイムスタンプ変換ツール',
  seoTitle: 'Unixタイムスタンプ変換 – Epoch秒・ミリ秒を日時へ相互変換',
  description:
    'Unixタイムスタンプ（エポック秒・ミリ秒）を読みやすい日時へ、または日時をUnixタイムスタンプへ双方向変換。UTC・ISO 8601・ローカル時刻を同時表示。',
  tagline: 'Unix時間（秒/ミリ秒）と人間が読める日時をブラウザ内で双方向変換します。',
  knowledge: {
    primaryConcepts: ['unixタイムスタンプ変換', 'epoch時間変換', 'unix時間'],
    realWorldUseCases: [
      'サーバーログやDB行、APIレスポンス内のUnix時間から正確な発生日時を読み取る',
      'SQLクエリや設定ファイル向けに特定の日時からUnixタイムスタンプを生成する',
      '数値が秒（10桁）とミリ秒（13桁）のどちらで表されているか即座に判別する',
    ],
    commonMistakes: [
      '13桁のミリ秒タイムスタンプを秒のまま読み取り西暦50000年以降の未来と誤解すること',
      'Unixタイムスタンプ自体にローカルタイムゾーン情報が含まれると思い込むこと',
      '1970年1月1日以前の日付が負の数値になる点を見落とすこと',
    ],
  },
  faqs: [
    {
      id: 'unix-timestamp-converter-faq-1',
      question: 'Unixタイムスタンプを日時に変換するには？',
      answer:
        '変換方向を「タイムスタンプ → 日時」にしたまま数値を貼り付け、単位（秒またはミリ秒）を選びます。UTC時刻、ISO 8601形式、お使いの端末のローカル時刻、曜日が即座に表示されます。例: 1700000000秒は 2023年11月14日 22:13:20 UTC です。',
    },
    {
      id: 'unix-timestamp-converter-faq-2',
      question: '日時からUnixタイムスタンプへ変換するには？',
      answer:
        '変換方向を「日時 → タイムスタンプ」に切り替え、日付と時刻を入力します。地域差のないようUTC時刻として解釈され、秒単位とミリ秒単位の両方の値が出力されます。',
    },
    {
      id: 'unix-timestamp-converter-faq-3',
      question: 'Unix時間は「秒」と「ミリ秒」のどちらですか？',
      answer:
        'どちらも広く使われます。従来のUnixやPostgreSQL/Linuxログは秒単位（現在10桁）が多く、JavaScriptの Date.now() や近年のWeb APIはミリ秒単位（現在13桁）をよく使います。秒で極端に遠い未来が出たらミリ秒へ切り替えてください。',
    },
    {
      id: 'unix-timestamp-converter-faq-4',
      question: 'Unixエポック（Unix Epoch）とは何ですか？',
      answer:
        '世界協定時（UTC）1970年1月1日 00:00:00 を基準点「0」と定めた時刻の起点です。Unixタイムスタンプはこの起点からの経過秒数（またはミリ秒数）で、1970年より前はマイナスの値で表されます。',
    },
    {
      id: 'unix-timestamp-converter-faq-5',
      question: '入力したログやタイムスタンプは外部に送信されますか？',
      answer:
        'いいえ。変換とISO 8601フォーマット処理はすべてブラウザ内で完結します。本番ログやデータベース値が外部へ送信されることはありません。',
    },
  ],
  guide: {
    title: 'Unixタイムスタンプ（Epoch）の変換方法と仕組み',
    description: 'Unixエポックの定義、10桁（秒）と13桁（ミリ秒）の見分け方、UTCとローカル時刻の扱いを解説。',
    readMinutes: 4,
  },
  fields: {
    mode: {
      label: '変換方向',
      options: {
        'to-date': 'タイムスタンプ → 日時',
        'to-timestamp': '日時 → タイムスタンプ',
      },
    },
    timestamp: {
      label: 'Unixタイムスタンプ',
      help: '正または負の整数を入力してください。',
    },
    unit: {
      label: 'タイムスタンプの単位',
      options: {
        seconds: '秒（現在10桁）',
        milliseconds: 'ミリ秒（現在13桁）',
      },
    },
    datetime: {
      label: '日時 (UTC基準)',
      help: '協定世界時 (UTC) として解釈されます。',
    },
  },
  ui: {
    emptyText: '変換したいUnixタイムスタンプまたは日時を入力してください。',
    resultNote: 'ブラウザ内で即座に変換されました。',
    engine: {
      errEnterTs: '日時に変換するUnixタイムスタンプを入力してください。',
      errNotNumber: 'タイムスタンプは有効な数値で入力してください。',
      errOutOfRange: 'サポートされている範囲外のタイムスタンプです。',
      heroUtc: 'UTC時刻',
      labelLocal: 'ローカル時刻',
      labelWeekday: '曜日',
      labelMillis: 'ミリ秒表記',
      rightNow: 'たった今',
      unitSeconds: '秒',
      unitMillis: 'ミリ秒',
      insightMillis: '13桁の数値はミリ秒の可能性があります。ミリ秒として扱うと {iso} になります。単位を「ミリ秒」に切り替えてみてください。',
      insightUtc: 'UTC基準では {date} の {time} です。',
      insightRel: '現在との時間差は {rel} です。',
      msAfterEpoch: 'Unixエポック（1970年）以降',
      ms32Bit: '32ビット符号付き整数（秒）の範囲内',
      decTimezone: '別のタイムゾーンに変換する',
      decDiff: '2つの日付の差を数える',
      nextQsToDate: [
        '他のタイムゾーンでは何時になりますか？',
        '今日まで何日経過していますか？',
      ],
      explToDate: 'Unixタイムスタンプは1970年1月1日 00:00:00 UTC（Unixエポック）からの経過時間です。{val} {unit} は {iso}、つまり {utc} UTC に相当します。',
      fieldDatetime: '日時',
      heroUnix: 'Unixタイムスタンプ',
      heroUnixNote: '1970年1月1日 UTC からの経過秒数',
      labelInterpreted: '解釈されたUTC日時',
      noteUtc: '入力日時はUTCとして解釈されます',
      insightUtcInput: '入力された日時は世界標準のUTCとして計算されるため、どの地域から実行しても同一のタイムスタンプが得られます。',
      decAge: '生年月日から正確な年齢を計算する',
      nextQsToTs: [
        'Unixタイムスタンプを日時に戻すには？',
        '2038年問題（32ビット上限）とは何ですか？',
      ],
      explToTs: 'UTC基準で {utc} は、1970年1月1日のエポックから {sec} 秒（または {ms} ミリ秒）です。',
    },
  },
};
