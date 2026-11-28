import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Inverter texto",
  "seoTitle": "Inverter texto - Virar texto ao contrário online",
  "description": "Inverta textos ou strings caractere por caractere online, grátis e com total privacidade no seu navegador.",
  "tagline": "Inverta uma string caractere por caractere no seu dispositivo.",
  "lead": "Cole ou digite qualquer texto para inverter a ordem de todos os caracteres localmente, preservando acentos e emojis.",
  "guide": {
    "title": "Como inverter texto caractere por caractere",
    "description": "Entenda como funciona a inversão de texto, para que serve escrever ao contrário e como lidar com quebras de linha e emojis."
  },
  "ui": {
    "placeholder": "Cole ou digite texto aqui",
    "outputPlaceholder": "O texto invertido aparece aqui",
    "sampleText": "Socorram-me subi no ônibus em Marrocos",
    "handoff": {
      "msgTpl": "Contém {n} quebra(s) de linha; inverter o bloco inteiro também inverte a ordem das linhas."
    }
  },
  "knowledge": {
    "summary": "Inverte o texto de trás para a frente caractere por caractere, mantendo acentos e emojis compostos intactos.",
    "useCases": [
      "Criar textos invertidos para enigmas, jogos e desafios",
      "Testar rapidamente se uma frase ou palavra é um palíndromo",
      "Fazer legendas com efeito espelhado para redes sociais",
      "Inspecionar uma string a partir do final"
    ],
    "mistakes": [
      "Esperar que apenas a ordem das palavras mude e não cada caractere",
      "Esquecer que quebras de linha também mudam de posição em blocos grandes"
    ]
  },
  "faqs": [
    {
      "id": "reverse-text-faq-1",
      "question": "O que exatamente faz inverter o texto?",
      "answer": "Inverte a posição de cada caractere para que o último venha primeiro e o primeiro fique por último. \"casa\" vira \"asac\". Os caracteres permanecem os mesmos, apenas a ordem muda."
    },
    {
      "id": "reverse-text-faq-2",
      "question": "Inverter texto também muda as quebras de linha?",
      "answer": "Sim. Como todo o conteúdo é tratado como uma sequência única, as quebras de linha acompanham a inversão e a última linha passa para o topo. Para inverter mantendo cada linha no lugar, processe uma linha por vez."
    },
    {
      "id": "reverse-text-faq-3",
      "question": "A ferramenta preserva emojis e letras acentuadas?",
      "answer": "Sim. A inversão divide por grafemas completos em vez de unidades internas soltas, garantindo que emojis compostos e sinais diacríticos continuem inteiros."
    },
    {
      "id": "reverse-text-faq-5",
      "question": "Para que serve o texto ao contrário?",
      "answer": "É usado em jogos de palavras, testes de palíndromos, gabaritos disfarçados em questionários e legendas espelhadas em redes sociais."
    },
    {
      "id": "reverse-text-faq-6",
      "question": "Como virar uma string ao contrário?",
      "answer": "Basta colar ou digitar o texto na caixa de entrada e o resultado invertido aparece instantaneamente, pronto para copiar."
    },
    {
      "id": "reverse-text-faq-7",
      "question": "Como inverter uma palavra para um enigma?",
      "answer": "Digite apenas a palavra desejada e copie o resultado invertido, como \"amor\" para \"roma\", mantendo o desafio leve para quem lê."
    },
    {
      "id": "reverse-text-faq-4",
      "question": "Meu texto é enviado para algum servidor?",
      "answer": "Não. Toda a inversão acontece localmente no seu navegador e nada é enviado pela rede."
    }
  ]
};
