import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'no-sleep-website',
  name: 'Mantener Pantalla Encendida (No Sleep)',
  seoTitle: 'Mantener Pantalla Encendida Online – No Sleep Website',
  description:
    'Web gratuita para mantener la pantalla encendida online sin instalar apps. Evita que tu móvil, tableta o portátil entre en suspensión con Wake Lock.',
  tagline: 'Mantén la pantalla activa desde tu navegador sin instalar aplicaciones.',
  citation: {
    problem:
      'Utiliza esta página para mantener encendida la pantalla de tu teléfono, tableta o portátil sin instalar programas ni cambiar los ajustes del sistema.',
    nonGoal: 'anular el botón físico de encendido, impedir el apagado por batería crítica ni funcionar en segundo plano.',
  },
  knowledge: {
    primaryConcepts: ['mantener pantalla encendida', 'no sleep website'],
    realWorldUseCases: [
      'Mantener la pantalla activa mientras cocinas siguiendo una receta paso a paso',
      'Evitar que el portátil se bloquee durante una presentación, demo o videollamada',
      'Dejar visible un panel de métricas, telemetría o documentación técnica sin tocar el ratón',
      'Leer artículos largos o estudiar apuntes sin interrupciones por tiempo de espera',
    ],
    commonMistakes: [
      'Esperar que el bloqueo permanezca activo al cambiar de pestaña o minimizar el navegador',
      'Suponer que Wake Lock anula el botón físico de bloqueo o el modo ahorro extremo del sistema',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: '¿Qué es una web para mantener la pantalla encendida (No Sleep Website)?',
      answer:
        'Es una página web que solicita al sistema operativo mantener iluminada la pantalla mediante el estándar Screen Wake Lock API del W3C. Mientras la pestaña permanezca abierta y visible, evita que tu teléfono, tableta o portátil atenúe o apague la pantalla automáticamente.',
    },
    {
      id: 'nsw-faq-2',
      question: '¿Cómo mantengo la pantalla encendida online con esta herramienta?',
      answer:
        'Abre esta página y pulsa el botón Mantener pantalla encendida. El navegador solicitará de inmediato un bloqueo de activación de pantalla. Mientras la pestaña siga visible en primer plano, el monitor o teléfono seguirá encendido sin que tengas que tocarlo.',
    },
    {
      id: 'nsw-faq-3',
      question: '¿Funciona en teléfonos y tabletas Android?',
      answer:
        'Sí. Funciona de forma nativa en Google Chrome, Microsoft Edge, Brave, Samsung Internet y otros navegadores basados en Chromium en Android mientras la pestaña siga abierta y visible.',
    },
    {
      id: 'nsw-faq-4',
      question: '¿Funciona en iPhone y iPad?',
      answer:
        'Sí. Apple incorporó compatibilidad nativa con la API Screen Wake Lock en Safari a partir de iOS 16.4 y iPadOS 16.4, así como en navegadores de iOS que emplean WebKit. La página debe permanecer visible en pantalla.',
    },
    {
      id: 'nsw-faq-5',
      question: '¿Puedo evitar que se suspenda la pantalla de mi portátil Windows o Mac?',
      answer:
        'Sí. Chrome, Edge y Safari en Windows y macOS admiten Wake Lock de forma nativa, y Firefox lo incluye desde la versión 126. Ten en cuenta que cerrar la tapa del portátil o pulsar el botón de encendido sí activará la suspensión del sistema.',
    },
    {
      id: 'nsw-faq-6',
      question: '¿Sigue funcionando si cambio de pestaña o minimizo el navegador?',
      answer:
        'No. Todos los navegadores liberan el bloqueo de pantalla automáticamente cuando ocultas la pestaña para ahorrar batería. En cuanto vuelves a poner esta pestaña en primer plano, la herramienta intenta reactivar el bloqueo automáticamente.',
    },
    {
      id: 'nsw-faq-7',
      question: '¿Mantener la pantalla activa gasta más batería?',
      answer:
        'Sí. El panel iluminado es el componente que más energía consume en portátiles y móviles. Puedes activar la protección de batería opcional en Opciones para liberar la pantalla automáticamente si la carga baja del 15 por ciento.',
    },
    {
      id: 'nsw-faq-8',
      question: '¿Esta herramienta es gratuita y privada?',
      answer:
        'Sí. Es totalmente gratuita, no requiere cuentas ni registro y se ejecuta íntegramente de forma local en tu navegador sin enviar datos a servidores.',
    },
    {
      id: 'nsw-faq-9',
      question: '¿Hace falta instalar alguna app o extensión?',
      answer:
        'No. Utiliza la API estándar integrada en los navegadores modernos, por lo que funciona al instante abriendo la página web.',
    },
    {
      id: 'nsw-faq-10',
      question: '¿Por qué se sigue apagando mi pantalla en algunos casos?',
      answer:
        'El modo ahorro de batería del sistema, políticas de energía estrictas, el botón físico o cerrar la tapa del equipo tienen prioridad sobre el navegador. Esta herramienta detecta de inmediato si el sistema revoca el bloqueo y muestra el estado real en pantalla.',
    },
  ],
  guide: {
    title: 'Cómo mantener la pantalla encendida en navegador',
    description: 'Guía completa sobre Wake Lock API, compatibilidad por dispositivos, consumo de batería y límites del sistema.',
    readMinutes: 6,
  },
  ui: {
    panelScreen: 'Pantalla',
    panelSession: 'Sesión',
    heroReady: 'Listo',
    heroPlanned: 'Programado',
    heroRemaining: 'Restante',
    heroAwakeFor: 'Activa desde hace',
    heroTotalAwake: 'Tiempo total activa',
    btnStart: 'Mantener pantalla encendida',
    btnStop: 'Detener',
    lockReady: 'Listo cuando tú quieras.',
    lockHeld: 'Bloqueo de pantalla activo en tu dispositivo.',
    lockLost: 'Bloqueo perdido. Reconectando...',
    lockComplete: 'Sesión completada.',
    lockUnsupported: 'Usa los ajustes de pantalla de tu dispositivo.',
    metaStarted: 'Inicio',
    metaEnds: 'Finaliza',
    btnAmbient: 'Modo ambiente',
    unsupTitle: 'Este navegador no admite Screen Wake Lock.',
    keepAwakeFor: 'Mantener activa durante',
    sessionLengthAria: 'Duración de la sesión',
    durUntilStop: 'Hasta detenerla',
    dur15m: '15 min',
    dur30m: '30 min',
    dur1h: '1 hora',
    dur2h: '2 horas',
    customLabel: 'Personalizado',
    customPlaceholder: 'minutos',
    alertsSummary: 'Alertas y pantalla',
    optChime: 'Aviso sonoro al terminar la sesión',
    optNotify: 'Notificación del navegador al terminar',
    optGuard: 'Liberar por debajo del 15% de batería',
    clockFormatAria: 'Formato de reloj',
    clockLabel: 'Reloj',
    ambSleeping: 'En reposo',
    ambAwake: 'Activa',
    ambReconnecting: 'Reconectando',
    ambCompleted: 'Completada',
    ambEndsAt: 'Termina a las',
    ambBtnStart: 'Activar pantalla',
    ambBtnDim: 'Atenuar',
    ambBtnExit: 'Salir',
    unitMinShort: 'm',
    unitHourShort: 'h',
    todayPrefix: 'Hoy: ',
    todayOne: 'sesión',
    todayMany: 'sesiones',
    todayAwakeSuffix: 'activa',
    titleActive: 'Activa · Mantener Pantalla Encendida',
    annLockLost: 'Se perdió el bloqueo de pantalla. Reconectando.',
    annAcquireFail: 'No se pudo obtener el bloqueo de pantalla.',
    annStartedTimed: 'Pantalla activa durante {dur}.',
    annStartedOpen: 'Pantalla mantenida activa.',
    annCompleted: 'Sesión completada tras {dur}.',
    notifyTitle: 'Pantalla liberada',
    notifyBody: 'Tu sesión de {dur} ha terminado.',
    batteryLabel: 'Batería ',
    batteryCharging: ' y cargando',
    batteryGuardStop: 'Detenido al {pct}% de batería para proteger la carga.',
    hintIos: 'En iOS: Ajustes > Pantalla y brillo > Bloqueo automático > Nunca.',
    hintAndroid: 'En Android: Ajustes > Pantalla > Tiempo de espera de la pantalla.',
    hintMac: 'En macOS: Ajustes del Sistema > Pantalla de bloqueo > Apagar pantalla.',
    hintWin: 'En Windows: Configuración > Sistema > Energía y batería > Pantalla y suspensión.',
    hintOther: 'Ajusta el tiempo de espera desde la configuración de pantalla de tu dispositivo.',
  },
};
