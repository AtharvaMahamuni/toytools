import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'url-encoder-decoder',
  name: 'URL エンコード・デコード',
  seoTitle: 'URL エンコード・デコード変換ツール（UTF-8 / %XX）',
  description:
    '日本語を含むURLパラメータや文字列をUTF-8パーセントエンコーディング（`encodeURIComponent`）で即変換・デコード。二重エンコードや「+」も自動修復候補を提示。',
  tagline: 'URLコンポーネントをブラウザ上で即座に%エンコード・デコード。',
  craft: {
    solves:
      '二重エンコード（%2520）、HTMLフォーム由来の「+」、文中の孤立した「%」が原因でデコードエラーになりツール故障と誤解される問題を防ぎます。',
  },
  knowledge: {
    primaryConcepts: ['URLエンコーディング'],
    realWorldUseCases: [
      '日本語や空白を含む検索キーワードをクエリパラメータ化する',
      'メールアドレスやOAuthのリダイレクトURLを安全にクエリへ埋め込む',
      '空白を含むファイルパスやパラメータを正しいURI形式にする',
    ],
    commonMistakes: [
      '値ごとではなくURL文字列全体をencodeURIComponentにかけてしまう',
      'すでにエンコード済みの値を二重エンコード（%20 → %2520）する',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: 'URLエンコード（パーセントエンコーディング）は何をするものですか？',
      answer:
        'URL内で予約されている記号や日本語・空白などを、`%` に続けてUTF-8バイト値の16進数2桁（例：半角スペースは `%20`、`&` は `%26`）に置き換え、URL構造を壊さず安全に送信できるようにします。',
    },
    {
      id: 'url-enc-faq-2',
      question: '空白の「%20」と「+」は何が違いますか？',
      answer:
        '`%20` はRFC 3986準拠のパスや標準URLで使われる表記です。`+` はHTMLフォーム送信（`application/x-www-form-urlencoded`）専用の表記であり、通常のURLパスでは文字通りのプラス記号として扱われます。',
    },
    {
      id: 'url-enc-faq-3',
      question: 'encodeURIComponent と encodeURI の使い分けは？',
      answer:
        'クエリパラメータの「値」やパスの一部には `&` や `=` や `/` もエスケープする `encodeURIComponent` を使います。`encodeURI` はURL全体の構造記号を残したいときだけ使います。',
    },
    {
      id: 'url-enc-faq-4',
      question: 'どの文字をパーセントエンコードする必要がありますか？',
      answer:
        '空白、`<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`、さらに日本語や絵文字などASCII以外の全文字です。また `&`, `=`, `/`, `?`, `#` もパラメータ値の中身として使う場合は必須です。',
    },
    {
      id: 'url-enc-faq-5',
      question: '二重エンコードとは何ですか？どう防げますか？',
      answer:
        'すでに `%20` となった文字列を再度エンコードすると `%` が `%25` になり `%2520` に化けてしまいます。生テキストをURLに組み込む直前に1回だけエンコードしてください。',
    },
    {
      id: 'url-enc-faq-6',
      question: 'クエリ文字列だけでなくURLパスにも適用されますか？',
      answer:
        'はい。`/my%20folder/file.txt` のようなパス部分にも `?q=hello%20world` のようなクエリ部分にも必要で、各セグメントごとに `encodeURIComponent` を適用します。',
    },
    {
      id: 'url-enc-faq-7',
      question: 'URLエンコードとURLエスケープ・パーセントエンコードは同じ意味ですか？',
      answer:
        'はい。仕様書（RFC 3986）ではパーセントエンコーディングと呼び、開発現場ではURLエンコードやエスケープと呼びますが仕組みは同一です。',
    },
    {
      id: 'url-enc-faq-8',
      question: 'クエリ値をエンコードし忘れるとどうなりますか？',
      answer:
        '値の中の `&` が別のパラメータ区切りと解釈されたり、`#` 以降がブラウザ内のフラグメント扱いになってサーバーに届かなくなったりします。',
    },
    {
      id: 'url-enc-faq-9',
      question: 'このツールはどのように変換していますか？',
      answer:
        'ブラウザ内で標準の `encodeURIComponent` と `decodeURIComponent` を使ってUTF-8ベースで変換しており、API値やパス要素の検査に最適です。',
    },
  ],
  guide: {
    title: 'URLエンコードの仕組み：%20と+の違い・二重エンコード対策',
    description:
      'RFC 3986のパーセントエンコーディング、encodeURIとの違い、%2520バグを防ぐポイントを解説します。',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'エンコード → URL',
    inverseLabel: 'デコード ← URL',
    outputLabel: '出力結果',
    placeholder: 'テキストまたは %XX 文字列をここに貼り付け…',
    outputPlaceholder: '変換結果がここに表示されます…',
    emptyOutput: 'テキストまたはURLエンコード文字列を入力してください。',
    insight:
      'パーセントエンコーディングは予約記号や日本語などをUTF-8の %XX 形式（`encodeURIComponent`）へ変換し、&, =, ? によるURL破損を防ぎます。',
    technical: [
      { term: '変換方式', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: '空白の扱い', detail: '標準URIは %20、x-www-form-urlencoded フォームでは +' },
      { term: 'プライバシー', detail: 'すべて端末内ブラウザで実行・URLやトークンは非送信' },
    ],
    compareLabel: '比較チェック',
    comparePlaceholder: '一致確認する期待値（任意）',
    modeAriaLabel: '変換モード選択',
    inputAriaLabel: '入力欄',
    outputAriaLabel: '変換結果',
    swapLabel: '入出力を入替',
    swapAriaLabel: '入力と出力を入れ替える',
    metaAriaLabel: '変換メタデータ',
    byteAriaLabel: '16進数バイトビューア',
    historyTitle: '変換履歴',
    historyAriaLabel: '最近の入力',
    insightAriaLabel: '技術解説',
    appliedPrefix: '自動修正を適用:',
    checkInputMsg: '入力を確認してください。不正な % シーケンスが含まれています。',
    invalidInputMsg: '有効なパーセントエンコーディングではありません。',
    couldNotConvertMsg: '入力を変換できませんでした。',
    detectedPrefix: '自動検出:',
    validPrefix: '有効',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'テキスト',
      'Percent-encoded': 'URLエンコード',
      'HTML entities': 'HTMLエンティティ',
      Markup: 'マークアップ',
    },
    engine: {
      errDecode: 'URL文字列をデコードできませんでした。',
      errEncode: 'URLコンポーネントとしてエンコードできませんでした。',
      errInvalidPctTpl: '{pos}文字目付近に不完全または不正な % シーケンスがあります。',
      recDouble: '二重エンコード（%25XX）の可能性があります：もう1段階デコードする',
      recStrayPct: 'デコード前に孤立した % を %25 としてエスケープする',
      recPlus: '+ を空白に変換する（x-www-form-urlencoded 形式）',
      metaEscapes: '%XX シーケンス',
      escCountTpl: '{n} 件',
      metaInputLen: '入力文字数',
      metaOutputBytes: '出力バイト',
    },
  },
};
