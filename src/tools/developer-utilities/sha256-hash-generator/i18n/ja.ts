import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'sha256-hash-generator',
  name: 'SHA-256 ハッシュ生成ツール',
  seoTitle: 'SHA-256 ハッシュ値生成・照合チェックツール',
  description:
    '入力テキストから256ビットのSHA-256ハッシュ値（64文字の16進数）をWebCrypto APIで高速生成し、想定ダイジェストとの一致検証をブラウザ内で完結できます。',
  tagline: '任意のテキストからSHA-256ハッシュをブラウザ上で即生成。',
  citation: {
    problem: 'テキストを外部サーバーへ送信せずにSHA-256ダイジェストを生成・検証したいときに利用できます。',
    nonGoal: '暗号学的ハッシュを復号したり入力内容をAIモデルに送信したりすること。',
  },
  craft: {
    solves:
      'ハッシュは手元の期待値と一致するか比べて初めて意味を持ちますが、64文字の16進文字列を目視比較するのは見落としやすく別アルゴリズムとの混同も起きがちです。',
  },
  knowledge: {
    primaryConcepts: ['SHA-256'],
    realWorldUseCases: [
      'TLS/SSL証明書のフィンガープリントや署名を確認する',
      '配布パッケージやマニフェストファイルの整合性を検証する',
      'BitcoinのトランザクションIDやPoWハッシュを理解する',
      'データの改ざんがないかチェックサムで確認する',
    ],
    commonMistakes: [
      'ソルトやストレッチングなしの生SHA-256でパスワードを保存する',
      '一方向ハッシュ関数を復号可能な暗号化と混同する',
    ],
  },
  faqs: [
    {
      id: 'sha256-faq-1',
      question: 'SHA-256とは何ですか？',
      answer:
        '任意の入力データから常に256ビット（64桁の16進文字）の固定長ハッシュ値を出力するSHA-2ファミリーの暗号学的ハッシュ関数です。現在実用的な衝突攻撃は見つかっておらず標準的に使われています。',
    },
    {
      id: 'sha256-faq-2',
      question: 'SHA-256ハッシュはどのような形式ですか？',
      answer:
        '常に小文字64桁の16進数（`0–9`, `a–f`）です。入力が1文字変わるだけでも出力全体が別物に変化する「雪崩効果」を備えています。',
    },
    {
      id: 'sha256-faq-3',
      question: 'SHA-256から元の文字列を復元（逆算）できますか？',
      answer:
        'できません。一方向関数のためハッシュ値から元の入力を数学的に逆算する手法はありません。',
    },
    {
      id: 'sha256-faq-4',
      question: 'なぜSHA-256は安全だとされているのですか？',
      answer:
        '公開後の20年以上にわたる検証でも全64ラウンドを破る現実的な衝突攻撃・原像攻撃が見つかっておらず、高い衝突耐性を持つためです。',
    },
    {
      id: 'sha256-faq-5',
      question: 'SHA-256をパスワード保存に使っても安全ですか？',
      answer:
        'いいえ。SHA-256はGPUで毎秒数十億回も高速計算できるため総当たり攻撃に弱くなります。パスワード保管にはArgon2・bcrypt・scryptを使用してください。',
    },
    {
      id: 'sha256-faq-6',
      question: 'BitcoinでSHA-256はどう使われていますか？',
      answer:
        'マイニング（Proof of Work）の二重ハッシュや、トランザクションIDおよびマークルツリーの算出にSHA-256が採用されています。',
    },
    {
      id: 'sha256-faq-7',
      question: 'SHA-256とSHA-512の違いは何ですか？',
      answer:
        'どちらもSHA-2ファミリーですが、SHA-256は256ビット（64文字）、SHA-512は512ビット（128文字・64ビット演算・80ラウンド）のダイジェストを出力します。',
    },
    {
      id: 'sha256-faq-8',
      question: 'MD5やSHA-1と比べてSHA-256はどう違いますか？',
      answer:
        'MD5（128ビット）とSHA-1（160ビット）は実用的な衝突攻撃が実証されておりセキュリティ用途は非推奨です。新規実装ではSHA-256以上が基準です。',
    },
    {
      id: 'sha256-faq-9',
      question: 'SHA-2ファミリーとは何ですか？',
      answer:
        'NISTが公表したSHA-224/256/384/512などのハッシュ関数群の総称です。なおSHA-3（Keccak方式）はまったく別設計の系列です。',
    },
    {
      id: 'sha256-faq-10',
      question: 'データをアップロードせずにSHA-256を計算できますか？',
      answer:
        'はい。ブラウザ内蔵のWebCrypto APIによりお使いのタブ内メモリだけで計算されるため、サーバー送信は一切ありません。',
    },
    {
      id: 'sha256-faq-11',
      question: 'SHA-256生成にAIや機械学習は使われていますか？',
      answer:
        'いいえ。FIPS PUB 180-4で定められた決定的なビット演算と圧縮ラウンドのみで動作し、AIは一切使いません。',
    },
  ],
  guide: {
    title: 'SHA-256とは？チェックサム確認方法とパスワード用途の注意点',
    description:
      'Windows/macOS/LinuxでのSHA-256検証手順、MD5/SHA-1からの移行背景、雪崩効果を解説します。',
    readMinutes: 6,
  },
  ui: {
    displayName: 'SHA-256',
    forwardLabel: 'SHA-256 を生成',
    inverseLabel: 'ダイジェスト照合',
    outputLabel: 'SHA-256 ハッシュ（16進）',
    placeholder: 'SHA-256を生成したいUTF-8テキストを入力・貼り付け…',
    outputPlaceholder: '64文字の16進ハッシュがここに表示されます…',
    emptyOutput: 'テキストを入力するとSHA-256ダイジェストを生成します。',
    insight:
      'SHA-256は任意のUTF-8文字列から256ビット（64文字16進）の固定長ハッシュを決定的に生成します。改ざん検知向けであり、パスワード保存にはArgon2等を推奨します。',
    technical: [
      { term: 'アルゴリズム', detail: 'SHA-256 (FIPS 180-4) / WebCrypto SubtleCrypto 実行' },
      { term: '出力サイズ', detail: '256ビット（小文字16進数 64文字固定）' },
      { term: 'プライバシー', detail: '完全ローカル実行・平文テキストの外部送信なし' },
    ],
    compareLabel: '期待するハッシュ値を照合',
    comparePlaceholder: '比較したい64文字のSHA-256ハッシュを貼り付け',
    modeAriaLabel: 'SHA-256モード',
    inputAriaLabel: '入力テキスト',
    outputAriaLabel: '生成されたSHA-256ハッシュ',
    swapLabel: '入出力を入替',
    swapAriaLabel: 'パネルを入れ替える',
    metaAriaLabel: 'ハッシュメタデータ',
    byteAriaLabel: '16進数バイトビューア',
    historyTitle: '生成履歴',
    historyAriaLabel: '最近の入力',
    insightAriaLabel: '技術解説',
    appliedPrefix: '自動修正を適用:',
    checkInputMsg: '入力を確認してください。',
    invalidInputMsg: 'ダイジェストを生成できませんでした。',
    couldNotConvertMsg: 'ハッシュ計算に失敗しました。',
    detectedPrefix: '自動検出:',
    validPrefix: '有効',
    digestPrefix: '一致照合:',
    digestSuffix: '（現在の出力と比較）',
    detectLabels: {
      Base64: 'Base64',
      Text: 'テキスト',
      'Percent-encoded': 'URLエンコード',
      'HTML entities': 'HTMLエンティティ',
      Markup: 'マークアップ',
    },
    engine: {
      bitsTpl: '{bits} ビット',
      metaAlgorithm: 'アルゴリズム',
      metaOutput: '出力長',
      metaHexChars: '16進文字数',
      metaInputBytes: '入力バイト',
      errHash: 'このブラウザではSHA-256を計算できませんでした。',
      digestUnreadable: '形式を判別できません。SHA-256には64文字の16進数が必要です。',
      digestWrongNamedTpl: 'この値はSHA-256（64文字）ではなく {algo}（{len}文字）の形式です。',
      digestWrongLenTpl: '文字数（{len}文字）が一致しません。SHA-256は正確に64文字です。',
      digestMatch: '現在のSHA-256ダイジェストと完全に一致しました。',
      digestMismatch: '一致しません。比較対象のハッシュ値が現在の出力と異なります。',
    },
  },
};
