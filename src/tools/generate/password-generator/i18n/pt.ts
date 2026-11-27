import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'password-generator',
  name: 'Gerador de Senhas',
  seoTitle: 'Gerador de Senhas Fortes Online e Grátis',
  description:
    'Crie senhas aleatórias seguras com tamanho personalizado, conjuntos de caracteres e cálculo de entropia ao vivo no navegador, sem enviar dados.',
  tagline: 'Senhas aleatórias fortes com estimativa de entropia ao vivo.',
  citation: {
    problem: 'Use este gerador quando precisar criar uma senha aleatória segura diretamente no navegador.',
    nonGoal: 'armazenar a senha nem enviá-la para servidores ou modelos de IA.',
  },
  craft: {
    solves:
      'Ao digitar uma senha olhando para a tela ou ditar por telefone, caracteres como O/0 e l/1 ficam parecidos na maioria das fontes.',
  },
  knowledge: {
    primaryConcepts: ['geração de senhas', 'força e entropia'],
    realWorldUseCases: [
      'Criar uma senha exclusiva para uma conta nova',
      'Substituir uma senha antiga ou reutilizada',
      'Gerar a senha mestra de um gerenciador de senhas',
      'Criar uma credencial temporária para acesso compartilhado',
    ],
    commonMistakes: [
      'Reutilizar a mesma senha em vários sites',
      'Escolher uma senha curta só por conter símbolos',
      'Guardar senhas em arquivos de texto sem criptografia',
      'Desativar quase todos os conjuntos deixando poucas combinações',
    ],
  },
  fields: {
    length: { label: 'Comprimento', help: 'De 4 a 128 caracteres. Recomenda-se 16 ou mais.' },
    uppercase: { label: 'Maiúsculas (A-Z)', group: 'Conjuntos de caracteres' },
    lowercase: { label: 'Minúsculas (a-z)', group: 'Conjuntos de caracteres' },
    numbers: { label: 'Números (0-9)', group: 'Conjuntos de caracteres' },
    symbols: { label: 'Símbolos (!@#$...)', group: 'Conjuntos de caracteres' },
    excludeAmbiguous: { label: 'Excluir caracteres ambíguos (0, O, 1, l, I)', group: 'Opções' },
  },
  faqs: [
    {
      id: 'password-generator-faq-1',
      question: 'O que é um gerador de senhas?',
      answer:
        'É uma ferramenta que monta uma senha aleatória sorteando caracteres dos conjuntos escolhidos. Sem padrões humanos ou palavras previsíveis, ela fica muito mais difícil de quebrar.',
    },
    {
      id: 'password-generator-faq-2',
      question: 'Como usar este gerador de senhas?',
      answer:
        'Defina o comprimento e ative maiúsculas, minúsculas, números ou símbolos. A senha aparece na hora; clique em Gerar novamente para trocar ou Copiar para levar à área de transferência.',
    },
    {
      id: 'password-generator-faq-3',
      question: 'Qual deve ser o tamanho da minha senha?',
      answer:
        'Quanto maior, mais forte. Use pelo menos 16 caracteres na maioria das contas e 20 ou mais para e-mail principal e cofre de senhas.',
    },
    {
      id: 'password-generator-faq-4',
      question: 'Este gerador de senhas online é seguro?',
      answer:
        'Sim. Toda senha é criada localmente no navegador. Nada sai pela rede, nada é registrado nem salvo em servidor.',
    },
    {
      id: 'password-generator-faq-5',
      question: 'Funciona sem internet?',
      answer:
        'Sim. Depois que a página carrega uma vez, todo o processo roda em JavaScript local no seu dispositivo, mesmo desconectado.',
    },
    {
      id: 'password-generator-faq-6',
      question: 'As senhas são realmente aleatórias?',
      answer:
        'Sim, usando a API Web Crypto (`crypto.getRandomValues`) com método sem viés de módulo, dando exatamente a mesma chance a cada caractere.',
    },
    {
      id: 'password-generator-faq-7',
      question: 'O que é entropia da senha?',
      answer:
        'É a medida em bits da dificuldade de adivinhar uma senha. Cada bit extra dobra o número de tentativas: abaixo de 40 bits é fraca, 60 a 80 bits é boa e 100+ bits é muito forte.',
    },
    {
      id: 'password-generator-faq-8',
      question: 'Como a entropia é calculada?',
      answer:
        'Multiplica-se o comprimento pelo logaritmo na base 2 do conjunto possível. Com os quatro conjuntos ativos (~88 caracteres) e 16 caracteres, passa de 100 bits.',
    },
    {
      id: 'password-generator-faq-9',
      question: 'O que mostra o indicador de força?',
      answer:
        'Ele traduz a entropia em categorias claras de Muito fraca a Muito forte. Busque pelo menos Forte para suas contas importantes.',
    },
    {
      id: 'password-generator-faq-10',
      question: 'Devo incluir símbolos?',
      answer:
        'Ajuda quando o site aceita, mas aumentar o tamanho é ainda mais eficiente. Somar quatro caracteres gera mais proteção do que ativar símbolos.',
    },
    {
      id: 'password-generator-faq-11',
      question: 'O que são caracteres ambíguos e por que excluí-los?',
      answer:
        'São caracteres parecidos como O/0 e l/I/1. Removê-los evita erros quando você precisa digitar ou ler a senha em voz alta.',
    },
    {
      id: 'password-generator-faq-12',
      question: 'Posso gerar uma senha só com números?',
      answer:
        'Sim. Deixe apenas Números ativo para criar um PIN aleatório. Como há só 10 dígitos, aumente o comprimento para compensar.',
    },
    {
      id: 'password-generator-faq-13',
      question: 'Por que um site rejeitou minha senha?',
      answer:
        'Alguns serviços limitam o máximo de caracteres ou bloqueiam certos símbolos. Ajuste o tamanho ou desative símbolos mantendo o maior comprimento aceito.',
    },
    {
      id: 'password-generator-faq-14',
      question: 'Duas pessoas podem receber a mesma senha?',
      answer:
        'Na teoria é possível, mas na prática é desprezível: com 16 caracteres completos há mais de 10^31 combinações.',
    },
    {
      id: 'password-generator-faq-15',
      question: 'Onde guardar a senha gerada?',
      answer:
        'Em um gerenciador de senhas criptografado. Nunca salve senhas em arquivos de texto simples, notas abertas ou planilhas.',
    },
    {
      id: 'password-generator-faq-16',
      question: 'A ferramenta salva as senhas que eu crio?',
      answer:
        'Não. As senhas nunca são armazenadas. Apenas suas preferências de opções ficam guardadas localmente no navegador.',
    },
    {
      id: 'password-generator-faq-17',
      question: 'Consigo gerar várias senhas de uma vez?',
      answer:
        'Aqui geramos uma senha por vez e você pode clicar em Gerar novamente quantas vezes quiser. Para lotes maiores, use um gerador de strings aleatórias.',
    },
    {
      id: 'password-generator-faq-18',
      question: 'Qual a diferença entre senha e frase-senha?',
      answer:
        'A senha mistura caracteres aleatórios; a frase-senha junta várias palavras aleatórias fáceis de lembrar. Esta ferramenta foca em senhas ideais para gerenciadores.',
    },
    {
      id: 'password-generator-faq-19',
      question: 'Uma senha longa vence uma curta com símbolos?',
      answer:
        'Quase sempre sim: 20 letras minúsculas aleatórias oferecem muito mais entropia do que 10 caracteres com todos os símbolos.',
    },
    {
      id: 'password-generator-faq-20',
      question: 'Em quais navegadores funciona?',
      answer:
        'Nos navegadores modernos de computador e celular (Chrome, Firefox, Safari e Edge) compatíveis com a API Web Crypto.',
    },
    {
      id: 'password-generator-faq-21',
      question: 'Serve para chaves de API ou tokens?',
      answer:
        'Serve para segredos rápidos longos, embora o gerador de strings aleatórias dê mais controle sobre o alfabeto.',
    },
    {
      id: 'password-generator-faq-22',
      question: 'Com que frequência devo trocar de senha?',
      answer:
        'Troque quando houver vazamento, suspeita de exposição ou reutilização. Trocas periódicas sem motivo não são mais recomendadas.',
    },
    {
      id: 'password-generator-faq-23',
      question: 'A área de transferência oferece risco depois de copiar?',
      answer:
        'Se o histórico da área de transferência estiver ligado, a senha pode permanecer visível. Após colar, copie outro texto comum para sobrescrever.',
    },
    {
      id: 'password-generator-faq-24',
      question: 'Algum dado é enviado ou compartilhado?',
      answer:
        'Não. Sem conta, sem chamadas a servidor e sem rastreamento do que é gerado.',
    },
    {
      id: 'password-generator-faq-25',
      question: 'Esta ferramenta usa inteligência artificial?',
      answer:
        'Não. Tudo vem do gerador criptográfico aleatório do seu navegador sem uso de modelos de IA.',
    },
  ],
  guide: {
    title: 'Como gerar uma senha forte e entender a entropia',
    description:
      'Por que comprimento supera complexidade, como funcionam os bits de entropia e onde armazenar senhas com segurança.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Ajuste as opções e gere uma senha.',
    engine: {
      errNoSet: 'Ative pelo menos um conjunto de caracteres.',
      bitsTpl: '{bits} bits',
      charsTpl: '{n} caract.',
      metaEntropy: 'Entropia',
      metaLength: 'Comprimento',
      metaPool: 'Conjunto',
      strength: {
        veryWeak: 'Muito fraca',
        weak: 'Fraca',
        fair: 'Razoável',
        strong: 'Forte',
        veryStrong: 'Muito forte',
      },
    },
  },
};
