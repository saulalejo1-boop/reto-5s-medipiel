/**
 * Utilidad para exportación de datos a formato CSV compatible con Microsoft Excel
 * Utiliza codificación UTF-8 con BOM (\uFEFF) para garantizar que los acentos,
 * eñes y caracteres especiales en español se abran correctamente en Excel.
 */

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  if (Array.isArray(val)) {
    val = val.join(', ');
  } else if (typeof val === 'boolean') {
    val = val ? 'Sí' : 'No';
  } else if (typeof val === 'number') {
    return String(val);
  } else {
    val = String(val);
  }
  // Escapar comillas dobles duplicándolas
  const escaped = val.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function exportParticipantsToCsv(participants, filename = 'Reporte_Reto_5S_Medipiel.csv') {
  if (!Array.isArray(participants) || participants.length === 0) {
    alert('No hay participantes registrados para exportar.');
    return;
  }

  const headers = [
    'ID Participante',
    'Nombre Completo',
    'Tienda o Sede',
    'Porcentaje de Avance (%)',
    'Días Completados (Cantidad)',
    'Días Completados (Detalle)',
    'Día Actual',
    'Fecha de Inicio',
    'Última Actualización',
    'Intención para los 30 Días',

    // SER
    'SER: Característica 1',
    'SER: Característica 2',
    'SER: Característica 3',
    'SER: Acción Concreta Demostrada',
    'SER: Qué Descubrió de Sí Mismo(a)',

    // SERVIR
    'SERVIR: Tipos de Ayuda Brindados',
    'SERVIR: A Quién Apoyó',
    'SERVIR: Necesidad Observada',
    'SERVIR: Qué Hizo Concretamente',
    'SERVIR: Qué Cambió Gracias a la Ayuda',

    // SABER
    'SABER: Lo que Enseñó en 5 Minutos',
    'SABER: A Quién se lo Compartió',
    'SABER: Lo que Aprendió de Otra Persona',
    'SABER: Dónde lo va a Aplicar',

    // DÍA 15
    'DÍA 15: Historia en 1 Minuto',
    'DÍA 15: Semáforo Rojo (Frenos o Dificultades)',
    'DÍA 15: Semáforo Amarillo (En Observación)',
    'DÍA 15: Semáforo Verde (Lo que Funciona Muy Bien)',
    'DÍA 15: Termómetro SER (1-5)',
    'DÍA 15: Termómetro SERVIR (1-5)',
    'DÍA 15: Termómetro SABER (1-5)',
    'DÍA 15: Termómetro SONREÍR (1-5)',
    'DÍA 15: Termómetro SORPRENDER (1-5)',
    'DÍA 15: S a Fortalecer en Etapa 2',
    'DÍA 15: Comportamiento Visible a Demostrar',
    'DÍA 15: Meta para la Etapa 2',

    // SONREÍR
    'SONREÍR: Reconocí y Agradecí (Sí/No)',
    'SONREÍR: Transformé Queja en Propuesta (Sí/No)',
    'SONREÍR: Cuidé el Ambiente Positivo (Sí/No)',
    'SONREÍR: Situación Difícil o Tensa',
    'SONREÍR: Cómo Reaccioné antes vs ahora',
    'SONREÍR: Efecto en el Equipo o Clientes',

    // SORPRENDER
    'SORPRENDER: Oportunidad de Mejora Observada',
    'SORPRENDER: Idea del 1% Extra',
    'SORPRENDER: Prueba Realizada en Tienda',
    'SORPRENDER: Resultado de la Prueba',
    'SORPRENDER: Banco de Ideas (¿Y si nosotros...?)',

    // INTEGRACIÓN 5S
    'INTEGRACIÓN 5S: S Elegidas (Mín. 3)',
    'INTEGRACIÓN 5S: Acción Demostrada',
    'INTEGRACIÓN 5S: A Quién Benefició',
    'INTEGRACIÓN 5S: Resultado Observado',
    'INTEGRACIÓN 5S: Aprendizaje del Reto Integrado',

    // PASAPORTE
    'PASAPORTE: Momento Favorito y S más Fortalecida',

    // DÍA 30 CIERRE
    'DÍA 30: Situación donde se Demostró una S',
    'DÍA 30: Acción Realizada',
    'DÍA 30: Resultado Obtenido',
    'DÍA 30: Aprendizaje Principal',
    'DÍA 30: Reconocimiento a Compañero(a)',
    'DÍA 30: Pilares Reconocidos',
    'DÍA 30: Motivo del Reconocimiento',

    // COMPROMISOS
    'COMPROMISOS: Con SER',
    'COMPROMISOS: Con SERVIR',
    'COMPROMISOS: Con SABER',
    'COMPROMISOS: Con SONREÍR',
    'COMPROMISOS: Con SORPRENDER',
    'COMPROMISOS: Para los Próximos 30 Días',
    'Fecha de Finalización'
  ];

  const rows = participants.map(p => {
    const diasCompletados = Array.isArray(p.dias_completados) ? p.dias_completados : [];
    const diasDetalle = diasCompletados.join(', ');

    return [
      escapeCsvField(p.participant_id || ''),
      escapeCsvField(p.nombre || ''),
      escapeCsvField(p.tienda || ''),
      escapeCsvField(p.porcentaje_avance || 0),
      escapeCsvField(diasCompletados.length),
      escapeCsvField(diasDetalle),
      escapeCsvField(p.dia_actual || 1),
      escapeCsvField(p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString() : ''),
      escapeCsvField(p.fecha_ultima_actualizacion ? new Date(p.fecha_ultima_actualizacion).toLocaleString() : ''),
      escapeCsvField(p.intencion_30_dias || ''),

      // SER
      escapeCsvField(p.ser_caracteristica_1 || ''),
      escapeCsvField(p.ser_caracteristica_2 || ''),
      escapeCsvField(p.ser_caracteristica_3 || ''),
      escapeCsvField(p.ser_accion || ''),
      escapeCsvField(p.ser_descubrimiento || ''),

      // SERVIR
      escapeCsvField(p.servir_tipos_ayuda || []),
      escapeCsvField(p.servir_a_quien || ''),
      escapeCsvField(p.servir_necesidad || ''),
      escapeCsvField(p.servir_que_hice || ''),
      escapeCsvField(p.servir_cambio || ''),

      // SABER
      escapeCsvField(p.saber_que_ensene || ''),
      escapeCsvField(p.saber_a_quien || ''),
      escapeCsvField(p.saber_que_aprendi || ''),
      escapeCsvField(p.saber_donde_aplicar || ''),

      // DÍA 15
      escapeCsvField(p.dia15_historia || ''),
      escapeCsvField(p.dia15_rojo || ''),
      escapeCsvField(p.dia15_amarillo || ''),
      escapeCsvField(p.dia15_verde || ''),
      escapeCsvField(p.dia15_ser || ''),
      escapeCsvField(p.dia15_servir || ''),
      escapeCsvField(p.dia15_saber || ''),
      escapeCsvField(p.dia15_sonreir || ''),
      escapeCsvField(p.dia15_sorprender || ''),
      escapeCsvField(p.dia15_s_fortalecer || ''),
      escapeCsvField(p.dia15_comportamiento || ''),
      escapeCsvField(p.meta_etapa2 || ''),

      // SONREÍR
      escapeCsvField(p.sonreir_reconocimiento),
      escapeCsvField(p.sonreir_queja),
      escapeCsvField(p.sonreir_ambiente),
      escapeCsvField(p.sonreir_situacion || ''),
      escapeCsvField(p.sonreir_reaccion || ''),
      escapeCsvField(p.sonreir_efecto || ''),

      // SORPRENDER
      escapeCsvField(p.sorprender_oportunidad || ''),
      escapeCsvField(p.sorprender_idea || ''),
      escapeCsvField(p.sorprender_prueba || ''),
      escapeCsvField(p.sorprender_resultado || ''),
      escapeCsvField(p.sorprender_y_si || ''),

      // INTEGRACIÓN 5S
      escapeCsvField(p.reto_integrado_s || []),
      escapeCsvField(p.reto_integrado_accion || ''),
      escapeCsvField(p.reto_integrado_beneficiario || ''),
      escapeCsvField(p.reto_integrado_resultado || ''),
      escapeCsvField(p.reto_integrado_aprendizaje || ''),

      // PASAPORTE
      escapeCsvField(p.pasaporte_momento_favorito || ''),

      // DÍA 30 CIERRE
      escapeCsvField(p.cierre_situacion || ''),
      escapeCsvField(p.cierre_accion || ''),
      escapeCsvField(p.cierre_resultado || ''),
      escapeCsvField(p.cierre_aprendizaje || ''),
      escapeCsvField(p.reconocimiento_persona || ''),
      escapeCsvField(p.reconocimiento_s || []),
      escapeCsvField(p.reconocimiento_motivo || ''),

      // COMPROMISOS
      escapeCsvField(p.compromiso_ser || ''),
      escapeCsvField(p.compromiso_servir || ''),
      escapeCsvField(p.compromiso_saber || ''),
      escapeCsvField(p.compromiso_sonreir || ''),
      escapeCsvField(p.compromiso_sorprender || ''),
      escapeCsvField(p.compromiso_30_dias || ''),
      escapeCsvField(p.fecha_finalizacion || '')
    ].join(',');
  });

  // BOM \uFEFF para que Microsoft Excel en Windows/Mac reconozca caracteres latinos correctamente
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
