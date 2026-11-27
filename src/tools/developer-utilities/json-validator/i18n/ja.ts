import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'json-validator',
  name: 'JSON バリデーター（構文検証）',
  seoTitle: 'JSON バリデーター – 構文チェック＆エラー特定ツール',
  description:
    'JSONの構文をRFC 8259基準で即座に検証。末尾カンマや全角引用符、括弧の閉じ忘れをブラウザ内で検出し、ワンクリック修復にも対応します。',
  tagline: 'JSONの構文をチェックし、エラーの正確な発生箇所を特定します。',
  knowledge: {
    primaryConcepts: ['JSON構文検証', 'JSON Lint'],
    realWorldUseCases: [
      'APIから返る 400 "Invalid JSON" エラーの原因を素早く切り分ける',
      '手編集した package.json や tsconfig.json の記載ミスをチェックする',
      'ログから抽出したWebhookペイロードが正しいJSONか確認する',
      'デプロイやCIの前に設定ファイルの構文エラーを防ぐ',
    ],
    commonMistakes: [
      'オブジェクトや配列の最後の要素の後ろに末尾カンマを残してしまうこと',
      '文法チェック（構文検証）とデータ構造定義（JSON Schema）を混同すること',
    ],
  },
  faqs: [
    {
      id: 'json-val-faq-1',
      question: 'JSONバリデーション（構文検証）とは何を行いますか？',
      answer:
        '入力テキストが公式JSON仕様（RFC 8259）に構文上準拠しているかをチェックします。正しければ有効と判定し、問題があれば何が・どこで失敗しているか最初のエラー箇所を報告します。',
    },
    {
      id: 'json-val-faq-2',
      question: 'JSONで最も多い構文エラーは何ですか？',
      answer:
        '末尾のカンマ、二重引用符ではなくシングルクォートを使うミス、キーの引用符忘れ、コメントの混入、そしてJavaScript特有の `undefined`・`NaN`・`Infinity` の使用が代表例です。',
    },
    {
      id: 'json-val-faq-3',
      question: 'JSONとJavaScriptオブジェクトリテラルの違いは？',
      answer:
        'JSONははるかに厳格です。JSではキーの引用符省略・シングルクォート・末尾カンマ・コメントが許されますが、JSONでは必ず半角二重引用符 `"` を使い、末尾カンマもコメントも認められません。',
    },
    {
      id: 'json-val-faq-4',
      question: 'JSONで末尾カンマが許されないのはなぜですか？',
      answer:
        '`[1, 2, 3,]` のような曖昧さを排除し、単純かつ高速に構文解析できる仕様にするためです。JSやTypeScriptでは使えますが、JSON仕様では意図的に禁止されています。',
    },
    {
      id: 'json-val-faq-5',
      question: 'JSONにコメントを書けないのはなぜですか？',
      answer:
        '考案者ダグラス・クロックフォード氏が、設定指示をコメントに埋め込む悪用を防いで純粋なデータ交換フォーマットに保つため意図的に除外しました。コメントが必要な場合は JSONC や JSON5 を使います。',
    },
    {
      id: 'json-val-faq-6',
      question: '構文検証（Syntax Validation）と JSON Schema 検証の違いは？',
      answer:
        '構文検証はJSONとして正しくパースできるか（括弧や引用符など）を見ます。JSON Schema検証は、パースできたJSONが「必須項目・型・数値範囲」など業務仕様に合っているかを検証します。',
    },
    {
      id: 'json-val-faq-7',
      question: 'JSでは動いたのに JSON.parse に失敗するのはなぜですか？',
      answer:
        'デバッガやコンソールからコピーした文字列表現には、シングルクォートや引用符なしキーなど `JSON.stringify` では生成されないJS構文が含まれることが多いためです。ここへ貼れば該当箇所がすぐ分かります。',
    },
    {
      id: 'json-val-faq-8',
      question: 'JSONCやJSON5は標準のJSONとして有効ですか？',
      answer:
        'いいえ。コメントや末尾カンマを追加した上位形式（VS Code設定で使われるJSONCなど）であり、標準のJSONパーサーではエラーになります。',
    },
    {
      id: 'json-val-faq-9',
      question: 'JSONオブジェクト内に同じキーを重複させてもよいですか？',
      answer:
        '仕様上「重複は避けるべき（should）」とされていますが厳密な禁止規定がないため、環境によって先の値や後の値を採用するなど挙動が割れ、バグの温床になります。',
    },
  ],
  guide: {
    title: 'JSON構文検証の基本とよくあるエラーの直し方',
    description: 'RFC 8259文法ルール、末尾カンマ・引用符ミス、構文チェックとJSON Schemaの違いを解説。',
    readMinutes: 5,
  },
  ui: {
    inputLabel: 'JSON入力',
    placeholder: 'ここにJSONを貼り付けてください',
    emptyOutput: 'JSONを貼り付けると構文を検証します。',
    validLabel: '有効なJSON',
    invalidLabel: '無効なJSON',
    appliedPrefix: '適用済み: ',
    loadError: 'JSONプロセッサを読み込めませんでした。',
    moreAboutHeading: 'JSON バリデーターの仕組み',
    insight:
      '入力を解析し、RFC 8259に沿った整形式JSONかどうかと最初の構文エラー箇所を報告します（スキーマ定義の検査は行いません）。',
    technical: [
      { term: '準拠規格', detail: 'RFC 8259 / ECMA-404' },
      { term: '検証対象', detail: '構文と構造の整合性' },
      { term: '非対象', detail: 'JSON Schema、業務上の必須項目や型制約' },
      { term: '出力', detail: '有効、または最初のエラーと発生位置' },
    ],
    engine: {
      validJsonOut: '有効なJSON',
      repairBoth: 'スマート引用符と末尾カンマを修正',
      repairQuotes: '全角・スマート引用符を修正',
      repairComma: '末尾のカンマを削除',
    },
  },
};
