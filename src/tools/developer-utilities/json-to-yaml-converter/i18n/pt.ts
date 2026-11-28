import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de JSON para YAML",
  "seoTitle": "Conversor JSON para YAML - Config Kubernetes Online",
  "description": "Converta JSON em YAML limpo para Kubernetes, Docker Compose, Ansible e CI/CD. Indentação segura e aspas automáticas direto no navegador.",
  "tagline": "Converta JSON em YAML legível para Kubernetes e CI/CD.",
  "lead": "Transforme objetos JSON em YAML estruturado para manifestos Kubernetes, Docker Compose e pipelines direto no seu dispositivo.",
  "guide": {
    "title": "Conversor de JSON para YAML: guia completo",
    "description": "Entenda as diferenças entre JSON e YAML, regras de indentação por espaços, aspas em palavras reservadas e usos em infraestrutura."
  },
  "ui": {
    "inputLabel": "Entrada JSON",
    "placeholder": "Cole o JSON aqui",
    "moreAboutHeading": "Como funciona o Conversor JSON para YAML",
    "insight": "Converte JSON para YAML, um superconjunto mais legível muito usado em arquivos de configuração. Os dados permanecem idênticos.",
    "technical": [
      {
        "term": "Operação",
        "detail": "Re-serializa o JSON analisado como YAML"
      },
      {
        "term": "Uso",
        "detail": "Arquivos de configuração, CI e manifestos"
      },
      {
        "term": "Dados",
        "detail": "Preservados: YAML é superconjunto de JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Converte JSON em YAML para Kubernetes, Docker Compose, Ansible e CI/CD com indentação consistente e proteção de strings.",
    "useCases": [
      "Converter resposta JSON de API em manifesto Kubernetes",
      "Gerar Docker Compose a partir de JSON de serviço",
      "Transformar variáveis JSON para Ansible",
      "Preparar fluxos do GitHub Actions",
      "Facilitar leitura de especificações OpenAPI em YAML"
    ],
    "mistakes": [
      "Usar tabulações no YAML em vez de espaços",
      "Deixar strings numéricas sem aspas no YAML",
      "Desalinhar indentação em blocos aninhados",
      "Achar que YAML sem --- no topo é inválido"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "Qual é a diferença entre JSON e YAML?",
      "answer": "Ambos representam dados hierárquicos. JSON usa chaves, colchetes e aspas obrigatórias; YAML usa indentação com espaços, dois-pontos e hífens para facilitar a leitura."
    },
    {
      "id": "jyaml-faq-2",
      "question": "Por que converter JSON em YAML?",
      "answer": "Ferramentas como Kubernetes, Docker Compose, Ansible e GitHub Actions adotam YAML como padrão. Converter JSON evita reescrita manual sujeita a erros."
    },
    {
      "id": "jyaml-faq-3",
      "question": "Por que converter YAML de volta para JSON?",
      "answer": "APIs REST e validadores de JSON Schema operam com JSON. Nosso conversor complementar faz a ida e volta completa."
    },
    {
      "id": "jyaml-faq-4",
      "question": "A indentação em YAML é obrigatória?",
      "answer": "Sim. Espaços (nunca tabs) definem a hierarquia; dois espaços por nível é a convenção mais comum e um espaço errado quebra o arquivo."
    },
    {
      "id": "jyaml-faq-5",
      "question": "Por que algumas strings aparecem entre aspas no YAML?",
      "answer": "Palavras como true, false, null, yes ou no e números sem aspas são convertidos pelo parser YAML. As aspas garantem que continuem sendo strings."
    },
    {
      "id": "jyaml-faq-6",
      "question": "Para que serve o formato inline em arrays simples?",
      "answer": "Listas simples de escalares podem aparecer em linha como [a, b, c], deixando arquivos de tags ou IDs muito mais compactos."
    },
    {
      "id": "jyaml-faq-7",
      "question": "O que significa o marcador --- no início do YAML?",
      "answer": "Indica o começo formal de um documento YAML, útil especialmente em arquivos Kubernetes ou Helm com múltiplos documentos."
    },
    {
      "id": "jyaml-faq-8",
      "question": "Meus arquivos de configuração ficam privados?",
      "answer": "Sim. Toda a conversão acontece localmente no navegador em JavaScript, sem enviar dados para servidores."
    }
  ]
};
