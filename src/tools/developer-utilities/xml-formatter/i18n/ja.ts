import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'xml-formatter',
  name: 'XML 整形・構文検証ツール',
  seoTitle: 'XML 整形・バリデーター – 見やすく字下げ＆構文チェック',
  description:
    'XMLをブラウザ内で綺麗にインデント整形または圧縮し、閉じタグ漏れなどの整形式エラーを最初の発生行と合わせて検出します。外部送信ゼロ。',
  tagline: 'XMLの整形・圧縮と構文エラー（整形式チェック）をブラウザ内で即実行。',
  citation: {
    problem: '1行のXMLを綺麗に整えたり、閉じタグの抜けや構文エラーを外部送信せず確認したいときに使えます。',
    nonGoal: '外部のXSD・DTD・Schematronスキーマ定義と照合して検証すること。',
  },
  knowledge: {
    primaryConcepts: ['XML整形', 'XMLバリデーター'],
    realWorldUseCases: [
      'ログから抜き出した1行のSOAPやRSS XMLを読みやすくインデントする',
      'デプロイ前に設定ファイルXMLの閉じタグ漏れや構文ミスを確認する',
      '埋め込み用に余白を取り除いた圧縮XMLを作成する',
    ],
    commonMistakes: [
      '整形式（Well-formedness）チェックにXSDスキーマ検証まで期待してしまうこと',
      'HTML感覚で開始タグと終了タグの大文字・小文字違いを見落とすこと',
    ],
  },
  faqs: [
    {
      id: 'xml-fmt-1',
      question: 'XML整形ツールはどこを変更しますか？',
      answer:
        '整形式として正しいXMLのレイアウトだけを変えます。整形モードでは2スペースで階層ごとに改行し、圧縮モードでは要素間の不要な空白を取り除きます。タグ名・属性・本文・コメント・CDATAはそのまま保持されます。',
    },
    {
      id: 'xml-fmt-2',
      question: 'ここでの「検証（Validate）」は何を確認しますか？',
      answer:
        'XMLとしての整形式（単一のルート要素、開始・終了タグの一致、正しい要素名）を確認します。XSD・DTD・Schematron等のスキーマ検証は行いません。',
    },
    {
      id: 'xml-fmt-3',
      question: 'XMLで大文字と小文字が区別されるのはなぜですか？',
      answer:
        'HTMLと異なり、XML仕様では `<Book>` と `<book>` は全く別の要素名として扱われます。開始タグと終了タグの表記が1文字でも違うとエラーになります。',
    },
    {
      id: 'xml-fmt-4',
      question: 'XML名前空間（Namespace）はどう扱われますか？',
      answer:
        '`xmlns:prefix="..."` で指定されたプレフィックスやデフォルト名前空間は記述されたまま維持され、外部URLからDTDやスキーマを取りに行くことはありません。',
    },
    {
      id: 'xml-fmt-5',
      question: '入力したXMLデータはサーバーに送信されますか？',
      answer:
        'いいえ。ブラウザ内蔵の DOMParser を使い完全にローカルで解析・シリアライズするため、機密XMLも外部へ出ません。',
    },
    {
      id: 'xml-fmt-6',
      question: 'エラーの行番号はどこから取得していますか？',
      answer:
        'ブラウザ標準の DOMParser がエラーメッセージ内に返す行・列番号を抽出して表示しています。',
    },
    {
      id: 'xml-fmt-7',
      question: '整形だけでなくXMLの圧縮（Minify）もできますか？',
      answer:
        'はい。モード切替から「圧縮 (Minify)」を選ぶと要素間の不要な空白を削ったコンパクトXMLを出力します。',
    },
    {
      id: 'xml-fmt-8',
      question: '整形するとXMLデータの意味が変わることはありますか？',
      answer:
        '要素構造や属性値の意味は変わりません。整形時には要素間の空白のみのテキストノードのみが標準的に正規化されます。',
    },
  ],
  guide: {
    title: 'XML整形＆検証ガイド: 外部送信なしで整える',
    description: 'ブラウザ内のXMLフォーマット・整形式チェック、大文字小文字の厳格さと名前空間やCDATAの扱いまで詳しく解説します。',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'XML入力',
    placeholder: 'ここにXMLを貼り付けてください',
    emptyOutput: '左側にXMLを貼り付けると整形または圧縮します。',
    validLabel: '有効なXML',
    invalidLabel: '無効なXML',
    loadError: 'XMLプロセッサを読み込めませんでした。',
    modePretty: '整形（Pretty Print）',
    modeMinify: '圧縮（Minify）',
    modeAriaLabel: 'モード',
    toolNote: 'ブラウザが位置情報を返す場合、最初の整形式エラーの行番号を表示します。',
    insight:
      '整形式のXMLを2スペース字下げで見やすく整形し、エラー時はブラウザの DOMParser を用いて最初の不整合箇所を検出します。',
    technical: [
      { term: '動作', detail: 'DOMParserで解析し2スペースインデントまたは圧縮して出力' },
      { term: '検証範囲', detail: '整形式（タグ一致・単一ルート要素・有効名）' },
      { term: '非対象', detail: 'DTD / XSD / Schematron スキーマ検証' },
      { term: '保持対象', detail: '要素名・属性・テキスト・コメント・CDATAセクション' },
      { term: 'プライバシー', detail: '完全ブラウザ内動作。データは外部へ送信されません' },
    ],
    engine: {
      errNoParser: 'この環境ではXMLパーサーを利用できません。',
      whereLineColTpl: ' ({line}行目, {col}列目)',
      whereLineTpl: ' ({line}行目)',
      errMalformed: '不正な形式のXML',
      errNoRoot: '不正な形式のXML: ルート要素がありません。',
    },
  },
};
