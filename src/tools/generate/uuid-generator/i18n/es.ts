import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'uuid-generator',
  name: 'Generador UUID',
  seoTitle: 'Generador de UUID v4 Aleatorios Online',
  description:
    'Genera identificadores únicos UUID versión 4 (GUID) en tu navegador. Crea uno o hasta 100 por lote, alterna guiones y mayúsculas y copia al instante.',
  tagline: 'UUID versión 4 aleatorios, de uno en uno o en lotes.',
  craft: {
    solves:
      'Los UUID versión 4 llevan marcadores fijos de versión de 4 bits y variante RFC 4122 de 2 bits que los distinguen de UUID secuenciales v7 o nulos.',
  },
  knowledge: {
    primaryConcepts: ['generación de UUID', 'identificadores únicos'],
    realWorldUseCases: [
      'Asignar una clave primaria única a un nuevo registro en base de datos',
      'Nombrar archivos u objetos sin riesgo de colisiones',
      'Correlacionar registros entre microservicios mediante un request ID',
      'Generar identificadores estables para registros creados sin conexión',
    ],
    commonMistakes: [
      'Asumir que un UUID es un secreto criptográfico imposible de adivinar',
      'Usar un UUID como token de sesión o contraseña',
      'Guardar UUID como texto largo cuando la base de datos tiene tipo UUID nativo',
      'Esperar que los UUID v4 ordenen registros cronológicamente',
    ],
  },
  fields: {
    count: { label: 'Cantidad' },
    version: { label: 'Versión', options: { v4: 'v4 (aleatorio)' } },
    hyphens: { label: 'Incluir guiones', group: 'Formato' },
    uppercase: { label: 'Mayúsculas', group: 'Formato' },
  },
  faqs: [
    {
      id: 'uuid-generator-faq-1',
      question: '¿Qué es un UUID?',
      answer:
        'Un UUID (Identificador Único Universal) es un valor de 128 bits representado en 36 caracteres como `f47ac10b-58cc-4372-a567-0e02b2c3d479`. Permite que distintos sistemas generen identificadores sin coordinación central y sin riesgo práctico de colisión.',
    },
    {
      id: 'uuid-generator-faq-2',
      question: '¿Qué significan UUID y GUID, son lo mismo?',
      answer:
        'UUID significa Identificador Único Universal y GUID Identificador Único Global, el nombre usado habitualmente en el ecosistema Microsoft para la misma estructura de 128 bits.',
    },
    {
      id: 'uuid-generator-faq-3',
      question: '¿Qué versión genera esta herramienta?',
      answer:
        'Genera UUID versión 4 (aleatorio según RFC 4122), el estándar más usado porque no expone fecha ni dirección MAC ni requiere coordinación entre nodos.',
    },
    {
      id: 'uuid-generator-faq-4',
      question: '¿Cómo se usa el generador UUID?',
      answer:
        'Indica cuántos UUID deseas, elige si mantener guiones y si mostrarlos en mayúsculas o minúsculas, y copia el resultado con un clic o pulsa Regenerar.',
    },
    {
      id: 'uuid-generator-faq-5',
      question: '¿Qué formato tiene un UUID versión 4?',
      answer:
        'Consta de cinco grupos hexadecimales con patrón 8-4-4-4-12 separados por guiones. El dígito 13 siempre es `4` (versión) y el dígito 17 es `8`, `9`, `a` o `b` (variante RFC 4122).',
    },
    {
      id: 'uuid-generator-faq-6',
      question: '¿Está garantizado que dos UUID no se repitan?',
      answer:
        'No es garantía matemática absoluta, pero sus 122 bits aleatorios ofrecen más de 5 × 10^36 combinaciones, por lo que en la práctica se consideran únicos.',
    },
    {
      id: 'uuid-generator-faq-7',
      question: '¿Es seguro y privado generar UUID aquí?',
      answer:
        'Sí. Todo se calcula localmente usando la fuente criptográfica aleatoria del navegador (`Web Crypto API`) sin envíos ni registros en servidores.',
    },
    {
      id: 'uuid-generator-faq-8',
      question: '¿Funciona sin conexión a internet?',
      answer:
        'Sí. Tras cargar la página, la generación funciona por completo en JavaScript local incluso si desconectas tu red.',
    },
    {
      id: 'uuid-generator-faq-9',
      question: '¿Puedo generar varios UUID a la vez?',
      answer:
        'Sí, puedes generar lotes de hasta 100 UUID en una sola lista, uno por línea, listos para copiar de una vez.',
    },
    {
      id: 'uuid-generator-faq-10',
      question: '¿Cómo copio todos los UUID generados?',
      answer:
        'Pulsa Copiar y toda la lista visible se copiará al portapapeles conservando los saltos de línea.',
    },
    {
      id: 'uuid-generator-faq-11',
      question: '¿Puedo quitar los guiones?',
      answer:
        'Sí. Desactiva la opción de guiones para obtener una cadena hexadecimal compacta de 32 caracteres manteniendo exactamente el mismo valor.',
    },
    {
      id: 'uuid-generator-faq-12',
      question: '¿Puedo obtener los UUID en mayúsculas?',
      answer:
        'Sí. Activa Mayúsculas para mostrar `A-F` en lugar de `a-f`. Aunque la especificación es insensible a mayúsculas, algunos sistemas exigen formato concreto.',
    },
    {
      id: 'uuid-generator-faq-13',
      question: '¿Cuándo usar UUID en vez de un ID autoincremental?',
      answer:
        'Cuando distintos clientes, microservicios o aplicaciones sin conexión generan registros antes de sincronizar con la base central.',
    },
    {
      id: 'uuid-generator-faq-14',
      question: '¿Qué diferencia hay entre UUID v4 y v1?',
      answer:
        'La versión 1 incluye marca temporal y dirección de red; la versión 4 es casi completamente aleatoria, no filtra metadatos y es la opción recomendada por defecto.',
    },
    {
      id: 'uuid-generator-faq-15',
      question: '¿Sirve un UUID como contraseña o token secreto?',
      answer:
        'No es recomendable. Aunque tiene 122 bits aleatorios, incluye bits fijos y suele aparecer en URLs o logs. Usa el Generador de Contraseñas para secretos.',
    },
    {
      id: 'uuid-generator-faq-16',
      question: '¿Los UUID v4 se ordenan cronológicamente?',
      answer:
        'No. Al ser aleatorios no conservan orden temporal; si necesitas ordenar por fecha, guarda una columna de timestamp aparte.',
    },
    {
      id: 'uuid-generator-faq-17',
      question: '¿Los UUID son secretos difíciles de adivinar?',
      answer:
        'Son difíciles de adivinar por enumeración, pero nunca deben tratarse como credenciales privadas porque suelen quedar expuestos en URLs y trazas.',
    },
    {
      id: 'uuid-generator-faq-18',
      question: '¿Cómo conviene guardar un UUID en base de datos?',
      answer:
        'Usa el tipo nativo `UUID` si tu motor (como PostgreSQL) lo soporta: ocupa 16 bytes e indexa mejor que una cadena de 36 caracteres.',
    },
    {
      id: 'uuid-generator-faq-19',
      question: '¿Por qué mi base de datos rechazó un UUID?',
      answer:
        'Normalmente ocurre por quitar los guiones ante una columna `UUID` estricta o por exigir mayúsculas/minúsculas específicas.',
    },
    {
      id: 'uuid-generator-faq-20',
      question: '¿En qué navegadores funciona?',
      answer:
        'En todos los navegadores modernos de escritorio y móvil con soporte estándar de Web Crypto API (`crypto.getRandomValues`).',
    },
    {
      id: 'uuid-generator-faq-21',
      question: '¿La página guarda los UUID que genero?',
      answer:
        'No. Solo guarda en localStorage tus preferencias de formato y cantidad, nunca los identificadores generados.',
    },
    {
      id: 'uuid-generator-faq-22',
      question: '¿Se sube o comparte algún dato generado?',
      answer:
        'No. Todo permanece en tu dispositivo sin cuentas ni llamadas a servidores.',
    },
  ],
  guide: {
    title: 'Qué es un UUID v4 y cuándo usarlo correctamente',
    description:
      'Estructura 8-4-4-4-12 de RFC 4122, diferencias entre UUID v4 y v1, almacenamiento en 16 bytes y por qué no usarlo como contraseña.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Ajusta las opciones y genera UUID.',
    engine: {
      metaVersion: 'Versión',
      versionV4: 'v4 (aleatorio)',
      metaCount: 'Cantidad',
    },
  },
};
