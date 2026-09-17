/**
 * CONTENIDO OFICIAL DE LA CARTILLA "RETO 5S" - MEDIPIEL
 * Fuente: Cartilla un viaje por las 5S MDP.pdf
 */

export const RETO_INFO = {
  title: "RETO 5S",
  subtitle: "30 días para vivir nuestra cultura",
  tagline: "Una experiencia práctica para convertir las 5S en acciones que se ven, se sienten y se repiten.",
  proposito: "No buscamos memorizar conceptos. Queremos vivir cada S mediante acciones sencillas, conversaciones reales y aprendizajes que puedan convertirse en hábitos.",
  instrucciones: "Marca las casillas, completa las misiones diarias y registra tus experiencias. Tu progreso se guardará automáticamente.",
  reglaDeOro: "Cada actividad termina con tres preguntas: ¿Qué aprendí? ¿Qué cambió gracias a mi acción? ¿Cómo puedo mantenerlo?",
  cierreFrase: "Las 5S no se aprenden de memoria. Se viven: SER desde nuestra esencia, SERVIR con disposición, SABER para crecer, SONREÍR para transformar y SORPRENDER para superar lo esperado."
};

export const CINCO_S = [
  {
    id: "SER",
    name: "SER",
    tag: "Mi sello personal",
    dias: "Días 1 al 5",
    color: "#01606D",
    colorLight: "#E6F4F6",
    proposito: "Reconocer que la cultura comienza en cada persona. SER es actuar con autenticidad, coherencia y responsabilidad.",
    frase: "ME LLEVO ESTO: La cultura no es solamente lo que decimos que somos; es lo que demostramos todos los días.",
    icono: "UserCheck"
  },
  {
    id: "SERVIR",
    name: "SERVIR",
    tag: "La ayuda inesperada",
    dias: "Días 6 al 10",
    color: "#037C8D",
    colorLight: "#E8F8FA",
    proposito: "Observar, anticiparnos y facilitar que otros puedan avanzar. Busca una oportunidad real para ayudar sin esperar a que te lo pidan y activa una pequeña cadena de servicio.",
    frase: "ME LLEVO ESTO: Servir no es hacer el trabajo de los demás. Es facilitar que juntos consigamos mejores resultados.",
    icono: "HeartHandshake"
  },
  {
    id: "SABER",
    name: "SABER",
    tag: "Te enseño en 5 minutos",
    dias: "Días 11 al 14",
    color: "#0F9D7A",
    colorLight: "#E6F8F3",
    proposito: "Promover curiosidad, aprendizaje continuo e intercambio de conocimiento. Elige algo útil que sabes hacer y enséñaselo a otra persona en máximo cinco minutos. Luego intercambien roles.",
    frase: "ME LLEVO ESTO: El conocimiento guardado ayuda a una persona. El conocimiento compartido fortalece a todo el equipo.",
    icono: "BookOpen"
  },
  {
    id: "SONREIR",
    name: "SONREÍR",
    tag: "24 horas de buena energía",
    dias: "Días 16 al 20",
    color: "#E67E22",
    colorLight: "#FDF2E9",
    proposito: "Comprender que nuestra disposición, comunicación y manera de relacionarnos influyen en el ambiente de trabajo.",
    frase: "ME LLEVO ESTO: No siempre podemos elegir lo que sucede, pero sí podemos influir en cómo respondemos.",
    icono: "Smile"
  },
  {
    id: "SORPRENDER",
    name: "SORPRENDER",
    tag: "El 1% extra",
    dias: "Días 21 al 25",
    color: "#8E44AD",
    colorLight: "#F4ECF7",
    proposito: "Estimular la iniciativa y generar experiencias mejores con cambios pequeños pero intencionales.",
    frase: "BANCO DE IDEAS: Escribe una idea que empiece con '¿Y si nosotros...?'. Una gran mejora puede empezar con una pregunta pequeña.",
    icono: "Sparkles"
  }
];

