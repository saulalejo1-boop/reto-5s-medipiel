/**
 * =========================================================================
 * MEDIPIEL - RETO 5S: "30 DÍAS PARA VIVIR NUESTRA CULTURA"
 * BACKEND EN GOOGLE APPS SCRIPT (Google Sheets)
 * =========================================================================
 * 
 * Este script actúa como API Web (Web App) para recibir en tiempo real
 * los avances, reflexiones y compromisos de los colaboradores de Medipiel
 * y guardarlos en una hoja de cálculo corporativa en Google Drive.
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. En Google Drive, crea una Hoja de Cálculo llamada: "Medipiel - Reto 5S"
 * 2. En el menú superior: Extensiones -> Apps Script
 * 3. Borra cualquier código existente y pega este archivo completo.
 * 4. Guarda con Ctrl + S.
 * 5. Clic en "Implementar" (Deploy) -> "Nueva implementación".
 * 6. Tipo: "Aplicación web".
 * 7. Configuración:
 *    - Descripción: "API Reto 5S Medipiel v1"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone) -> ¡Muy importante!
 * 8. Clic en "Implementar", autoriza los permisos requeridos.
 * 9. Copia la "URL de la aplicación web" (termina en /exec)
 *    y pégala en los ajustes de la aplicación web o en api.js.
 * =========================================================================
 */

const SHEET_NAME = "Respuestas Reto 5S";

const HEADERS = [
  "ID Participante",
  "Nombre Completo",
  "Tienda / Sede",
  "Fecha Inicio",
  "Última Actualización",
  "Día Actual",
  "Progreso (%)",
  "Total Días Completados",
  "Días Completados (Lista)",
  "Intención 30 Días",

  // SER (Días 1-5)
  "SER - Característica 1",
  "SER - Característica 2",
  "SER - Característica 3",
  "SER - Acción Concreta",
  "SER - Qué descubrí de mí",

  // SERVIR (Días 6-10)
  "SERVIR - Tipos de Ayuda",
  "SERVIR - A quién apoyé",
  "SERVIR - Necesidad observada",
  "SERVIR - Qué hice",
  "SERVIR - Qué cambió",

  // SABER (Días 11-14)
  "SABER - Qué enseñé y a quién",
  "SABER - Qué aprendí de otro",
  "SABER - Dónde lo aplicaré",

  // DÍA 15 (Encuentro de Avances)
  "D15 - Historia 1 minuto",
  "D15 - Semáforo Rojo (Dejar de hacer)",
  "D15 - Semáforo Amarillo (Mejorar)",
  "D15 - Semáforo Verde (Mantener)",
  "D15 - Termómetro SER (1-5)",
  "D15 - Termómetro SERVIR (1-5)",
  "D15 - Termómetro SABER (1-5)",
  "D15 - Termómetro SONREÍR (1-5)",
  "D15 - Termómetro SORPRENDER (1-5)",
  "D15 - S a Fortalecer",
  "D15 - Comportamiento de salida",

  // SONREÍR (Días 16-20)
  "SONREÍR - Reconocí algo positivo",
  "SONREÍR - Transformé queja en propuesta",
  "SONREÍR - Mejoré el ambiente",
  "SONREÍR - Situación transformada",
  "SONREÍR - Reacción antes vs ahora",
  "SONREÍR - Efecto logrado",

  // SORPRENDER (Días 21-25)
  "SORPRENDER - Oportunidad cotidiana",
  "SORPRENDER - Idea 1% extra",
  "SORPRENDER - Prueba y qué pasó",
  "SORPRENDER - Resultado (Funcionó)",
  "SORPRENDER - Banco de ideas (¿Y si nosotros...?)",

  // RETO INTEGRADO (Días 26-29)
  "RETO INTEGRADO - S Combinadas",
  "RETO INTEGRADO - Acción",
  "RETO INTEGRADO - Beneficiario",
  "RETO INTEGRADO - Resultado",
  "RETO INTEGRADO - Enseñanza",

  // PASAPORTE
  "PASAPORTE - Momento Favorito y S",

  // DÍA 30 CIERRE
  "CIERRE - Situación",
  "CIERRE - Acción",
  "CIERRE - Resultado",
  "CIERRE - Aprendizaje",
  "RECONOCIMIENTO - Persona",
  "RECONOCIMIENTO - S Destacada",
  "RECONOCIMIENTO - Motivo",

  // COMPROMISOS
  "COMPROMISO - SER",
  "COMPROMISO - SERVIR",
  "COMPROMISO - SABER",
  "COMPROMISO - SONREÍR",
  "COMPROMISO - SORPRENDER",
  "COMPROMISO - 30 Días Siguientes",
  "Fecha Finalización"
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    formatHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaders(sheet);
  }
  
  return sheet;
}

