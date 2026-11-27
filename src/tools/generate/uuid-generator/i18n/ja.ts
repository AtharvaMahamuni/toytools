import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'uuid-generator',
  name: 'UUID生成ツール',
  seoTitle: 'UUID v4 (GUID) オンライン一括生成ツール',
  description:
    'ランダムなUUIDバージョン4（GUID）をブラウザ上で1〜100件まで即生成。ハイフン有無や大文字・小文字を切り替え、ワンクリックでコピーできます。',
  tagline: 'ランダムなUUIDバージョン4を1件から一括まで即座に生成。',
  craft: {
    solves:
      'UUID v4には4ビットのバージョン識別子と2ビットのRFC 4122バリアント識別子が含まれ、時系列のv7やnil UUIDと明確に区別されます。',
  },
  knowledge: {
    primaryConcepts: ['UUID生成', '一意な識別子'],
    realWorldUseCases: [
      'データベースの新しいレコードに主キーを割り当てる',
      'ファイルやオブジェクトを重複リスクなしで命名する',
      'マイクロサービス間のログをリクエストIDで追跡する',
      'オフラインで作成したデータに安定したIDを付与する',
    ],
    commonMistakes: [
      'UUIDを推測不能な暗号学的シークレットとして扱う',
      'UUIDをパスワードやセッショントークンの代わりに使う',
      'ネイティブUUID型があるのに文字列型のまま保存する',
      'UUID v4が生成日時順に並ぶと想定する',
    ],
  },
  fields: {
    count: { label: '生成数' },
    version: { label: 'バージョン', options: { v4: 'v4（ランダム）' } },
    hyphens: { label: 'ハイフンを含める', group: 'フォーマット' },
    uppercase: { label: '大文字にする', group: 'フォーマット' },
  },
  faqs: [
    {
      id: 'uuid-generator-faq-1',
      question: 'UUIDとは何ですか？',
      answer:
        'UUID（Universally Unique Identifier）は `f47ac10b-58cc-4372-a567-0e02b2c3d479` のような36文字（128ビット）の識別子で、中央管理なしで重複しないIDを独立に生成できます。',
    },
    {
      id: 'uuid-generator-faq-2',
      question: 'UUIDとGUIDは同じものですか？',
      answer:
        'はい。UUIDは一般的な規格名、GUID（Globally Unique Identifier）は主にMicrosoft環境で使われる呼び名で、実体は同じ128ビット形式です。',
    },
    {
      id: 'uuid-generator-faq-3',
      question: 'どのバージョンのUUIDが生成されますか？',
      answer:
        'RFC 4122準拠のランダム型「バージョン4」を生成します。時刻やMACアドレスを含まないため情報漏洩の心配がない標準形式です。',
    },
    {
      id: 'uuid-generator-faq-4',
      question: 'このUUID生成ツールの使い方は？',
      answer:
        '生成数とハイフン有無・大文字設定を選ぶだけで即座に出力されます。「コピー」で全行まとめて取得でき、「再生成」で新しいIDを作成できます。',
    },
    {
      id: 'uuid-generator-faq-5',
      question: 'UUID v4の見た目の規則は？',
      answer:
        '8-4-4-4-12桁の16進数で構成され、13文字目は必ずバージョンを表す `4`、17文字目はバリアントを表す `8`・`9`・`a`・`b` のいずれかになります。',
    },
    {
      id: 'uuid-generator-faq-6',
      question: 'UUIDが他の値と絶対に重複しない保証はありますか？',
      answer:
        '完全な数学的保証ではありませんが、122ビットの乱数（5×10の36乗通り以上）を持つため実用上は完全に一意とみなせます。',
    },
    {
      id: 'uuid-generator-faq-7',
      question: 'この生成ツールは安全でプライバシーが守られますか？',
      answer:
        'はい。ブラウザ標準の暗号学的乱数API（Web Crypto API）を使い、端末内のみで生成するためサーバー通信や記録は一切ありません。',
    },
    {
      id: 'uuid-generator-faq-8',
      question: 'オフラインでも使えますか？',
      answer:
        'はい。ページ読み込み後はローカルのJavaScriptだけで完結するため、インターネット未接続でも動作します。',
    },
    {
      id: 'uuid-generator-faq-9',
      question: '一度に複数のUUIDを作れますか？',
      answer:
        '最大100件まで1行に1つずつ一括生成できます。テストデータやDBシード作成に便利です。',
    },
    {
      id: 'uuid-generator-faq-10',
      question: '生成したUUIDをすべてコピーするには？',
      answer:
        '「コピー」ボタンを押すと、表示されている全件が改行付きのままクリップボードにコピーされます。',
    },
    {
      id: 'uuid-generator-faq-11',
      question: 'ハイフンなしの32文字にできますか？',
      answer:
        'はい。「ハイフンを含める」をオフにすると32文字の16進文字列になります。表す128ビット値自体は同一です。',
    },
    {
      id: 'uuid-generator-faq-12',
      question: '大文字（A-F）で出力できますか？',
      answer:
        'はい。「大文字にする」をオンにすればA〜Fで表記されます。UUIDは仕様上大文字と小文字を区別しません。',
    },
    {
      id: 'uuid-generator-faq-13',
      question: '通常の連番IDではなくUUIDを使うべき場面は？',
      answer:
        '複数のマイクロサービス、クライアント端末、オフライン環境などで中央サーバーに問い合わせずIDを発番したいときに最適です。',
    },
    {
      id: 'uuid-generator-faq-14',
      question: 'UUID v4とv1の違いは何ですか？',
      answer:
        'v1は時刻とネットワークアドレスから作るため発生元や日時が分かります。v4はほぼ完全な乱数のためより安全で一般的です。',
    },
    {
      id: 'uuid-generator-faq-15',
      question: 'UUIDをパスワードやセキュリティトークンに使えますか？',
      answer:
        '推奨されません。固定ビットや既知形式がありURLやログに露出しやすいため、秘密鍵用途にはパスワード生成ツールをお使いください。',
    },
    {
      id: 'uuid-generator-faq-16',
      question: 'UUID v4は作成した順番に並びますか？',
      answer:
        '並びません。ランダム値のため順序性は持たず、作成順が必要な場合はタイムスタンプ列を別で持たせる必要があります。',
    },
    {
      id: 'uuid-generator-faq-17',
      question: 'UUIDは推測不可能な秘密値になりますか？',
      answer:
        '総当たりでは推測しにくいものの、公開URLやログに残る識別子として設計されているためアクセス権の代わりにはしないでください。',
    },
    {
      id: 'uuid-generator-faq-18',
      question: 'データベースにはどう保存するのがよいですか？',
      answer:
        'PostgreSQLなどのネイティブ `UUID` 型があれば16バイトで保存・検証できるため、36文字の文字列型より省スペースで高速です。',
    },
    {
      id: 'uuid-generator-faq-19',
      question: 'データベースにUUIDが拒否された理由は？',
      answer:
        '多くの場合、ネイティブUUID型がハイフンありを要求しているのにハイフンを削除したか、文字列側で大文字小文字の制約があるためです。',
    },
    {
      id: 'uuid-generator-faq-20',
      question: '対応しているブラウザは？',
      answer:
        'Chrome、Firefox、Safari、EdgeなどWeb Crypto APIに対応したすべての最新ブラウザで動作します。',
    },
    {
      id: 'uuid-generator-faq-21',
      question: '生成したUUIDが保存されることはありますか？',
      answer:
        'いいえ。件数やハイフン有無などの設定のみローカルに保持され、生成結果自体は一切保存されません。',
    },
    {
      id: 'uuid-generator-faq-22',
      question: 'データが外部へ送信・共有されることはありますか？',
      answer:
        'ありません。サーバー呼び出しやトラッキングなしで完全にブラウザ内で完結します。',
    },
  ],
  guide: {
    title: 'UUID v4とは？構造・使い方とDB設計のポイント',
    description:
      'RFC 4122準拠の8-4-4-4-12構造、UUID v4とv1の違い、16バイトネイティブ保存とセキュリティ上の注意点を解説します。',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'オプションを指定してUUIDを生成してください。',
    engine: {
      metaVersion: 'バージョン',
      versionV4: 'v4（ランダム）',
      metaCount: '生成数',
    },
  },
};
