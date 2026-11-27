import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'sql-formatter',
  name: 'SQL 整形ツール（Formatter）',
  seoTitle: 'SQL 整形ツール – 見やすくインデント表示（送信ゼロ）',
  description:
    '1行に詰まったSQLクエリを予約語大文字化・句ごとの改行＆インデントで見やすく整形。パスワード混入警告付きで完全にブラウザ内のみで動作します。',
  tagline: '長い1行SQLを読みやすい句単位・インデント形式へ瞬時に整形します。',
  citation: {
    problem: 'ログやチケットから取り出した長い1行のSQLクエリを、外部送信せずに手元で見やすく整形したいときに使えます。',
    nonGoal: 'データベースへ接続して実行したり、クエリの意味や実行計画を書き換えたりすること。',
  },
  knowledge: {
    primaryConcepts: ['SQL整形', 'SQLフォーマット'],
    realWorldUseCases: [
      'アプリログからコピーした1行SQLを読みやすく整える',
      'コードレビュー前に複雑なJOINを含むクエリを構造化する',
      '社外秘や機密条件を含むチケット内SQLを外部サーバーへ送らず確認する',
    ],
    commonMistakes: [
      'パスワードやAPIキーが含まれたSQLをサーバー送信型の整形サイトへ貼り付けること',
      '整形ツールが実行計画まで自動最適化してくれると期待すること',
    ],
  },
  faqs: [
    {
      id: 'sql-fmt-1',
      question: 'SQL整形ツールはどこを変更しますか？',
      answer:
        'レイアウトのみを変更します。SQL予約語を大文字化し、主要句（SELECT・FROM・WHEREなど）を改行し、括弧内のネストを2スペースで字下げします。文字列リテラル・コメント・数値・識別子は一切変更されません。',
    },
    {
      id: 'sql-fmt-2',
      question: 'どのSQL方言（DB）に対応していますか？',
      answer:
        'PostgreSQL・MySQL・SQLiteの主要キーワード（SELECT、各種JOIN、GROUP BY、ORDER BY、WITH、RETURNING、ドル引用符など）を幅広くカバーしています。特殊な拡張構文も壊さずそのまま保持します。',
    },
    {
      id: 'sql-fmt-3',
      question: '入力したSQLは外部サーバーに送信されますか？',
      answer:
        'いいえ。字句解析と整形はすべてブラウザ内で完結します。本番クエリやテーブル構造が外部へ送信されることは一切なく、オフラインでも動作します。',
    },
    {
      id: 'sql-fmt-4',
      question: '認証情報を含むクエリを外部サイトへ貼る危険性とは？',
      answer:
        '多くの無料SQL整形サイトはサーバー上で処理するため、入力内のパスワード・APIキー・個人情報がサーバーログに保存される恐れがあります。ブラウザ完結型のツールを使い、既知の漏洩懸念時はキーをローテーションしてください。',
    },
    {
      id: 'sql-fmt-5',
      question: 'クォート（引用符）が閉じられていない場合はどうなりますか？',
      answer:
        '構文を推測で補完することはせず、未閉じのシングルクォート・ダブルクォート・バッククォートがあることをエラーとして通知して停止します。',
    },
    {
      id: 'sql-fmt-6',
      question: 'SQLの圧縮（1行化）もできますか？',
      answer:
        'このツールは可読性重視の整形（Pretty-Print）専用です。まず整形状態で条件ミスがないか確認することをおすすめします。',
    },
    {
      id: 'sql-fmt-7',
      question: '整形前後でSQLの実行結果は変わりますか？',
      answer:
        '変わりません。SQLでは予約語の大文字小文字や空白・改行は意味を変えず、リテラル文字列と識別子はそのまま残るため同一の結果が得られます。',
    },
    {
      id: 'sql-fmt-8',
      question: 'コメント（`--` や `/* ... */`）は消えませんか？',
      answer:
        '消えません。行コメント・ブロックコメントともにそれぞれの行としてそのまま保持されます。',
    },
  ],
  guide: {
    title: 'SQL整形ツール: 外部送信なしで読めるクエリへ',
    description: 'ローカルSQLフォーマットの動作、対応キーワード、大文字化ルール、パスワード誤貼り付けへの安全設計まで詳しく解説します。',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'SQL入力',
    placeholder: 'ここにSQLを貼り付けてください',
    emptyOutput: '左側にSQLを貼り付けると整形結果が表示されます。',
    validLabel: '有効なSQL',
    invalidLabel: 'SQLエラー',
    loadError: 'SQLプロセッサを読み込めませんでした。',
    toolNote: 'クォート値内にパスワードやAPIキーらしい記述がある場合、共有を防ぐため警告を表示します。',
    insight:
      '予約語を大文字化し、主要句を1行ずつ見やすく整えます。文字列リテラルやコメント、識別子は一切改変しません。',
    technical: [
      { term: '動作', detail: '字句解析・予約語大文字化・句と括弧の2スペースインデント' },
      { term: '対応方言', detail: 'PostgreSQL / MySQL / SQLite の一般的なSQL' },
      { term: '保持対象', detail: '文字列リテラル・コメント (-- / /* */)・数値・識別子' },
      { term: 'エラー検知', detail: '閉じ忘れクォートを推測せずそのまま報告' },
      { term: 'プライバシー', detail: 'ブラウザ完結。パスワード風リテラル検出時の警告付き' },
    ],
    engine: {
      warnSecret: '引用符内にパスワードまたはシークレットらしき値が含まれています。整形は端末内のみで完結しますが、共有リンク等へ貼り付けないようご注意ください。',
      errTooLargeTpl: 'SQLが {max} 文字の上限を超えています。短く分割してからお試しください。',
      errUnclosedTpl: '{name}引用符の文字列が閉じられていません。不足している {q} を補って再実行してください。',
      quoteNames: { single: 'シングル', double: 'ダブル', backtick: 'バッククォート' },
    },
  },
};