export const ETAPAS = [
  {
    numero: 1,
    nombre: "ETAPA 1 · CONSTRUIMOS DESDE ADENTRO",
    diasRango: "Días 1 al 15",
    pilares: "SER + SERVIR + SABER + Avances",
    descripcion: "En esta primera mitad trabajamos SER, SERVIR y SABER. Empezamos por nuestra forma de actuar, fortalecemos la colaboración y cerramos compartiendo conocimiento.",
    color: "#01606D"
  },
  {
    numero: 2,
    nombre: "ETAPA 2 · TRANSFORMAMOS Y DEJAMOS HUELLA",
    diasRango: "Días 15 al 30",
    pilares: "SONREÍR + SORPRENDER + Integración + Cierre",
    descripcion: "Ahora nos enfocamos en SONREÍR y SORPRENDER, sin abandonar las primeras tres S. Integramos actitud, iniciativa y mejora.",
    color: "#E67E22"
  }
];

/**
 * 8 BLOQUES OFICIALES DE LA CARTILLA
 * La cartilla se llena por bloques de días según cada S.
 */
export const BLOQUES_DATA = [
  {
    id: 1,
    key: "ser",
    sId: "SER",
    sName: "SER",
    titulo: "SER · DÍAS 1 AL 5 — MI SELLO PERSONAL",
    etapa: 1,
    diasRango: "Días 1 al 5",
    dias: [1, 2, 3, 4, 5],
    color: "#01606D",
    colorLight: "#E6F4F6",
    proposito: "Reconocer que la cultura comienza en cada persona. SER es actuar con autenticidad, coherencia y responsabilidad.",
    subtitulo: "Elige tres características por las que quieres ser reconocido y realiza acciones que las hagan visibles.",
    misiones: [
      { dia: 1, mision: "Elijo mis 3 características", evidencia: "Las escribo en esta cartilla." },
      { dia: 2, mision: "Hago una acción que las refleje", evidencia: "Registro qué hice." },
      { dia: 3, mision: "Pido retroalimentación a alguien", evidencia: "Anoto una frase que me sirva." },
      { dia: 4, mision: "Repito o ajusto mi acción", evidencia: "Observo qué cambia." },
      { dia: 5, mision: "Cierro el mini reto", evidencia: "Escribo mi aprendizaje." }
    ],
    fraseMeLlevo: "La cultura no es solamente lo que decimos que somos; es lo que demostramos todos los días.",
    tipoForm: "ser"
  },
  {
    id: 2,
    key: "servir",
    sId: "SERVIR",
    sName: "SERVIR",
    titulo: "SERVIR · DÍAS 6 AL 10 — LA AYUDA INESPERADA",
    etapa: 1,
    diasRango: "Días 6 al 10",
    dias: [6, 7, 8, 9, 10],
    color: "#037C8D",
    colorLight: "#E8F8FA",
    proposito: "Observar, anticiparnos y facilitar que otros puedan avanzar.",
    subtitulo: "Busca una oportunidad real para ayudar sin esperar a que te lo pidan y activa una pequeña cadena de servicio.",
    misiones: [
      { dia: 6, mision: "Observo", evidencia: "¿Quién podría necesitar apoyo?" },
      { dia: 7, mision: "Actúo", evidencia: "Ayudo de forma concreta." },
      { dia: 8, mision: "Escucho", evidencia: "Pregunto si mi ayuda realmente sirvió." },
      { dia: 9, mision: "Comparto", evidencia: "Invito a continuar la cadena." },
      { dia: 10, mision: "Reflexiono", evidencia: "Identifico qué aprendí de servir." }
    ],
    fraseMeLlevo: "Servir no es hacer el trabajo de los demás. Es facilitar que juntos consigamos mejores resultados.",
    tipoForm: "servir"
  },
  {
    id: 3,
    key: "saber",
    sId: "SABER",
    sName: "SABER",
    titulo: "SABER · DÍAS 11 AL 14 — TE ENSEÑO EN 5 MINUTOS",
    etapa: 1,
    diasRango: "Días 11 al 14",
    dias: [11, 12, 13, 14],
    color: "#0F9D7A",
    colorLight: "#E6F8F3",
    proposito: "Promover curiosidad, aprendizaje continuo e intercambio de conocimiento.",
    subtitulo: "Elige algo útil que sabes hacer y enséñaselo a otra persona en máximo cinco minutos. Luego intercambien roles.",
    misiones: [
      { dia: 11, mision: "Elijo qué compartir", evidencia: "Una práctica, atajo o conocimiento útil." },
      { dia: 12, mision: "Lo enseño en 5 minutos", evidencia: "Busco claridad y simplicidad." },
      { dia: 13, mision: "Aprendo de otra persona", evidencia: "Anoto una idea nueva." },
      { dia: 14, mision: "Lo aplico", evidencia: "Pruebo lo aprendido en una situación real." }
    ],
    fraseMeLlevo: "El conocimiento guardado ayuda a una persona. El conocimiento compartido fortalece a todo el equipo.",
    tipoForm: "saber"
  },
  {
    id: 4,
    key: "dia15",
    sId: "AVANCES",
    sName: "ENCUENTRO DE AVANCES",
    titulo: "DÍA 15 · ENCUENTRO DE AVANCES",
    etapa: 1,
    diasRango: "Día 15",
    dias: [15],
    color: "#D97706",
    colorLight: "#FEF3C7",
    proposito: "Este encuentro no es una evaluación tradicional. Es un espacio para contar historias, escuchar y renovar el compromiso.",
    subtitulo: "Integrar · Semáforo 5S y Termómetro personal.",
    misiones: [
      { dia: 15, mision: "Reconocer avances y decidir qué ajustar", evidencia: "Compartir historias y acordar qué dejar de hacer, qué mejorar y qué mantener." }
    ],
    fraseMeLlevo: null,
    tipoForm: "dia15"
  },
  {
    id: 5,
    key: "sonreir",
    sId: "SONREIR",
    sName: "SONREÍR",
    titulo: "SONREÍR · DÍAS 16 AL 20 — 24 HORAS DE BUENA ENERGÍA",
    etapa: 2,
    diasRango: "Días 16 al 20",
    dias: [16, 17, 18, 19, 20],
    color: "#E67E22",
    colorLight: "#FDF2E9",
    proposito: "Comprender que nuestra disposición, comunicación y manera de relacionarnos influyen en el ambiente de trabajo.",
    subtitulo: "Marca tus acciones conscientes de buena energía y transforma una situación.",
    misiones: [
      { dia: 16, mision: "Reconozco", evidencia: "Digo algo positivo y específico a alguien." },
      { dia: 17, mision: "Cambio el lenguaje", evidencia: "Transformo una queja en propuesta." },
      { dia: 18, mision: "Cuido el ambiente", evidencia: "Hago una acción que aporte energía." },
      { dia: 19, mision: "Observo el efecto", evidencia: "Identifico cómo reaccionan otros." },
      { dia: 20, mision: "Elijo un hábito", evidencia: "Decido qué quiero mantener." }
    ],
    fraseMeLlevo: "No siempre podemos elegir lo que sucede, pero sí podemos influir en cómo respondemos.",
    tipoForm: "sonreir"
  },
  {
    id: 6,
    key: "sorprender",
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    titulo: "SORPRENDER · DÍAS 21 AL 25 — EL 1% EXTRA",
    etapa: 2,
    diasRango: "Días 21 al 25",
    dias: [21, 22, 23, 24, 25],
    color: "#8E44AD",
    colorLight: "#F4ECF7",
    proposito: "Estimular la iniciativa y generar experiencias mejores con cambios pequeños pero intencionales.",
    subtitulo: "Detecta una oportunidad simple y prueba tu idea del 1% extra.",
    misiones: [
      { dia: 21, mision: "Detecto una oportunidad", evidencia: "Elijo algo simple que pueda mejorar." },
      { dia: 22, mision: "Diseño el 1% extra", evidencia: "Pienso una mejora pequeña." },
      { dia: 23, mision: "La pruebo", evidencia: "La llevo a una situación real." },
      { dia: 24, mision: "Pido opinión", evidencia: "Escucho a quien recibió el cambio." },
      { dia: 25, mision: "Ajusto", evidencia: "Decido si la mantengo, cambio o descarto." }
    ],
    fraseMeLlevo: "BANCO DE IDEAS: Escribe una idea que empiece con '¿Y si nosotros...?'. Una gran mejora puede empezar con una pregunta pequeña.",
    tipoForm: "sorprender"
  },
  {
    id: 7,
    key: "reto_integrado",
    sId: "INTEGRAR",
    sName: "INTEGRACIÓN",
    titulo: "DÍAS 26 AL 29 · MI RETO 5S COMPLETO",
    etapa: 2,
    diasRango: "Días 26 al 29",
    dias: [26, 27, 28, 29],
    color: "#01606D",
    colorLight: "#E6F4F6",
    proposito: "Diseña una acción que combine al menos tres S. Ejemplo: compartir un conocimiento (SABER), con buena disposición (SONREÍR), para ayudar a alguien (SERVIR).",
    subtitulo: "Integración práctica de las 5S en tu labor cotidiana.",
    misiones: [
      { dia: 26, mision: "Diseño mi acción", evidencia: "Elijo las S que voy a combinar." },
      { dia: 27, mision: "La realizo", evidencia: "La llevo a una situación real." },
      { dia: 28, mision: "Observo el impacto", evidencia: "Pregunto o noto qué cambió." },
      { dia: 29, mision: "La cuento", evidencia: "Comparto mi historia en 60 segundos." }
    ],
    fraseMeLlevo: null,
    tipoForm: "reto_integrado"
  },
  {
    id: 8,
    key: "cierre",
    sId: "CIERRE",
    sName: "CIERRE",
    titulo: "DÍA 30 · CIERRE — DE RETO A HÁBITO",
    etapa: 2,
    diasRango: "Día 30",
    dias: [30],
    color: "#059669",
    colorLight: "#ECFDF5",
    proposito: "Hoy reconocemos cambios, celebramos acciones y elegimos lo que queremos mantener.",
    subtitulo: "Historias que dejan huella, reconocimiento 5S y compromisos para los próximos 30 días.",
    misiones: [
      { dia: 30, mision: "Cerrar el reto y consolidar hábitos", evidencia: "Reconocer a otros, celebrar aprendizajes y renovar compromisos." }
    ],
    fraseMeLlevo: "Las 5S no se aprenden de memoria. Se viven: SER desde nuestra esencia, SERVIR con disposición, SABER para crecer, SONREÍR para transformar y SORPRENDER para superar lo esperado.",
    tipoForm: "cierre"
  }
];

