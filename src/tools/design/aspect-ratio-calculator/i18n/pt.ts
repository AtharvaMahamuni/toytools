import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'aspect-ratio-calculator',
  name: 'Calculadora de Proporção (Aspect Ratio)',
  seoTitle: 'Calculadora de Aspect Ratio Online – Proporção 16:9',
  description:
    'Trave uma proporção como 16:9 e calcule na hora a largura ou altura em pixels. Redimensione imagens e vídeos sem distorcer, direto no navegador.',
  tagline: 'Trave uma proporção como 16:9 e descubra a largura ou altura faltante.',
  knowledge: {
    primaryConcepts: ['proporção de tela', 'aspect ratio 16:9'],
    realWorldUseCases: [
      'Calcular a altura exata de um vídeo ou banner a partir da largura',
      'Redimensionar fotos e thumbnails sem esticar nem achatar',
      'Identificar a proporção simplificada de qualquer resolução em pixels',
      'Definir dimensões pares seguras para codificadores de vídeo H.264',
    ],
    commonMistakes: [
      'Alterar largura e altura separadamente quebrando a proporção original',
      'Confundir resolução absoluta em pixels com a razão de aspecto',
    ],
  },
  faqs: [
    {
      id: 'aspect-ratio-calculator-faq-1',
      question: 'Como calcular a altura para a proporção 16:9?',
      answer:
        'Multiplique a largura por 9 e divida por 16. Para 1600 px de largura, 1600 × 9 ÷ 16 resulta em 900 px. Selecione 16:9 e digite a largura para obter a altura e a prévia visual na hora.',
    },
    {
      id: 'aspect-ratio-calculator-faq-2',
      question: 'Como manter a proporção ao redimensionar uma imagem?',
      answer:
        'Escolha primeiro a proporção desejada e edite apenas um dos campos. Ao alterar a largura a altura se ajusta automaticamente e vice-versa, evitando distorções.',
    },
    {
      id: 'aspect-ratio-calculator-faq-3',
      question: 'Qual é a proporção de 1920x1080?',
      answer:
        '1920 por 1080 simplifica para 16:9 (padrão widescreen). Dividindo ambos pelo maior divisor comum (120) obtém-se 16:9. Digite qualquer par aqui para ver a fração simplificada.',
    },
    {
      id: 'aspect-ratio-calculator-faq-4',
      question: 'Quais são as proporções de tela mais comuns?',
      answer:
        '16:9 para vídeos e monitores, 4:3 para telas clássicas, 3:2 para fotografia DSLR, 21:9 para ultrawide e cinema, 1:1 para cards quadrados e 9:16 para vídeos verticais no celular.',
    },
    {
      id: 'aspect-ratio-calculator-faq-5',
      question: 'Posso inserir medidas decimais?',
      answer:
        'Sim. A calculadora aceita valores decimais tanto na razão personalizada quanto nas medidas em pixels, com arredondamento de até quatro casas decimais.',
    },
  ],
  guide: {
    title: 'Proporção de tela (Aspect Ratio): fórmulas e escalas',
    description: 'Entenda aspect ratio 16:9, como calcular largura ou altura sem distorção e dimensões pares em vídeo.',
    readMinutes: 5,
  },
  ui: {
    panelDims: 'Dimensões',
    lblRatio: 'Proporção (Aspect Ratio)',
    opt169: '16:9 (widescreen)',
    opt43: '4:3 (padrão)',
    opt32: '3:2 (foto)',
    opt219: '21:9 (ultrawide)',
    opt11: '1:1 (quadrado)',
    opt916: '9:16 (vertical)',
    optCustom: 'Personalizada',
    ariaRatioW: 'Largura da proporção',
    ariaRatioH: 'Altura da proporção',
    lblWidth: 'Largura (px)',
    lblHeight: 'Altura (px)',
    btnCopyDims: 'Copiar dimensões',
    errInvalidRatio: 'Digite uma proporção válida, como 16:9.',
    errNeedDim: 'Informe uma largura ou uma altura.',
    errInvalidVals: 'Digite valores válidos.',
    evenHintText: 'Codecs H.264/MP4 exigem largura e altura pares e inteiras para codificar sem erro.',
    btnUsePrefix: 'Usar ',
    toastEmptyCopy: 'Nada para copiar!',
    btnCopied: '✓ Copiado',
  },
};
