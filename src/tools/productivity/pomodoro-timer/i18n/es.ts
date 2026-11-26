import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'pomodoro-timer',
  name: 'Temporizador Pomodoro',
  seoTitle: 'Temporizador Pomodoro Online: Reloj de Enfoque 25 Minutos',
  description:
    'Temporizador Pomodoro gratuito online: 25 minutos de enfoque y 5 de descanso, con soporte 50/10 y duración personalizable en tu dispositivo.',
  tagline: 'Mantén la concentración con bloques de trabajo cronometrados y pausas reales.',
  knowledge: {
    primaryConcepts: ['temporizador pomodoro', 'técnica pomodoro', 'reloj de enfoque'],
    realWorldUseCases: [
      'Redactar borradores y documentos técnicos en sesiones cronometradas',
      'Estudiar temarios complejos con descansos programados para retener mejor',
      'Revisar código o resolver listas de tareas evitando distracciones',
    ],
    commonMistakes: [
      'Saltarse los descansos por sensación de flujo y agotar la atención antes de tiempo',
      'Consultar mensajes o redes durante los cinco minutos de pausa',
      'Iniciar el temporizador sin haber definido un objetivo concreto para el bloque',
    ],
  },
  faqs: [
    {
      id: 'pt-faq-1',
      question: '¿Qué es un Pomodoro?',
      answer:
        'Un Pomodoro es una sesión única de trabajo cronometrada, tradicionalmente de 25 minutos de concentración seguidos de 5 minutos de pausa. El nombre viene de la palabra italiana para tomate, por el temporizador de cocina con forma de tomate que utilizó Francesco Cirillo al crear el método.',
    },
    {
      id: 'pt-faq-2',
      question: '¿Cuánto dura un ciclo Pomodoro?',
      answer:
        'El intervalo clásico dura 25 minutos de trabajo y 5 de pausa. Tras cuatro sesiones se toma un descanso largo de 15 minutos. También puedes ajustar los tiempos a 50/10 o a cualquier duración personalizada.',
    },
    {
      id: 'pt-faq-3',
      question: '¿Por qué se llama técnica Pomodoro?',
      answer:
        'Francesco Cirillo bautizó el método a finales de los años ochenta por el reloj de cocina con forma de tomate (pomodoro en italiano) que usaba mientras estudiaba en la universidad.',
    },
    {
      id: 'pt-faq-4',
      question: '¿Puedo personalizar los minutos del temporizador?',
      answer:
        'Sí. Pulsa Personalizar para ajustar la duración de enfoque (1 a 180 minutos), pausa corta (1 a 60 minutos), pausa larga (1 a 120 minutos) y sesiones por ciclo (1 a 12). La configuración se guarda localmente en tu navegador.',
    },
    {
      id: 'pt-faq-5',
      question: '¿Puedo usar intervalos 50/10 en lugar de 25/5?',
      answer:
        'Sí. Abre Personalizar y fija 50 minutos de enfoque y 10 de descanso corto. Muchas personas prefieren bloques de 50 minutos para programación o redacción profunda.',
    },
    {
      id: 'pt-faq-6',
      question: '¿Cuántos Pomodoros conviene hacer al día?',
      answer:
        'La mayoría de las personas sostienen entre 8 y 12 bloques de 25 minutos de trabajo concentrado al día, aunque 4 o 6 bloques completos suelen ser un objetivo sólido y realista para empezar.',
    },
    {
      id: 'pt-faq-7',
      question: '¿Qué debo hacer durante los descansos?',
      answer:
        'En pausas cortas de 5 minutos: levántate, estira, aparta la vista de la pantalla y bebe agua. Evita el correo y las redes sociales para que tu atención descanse de verdad. En la pausa larga de 15 minutos camina un poco o descansa lejos de cualquier pantalla.',
    },
    {
      id: 'pt-faq-8',
      question: '¿Sirve la técnica Pomodoro para estudiar?',
      answer:
        'Sí, funciona especialmente bien cuando divides el estudio en tareas concretas como leer un capítulo o resolver ejercicios. Las pausas programadas reducen la fatiga mental acumulada.',
    },
    {
      id: 'pt-faq-9',
      question: '¿Es útil el método Pomodoro para programadores?',
      answer:
        'Depende de la tarea. Funciona muy bien para corregir fallos acotados o revisar pull requests. Para problemas complejos de arquitectura, los intervalos 50/10 o 90/20 evitan cortar el hilo mental demasiado pronto.',
    },
    {
      id: 'pt-faq-16',
      question: '¿Funciona la técnica Pomodoro para el TDAH?',
      answer:
        'Para muchas personas con TDAH resulta muy útil porque acota tareas abiertas a un límite concreto ("solo 25 minutos") y evita el agotamiento tras el hiperfoco. Si 25 minutos te resultan largos al principio, prueba bloques de 15 minutos junto a una lista de tareas clara.',
    },
    {
      id: 'pt-faq-17',
      question: '¿Pomodoro o time blocking? ¿Qué es mejor?',
      answer:
        'Resuelven necesidades distintas y se complementan. El time blocking reserva franjas en tu calendario ("de 10 a 12: programar"), mientras que Pomodoro estructura el foco dentro de cada franja con descansos obligatorios.',
    },
    {
      id: 'pt-faq-18',
      question: '¿Tiene respaldo práctico la técnica Pomodoro?',
      answer:
        'Los mecanismos en los que se apoya están bien documentados en ergonomía cognitiva: alternar bloques acotados con pausas regulares reduce la procrastinación inicial y mantiene estable la atención sostenida a lo largo de la jornada.',
    },
    {
      id: 'pt-faq-14',
      question: '¿Para quién está pensado el método Pomodoro?',
      answer:
        'Ayuda a estudiantes, redactores, desarrolladores y profesionales que realizan tareas con objetivos medibles y sufren interrupciones frecuentes o procrastinación al arrancar.',
    },
    {
      id: 'pt-faq-10',
      question: '¿Funciona este temporizador sin conexión a internet?',
      answer:
        'Sí. Una vez cargada la página, todo el temporizador y las alertas sonoras se ejecutan localmente en tu navegador sin depender de servidores.',
    },
    {
      id: 'pt-faq-11',
      question: '¿ToyTools guarda mis estadísticas o ajustes en algún servidor?',
      answer:
        'No. Tu configuración y tus estadísticas del día permanecen únicamente en el almacenamiento local de tu dispositivo y pueden exportarse en JSON.',
    },
    {
      id: 'pt-faq-12',
      question: '¿Sigue contando el reloj si cambio de pestaña?',
      answer:
        'Sí. El cálculo se basa en marcas de tiempo reales (timestamps), por lo que al volver a la pestaña compensa automáticamente cualquier pausa que el navegador aplique en segundo plano.',
    },
    {
      id: 'pt-faq-13',
      question: '¿Funciona bien en móviles?',
      answer:
        'Sí, está diseñado pensando primero en móvil. Ten en cuenta que los navegadores móviles detienen JavaScript cuando se bloquea la pantalla; puedes combinarlo con nuestra herramienta Mantener Pantalla Encendida.',
    },
    {
      id: 'pt-faq-15',
      question: '¿Puedo instalarlo en la pantalla de inicio del teléfono?',
      answer:
        'Sí. Puedes añadirlo a tu pantalla de inicio desde el menú del navegador o usar el botón Instalar. Tus preferencias quedan guardadas localmente en ese dispositivo.',
    },
  ],
  guide: {
    title: 'La técnica Pomodoro: guía práctica completa',
    description: 'Cómo funciona un ciclo Pomodoro, variaciones 50/10 y 90/20, consejos para estudio, TDAH y errores comunes.',
    readMinutes: 6,
  },
  ui: {
    btnCustomize: 'Personalizar',
    lblFocusMins: 'Enfoque',
    lblShortBreak: 'Pausa corta',
    lblLongBreak: 'Pausa larga',
    lblSessionsPerCycle: 'Sesiones por ciclo',
    unitMin: 'min',
    lblSound: 'Reproducir sonido al terminar',
    lblNotif: 'Notificaciones del navegador',
    lblAutoStart: 'Iniciar siguiente fase automáticamente',
    ariaModePrefix: 'Modo actual:',
    ariaTimer: 'Temporizador Pomodoro',
    modeFocus: 'ENFOQUE',
    modeShortBreak: 'PAUSA CORTA',
    modeLongBreak: 'PAUSA LARGA',
    btnStart: 'Iniciar',
    btnPause: 'Pausar',
    btnReset: 'Reiniciar',
    msgFocusComplete: 'Enfoque completado ✓',
    ariaProgress: 'Progreso de sesiones',
    sessionInitial: 'Sesión 1 de 4',
    sessionTpl: 'Sesión {n} de {total}',
    btnFullScreen: 'Pantalla completa',
    btnRemoveDistractions: 'Sin distracciones',
    ariaBackup: 'Copia de seguridad',
    btnExportJson: 'Exportar JSON',
    btnImportJson: 'Importar JSON',
    lblPasteBackup: 'Pega el JSON de respaldo',
    ariaChooseFile: 'Elegir archivo JSON de respaldo',
    btnImport: 'Importar',
    statsInitial: 'Hoy ● 0 sesiones ● 0 minutos',
    todayWord: 'Hoy',
    unitSessionOne: 'sesión',
    unitSessionMany: 'sesiones',
    unitMinuteOne: 'minuto',
    unitMinuteMany: 'minutos',
    ariaExitFs: 'Salir de pantalla completa',
    dotDone: 'Sesión {i}: completada',
    dotCurrent: 'Sesión {i}: en curso',
    dotRemaining: 'Sesión {i}: pendiente',
    notifBreakTitle: 'Hora de pausa',
    notifBreakBody: 'Tómate un respiro. Pulsa para volver al reloj.',
    notifFocusTitle: '● Pomodoro en marcha',
    notifFocusBody: 'Sesión de enfoque activa. Pulsa para volver.',
    msgFocusNotif: 'Sesión de enfoque terminada. Hora de descansar.',
    msgLongBreakNotif: 'Pausa larga terminada. Hora de volver al enfoque.',
    msgShortBreakNotif: 'Pausa terminada. Vuelta al trabajo.',
    msgRestored: 'Sesión restaurada. Pulsa Iniciar para continuar.',
  },
};
