import * as XLSX from 'xlsx';

/**
 * SERVICIO DE EXPORTACIÓN A MICROSOFT EXCEL (.XLSX)
 * Genera un libro de Excel nativo (.xlsx) con múltiples pestañas organizadas,
 * anchos de columna dinámicos y formatos limpios.
 */

function formatValue(val) {
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) {
    return val.join(', ');
  }
  if (typeof val === 'boolean') {
    return val ? 'Sí' : 'No';
  }
  return val;
}

/**
 * Calcula anchos de columnas adaptativos según el contenido
 */
function calculateColWidths(headers, rows) {
  return headers.map((header, colIndex) => {
    let maxLen = String(header || '').length;
    const sampleSize = Math.min(rows.length, 300);
    for (let r = 0; r < sampleSize; r++) {
      const cellVal = rows[r] ? rows[r][colIndex] : null;
      if (cellVal != null) {
        const len = String(cellVal).length;
        if (len > maxLen) {
          maxLen = len;
        }
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 12), 48) };
  });
}

/**
 * Genera y descarga el informe consolidado en formato nativo de Excel (.xlsx)
 */
export function exportParticipantsToExcel(participants, customFilename) {
  if (!Array.isArray(participants) || participants.length === 0) {
    alert('No hay participantes registrados para exportar.');
    return;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Reporte_Reto_5S_Medipiel_${dateStr}.xlsx`;

  const wb = XLSX.utils.book_new();

  // --------------------------------------------------------------------------
  // HOJA 1: RESUMEN EJECUTIVO Y POR TIENDAS
  // --------------------------------------------------------------------------
  const total = participants.length;
  const completed = participants.filter(p => (p.porcentaje_avance || 0) >= 100).length;
  const dia15Plus = participants.filter(p => {
    const d = Array.isArray(p.dias_completados) ? p.dias_completados.length : 0;
    return d >= 15 && (p.porcentaje_avance || 0) < 100;
  }).length;
  const inProgress = total - completed;
  const avgAdvance = total > 0
    ? Math.round(participants.reduce((acc, p) => acc + (Number(p.porcentaje_avance) || 0), 0) / total)
    : 0;

  // Agrupación por Tienda / Sede
  const storeMap = new Map();
  participants.forEach(p => {
    const store = (p.tienda || 'Sin Tienda Asignada').trim();
    if (!storeMap.has(store)) {
      storeMap.set(store, { total: 0, completed: 0, sumAdvance: 0 });
    }
    const stat = storeMap.get(store);
    stat.total += 1;
    stat.sumAdvance += Number(p.porcentaje_avance) || 0;
    if ((p.porcentaje_avance || 0) >= 100) stat.completed += 1;
  });

  const resumenRows = [
    ['RETO 5S MEDIPIEL - INFORME CONSOLIDADO EJECUTIVO'],
    [`Generado el: ${new Date().toLocaleString()}`],
    [''],
    ['INDICADOR CLAVE', 'VALOR'],
    ['Total de Colaboradores Registrados', total],
    ['Promedio General de Avance', `${avgAdvance}%`],
    ['Colaboradores con Reto Finalizado (100%)', completed],
    ['Colaboradores en Encuentro de Mitad (Día 15+)', dia15Plus],
    ['Colaboradores en Curso', inProgress],
    [''],
    ['DESGLOSE POR TIENDA / SEDE', 'COLABORADORES', 'PROMEDIO AVANCE', 'FINALIZADOS']
  ];

  Array.from(storeMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([storeName, stat]) => {
      const avgStore = Math.round(stat.sumAdvance / stat.total);
      resumenRows.push([
        storeName,
        stat.total,
        `${avgStore}%`,
        stat.completed
      ]);
    });

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
  wsResumen['!cols'] = [
    { wch: 42 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 }
  ];
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Ejecutivo');

  // --------------------------------------------------------------------------
  // HOJA 2: DIRECTORIO GENERAL DE COLABORADORES
  // --------------------------------------------------------------------------
  const headersDirectorio = [
    'ID Participante',
    'Nombre Completo',
    'Tienda o Sede',
    'Avance (%)',
    'Total Días Completados',
    'Día Actual',
    'Días Completados (Lista)',
    'Fecha Inicio',
    'Última Actualización',
    'Intención para los 30 Días',
    'Estado'
  ];

  const rowsDirectorio = participants.map(p => {
    const compl = Array.isArray(p.dias_completados) ? p.dias_completados : [];
    const pct = Number(p.porcentaje_avance) || (compl.length ? Math.min(100, Math.round((compl.length / 30) * 100)) : 0);
    const estado = pct >= 100 ? 'Finalizado' : compl.length >= 15 ? 'Etapa 2 (Día 15+)' : 'Etapa 1 (En curso)';

    return [
      p.participant_id || '',
      p.nombre || '',
      p.tienda || '',
      pct,
      compl.length,
      p.dia_actual || 1,
      compl.join(', '),
      p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString() : '',
      p.fecha_ultima_actualizacion ? new Date(p.fecha_ultima_actualizacion).toLocaleString() : '',
      p.intencion_30_dias || '',
      estado
    ];
  });

  const wsDirectorio = XLSX.utils.aoa_to_sheet([headersDirectorio, ...rowsDirectorio]);
  wsDirectorio['!cols'] = calculateColWidths(headersDirectorio, rowsDirectorio);
  XLSX.utils.book_append_sheet(wb, wsDirectorio, 'Directorio General');

  // --------------------------------------------------------------------------
  // HOJA 3: RESPUESTAS Y REFLEXIONES COMPLETAS (5S)
  // --------------------------------------------------------------------------
  const headersReflexiones = [
    'Nombre Completo',
    'Tienda o Sede',
    'Avance (%)',
    'Intención 30 Días',

    // SER
    'SER: Característica 1',
    'SER: Característica 2',
    'SER: Característica 3',
    'SER: Acción Demostrada',
    'SER: Descubrimiento Personal',

    // SERVIR
    'SERVIR: Tipos de Ayuda',
    'SERVIR: A Quién Apoyó',
    'SERVIR: Necesidad Observada',
    'SERVIR: Qué Hizo',
    'SERVIR: Qué Cambió',

    // SABER
    'SABER: Qué Enseñó',
    'SABER: A Quién Compartió',
    'SABER: Qué Aprendió de Otro',
    'SABER: Dónde lo Aplicará',

    // DÍA 15
    'D15: Historia 1 Minuto',
    'D15: Semáforo Rojo (Frenos)',
    'D15: Semáforo Amarillo (Atención)',
    'D15: Semáforo Verde (Éxitos)',
    'D15: Termómetro SER (1-5)',
    'D15: Termómetro SERVIR (1-5)',
    'D15: Termómetro SABER (1-5)',
    'D15: Termómetro SONREÍR (1-5)',
    'D15: Termómetro SORPRENDER (1-5)',
    'D15: S a Fortalecer',
    'D15: Comportamiento Visible',
    'D15: Meta Etapa 2',

    // SONREÍR
    'SONREÍR: Reconoció Positivo',
    'SONREÍR: Transformó Queja',
    'SONREÍR: Mejoró Ambiente',
    'SONREÍR: Situación Difícil',
    'SONREÍR: Reacción Antes vs Ahora',
    'SONREÍR: Efecto Logrado',

    // SORPRENDER
    'SORPRENDER: Oportunidad Observada',
    'SORPRENDER: Idea 1% Extra',
    'SORPRENDER: Prueba Realizada',
    'SORPRENDER: Resultado Prueba',
    'SORPRENDER: ¿Y si nosotros...?',

    // RETO INTEGRADO
    'RETO INTEGRADO: S Elegidas',
    'RETO INTEGRADO: Acción Demostrada',
    'RETO INTEGRADO: A Quién Benefició',
    'RETO INTEGRADO: Resultado Observado',
    'RETO INTEGRADO: Aprendizaje Obtenido',

    // PASAPORTE
    'PASAPORTE: Momento Favorito y S',

    // DÍA 30 CIERRE
    'D30: Situación Demostrada',
    'D30: Acción Realizada',
    'D30: Resultado Obtenido',
    'D30: Aprendizaje Principal',
    'D30: Reconocimiento a Compañero(a)',
    'D30: Pilares Reconocidos',
    'D30: Motivo del Reconocimiento',

    // COMPROMISOS
    'COMPROMISO: Con SER',
    'COMPROMISO: Con SERVIR',
    'COMPROMISO: Con SABER',
    'COMPROMISO: Con SONREÍR',
    'COMPROMISO: Con SORPRENDER',
    'COMPROMISO: Próximos 30 Días'
  ];

  const rowsReflexiones = participants.map(p => {
    return [
      p.nombre || '',
      p.tienda || '',
      Number(p.porcentaje_avance) || 0,
      p.intencion_30_dias || '',

      // SER
      p.ser_caracteristica_1 || '',
      p.ser_caracteristica_2 || '',
      p.ser_caracteristica_3 || '',
      p.ser_accion || '',
      p.ser_descubrimiento || '',

      // SERVIR
      formatValue(p.servir_tipos_ayuda),
      p.servir_a_quien || '',
      p.servir_necesidad || '',
      p.servir_que_hice || '',
      p.servir_cambio || '',

      // SABER
      p.saber_que_ensene || '',
      p.saber_a_quien || '',
      p.saber_que_aprendi || '',
      p.saber_donde_aplicar || '',

      // DÍA 15
      p.dia15_historia || '',
      p.dia15_rojo || '',
      p.dia15_amarillo || '',
      p.dia15_verde || '',
      p.dia15_ser || '',
      p.dia15_servir || '',
      p.dia15_saber || '',
      p.dia15_sonreir || '',
      p.dia15_sorprender || '',
      p.dia15_s_fortalecer || '',
      p.dia15_comportamiento || '',
      p.meta_etapa2 || '',

      // SONREÍR
      formatValue(p.sonreir_reconocimiento),
      formatValue(p.sonreir_queja),
      formatValue(p.sonreir_ambiente),
      p.sonreir_situacion || '',
      p.sonreir_reaccion || '',
      p.sonreir_efecto || '',

      // SORPRENDER
      p.sorprender_oportunidad || '',
      p.sorprender_idea || '',
      p.sorprender_prueba || '',
      p.sorprender_resultado || '',
      p.sorprender_y_si || '',

      // RETO INTEGRADO
      formatValue(p.reto_integrado_s),
      p.reto_integrado_accion || '',
      p.reto_integrado_beneficiario || '',
      p.reto_integrado_resultado || '',
      p.reto_integrado_aprendizaje || '',

      // PASAPORTE
      p.pasaporte_momento_favorito || '',

      // DÍA 30 CIERRE
      p.cierre_situacion || '',
      p.cierre_accion || '',
      p.cierre_resultado || '',
      p.cierre_aprendizaje || '',
      p.reconocimiento_persona || '',
      formatValue(p.reconocimiento_s),
      p.reconocimiento_motivo || '',

      // COMPROMISOS
      p.compromiso_ser || '',
      p.compromiso_servir || '',
      p.compromiso_saber || '',
      p.compromiso_sonreir || '',
      p.compromiso_sorprender || '',
      p.compromiso_30_dias || ''
    ];
  });

  const wsReflexiones = XLSX.utils.aoa_to_sheet([headersReflexiones, ...rowsReflexiones]);
  wsReflexiones['!cols'] = calculateColWidths(headersReflexiones, rowsReflexiones);
  XLSX.utils.book_append_sheet(wb, wsReflexiones, 'Respuestas y 5S');

  // Descarga directa del archivo .xlsx en el navegador
  XLSX.writeFile(wb, filename);
}
