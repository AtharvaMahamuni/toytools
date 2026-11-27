import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'password-generator',
  name: 'パスワード生成ツール',
  seoTitle: '強力なランダムパスワード生成ツール',
  description:
    '文字数・文字種を自由に設定し、エントロピーと強度をリアルタイム判定して安全なパスワードをブラウザ上で生成します。外部送信はありません。',
  tagline: '強力なランダムパスワードをライブ強度判定付きで生成。',
  citation: {
    problem: 'ブラウザ上で安全なランダムパスワードを即座に生成したいときに使えます。',
    nonGoal: '生成したパスワードを保存したり、AIモデルやサーバーへ送信したりすること。',
  },
  craft: {
    solves:
      '画面を見ながら手入力したり口頭で伝えたりする際、多くのフォントで 0/O や 1/l/I が見分けにくく入力ミスにつながります。',
  },
  knowledge: {
    primaryConcepts: ['パスワード生成', 'パスワード強度とエントロピー'],
    realWorldUseCases: [
      '新しいWebサービス用の固有パスワード作成',
      '使い回していた古いパスワードの更新',
      'パスワード管理ツールのマスターパスワード作成',
      '共有アカウント用の一時的な認証情報の生成',
    ],
    commonMistakes: [
      '同じパスワードを複数のサイトで使い回す',
      '記号を入れただけで短いパスワードを安全と思い込む',
      '生成したパスワードを平文テキストに保存する',
      '文字種を減らしすぎて候補プールを狭くする',
    ],
  },
  fields: {
    length: { label: '文字数', help: '4〜128文字。通常アカウントは16文字以上を推奨。' },
    uppercase: { label: '英大文字 (A-Z)', group: '使用文字種' },
    lowercase: { label: '英小文字 (a-z)', group: '使用文字種' },
    numbers: { label: '数字 (0-9)', group: '使用文字種' },
    symbols: { label: '記号 (!@#$...)', group: '使用文字種' },
    excludeAmbiguous: { label: '紛らわしい文字を除外 (0, O, 1, l, I)', group: 'オプション' },
  },
  faqs: [
    {
      id: 'password-generator-faq-1',
      question: 'パスワード生成ツールとは何ですか？',
      answer:
        '指定した文字種と長さから、パターンや推測可能な単語を含まないランダムな文字列を自動作成するツールです。人間が考えるパスワードよりはるかに解読が困難になります。',
    },
    {
      id: 'password-generator-faq-2',
      question: 'このパスワード生成ツールの使い方は？',
      answer:
        '文字数を指定し、大文字・小文字・数字・記号のオン/オフを切り替えるだけで即座に生成されます。「再生成」で新しい候補を作成し、「コピー」でクリップボードにコピーできます。',
    },
    {
      id: 'password-generator-faq-3',
      question: 'パスワードは何文字にすべきですか？',
      answer:
        '長いほど強力です。一般のアカウントでは16文字以上、メールやパスワード管理アプリなど重要なアカウントでは20文字以上をおすすめします。',
    },
    {
      id: 'password-generator-faq-4',
      question: 'このパスワード生成ツールは安全ですか？',
      answer:
        'はい。すべての生成処理はお使いの端末のブラウザ内のみで完結し、外部サーバーへの送信・ログ記録・保存は一切行いません。',
    },
    {
      id: 'password-generator-faq-5',
      question: 'オフラインでも使えますか？',
      answer:
        'はい。一度ページを読み込めばインターネット接続なしで動作し、ローカルJavaScriptだけで安全に生成できます。',
    },
    {
      id: 'password-generator-faq-6',
      question: '本当に偏りのないランダム生成ですか？',
      answer:
        'ブラウザ標準の暗号論的疑似乱数API（Web Crypto API）を使用し、剰余バイアスを避けた抽出を行っているため全文字が均等な確率で選ばれます。',
    },
    {
      id: 'password-generator-faq-7',
      question: 'パスワードのエントロピーとは何ですか？',
      answer:
        '推測しにくさをビット数で表した指標です。1ビット増えるごとに総当たりの試行回数が2倍になります。40ビット未満は脆弱、60〜80ビットは実用的、100ビット以上は非常に強力です。',
    },
    {
      id: 'password-generator-faq-8',
      question: 'エントロピーはどのように計算されますか？',
      answer:
        '「文字数 × log2(候補文字数)」で算出します。4種類すべて（約88文字）で16文字にすると約103ビットになります。',
    },
    {
      id: 'password-generator-faq-9',
      question: '強度インジケーターの意味は？',
      answer:
        'エントロピーに基づき「非常に弱い〜非常に強い」の5段階で分かりやすく表示します。重要なアカウントでは「強い」以上を目安にしてください。',
    },
    {
      id: 'password-generator-faq-10',
      question: '記号は必ず含めるべきですか？',
      answer:
        'サイトが対応していれば有効ですが、長さを増やす方が効果的です。記号を足すより文字数を4文字増やす方がエントロピーは大きく向上します。',
    },
    {
      id: 'password-generator-faq-11',
      question: '紛らわしい文字を除外する利点は？',
      answer:
        'Oと0、小文字l・大文字I・数字1など見分けにくい文字を省くことで、手入力や読み上げ時の入力ミスを防げます。',
    },
    {
      id: 'password-generator-faq-12',
      question: '数字だけのパスワードやPINも作れますか？',
      answer:
        'はい。数字のみを有効にすれば数値PINを生成できます。候補が10文字と少ないため、同じ強度を得るには文字数を長めに設定してください。',
    },
    {
      id: 'password-generator-faq-13',
      question: 'サイトにパスワードを拒否されるのはなぜですか？',
      answer:
        'サイト側で最大文字数の上限や特定の記号禁止が設けられている場合があります。その際はサイトが許容する範囲で最長の文字数に調整してください。',
    },
    {
      id: 'password-generator-faq-14',
      question: '他の人と全く同じパスワードが出ることはありますか？',
      answer:
        '理論上ゼロではありませんが現実的には起こりません。全文字種で16文字なら10の31乗通り以上の組み合わせがあります。',
    },
    {
      id: 'password-generator-faq-15',
      question: '生成したパスワードはどこに保存すべきですか？',
      answer:
        '暗号化されたパスワードマネージャーの利用を推奨します。平文のメモ帳やスプレッドシートへの保存は避けてください。',
    },
    {
      id: 'password-generator-faq-16',
      question: '生成したパスワードは履歴に残りますか？',
      answer:
        'いいえ、パスワード自体は保存されません。文字数や文字種などの設定値のみが利便性のためにローカル保存されます。',
    },
    {
      id: 'password-generator-faq-17',
      question: '一度に複数のパスワードを生成できますか？',
      answer:
        '本ツールは1件ずつ確実に作成する設計です。「再生成」で何度でも即座に作り直せます。一括生成にはランダム文字列生成ツールが適しています。',
    },
    {
      id: 'password-generator-faq-18',
      question: 'パスワードとパスフレーズの違いは？',
      answer:
        'パスワードはランダム文字列、パスフレーズは複数の単語をつなげたものです。本ツールはパスワードマネージャーでの管理に最適な文字列を生成します。',
    },
    {
      id: 'password-generator-faq-19',
      question: '記号ありの短いパスワードより長い方が強いのですか？',
      answer:
        'はい。例えば英小文字のみの20文字（約94ビット）は、記号込み10文字（約64ビット）より大幅に強固です。',
    },
    {
      id: 'password-generator-faq-20',
      question: '対応ブラウザを教えてください。',
      answer:
        'PC・スマホのChrome、Firefox、Safari、Edgeなど、Web Crypto APIに対応したすべての最新ブラウザで動作します。',
    },
    {
      id: 'password-generator-faq-21',
      question: 'APIキーやトークンの生成にも使えますか？',
      answer:
        '簡易的なシークレット用途には使えますが、特定の文字セットや超長文トークンにはランダム文字列生成ツールがより柔軟です。',
    },
    {
      id: 'password-generator-faq-22',
      question: 'パスワードはどのくらいの頻度で変更すべきですか？',
      answer:
        '漏洩の報告、不正アクセスの懸念、使い回しが判明したときに変更してください。十分な強度と固有性があれば定期的な強制変更は推奨されません。',
    },
    {
      id: 'password-generator-faq-23',
      question: 'コピー後のクリップボードにリスクはありますか？',
      answer:
        'クリップボード履歴機能が有効な場合、コピー内容が残ることがあります。貼り付け後は無害な文字をコピーして上書きすると安心です。',
    },
    {
      id: 'password-generator-faq-24',
      question: '入力や生成データがアップロードされることはありますか？',
      answer:
        'ありません。アカウント不要でサーバー通信も発生せず、すべて端末内で完結します。',
    },
    {
      id: 'password-generator-faq-25',
      question: 'AIを使ったツールですか？',
      answer:
        'いいえ。ブラウザ標準の暗号学的乱数生成器のみを使用しており、AIモデルは呼び出しません。',
    },
  ],
  guide: {
    title: '強力なパスワードの作り方とエントロピー解説',
    description:
      '記号の複雑さより文字数の長さが重要な理由、エントロピーの仕組み、パスワードマネージャーでの安全な保管方法を分かりやすく解説します。',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'オプションを設定して生成してください。',
    engine: {
      errNoSet: '少なくとも1つの文字種を有効にしてください。',
      bitsTpl: '{bits} ビット',
      charsTpl: '{n} 文字',
      metaEntropy: 'エントロピー',
      metaLength: '文字数',
      metaPool: '候補プール',
      strength: {
        veryWeak: '非常に弱い',
        weak: '弱い',
        fair: '普通',
        strong: '強い',
        veryStrong: '非常に強い',
      },
    },
  },
};
