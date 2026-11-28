import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Contador de frequência de palavras",
  "seoTitle": "Frequência de palavras - Contar ocorrências online",
  "description": "Conte quantas vezes cada palavra aparece no texto com porcentagem de densidade e filtro de palavras comuns no navegador.",
  "tagline": "Quantas vezes cada palavra aparece, com porcentagens.",
  "lead": "Meça repetições de palavras instantaneamente no seu dispositivo, ordene por frequência ou ordem alfabética e oculte stopwords.",
  "guide": {
    "title": "Como analisar a frequência de palavras em um texto",
    "description": "Entenda como a contagem e o filtro de palavras comuns funcionam, o que significa densidade de palavra-chave e como evitar repetições."
  },
  "ui": {
    "stats": {
      "uniqueWords": "Palavras únicas",
      "words": "Palavras",
      "sentences": "Frases",
      "averageWordLength": "Tam. médio palavra"
    },
    "emptyMessage": "Cole ou digite um texto para contar a frequência das palavras.",
    "sampleText": "A rápida raposa marrom salta sobre o cão preguiçoso perto da velha fazenda. Uma brisa suave balançava as folhas do alto carvalho enquanto a raposa observava as colinas douradas.",
    "heading": "Frequência de palavras",
    "hideCommon": "Ocultar palavras comuns",
    "ignoreNumbers": "Ignorar números",
    "byFrequency": "Por frequência",
    "alphabetical": "Alfabética",
    "listAria": "Palavras por frequência",
    "noWords": "Nenhuma palavra encontrada.",
    "topWordsTpl": "Mostrando as {limit} principais de {total} palavras distintas."
  },
  "knowledge": {
    "summary": "Conta quantas vezes cada palavra aparece com porcentagem, ordenação alfabética ou por frequência e filtro de palavras comuns.",
    "useCases": [
      "Identificar vícios de linguagem e repetições antes de publicar",
      "Conferir a densidade de palavras-chave em textos de SEO",
      "Analisar o vocabulário predominante em artigos ou estudos",
      "Encontrar termos recorrentes em avaliações e pesquisas"
    ],
    "mistakes": [
      "Comparar contagens brutas em vez de porcentagens em textos de tamanhos diferentes",
      "Manter stopwords ativas e interpretar termos funcionais como tema central"
    ]
  },
  "faqs": [
    {
      "id": "wf-faq-1",
      "question": "O que faz um contador de frequência de palavras?",
      "answer": "Ele conta quantas vezes cada termo único aparece e organiza os resultados por ocorrência ou ordem alfabética, exibindo contagem e participação percentual no texto."
    },
    {
      "id": "wf-faq-2",
      "question": "Como as palavras são separadas? Diferencia maiúsculas?",
      "answer": "A divisão usa espaços, quebras de linha, travessões e vírgulas fora de números, limpando pontuação externa. O cálculo ignora maiúsculas: \"Casa\", \"CASA\" e \"casa\" somam juntas."
    },
    {
      "id": "wf-faq-3",
      "question": "O que o filtro \"Ocultar palavras comuns\" remove?",
      "answer": "Remove palavras funcionais inglesas muito frequentes (\"the\", \"a\", \"of\", \"and\") para destacar os substantivos e termos principais de conteúdo."
    },
    {
      "id": "wf-faq-4",
      "question": "Para que serve a análise de frequência de palavras?",
      "answer": "Redatores corrigem excesso de repetição, profissionais de SEO avaliam densidade de termos e equipes de produto extraem padrões em comentários."
    },
    {
      "id": "wf-faq-5",
      "question": "O que é densidade de palavra-chave e ela aparece aqui?",
      "answer": "É a porcentagem de ocorrência de uma palavra sobre o total, exibida ao lado de cada termo. Em artigos editoriais, valores de 1% a 2% costumam soar naturais."
    },
    {
      "id": "wf-faq-6",
      "question": "Por que o total de palavras únicas varia entre ferramentas?",
      "answer": "Cada analisador trata hífens, apóstrofos e números de forma própria. Aqui preservamos compostos com hífen e números decimais, mantendo o ranking relativo consistente."
    },
    {
      "id": "wf-faq-7",
      "question": "Existe limite de tamanho de texto?",
      "answer": "A contagem processa textos extensos em uma única passagem rápida. A tabela exibe as 50 palavras principais junto com o total distinto para manter a página ágil."
    },
    {
      "id": "wf-faq-8",
      "question": "Meu texto é enviado para algum servidor?",
      "answer": "Não. Toda a análise roda localmente no seu navegador e continua funcionando mesmo offline depois de carregada."
    }
  ]
};