function formatHeaders(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground("#01606D"); // Petrol Corporativo Medipiel
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);
}

function doPost(e) {
  try {
    let payload;
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      payload = JSON.parse(e.parameter.data);
    } else {
      payload = e.parameter || {};
    }

    const participant = payload.participant || payload;
    const result = saveOrUpdateParticipant(participant);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registro del Reto 5S guardado correctamente",
      result: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizeName(str) {
  if (!str) return "";
  return str.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "";

    // 1. Obtener un participante específico por nombre o ID
    if (action === "get_participant" || action === "find") {
      const searchName = normalizeName((e && e.parameter && e.parameter.nombre) || "");
      const searchId = ((e && e.parameter && e.parameter.id) || "").toString().trim();
      const sheet = getOrCreateSheet();
      const data = sheet.getDataRange().getValues();

      if (data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "not_found",
          found: false,
          participant: null
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const headers = data[0];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowId = (row[0] || "").toString().trim();
        const rowName = normalizeName(row[1] || "");

        if ((searchId && rowId === searchId) || (searchName && rowName === searchName)) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          return ContentService.createTextOutput(JSON.stringify({
            status: "ok",
            found: true,
            participant: obj
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "not_found",
        found: false,
        participant: null
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Obtener todos los participantes
    if (action === "get_all" || action === "participants") {
      const sheet = getOrCreateSheet();
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "ok",
          count: 0,
          participants: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      const headers = data[0];
      const participants = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0] && !row[1]) continue;
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = row[j];
        }
        participants.push(obj);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "ok",
        count: participants.length,
        participants: participants
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      app: "Reto 5S Medipiel Backend",
      version: "1.3.0",
      time: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveOrUpdateParticipant(p) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const participantId = (p.participant_id || "").toString().trim();
  const nombre = (p.nombre || "").toString().trim();
  const normTargetName = normalizeName(nombre);

  let targetRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    const rowId = (data[i][0] || "").toString().trim();
    const rowName = (data[i][1] || "").toString().trim();
    const normRowName = normalizeName(rowName);

    if ((participantId && rowId === participantId) || (normTargetName && normRowName === normTargetName)) {
      targetRowIndex = i + 1; // 1-based index
      break;
    }
  }

  // SI EL REGISTRO YA EXISTE: Fusión protectora para NUNCA perder respuestas ni avance previo
  if (targetRowIndex > 0) {
    const existing = data[targetRowIndex - 1]; // Datos existentes de la fila

    // Función auxiliar para no sobrescribir celdas que ya tienen valor con valores vacíos
    const keepOrUpdate = (newVal, colIndex) => {
      const existingVal = existing[colIndex];
      if (newVal !== undefined && newVal !== null && String(newVal).trim() !== "") {
        return newVal;
      }
      return existingVal !== undefined && existingVal !== null ? existingVal : "";
    };

    // Manejo ultra seguro de días completados y avance:
    let diasStr = "";
    let totalDias = 0;
    let avancePct = 0;

    const existingDiasRaw = existing[8]; // Días Completados (Lista)
    const existingTotalDias = Number(existing[7]) || 0;
    const existingPct = Number(existing[6]) || 0;

    if (Array.isArray(p.dias_completados) && p.dias_completados.length > 0) {
      diasStr = p.dias_completados.join(", ");
      totalDias = p.dias_completados.length;
      avancePct = p.porcentaje_avance !== undefined ? Number(p.porcentaje_avance) : Math.min(100, Math.round((totalDias / 30) * 100));
    } else if (existingDiasRaw && String(existingDiasRaw).trim().length > 0) {
      // PRESERVAR días completados existentes en Google Sheets si el cliente mandó vacío
      diasStr = existingDiasRaw;
      totalDias = existingTotalDias;
      avancePct = existingPct;
    } else {
      diasStr = "";
      totalDias = 0;
      avancePct = p.porcentaje_avance || 0;
    }

    const diaActual = p.dia_actual && Number(p.dia_actual) > 1 
      ? Number(p.dia_actual) 
      : (Number(existing[5]) || 1);

    const rowValues = [
      keepOrUpdate(p.participant_id, 0),
      keepOrUpdate(p.nombre, 1),
      keepOrUpdate(p.tienda, 2),
      existing[3] || p.fecha_inicio || new Date().toISOString(), // Preservar fecha de inicio original
      p.fecha_ultima_actualizacion || new Date().toISOString(),
      diaActual,
      avancePct,
      totalDias,
      diasStr,
      keepOrUpdate(p.intencion_30_dias, 9),

      // SER (Días 1-5)
      keepOrUpdate(p.ser_caracteristica_1, 10),
      keepOrUpdate(p.ser_caracteristica_2, 11),
      keepOrUpdate(p.ser_caracteristica_3, 12),
      keepOrUpdate(p.ser_accion, 13),
      keepOrUpdate(p.ser_descubrimiento, 14),

      // SERVIR (Días 6-10)
      keepOrUpdate(Array.isArray(p.servir_tipos_ayuda) && p.servir_tipos_ayuda.length > 0 ? p.servir_tipos_ayuda.join("; ") : p.servir_tipos_ayuda, 15),
      keepOrUpdate(p.servir_a_quien, 16),
      keepOrUpdate(p.servir_necesidad, 17),
      keepOrUpdate(p.servir_que_hice, 18),
      keepOrUpdate(p.servir_cambio, 19),

      // SABER (Días 11-14)
      keepOrUpdate(p.saber_que_ensene, 20),
      keepOrUpdate(p.saber_a_quien, 21),
      keepOrUpdate(p.saber_que_aprendi, 22),
      keepOrUpdate(p.saber_donde_aplicar, 23),

      // DÍA 15 (Encuentro de Avances)
      keepOrUpdate(p.dia15_historia, 24),
      keepOrUpdate(p.dia15_rojo, 25),
      keepOrUpdate(p.dia15_amarillo, 26),
      keepOrUpdate(p.dia15_verde, 27),
      keepOrUpdate(p.dia15_ser, 28),
      keepOrUpdate(p.dia15_servir, 29),
      keepOrUpdate(p.dia15_saber, 30),
      keepOrUpdate(p.dia15_sonreir, 31),
      keepOrUpdate(p.dia15_sorprender, 32),
      keepOrUpdate(p.dia15_s_fortalecer, 33),
      keepOrUpdate(p.dia15_comportamiento, 34),

      // SONREÍR (Días 16-20)
      (p.sonreir_reconocimiento === true || existing[35] === "SÍ") ? "SÍ" : "NO",
      (p.sonreir_queja === true || existing[36] === "SÍ") ? "SÍ" : "NO",
      (p.sonreir_ambiente === true || existing[37] === "SÍ") ? "SÍ" : "NO",
      keepOrUpdate(p.sonreir_situacion, 38),
      keepOrUpdate(p.sonreir_reaccion, 39),
      keepOrUpdate(p.sonreir_efecto, 40),

      // SORPRENDER (Días 21-25)
      keepOrUpdate(p.sorprender_oportunidad, 41),
      keepOrUpdate(p.sorprender_idea, 42),
      keepOrUpdate(p.sorprender_prueba, 43),
      keepOrUpdate(p.sorprender_resultado, 44),
      keepOrUpdate(p.sorprender_y_si, 45),

      // RETO INTEGRADO (Días 26-29)
      keepOrUpdate(Array.isArray(p.reto_integrado_s) && p.reto_integrado_s.length > 0 ? p.reto_integrado_s.join(", ") : p.reto_integrado_s, 46),
      keepOrUpdate(p.reto_integrado_accion, 47),
      keepOrUpdate(p.reto_integrado_beneficiario, 48),
      keepOrUpdate(p.reto_integrado_resultado, 49),
      keepOrUpdate(p.reto_integrado_aprendizaje, 50),

      // PASAPORTE
      keepOrUpdate(p.pasaporte_momento_favorito, 51),

      // DÍA 30 CIERRE
      keepOrUpdate(p.cierre_situacion, 52),
      keepOrUpdate(p.cierre_accion, 53),
      keepOrUpdate(p.cierre_resultado, 54),
      keepOrUpdate(p.cierre_aprendizaje, 55),
      keepOrUpdate(p.reconocimiento_persona, 56),
      keepOrUpdate(Array.isArray(p.reconocimiento_s) && p.reconocimiento_s.length > 0 ? p.reconocimiento_s.join(", ") : p.reconocimiento_s, 57),
      keepOrUpdate(p.reconocimiento_motivo, 58),

      // COMPROMISOS
      keepOrUpdate(p.compromiso_ser, 59),
      keepOrUpdate(p.compromiso_servir, 60),
      keepOrUpdate(p.compromiso_saber, 61),
      keepOrUpdate(p.compromiso_sonreir, 62),
      keepOrUpdate(p.compromiso_sorprender, 63),
      keepOrUpdate(p.compromiso_30_dias, 64),
      keepOrUpdate(p.fecha_finalizacion, 65)
    ];

    sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    return { action: "updated", row: targetRowIndex };
  } else {
    // NUEVO PARTICIPANTE: Inserción de nueva fila
    const rowValues = [
      p.participant_id || "",
      p.nombre || "",
      p.tienda || "",
      p.fecha_inicio || new Date().toISOString(),
      p.fecha_ultima_actualizacion || new Date().toISOString(),
      p.dia_actual || 1,
      p.porcentaje_avance || 0,
      Array.isArray(p.dias_completados) ? p.dias_completados.length : 0,
      Array.isArray(p.dias_completados) ? p.dias_completados.join(", ") : "",
      p.intencion_30_dias || "",

      p.ser_caracteristica_1 || "",
      p.ser_caracteristica_2 || "",
      p.ser_caracteristica_3 || "",
      p.ser_accion || "",
      p.ser_descubrimiento || "",

      Array.isArray(p.servir_tipos_ayuda) ? p.servir_tipos_ayuda.join("; ") : (p.servir_tipos_ayuda || ""),
      p.servir_a_quien || "",
      p.servir_necesidad || "",
      p.servir_que_hice || "",
      p.servir_cambio || "",

      p.saber_que_ensene || "",
      p.saber_a_quien || "",
      p.saber_que_aprendi || "",
      p.saber_donde_aplicar || "",

      p.dia15_historia || "",
      p.dia15_rojo || "",
      p.dia15_amarillo || "",
      p.dia15_verde || "",
      p.dia15_ser || 5,
      p.dia15_servir || 5,
      p.dia15_saber || 5,
      p.dia15_sonreir || 5,
      p.dia15_sorprender || 5,
      p.dia15_s_fortalecer || "",
      p.dia15_comportamiento || "",

      p.sonreir_reconocimiento ? "SÍ" : "NO",
      p.sonreir_queja ? "SÍ" : "NO",
      p.sonreir_ambiente ? "SÍ" : "NO",
      p.sonreir_situacion || "",
      p.sonreir_reaccion || "",
      p.sonreir_efecto || "",

      p.sorprender_oportunidad || "",
      p.sorprender_idea || "",
      p.sorprender_prueba || "",
      p.sorprender_resultado || "",
      p.sorprender_y_si || "",

      Array.isArray(p.reto_integrado_s) ? p.reto_integrado_s.join(", ") : (p.reto_integrado_s || ""),
      p.reto_integrado_accion || "",
      p.reto_integrado_beneficiario || "",
      p.reto_integrado_resultado || "",
      p.reto_integrado_aprendizaje || "",

      p.pasaporte_momento_favorito || "",

      p.cierre_situacion || "",
      p.cierre_accion || "",
      p.cierre_resultado || "",
      p.cierre_aprendizaje || "",
      p.reconocimiento_persona || "",
      Array.isArray(p.reconocimiento_s) ? p.reconocimiento_s.join(", ") : (p.reconocimiento_s || ""),
      p.reconocimiento_motivo || "",

      p.compromiso_ser || "",
      p.compromiso_servir || "",
      p.compromiso_saber || "",
      p.compromiso_sonreir || "",
      p.compromiso_sorprender || "",
      p.compromiso_30_dias || "",
      p.fecha_finalizacion || ""
    ];

    sheet.appendRow(rowValues);
    return { action: "inserted", row: sheet.getLastRow() };
  }
}
