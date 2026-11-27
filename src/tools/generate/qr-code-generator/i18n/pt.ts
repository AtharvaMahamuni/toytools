import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'qr-code-generator',
  name: 'Gerador de QR Code',
  seoTitle: 'Gerador de QR Code Online Grátis – URL, Wi-Fi e vCard',
  description:
    'Crie códigos QR a partir de texto, URL, e-mail, telefone, rede Wi-Fi ou cartão vCard. Baixe em PNG ou SVG grátis. Tudo roda no seu dispositivo.',
  tagline: 'Gere QR Codes para URL, Wi-Fi, contato ou texto em PNG e SVG na hora.',
  knowledge: {
    primaryConcepts: ['gerador de qr code', 'qr code wifi', 'código qr'],
    realWorldUseCases: [
      'Direcionar cartazes, panfletos e embalagens para um site',
      'Compartilhar acesso Wi-Fi sem ditar nem digitar senhas longas',
      'Incluir dados de contato vCard em cartões de visita e assinaturas',
      'Exibir cardápio digital ou formulário de avaliação em mesas e recibos',
    ],
    commonMistakes: [
      'Colocar uma URL enorme deixando os quadradinhos minúsculos e difíceis de ler',
      'Imprimir o QR Code pequeno demais para a distância de leitura',
      'Usar correção de erros baixa em superfícies sujeitas a riscos ou dobras',
      'Cortar a zona tranquila (borda branca ao redor do código)',
    ],
  },
  faqs: [
    {
      id: 'qr-code-generator-faq-1',
      question: 'O que é um QR Code?',
      answer:
        'Um QR Code é um código de barras bidimensional formado por uma grade quadrada de módulos pretos e brancos. A câmera do celular lê o padrão e executa a ação na hora, como abrir um link ou conectar ao Wi-Fi (QR vem de Quick Response).',
    },
    {
      id: 'qr-code-generator-faq-2',
      question: 'Como usar este gerador de QR Code?',
      answer:
        'Escolha o tipo de conteúdo (texto, URL, e-mail, telefone, Wi-Fi ou contato) e preencha os campos. O código aparece enquanto você digita e pode ser baixado em PNG ou SVG no mesmo instante.',
    },
    {
      id: 'qr-code-generator-faq-3',
      question: 'Quais tipos de conteúdo posso codificar?',
      answer:
        'Seis formatos padrão: texto simples, link (URL), e-mail, telefone, credenciais Wi-Fi e cartão de contato vCard. Cada tipo segue o esquema reconhecido nativamente pelas câmeras de Android e iPhone.',
    },
    {
      id: 'qr-code-generator-faq-4',
      question: 'Como criar um QR Code para Wi-Fi?',
      answer:
        'Selecione o tipo Wi-Fi, digite o nome da rede (SSID), a senha e a criptografia (normalmente WPA/WPA2). Se o roteador não transmitir o nome, marque rede oculta. Ao escanear, o celular conecta automaticamente.',
    },
    {
      id: 'qr-code-generator-faq-5',
      question: 'Posso baixar o QR Code gerado?',
      answer:
        'Sim. Você pode salvar como imagem PNG para uso digital rápido ou como arquivo vetorial SVG para imprimir em alta definição em qualquer tamanho.',
    },
    {
      id: 'qr-code-generator-faq-6',
      question: 'Qual a diferença entre PNG e SVG?',
      answer:
        'PNG é uma imagem em pixels com resolução fixa que pode perder nitidez ao ser muito ampliada. SVG é um gráfico vetorial que escala infinitamente sem serrilhado, ideal para gráfica e cartazes.',
    },
    {
      id: 'qr-code-generator-faq-7',
      question: 'O gerador de QR Code funciona sem internet?',
      answer:
        'Sim. Depois de carregar a página, toda a matriz QR é calculada em JavaScript no próprio navegador, funcionando inclusive offline.',
    },
    {
      id: 'qr-code-generator-faq-8',
      question: 'As informações digitadas permanecem privadas?',
      answer:
        'Sim. Senhas de Wi-Fi, telefones e contatos nunca saem do navegador nem são registrados ou enviados a servidores externos.',
    },
    {
      id: 'qr-code-generator-faq-9',
      question: 'O que é a correção de erros em um QR Code?',
      answer:
        'É uma redundância embutida para que o código continue legível mesmo se parte dele estiver suja ou rasurada. Os níveis vão de Baixo (7%) a Alto (30%); Médio (15%) costuma ser o melhor equilíbrio.',
    },
    {
      id: 'qr-code-generator-faq-10',
      question: 'Qual nível de correção de erros devo escolher?',
      answer:
        'Use Médio (15%) na maioria dos casos. Prefira Quartil (25%) ou Alto (30%) em impressões pequenas, embalagens que sofrem atrito ou quando for inserir um logotipo no centro.',
    },
    {
      id: 'qr-code-generator-faq-11',
      question: 'Posso criar um QR Code para um site ou URL?',
      answer:
        'Sim. Selecione URL e informe o endereço completo com https://. Links mais curtos geram blocos maiores e mais fáceis de focar.',
    },
    {
      id: 'qr-code-generator-faq-12',
      question: 'Como fazer um QR Code para cartão de contato?',
      answer:
        'Escolha Cartão de contato e preencha nome, telefone, e-mail e empresa opcional. O formato vCard permite salvar o contato com um toque ao apontar a câmera.',
    },
    {
      id: 'qr-code-generator-faq-13',
      question: 'Por que meu QR Code não lê na câmera?',
      answer:
        'As causas principais são excesso de texto deixando os pontos minúsculos, impressão muito pequena, baixo contraste ou corte da margem branca ao redor. Simplifique o texto e preserve a borda branca.',
    },
    {
      id: 'qr-code-generator-faq-14',
      question: 'Qual o tamanho mínimo recomendado para imprimir um QR Code?',
      answer:
        'Para uma URL curta lida de perto, recomenda-se pelo menos 2 × 2 cm. Aumente proporcionalmente se houver mais dados ou distância maior de leitura e sempre teste antes de rodar a gráfica.',
    },
    {
      id: 'qr-code-generator-faq-15',
      question: 'O que é a zona tranquila (quiet zone) de um QR Code?',
      answer:
        'É a margem branca vazia em volta dos quatro lados do código, essencial para os leitores identificarem onde começa a grade. Os arquivos baixados aqui já trazem essa margem pronta.',
    },
    {
      id: 'qr-code-generator-faq-16',
      question: 'Posso editar um QR Code depois de impresso?',
      answer:
        'Não. Os códigos gerados são estáticos e embutem o texto direto no desenho. Se precisar alterar o destino no futuro, utilize uma URL curta própria com redirecionamento configurável.',
    },
    {
      id: 'qr-code-generator-faq-17',
      question: 'Os QR Codes gerados aqui expiram?',
      answer:
        'Nunca expiram, pois não dependem de servidores intermediários. Só deixam de funcionar se você apagar o site de destino ou trocar a senha do Wi-Fi.',
    },
    {
      id: 'qr-code-generator-faq-18',
      question: 'Quantos dados cabem em um QR Code?',
      answer:
        'Embora o padrão suporte milhares de caracteres, quanto menor o texto, melhor e mais rápida é a leitura pela câmera do celular.',
    },
    {
      id: 'qr-code-generator-faq-25',
      question: 'Suporta acentos, cedilha, emojis e outros idiomas?',
      answer:
        'Sim. A codificação usa UTF-8, aceitando acentos do português, emojis e outros alfabetos. Como esses caracteres ocupam 2 a 4 bytes cada, a grade fica densa mais depressa.',
    },
    {
      id: 'qr-code-generator-faq-19',
      question: 'Posso copiar o texto codificado em vez de baixar a imagem?',
      answer:
        'Sim. O botão Copiar envia para a área de transferência a string exata gravada no QR, como o payload WIFI: ou a URL completa.',
    },
    {
      id: 'qr-code-generator-faq-20',
      question: 'Os QR Codes são gratuitos e sem marca d’água?',
      answer:
        'Sim. Use gratuitamente em projetos pessoais ou comerciais, sem limite, sem conta e sem marca d’água.',
    },
    {
      id: 'qr-code-generator-faq-21',
      question: 'Em quais navegadores funciona?',
      answer:
        'Em todos os navegadores modernos de celular e computador (Chrome, Safari, Firefox e Edge). Os arquivos PNG e SVG seguem o padrão aberto.',
    },
    {
      id: 'qr-code-generator-faq-22',
      question: 'Funciona se eu estiver usando o modo escuro do site?',
      answer:
        'Sim. Tanto na tela quanto no arquivo exportado o QR Code é sempre desenhado com módulos pretos sobre fundo branco para garantir contraste perfeito na câmera.',
    },
    {
      id: 'qr-code-generator-faq-23',
      question: 'A ferramenta salva o que eu digito?',
      answer:
        'Ela lembra localmente apenas suas preferências de tipo e correção de erros. Nunca armazena senhas de Wi-Fi, textos digitados nem o QR gerado.',
    },
    {
      id: 'qr-code-generator-faq-24',
      question: 'Algum dado é compartilhado com terceiros?',
      answer:
        'Não. Não há links de rastreamento, registro de usuário nem chamadas a servidor sobre o conteúdo gerado.',
    },
  ],
  guide: {
    title: 'Como criar um QR Code perfeito passo a passo',
    description: 'Crie QR Codes para URL, Wi-Fi e vCard, entenda PNG vs. SVG, correção de erros e impressão sem falhas.',
    readMinutes: 9,
  },
  fields: {
    contentType: {
      label: 'Conteúdo',
      options: {
        text: 'Texto',
        url: 'URL',
        email: 'E-mail',
        phone: 'Telefone',
        wifi: 'Wi-Fi',
        vcard: 'Cartão de contato',
      },
    },
    text: {
      label: 'Valor',
      placeholder: 'Texto, https://exemplo.com, nome@exemplo.com ou +55 11 99999-9999',
      help: 'Conteúdo exato que será codificado no QR Code.',
    },
    ssid: { label: 'Nome da rede (SSID)', placeholder: 'MeuWiFi' },
    wifiPassword: { label: 'Senha do Wi-Fi', placeholder: 'Senha da rede' },
    encryption: {
      label: 'Segurança',
      options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'Sem senha' },
    },
    hidden: { label: 'Rede oculta' },
    fullName: { label: 'Nome completo', placeholder: 'Ada Lovelace' },
    vcardPhone: { label: 'Telefone', placeholder: '+55 11 99999-9999' },
    vcardEmail: { label: 'E-mail', placeholder: 'nome@exemplo.com' },
    org: { label: 'Empresa / Organização', placeholder: 'Empresa (opcional)' },
    errorCorrection: {
      label: 'Correção de erros',
      group: 'Opções',
      options: {
        L: 'Baixa (7%)',
        M: 'Média (15%)',
        Q: 'Quartil (25%)',
        H: 'Alta (30%)',
      },
    },
  },
  ui: {
    emptyText: 'Configure o conteúdo para gerar o QR Code.',
    engine: {
      enterContent: 'Informe o conteúdo para codificar.',
      tooMuchTpl: 'Dados em excesso para um QR Code ({bytes} bytes; limite {limit} na correção {level}). Encurte o texto ou reduza a correção.',
      modulesLabel: 'Módulos',
      ecLabel: 'Correção de erros',
    },
  },
};
