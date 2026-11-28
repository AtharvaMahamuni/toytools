import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Remover linhas duplicadas",
  "seoTitle": "Remover linhas duplicadas - Desduplicar texto online",
  "description": "Remova linhas repetidas mantendo a primeira ocorrência e a ordem original da lista no navegador, grátis e com privacidade.",
  "tagline": "Remova linhas repetidas mantendo a primeira de cada.",
  "lead": "Limpe listas de e-mails, URLs ou logs apagando duplicatas exatas instantaneamente no seu dispositivo sem bagunçar a ordem.",
  "guide": {
    "title": "Como remover linhas duplicadas de um texto",
    "description": "Entenda o critério da primeira ocorrência, como maiúsculas e espaços afetam a comparação e como higienizar listas antes de importar."
  },
  "ui": {
    "placeholder": "Cole sua lista com um item por linha",
    "outputPlaceholder": "As linhas únicas aparecerão aqui",
    "sampleText": "maçã\nbanana\nmaçã\nlaranja\nbanana",
    "handoff": {
      "trimTpl": "{n} linha(s) diferem apenas por espaços nas pontas.",
      "lowerTpl": "{n} linha(s) diferem apenas por maiúsculas e minúsculas.",
      "siblings": {
        "trim-text": "Aparar bordas",
        "lowercase-converter": "Converter para minúsculas"
      }
    }
  },
  "knowledge": {
    "summary": "Mantém apenas a primeira ocorrência de cada linha para limpar listas, registros e exportações mantendo a ordem original.",
    "useCases": [
      "Remover e-mails repetidos de uma lista de inscritos",
      "Extrair URLs ou códigos únicos de uma planilha",
      "Limpar entradas repetidas em logs de servidor",
      "Montar uma lista limpa de palavras-chave"
    ],
    "mistakes": [
      "Esquecer de aparar espaços no fim das linhas antes de desduplicar",
      "Não considerar que maiúsculas e minúsculas são tratadas como diferentes"
    ]
  },
  "faqs": [
    {
      "id": "rdl-faq-1",
      "question": "Como as linhas duplicadas são detectadas?",
      "answer": "Duas linhas são duplicadas quando coincidem exatamente caractere por caractere. A primeira ocorrência é mantida e todas as repetições posteriores são removidas na ordem original."
    },
    {
      "id": "rdl-faq-2",
      "question": "Só remove linhas repetidas quando estão lado a lado?",
      "answer": "Não. Duplicatas são removidas ao longo de todo o texto, mesmo que estejam separadas por centenas de linhas."
    },
    {
      "id": "rdl-faq-3",
      "question": "A comparação diferencia maiúsculas de minúsculas?",
      "answer": "Sim, a comparação é exata. \"Maçã\" e \"maçã\" são tratadas como linhas distintas. Se quiser unificá-las, converta o texto para minúsculas primeiro."
    },
    {
      "id": "rdl-faq-4",
      "question": "Espaços no início ou no fim afetam a correspondência?",
      "answer": "Sim. \"  casa\" e \"casa\" diferem por causa dos espaços. Apare as bordas antes caso queira tratá-las como iguais."
    },
    {
      "id": "rdl-faq-5",
      "question": "Como remover e-mails duplicados de uma lista?",
      "answer": "Cole um e-mail por linha e a ferramenta mantém apenas o primeiro registro de cada endereço. Converter tudo para minúsculas antes garante que \"Contato@...\" e \"contato@...\" virem um só."
    },
    {
      "id": "rdl-faq-6",
      "question": "Como extrair linhas únicas de um arquivo de log?",
      "answer": "Cole o log para obter cada linha distinta uma vez. Se cada entrada tiver horário único, remova a coluna de data/hora antes para agrupar mensagens iguais."
    },
    {
      "id": "rdl-faq-7",
      "question": "Qual é a diferença para remover linhas em branco?",
      "answer": "Remover duplicadas apaga conteúdos repetidos; remover linhas em branco elimina apenas linhas vazias. Aqui, múltiplas linhas vazias repetidas também se reduzem a uma."
    },
    {
      "id": "rdl-faq-8",
      "question": "Por que parece que a ordem das linhas mudou?",
      "answer": "A ordem nunca muda: toda linha única permanece na posição inicial e apenas as cópias repetidas somem, fazendo as linhas abaixo subirem."
    },
    {
      "id": "rdl-faq-9",
      "question": "É seguro colar uma lista de e-mails aqui?",
      "answer": "Sim. Todo o processo roda localmente no navegador, sem envio para servidores nem gravação remota."
    }
  ]
};