export function getBlockForDay(dayNum) {
  return BLOQUES_DATA.find(b => b.dias.includes(Number(dayNum))) || BLOQUES_DATA[0];
}

/**
 * 30 DÍAS COMPLETOS CON MISIÓN Y EVIDENCIA EXACTAS DE LA CARTILLA
 */
export const DIAS_DATA = [
  // --- SER (Días 1 al 5) ---
  {
    dia: 1,
    etapa: 1,
    sId: "SER",
    sName: "SER",
    sColor: "#01606D",
    tema: "Mi sello personal",
    mision: "Elijo mis 3 características",
    evidencia: "Las escribo en esta cartilla.",
    tipoForm: "ser"
  },
  {
    dia: 2,
    etapa: 1,
    sId: "SER",
    sName: "SER",
    sColor: "#01606D",
    tema: "Mi sello personal",
    mision: "Hago una acción que las refleje",
    evidencia: "Registro qué hice.",
    tipoForm: "ser"
  },
  {
    dia: 3,
    etapa: 1,
    sId: "SER",
    sName: "SER",
    sColor: "#01606D",
    tema: "Mi sello personal",
    mision: "Pido retroalimentación a alguien",
    evidencia: "Anoto una frase que me sirva.",
    tipoForm: "ser"
  },
  {
    dia: 4,
    etapa: 1,
    sId: "SER",
    sName: "SER",
    sColor: "#01606D",
    tema: "Mi sello personal",
    mision: "Repito o ajusto mi acción",
    evidencia: "Observo qué cambia.",
    tipoForm: "ser"
  },
  {
    dia: 5,
    etapa: 1,
    sId: "SER",
    sName: "SER",
    sColor: "#01606D",
    tema: "Mi sello personal",
    mision: "Cierro el mini reto",
    evidencia: "Escribo mi aprendizaje.",
    tipoForm: "ser"
  },

  // --- SERVIR (Días 6 al 10) ---
  {
    dia: 6,
    etapa: 1,
    sId: "SERVIR",
    sName: "SERVIR",
    sColor: "#037C8D",
    tema: "La ayuda inesperada",
    mision: "Observo",
    evidencia: "¿Quién podría necesitar apoyo?",
    tipoForm: "servir"
  },
  {
    dia: 7,
    etapa: 1,
    sId: "SERVIR",
    sName: "SERVIR",
    sColor: "#037C8D",
    tema: "La ayuda inesperada",
    mision: "Actúo",
    evidencia: "Ayudo de forma concreta.",
    tipoForm: "servir"
  },
  {
    dia: 8,
    etapa: 1,
    sId: "SERVIR",
    sName: "SERVIR",
    sColor: "#037C8D",
    tema: "La ayuda inesperada",
    mision: "Escucho",
    evidencia: "Pregunto si mi ayuda realmente sirvió.",
    tipoForm: "servir"
  },
  {
    dia: 9,
    etapa: 1,
    sId: "SERVIR",
    sName: "SERVIR",
    sColor: "#037C8D",
    tema: "La ayuda inesperada",
    mision: "Comparto",
    evidencia: "Invito a continuar la cadena.",
    tipoForm: "servir"
  },
  {
    dia: 10,
    etapa: 1,
    sId: "SERVIR",
    sName: "SERVIR",
    sColor: "#037C8D",
    tema: "La ayuda inesperada",
    mision: "Reflexiono",
    evidencia: "Identifico qué aprendí de servir.",
    tipoForm: "servir"
  },

  // --- SABER (Días 11 al 14) ---
  {
    dia: 11,
    etapa: 1,
    sId: "SABER",
    sName: "SABER",
    sColor: "#0F9D7A",
    tema: "Te enseño en 5 minutos",
    mision: "Elijo qué compartir",
    evidencia: "Una práctica, atajo o conocimiento útil.",
    tipoForm: "saber"
  },
  {
    dia: 12,
    etapa: 1,
    sId: "SABER",
    sName: "SABER",
    sColor: "#0F9D7A",
    tema: "Te enseño en 5 minutos",
    mision: "Lo enseño en 5 minutos",
    evidencia: "Busco claridad y simplicidad.",
    tipoForm: "saber"
  },
  {
    dia: 13,
    etapa: 1,
    sId: "SABER",
    sName: "SABER",
    sColor: "#0F9D7A",
    tema: "Te enseño en 5 minutos",
    mision: "Aprendo de otra persona",
    evidencia: "Anoto una idea nueva.",
    tipoForm: "saber"
  },
  {
    dia: 14,
    etapa: 1,
    sId: "SABER",
    sName: "SABER",
    sColor: "#0F9D7A",
    tema: "Te enseño en 5 minutos",
    mision: "Lo aplico",
    evidencia: "Pruebo lo aprendido en una situación real.",
    tipoForm: "saber"
  },

  // --- DÍA 15 (Encuentro de Avances) ---
  {
    dia: 15,
    etapa: 1,
    sId: "AVANCES",
    sName: "DÍA 15 · ENCUENTRO DE AVANCES",
    sColor: "#D97706",
    tema: "Integrar · Semáforo 5S",
    mision: "Reconocer avances y decidir qué ajustar",
    evidencia: "Este encuentro no es una evaluación tradicional. Es un espacio para contar historias, escuchar y renovar el compromiso.",
    tipoForm: "dia15"
  },

  // --- SONREÍR (Días 16 al 20) ---
  {
    dia: 16,
    etapa: 2,
    sId: "SONREIR",
    sName: "SONREÍR",
    sColor: "#E67E22",
    tema: "24 horas de buena energía",
    mision: "Reconozco",
    evidencia: "Digo algo positivo y específico a alguien.",
    tipoForm: "sonreir"
  },
  {
    dia: 17,
    etapa: 2,
    sId: "SONREIR",
    sName: "SONREÍR",
    sColor: "#E67E22",
    tema: "24 horas de buena energía",
    mision: "Cambio el lenguaje",
    evidencia: "Transformo una queja en propuesta.",
    tipoForm: "sonreir"
  },
  {
    dia: 18,
    etapa: 2,
    sId: "SONREIR",
    sName: "SONREÍR",
    sColor: "#E67E22",
    tema: "24 horas de buena energía",
    mision: "Cuido el ambiente",
    evidencia: "Hago una acción que aporte energía.",
    tipoForm: "sonreir"
  },
  {
    dia: 19,
    etapa: 2,
    sId: "SONREIR",
    sName: "SONREÍR",
    sColor: "#E67E22",
    tema: "24 horas de buena energía",
    mision: "Observo el efecto",
    evidencia: "Identifico cómo reaccionan otros.",
    tipoForm: "sonreir"
  },
  {
    dia: 20,
    etapa: 2,
    sId: "SONREIR",
    sName: "SONREÍR",
    sColor: "#E67E22",
    tema: "24 horas de buena energía",
    mision: "Elijo un hábito",
    evidencia: "Decido qué quiero mantener.",
    tipoForm: "sonreir"
  },

  // --- SORPRENDER (Días 21 al 25) ---
  {
    dia: 21,
    etapa: 2,
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    sColor: "#8E44AD",
    tema: "El 1% extra",
    mision: "Detecto una oportunidad",
    evidencia: "Elijo algo simple que pueda mejorar.",
    tipoForm: "sorprender"
  },
  {
    dia: 22,
    etapa: 2,
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    sColor: "#8E44AD",
    tema: "El 1% extra",
    mision: "Diseño el 1% extra",
    evidencia: "Pienso una mejora pequeña.",
    tipoForm: "sorprender"
  },
  {
    dia: 23,
    etapa: 2,
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    sColor: "#8E44AD",
    tema: "El 1% extra",
    mision: "La pruebo",
    evidencia: "La llevo a una situación real.",
    tipoForm: "sorprender"
  },
  {
    dia: 24,
    etapa: 2,
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    sColor: "#8E44AD",
    tema: "El 1% extra",
    mision: "Pido opinión",
    evidencia: "Escucho a quien recibió el cambio.",
    tipoForm: "sorprender"
  },
  {
    dia: 25,
    etapa: 2,
    sId: "SORPRENDER",
    sName: "SORPRENDER",
    sColor: "#8E44AD",
    tema: "El 1% extra",
    mision: "Ajusto",
    evidencia: "Decido si la mantengo, cambio o descarto.",
    tipoForm: "sorprender"
  },

  // --- INTEGRACIÓN RETO 5S COMPLETO (Días 26 al 29) ---
  {
    dia: 26,
    etapa: 2,
    sId: "INTEGRAR",
    sName: "RETO 5S COMPLETO",
    sColor: "#01606D",
    tema: "Mi acción integrada (mínimo 3 S)",
    mision: "Diseño mi acción",
    evidencia: "Elijo las S que voy a combinar.",
    tipoForm: "reto_integrado"
  },
  {
    dia: 27,
    etapa: 2,
    sId: "INTEGRAR",
    sName: "RETO 5S COMPLETO",
    sColor: "#01606D",
    tema: "Mi acción integrada (mínimo 3 S)",
    mision: "La realizo",
    evidencia: "La llevo a una situación real.",
    tipoForm: "reto_integrado"
  },
  {
    dia: 28,
    etapa: 2,
    sId: "INTEGRAR",
    sName: "RETO 5S COMPLETO",
    sColor: "#01606D",
    tema: "Mi acción integrada (mínimo 3 S)",
    mision: "Observo el impacto",
    evidencia: "Pregunto o noto qué cambió.",
    tipoForm: "reto_integrado"
  },
  {
    dia: 29,
    etapa: 2,
    sId: "INTEGRAR",
    sName: "RETO 5S COMPLETO",
    sColor: "#01606D",
    tema: "Mi acción integrada (mínimo 3 S)",
    mision: "La cuento",
    evidencia: "Comparto mi historia en 60 segundos.",
    tipoForm: "reto_integrado"
  },

  // --- DÍA 30 CIERRE (Historias que dejan huella) ---
  {
    dia: 30,
    etapa: 2,
    sId: "CIERRE",
    sName: "DÍA 30 · CIERRE",
    sColor: "#059669",
    tema: "De reto a hábito",
    mision: "Historias que dejan huella, reconocimiento y compromisos",
    evidencia: "Hoy reconocemos cambios, celebramos acciones y elegimos lo que queremos mantener.",
    tipoForm: "cierre"
  }
];

/**
 * Listado de tiendas sugeridas para autocompletar en el onboarding
 */
export const TIENDAS_MEDIPIEL = [
  "El Tesoro (Medellín)",
  "Santafé (Medellín)",
  "Viva Envigado (Envigado)",
  "Oviedo (Medellín)",
  "Mayorca (Sabaneta)",
  "Molinos (Medellín)",
  "Unicentro (Bogotá)",
  "Andino (Bogotá)",
  "Multiplaza (Bogotá)",
  "Santafé (Bogotá)",
  "Gran Estación (Bogotá)",
  "Parque La Colina (Bogotá)",
  "Chipichape (Cali)",
  "Jardín Plaza (Cali)",
  "Buenavista (Barranquilla)",
  "Mallplaza (Barranquilla)",
  "Caracolí (Bucaramanga)",
  "Cacique (Bucaramanga)",
  "Parque Arboleda (Pereira)",
  "Fundadores (Manizales)",
  "Sede Administrativa / Corporativo",
  "Canal Digital / E-commerce",
  "Otra tienda"
];
