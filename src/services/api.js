/**
 * SERVICIO DE PERSISTENCIA Y SINCRONIZACIÓN - RETO 5S MEDIPIEL
 * Conecta con LocalStorage y Google Apps Script / Google Sheets
 */

const STORAGE_KEY_DATA = "medipiel_reto5s_user_data";
const STORAGE_KEY_PROFILES = "medipiel_reto5s_saved_profiles";
const STORAGE_KEY_URL = "medipiel_reto5s_script_url";
const STORAGE_KEY_OFFLINE_QUEUE = "medipiel_reto5s_offline_queue";

// URL predeterminada de Google Apps Script (puede actualizarse desde la UI de ajustes)
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjG846ZHMSSyIbZ7cPfToyal89sZ4bpar-WfZm-EoypEkZ8_2BAyYD5wr8FVOYekYsvA/exec";

/**
 * Normaliza cadenas de texto para comparaciones sin distinción de mayúsculas o tildes
 */
export function normalizeText(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Plantilla inicial vacía para un nuevo participante
 */
export function createEmptyParticipant(nombre = "", tienda = "", intencion = "") {
  const now = new Date().toISOString();
  const id = `mdp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    participant_id: id,
    nombre: nombre.trim(),
    tienda: tienda.trim(),
    fecha_inicio: now,
    fecha_ultima_actualizacion: now,
    dia_actual: 1,
    porcentaje_avance: 0,
    dias_completados: [],
    intencion_30_dias: intencion.trim(),
    meta_etapa1: "",

    // SER (1-5)
    ser_caracteristica_1: "",
    ser_caracteristica_2: "",
    ser_caracteristica_3: "",
    ser_accion: "",
    ser_descubrimiento: "",

    // SERVIR (6-10)
    servir_tipos_ayuda: [],
    servir_a_quien: "",
    servir_necesidad: "",
    servir_que_hice: "",
    servir_cambio: "",

    // SABER (11-14)
    saber_que_ensene: "",
    saber_a_quien: "",
    saber_que_aprendi: "",
    saber_donde_aplicar: "",

    // DÍA 15 (Encuentro de Avances)
    dia15_historia: "",
    dia15_rojo: "",
    dia15_amarillo: "",
    dia15_verde: "",
    dia15_ser: 4,
    dia15_servir: 4,
    dia15_saber: 4,
    dia15_sonreir: 4,
    dia15_sorprender: 4,
    dia15_s_fortalecer: "",
    dia15_comportamiento: "",
    meta_etapa2: "",

    // SONREÍR (16-20)
    sonreir_reconocimiento: false,
    sonreir_queja: false,
    sonreir_ambiente: false,
    sonreir_situacion: "",
    sonreir_reaccion: "",
    sonreir_efecto: "",

    // SORPRENDER (21-25)
    sorprender_oportunidad: "",
    sorprender_idea: "",
    sorprender_prueba: "",
    sorprender_resultado: "", // 'Funcionó' | 'Funcionó parcialmente' | 'No funcionó, pero dejó aprendizaje'
    sorprender_y_si: "",

    // RETO INTEGRADO (26-29)
    reto_integrado_s: [],
    reto_integrado_accion: "",
    reto_integrado_beneficiario: "",
    reto_integrado_resultado: "",
    reto_integrado_aprendizaje: "",

    // PASAPORTE
    pasaporte_momento_favorito: "",

    // DÍA 30 CIERRE
    cierre_situacion: "",
    cierre_accion: "",
    cierre_resultado: "",
    cierre_aprendizaje: "",
    reconocimiento_persona: "",
    reconocimiento_s: [],
    reconocimiento_motivo: "",

    // COMPROMISOS
    compromiso_ser: "",
    compromiso_servir: "",
    compromiso_saber: "",
    compromiso_sonreir: "",
    compromiso_sorprender: "",
    compromiso_30_dias: "",

    fecha_finalizacion: null
  };
}

export const api = {
  /**
   * Obtiene la URL configurada para Google Apps Script
   */
  getScriptUrl() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY_URL);
        if (stored && stored.trim().startsWith("http")) {
          return stored.trim();
        }
      }
    } catch (e) {
      console.warn("No se pudo leer STORAGE_KEY_URL", e);
    }
    return DEFAULT_SCRIPT_URL;
  },

  /**
   * Guarda una nueva URL para Google Apps Script
   */
  setScriptUrl(url) {
    try {
      if (url && typeof url === "string" && url.trim().startsWith("http")) {
        localStorage.setItem(STORAGE_KEY_URL, url.trim());
        return true;
      } else {
        localStorage.removeItem(STORAGE_KEY_URL);
        return false;
      }
    } catch (e) {
      console.error("Error al guardar URL de Apps Script", e);
      return false;
    }
  },

  /**
   * Lee la información actual almacenada en el navegador
   */
  getLocalData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DATA);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error al leer datos locales", e);
    }
    return null;
  },

  /**
   * Obtiene la lista de perfiles guardados en este dispositivo
   */
  getSavedProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Busca un perfil guardado en este dispositivo por nombre
   */
  findProfileByName(nombre) {
    if (!nombre) return null;
    const norm = normalizeText(nombre);
    if (!norm) return null;
    const profiles = this.getSavedProfiles();
    return profiles.find(p => p.nombre && normalizeText(p.nombre) === norm) || null;
  },

  /**
   * Guarda o actualiza un perfil en el directorio de colaboradores de este dispositivo
   */
  saveProfileToDirectory(data) {
    if (!data || !data.participant_id || !data.nombre) return;
    try {
      let profiles = this.getSavedProfiles();
      const targetNorm = normalizeText(data.nombre);
      const idx = profiles.findIndex(
        p => p.participant_id === data.participant_id ||
             (p.nombre && normalizeText(p.nombre) === targetNorm)
      );
      if (idx >= 0) {
        // Mantener o mezclar datos existentes para no perder campos
        profiles[idx] = {
          ...profiles[idx],
          ...data
        };
      } else {
        profiles.unshift(data);
      }
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error("Error al guardar perfil en directorio", e);
    }
  },

  /**
   * Elimina un perfil del directorio local
   */
  deleteSavedProfile(participantId) {
    try {
      let profiles = this.getSavedProfiles();
      profiles = profiles.filter(p => p.participant_id !== participantId);
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Guarda de manera síncrona en LocalStorage y actualiza el directorio de perfiles
   */
  saveLocalData(data) {
    try {
      if (!data) return false;
      data.fecha_ultima_actualizacion = new Date().toISOString();
      // Cálculo dinámico del porcentaje de avance
      const totalDias = 30;
      const compl = Array.isArray(data.dias_completados) ? data.dias_completados.length : 0;
      data.porcentaje_avance = Math.min(100, Math.round((compl / totalDias) * 100));

      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));

      if (data.nombre && data.nombre.trim().length > 0) {
        this.saveProfileToDirectory(data);
      }
      return true;
    } catch (e) {
      console.error("Error guardando datos en LocalStorage", e);
      return false;
    }
  },

  /**
   * Borra los datos de la sesión activa
   */
  clearLocalData() {
    try {
      localStorage.removeItem(STORAGE_KEY_DATA);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Cierra sesión asegurando guardado en directorio y envío a Sheets
   */
  logout() {
    try {
      const current = this.getLocalData();
      if (current && current.nombre) {
        this.saveProfileToDirectory(current);
        this.syncWithGoogleSheets(current, true);
      }
      localStorage.removeItem(STORAGE_KEY_DATA);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Envía los datos del participante a Google Apps Script / Google Sheets
   */
  async syncWithGoogleSheets(participantData, useBeacon = false) {
    const url = this.getScriptUrl();
    if (!url) {
      return { success: false, reason: "url_no_configurada" };
    }

    const payload = {
      action: "sync_participant",
      app: "reto_5s",
      timestamp: new Date().toISOString(),
      participant: participantData
    };

    const payloadStr = JSON.stringify(payload);

    // En móviles al cambiar de pestaña o cerrar el navegador, sendBeacon garantiza el envío
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const blob = new Blob([payloadStr], { type: "text/plain;charset=utf-8" });
        const queued = navigator.sendBeacon(url, blob);
        if (queued) return { success: true, method: "beacon" };
      } catch (err) {
        console.warn("sendBeacon falló, intentando fetch normal", err);
      }
    }

    try {
      // mode: 'no-cors' para evitar problemas de CORS en redirección a googleusercontent
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: payloadStr
      });

      return { success: true, method: "fetch" };
    } catch (error) {
      console.warn("No se pudo sincronizar en línea con Google Sheets (se mantendrá en local):", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Consulta y descarga todos los participantes y sus respuestas guardadas en Google Sheets.
   * Permite que el Portal de Administración y cualquier dispositivo vean las respuestas enviadas desde celulares.
   */
  async fetchParticipantsFromGoogleSheets() {
    const url = this.getScriptUrl();
    if (!url) {
      return { success: false, error: "URL de Google Apps Script no configurada", participants: [] };
    }

    try {
      const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}action=get_all&_t=${Date.now()}`;
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error en servidor (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (data && data.status === "ok" && Array.isArray(data.participants)) {
        const mapped = data.participants
          .map(mapSheetRowToParticipant)
          .filter(p => p && p.nombre && p.nombre.trim().length > 0);

        // Guardamos también en el directorio local de perfiles para disponibilidad offline
        mapped.forEach(p => this.saveProfileToDirectory(p));

        return {
          success: true,
          count: mapped.length,
          participants: mapped
        };
      } else {
        throw new Error(data.message || "Respuesta no compatible desde Google Sheets");
      }
    } catch (error) {
      console.warn("No se pudo descargar la lista de colaboradores desde Google Sheets:", error);
      return {
        success: false,
        error: error.message || "Error al conectar con Google Sheets",
        participants: []
      };
    }
  }
};

