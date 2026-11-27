import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'url-encoder-decoder',
  name: 'Codificador e Decodificador URL',
  seoTitle: 'Codificar e Decodificar URL (Percent-Encoding) Online',
  description:
    'Codifique ou decodifique parâmetros e trechos de URL (`encodeURIComponent`) no navegador. Entenda %20 vs. + e corrija dupla codificação localmente.',
  tagline: 'Codifique e decodifique componentes de URL com %XX na hora.',
  craft: {
    solves:
      'Dupla codificação, sinal "+" de formulários ou um "%" solto quebram a decodificação e parecem erro da ferramenta em vez do texto de entrada.',
  },
  knowledge: {
    primaryConcepts: ['codificação URL'],
    realWorldUseCases: [
      'Codificar termos de pesquisa em query strings',
      'Enviar e-mails ou redirect_uri OAuth dentro de parâmetros URL',
      'Escapar caminhos de arquivo com espaços ou acentos',
    ],
    commonMistakes: [
      'Codificar a URL inteira em vez de cada valor ou segmento',
      'Codificar duas vezes um valor já tratado (%20 vira %2520)',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: 'O que faz a codificação de URL (percent-encoding)?',
      answer:
        'Substitui caracteres reservados ou inválidos em URLs por `%` seguido de dois dígitos hexadecimais em UTF-8 (`%20` para espaço, `%26` para `&`), garantindo leitura segura pelo servidor.',
    },
    {
      id: 'url-enc-faq-2',
      question: 'Qual a diferença entre %20 e + para espaços?',
      answer:
        '`%20` segue a RFC 3986 para caminhos e queries padrão. `+` vale apenas dentro de formulários `application/x-www-form-urlencoded`; em rotas ou APIs JSON, `+` é tratado literalmente.',
    },
    {
      id: 'url-enc-faq-3',
      question: 'Quando usar encodeURIComponent vs. encodeURI?',
      answer:
        'Use `encodeURIComponent` em cada valor de parâmetro ou segmento que possa conter `&`, `=`, `/` ou `?`. Use `encodeURI` só para manter intacta uma URL completa.',
    },
    {
      id: 'url-enc-faq-4',
      question: 'Quais caracteres precisam ser codificados?',
      answer:
        'Espaços, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, acentos, emojis e qualquer caractere não ASCII; além de `&`, `=`, `/`, `?`, `#` quando fizerem parte de dados.',
    },
    {
      id: 'url-enc-faq-5',
      question: 'O que é codificação dupla e como evitar?',
      answer:
        'É codificar novamente uma string já codificada: `%20` vira `%2520`. Codifique valores brutos apenas uma vez ao montar a URL.',
    },
    {
      id: 'url-enc-faq-6',
      question: 'A codificação vale só para query strings ou também caminhos?',
      answer:
        'Vale para ambos: caminhos (`/minha%20pasta/arquivo.txt`) e parâmetros (`?nome=Joao%20Silva`) precisam escapar espaços e símbolos reservados.',
    },
    {
      id: 'url-enc-faq-7',
      question: 'URL encoding e percent-encoding são a mesma coisa?',
      answer:
        'Sim. Percent-encoding é o termo oficial da RFC 3986; URL encoding ou URL escaping são sinônimos comuns no dia a dia.',
    },
    {
      id: 'url-enc-faq-8',
      question: 'O que acontece se eu esquecer de codificar um parâmetro?',
      answer:
        'Um `&` quebra o parâmetro em dois, um `?` inicia nova query e um `#` transforma o restante em âncora que nem chega ao servidor.',
    },
    {
      id: 'url-enc-faq-9',
      question: 'Como esta ferramenta faz a conversão?',
      answer:
        'Executa `encodeURIComponent` e `decodeURIComponent` sobre UTF-8 diretamente no navegador.',
    },
  ],
  guide: {
    title: 'O que é codificação URL: %20 vs. + e dupla codificação',
    description:
      'Como funciona percent-encoding pela RFC 3986, diferença entre encodeURI e encodeURIComponent e como evitar %2520.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'Codificar → URL',
    inverseLabel: 'Decodificar ← URL',
    outputLabel: 'Saída',
    placeholder: 'Digite ou cole texto ou string %XX aqui…',
    outputPlaceholder: 'O resultado aparecerá aqui…',
    emptyOutput: 'Digite texto ou uma URL codificada para começar.',
    insight:
      'Percent-encoding troca caracteres reservados ou não ASCII por %XX em UTF-8 (`encodeURIComponent`), impedindo que &, = ou ? quebrem a URL.',
    technical: [
      { term: 'Método', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: 'Espaços', detail: '%20 em URIs padrão; + em formulários x-www-form-urlencoded' },
      { term: 'Privacidade', detail: 'Processamento 100% local no navegador sem envio de URLs' },
    ],
    compareLabel: 'Comparar',
    comparePlaceholder: 'Valor esperado opcional',
    modeAriaLabel: 'Modo de conversão',
    inputAriaLabel: 'Entrada',
    outputAriaLabel: 'Resultado convertido',
    swapLabel: 'Inverter',
    swapAriaLabel: 'Trocar entrada e saída',
    metaAriaLabel: 'Metadados',
    byteAriaLabel: 'Visualizador hexadecimal',
    historyTitle: 'Histórico recente',
    historyAriaLabel: 'Entradas recentes',
    insightAriaLabel: 'Explicação técnica',
    appliedPrefix: 'Correção aplicada:',
    checkInputMsg: 'Confira a entrada: contém sequência % malformada.',
    invalidInputMsg: 'Entrada percent-encoded inválida.',
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
      errDecode: 'Não foi possível decodificar a string URL.',
      errEncode: 'Não foi possível codificar o componente URL.',
      errInvalidPctTpl: 'Sequência % inválida ou incompleta na posição {pos}.',
      recDouble: 'Possível codificação dupla (%25XX): decodificar mais um nível',
      recStrayPct: 'Escapar sinais % avulsos como %25 antes de decodificar',
      recPlus: 'Trocar + por espaços (formato x-www-form-urlencoded)',
      metaEscapes: 'Sequências %XX',
      escCountTpl: '{n} sequências',
      metaInputLen: 'Comp. entrada',
      metaOutputBytes: 'Bytes saída',
    },
  },
};
