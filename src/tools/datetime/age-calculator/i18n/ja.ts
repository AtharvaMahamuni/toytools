import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'age-calculator',
  name: '年齢計算ツール',
  seoTitle: '年齢計算ツール（生年月日から歳・月・日数を算出）',
  description:
    '生年月日から現在の正確な満年齢（年・か月・日）、生まれてからの総日数・総月数、次の誕生日までのカウントダウンをブラウザ内で即算出します。',
  tagline: '生年月日から正確な年齢（歳・月・日）と誕生日カウントダウンを計算。',
  craft: {
    solves:
      '2月29日生まれの場合、平年における法的年齢の到達日が国や規定（2月28日か3月1日か）によって異なる点に配慮します。',
  },
  knowledge: {
    primaryConcepts: ['年齢計算', '生年月日', '満年齢'],
    realWorldUseCases: [
      '履歴書や公的書類向けに正確な満年齢と月数を確認する',
      '記念日向けに生後何日目・何週間目かを調べる',
      '過去や未来の特定時点における年齢を算出する',
    ],
    commonMistakes: [
      '誕生日前の時期を考慮せず「今年−生まれ年」だけで計算して1歳ずれる',
      '実際のカレンダー日数ではなく一律1か月30日として概算する',
      'うるう年を考慮せず単純に365.25日で割ってしまう',
    ],
  },
  fields: {
    birthDate: { label: '生年月日' },
    asOf: { label: '基準日', help: '空欄の場合は今日の日付で計算します。' },
  },
  faqs: [
    {
      id: 'age-calculator-faq-1',
      question: '正確な満年齢はどのように計算されますか？',
      answer:
        '生年月日から基準日を超えない最大の年数・月数を数え、残りの端数日数を実カレンダーの各月の日数とうるう年に沿って正確に算出します。',
    },
    {
      id: 'age-calculator-faq-2',
      question: '過去や未来の特定日での年齢も調べられますか？',
      answer:
        'はい。「基準日」欄に任意の過去または未来の日付を入力すると、その日時点での正確な年齢が表示されます。空欄なら今日になります。',
    },
    {
      id: 'age-calculator-faq-3',
      question: '2月29日生まれの場合はどう扱われますか？',
      answer:
        '平年では一般的な慣例として2月28日を誕生日の目安として計算し、次の誕生日カウントダウンも同様に動作します。',
    },
    {
      id: 'age-calculator-faq-4',
      question: '「現在の年 − 生まれた年」だけでは不正確な理由は？',
      answer:
        '今年の誕生日を迎える前の期間では、単純な引き算だと実際の満年齢より1歳多く算出されてしまうためです。',
    },
  ],
  guide: {
    title: '正確な満年齢の計算方法とうるう年・日数の数え方',
    description:
      '各月の日数差とうるう年の扱い、2月29日生まれの考え方、総生存日数の算出ルールまでブラウザ計算の仕組みを詳しく解説します。',
    readMinutes: 4,
  },
  ui: {
    emptyText: '生年月日を入力すると正確な年齢を計算します。',
    engine: {
      fieldBirthDate: '生年月日',
      fieldAsOf: '基準日',
      errBirthAfterRef: '生年月日は基準日より前の日付を指定してください。',
      heroLabel: '正確な年齢',
      units: {
        year: ['歳', '歳'],
        month: ['か月', 'か月'],
        day: ['日', '日'],
      },
      months: [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月',
      ],
      weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      dateTpl: '{y}年{m}{d}日',
      cardMonths: '通算月数',
      cardWeeks: '通算週数',
      cardDays: '生後通算日数',
      cardNextBday: '次の誕生日',
      today: '今日！',
      inDaysTpl: 'あと {days}',
      insightBornTpl: '生まれた曜日は{weekday}です。',
      insightHappyBday: '基準日はお誕生日当日です！',
      insightNextBdayTpl: '次の誕生日は {date}（あと {days}）です。',
      ms18: '成人（18歳以上）',
      msWithinMonth: 'もうすぐ誕生日（30日以内）',
      decDateDiff: '任意の2つの日付の日数差を計算する',
      decUnix: '生年月日をUnixタイムスタンプに変換する',
      nextQuestions: [
        '2つの日付の間にある営業日（平日）は何日？',
        '将来の特定の日に何歳になっている？',
        'この日付のUnixエポック秒数はいくつ？',
      ],
      explanationTpl: '{birth} から {ref} までの実カレンダー経過日数はちょうど {totalDays} 日です。',
    },
  },
};
