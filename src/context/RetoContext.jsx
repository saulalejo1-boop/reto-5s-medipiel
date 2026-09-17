import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { api, createEmptyParticipant, normalizeText } from '../services/api';
import { BLOQUES_DATA, getBlockForDay } from '../data/cartillaContent';

const RetoContext = createContext(null);

export function RetoProvider({ children }) {
  // Estado principal del participante
  const [participant, setParticipant] = useState(() => {
    const local = api.getLocalData();
    if (local && local.nombre) {
      return local;
    }
    return createEmptyParticipant();
  });

  // Día visual seleccionado en la pestaña de reto (1-30)
  const [currentDay, setCurrentDay] = useState(() => {
    const local = api.getLocalData();
    return local && local.dia_actual ? Number(local.dia_actual) : 1;
  });

  // Bloque actual de la cartilla (1 al 8)
  const [currentBlockId, setCurrentBlockId] = useState(() => {
    const local = api.getLocalData();
    const day = local && local.dia_actual ? Number(local.dia_actual) : 1;
    const blk = getBlockForDay(day);
    return blk ? blk.id : 1;
  });

  // Pestaña activa ('inicio' | 'reto' | 'pasaporte' | 'progreso')
  const [activeTab, setActiveTab] = useState('inicio');

  // Estados de sincronización
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'saving' | 'offline'
  const [lastSaved, setLastSaved] = useState(null);

  // Modales
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    const local = api.getLocalData();
    return !(local && local.nombre && local.nombre.trim().length > 0);
  });
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, id: Date.now() });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3800);
  }, []);

  // Debounce ref para sincronización con Google Sheets
  const syncTimeoutRef = useRef(null);

  /**
   * Dispara el guardado automático inmediato en LocalStorage
   * y un guardado diferido (debounced) a Google Sheets.
   */
  const persistChanges = useCallback((updatedParticipant) => {
    // 1. Guardado inmediato en LocalStorage
    api.saveLocalData(updatedParticipant);
    setLastSaved(new Date());
    setSyncStatus('saving');

    // 2. Cancelar debounce previo y programar sincronización en segundo plano con Google Sheets
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.syncWithGoogleSheets(updatedParticipant);
        if (res.success) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('offline');
        }
      } catch (e) {
        setSyncStatus('offline');
      }
    }, 1800); // 1.8 segundos de inactividad
  }, []);

  /**
   * Actualiza un solo campo del participante
   */
  const updateField = useCallback((fieldName, value) => {
    setParticipant(prev => {
      const updated = {
        ...prev,
        [fieldName]: value
      };
      persistChanges(updated);
      return updated;
    });
  }, [persistChanges]);

  /**
   * Actualiza múltiples campos simultáneamente
   */
  const updateMultipleFields = useCallback((fieldsObj) => {
    setParticipant(prev => {
      const updated = {
        ...prev,
        ...fieldsObj
      };
      persistChanges(updated);
      return updated;
    });
  }, [persistChanges]);

  /**
   * Marca o desmarca un día en los días completados
   */
  const toggleDayCompletion = useCallback((dayNum) => {
    setParticipant(prev => {
      const currentList = Array.isArray(prev.dias_completados) ? [...prev.dias_completados] : [];
      const index = currentList.indexOf(dayNum);
      let updatedList;
      let justCompleted = false;

      if (index >= 0) {
        updatedList = currentList.filter(d => d !== dayNum);
      } else {
        updatedList = [...currentList, dayNum].sort((a, b) => a - b);
        justCompleted = true;
      }

      const totalDias = 30;
      const nuevoPorcentaje = Math.min(100, Math.round((updatedList.length / totalDias) * 100));

      const updated = {
        ...prev,
        dias_completados: updatedList,
        porcentaje_avance: nuevoPorcentaje,
        dia_actual: dayNum < 30 && justCompleted ? Math.max(prev.dia_actual, dayNum + 1) : prev.dia_actual
      };

      persistChanges(updated);

      if (justCompleted) {
        showToast(`¡Día ${dayNum} marcado como completado!`, 'success');
        // Si completa el día 30 o llega al 100%, abrir modal de celebración
        if (dayNum === 30 || updatedList.length === 30) {
          setIsCelebrationOpen(true);
        }
      } else {
        showToast(`Día ${dayNum} desmarcado.`, 'info');
      }

      return updated;
    });
  }, [persistChanges, showToast]);

  /**
   * Inicializa o restaura un participante desde el Onboarding
   * Si la persona vuelve a ingresar y escribe su nombre, recupera todo su progreso previo
   */
  const startParticipant = useCallback((nombre, tienda, intencion) => {
    const trimmedNombre = (nombre || '').trim();
    const trimmedTienda = (tienda || '').trim();
    const trimmedIntencion = (intencion || '').trim();
    const normName = normalizeText(trimmedNombre);

    // 1. Buscar si ya existe un perfil guardado con este nombre
    const matched = api.findProfileByName(trimmedNombre);

    // 2. O si coincide con la sesión local activa
    const existing = api.getLocalData();
    const isExistingMatch = existing && existing.nombre && normalizeText(existing.nombre) === normName;

    let updated;
    let isResume = false;

    if (matched) {
      // RESTAURAR PROGRESO EXISTENTE DEL COLABORADOR
      isResume = true;
      updated = {
        ...matched,
        nombre: trimmedNombre || matched.nombre,
        tienda: trimmedTienda || matched.tienda || "",
        intencion_30_dias: trimmedIntencion || matched.intencion_30_dias || "",
        fecha_ultima_actualizacion: new Date().toISOString()
      };

      const resumeDay = updated.dia_actual || (Array.isArray(updated.dias_completados) && updated.dias_completados.length > 0 ? Math.max(...updated.dias_completados) : 1);
      setCurrentDay(resumeDay);
      const blk = getBlockForDay(resumeDay);
      setCurrentBlockId(blk ? blk.id : 1);
    } else if (isExistingMatch && existing.participant_id) {
      // Sesión activa existente
      updated = {
        ...existing,
        nombre: trimmedNombre || existing.nombre,
        tienda: trimmedTienda || existing.tienda || "",
        intencion_30_dias: trimmedIntencion || existing.intencion_30_dias || "",
        fecha_ultima_actualizacion: new Date().toISOString()
      };
    } else {
      // Nuevo colaborador
      updated = createEmptyParticipant(trimmedNombre, trimmedTienda, trimmedIntencion);
      setCurrentDay(1);
      setCurrentBlockId(1);
    }

    setParticipant(updated);
    api.saveLocalData(updated);
    setSavedProfiles(api.getSavedProfiles());
    setIsOnboardingOpen(false);

    if (isResume) {
      const pct = updated.porcentaje_avance || 0;
      const count = Array.isArray(updated.dias_completados) ? updated.dias_completados.length : 0;
      showToast(`¡Bienvenido(a) de nuevo, ${updated.nombre}! Restauramos tu progreso (${pct}% · ${count} días completados).`, 'success');
    } else {
      showToast(`¡Bienvenido(a) al Reto 5S, ${updated.nombre}!`, 'success');
    }

    api.syncWithGoogleSheets(updated);
  }, [showToast]);

  /**
   * Sincronización forzada manual
   */
  const forceSync = useCallback(async () => {
    setSyncStatus('saving');
    showToast('Sincronizando con Google Sheets...', 'info');
    try {
      const res = await api.syncWithGoogleSheets(participant);
      if (res.success) {
        setSyncStatus('synced');
        showToast('¡Información sincronizada exitosamente con Google Sheets!', 'success');
      } else {
        setSyncStatus('offline');
        showToast('Guardado en el dispositivo. Se sincronizará al conectar.', 'warning');
      }
    } catch (err) {
      setSyncStatus('offline');
      showToast('Guardado localmente. Error de conexión con Google Sheets.', 'warning');
    }
  }, [participant, showToast]);

  /**
   * Reiniciar reto
   */
  const resetParticipant = useCallback(() => {
    if (window.confirm("¿Seguro que deseas reiniciar tu progreso en este dispositivo?")) {
      api.clearLocalData();
      const fresh = createEmptyParticipant();
      setParticipant(fresh);
      setCurrentDay(1);
      setActiveTab('inicio');
      setIsOnboardingOpen(true);
      showToast("Progreso local reiniciado.", "info");
    }
  }, [showToast]);

  // Directorio de perfiles guardados en este dispositivo
  const [savedProfiles, setSavedProfiles] = useState(() => api.getSavedProfiles());

  const refreshProfiles = useCallback(() => {
    setSavedProfiles(api.getSavedProfiles());
  }, []);

  /**
   * Cierra la sesión activa con guardado previo y abre el modal de ingreso
   */
  const logout = useCallback(() => {
    if (participant && participant.nombre) {
      api.saveProfileToDirectory(participant);
      api.syncWithGoogleSheets(participant, true);
    }
    api.clearLocalData();
    const fresh = createEmptyParticipant();
    setParticipant(fresh);
    setCurrentDay(1);
    setCurrentBlockId(1);
    setActiveTab('inicio');
    setSavedProfiles(api.getSavedProfiles());
    setIsOnboardingOpen(true);
    showToast("Has salido de tu sesión. Tu progreso quedó guardado con seguridad.", "info");
  }, [participant, showToast]);

  /**
   * Cambia a un perfil existente guardado en el dispositivo
   */
  const switchProfile = useCallback((profile) => {
    if (participant && participant.nombre) {
      api.saveProfileToDirectory(participant);
    }
    setParticipant(profile);
    api.saveLocalData(profile);
    const day = profile.dia_actual || 1;
    setCurrentDay(day);
    const blk = getBlockForDay(day);
    setCurrentBlockId(blk ? blk.id : 1);
    setIsOnboardingOpen(false);
    setSavedProfiles(api.getSavedProfiles());
    showToast(`¡Bienvenido(a) de nuevo, ${profile.nombre.split(' ')[0]}!`, 'success');
  }, [participant, showToast]);

  /**
   * Elimina un perfil del directorio local
   */
  const deleteProfile = useCallback((participantId) => {
    api.deleteSavedProfile(participantId);
    setSavedProfiles(api.getSavedProfiles());
    showToast("Perfil eliminado de este dispositivo.", "info");
  }, [showToast]);

  // Listener para sincronización con sendBeacon al cerrar o cambiar de pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (participant && participant.nombre) {
        api.syncWithGoogleSheets(participant, true);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [participant]);

  /**
   * Marca o desmarca todos los días pertenecientes a un bloque
   */
  const toggleBlockCompletion = useCallback((blockId) => {
    const block = BLOQUES_DATA.find(b => b.id === blockId);
    if (!block) return;

    setParticipant(prev => {
      const currentList = Array.isArray(prev.dias_completados) ? [...prev.dias_completados] : [];
      const allCompleted = block.dias.every(d => currentList.includes(d));
      let updatedList;

      if (allCompleted) {
        // Desmarcar todos los días del bloque
        updatedList = currentList.filter(d => !block.dias.includes(d));
        showToast(`Bloque ${block.sName} (${block.diasRango}) desmarcado.`, 'info');
      } else {
        // Completar todos los días del bloque
        const set = new Set([...currentList, ...block.dias]);
        updatedList = Array.from(set).sort((a, b) => a - b);
        showToast(`¡Bloque ${block.sName} (${block.diasRango}) completado!`, 'success');
        if (block.id === 8 || updatedList.length === 30) {
          setIsCelebrationOpen(true);
        }
      }

      const totalDias = 30;
      const nuevoPorcentaje = Math.min(100, Math.round((updatedList.length / totalDias) * 100));

      const updated = {
        ...prev,
        dias_completados: updatedList,
        porcentaje_avance: nuevoPorcentaje
      };

      persistChanges(updated);
      return updated;
    });
  }, [persistChanges, showToast]);

  /**
   * Navegar a un bloque específico
   */
  const goToBlock = useCallback((blockId) => {
    setCurrentBlockId(blockId);
    const block = BLOQUES_DATA.find(b => b.id === blockId);
    if (block && block.dias.length > 0) {
      setCurrentDay(block.dias[0]);
    }
    setActiveTab('reto');
  }, []);

  const isUserLoggedIn = Boolean(participant && participant.nombre && participant.nombre.trim().length > 0);

  return (
    <RetoContext.Provider
      value={{
        participant,
        isUserLoggedIn,
        currentDay,
        setCurrentDay,
        currentBlockId,
        setCurrentBlockId,
        activeTab,
        setActiveTab,
        syncStatus,
        lastSaved,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isCelebrationOpen,
        setIsCelebrationOpen,
        toast,
        showToast,
        updateField,
        updateMultipleFields,
        toggleDayCompletion,
        toggleBlockCompletion,
        goToBlock,
        logout,
        switchProfile,
        deleteProfile,
        savedProfiles,
        refreshProfiles,
        startParticipant,
        forceSync,
        resetParticipant
      }}
    >
      {children}
    </RetoContext.Provider>
  );
}

export function useReto() {
  const context = useContext(RetoContext);
  if (!context) {
    throw new Error('useReto debe ser usado dentro de un RetoProvider');
  }
  return context;
}
