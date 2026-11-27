import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'word-counter',
  name: '文字数・単語数カウンター',
  seoTitle: '文字数・単語数カウンター – リアルタイム文字カウント',
  description:
    '文字数、単語数、文数、段落数、読書時間を入力と同時に計測。目標文字数の設定や頻出語チェックまでブラウザ内で完結し、送信ゼロで安全です。',
  tagline: '単語数や文字数をリアルタイム計測し、執筆目標の達成度を確認できます。',
  citation: {
    problem:
      '原稿やレポートの文字数・単語数制限を外部サーバーへ送信せずにその場で正確に確認したいときに使えます。',
    nonGoal: '文章の自動リライトや校正を行ったり、テキストをAIモデルへ送信したりすること。',
  },
  knowledge: {
    primaryConcepts: ['文字数カウント', '単語数カウント'],
    realWorldUseCases: [
      'レポート・エントリーシート・論文の指定文字数や語数を確認する',
      'ブログ記事やWebライティングの目標ボリュームを管理する',
      '英語文書や翻訳案件の単語数ベースで見積もりを算出する',
      'SNS投稿やメタディスクリプションの文字数上限内に収める',
    ],
    commonMistakes: [
      'ハイフン付きの語や句読点の扱いがソフトごとに異なる点を見落とすこと',
      '注釈や参考文献が指定文字数に含まれるかの規定を確認し忘れること',
    ],
  },
  faqs: [
    {
      id: 'wc-faq-1',
      question: '単語数・文字数カウンターはどのように数えていますか？',
      answer:
        '入力されたテキストから空白や改行、記号を解析し、文字数は書記素単位で、単語数はスペース・改行・ハイフン・カンマ（数字以外）を区切りとしてリアルタイムに集計します。URLは1語として扱われます。',
    },
    {
      id: 'wc-faq-2',
      question: 'このツールでは何が1単語としてカウントされますか？',
      answer:
        'スペースや改行などで区切られた文字列が1単語になります（例: "red,green" は2語）。数字（"42"）、ハイフンで結ばれた複合語（"well-known"）、URLは1単語として数えます。日本語の文字数計測には「文字数」表示をご活用ください。',
    },
    {
      id: 'wc-faq-3',
      question: '単語数（ワード数）と文字数の違いは何ですか？',
      answer:
        '単語数は語の数、文字数はすべての文字・句読点・空白を含む総文字数です。"Hello, world!" は2語・13文字になります。英文エッセイは単語数、日本語原稿やSNS・メタタグは文字数が基準になります。',
    },
    {
      id: 'wc-faq-4',
      question: '入力した文章はサーバーに送信されますか？',
      answer:
        'いいえ。集計処理はすべてお使いのブラウザ上のJavaScriptだけで実行され、文章が外部へ送信・保存されることは一切ありません。',
    },
    {
      id: 'wc-faq-5',
      question: '1,000語を読むのにおおよそ何分かかりますか？',
      answer:
        '一般的な成人の黙読速度（毎分200〜250語）を基準にすると、約4〜5分かかります。このツールでは毎分200語を標準値として読了時間を算出しています。',
    },
    {
      id: 'wc-faq-6',
      question: 'X（旧Twitter）やLinkedInの文字数制限はいくつですか？',
      answer:
        'Xの通常投稿は半角280文字（日本語などの全角文字は140文字換算）が上限です。LinkedInの投稿上限は3,000文字、記事形式では125,000文字です。',
    },
    {
      id: 'wc-faq-7',
      question: 'ツールによって単語数のカウントが少し違うのはなぜですか？',
      answer:
        'ハイフン語、ダッシュ、省略記号、アポストロフィなどの境界ルールがWord・Googleドキュメント・Webツール間で少しずつ異なるためです。',
    },
    {
      id: 'wc-faq-8',
      question: '読了時間はどのように計算されていますか？',
      answer:
        '一般文章の平均的な黙読ペースである毎分200語で総単語数を割って算出しています。専門性の高い技術文書では100〜150語/分程度になることもあります。',
    },
    {
      id: 'wc-faq-9',
      question: '見出しやタイトルもカウント対象に含まれますか？',
      answer:
        'はい。テキストエリアに入力されたすべての文字列を集計対象にします。本文だけを測りたい場合は本文のみを貼り付けてください。',
    },
    {
      id: 'wc-faq-10',
      question: '機密文書や社外秘の原稿を貼り付けても安全ですか？',
      answer:
        'はい。単語頻度リストや統計、進捗バーはすべて開いているタブのメモリ内のみで処理され、通信は発生しません。',
    },
    {
      id: 'wc-faq-11',
      question: 'AIモデルのトークン数も測れますか？',
      answer:
        'いいえ。ここで計算するのは人間向けの単語数・文字数・文数・段落数です。LLMのトークン分割とは基準が異なります。',
    },
  ],
  guide: {
    title: '単語数と文字数を正確に数える方法',
    description: '単語カウントの境界ルール、Wordやブラウザ間で数値が変わる理由、読了時間の計算と文字数制限の目安を詳しく解説します。',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: 'テキストを入力または貼り付けて単語数・文字数を計測します。',
    sampleText:
      '素早い茶色のキツネが古い農家の近くでのんびりした犬を飛び越えた。穏やかな風が大きなオークの葉を揺らし、野の花の甘い香りを草原へと運ぶ。午後の日差しに照らされた小道の頭上から鳥のさえずりが聞こえ、苔むした石の間を細い小川が静かに流れていた。',
    statWords: '単語数',
    statCharacters: '文字数',
    statSentences: '文数',
    statParagraphs: '段落数',
    statReadingTime: '読了目安',
    statUniqueWords: '異なり語数',
    btnDownloadReport: 'レポート保存',
    lblGoal: '目標ワード数',
    goalPlaceholder: '例: 500',
    btnClearGoal: '目標をクリア',
    headingTopWords: '頻出語',
    lblHideCommon: '一般的な語を除外',
    btnSortFreq: '頻度順',
    btnSortAlpha: '文字コード順',
    summaryInsights: '語彙の詳細',
    stopWords: 'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me is are was were been has had did',
    goalRemainTpl: '{cur} / {goal} 語 (残り {rem}, {pct}%)',
    goalDoneTpl: '{cur} / {goal} 語 (目標達成)',
    noWordsFound: '単語が見つかりませんでした。',
    insightLongest: '最長の語',
    insightShortest: '最短の語',
    insightRepeated: '重複語数',
    toastEmptyDownload: 'ダウンロードする内容がありません。',
    reportHeading: '単語・文字数カウントレポート',
    reportGoalPrefix: '目標: ',
    reportWordsSuffix: '語',
    reportGeneratedPrefix: '作成日時: ',
    toastDownloaded: 'レポートを保存しました',
  },
};
