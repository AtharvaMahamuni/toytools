import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Gerador de hash MD5",
  "seoTitle": "Gerador de Hash MD5 - Checksum 32 Caracteres Online",
  "description": "Gere um hash MD5 de 32 caracteres ou soma de verificação a partir de qualquer texto no navegador, rápido e privado.",
  "tagline": "Gere uma assinatura MD5 de 128 bits para qualquer texto.",
  "lead": "Calcule digests MD5 localmente no navegador para chaves de cache, deduplicação e verificação simples de integridade sem uploads.",
  "guide": {
    "title": "O que é MD5? Como funciona e limites de segurança",
    "description": "Entenda como o hash MD5 de 128 bits funciona, por que não serve mais para senhas ou assinaturas e onde ainda é útil."
  },
  "ui": {
    "displayName": "MD5",
    "inputAriaLabel": "Texto para gerar hash MD5",
    "comparePlaceholder": "Cole um hash MD5 de 32 caracteres para comparar",
    "historyTitle": "Histórico recente",
    "insight": "O MD5 produz um checksum de 128 bits rápido, porém vulnerável a colisões. Use apenas para deduplicação ou chaves de cache, nunca para senhas ou assinaturas.",
    "technical": [
      {
        "term": "Padrão",
        "detail": "RFC 1321"
      },
      {
        "term": "Saída",
        "detail": "128 bits, 32 caracteres hexadecimais"
      },
      {
        "term": "Direção",
        "detail": "Mão única: o digest não pode ser revertido ao texto"
      },
      {
        "term": "Segurança",
        "detail": "Quebrado: colisões são viáveis na prática"
      }
    ]
  },
  "knowledge": {
    "summary": "Gera um resumo MD5 de 32 caracteres localmente no navegador para checksums rápidos não criptográficos.",
    "useCases": [
      "Verificar downloads contra corrupção acidental de bytes",
      "Gerar chaves determinísticas de cache por URL",
      "Detectar arquivos duplicados por conteúdo",
      "Distribuir linhas entre shards de banco de dados"
    ],
    "mistakes": [
      "Salvar senhas de usuários usando MD5",
      "Confiar no MD5 contra adulteração maliciosa"
    ]
  },
  "faqs": [
    {
      "id": "md5-faq-1",
      "question": "O que é MD5?",
      "answer": "MD5 é uma função de hash criada em 1991 que transforma qualquer entrada em uma impressão fixa de 32 caracteres hexadecimais (128 bits)."
    },
    {
      "id": "md5-faq-2",
      "question": "Como é um hash MD5?",
      "answer": "Sempre tem 32 dígitos hexadecimais minúsculos. \"hello\" resulta em 5d41402abc4b2a76b9719d911017c592."
    },
    {
      "id": "md5-faq-3",
      "question": "É possível reverter um hash MD5 para o texto original?",
      "answer": "Matematicamente não, por ser mão única. Porém palavras curtas podem ser consultadas em tabelas pré-computadas."
    },
    {
      "id": "md5-faq-4",
      "question": "MD5 é seguro?",
      "answer": "Para fins técnicos sem risco de ataque sim; para segurança não, pois existem vulnerabilidades práticas de colisão."
    },
    {
      "id": "md5-faq-5",
      "question": "Posso usar MD5 para armazenar senhas?",
      "answer": "Não. GPUs calculam bilhões de hashes MD5 por segundo. Para senhas use Argon2, bcrypt ou scrypt."
    },
    {
      "id": "md5-faq-6",
      "question": "O que é colisão de hash?",
      "answer": "É quando duas entradas distintas geram exatamente o mesmo hash. No MD5 colisões já podem ser fabricadas em segundos."
    },
    {
      "id": "md5-faq-7",
      "question": "Para que o MD5 ainda é útil hoje?",
      "answer": "Verificação acidental de corrupção, chaves de cache, deduplicação e chaves internas de particionamento."
    },
    {
      "id": "md5-faq-8",
      "question": "Qual é a diferença entre MD5 e SHA-256?",
      "answer": "MD5 gera 128 bits (32 hex) e é inseguro; SHA-256 gera 256 bits (64 hex) e continua resistente a colisões."
    },
    {
      "id": "md5-faq-9",
      "question": "Por que a mesma entrada gera sempre o mesmo MD5?",
      "answer": "Porque algoritmos de hash são determinísticos: mesmos bytes produzem exatamente a mesma saída sempre."
    },
    {
      "id": "md5-faq-10",
      "question": "Posso calcular MD5 sem enviar o texto?",
      "answer": "Sim. Todo o cálculo roda em JavaScript local no seu navegador."
    },
    {
      "id": "md5-faq-11",
      "question": "Uma IA consegue reverter um hash MD5?",
      "answer": "Não. MD5 descarta informação de forma irreversível e não pode ser invertido matematicamente."
    }
  ]
};
