import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'lorem-ipsum-generator',
  name: 'Lorem Ipsum生成ツール',
  seoTitle: 'Lorem Ipsum ダミーテキスト生成ツール',
  description:
    'デザインやレイアウト確認用のLorem Ipsumダミーテキストを段落・文・単語単位で即生成。HTMLタグなしのプレーンテキストと文字数・単語数を表示します。',
  tagline: '段落・文・単語単位でダミーテキストを即座に生成。',
  craft: {
    solves:
      'ダミーテキストに意味があるのか疑問に思われがちですが、紀元前のキケロの古典テキストを由来とする背景を明示しています。',
  },
  knowledge: {
    primaryConcepts: ['Lorem ipsum', 'ダミーテキスト'],
    realWorldUseCases: [
      '本番原稿ができる前のデザインカンプを埋める',
      '短文・長文それぞれでのレイアウト崩れを確認する',
      'テーマやテンプレートを自然な文字量でデモ表示する',
      'フォントの視認性・行間・行長を評価する',
    ],
    commonMistakes: [
      'ダミーテキストを消し忘れて本番公開してしまう',
      '実原稿の長さによるレイアウト崩れを見落とす',
      'ラテン語に何かのメッセージが込められていると誤解する',
      'レイアウト枠に対して過剰な量の文字を生成する',
    ],
  },
  fields: {
    unit: {
      label: '単位',
      options: { paragraphs: '段落', sentences: '文', words: '単語' },
    },
    count: { label: '数量' },
    startWithLorem: { label: '「Lorem ipsum」で始める', group: 'オプション' },
  },
  faqs: [
    {
      id: 'lorem-ipsum-generator-faq-1',
      question: 'Lorem Ipsum（ロレム・イプサム）とは何ですか？',
      answer:
        '印刷やWebデザインで本番文章の代わりに入れる標準的なダミーテキストです。意味のある言葉で注意をそらさず、レイアウトや書体を確認するために使われます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-2',
      question: 'この生成ツールの使い方は？',
      answer:
        '単位（段落・文・単語）と数量を選び、必要なら「Lorem ipsumで始める」を切り替えます。表示されたテキストは「コピー」ボタンでそのまま取得できます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-3',
      question: 'Lorem Ipsumの由来は何ですか？',
      answer:
        '紀元前45年に古代ローマの哲学者キケロが著した『善と悪の究極について』の一節を改変したもので、活版印刷の時代から長く見本組版に使われてきました。',
    },
    {
      id: 'lorem-ipsum-generator-faq-4',
      question: 'なぜダミーテキストを使うのですか？',
      answer:
        '実際の文章があるとレビュー担当者が文面の内容に気を取られやすいためです。意味を持たない仮文字を使うことで配色・余白・タイポグラフィの検証に集中できます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-5',
      question: 'このラテン語風テキストに意味はありますか？',
      answer:
        '明確な意味はありません。ラテン語由来の単語を切り貼りして並び替えてあるため、翻訳しても文としては成立しません。',
    },
    {
      id: 'lorem-ipsum-generator-faq-6',
      question: '段落ではなく単語数や文数で指定できますか？',
      answer:
        'はい。単位を「単語」や「文」に切り替えれば、見出しやカードUIなどに合わせた長さのテキストを生成できます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-7',
      question: '「Lorem ipsumで始める」オプションの役割は？',
      answer:
        'オンにするとお馴染みの「Lorem ipsum dolor sit amet」で始まり、オフにすると先頭から完全にランダムな語彙で構成されます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-8',
      question: 'オフラインでも動作しますか？',
      answer:
        'はい。ページ読み込み後はブラウザ内のローカルJavaScriptのみで動くため、ネット接続なしで使えます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-9',
      question: '一度にどれくらいの量を生成できますか？',
      answer:
        '1回あたり最大100単位（100段落・100文・100単語）まで一括生成できます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-10',
      question: '出力はプレーンテキストですか？',
      answer:
        'はい。HTMLタグや装飾を含まない純粋なテキストで、段落間は空行で区切られます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-11',
      question: 'ワンクリックでコピーできますか？',
      answer:
        'はい。「コピー」を押すだけで生成された全テキストをクリップボードへコピーできます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-12',
      question: '毎回同じテキストが出ますか？',
      answer:
        'いいえ。「再生成」を押すたびに単語や文の長さがランダムに変化します。',
    },
    {
      id: 'lorem-ipsum-generator-faq-13',
      question: 'Lorem Ipsumを使わない方がよい場面は？',
      answer:
        'ボタンや見出しの文字数によってレイアウトが大きく変わる場合は実原稿に近い仮文言が適しています。また公開前の本番置き換えを忘れないでください。',
    },
    {
      id: 'lorem-ipsum-generator-faq-14',
      question: '通常のランダム単語との違いは何ですか？',
      answer:
        '日本語や英語のランダム単語は読めてしまうため違和感が目立ちます。ラテン語調のLorem Ipsumは視界に自然になじみやすいのが利点です。',
    },
    {
      id: 'lorem-ipsum-generator-faq-15',
      question: '商用プロジェクトでも使えますか？',
      answer:
        'はい。著作権の制限はなく、クライアント提案やテンプレートデモに自由にお使いいただけます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-16',
      question: 'なぜダミーテキストを控えるべきという意見があるのですか？',
      answer:
        '見栄えのよい仮テキストだと、実際の長文データで起きる折り返し崩れに気付きにくくなるためです。',
    },
    {
      id: 'lorem-ipsum-generator-faq-17',
      question: '1段落だけ生成することもできますか？',
      answer:
        'はい。単位を「段落」、数量を1にするだけで1段落分のテキストが作れます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-18',
      question: '設定は保存されますか？',
      answer:
        '単位や数量のUI設定のみローカルに保持され、生成したテキスト自体は一切保存されません。',
    },
    {
      id: 'lorem-ipsum-generator-faq-19',
      question: 'どのブラウザで使えますか？',
      answer:
        'Chrome、Firefox、Safari、Edgeなどデスクトップ・モバイルのあらゆる最新ブラウザで動作します。',
    },
    {
      id: 'lorem-ipsum-generator-faq-20',
      question: '特定の文字数ぴったりに合わせることはできますか？',
      answer:
        '生成単位は単語・文・段落ですが、画面下部に現在の単語数と文字数がリアルタイム表示されるため簡単に調整できます。',
    },
    {
      id: 'lorem-ipsum-generator-faq-21',
      question: 'フォントや組版のテストに向いていますか？',
      answer:
        'はい。自然な単語長と句読点のリズムがあり、書体・行間・文字詰めの確認に最適です。',
    },
    {
      id: 'lorem-ipsum-generator-faq-22',
      question: 'データは外部にアップロードされますか？',
      answer:
        'いいえ。サーバー通信なしで完全にお使いの端末内のみで生成されます。',
    },
  ],
  guide: {
    title: 'Lorem Ipsumとは？由来とデザインの使い分け',
    description:
      'キケロの原文に遡る歴史、タイポグラフィ検証に選ばれる理由、実テキストへ切り替えるべきタイミングを解説します。',
    readMinutes: 8,
  },
  ui: {
    emptyText: '単位と数量を選んでテキストを生成してください。',
    engine: {
      metaWords: '単語数',
      metaChars: '文字数',
    },
  },
};
