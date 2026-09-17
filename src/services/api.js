/**
 * SERVICIO DE PERSISTENCIA Y SINCRONIZACIÓN - RETO 5S MEDIPIEL
 * Conecta con LocalStorage y Google Apps Script / Google Sheets
 */

const STORAGE_KEY_DATA = "medipiel_reto5s_user_data";
const STORAGE_KEY_PROFILES = "medipiel_reto5s_saved_profiles";
const STORAGE_KEY_URL = "medipiel_reto5s_script_url";
const STORAGE_KEY_OFFLINE_QUEUE = "medipiel_reto5s_offline_queue";

// URL predeterminada de Google Apps Script (puede actualizarse desde la UI de ajustes)
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQEYmmHsDzmtHE2eGQ97L2s2qymV2puhtGVAULVwFDlwzwX1wJmmFjuApgXmxEhqM/exec";

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
      const stored = localStorage.getItem(STORAGE_KEY_URL);
      if (stored && stored.trim().startsWith("http")) {
        return stored.trim();
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
  }
};
