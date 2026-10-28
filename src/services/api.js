/**
 * SERVICIO DE PERSISTENCIA Y SINCRONIZACIÓN - RETO 5S MEDIPIEL
 * Conecta con LocalStorage y Google Apps Script / Google Sheets
 */

const STORAGE_KEY_DATA = "medipiel_reto5s_user_data";
const STORAGE_KEY_PROFILES = "medipiel_reto5s_saved_profiles";
const STORAGE_KEY_URL = "medipiel_reto5s_script_url";
const STORAGE_KEY_OFFLINE_QUEUE = "medipiel_reto5s_offline_queue";

// URL predeterminada de Google Apps Script (puede actualizarse desde la UI de ajustes)
export const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjG846ZHMSSyIbZ7cPfToyal89sZ4bpar-WfZm-EoypEkZ8_2BAyYD5wr8FVOYekYsvA/exec";

// URLs anteriores que ya no son válidas o devuelven error 403
const OLD_INVALID_URLS = [
  "https://script.google.com/macros/s/AKfycbzQEYmmHsDzmtHE2eGQ97L2s2qymV2puhtGVAULVwFDlwzwX1wJmmFjuApgXmxEhqM/exec"
];

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
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Convierte cualquier valor a string limpio sin lanzar excepciones
 */
export function safeStr(val) {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

/**
 * Plantilla inicial vacía para un nuevo participante
 */
export function createEmptyParticipant(nombre = "", tienda = "", intencion = "") {
  const now = new Date().toISOString();
  const id = `mdp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    participant_id: id,
    nombre: safeStr(nombre),
    tienda: safeStr(tienda),
    fecha_inicio: now,
    fecha_ultima_actualizacion: now,
    dia_actual: 1,
    porcentaje_avance: 0,
    dias_completados: [],
    intencion_30_dias: safeStr(intencion),
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

/**
 * Algoritmo inteligente que encuentra el mejor perfil coincidente para un nombre.
 * Resuelve casos donde una persona se registró con o sin segundo nombre o apellido,
 * o si tiene un registro duplicado con 0% y otro con avance previo (rescata el avance).
 */
export function findBestProfileMatch(nombre, profiles) {
  if (!nombre || !Array.isArray(profiles) || profiles.length === 0) return null;
  const norm = normalizeText(nombre);
  if (!norm || norm.length < 2) return null;

  // 1. Coincidencia exacta
  const exactMatches = profiles.filter(p => p && p.nombre && normalizeText(p.nombre) === norm);
  if (exactMatches.length > 0) {
    exactMatches.sort((a, b) => (Number(b.porcentaje_avance) || 0) - (Number(a.porcentaje_avance) || 0));
    const bestExact = exactMatches[0];

    // Si el registro exacto tiene 0% de avance, pero hay otro del mismo colaborador con avance
    if ((Number(bestExact.porcentaje_avance) || 0) === 0 && (!bestExact.dias_completados || bestExact.dias_completados.length === 0)) {
      const words = norm.split(" ").filter(w => w.length > 2);
      if (words.length >= 2) {
        const firstWord = words[0];
        const lastWord = words[words.length - 1];
        const candidateWithProgress = profiles.find(p => {
          if (!p || !p.nombre || p === bestExact) return false;
          const pNorm = normalizeText(p.nombre);
          const pWords = pNorm.split(" ").filter(w => w.length > 2);
          const matchesFirstAndLast = pWords.includes(firstWord) && pWords.includes(lastWord);
          const hasAdv = (Number(p.porcentaje_avance) || 0) > 0 || (Array.isArray(p.dias_completados) && p.dias_completados.length > 0);
          return matchesFirstAndLast && hasAdv;
        });

        if (candidateWithProgress) {
          return {
            ...candidateWithProgress,
            nombre: bestExact.nombre || candidateWithProgress.nombre,
            tienda: bestExact.tienda || candidateWithProgress.tienda,
            intencion_30_dias: bestExact.intencion_30_dias || candidateWithProgress.intencion_30_dias,
            _mergedFrom: candidateWithProgress.nombre
          };
        }
      }
    }
    return bestExact;
  }

  // 2. Coincidencia por primer nombre y apellido
  const words = norm.split(" ").filter(w => w.length > 2);
  if (words.length >= 2) {
    const firstWord = words[0];
    const lastWord = words[words.length - 1];

    const candidates = profiles.filter(p => {
      if (!p || !p.nombre) return false;
      const pNorm = normalizeText(p.nombre);
      const pWords = pNorm.split(" ").filter(w => w.length > 2);
      return pWords.includes(firstWord) && pWords.includes(lastWord);
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => (Number(b.porcentaje_avance) || 0) - (Number(a.porcentaje_avance) || 0));
      return candidates[0];
    }
  }

  return null;
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
          const trimmed = stored.trim();
          if (OLD_INVALID_URLS.includes(trimmed)) {
            localStorage.removeItem(STORAGE_KEY_URL);
            return DEFAULT_SCRIPT_URL;
          }
          return trimmed;
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
   * Restablece la URL a la versión oficial predeterminada
   */
  resetScriptUrl() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_URL);
      }
    } catch (e) {
      console.warn("No se pudo limpiar STORAGE_KEY_URL", e);
    }
    return DEFAULT_SCRIPT_URL;
  },

  /**
   * Lee la información actual almacenada en el navegador
   */
  getLocalData() {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY_DATA);
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch (e) {
      console.error("Error al leer datos locales", e);
    }
    return null;
  },

  /**
   * Limpia perfiles remotos que se hayan filtrado erróneamente en LocalStorage
   * desde descargas masivas previas del Portal Admin.
   * Conserva únicamente el perfil activo del usuario actual si existe.
   */
  sanitizeSavedProfiles() {
    try {
      const SANITIZE_KEY = "medipiel_reto5s_profiles_cleaned_v2";
      if (typeof window !== "undefined" && window.localStorage) {
        if (!localStorage.getItem(SANITIZE_KEY)) {
          const activeData = this.getLocalData();
          if (activeData && activeData.nombre && activeData.nombre.trim().length > 0) {
            localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify([activeData]));
          } else {
            localStorage.removeItem(STORAGE_KEY_PROFILES);
          }
          localStorage.setItem(SANITIZE_KEY, "true");
        }
      }
    } catch (e) {
      console.warn("No se pudo ejecutar sanitizeSavedProfiles:", e);
    }
  },

  /**
   * Obtiene la lista de perfiles guardados en este dispositivo
   */
  getSavedProfiles() {
    this.sanitizeSavedProfiles();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  cachedRemoteParticipants: null,
  cachedRemoteTimestamp: 0,
  remoteFetchPromise: null,


  /**
   * Busca si existe un perfil en cualquier almacenamiento (local o remoto descargado)
   */
  findProfileAnywhere(nombre) {
    if (!nombre) return null;
    const pool = [];

    // 1. Sesión local activa
    const local = this.getLocalData();
    if (local && local.nombre) pool.push(local);

    // 2. Perfiles locales en dispositivo
    const localSaved = this.getSavedProfiles();
    if (Array.isArray(localSaved)) pool.push(...localSaved);

    // 3. Perfiles de Google Sheets en memoria
    if (Array.isArray(this.cachedRemoteParticipants)) {
      pool.push(...this.cachedRemoteParticipants);
    }

    return findBestProfileMatch(nombre, pool);
  },

  /**
   * Búsqueda reactiva inteligente en el directorio unificado (local + nube)
   * Permite sugerir coincidencias al usuario mientras escribe su nombre
   */
  searchDirectory(query, maxResults = 6) {
    if (!query) return [];
    const normQuery = normalizeText(query);
    if (normQuery.length < 2) return [];

    const map = new Map();

    // 1. Agregar perfiles guardados localmente
    const localProfiles = this.getSavedProfiles();
    localProfiles.forEach(p => {
      if (p && p.nombre) {
        const key = normalizeText(p.nombre);
        if (key) map.set(key, p);
      }
    });

    // 2. Agregar sesión activa
    const active = this.getLocalData();
    if (active && active.nombre) {
      const key = normalizeText(active.nombre);
      if (key) map.set(key, active);
    }

    // 3. Agregar perfiles remotos de Google Sheets
    if (Array.isArray(this.cachedRemoteParticipants)) {
      this.cachedRemoteParticipants.forEach(p => {
        if (p && p.nombre) {
          const key = normalizeText(p.nombre);
          if (key) {
            const existing = map.get(key);
            if (!existing) {
              map.set(key, p);
            } else {
              // Conservar el que tenga mayor información o avance
              const pAdv = Number(p.porcentaje_avance || 0);
              const eAdv = Number(existing.porcentaje_avance || 0);
              if (pAdv >= eAdv) {
                map.set(key, { ...existing, ...p });
              }
            }
          }
        }
      });
    }

    const all = Array.from(map.values());
    const queryWords = normQuery.split(" ").filter(Boolean);

    const matches = all.filter(p => {
      const pNorm = normalizeText(p.nombre);
      if (pNorm === normQuery) return true;
      if (pNorm.startsWith(normQuery)) return true;
      if (pNorm.includes(normQuery)) return true;
      return queryWords.every(w => pNorm.includes(w));
    });

    // Ordenar: primero coincidencia exacta, luego por mayor avance
    matches.sort((a, b) => {
      const aNorm = normalizeText(a.nombre);
      const bNorm = normalizeText(b.nombre);
      if (aNorm === normQuery && bNorm !== normQuery) return -1;
      if (bNorm === normQuery && aNorm !== normQuery) return 1;
      const advA = Number(a.porcentaje_avance || 0);
      const advB = Number(b.porcentaje_avance || 0);
      if (advB !== advA) return advB - advA;
      return a.nombre.localeCompare(b.nombre);
    });

    return matches.slice(0, maxResults);
  },

  /**
   * Busca un participante por nombre en Google Sheets en tiempo real
   */
  async fetchParticipantByName(nombre) {
    if (!nombre) return null;
    const norm = normalizeText(nombre);
    if (!norm) return null;

    // 1. Revisar si ya lo tenemos en memoria
    const inMemory = this.findProfileAnywhere(nombre);
    if (inMemory) return inMemory;

    // 2. Si no, forzar recarga desde Google Sheets
    const res = await this.fetchParticipantsFromGoogleSheets(true);
    if (res && res.success && Array.isArray(res.participants)) {
      const exact = res.participants.find(p => p.nombre && normalizeText(p.nombre) === norm);
      if (exact) return exact;

      // Coincidencia por palabras del nombre
      const words = norm.split(" ").filter(w => w.length > 2);
      if (words.length >= 2) {
        const fuzzy = res.participants.find(p => {
          const pNorm = normalizeText(p.nombre);
          return words.every(w => pNorm.includes(w));
        });
        if (fuzzy) return fuzzy;
      }
    }

    return null;
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
   * Guarda o actualiza múltiples perfiles en lote eficientemente sin saturar LocalStorage
   */
  saveProfilesBatch(profilesList) {
    if (!Array.isArray(profilesList) || profilesList.length === 0) return;
    try {
      let profiles = this.getSavedProfiles();
      const map = new Map();
      profiles.forEach(p => {
        if (p && (p.participant_id || p.nombre)) {
          const key = normalizeText(p.nombre) || p.participant_id;
          map.set(key, p);
        }
      });
      profilesList.forEach(p => {
        if (p && (p.participant_id || p.nombre)) {
          const key = normalizeText(p.nombre) || p.participant_id;
          const existing = map.get(key);
          map.set(key, existing ? { ...existing, ...p } : p);
        }
      });
      const merged = Array.from(map.values());
      try {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(merged));
      } catch (quotaErr) {
        console.warn("LocalStorage no pudo almacenar todos los perfiles por cuota excedida:", quotaErr);
      }
    } catch (e) {
      console.error("Error al guardar perfiles en lote", e);
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
    const payload = {
      action: "sync_participant",
      app: "reto_5s",
      timestamp: new Date().toISOString(),
      participant: participantData
    };
    const payloadStr = JSON.stringify(payload);

    // 1. Intentar enviar a través del endpoint serverless /api/participants (sin problemas de CORS o ITP)
    if (typeof window !== "undefined" && !useBeacon) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const proxyRes = await fetch("/api/participants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadStr,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (proxyRes.ok) {
          return { success: true, method: "proxy" };
        }
      } catch (proxyErr) {
        // Fallback al método tradicional si falla el proxy
      }
    }

    const url = this.getScriptUrl();
    if (!url) {
      return { success: false, reason: "url_no_configurada" };
    }

    // 2. En móviles al cerrar navegador o pestaña, sendBeacon garantiza el envío
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const blob = new Blob([payloadStr], { type: "text/plain;charset=utf-8" });
        const queued = navigator.sendBeacon(url, blob);
        if (queued) return { success: true, method: "beacon" };
      } catch (err) {
        console.warn("sendBeacon falló, intentando fetch normal", err);
      }
    }

    // 3. Fallback directo a Google Apps Script con mode: 'no-cors'
    try {
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
   * Utiliza primero la ruta serverless propia (/api/participants) para evitar bloqueos CORS y 
   * problemas de redirección en Safari iOS y redes corporativas, con fallback directo a Google Apps Script.
   * Cuenta con caché en memoria (90s) y coalescencia de promesas concurrentes.
   */
  async fetchParticipantsFromGoogleSheets(forceRefresh = false) {
    if (!forceRefresh && Array.isArray(this.cachedRemoteParticipants) && (Date.now() - this.cachedRemoteTimestamp < 90000)) {
      return {
        success: true,
        count: this.cachedRemoteParticipants.length,
        participants: this.cachedRemoteParticipants
      };
    }

    if (this.remoteFetchPromise && !forceRefresh) {
      return this.remoteFetchPromise;
    }

    this.remoteFetchPromise = (async () => {
      const directUrl = this.getScriptUrl();
      const proxyUrl = "/api/participants";

      let rawData = null;
      let lastError = null;

      // Estrategia 1: Intentar mediante la Serverless Function de Vercel (/api/participants)
      if (typeof window !== "undefined") {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 18000);

          const response = await fetch(`${proxyUrl}?_t=${Date.now()}`, {
            method: "GET",
            headers: { "Accept": "application/json" },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const json = await response.json();
            if (json && json.status === "ok" && Array.isArray(json.participants)) {
              rawData = json;
            }
          }
        } catch (err) {
          console.warn("Intento por proxy serverless falló, intentando enlace directo:", err.message);
          lastError = err;
        }
      }

      // Estrategia 2: Fallback directo al Web App de Google Apps Script
      if (!rawData && directUrl) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 22000);

          const fetchUrl = `${directUrl}${directUrl.includes('?') ? '&' : '?'}action=get_all&_t=${Date.now()}`;
          const response = await fetch(fetchUrl, {
            method: "GET",
            headers: { "Accept": "application/json" },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const json = await response.json();
            if (json && json.status === "ok" && Array.isArray(json.participants)) {
              rawData = json;
            }
          } else {
            throw new Error(`Google Sheets HTTP ${response.status}`);
          }
        } catch (err) {
          console.warn("Intento directo a Google Apps Script falló:", err.message);
          lastError = err;
        }
      }

      if (rawData && Array.isArray(rawData.participants)) {
        const mapped = [];
        for (const row of rawData.participants) {
          try {
            const p = mapSheetRowToParticipant(row);
            if (p && p.nombre && p.nombre.length > 0) {
              mapped.push(p);
            }
          } catch (rowErr) {
            console.warn("Fila ignorada por formato incompatible:", rowErr, row);
          }
        }

        this.cachedRemoteParticipants = mapped;
        this.cachedRemoteTimestamp = Date.now();

        return {
          success: true,
          count: mapped.length,
          participants: mapped
        };
      }

      const errorMsg = lastError
        ? (lastError.name === "AbortError" 
            ? "La conexión tardó demasiado tiempo en responder. Por favor presiona 'Recargar Datos Ahora'." 
            : (lastError.message || "Error al conectar con Google Sheets"))
        : "No se pudo obtener información de colaboradores desde Google Sheets";

      return {
        success: false,
        error: errorMsg,
        participants: []
      };
    })().finally(() => {
      this.remoteFetchPromise = null;
    });

    return this.remoteFetchPromise;
  }
};

/**
 * Obtiene el primer valor no vacío de una fila de Google Sheets evaluando múltiples variantes de encabezado
 */
function getSheetField(row, ...possibleKeys) {
  if (!row) return "";
  for (const k of possibleKeys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
      return safeStr(row[k]);
    }
  }
  return "";
}

/**
 * Convierte una fila obtenida desde Google Sheets (con encabezados en español)
 * al objeto de datos de participante estándar de la aplicación.
 * Es totalmente defensivo ante celdas numéricas, booleanas, vacías o variantes de columnas.
 */
export function mapSheetRowToParticipant(row) {
  if (!row) return null;

  // Días completados
  let dias = [];
  const rawList = getSheetField(
    row,
    "Días Completados (Lista)",
    "Dias Completados (Lista)",
    "Días Completados",
    "Dias Completados",
    "Dias_Completados"
  );
  if (rawList) {
    dias = rawList
      .split(/[,;\s]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 30);
  }

  // Tipos de ayuda en SERVIR
  let servirAyuda = [];
  const rawServir = getSheetField(row, "SERVIR - Tipos de Ayuda", "SERVIR: Tipos de Ayuda", "SERVIR - Tipos Ayuda");
  if (rawServir) {
    servirAyuda = rawServir
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Reto integrado S
  let retoS = [];
  const rawRetoS = getSheetField(row, "RETO INTEGRADO - S Combinadas", "RETO INTEGRADO: S Combinadas");
  if (rawRetoS) {
    retoS = rawRetoS
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Reconocimiento S
  let recoS = [];
  const rawRecoS = getSheetField(row, "RECONOCIMIENTO - S Destacada", "RECONOCIMIENTO: S Destacada");
  if (rawRecoS) {
    recoS = rawRecoS
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  const rawAvance = getSheetField(
    row,
    "Progreso (%)",
    "Avance (%)",
    "Progreso",
    "Avance",
    "Porcentaje de Avance"
  );
  const avanceNum = parseInt(rawAvance, 10);
  const porcentaje = !isNaN(avanceNum)
    ? avanceNum
    : (dias.length ? Math.min(100, Math.round((dias.length / 30) * 100)) : 0);

  const rawDiaActual = getSheetField(row, "Día Actual", "Dia Actual", "Dia_Actual");
  const parsedDiaActual = parseInt(rawDiaActual, 10);

  const checkBool = (...keys) => {
    for (const k of keys) {
      if (row[k] === true) return true;
      const str = String(row[k] || "").trim().toUpperCase();
      if (str === "SÍ" || str === "SI" || str === "TRUE" || str === "1") return true;
    }
    return false;
  };

  return {
    participant_id: getSheetField(row, "ID Participante", "ID", "participant_id") || `mdp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    nombre: getSheetField(row, "Nombre Completo", "Nombre", "Colaborador"),
    tienda: getSheetField(row, "Tienda / Sede", "Tienda o Sede", "Tienda", "Sede", "Punto de Venta"),
    fecha_inicio: getSheetField(row, "Fecha Inicio", "Fecha_Inicio") || new Date().toISOString(),
    fecha_ultima_actualizacion: getSheetField(row, "Última Actualización", "Ultima Actualizacion", "Fecha_Actualizacion") || new Date().toISOString(),
    dia_actual: parsedDiaActual || (dias.length ? Math.min(30, Math.max(...dias, 1)) : 1),
    porcentaje_avance: porcentaje,
    dias_completados: dias,
    intencion_30_dias: getSheetField(row, "Intención 30 Días", "Intencion 30 Dias", "Intención", "Intencion", "Intención para estos 30 días"),
    meta_etapa1: "",

    // SER
    ser_caracteristica_1: getSheetField(row, "SER - Característica 1", "SER: Característica 1", "SER - Caracteristica 1", "SER: Caracteristica 1"),
    ser_caracteristica_2: getSheetField(row, "SER - Característica 2", "SER: Característica 2", "SER - Caracteristica 2", "SER: Caracteristica 2"),
    ser_caracteristica_3: getSheetField(row, "SER - Característica 3", "SER: Característica 3", "SER - Caracteristica 3", "SER: Caracteristica 3"),
    ser_accion: getSheetField(row, "SER - Acción Concreta", "SER: Acción Concreta", "SER - Accion Concreta"),
    ser_descubrimiento: getSheetField(row, "SER - Qué descubrí de mí", "SER: Qué descubrí de mí", "SER - Que descubri de mi"),

    // SERVIR
    servir_tipos_ayuda: servirAyuda,
    servir_a_quien: getSheetField(row, "SERVIR - A quién apoyé", "SERVIR: A quién apoyé", "SERVIR - A quien apoye"),
    servir_necesidad: getSheetField(row, "SERVIR - Necesidad observada", "SERVIR: Necesidad observada"),
    servir_que_hice: getSheetField(row, "SERVIR - Qué hice", "SERVIR: Qué hice", "SERVIR - Que hice"),
    servir_cambio: getSheetField(row, "SERVIR - Qué cambió", "SERVIR: Qué cambió", "SERVIR - Que cambio"),

    // SABER
    saber_que_ensene: getSheetField(row, "SABER - Qué enseñé y a quién", "SABER: Qué enseñé y a quién", "SABER - Que ensene"),
    saber_a_quien: getSheetField(row, "SABER - A quién apoyé", "SABER: A quién apoyé", "SABER - A quien apoye"),
    saber_que_aprendi: getSheetField(row, "SABER - Qué aprendí de otro", "SABER: Qué aprendí de otro", "SABER - Que aprendi"),
    saber_donde_aplicar: getSheetField(row, "SABER - Dónde lo aplicaré", "SABER: Dónde lo aplicaré", "SABER - Donde lo aplicare"),

    // DÍA 15
    dia15_historia: getSheetField(row, "D15 - Historia 1 minuto", "D15: Historia 1 minuto"),
    dia15_rojo: getSheetField(row, "D15 - Semáforo Rojo (Dejar de hacer)", "D15: Semáforo Rojo"),
    dia15_amarillo: getSheetField(row, "D15 - Semáforo Amarillo (Mejorar)", "D15: Semáforo Amarillo"),
    dia15_verde: getSheetField(row, "D15 - Semáforo Verde (Mantener)", "D15: Semáforo Verde"),
    dia15_ser: parseInt(getSheetField(row, "D15 - Termómetro SER (1-5)", "D15: Termómetro SER"), 10) || 4,
    dia15_servir: parseInt(getSheetField(row, "D15 - Termómetro SERVIR (1-5)", "D15: Termómetro SERVIR"), 10) || 4,
    dia15_saber: parseInt(getSheetField(row, "D15 - Termómetro SABER (1-5)", "D15: Termómetro SABER"), 10) || 4,
    dia15_sonreir: parseInt(getSheetField(row, "D15 - Termómetro SONREÍR (1-5)", "D15: Termómetro SONREIR"), 10) || 4,
    dia15_sorprender: parseInt(getSheetField(row, "D15 - Termómetro SORPRENDER (1-5)", "D15: Termómetro SORPRENDER"), 10) || 4,
    dia15_s_fortalecer: getSheetField(row, "D15 - S a Fortalecer", "D15: S a Fortalecer"),
    dia15_comportamiento: getSheetField(row, "D15 - Comportamiento de salida", "D15: Comportamiento de salida"),
    meta_etapa2: "",

    // SONREÍR
    sonreir_reconocimiento: checkBool("SONREÍR - Reconocí algo positivo", "SONREIR - Reconoci algo positivo"),
    sonreir_queja: checkBool("SONREÍR - Transformé queja en propuesta", "SONREIR - Transforme queja en propuesta"),
    sonreir_ambiente: checkBool("SONREÍR - Mejoré el ambiente", "SONREIR - Mejore el ambiente"),
    sonreir_situacion: getSheetField(row, "SONREÍR - Situación transformada", "SONREIR - Situacion transformada"),
    sonreir_reaccion: getSheetField(row, "SONREÍR - Reacción antes vs ahora", "SONREIR - Reaccion antes vs ahora"),
    sonreir_efecto: getSheetField(row, "SONREÍR - Efecto logrado", "SONREIR - Efecto logrado"),

    // SORPRENDER
    sorprender_oportunidad: getSheetField(row, "SORPRENDER - Oportunidad cotidiana", "SORPRENDER: Oportunidad cotidiana"),
    sorprender_idea: getSheetField(row, "SORPRENDER - Idea 1% extra", "SORPRENDER: Idea 1% extra"),
    sorprender_prueba: getSheetField(row, "SORPRENDER - Prueba y qué pasó", "SORPRENDER: Prueba y que paso"),
    sorprender_resultado: getSheetField(row, "SORPRENDER - Resultado (Funcionó)", "SORPRENDER: Resultado"),
    sorprender_y_si: getSheetField(row, "SORPRENDER - Banco de ideas (¿Y si nosotros...?)", "SORPRENDER: Banco de ideas"),

    // RETO INTEGRADO
    reto_integrado_s: retoS,
    reto_integrado_accion: getSheetField(row, "RETO INTEGRADO - Acción", "RETO INTEGRADO: Acción", "RETO INTEGRADO - Accion"),
    reto_integrado_beneficiario: getSheetField(row, "RETO INTEGRADO - Beneficiario", "RETO INTEGRADO: Beneficiario"),
    reto_integrado_resultado: getSheetField(row, "RETO INTEGRADO - Resultado", "RETO INTEGRADO: Resultado"),
    reto_integrado_aprendizaje: getSheetField(row, "RETO INTEGRADO - Enseñanza", "RETO INTEGRADO: Enseñanza", "RETO INTEGRADO - Aprendizaje"),

    // PASAPORTE
    pasaporte_momento_favorito: getSheetField(row, "PASAPORTE - Momento Favorito y S", "PASAPORTE: Momento Favorito"),

    // CIERRE
    cierre_situacion: getSheetField(row, "CIERRE - Situación", "CIERRE: Situación", "CIERRE - Situacion"),
    cierre_accion: getSheetField(row, "CIERRE - Acción", "CIERRE: Acción", "CIERRE - Accion"),
    cierre_resultado: getSheetField(row, "CIERRE - Resultado", "CIERRE: Resultado"),
    cierre_aprendizaje: getSheetField(row, "CIERRE - Aprendizaje", "CIERRE: Aprendizaje"),

    // RECONOCIMIENTO
    reconocimiento_persona: getSheetField(row, "RECONOCIMIENTO - Persona", "RECONOCIMIENTO: Persona"),
    reconocimiento_s: recoS,
    reconocimiento_motivo: getSheetField(row, "RECONOCIMIENTO - Motivo", "RECONOCIMIENTO: Motivo"),

    // COMPROMISOS
    compromiso_ser: getSheetField(row, "COMPROMISO - SER", "COMPROMISO: SER"),
    compromiso_servir: getSheetField(row, "COMPROMISO - SERVIR", "COMPROMISO: SERVIR"),
    compromiso_saber: getSheetField(row, "COMPROMISO - SABER", "COMPROMISO: SABER"),
    compromiso_sonreir: getSheetField(row, "COMPROMISO - SONREÍR", "COMPROMISO: SONREIR"),
    compromiso_sorprender: getSheetField(row, "COMPROMISO - SORPRENDER", "COMPROMISO: SORPRENDER"),
    compromiso_30_dias: getSheetField(row, "COMPROMISO - 30 Días Siguientes", "COMPROMISO: 30 Días Siguientes"),
    fecha_finalizacion: getSheetField(row, "Fecha Finalización", "Fecha Finalizacion")
  };
}
