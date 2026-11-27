import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'character-counter',
  name: '文字数カウンター',
  seoTitle: '文字数カウントツール（空白込み・空白なし対応）',
  description:
    'スペース込み・スペースなしの文字数をリアルタイム計測し、SNS投稿やメタディスクリプション、SMSの文字数制限をチェックできます。送信なし・完全ローカル。',
  tagline: '空白あり・空白なしの文字数をリアルタイム計測。',
  citation: {
    problem: 'テキストを外部に送信せずに、SNSやフォーム入力・プロンプトの文字数制限を正確に確認したいときに使えます。',
    nonGoal: 'AIモデルのトークン数を計算したり、入力テキストをAIへ送信したりすること。',
  },
  craft: {
    solves:
      'フォームの上限では空白や改行も1文字として数えられるため、見た目では収まっているつもりでも貼り付け時に超過エラーが起きがちです。',
  },
  knowledge: {
    primaryConcepts: ['文字数カウント'],
    realWorldUseCases: [
      'X（旧Twitter）の投稿文字数制限に収める',
      'SEOのメタタイトル・メタディスクリプションをGoogle表示枠内に調整する',
      'SMSの文字数上限（GSM-7や全角70文字）を確認する',
      'Webフォームやデータベース列の最大文字数を事前チェックする',
    ],
    commonMistakes: [
      'プラットフォーム側が空白を数えるのに空白抜きだけで確認する',
      'すべての絵文字が常に1文字と数えられると誤解する',
    ],
  },
  faqs: [
    {
      id: 'cc-faq-1',
      question: '文字数を数える方法は？',
      answer:
        '上の欄に文章を入力または貼り付けるだけで、スペース込み文字数・スペースなし文字数・単語数・文数・文字種内訳が即座に表示されます。',
    },
    {
      id: 'cc-faq-2',
      question: 'スペース（空白）も1文字として数えられますか？',
      answer:
        'はい。ほとんどのSNSやWebフォーム、メタタグの文字数制限では空白も1文字に数えられます。「空白なし」は純粋な本文量を知りたいときに便利です。',
    },
    {
      id: 'cc-faq-3',
      question: '絵文字は1文字としてカウントされますか？',
      answer:
        'システムや文字コードによって異なります。UTF-16基準のプラットフォームでは一般的な絵文字が2文字分として扱われることが多く、結合絵文字ではさらに増えます。',
    },
    {
      id: 'cc-faq-4',
      question: '入力したテキストはサーバーに送信されますか？',
      answer:
        'いいえ。すべての計測はお使いのブラウザ内のJavaScriptだけで完結し、外部サーバーへの保存や送信は一切行われません。',
    },
    {
      id: 'cc-faq-5',
      question: '「文字数（空白込み）」と「空白なし」の違いは？',
      answer:
        '空白込みは半角・全角スペース、タブ、改行をすべて含む総文字数です。空白なしはそれらすべての空白文字を除外して数えます。',
    },
    {
      id: 'cc-faq-6',
      question: '主要なプラットフォームの文字数上限はいくつですか？',
      answer:
        'X/Twitterは280文字（URLは一律23文字換算、日本語は1文字を2として換算）、メタディスクリプションは概ね160文字前後、Instagramキャプションは2,200文字、LinkedIn投稿は3,000文字が目安です。',
    },
    {
      id: 'cc-faq-7',
      question: '文字数とバイト数の違いは何ですか？',
      answer:
        '文字数は見た目の文字単位、バイト数はデータ容量です。半角英数はUTF-8で1文字1バイトですが、日本語や絵文字は1文字あたり3〜4バイト消費します。',
    },
    {
      id: 'cc-faq-8',
      question: '制限文字数内に文章を収めるコツは？',
      answer:
        '上限プリセットを選択して残り文字数を見ながら、冗長な接続詞や修飾語を削り、改行やリンクも含めた合計値を確認してください。',
    },
    {
      id: 'cc-faq-9',
      question: '改行も文字数にカウントされますか？',
      answer:
        'はい。各改行は「空白込み」の文字数に1文字として加算され、「空白なし」では除外されます。',
    },
    {
      id: 'cc-faq-10',
      question: '機密の文章やAIプロンプトも安全に数えられますか？',
      answer:
        'はい。処理はすべてローカルブラウザのメモリ内のみで実行されるため、下書きやソースコードが外部に出ることはありません。',
    },
    {
      id: 'cc-faq-11',
      question: '文字数はAIのトークン数と同じですか？',
      answer:
        'いいえ。このツールは文字数（空白込み・なし）を数えるものであり、LLMのトークン数計算は行いません。',
    },
  ],
  guide: {
    title: '文字数の正しい数え方と空白・改行・バイト数の違い',
    description:
      '空白込みと空白なしの使い分け、絵文字や改行のカウント仕様、SEO・SNSごとの文字数制限の目安を解説します。',
    readMinutes: 4,
  },
  ui: {
    emptyMessage: '上にテキストを入力または貼り付けると計測が始まります。',
    sampleText:
      'ここに下書きを入力または貼り付けると、160文字（メタディスクリプション・SMS）や280文字などの制限をリアルタイムで確認できます。',
    statCharacters: '文字数（空白込み）',
    statNoSpaces: '空白なし',
    statWords: '単語数',
    statSentences: '文数',
    statParagraphs: '段落数',
    statAvgWordLength: '平均単語長',
    btnDownloadReport: 'レポートを保存',
    headingLimits: 'プラットフォーム別上限',
    ariaPresets: '文字数制限プリセット',
    presetMetaDesc: 'メタディスクリプション (160)',
    headingBreakdown: '文字種の内訳',
    limitRemainingTpl: '{chars} / {limit} 文字・残り {remaining} ({pct}%)',
    limitOverTpl: '{chars} / {limit} 文字・{over} 文字超過',
    lblLetters: '文字（英字・かな等）',
    lblDigits: '数字',
    lblSpaces: '空白・改行',
    lblPunctuation: '記号・句読点',
    lblOther: 'その他',
    nothingToDownload: 'ダウンロードするテキストがありません。',
    reportTitle: '文字数カウントレポート',
    reportActiveLimit: '適用中の上限:',
    reportRemaining: '残り文字数:',
    reportGenerated: 'ToyTools で作成',
    reportDownloaded: 'レポートを保存しました',
  },
};
