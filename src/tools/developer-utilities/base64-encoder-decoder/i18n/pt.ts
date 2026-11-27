import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'base64-encoder-decoder',
  name: 'Codificador e Decodificador Base64',
  seoTitle: 'Codificar e Decodificar Base64 Online Grátis',
  description:
    'Converta texto UTF-8 para Base64 e decodifique Base64 ou Base64URL no navegador com detecção automática e correção de padding sem enviar dados.',
  tagline: 'Codifique e decodifique Base64 e texto na hora.',
  craft: {
    solves:
      'Prefixos Data URI, strings Base64URL sem preenchimento ou espaços copiados quebram a decodificação e parecem erro da ferramenta.',
  },
  knowledge: {
    primaryConcepts: ['Base64'],
    realWorldUseCases: [
      'Incorporar imagens pequenas como Data URI em HTML ou CSS',
      'Transportar dados binários dentro de payloads JSON',
      'Inspecionar cabeçalho e payload de um token JWT',
      'Codificar anexos para protocolos baseados em texto como SMTP',
    ],
    commonMistakes: [
      'Tratar Base64 como forma de criptografia ou sigilo',
      'Esquecer que Base64 aumenta o tamanho em cerca de 33%',
    ],
  },
  faqs: [
    {
      id: 'b64-faq-1',
      question: 'O que é Base64?',
      answer:
        'É um esquema de codificação binário-para-texto que converte bytes arbitrários em 64 caracteres ASCII imprimíveis (`A–Z`, `a–z`, `0–9`, `+`, `/`) e `=` para trafegar em canais de texto.',
    },
    {
      id: 'b64-faq-2',
      question: 'Como codificar texto para Base64?',
      answer:
        'Cole ou digite seu texto na entrada e escolha "Codificar → Base64". A saída UTF-8 aparece na hora pronta para copiar.',
    },
    {
      id: 'b64-faq-3',
      question: 'Como decodificar Base64 de volta para texto?',
      answer:
        'Cole a string Base64 na entrada e selecione "Decodificar ← Base64". Se houver Data URI ou Base64URL, a ferramenta sugere o ajuste em um clique.',
    },
    {
      id: 'b64-faq-4',
      question: 'Base64 é um tipo de criptografia?',
      answer:
        'Não. Base64 é codificação reversível sem chave secreta: qualquer pessoa pode decodificar instantaneamente. Para sigilo use criptografia real como AES ou TLS.',
    },
    {
      id: 'b64-faq-5',
      question: 'Dados em Base64 são seguros?',
      answer:
        'Não oferece proteção nem confidencialidade alguma. Use apenas para compatibilidade no transporte de dados.',
    },
    {
      id: 'b64-faq-6',
      question: 'Por que o Base64 às vezes termina com "=" ou "=="?',
      answer:
        'Base64 processa blocos de 3 bytes. Quando o total não é múltiplo de 3, adiciona-se um ou dois `=` ao final para fechar o último bloco de 4 caracteres.',
    },
    {
      id: 'b64-faq-7',
      question: 'O que é Base64URL e qual a diferença para o Base64 padrão?',
      answer:
        'Base64URL troca `+` por `-` e `/` por `_` (e costuma omitir `=`) para evitar conflitos em URLs, arquivos e tokens JWT.',
    },
    {
      id: 'b64-faq-8',
      question: 'Base64 pode codificar imagens ou arquivos binários?',
      answer:
        'Sim, como Data URIs (`data:image/png;base64,...`) em páginas HTML/CSS. Aqui o foco é conversão rápida de texto e strings UTF-8.',
    },
    {
      id: 'b64-faq-9',
      question: 'Por que a saída Base64 fica maior que o original?',
      answer:
        'Cada 3 bytes de entrada geram 4 caracteres ASCII na saída, aumentando o volume em cerca de 33%.',
    },
  ],
  guide: {
    title: 'O que é Base64, padding "=" e diferença para Base64URL',
    description:
      'Como blocos de 3 bytes viram 4 caracteres ASCII, motivo da expansão de 33% e por que não protege dados.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'Base64',
    forwardLabel: 'Codificar → Base64',
    inverseLabel: 'Decodificar ← Base64',
    outputLabel: 'Saída',
    placeholder: 'Digite ou cole texto ou Base64 aqui…',
    outputPlaceholder: 'O resultado aparecerá aqui…',
    emptyOutput: 'Digite texto ou Base64 para começar.',
    insight:
      'Base64 representa bytes usando 64 caracteres ASCII seguros (~33% maior). É codificação reversível de transporte, nunca criptografia.',
    technical: [
      { term: 'Codificação', detail: 'Bytes UTF-8 convertidos para alfabeto RFC 4648 (A-Z, a-z, 0-9, +, /)' },
      { term: 'Expansão', detail: '4 caracteres por grupo de 3 bytes (~33% extra mais preenchimento =)' },
      { term: 'Privacidade', detail: 'Execução 100% local no navegador sem envio a servidores' },
    ],
    compareLabel: 'Comparar',
    comparePlaceholder: 'Valor esperado opcional',
    modeAriaLabel: 'Modo de conversão',
    inputAriaLabel: 'Entrada',
    outputAriaLabel: 'Resultado convertido',
    swapLabel: 'Inverter',
    swapAriaLabel: 'Trocar entrada e saída',
    metaAriaLabel: 'Metadados da conversão',
    byteAriaLabel: 'Visualizador hexadecimal de bytes',
    historyTitle: 'Histórico recente',
    historyAriaLabel: 'Entradas recentes',
    insightAriaLabel: 'Explicação técnica',
    appliedPrefix: 'Correção aplicada:',
    checkInputMsg: 'Verifique a entrada: caracteres inválidos para decodificação.',
    invalidInputMsg: 'Entrada Base64 inválida.',
    couldNotConvertMsg: 'Não foi possível converter a entrada.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificado URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcação',
    },
    engine: {
      errDecode: 'Não foi possível decodificar como Base64 válido.',
      errEncode: 'Não foi possível codificar em Base64.',
      errBadCharTpl: 'Caractere Base64 inválido "{ch}" na posição {pos}.',
      errBadPadTpl: 'Preenchimento = inesperado na posição {pos}; só é válido no final.',
      warnLen: 'O comprimento sem preenchimento não é múltiplo de 4; pode faltar = no final.',
      recDataUri: 'Remover prefixo Data URI (data:...;base64,)',
      recBase64Url: 'Converter Base64URL (- / _) para Base64 padrão',
      recPadding: 'Adicionar preenchimento (=) faltante no final',
      metaInputBytes: 'Bytes entrada',
      metaB64Length: 'Comp. Base64',
      metaExpansion: 'Expansão',
    },
  },
};