/**
 * Convierte una fila obtenida desde Google Sheets (con encabezados en español)
 * al objeto de datos de participante estándar de la aplicación.
 */
export function mapSheetRowToParticipant(row) {
  if (!row) return null;

  // Días completados
  let dias = [];
  if (row["Días Completados (Lista)"]) {
    const rawList = String(row["Días Completados (Lista)"]);
    dias = rawList
      .split(/[,;\s]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 30);
  }

  // Tipos de ayuda en SERVIR
  let servirAyuda = [];
  if (row["SERVIR - Tipos de Ayuda"]) {
    servirAyuda = String(row["SERVIR - Tipos de Ayuda"])
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Reto integrado S
  let retoS = [];
  if (row["RETO INTEGRADO - S Combinadas"]) {
    retoS = String(row["RETO INTEGRADO - S Combinadas"])
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Reconocimiento S
  let recoS = [];
  if (row["RECONOCIMIENTO - S Destacada"]) {
    recoS = String(row["RECONOCIMIENTO - S Destacada"])
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  const avanceNum = parseInt(row["Progreso (%)"], 10);
  const porcentaje = !isNaN(avanceNum)
    ? avanceNum
    : (dias.length ? Math.min(100, Math.round((dias.length / 30) * 100)) : 0);

  return {
    participant_id: row["ID Participante"] || `mdp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    nombre: (row["Nombre Completo"] || "").trim(),
    tienda: (row["Tienda / Sede"] || "").trim(),
    fecha_inicio: row["Fecha Inicio"] || "",
    fecha_ultima_actualizacion: row["Última Actualización"] || new Date().toISOString(),
    dia_actual: parseInt(row["Día Actual"], 10) || (dias.length ? Math.min(30, Math.max(...dias, 1)) : 1),
    porcentaje_avance: porcentaje,
    dias_completados: dias,
    intencion_30_dias: row["Intención 30 Días"] || "",
    meta_etapa1: "",

    // SER
    ser_caracteristica_1: row["SER - Característica 1"] || "",
    ser_caracteristica_2: row["SER - Característica 2"] || "",
    ser_caracteristica_3: row["SER - Característica 3"] || "",
    ser_accion: row["SER - Acción Concreta"] || "",
    ser_descubrimiento: row["SER - Qué descubrí de mí"] || "",

    // SERVIR
    servir_tipos_ayuda: servirAyuda,
    servir_a_quien: row["SERVIR - A quién apoyé"] || "",
    servir_necesidad: row["SERVIR - Necesidad observada"] || "",
    servir_que_hice: row["SERVIR - Qué hice"] || "",
    servir_cambio: row["SERVIR - Qué cambió"] || "",

    // SABER
    saber_que_ensene: row["SABER - Qué enseñé y a quién"] || "",
    saber_a_quien: row["SABER - A quién apoyé"] || "",
    saber_que_aprendi: row["SABER - Qué aprendí de otro"] || "",
    saber_donde_aplicar: row["SABER - Dónde lo aplicaré"] || "",

    // DÍA 15
    dia15_historia: row["D15 - Historia 1 minuto"] || "",
    dia15_rojo: row["D15 - Semáforo Rojo (Dejar de hacer)"] || "",
    dia15_amarillo: row["D15 - Semáforo Amarillo (Mejorar)"] || "",
    dia15_verde: row["D15 - Semáforo Verde (Mantener)"] || "",
    dia15_ser: parseInt(row["D15 - Termómetro SER (1-5)"], 10) || 4,
    dia15_servir: parseInt(row["D15 - Termómetro SERVIR (1-5)"], 10) || 4,
    dia15_saber: parseInt(row["D15 - Termómetro SABER (1-5)"], 10) || 4,
    dia15_sonreir: parseInt(row["D15 - Termómetro SONREÍR (1-5)"], 10) || 4,
    dia15_sorprender: parseInt(row["D15 - Termómetro SORPRENDER (1-5)"], 10) || 4,
    dia15_s_fortalecer: row["D15 - S a Fortalecer"] || "",
    dia15_comportamiento: row["D15 - Comportamiento de salida"] || "",
    meta_etapa2: "",

    // SONREÍR
    sonreir_reconocimiento: String(row["SONREÍR - Reconocí algo positivo"]).toUpperCase() === "SÍ" || Boolean(row["SONREÍR - Reconocí algo positivo"]),
    sonreir_queja: String(row["SONREÍR - Transformé queja en propuesta"]).toUpperCase() === "SÍ",
    sonreir_ambiente: String(row["SONREÍR - Mejoré el ambiente"]).toUpperCase() === "SÍ",
    sonreir_situacion: row["SONREÍR - Situación transformada"] || "",
    sonreir_reaccion: row["SONREÍR - Reacción antes vs ahora"] || "",
    sonreir_efecto: row["SONREÍR - Efecto logrado"] || "",

    // SORPRENDER
    sorprender_oportunidad: row["SORPRENDER - Oportunidad cotidiana"] || "",
    sorprender_idea: row["SORPRENDER - Idea 1% extra"] || "",
    sorprender_prueba: row["SORPRENDER - Prueba y qué pasó"] || "",
    sorprender_resultado: row["SORPRENDER - Resultado (Funcionó)"] || "",
    sorprender_y_si: row["SORPRENDER - Banco de ideas (¿Y si nosotros...?)"] || "",

    // RETO INTEGRADO
    reto_integrado_s: retoS,
    reto_integrado_accion: row["RETO INTEGRADO - Acción"] || "",
    reto_integrado_beneficiario: row["RETO INTEGRADO - Beneficiario"] || "",
    reto_integrado_resultado: row["RETO INTEGRADO - Resultado"] || "",
    reto_integrado_aprendizaje: row["RETO INTEGRADO - Enseñanza"] || "",

    // PASAPORTE
    pasaporte_momento_favorito: row["PASAPORTE - Momento Favorito y S"] || "",

    // CIERRE
    cierre_situacion: row["CIERRE - Situación"] || "",
    cierre_accion: row["CIERRE - Acción"] || "",
    cierre_resultado: row["CIERRE - Resultado"] || "",
    cierre_aprendizaje: row["CIERRE - Aprendizaje"] || "",

    // RECONOCIMIENTO
    reconocimiento_persona: row["RECONOCIMIENTO - Persona"] || "",
    reconocimiento_s: recoS,
    reconocimiento_motivo: row["RECONOCIMIENTO - Motivo"] || "",

    // COMPROMISOS
    compromiso_ser: row["COMPROMISO - SER"] || "",
    compromiso_servir: row["COMPROMISO - SERVIR"] || "",
    compromiso_saber: row["COMPROMISO - SABER"] || "",
    compromiso_sonreir: row["COMPROMISO - SONREÍR"] || "",
    compromiso_sorprender: row["COMPROMISO - SORPRENDER"] || "",
    compromiso_30_dias: row["COMPROMISO - 30 Días Siguientes"] || "",
    fecha_finalizacion: row["Fecha Finalización"] || ""
  };
}
