import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de números romanos",
  "seoTitle": "Conversor de Números Romanos - I até MMMCMXCIX",
  "description": "Converta números para algarismos romanos e vice-versa (1 a 3999). Lê grafias antigas de relógios como IIII e sugere a forma moderna.",
  "tagline": "Números para algarismos romanos e vice-versa, de I a MMMCMXCIX.",
  "lead": "Traduza valores entre 1 e 3999 nos dois sentidos direto no navegador, reconhecendo grafias antigas como IIII ou MDCCCCX.",
  "guide": {
    "title": "Como ler e escrever números romanos sem errar",
    "description": "Os seis pares subtrativos, por que relógios usam IIII, o limite em 3999 e como ler anos nos créditos de filmes."
  },
  "ui": {
    "displayName": "Algarismo romano",
    "forwardLabel": "Para romano →",
    "inverseLabel": "Para número ←",
    "outputLabel": "Resultado",
    "placeholder": "Digite um número (1 a 3999) ou algarismo romano.",
    "modeAriaLabel": "Direção da conversão",
    "inputAriaLabel": "Número ou algarismo romano",
    "outputAriaLabel": "Resultado convertido",
    "outputPlaceholder": "O resultado aparece aqui. Você também pode editar este lado.",
    "swapLabel": "Inverter",
    "swapAriaLabel": "Trocar entrada e saída",
    "insight": [
      "Algarismos romanos somam seus valores do maior para o menor, exceto quando uma letra menor antecede uma maior para subtrair: IV é 4 e VI é 6.",
      "Existem apenas seis pares subtrativos padrão: IV, IX, XL, XC, CD e CM. Formas como IC para 99 nunca foram usadas pelos romanos.",
      "Em texto simples o sistema termina em 3999 (MMMCMXCIX), pois valores maiores exigem um traço horizontal superior multiplicador por mil."
    ],
    "technical": [
      {
        "term": "Intervalo",
        "detail": "1 a 3999 (MMMCMXCIX). Zero e negativos não existem"
      },
      {
        "term": "Letras",
        "detail": "I=1, V=5, X=10, L=50, C=100, D=500, M=1000"
      },
      {
        "term": "Pares subtrativos",
        "detail": "Somente IV, IX, XL, XC, CD e CM"
      },
      {
        "term": "Leitura",
        "detail": "Tolerante: lê IIII ou VIIII e aponta a forma atual"
      },
      {
        "term": "Escrita",
        "detail": "Estrita: sempre gera a grafia subtrativa padrão"
      }
    ],
    "engine": {
      "detNumber": "Número",
      "detRoman": "Algarismo romano",
      "errWhole": "Digite um número inteiro usando apenas dígitos.",
      "errZero": "Roma não tinha algarismo para zero. O menor é I.",
      "errNegative": "Algarismos romanos não possuem sinal negativo.",
      "errOverbarTpl": "{n} exige uma barra superior (vinculum); texto simples vai até {max} (MMMCMXCIX).",
      "errBadRomanTpl": "\"{ch}\" não é uma letra romana válida. Apenas I, V, X, L, C, D e M existem.",
      "warnNonStd": "Legível, mas não segue a grafia padrão moderna.",
      "metaValue": "Valor",
      "metaLetters": "Letras",
      "metaSubtractive": "Pares subtrativos",
      "recCanonicalTpl": "Reescrever como {canonical}, a grafia padrão de {value}"
    }
  },
  "knowledge": {
    "summary": "Converte números e algarismos romanos nos dois sentidos, lê grafias antigas de relógios e oferece a forma moderna em um clique.",
    "useCases": [
      "Ler o ano nos créditos finais de filmes ou frontispícios de livros",
      "Numerar capítulos, séculos, volumes ou anexos de textos",
      "Conferir uma data antes de gravar em alianças ou tatuagens",
      "Identificar a edição de eventos esportivos ou nomes de monarcas"
    ],
    "mistakes": [
      "Escrever IC para 99 em vez do correto XCIX",
      "Copiar IIII do relógio achando que é a grafia canônica moderna",
      "Tentar converter números acima de 3999 em texto comum"
    ]
  },
  "faqs": [
    {
      "id": "roman-faq-1",
      "question": "Que ano é MCMXCIX?",
      "answer": "É 1999: M (1000) + CM (900) + XC (90) + IX (9). Quebrar nos pares subtrativos permite ler qualquer data instantaneamente."
    },
    {
      "id": "roman-faq-2",
      "question": "Por que relógios usam IIII em vez de IV?",
      "answer": "Por equilíbrio visual diante do VIII no lado oposto e praticidade histórica de fundição. O conversor aceita IIII e sugere IV."
    },
    {
      "id": "roman-faq-3",
      "question": "Por que os números romanos param em 3999?",
      "answer": "Porque 4000 exigiria quatro M seguidos ou uma barra superior (vinculum) multiplicadora por mil, inexistente em texto ASCII simples."
    },
    {
      "id": "roman-faq-4",
      "question": "IC é uma forma válida para escrever 99?",
      "answer": "Não. Só é permitido subtrair das duas letras imediatamente superiores: 99 escreve-se sempre XCIX (90 + 9)."
    },
    {
      "id": "roman-faq-5",
      "question": "Por que o aviso diz que meu algarismo não é padrão?",
      "answer": "Porque ele leu uma grafia aditiva histórica como IIII, VIIII ou MDCCCCX e oferece a troca imediata para a versão moderna."
    },
    {
      "id": "roman-faq-6",
      "question": "Existe algarismo romano para zero?",
      "answer": "Não. A numeração romana servia apenas para contagens positivas; na Idade Média usava-se a palavra latina nulla."
    }
  ]
};
