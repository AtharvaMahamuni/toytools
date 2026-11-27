import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'date-difference-calculator',
  name: '日数差計算ツール',
  seoTitle: '2つの日付の日数・期間・営業日計算ツール',
  description:
    '開始日と終了日の間が何年・何か月・何日あるか、総日数・週数・平日（月〜金）の営業日数をブラウザ内で正確に算出します。',
  tagline: '2つの日付の正確な期間と平日数を即計算。',
  craft: {
    solves:
      '暦日ベースの差と両端を含む営業日数の混同により、航空券予約やプロジェクト納期が1日ずれるミスを防ぎます。',
  },
  knowledge: {
    primaryConcepts: ['日付の差', '日数カウント', '期間計算'],
    realWorldUseCases: [
      '締め切りやイベント開催日までの残り日数を調べる',
      'プロジェクト期間を週数と平日数で見積もる',
      '過去の日付から現在までの正確な経過期間を出す',
    ],
    commonMistakes: [
      '実カレンダーの月日数を使わず一律1か月30日とみなす',
      '土日を除いた稼働日数が必要なのに暦日で数えてしまう',
      '開始日と終了日を逆に入力すると結果の期間長が変わると思い込む',
    ],
  },
  fields: {
    startDate: { label: '開始日' },
    endDate: { label: '終了日' },
  },
  faqs: [
    {
      id: 'date-difference-calculator-faq-1',
      question: '2つの日付の間の日数はどうやって計算されますか？',
      answer:
        '各月の実日数とうるう年を考慮して総日数・週数・年月日の内訳を正確に計算します。',
    },
    {
      id: 'date-difference-calculator-faq-2',
      question: '平日（営業日）は何日含まれますか？',
      answer:
        '範囲内の月曜日から金曜日までの日数を土日を除いて算出します（祝日は国・地域で異なるため除外していません）。',
    },
    {
      id: 'date-difference-calculator-faq-3',
      question: '週数と月数の内訳はどう決まりますか？',
      answer:
        '総週数は完全な7日間単位、年月日の表示は開始日を起点に実際のカレンダー月に沿って数えます。',
    },
    {
      id: 'date-difference-calculator-faq-4',
      question: '開始日と終了日の順番は影響しますか？',
      answer:
        'いいえ。前後が逆でも同じ絶対期間を計算し、逆順になっている旨を分かりやすく表示します。',
    },
  ],
  guide: {
    title: '2つの日付の日数差と平日・営業日の正確な数え方',
    description:
      '実カレンダーの月数換算、満週数カウント、暦日数と月〜金の平日（営業日）の違いまで計算ルールを分かりやすく解説します。',
    readMinutes: 4,
  },
  ui: {
    emptyText: '開始日と終了日を選ぶと期間を計算します。',
    engine: {
      fieldStartDate: '開始日',
      fieldEndDate: '終了日',
      heroLabel: '日付間の期間',
      listSep: '・',
      units: {
        year: ['年', '年'],
        month: ['か月', 'か月'],
        day: ['日', '日'],
        week: ['週間', '週間'],
        'business day': ['平日', '平日'],
      },
      months: [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月',
      ],
      weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      dateTpl: '{y}年{m}{d}日',
      totalDaysNoteTpl: '合計 {n}',
      cardTotalDays: '合計日数',
      cardTotalWeeks: '満週数',
      cardTotalMonths: '満月数',
      cardWeekdays: '平日（月〜金）',
      weekendNoteTpl: '土日 {n} 日',
      insightDowTpl: '開始日は{start}、終了日は{end}です。',
      insightSameDay: '開始日と終了日が同じ日付です。',
      insightWeeksDaysTpl: '換算すると {weeks} と {days} です。',
      insightReversed: '終了日が開始日より前のため、正の期間として表示しています。',
      insightBusinessTpl: '週末を除くと {days} です。',
      msWeek: '1週間以上',
      msYear: '1年以上',
      decAge: '生年月日から正確な年齢を計算する',
      decUnix: '日付をUnixタイムスタンプに変換する',
      nextQuestions: [
        'この期間中に含まれる日本の祝日は何日？',
        'この期間を時間や秒数に換算すると？',
        '誕生日から今日までの正確な年齢は？',
      ],
      explanationTpl: '{from} から {to} までの期間は {phrase}（合計 {totalDays} 日）です。',
    },
  },
};
