import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'sha256-hash-generator',
  name: 'Gerador de Hash SHA-256',
  seoTitle: 'Gerador de Hash SHA-256 Online – Verificar Checksum',
  description:
    'Gere resumos criptográficos SHA-256 (64 caracteres hexadecimais) e compare digests esperados direto no navegador com WebCrypto, sem enviar dados.',
  tagline: 'Gere hash SHA-256 de qualquer texto instantaneamente.',
  citation: {
    problem: 'Use esta ferramenta SHA-256 quando precisar calcular ou conferir o digest de um texto sem enviá-lo à rede.',
    nonGoal: 'reverter um hash criptográfico ou enviar sua entrada para modelos de IA.',
  },
  craft: {
    solves:
      'Um hash só tem valor quando comparado ao esperado, mas conferir 64 dígitos hexadecimais a olho nu gera erros ou confunde algoritmos.',
  },
  knowledge: {
    primaryConcepts: ['SHA-256'],
    realWorldUseCases: [
      'Verificar assinaturas e impressões digitais de certificados TLS/SSL',
      'Assinar pacotes de software e manifestos de entrega',
      'Calcular identificadores de transação e prova de trabalho no Bitcoin',
      'Validar integridade de dados contra adulterações',
    ],
    commonMistakes: [
      'Usar SHA-256 puro para guardar senhas sem salt ou função lenta',
      'Confundir hashing unidirecional com criptografia reversível',
    ],
  },
  faqs: [
    {
      id: 'sha256-faq-1',
      question: 'O que é SHA-256?',
      answer:
        'É uma função hash criptográfica da família SHA-2 que sempre gera um resumo de 256 bits exibido em 64 caracteres hexadecimais, sem ataques práticos de colisão conhecidos.',
    },
    {
      id: 'sha256-faq-2',
      question: 'Qual a aparência de um hash SHA-256?',
      answer:
        'Sempre 64 dígitos hexadecimais minúsculos (`0–9`, `a–f`). Alterar um único caractere da entrada muda todo o hash por efeito avalanche.',
    },
    {
      id: 'sha256-faq-3',
      question: 'É possível reverter um hash SHA-256?',
      answer:
        'Não. Trata-se de uma função unidirecional: não existe operação matemática inversa para recuperar o texto original pelo digest.',
    },
    {
      id: 'sha256-faq-4',
      question: 'Por que o SHA-256 é considerado seguro?',
      answer:
        'Após mais de duas décadas de auditoria pública, não existem ataques viáveis contra suas 64 rodadas completas.',
    },
    {
      id: 'sha256-faq-5',
      question: 'SHA-256 é seguro para armazenar senhas?',
      answer:
        'Não, porque executa bilhões de cálculos por segundo em GPUs. Para senhas utilize algoritmos lentos com salt como Argon2, bcrypt ou scrypt.',
    },
    {
      id: 'sha256-faq-6',
      question: 'Como o SHA-256 é usado no Bitcoin?',
      answer:
        'Na mineração Proof-of-Work (`SHA-256(SHA-256(cabeçalho))`) e no cálculo de IDs de transação e árvores de Merkle.',
    },
    {
      id: 'sha256-faq-7',
      question: 'Qual a diferença entre SHA-256 e SHA-512?',
      answer:
        'Ambos integram o SHA-2: SHA-256 entrega 256 bits (64 caracteres hex, 64 rodadas) enquanto SHA-512 entrega 512 bits (128 hex, 80 rodadas de 64 bits).',
    },
    {
      id: 'sha256-faq-8',
      question: 'Como SHA-256 se compara a MD5 e SHA-1?',
      answer:
        'MD5 (128 bits) e SHA-1 (160 bits) sofrem colisões práticas e não devem mais proteger segurança. SHA-256 é a referência padrão atual.',
    },
    {
      id: 'sha256-faq-9',
      question: 'O que é a família SHA-2?',
      answer:
        'Conjunto padronizado pelo NIST (SHA-224, SHA-256, SHA-384, SHA-512) baseado na construção Merkle–Damgård, distinta do SHA-3 (Keccak).',
    },
    {
      id: 'sha256-faq-10',
      question: 'Posso calcular hashes SHA-256 sem enviar o texto?',
      answer:
        'Sim. O resumo é calculado exclusivamente na memória da aba do navegador usando a API WebCrypto nativa.',
    },
    {
      id: 'sha256-faq-11',
      question: 'Gerar SHA-256 utiliza inteligência artificial?',
      answer:
        'Não. Opera apenas com operações lógicas e somas modulares determinísticas definidas na norma FIPS PUB 180-4.',
    },
  ],
  guide: {
    title: 'O que é SHA-256: checksums, segurança e comparação',
    description:
      'Como conferir checksums SHA-256 no Windows, macOS e Linux, efeito avalanche e por que evitar SHA-256 puro em senhas.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'SHA-256',
    forwardLabel: 'Gerar SHA-256',
    inverseLabel: 'Verificar digest',
    outputLabel: 'Digest SHA-256 (hex)',
    placeholder: 'Digite ou cole texto UTF-8 para gerar hash SHA-256…',
    outputPlaceholder: 'O hash de 64 caracteres hex aparecerá aqui…',
    emptyOutput: 'Digite qualquer texto para gerar seu digest SHA-256.',
    insight:
      'SHA-256 transforma qualquer entrada UTF-8 em uma impressão fixa de 256 bits (64 hex). Determinístico e irreversível; para senhas prefira Argon2 ou bcrypt.',
    technical: [
      { term: 'Algoritmo', detail: 'SHA-256 (FIPS 180-4) executado via WebCrypto SubtleCrypto' },
      { term: 'Formato', detail: '256 bits representados como 64 dígitos hex minúsculos' },
      { term: 'Privacidade', detail: 'Cálculo local no seu navegador sem enviar dados' },
    ],
    compareLabel: 'Comparar hash esperado',
    comparePlaceholder: 'Cole um SHA-256 de 64 caracteres para conferir',
    modeAriaLabel: 'Modo SHA-256',
    inputAriaLabel: 'Texto de entrada',
    outputAriaLabel: 'Hash SHA-256 gerado',
    swapLabel: 'Inverter',
    swapAriaLabel: 'Trocar painéis',
    metaAriaLabel: 'Metadados do hash',
    byteAriaLabel: 'Visualizador hexadecimal',
    historyTitle: 'Histórico recente',
    historyAriaLabel: 'Entradas recentes',
    insightAriaLabel: 'Explicação técnica',
    appliedPrefix: 'Correção aplicada:',
    checkInputMsg: 'Verifique sua entrada.',
    invalidInputMsg: 'Não foi possível gerar o digest.',
    couldNotConvertMsg: 'Erro ao calcular o hash.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: 'Verificação:',
    digestSuffix: 'contra a saída atual.',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificado URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcação',
    },
    engine: {
      bitsTpl: '{bits} bits',
      metaAlgorithm: 'Algoritmo',
      metaOutput: 'Saída',
      metaHexChars: 'Caract. hex',
      metaInputBytes: 'Bytes entrada',
      errHash: 'Não foi possível calcular SHA-256 neste navegador.',
      digestUnreadable: 'Formato irreconhecível: SHA-256 exige 64 dígitos hexadecimais.',
      digestWrongNamedTpl: 'Esse valor parece {algo} ({len} caracteres), não SHA-256 (64 caracteres).',
      digestWrongLenTpl: 'Comprimento inválido ({len} hex); SHA-256 possui exatamente 64.',
      digestMatch: 'Corresponde exatamente ao digest SHA-256 gerado.',
      digestMismatch: 'Não confere: o valor comparado difere do digest SHA-256 atual.',
    },
  },
};
