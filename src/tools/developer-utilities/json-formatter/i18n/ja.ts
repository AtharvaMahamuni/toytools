import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'json-formatter',
  name: 'JSON 整形・フォーマットツール',
  seoTitle: 'JSON 整形ツール (Formatter) – 見やすくインデント表示',
  description:
    '圧縮・難読化されたJSONをブラウザ上で瞬時に整形（Pretty-Print）。構文エラー箇所の特定や重複キーの警告も端末内のみで安全に行えます。',
  tagline: '1行のJSONを適切なインデントと改行で読みやすく整形します。',
  citation: {
    problem: 'APIレスポンスや設定ファイルのJSONを外部サーバーへ送信せずに見やすく整形・確認したいときに使えます。',
    nonGoal: 'AIモデルを呼び出したりデータの意味を解釈・変換したりすること。',
  },
  knowledge: {
    primaryConcepts: ['json 整形', 'json フォーマット', 'pretty print'],
    realWorldUseCases: [
      '開発中に改行なしのAPIレスポンスを見やすくデバッグする',
      '1行に圧縮された設定ファイル（JSON）の構造を確認する',
      'ログから抽出したWebhookペイロードを素早く検査する',
      'バージョン管理向けにインデントを統一して差分を見やすくする',
    ],
    commonMistakes: [
      '構文エラーがあるJSONをそのまま整形しようとして失敗すること',
      '通信量削減が重要な本番APIで整形済みJSONを返してしまうこと',
    ],
  },
  faqs: [
    {
      id: 'json-fmt-faq-1',
      question: 'オンラインでJSONを整形するにはどうすればよいですか？',
      answer:
        '入力欄にJSONを貼り付けると即座に解析・整形されます。有効なJSONであれば2スペースのインデントと改行が付き、構文ミスがある場合は最初のエラー位置が表示されます。データはすべてブラウザ内のみで処理されます。',
    },
    {
      id: 'json-fmt-faq-2',
      question: 'JSONフォーマッターは具体的に何をしますか？',
      answer:
        '有効なJSONテキストに対し、人間が読みやすい一定のインデントと改行を挿入して再配置します。キー名や値、並び順、数値精度などのデータ内容は一切変わりません。',
    },
    {
      id: 'json-fmt-faq-3',
      question: 'JSONを整形するとデータの中身や意味が変わりますか？',
      answer:
        'いいえ。JSON仕様においてトークン間の空白文字や改行は意味を持ちません。`{"a":1}` と改行・インデント付きの表記はどのJSONパーサーでも完全に同一のデータとして解釈されます。',
    },
    {
      id: 'json-fmt-faq-4',
      question: 'JSONの整形（フォーマット）と圧縮（Minify）の違いは？',
      answer:
        'ちょうど逆の操作です。整形は可読性のためにインデントと改行を加え、圧縮はファイルサイズと通信量を減らすために余分な空白をすべて取り除きます。',
    },
    {
      id: 'json-fmt-faq-5',
      question: 'JSON整形ツールとJSONバリデーター（構文検証）の違いは？',
      answer:
        '整形は正しいJSONをインデントして見やすく整えます。バリデーターはJSON仕様に準拠しているかをチェックして最初の構文エラー位置を報告します。エラーが出る場合は先に構文を修正してください。',
    },
    {
      id: 'json-fmt-faq-6',
      question: 'このJSON整形ツールはプライバシー上安全ですか？',
      answer:
        'はい。解析・整形処理はすべてお使いのブラウザのJavaScript内でローカル実行されます。機密の設定ファイルやAPIデータも外部サーバーへ一切送信されません。',
    },
    {
      id: 'json-fmt-faq-7',
      question: 'インデント幅はいくつを使うのが一般的ですか？',
      answer:
        'JavaScriptやWeb開発では2スペースが最も一般的で、Pythonや設定ファイルの一部では4スペースもよく使われます。JSONパーサー側の解釈に違いはありません。',
    },
    {
      id: 'json-fmt-faq-8',
      question: 'APIのレスポンスが1行に詰まって返ってくるのはなぜですか？',
      answer:
        'Web APIはネットワーク帯域の節約と転送高速化のため、空白を削ったMinify済みJSONを返すのが標準です。デバッグ時にここへ貼り付ければすぐ階層構造を確認できます。',
    },
    {
      id: 'json-fmt-faq-9',
      question: 'Pretty-Print（プリティプリント）とはどういう意味ですか？',
      answer:
        'プログラムやデータ構造に適切な字下げ・改行を入れて人間が読みやすい形に出力することを指します。JSONにおけるフォーマット・整形と同義です。',
    },
    {
      id: 'json-fmt-faq-10',
      question: 'ファイルをアップロードせずにJSONを整形できますか？',
      answer:
        'はい。登録もファイル送信も不要で、テキストを貼り付けるだけで端末内で即座に整形されます。',
    },
    {
      id: 'json-fmt-faq-11',
      question: '整形時にAI（ChatGPTやClaudeなど）は使われますか？',
      answer:
        'いいえ。純粋で決定論的な構文パーサーであり、入力データが外部のAIモデルへ送信されることはありません。',
    },
    {
      id: 'json-fmt-faq-12',
      question: 'AIが出力したJSONの整形・確認にも使えますか？',
      answer:
        'はい。生成結果のJSONブロックを貼り付けて末尾カンマや括弧の閉じ忘れを確認し、そのままコピーできます。',
    },
    {
      id: 'json-fmt-faq-13',
      question: '大きな整数、1.0などの小数表現、重複キーは保持されますか？',
      answer:
        'はい。通常の `JSON.stringify(JSON.parse(...))` を使わず元のトークン列をそのまま再インデントするため、`12345678901234567890` が丸められたり `1.0` が `1` に変わったりしません。重複キーも保持しつつ警告を表示します。',
    },
  ],
  guide: {
    title: 'JSON整形とは？Pretty-Printとデータ保持を解説',
    description: 'JSONフォーマッターの仕組み、圧縮との違い、大きな整数や小数点表記、重複キーを壊さない安全な整形方法を解説します。',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'JSON入力',
    placeholder: 'ここにJSONを貼り付けてください',
    emptyOutput: '左側にJSONを入力すると整形結果が表示されます。',
    validLabel: '有効なJSON',
    invalidLabel: '無効なJSON',
    appliedPrefix: '適用済み: ',
    loadError: 'JSONプロセッサを読み込めませんでした。',
    moreAboutHeading: 'JSON整形ツールの仕組み',
    insight:
      'JSON整形（Pretty-Print）はデータ内容を一切変えずに一定のインデントと改行を加えて読みやすくします。大きな整数や小数表現もそのまま保持されます。',
    technical: [
      { term: '準拠規格', detail: 'RFC 8259 / ECMA-404' },
      { term: '動作', detail: '再シリアライズせず元のトークン列に2スペース字下げを適用' },
      { term: 'データ保持', detail: '大きな整数・1.0・1e5・エスケープ表記・キー順をそのまま維持' },
      { term: '重複キー', detail: '削除せずそのまま残して警告を表示' },
      { term: 'エラー', detail: '最初の構文エラーの位置（行・列）を特定して報告' },
    ],
  },
};
