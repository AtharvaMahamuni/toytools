import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Remover espaços extras",
  "seoTitle": "Remover espaços extras - Tirar espaços duplos online",
  "description": "Transforme múltiplos espaços e tabulações em um único espaço online, preservando as quebras de linha no seu navegador.",
  "tagline": "Reduza espaços repetidos e tabs. Tudo no seu aparelho.",
  "lead": "Corrija espaços duplos após pontos ou textos colados de PDFs comprimindo sequências repetidas em um único espaço.",
  "guide": {
    "title": "Como remover espaços duplos no Word, Excel e textos",
    "description": "Aprenda a remover espaços extras no Word, Google Docs e Excel, e por que a função ARRUMAR do Excel também reduz espaços internos."
  },
  "ui": {
    "placeholder": "Cole ou digite texto com espaços extras aqui",
    "outputPlaceholder": "O texto com espaçamento limpo aparece aqui",
    "sampleText": "Fatura   enviada.   Pagamento    previsto   para   sexta.",
    "handoff": {
      "msgTpl": "Ainda resta(m) {n} espaço(s) no início ou fim das linhas.",
      "siblings": {
        "trim-text": "Aparar bordas"
      }
    }
  },
  "knowledge": {
    "summary": "Transforma sequências repetidas de espaços e tabulações entre palavras em um único espaço sem apagar quebras de linha.",
    "useCases": [
      "Corrigir dois espaços seguidos após pontuação",
      "Limpar trechos copiados de arquivos PDF ou e-mails",
      "Padronizar dados antes de salvar em formulários",
      "Preparar textos com espaçamento uniforme para edição"
    ],
    "mistakes": [
      "Esperar que espaços únicos nas extremidades da linha também desapareçam",
      "Achar que quebras de linha serão apagadas quando são mantidas"
    ]
  },
  "faqs": [
    {
      "id": "res-faq-1",
      "question": "O que faz exatamente remover espaços extras?",
      "answer": "Transforma qualquer sequência de dois ou mais espaços ou tabs em um único espaço simples. \"olá     mundo\" vira \"olá mundo\", mantendo todas as quebras de linha originais."
    },
    {
      "id": "res-faq-2",
      "question": "Por que aparecem espaços extras no texto?",
      "answer": "Geralmente vêm de cópias de PDFs justificados, do hábito de digitar dois espaços após o ponto, alinhamento manual ou exportações de planilhas."
    },
    {
      "id": "res-faq-3",
      "question": "Também remove quebras de linha?",
      "answer": "Não. A ferramenta apenas compacta espaços e tabs dentro de cada linha. Se quiser achatar também as quebras de linha, use o normalizador de espaços."
    },
    {
      "id": "res-faq-4",
      "question": "A ferramenta corta espaços no início e fim das linhas?",
      "answer": "Ela reduz vários espaços seguidos a um só, mas mantém um espaço na borda se ele existir. Para limpar extremidades por completo, use Aparar texto."
    },
    {
      "id": "res-faq-5",
      "question": "Como limpar espaçamento de texto copiado de PDF ou e-mail?",
      "answer": "Cole o conteúdo aqui e copie a saída: toda sequência repetida vira um único espaço enquanto seus parágrafos permanecem intactos."
    },
    {
      "id": "res-faq-6",
      "question": "Quando usar remover espaços extras em vez de aparar bordas?",
      "answer": "Use remover espaços extras quando o problema estiver entre palavras; apare bordas quando houver sobra no começo ou fim de cada linha."
    },
    {
      "id": "res-faq-7",
      "question": "Qual é a diferença entre colapsar espaços e normalizar tudo?",
      "answer": "Colapsar corrige os vãos dentro da linha preservando parágrafos; normalizar converte todos os caracteres em branco, inclusive quebras de linha, em uma única linha."
    },
    {
      "id": "res-faq-8",
      "question": "Por que ainda sobram lacunas largas após limpar?",
      "answer": "Essas lacunas costumam ser espaços inquebráveis (U+00A0) vindos do Word ou da web, que são diferentes do espaço padrão e da tabulação."
    },
    {
      "id": "res-faq-9",
      "question": "É seguro colar textos confidenciais aqui?",
      "answer": "Sim. Todo o processamento ocorre localmente no seu navegador em JavaScript, sem envio ou registro em servidor."
    }
  ]
};
