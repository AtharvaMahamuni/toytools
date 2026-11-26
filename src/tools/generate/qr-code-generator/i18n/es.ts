import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'qr-code-generator',
  name: 'Generador de Códigos QR',
  seoTitle: 'Generador de Códigos QR Online – Texto, URL, Wi-Fi y vCard',
  description:
    'Crea códigos QR desde texto, URL, correo, teléfono, red Wi-Fi o tarjeta de contacto. Descarga en PNG o SVG gratis. Todo queda en tu dispositivo.',
  tagline: 'Códigos QR para URL, Wi-Fi, contacto o texto en PNG o SVG al instante.',
  knowledge: {
    primaryConcepts: ['generación de códigos QR', 'códigos qr'],
    realWorldUseCases: [
      'Enlazar un cartel, folleto o etiqueta de producto a una página web',
      'Compartir acceso a red Wi-Fi sin dictar ni teclear contraseñas largas',
      'Incluir datos de contacto en tarjetas de visita o firmas de correo',
      'Añadir la carta digital o un formulario de opinión en mesas o recibos',
    ],
    commonMistakes: [
      'Codificar una URL muy larga que vuelve el código denso y difícil de escanear',
      'Imprimir el código QR demasiado pequeño respecto a la distancia de lectura',
      'Usar corrección de errores baja sobre superficies que pueden rozarse o doblarse',
      'Recortar la zona tranquila (el borde blanco alrededor del código)',
    ],
  },
  faqs: [
    {
      id: 'qr-code-generator-faq-1',
      question: '¿Qué es un código QR?',
      answer:
        'Un código QR es un código de barras bidimensional formado por un patrón cuadrado de módulos blancos y negros. La cámara del teléfono lo lee y ejecuta la acción correspondiente, como abrir una página web o conectarse a una red Wi-Fi. QR proviene de Quick Response por su lectura instantánea.',
    },
    {
      id: 'qr-code-generator-faq-2',
      question: '¿Cómo uso este generador de códigos QR?',
      answer:
        'Elige el tipo de contenido (texto, URL, correo, teléfono, Wi-Fi o tarjeta de contacto) y rellena los campos. El código QR aparece en pantalla mientras escribes. Después descárgalo en PNG o SVG o copia la cadena generada. Todo ocurre localmente en tu navegador.',
    },
    {
      id: 'qr-code-generator-faq-3',
      question: '¿Qué tipos de contenido puedo codificar?',
      answer:
        'Seis formatos estándar: texto plano, dirección web (URL), correo electrónico, número de teléfono, credenciales Wi-Fi y tarjeta de contacto vCard. Cada tipo aplica el formato que esperan las cámaras móviles para ofrecer abrir el enlace, llamar o guardar el contacto al instante.',
    },
    {
      id: 'qr-code-generator-faq-4',
      question: '¿Cómo crear un código QR para Wi-Fi?',
      answer:
        'Selecciona el tipo Wi-Fi, introduce el nombre de la red (SSID), la contraseña y el cifrado habitual (WPA/WPA2). Marca la casilla de red oculta si tu router no emite su nombre. Al escanearlo, cualquier móvil ofrecerá conectarse sin teclear la clave.',
    },
    {
      id: 'qr-code-generator-faq-5',
      question: '¿Puedo descargar el código QR generado?',
      answer:
        'Sí. Puedes descargarlo como imagen PNG de mapa de bits para uso digital rápido, o como archivo vectorial SVG que mantiene bordes nítidos a cualquier tamaño para imprenta y cartelería.',
    },
    {
      id: 'qr-code-generator-faq-6',
      question: '¿Cuál es la diferencia entre PNG y SVG?',
      answer:
        'Un PNG está formado por píxeles y tiene una resolución fija, por lo que puede perder nitidez al ampliarlo mucho. Un SVG define formas geométricas vectoriales que escalan sin límites y garantizan impresión perfecta en folletos, lonas o carteles.',
    },
    {
      id: 'qr-code-generator-faq-7',
      question: '¿Funciona el generador de códigos QR sin conexión a internet?',
      answer:
        'Sí. Una vez cargada la página, no necesita red. La matriz QR se genera íntegramente con JavaScript local en tu navegador, así que puedes seguir creando y descargando códigos sin conexión.',
    },
    {
      id: 'qr-code-generator-faq-8',
      question: '¿Es privada la información que introduzco?',
      answer:
        'Sí. Todo lo que escribes, incluidas contraseñas Wi-Fi y datos personales de contacto, permanece exclusivamente en tu navegador. No se envía, registra ni guarda nada en ningún servidor externo.',
    },
    {
      id: 'qr-code-generator-faq-9',
      question: '¿Qué es la corrección de errores en un QR?',
      answer:
        'Es un margen de redundancia integrado en el código para que pueda leerse incluso si una parte está sucia, arrugada o tapada. Los niveles van de Bajo a Alto: a mayor corrección resiste más daños, pero aumenta la densidad de cuadraditos. Medio suele ser el equilibrio ideal.',
    },
    {
      id: 'qr-code-generator-faq-10',
      question: '¿Qué nivel de corrección de errores debería elegir?',
      answer:
        'El nivel Medio funciona bien en la mayoría de casos. Elige Cuartil o Alto si vas a imprimirlo pequeño, sobre envases que puedan rozarse o con un logotipo encima. Usa Bajo solo cuando necesites mínima densidad en un entorno limpio y bien iluminado.',
    },
    {
      id: 'qr-code-generator-faq-11',
      question: '¿Puedo crear un código QR para una URL o enlace web?',
      answer:
        'Sí. Elige URL y pega la dirección completa con https://. Al escanearlo, el teléfono propondrá abrir el sitio web. Conviene usar URLs cortas para mantener un patrón más abierto y fácil de enfocar.',
    },
    {
      id: 'qr-code-generator-faq-12',
      question: '¿Cómo hago un código QR para una tarjeta de contacto?',
      answer:
        'Selecciona Tarjeta de contacto e introduce nombre completo, teléfono, correo electrónico y empresa opcional. El código emplea formato vCard estándar para que al escanearlo el móvil permita guardar el contacto con un toque.',
    },
    {
      id: 'qr-code-generator-faq-13',
      question: '¿Por qué no escanea mi código QR?',
      answer:
        'Las causas más habituales son exceso de texto, tamaño impreso demasiado reducido, bajo contraste o recorte del borde blanco exterior. Acorta el contenido, imprímelo más grande sobre fondo claro y conserva siempre el margen blanco.',
    },
    {
      id: 'qr-code-generator-faq-14',
      question: '¿Cuál es el tamaño mínimo recomendable para imprimir un QR?',
      answer:
        'Para una URL corta leída de cerca suele recomendarse al menos 2 × 2 cm, y mayor tamaño si contiene más datos o se escanea desde lejos. Haz siempre una prueba real con la cámara del teléfono antes de mandar a imprenta.',
    },
    {
      id: 'qr-code-generator-faq-15',
      question: '¿Qué es la zona tranquila (quiet zone) de un QR?',
      answer:
        'Es el margen blanco vacío alrededor de todo el código. Los lectores ópticos lo necesitan para detectar dónde termina el patrón. Los archivos descargados desde aquí ya incluyen esa franja intacta; no la recortes al maquetar.',
    },
    {
      id: 'qr-code-generator-faq-16',
      question: '¿Puedo editar un código QR después de crearlo e imprimirlo?',
      answer:
        'No. Los códigos generados aquí son estáticos y codifican el texto directamente en el patrón gráfico. Si prevés cambiar el destino en el futuro sin reimprimir, codifica una URL corta propia con redirección configurable.',
    },
    {
      id: 'qr-code-generator-faq-17',
      question: '¿Caducan los códigos QR generados aquí?',
      answer:
        'No caducan nunca porque el patrón contiene el texto directamente sin depender de servidores intermediarios. Solo dejarán de funcionar si borras o cambias la página web o la contraseña Wi-Fi a la que apuntan.',
    },
    {
      id: 'qr-code-generator-faq-18',
      question: '¿Cuántos datos caben en un código QR?',
      answer:
        'En teoría hasta varios miles de caracteres, pero en la práctica cuanto menos texto codifiques, mejor. Cuantos más bytes incluye, más diminutos son los módulos y más cuesta enfocarlo rápido desde el móvil.',
    },
    {
      id: 'qr-code-generator-faq-25',
      question: '¿Admite emojis, tildes y textos en otros idiomas?',
      answer:
        'Sí. El texto se codifica en UTF-8, por lo que acepta tildes, eñes, emojis y alfabetos como chino, japonés, árabe o cirílico. Ten en cuenta que esos caracteres ocupan entre 2 y 4 bytes cada uno, haciendo el código más denso antes que el inglés básico.',
    },
    {
      id: 'qr-code-generator-faq-19',
      question: '¿Puedo copiar el contenido codificado en lugar de descargar la imagen?',
      answer:
        'Sí. El botón Copiar copia la cadena exacta que codifica el QR, como la URL completa o el texto de acceso Wi-Fi, ideal para comprobarla o pegarla en otro sitio.',
    },
    {
      id: 'qr-code-generator-faq-20',
      question: '¿Son gratuitos y libres de marcas de agua los códigos QR?',
      answer:
        'Sí. Puedes usar los códigos generados libremente en proyectos personales o comerciales, sin cuenta, sin límites ni marcas de agua.',
    },
    {
      id: 'qr-code-generator-faq-21',
      question: '¿En qué navegadores funciona?',
      answer:
        'En todos los navegadores modernos de escritorio y móvil, incluidos Chrome, Firefox, Safari y Edge. Los archivos PNG y SVG se abren en cualquier editor gráfico o visor.',
    },
    {
      id: 'qr-code-generator-faq-22',
      question: '¿Funciona el código QR si uso el tema oscuro en la web?',
      answer:
        'Sí. El código se dibuja siempre con módulos oscuros sobre fondo blanco, incluso en modo oscuro, porque las cámaras requieren ese contraste estándar tanto en pantalla como en la descarga.',
    },
    {
      id: 'qr-code-generator-faq-23',
      question: '¿Guarda la herramienta lo que escribo?',
      answer:
        'Solo recuerda tus preferencias de opciones (como tipo de contenido o corrección de errores) en almacenamiento local del navegador. Nunca guarda el contenido escrito, contraseñas Wi-Fi ni la imagen generada.',
    },
    {
      id: 'qr-code-generator-faq-24',
      question: '¿Se sube o comparte algún dato con terceros?',
      answer:
        'No. No hay registro de usuario, llamadas a servidor ni telemetría sobre lo que codificas. Todo el proceso ocurre dentro de tu navegador.',
    },
  ],
  guide: {
    title: 'Cómo crear un código QR paso a paso',
    description:
      'Qué son los códigos QR, cómo funciona la corrección de errores y cómo generar códigos para URL, Wi-Fi, texto y contactos en tu navegador.',
    readMinutes: 9,
  },
  fields: {
    contentType: {
      label: 'Contenido',
      options: {
        text: 'Texto',
        url: 'URL',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        wifi: 'Wi-Fi',
        vcard: 'Tarjeta de contacto',
      },
    },
    text: {
      label: 'Valor',
      placeholder: 'Texto, https://ejemplo.com, nombre@ejemplo.com o +34 600 000 000',
      help: 'Contenido exacto que guardará el código QR.',
    },
    ssid: { label: 'Nombre de red (SSID)', placeholder: 'MiRedWiFi' },
    wifiPassword: { label: 'Contraseña Wi-Fi', placeholder: 'Clave de la red' },
    encryption: {
      label: 'Seguridad',
      options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'Ninguna' },
    },
    hidden: { label: 'Red oculta' },
    fullName: { label: 'Nombre completo', placeholder: 'Ada Lovelace' },
    vcardPhone: { label: 'Teléfono', placeholder: '+34 600 000 000' },
    vcardEmail: { label: 'Correo electrónico', placeholder: 'nombre@ejemplo.com' },
    org: { label: 'Organización', placeholder: 'Empresa (opcional)' },
    errorCorrection: {
      label: 'Corrección de errores',
      group: 'Opciones',
      options: {
        L: 'Baja (7%)',
        M: 'Media (15%)',
        Q: 'Cuartil (25%)',
        H: 'Alta (30%)',
      },
    },
  },
  ui: {
    emptyText: 'Configura el contenido para generar el código QR.',
    engine: {
      enterContent: 'Introduce el contenido que deseas codificar.',
      tooMuchTpl: 'Demasiados datos para un código QR ({bytes} bytes; máximo {limit} en corrección {level}). Acorta el texto o reduce el nivel de corrección.',
      modulesLabel: 'Módulos',
      ecLabel: 'Corrección de errores',
    },
  },
};
