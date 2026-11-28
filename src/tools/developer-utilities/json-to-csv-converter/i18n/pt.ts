import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de JSON para CSV",
  "seoTitle": "Conversor JSON para CSV - Exportar para Excel Online",
  "description": "Converta arrays JSON em CSV para Excel e bancos de dados. Trata objetos aninhados e escapa vírgulas localmente no navegador.",
  "tagline": "Transforme arrays JSON em CSV tratando objetos aninhados.",
  "lead": "Exporte respostas de API e listas JSON para CSV compatível com Excel e Google Sheets direto no navegador, sem enviar nada.",
  "guide": {
    "title": "Conversor de JSON para CSV: guia completo",
    "description": "Saiba como arrays JSON viram CSV, como objetos aninhados e campos ausentes são tratados e evite os principais erros."
  },
  "ui": {
    "inputLabel": "Entrada JSON",
    "placeholder": "Cole o JSON aqui",
    "moreAboutHeading": "Como funciona o Conversor JSON para CSV",
    "insight": "Converte um array de objetos JSON planos em linhas CSV usando as chaves como cabeçalho. Valores aninhados são serializados na célula.",
    "technical": [
      {
        "term": "Entrada",
        "detail": "Um array de objetos com chaves consistentes"
      },
      {
        "term": "Cabeçalho",
        "detail": "Extraído das chaves dos objetos"
      },
      {
        "term": "Valores aninhados",
        "detail": "Serializados em uma única célula"
      }
    ],
    "errMustBeArray": "A entrada deve ser um array JSON.",
    "errEmptyArray": "O array está vazio: nada para converter."
  },
  "knowledge": {
    "summary": "Converte arrays JSON em CSV para planilhas e bancos de dados, escapando vírgulas e preservando linhas esparsas.",
    "useCases": [
      "Exportar uma resposta de API para Excel em relatórios",
      "Importar registros JSON em bancos relacionais via CSV",
      "Analisar logs ou configurações em planilhas",
      "Compartilhar dados estruturados no Google Sheets"
    ],
    "mistakes": [
      "Passar um único objeto JSON em vez de um array JSON",
      "Esperar subobjetos em colunas múltiplas sem achatamento",
      "Esquecer que textos com vírgula precisam de aspas no CSV"
    ]
  },
  "faqs": [
    {
      "id": "jtc-faq-1",
      "question": "Qual formato de entrada o conversor espera?",
      "answer": "Um array JSON de objetos, como [{\"nome\":\"Ana\",\"idade\":30}]. Cada objeto vira uma linha e cada chave única vira uma coluna."
    },
    {
      "id": "jtc-faq-2",
      "question": "O que acontece com objetos aninhados na conversão?",
      "answer": "Como o CSV é bidimensional, objetos e arrays internos são serializados ou achatados na célula para manter todas as linhas alinhadas."
    },
    {
      "id": "jtc-faq-3",
      "question": "Como campos ausentes em alguns objetos são tratados?",
      "answer": "Todas as chaves do array são coletadas para montar o cabeçalho; linhas sem determinada chave recebem célula vazia naquela coluna."
    },
    {
      "id": "jtc-faq-4",
      "question": "Posso abrir o CSV gerado no Excel ou Google Sheets?",
      "answer": "Sim. Copie ou baixe o arquivo .csv e abra diretamente: cabeçalhos e células com aspas são interpretados corretamente."
    },
    {
      "id": "jtc-faq-5",
      "question": "Por que outras ferramentas mostram [object Object]?",
      "answer": "Isso ocorre quando o objeto interno não é serializado corretamente antes de virar texto na célula."
    },
    {
      "id": "jtc-faq-6",
      "question": "Como valores contendo vírgulas são tratados?",
      "answer": "A célula inteira é envolvida por aspas duplas para impedir que a vírgula divida a coluna ao abrir na planilha."
    },
    {
      "id": "jtc-faq-7",
      "question": "Dados JSON confidenciais ficam seguros?",
      "answer": "Sim. Todo o processo ocorre localmente no seu navegador via JavaScript, sem envio a servidores externos."
    },
    {
      "id": "jtc-faq-8",
      "question": "Posso escolher quais colunas incluir?",
      "answer": "Todas as chaves presentes no array são exportadas. Para filtrar colunas, edite o JSON antes ou exclua colunas depois na planilha."
    },
    {
      "id": "jtc-faq-9",
      "question": "Qual é a diferença entre JSON e CSV?",
      "answer": "JSON armazena dados hierárquicos e tipados para APIs; CSV armazena tabelas simples e leves para planilhas e bancos de dados."
    }
  ]
};
