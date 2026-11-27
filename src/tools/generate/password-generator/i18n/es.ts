import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'password-generator',
  name: 'Generador de Contraseñas',
  seoTitle: 'Generador de Contraseñas Seguras Online',
  description:
    'Crea contraseñas aleatorias seguras con longitud personalizable, conjuntos de caracteres y cálculo de entropía en vivo. Todo queda en tu dispositivo.',
  tagline: 'Contraseñas aleatorias seguras con estimación de entropía en vivo.',
  citation: {
    problem: 'Usa este generador cuando necesites crear una contraseña aleatoria y segura directamente en el navegador.',
    nonGoal: 'almacenar la contraseña ni enviarla a ningún servidor o modelo de IA.',
  },
  craft: {
    solves:
      'Cuando tecleas a mano una contraseña desde pantalla o la dictas por teléfono, letras como O/0 y l/1 resultan indistinguibles en la mayoría de fuentes.',
  },
  knowledge: {
    primaryConcepts: ['generación de contraseñas', 'seguridad y entropía'],
    realWorldUseCases: [
      'Crear una contraseña única para una cuenta nueva',
      'Renovar una clave antigua o reutilizada',
      'Generar la clave maestra de un gestor de contraseñas',
      'Emitir una credencial temporal para acceso compartido',
    ],
    commonMistakes: [
      'Reutilizar la misma contraseña en distintos servicios',
      'Elegir una clave corta confiando solo en símbolos',
      'Guardar contraseñas en archivos de texto sin cifrar',
      'Desactivar casi todos los conjuntos dejando pocas combinaciones',
    ],
  },
  fields: {
    length: { label: 'Longitud', help: 'Entre 4 y 128 caracteres. Se recomienda 16 o más.' },
    uppercase: { label: 'Mayúsculas (A-Z)', group: 'Conjuntos de caracteres' },
    lowercase: { label: 'Minúsculas (a-z)', group: 'Conjuntos de caracteres' },
    numbers: { label: 'Números (0-9)', group: 'Conjuntos de caracteres' },
    symbols: { label: 'Símbolos (!@#$...)', group: 'Conjuntos de caracteres' },
    excludeAmbiguous: { label: 'Excluir caracteres ambiguos (0, O, 1, l, I)', group: 'Opciones' },
  },
  faqs: [
    {
      id: 'password-generator-faq-1',
      question: '¿Qué es un generador de contraseñas?',
      answer:
        'Es una herramienta que construye una clave aleatoria eligiendo cada carácter al azar dentro de los conjuntos permitidos. A diferencia de las claves inventadas por personas, no sigue patrones ni palabras predecibles.',
    },
    {
      id: 'password-generator-faq-2',
      question: '¿Cómo se usa este generador de contraseñas?',
      answer:
        'Elige la longitud deseada y activa o desactiva mayúsculas, minúsculas, números y símbolos. La contraseña se genera al instante; pulsa Regenerar para crear otra nueva o Copiar para llevarla al portapapeles.',
    },
    {
      id: 'password-generator-faq-3',
      question: '¿Qué longitud debe tener una contraseña segura?',
      answer:
        'Cuanto más larga, más segura. Como referencia, usa al menos 16 caracteres para cuentas habituales y 20 o más para cuentas críticas como correo o gestor de contraseñas. La longitud aporta mucha más fuerza que añadir símbolos a una clave corta.',
    },
    {
      id: 'password-generator-faq-4',
      question: '¿Es seguro usar este generador online?',
      answer:
        'Sí. Toda contraseña se genera localmente en tu navegador mediante JavaScript. No se envía nada por red, no se registra ni se guarda en servidores; puedes comprobarlo en la pestaña de red de tu navegador.',
    },
    {
      id: 'password-generator-faq-5',
      question: '¿Funciona sin conexión a internet?',
      answer:
        'Sí. Una vez cargada la página, no necesita conexión. Puedes desconectarte de internet y seguir generando contraseñas porque todo el proceso ocurre en tu dispositivo.',
    },
    {
      id: 'password-generator-faq-6',
      question: '¿Las contraseñas son realmente aleatorias?',
      answer:
        'Utiliza la API Web Crypto del navegador (`crypto.getRandomValues`), una fuente criptográfica diseñada para seguridad, con muestreo sin sesgo para que todos los caracteres tengan exactamente la misma probabilidad.',
    },
    {
      id: 'password-generator-faq-7',
      question: '¿Qué es la entropía de una contraseña?',
      answer:
        'La entropía mide en bits lo difícil que es adivinar una clave por fuerza bruta. Cada bit adicional duplica los intentos necesarios. Por debajo de 40 bits es débil; entre 60 y 80 bits es sólida y 100 bits o más es muy fuerte.',
    },
    {
      id: 'password-generator-faq-8',
      question: '¿Cómo se calcula la entropía?',
      answer:
        'Se multiplica la longitud de la contraseña por el logaritmo en base 2 del tamaño del conjunto disponible. Con los cuatro conjuntos activos (~88 caracteres) y 16 de longitud se superan los 100 bits.',
    },
    {
      id: 'password-generator-faq-9',
      question: '¿Qué indica el medidor de fortaleza?',
      answer:
        'Resume la entropía en etiquetas claras: Muy débil, Débil, Aceptable, Fuerte o Muy fuerte. Solo mide aleatoriedad combinatoria, así que procura alcanzar al menos Fuerte en tus cuentas.',
    },
    {
      id: 'password-generator-faq-10',
      question: '¿Conviene incluir símbolos?',
      answer:
        'Ayudan, pero la longitud importa más. Pasar de 62 a 88 caracteres aporta menos seguridad que sumar 4 caracteres extra. Inclúyelos cuando el sitio los acepte sin acortar tu longitud.',
    },
    {
      id: 'password-generator-faq-11',
      question: '¿Qué son los caracteres ambiguos y por qué excluirlos?',
      answer:
        'Son letras y dígitos muy parecidos en pantalla: la letra O y el cero 0, o la l minúscula, I mayúscula y 1. Excluirlos evita errores al leer o teclear manualmente.',
    },
    {
      id: 'password-generator-faq-12',
      question: '¿Puedo generar una clave solo con números?',
      answer:
        'Sí. Desactiva mayúsculas, minúsculas y símbolos y deja solo números para obtener un PIN aleatorio. Recuerda aumentar bastante la longitud porque un conjunto de 10 dígitos tiene menor entropía.',
    },
    {
      id: 'password-generator-faq-13',
      question: '¿Por qué una web rechaza mi contraseña generada?',
      answer:
        'Algunas páginas imponen un límite máximo de caracteres o prohíben ciertos símbolos. Si falla, ajusta la longitud permitida o desactiva símbolos y genera otra usando siempre el máximo admitido.',
    },
    {
      id: 'password-generator-faq-14',
      question: '¿Pueden coincidir dos personas con la misma contraseña?',
      answer:
        'En teoría es posible, pero en la práctica resulta astronómicamente improbable: una clave de 16 caracteres del conjunto completo supera 10^31 combinaciones posibles.',
    },
    {
      id: 'password-generator-faq-15',
      question: '¿Dónde conviene guardar la contraseña generada?',
      answer:
        'En un gestor de contraseñas cifrado, que las recuerda y rellena por ti. Evita anotarlas en archivos de texto plano, notas sin cifrar u hojas de cálculo.',
    },
    {
      id: 'password-generator-faq-16',
      question: '¿La herramienta recuerda las contraseñas creadas?',
      answer:
        'No. Nunca guarda ninguna contraseña generada. Únicamente conserva en almacenamiento local tus preferencias de opciones (longitud y casillas) para la próxima visita.',
    },
    {
      id: 'password-generator-faq-17',
      question: '¿Puedo generar varias contraseñas a la vez?',
      answer:
        'Esta herramienta genera una clave cada vez y permite pulsar Regenerar para obtener otra al instante. Para lotes de múltiples cadenas aleatorias, el generador de cadenas aleatorias está pensado para volumen.',
    },
    {
      id: 'password-generator-faq-18',
      question: '¿Qué diferencia hay entre contraseña y frase de paso?',
      answer:
        'Una contraseña mezcla caracteres aleatorios; una frase de paso encadena varias palabras aleatorias fáciles de recordar. Este generador crea contraseñas de caracteres ideales para gestores.',
    },
    {
      id: 'password-generator-faq-19',
      question: '¿Una contraseña larga supera a una corta con símbolos?',
      answer:
        'Casi siempre sí. Por ejemplo, 20 minúsculas aleatorias (~94 bits) tienen mucha más entropía que 10 caracteres con mayúsculas, números y símbolos (~64 bits).',
    },
    {
      id: 'password-generator-faq-20',
      question: '¿En qué navegadores funciona?',
      answer:
        'En todos los navegadores modernos de escritorio y móvil (Chrome, Firefox, Safari y Edge) compatibles con Web Crypto API. Si faltara aleatoriedad segura, muestra un error en lugar de debilitar la clave.',
    },
    {
      id: 'password-generator-faq-21',
      question: '¿Sirve para claves API o tokens?',
      answer:
        'Sí sirve para secretos rápidos de alta longitud, aunque si necesitas controlar un alfabeto específico o longitudes muy elevadas te conviene el generador de cadenas aleatorias.',
    },
    {
      id: 'password-generator-faq-22',
      question: '¿Con qué frecuencia debo cambiar mis contraseñas?',
      answer:
        'Cámbialas cuando haya un motivo real: filtración confirmada, sospecha de exposición o reutilización previa. Las guías actuales ya no recomiendan rotaciones periódicas arbitrarias si la clave es única y fuerte.',
    },
    {
      id: 'password-generator-faq-23',
      question: '¿Supone un riesgo dejar la contraseña en el portapapeles?',
      answer:
        'Puede serlo si tienes historial de portapapeles activo o aplicaciones con acceso a él. Tras pegarla en tu cuenta, copia cualquier texto inocuo para sobrescribirlo.',
    },
    {
      id: 'password-generator-faq-24',
      question: '¿Se sube o comparte algún dato?',
      answer:
        'No. No hay cuentas, ni llamadas al servidor ni analítica sobre los valores generados. Lo que generas permanece íntegramente en tu dispositivo.',
    },
    {
      id: 'password-generator-faq-25',
      question: '¿Usa inteligencia artificial este generador?',
      answer:
        'No. Utiliza exclusivamente el generador criptográfico de números aleatorios de tu navegador sin conectar con ningún modelo de IA.',
    },
  ],
  guide: {
    title: 'Cómo crear contraseñas seguras y entropía',
    description:
      'Por qué la longitud gana a la complejidad, cómo calcular bits de entropía y cómo guardar tus claves con seguridad.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Configura las opciones y pulsa Regenerar.',
    engine: {
      errNoSet: 'Activa al menos un conjunto de caracteres.',
      bitsTpl: '{bits} bits',
      charsTpl: '{n} caract.',
      metaEntropy: 'Entropía',
      metaLength: 'Longitud',
      metaPool: 'Conjunto',
      strength: {
        veryWeak: 'Muy débil',
        weak: 'Débil',
        fair: 'Aceptable',
        strong: 'Fuerte',
        veryStrong: 'Muy fuerte',
      },
    },
  },
};
