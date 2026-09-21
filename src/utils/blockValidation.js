import { BLOQUES_DATA } from '../data/cartillaContent.js';

/**
 * Validador estricto de requisitos por Bloque de la Cartilla Reto 5S.
 * Garantiza que un colaborador deba responder todas las preguntas y marcar
 * todos los días de las misiones antes de poder avanzar al siguiente bloque.
 */

function isBlank(val) {
  return val === null || val === undefined || (typeof val === 'string' && val.trim().length === 0);
}

/**
 * Evalúa si un bloque específico cumple con todos sus requisitos.
 * @param {number} blockId - ID del bloque (1 al 8)
 * @param {object} participant - Objeto del participante con sus respuestas y días completados
 * @returns {object} { isComplete, missingDays, missingFields, block }
 */
export function validateBlockRequirements(blockId, participant = {}) {
  const block = BLOQUES_DATA.find(b => b.id === Number(blockId));
  if (!block) {
    return { isComplete: true, missingDays: [], missingFields: [], block: null };
  }

  const completados = Array.isArray(participant?.dias_completados) ? participant.dias_completados : [];
  const missingDays = block.dias.filter(d => !completados.includes(d));
  const missingFields = [];

  switch (block.tipoForm) {
    case 'ser': // Bloque 1 (Días 1 al 5)
      if (isBlank(participant.intencion_30_dias)) {
        missingFields.push('Mi intención para estos 30 días (Propósito personal)');
      }
      if (isBlank(participant.ser_caracteristica_1)) {
        missingFields.push('Primera cualidad: "Quiero que me reconozcan como..."');
      }
      if (isBlank(participant.ser_caracteristica_2)) {
        missingFields.push('Segunda característica');
      }
      if (isBlank(participant.ser_caracteristica_3)) {
        missingFields.push('Tercera característica');
      }
      if (isBlank(participant.ser_accion)) {
        missingFields.push('La acción concreta que voy a demostrar');
      }
      if (isBlank(participant.ser_descubrimiento)) {
        missingFields.push('¿Qué descubrí de mí?');
      }
      break;

    case 'servir': // Bloque 2 (Días 6 al 10)
      if (!Array.isArray(participant.servir_tipos_ayuda) || participant.servir_tipos_ayuda.length === 0) {
        missingFields.push('Seleccionar al menos un tipo de ayuda brindado');
      }
      if (isBlank(participant.servir_a_quien)) {
        missingFields.push('¿A quién apoyé y qué necesidad observé?');
      }
      if (isBlank(participant.servir_que_hice)) {
        missingFields.push('¿Qué hice?');
      }
      if (isBlank(participant.servir_cambio)) {
        missingFields.push('¿Qué cambió gracias a mi ayuda?');
      }
      break;

    case 'saber': // Bloque 3 (Días 11 al 14)
      if (isBlank(participant.saber_que_ensene)) {
        missingFields.push('Lo que enseñé y a quién se lo compartí');
      }
      if (isBlank(participant.saber_que_aprendi)) {
        missingFields.push('Lo que aprendí de otra persona');
      }
      if (isBlank(participant.saber_donde_aplicar)) {
        missingFields.push('¿Dónde lo voy a aplicar?');
      }
      break;

    case 'dia15': // Bloque 4 (Día 15)
      if (isBlank(participant.dia15_historia)) {
        missingFields.push('Historia en 1 minuto (¿Qué hice? ¿Qué pasó? ¿Qué aprendí?)');
      }
      if (isBlank(participant.dia15_rojo)) {
        missingFields.push('Semáforo Rojo: Algo que debo dejar de hacer');
      }
      if (isBlank(participant.dia15_amarillo)) {
        missingFields.push('Semáforo Amarillo: Algo que necesito mejorar');
      }
      if (isBlank(participant.dia15_verde)) {
        missingFields.push('Semáforo Verde: Algo que quiero mantener');
      }
      if (isBlank(participant.dia15_s_fortalecer)) {
        missingFields.push('La S que quiero fortalecer y qué haré diferente');
      }
      if (isBlank(participant.dia15_comportamiento)) {
        missingFields.push('Pregunta de salida: Comportamiento visible');
      }
      break;

    case 'sonreir': // Bloque 5 (Días 16 al 20)
      const hasAction = Boolean(
        participant.sonreir_reconocimiento ||
        participant.sonreir_queja ||
        participant.sonreir_ambiente
      );
      if (!hasAction) {
        missingFields.push('Marcar al menos una acción de buena energía');
      }
      if (isBlank(participant.sonreir_situacion)) {
        missingFields.push('La situación que decidí transformar');
      }
      if (isBlank(participant.sonreir_reaccion)) {
        missingFields.push('¿Cómo habría reaccionado antes y cómo respondí esta vez?');
      }
      if (isBlank(participant.sonreir_efecto)) {
        missingFields.push('¿Qué efecto tuvo?');
      }
      break;

    case 'sorprender': // Bloque 6 (Días 21 al 25)
      if (isBlank(participant.sorprender_oportunidad)) {
        missingFields.push('Algo cotidiano que podemos mejorar');
      }
      if (isBlank(participant.sorprender_idea)) {
        missingFields.push('Mi idea del 1% extra');
      }
      if (isBlank(participant.sorprender_prueba)) {
        missingFields.push('¿Cómo la puse a prueba y qué pasó?');
      }
      if (isBlank(participant.sorprender_resultado)) {
        missingFields.push('Resultado de la prueba (Funcionó / Parcial / Aprendizaje)');
      }
      if (isBlank(participant.sorprender_y_si)) {
        missingFields.push('Banco de Ideas: "¿Y si nosotros...?"');
      }
      break;

    case 'reto_integrado': // Bloque 7 (Días 26 al 29)
      if (!Array.isArray(participant.reto_integrado_s) || participant.reto_integrado_s.length < 3) {
        missingFields.push('Seleccionar al menos 3 S para integrar');
      }
      if (isBlank(participant.reto_integrado_accion)) {
        missingFields.push('Mi acción integrada será');
      }
      if (isBlank(participant.reto_integrado_beneficiario)) {
        missingFields.push('¿A quién o qué beneficiará?');
      }
      if (isBlank(participant.reto_integrado_resultado)) {
        missingFields.push('¿Qué ocurrió y qué enseñanza quiero conservar?');
      }
      break;

    case 'cierre': // Bloque 8 (Día 30)
      if (isBlank(participant.cierre_situacion)) {
        missingFields.push('Situación · ¿Qué estaba pasando?');
      }
      if (isBlank(participant.cierre_accion)) {
        missingFields.push('Acción · ¿Qué hice diferente?');
      }
      if (isBlank(participant.cierre_resultado)) {
        missingFields.push('Resultado · ¿Qué cambió?');
      }
      if (isBlank(participant.cierre_aprendizaje)) {
        missingFields.push('Aprendizaje · ¿Qué me llevo?');
      }
      if (isBlank(participant.reconocimiento_persona)) {
        missingFields.push('Reconocimiento: A quién reconozco');
      }
      if (!Array.isArray(participant.reconocimiento_s) || participant.reconocimiento_s.length === 0) {
        missingFields.push('Reconocimiento: Al menos una S destacada');
      }
      if (isBlank(participant.reconocimiento_motivo)) {
        missingFields.push('Reconocimiento: Motivo sincero');
      }
      if (isBlank(participant.compromiso_ser)) {
        missingFields.push('Compromiso SER · Voy a seguir...');
      }
      if (isBlank(participant.compromiso_servir)) {
        missingFields.push('Compromiso SERVIR · Voy a seguir...');
      }
      if (isBlank(participant.compromiso_saber)) {
        missingFields.push('Compromiso SABER · Voy a seguir...');
      }
      if (isBlank(participant.compromiso_sonreir)) {
        missingFields.push('Compromiso SONREÍR · Voy a seguir...');
      }
      if (isBlank(participant.compromiso_sorprender)) {
        missingFields.push('Compromiso SORPRENDER · Voy a seguir...');
      }
      if (isBlank(participant.compromiso_30_dias)) {
        missingFields.push('Mi compromiso concreto para los próximos 30 días');
      }
      break;

    default:
      break;
  }

  const isComplete = missingDays.length === 0 && missingFields.length === 0;

  return {
    isComplete,
    missingDays,
    missingFields,
    block
  };
}

/**
 * Determina si un bloque está desbloqueado para navegación.
 * Un bloque target está desbloqueado si todos los bloques anteriores están completados.
 * @param {number} targetBlockId - ID del bloque al que se desea acceder
 * @param {object} participant - Datos del participante
 * @returns {boolean}
 */
export function isBlockUnlocked(targetBlockId, participant = {}) {
  const targetId = Number(targetBlockId);
  if (targetId <= 1) return true; // El bloque 1 siempre está accesible

  // Todos los bloques anteriores (1 hasta targetId - 1) deben estar completos
  for (let i = 1; i < targetId; i++) {
    const { isComplete } = validateBlockRequirements(i, participant);
    if (!isComplete) return false;
  }
  return true;
}

/**
 * Encuentra el primer bloque incompleto del participante.
 * @param {object} participant
 * @returns {number} ID del primer bloque incompleto (1 al 8)
 */
export function getFirstIncompleteBlock(participant = {}) {
  for (const block of BLOQUES_DATA) {
    const { isComplete } = validateBlockRequirements(block.id, participant);
    if (!isComplete) return block.id;
  }
  return BLOQUES_DATA[BLOQUES_DATA.length - 1].id;
}
