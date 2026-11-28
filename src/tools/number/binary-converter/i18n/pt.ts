import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor binário",
  "seoTitle": "Conversor Binário - Decimal para Binário Online",
  "description": "Converta decimais para base 2 e binário para decimal com precisão até 512 bits via BigInt, exibindo hex, octal e total de bits.",
  "tagline": "Decimal para binário e vice-versa, com hex e octal juntos.",
  "lead": "Converta inteiros de até 512 bits entre base 10 e base 2 sem arredondamentos direto no navegador, limpando prefixos 0b.",
  "guide": {
    "title": "Decimal, binário, hex e largura em bits",
    "description": "Como funciona o valor posicional na base 2, por que um dígito hex vale quatro bits e a diferença para texto em binário."
  },
  "ui": {
    "displayName": "Binário",
    "forwardLabel": "Para binário →",
    "inverseLabel": "Para decimal ←",
    "outputLabel": "Resultado",
    "placeholder": "Digite um decimal ou cole dígitos binários.",
    "modeAriaLabel": "Direção da conversão",
    "inputAriaLabel": "Número decimal ou binário",
    "outputAriaLabel": "Resultado convertido",
    "outputPlaceholder": "O resultado aparece aqui. Você também pode editar este lado.",
    "swapLabel": "Inverter",
    "swapAriaLabel": "Trocar entrada e saída",
    "insight": [
      "O binário conta apenas com 0 e 1: cada casa vale o dobro da casa à direita, então 1011 equivale a 8 + 2 + 1 = 11.",
      "Hexadecimal acompanha o binário por ser sua abreviação natural: cada dígito hex equivale a exatos quatro bits (0xFF = 1111 1111).",
      "A largura em bits determina quantos zeros à esquerda completam um byte ou registrador."
    ],
    "technical": [
      {
        "term": "Alcance",
        "detail": "Exato até 512 bits com BigInt (sem arredondar além de 2^53)"
      },
      {
        "term": "Aceita",
        "detail": "Prefixo 0b, espaços, underscores, vírgulas e apóstrofos"
      },
      {
        "term": "Negativos",
        "detail": "Sinal e magnitude (-1011), sem complemento de dois"
      },
      {
        "term": "Extras",
        "detail": "Hexadecimal, octal, contagem de bits e bytes"
      },
      {
        "term": "Diferença",
        "detail": "Não codifica texto; para caracteres use texto para binário"
      }
    ],
    "engine": {
      "detBinary": "Binário",
      "detNumber": "Número",
      "errEnterNumber": "Digite um número.",
      "errBadBinTpl": "\"{ch}\" não é um dígito binário. Binário usa apenas 0 e 1.",
      "errWhole": "Digite um número inteiro apenas com dígitos.",
      "errMaxBitsTpl": "Isso tem {bits} bits. O limite aqui é {max} bits.",
      "metaHex": "Hex",
      "metaOctal": "Octal",
      "metaBits": "Bits",
      "metaBytes": "Bytes",
      "recUseTpl": "Usar {cleaned}"
    }
  },
  "knowledge": {
    "summary": "Converte números decimais e binários com exatidão até 512 bits, exibindo hex, octal e contagem de bits lado a lado.",
    "useCases": [
      "Ler máscaras de permissões ou flags em arquivos de configuração",
      "Conferir registradores de hardware com valores no código",
      "Descobrir quais bits mudaram entre dois valores durante depuração",
      "Demonstrar valor posicional na base 2 visualizando deslocamentos"
    ],
    "mistakes": [
      "Descartar zeros à esquerda e desalinhar fronteiras de bytes",
      "Confundir conversão numérica com codificação de texto UTF-8 em binário",
      "Usar ponto flutuante que arredonda inteiros acima de 2^53"
    ]
  },
  "faqs": [
    {
      "id": "binconv-faq-1",
      "question": "Como converto um número decimal para binário?",
      "answer": "Divida por 2 sucessivamente anotando os restos e leia de baixo para cima. Para 11: os restos 1, 1, 0, 1 formam 1011."
    },
    {
      "id": "binconv-faq-2",
      "question": "Qual é a diferença entre números binários e texto binário?",
      "answer": "Aqui o número 65 vira 1000001; já no texto binário, a letra \"A\" ocupa o código 65 em um byte de 8 bits (01000001)."
    },
    {
      "id": "binconv-faq-3",
      "question": "Por que o hexadecimal é usado no lugar do binário?",
      "answer": "Porque um dígito hexadecimal representa exatos 4 bits: valores de 32 bits cabem em 8 dígitos hex fáceis de ler."
    },
    {
      "id": "binconv-faq-4",
      "question": "Para que serve a contagem de bits e os zeros à esquerda?",
      "answer": "O valor 65 tem 7 bits naturais (1000001), mas em 1 byte vira 01000001. Saber a largura ajuda a preencher zeros conforme o contexto."
    },
    {
      "id": "binconv-faq-5",
      "question": "Funciona se meu binário tiver prefixo 0b ou espaços?",
      "answer": "Sim. A ferramenta detecta 0b, espaços e underscores e oferece a limpeza em um toque."
    },
    {
      "id": "binconv-faq-6",
      "question": "É exato para números muito grandes?",
      "answer": "Sim, até 512 bits com inteiros BigInt sem arredondamento após 2^53."
    }
  ]
};
