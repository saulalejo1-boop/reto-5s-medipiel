import React, { useState, useMemo } from 'react';
import { useReto } from '../context/RetoContext';
import { api } from '../services/api';
import { exportParticipantsToCsv } from '../utils/exportCsv';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Users,
  BarChart3,
  Download,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Save,
  Trash2,
  X,
  Printer,
  ExternalLink,
  Layers,
  Sparkles,
  Heart,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';

const ADMIN_PIN = 'admin5s'; // Clave por defecto para líderes y administradores

export function AdminPortalView() {
  const {
    participant,
    isUserLoggedIn,
    savedProfiles = [],
    refreshProfiles,
    setActiveTab,
    setIsOnboardingOpen,
    showToast
  } = useReto();

  // Estado de autenticación del administrador en la sesión
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('medipiel_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Pestaña interna del portal: 'metricas' | 'participantes' | 'informes' | 'config'
  const [adminTab, setAdminTab] = useState('metricas');

  // Filtros de participantes
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos' | 'en_curso' | 'dia15' | 'finalizados'

  // Modal para ver respuestas completas de un colaborador
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Configuración técnica de Google Sheets
  const [customScriptUrl, setCustomScriptUrl] = useState(() => api.getScriptUrl());
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // null | 'success' | 'error'
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Lista unificada de participantes
  // Si la sesión actual tiene datos pero aún no está en savedProfiles, la incluimos
  const allParticipants = useMemo(() => {
    let list = Array.isArray(savedProfiles) ? [...savedProfiles] : [];
    if (participant && participant.nombre && participant.nombre.trim().length > 0) {
      const exists = list.some(p => p.participant_id === participant.participant_id);
      if (!exists) {
        list.unshift(participant);
      } else {
        // Asegurar que tenga la versión más actualizada
        const idx = list.findIndex(p => p.participant_id === participant.participant_id);
        if (idx >= 0) list[idx] = participant;
      }
    }
    return list;
  }, [savedProfiles, participant]);

  // Manejo de autenticación
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN || pinInput.trim() === 'medipiel2026') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('medipiel_admin_auth', 'true');
      } catch (e) {}
      showToast('Acceso concedido al Portal de Administrador.', 'success');
    } else {
      setAuthError('Clave incorrecta. Verifica con el líder del proyecto.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('medipiel_admin_auth');
    } catch (e) {}

    // Si no hay ningún colaborador activo con nombre, abrir el modal de ingreso
    if (!isUserLoggedIn) {
      setIsOnboardingOpen(true);
    }
    setActiveTab('inicio');
    showToast('Sesión de administrador cerrada.', 'info');
  };

  // Métricas consolidadas
  const totalColaboradores = allParticipants.length;
  const promedioAvance = totalColaboradores > 0
    ? Math.round(allParticipants.reduce((acc, p) => acc + (p.porcentaje_avance || 0), 0) / totalColaboradores)
    : 0;

  const finalizadosCount = allParticipants.filter(p => (p.porcentaje_avance || 0) >= 100).length;
  const dia15Count = allParticipants.filter(p => {
    const compl = Array.isArray(p.dias_completados) ? p.dias_completados : [];
    return compl.includes(15);
  }).length;

  // Filtrado de participantes
  const filteredParticipants = useMemo(() => {
    return allParticipants.filter(p => {
      const matchSearch =
        (p.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tienda || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      const pct = p.porcentaje_avance || 0;
      const compl = Array.isArray(p.dias_completados) ? p.dias_completados : [];

      if (filterStatus === 'finalizados') return pct >= 100;
      if (filterStatus === 'dia15') return compl.includes(15);
      if (filterStatus === 'en_curso') return pct < 100;
      return true;
    });
  }, [allParticipants, searchQuery, filterStatus]);

  // Exportar a CSV
  const handleExportCsv = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    exportParticipantsToCsv(allParticipants, `Reporte_Reto_5S_Medipiel_${dateStr}.csv`);
    showToast('Informe completo descargado exitosamente.', 'success');
  };

  // Guardar URL de Google Apps Script
  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (customScriptUrl && customScriptUrl.trim().startsWith('http')) {
      api.setScriptUrl(customScriptUrl.trim());
      showToast('URL de Google Apps Script actualizada.', 'success');
      setConnectionStatus(null);
    } else {
      showToast('Ingresa una URL válida que empiece por https://', 'warning');
    }
  };

  // Probar conexión con Google Apps Script
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    try {
      const url = api.getScriptUrl();
      const res = await fetch(url, { method: 'GET', mode: 'no-cors' });
      setConnectionStatus('success');
      showToast('Conexión establecida con Google Apps Script.', 'success');
    } catch (e) {
      setConnectionStatus('error');
      showToast('Error al conectar con la URL configurada.', 'warning');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Forzar sincronización de todos los perfiles a Google Sheets
  const handleSyncAll = async () => {
    if (allParticipants.length === 0) {
      showToast('No hay participantes registrados para sincronizar.', 'info');
      return;
    }
    setIsSyncingAll(true);
    let successCount = 0;
    try {
      for (const p of allParticipants) {
        if (p && p.nombre) {
          await api.syncWithGoogleSheets(p, true);
          successCount++;
        }
      }
      showToast(`¡Se enviaron ${successCount} colaboradores a Google Sheets!`, 'success');
    } catch (e) {
      showToast('Ocurrió un inconveniente durante la sincronización global.', 'warning');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Eliminar perfil de prueba
  const handleDeleteParticipant = (participantId, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar el registro de prueba de "${nombre}"? Esta acción no se puede deshacer.`)) {
      api.deleteSavedProfile(participantId);
      if (refreshProfiles) refreshProfiles();
      showToast(`Registro de "${nombre}" eliminado.`, 'info');
    }
  };

  // -------------------------------------------------------------
  // VISTA 1: PANTALLA DE ACCESO CON PIN DE SEGURIDAD (PANTALLA LIMPIA COMPLETA)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #F1F8F9 0%, #E6F3F5 50%, #DCF0F2 100%)'
      }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '40px 32px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <img
            src="/medipiel-logo.png"
            alt="Medipiel"
            style={{ height: '46px', width: 'auto', margin: '0 auto 16px auto', display: 'block' }}
          />

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--petrol-soft)',
            color: 'var(--petrol)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <ShieldCheck size={14} color="var(--turquoise)" />
            <span>Portal de Administrador</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', color: 'var(--petrol)', marginBottom: '8px' }}>
            Acceso Administrativo
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '24px', lineHeight: 1.45 }}>
            Ingresa tu clave de acceso para consultar métricas corporativas, ver respuestas de colaboradores y descargar reportes en Excel.
          </p>

          {authError && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.86rem',
              marginBottom: '16px',
              fontWeight: 600
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label className="form-label" htmlFor="admin-pin">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={15} color="var(--petrol)" />
                  Clave o PIN de Administrador:
                </span>
              </label>
              <input
                id="admin-pin"
                type="password"
                className="form-input"
                placeholder="Ingresa la clave de acceso..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '8px', marginBottom: '14px' }}
            >
              <ShieldCheck size={18} />
              <span>Ingresar al Panel</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('inicio')}
              style={{ width: '100%', color: 'var(--gray-600)', borderColor: 'var(--gray-300)' }}
            >
              ← Volver a la Cartilla del Colaborador
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA 2: PANEL DE ADMINISTRADOR AUTENTICADO
  // -------------------------------------------------------------
  return (
    <div className="admin-portal-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Barra Superior de Navegación Exclusiva del Administrador */}
      <header className="no-print admin-portal-header">
        <div className="admin-portal-header-brand">
          <img src="/medipiel-logo.png" alt="Medipiel" className="admin-header-logo" />
          <div className="admin-portal-header-titles">
            <div className="admin-portal-title-row">
              <span className="admin-portal-title">
                PORTAL ADMIN RETO 5S
              </span>
              <span className="admin-portal-badge">
                Control y Reportes
              </span>
            </div>
            <span className="admin-portal-subtitle">
              Supervisión y Analítica Corporativa
            </span>
          </div>
        </div>

        <div className="admin-portal-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm admin-logout-btn"
            onClick={handleAdminLogout}
            title="Cerrar sesión de administrador"
          >
            <LogOut size={14} />
            <span className="admin-logout-text">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal del Panel de Administrador */}
      <div className="no-print" style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner Superior del Administrador */}
      <div className="card-hero" style={{ background: 'linear-gradient(135deg, #00363E 0%, #01606D 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--white)'
            }}>
              <ShieldCheck size={15} color="var(--turquoise)" />
              <span>Panel de Control Administrativo</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)', color: 'var(--white)', marginBottom: '8px' }}>
              Administración y Reportes · Reto 5S
            </h1>
            <p style={{ fontSize: '0.96rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '650px', lineHeight: 1.5 }}>
              Monitorea el avance de todas las tiendas, consulta las reflexiones de los colaboradores y exporta los informes completos a Excel.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportCsv}
              style={{
                background: 'var(--turquoise)',
                color: 'var(--petrol)',
                fontWeight: 800,
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 4px 14px rgba(45, 204, 211, 0.25)'
              }}
              title="Descargar informe completo en Excel (.CSV)"
            >
              <Download size={16} />
              <span>Descargar Informe Excel (.CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas del Panel de Admin */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--gray-200)',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          onClick={() => setAdminTab('metricas')}
          style={{
            padding: '10px 18px',
            fontSize: '0.92rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'metricas' ? '3px solid var(--petrol)' : '3px solid transparent',
            background: 'transparent',
            color: adminTab === 'metricas' ? 'var(--petrol)' : 'var(--gray-500)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <BarChart3 size={17} />
          <span>Métricas y Resumen</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('participantes')}
          style={{
            padding: '10px 18px',
            fontSize: '0.92rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'participantes' ? '3px solid var(--petrol)' : '3px solid transparent',
            background: 'transparent',
            color: adminTab === 'participantes' ? 'var(--petrol)' : 'var(--gray-500)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Users size={17} />
          <span>Directorio y Respuestas ({totalColaboradores})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('informes')}
          style={{
            padding: '10px 18px',
            fontSize: '0.92rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'informes' ? '3px solid var(--petrol)' : '3px solid transparent',
            background: 'transparent',
            color: adminTab === 'informes' ? 'var(--petrol)' : 'var(--gray-500)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Download size={17} />
          <span>Descarga de Informes</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('config')}
          style={{
            padding: '10px 18px',
            fontSize: '0.92rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'config' ? '3px solid var(--petrol)' : '3px solid transparent',
            background: 'transparent',
            color: adminTab === 'config' ? 'var(--petrol)' : 'var(--gray-500)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Settings size={17} />
          <span>Configuración y Conexión</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* PESTAÑA 1: MÉTRICAS Y RESUMEN GENERAL                         */}
      {/* ============================================================= */}
      {adminTab === 'metricas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tarjetas de KPIs Globales */}
          <div className="grid-3">
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                Colaboradores Registrados
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--petrol)', margin: '6px 0' }}>
                {totalColaboradores}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
                Participantes con cuenta activa en el Reto 5S
              </p>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                Promedio de Avance Corporativo
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--turquoise-hover)', margin: '6px 0' }}>
                {promedioAvance}%
              </div>
              <div className="progress-track" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${promedioAvance}%` }}></div>
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                Cumplimiento de Hitos Clave
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <span style={{ color: 'var(--gray-700)' }}>Día 15 (Encuentro Avances):</span>
                  <strong style={{ color: '#D97706' }}>{dia15Count} colaboradores</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <span style={{ color: 'var(--gray-700)' }}>Día 30 (Reto Completado 100%):</span>
                  <strong style={{ color: 'var(--success)' }}>{finalizadosCount} colaboradores</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Avance por Pilar Cultural */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="var(--petrol)" />
              <span>Avance Global por Cada una de las 5S</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'SER (Días 1 al 5)', range: [1, 2, 3, 4, 5], color: '#01606D' },
                { name: 'SERVIR (Días 6 al 10)', range: [6, 7, 8, 9, 10], color: '#037C8D' },
                { name: 'SABER (Días 11 al 14)', range: [11, 12, 13, 14], color: '#0F9D7A' },
                { name: 'DÍA 15 (Encuentro de Avances)', range: [15], color: '#D97706' },
                { name: 'SONREÍR (Días 16 al 20)', range: [16, 17, 18, 19, 20], color: '#E67E22' },
                { name: 'SORPRENDER (Días 21 al 25)', range: [21, 22, 23, 24, 25], color: '#8E44AD' },
                { name: 'INTEGRACIÓN 5S (Días 26 al 29)', range: [26, 27, 28, 29], color: '#01606D' },
                { name: 'DÍA 30 CIERRE (De Reto a Hábito)', range: [30], color: '#059669' }
              ].map(pilar => {
                // Calcular cuántos colaboradores completaron todos los días de este pilar
                const totalDiasPilar = pilar.range.length;
                let sumDiasPilar = 0;
                allParticipants.forEach(p => {
                  const compl = Array.isArray(p.dias_completados) ? p.dias_completados : [];
                  const doneInPilar = pilar.range.filter(d => compl.includes(d)).length;
                  sumDiasPilar += doneInPilar;
                });
                const totalPosibles = totalColaboradores * totalDiasPilar;
                const pilarPct = totalPosibles > 0 ? Math.round((sumDiasPilar / totalPosibles) * 100) : 0;

                return (
                  <div key={pilar.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 700, color: pilar.color }}>
                        {pilar.name}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--gray-700)' }}>
                        {pilarPct}% de adopción
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${pilarPct}%`, background: pilar.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PESTAÑA 2: DIRECTORIO Y RESPUESTAS POR PARTICIPANTE           */}
      {/* ============================================================= */}
      {adminTab === 'participantes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Barra de Filtros y Búsqueda */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                <Search size={18} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar por nombre o tienda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                  Filtrar:
                </span>
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'en_curso', label: 'En Curso' },
                  { id: 'dia15', label: 'Día 15 Listo' },
                  { id: 'finalizados', label: '100% Completados' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterStatus(f.id)}
                    className="btn btn-sm"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      background: filterStatus === f.id ? 'var(--petrol)' : 'var(--gray-100)',
                      color: filterStatus === f.id ? 'var(--white)' : 'var(--gray-700)',
                      border: 'none'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de Participantes */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-600)' }}>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Colaborador</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Tienda / Sede</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Días</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Avance</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Última Actualización</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--gray-500)' }}>
                        No se encontraron colaboradores con los criterios seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map(p => {
                      const complCount = Array.isArray(p.dias_completados) ? p.dias_completados.length : 0;
                      const pct = p.porcentaje_avance || 0;
                      const initials = p.nombre
                        ? p.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : 'MP';

                      return (
                        <tr
                          key={p.participant_id}
                          style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--turquoise) 0%, var(--petrol) 100%)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                flexShrink: 0
                              }}>
                                {initials}
                              </div>
                              <div>
                                <strong style={{ color: 'var(--gray-800)', display: 'block' }}>
                                  {p.nombre || 'Sin nombre'}
                                </strong>
                                <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                                  ID: {p.participant_id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px', color: 'var(--petrol)', fontWeight: 600 }}>
                            {p.tienda || 'No especificada'}
                          </td>

                          <td style={{ padding: '14px 18px', color: 'var(--gray-700)', fontWeight: 700 }}>
                            {complCount} <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>/ 30</span>
                          </td>

                          <td style={{ padding: '14px 18px', minWidth: '130px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="progress-track" style={{ height: '7px', flex: 1 }}>
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${pct}%`,
                                    background: pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--turquoise-hover)' : 'var(--petrol)'
                                  }}
                                ></div>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--gray-700)', minWidth: '32px' }}>
                                {pct}%
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                            {p.fecha_ultima_actualizacion
                              ? new Date(p.fecha_ultima_actualizacion).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : '—'}
                          </td>

                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => setSelectedParticipant(p)}
                                style={{ gap: '4px', fontSize: '0.8rem', padding: '5px 10px' }}
                                title="Ver respuestas detalladas"
                              >
                                <Eye size={14} />
                                <span>Ver Respuestas</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteParticipant(p.participant_id, p.nombre)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--gray-400)',
                                  cursor: 'pointer',
                                  padding: '5px 8px',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                                title="Eliminar registro de prueba"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PESTAÑA 3: DESCARGA DE INFORMES EN EXCEL / CSV                 */}
      {/* ============================================================= */}
      {adminTab === 'informes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Principal de Descarga */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(45, 204, 211, 0.2) 0%, rgba(1, 96, 109, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--petrol)',
                flexShrink: 0
              }}>
                <Download size={28} />
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--petrol)', marginBottom: '6px' }}>
                  Informe Completo por Colaborador en Excel (.CSV)
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Genera y descarga un archivo estructurado con formato UTF-8 (compatible con Microsoft Excel y Google Sheets).
                  Cada fila representa a un colaborador e incluye sus datos de identificación, avance general y **todas las respuestas y reflexiones de la cartilla (SER, SERVIR, SABER, DÍA 15, SONREÍR, SORPRENDER, RETO INTEGRADO y DÍA 30)** en columnas separadas.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleExportCsv}
                    style={{ gap: '8px' }}
                  >
                    <Download size={18} />
                    <span>Descargar Informe Completo en Excel (.CSV)</span>
                  </button>

                  <a
                    href="https://docs.google.com/spreadsheets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ gap: '8px', textDecoration: 'none' }}
                  >
                    <ExternalLink size={16} />
                    <span>Abrir Google Sheets Central</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Guía de Contenido del Informe */}
          <div className="card">
            <h4 style={{ fontSize: '1.05rem', color: 'var(--petrol)', marginBottom: '12px' }}>
              Contenido de las Columnas del Informe Descargado:
            </h4>
            <div className="grid-3" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>
              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--petrol)', display: 'block', marginBottom: '6px' }}>Datos Generales:</strong>
                ID, Nombre completo, Tienda o sede, % de avance, Días completados (número y lista), Día actual, Fecha inicio, Última actualización e Intención 30 días.
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--petrol)', display: 'block', marginBottom: '6px' }}>Etapa 1 (Días 1 al 15):</strong>
                SER (3 características, acción y descubrimiento), SERVIR (tipos de ayuda, persona apoyada, necesidad, acción y cambio), SABER (qué enseñó, a quién, qué aprendió), DÍA 15 (historia, semáforo, termómetros y meta etapa 2).
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--petrol)', display: 'block', marginBottom: '6px' }}>Etapa 2 (Días 16 al 30):</strong>
                SONREÍR (situación, antes vs ahora y efecto), SORPRENDER (oportunidad, idea 1%, prueba, resultado y banco de ideas), RETO INTEGRADO, DÍA 30 CIERRE (situación, reconocimiento a compañero, compromisos por cada pilar y 30 días).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PESTAÑA 4: CONFIGURACIÓN Y CONEXIÓN TÉCNICA                   */}
      {/* ============================================================= */}
      {adminTab === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card de Configuración de Google Sheets */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} color="var(--petrol)" />
              <span>Conexión con Google Apps Script y Google Sheets</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '18px' }}>
              Configura la URL central del Web App donde se envían las respuestas en tiempo real desde todos los dispositivos y sedes.
            </p>

            <form onSubmit={handleSaveUrl}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-script-url">
                  URL del Web App de Google Apps Script:
                  <small>Debe terminar en <code>/exec</code> y tener acceso como "Cualquier usuario".</small>
                </label>
                <input
                  id="admin-script-url"
                  type="url"
                  className="form-input"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={customScriptUrl}
                  onChange={(e) => setCustomScriptUrl(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  <Save size={15} />
                  <span>Guardar URL</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  style={{ gap: '6px' }}
                >
                  <RefreshCw size={14} className={isTestingConnection ? 'sync-dot pulse' : ''} />
                  <span>{isTestingConnection ? 'Probando...' : 'Probar Conexión'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleSyncAll}
                  disabled={isSyncingAll}
                  style={{ gap: '6px', color: 'var(--petrol)' }}
                >
                  <RefreshCw size={14} className={isSyncingAll ? 'sync-dot pulse' : ''} />
                  <span>{isSyncingAll ? 'Sincronizando...' : 'Forzar Sincronización de Todos los Perfiles'}</span>
                </button>
              </div>

              {connectionStatus === 'success' && (
                <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>La URL responde correctamente y está lista para recibir sincronizaciones.</span>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>No se pudo conectar con la URL. Verifica que la implementación esté activa como aplicación web pública en Apps Script.</span>
                </div>
              )}
            </form>
          </div>

          {/* Instrucciones Rápidas para Apps Script */}
          <div className="card" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--petrol)', marginBottom: '8px' }}>
              ¿Cómo desplegar la hoja de Google Sheets?
            </h4>
            <ol style={{ paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
              <li>Crea una nueva hoja de cálculo en tu Google Drive corporativo llamada <strong>"Medipiel - Reto 5S"</strong>.</li>
              <li>Ve a <strong>Extensiones &gt; Apps Script</strong> y pega el código de <code>google_apps_script.js</code>.</li>
              <li>Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, tipo: <strong>Aplicación Web</strong>, acceso: <strong>Cualquier usuario</strong>.</li>
              <li>Copia el enlace que termina en <code>/exec</code> y pégalo en la casilla de arriba.</li>
            </ol>
          </div>
        </div>
      )}
      </div>

      {/* ============================================================= */}
      {/* MODAL: FICHA COMPLETA DE RESPUESTAS DEL COLABORADOR           */}
      {/* ============================================================= */}
      {/* Modal para ver respuestas completas de un colaborador */}
      {selectedParticipant && (
        <div className="modal-overlay print-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-card print-modal-card" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            
            {/* Header del Reporte Exclusivo para Impresión Oficial (PDF / Papel) */}
            <div className="print-only" style={{ display: 'none', borderBottom: '2px solid var(--petrol)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="/medipiel-logo.png" alt="Medipiel" style={{ height: '36px', width: 'auto' }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--petrol)', letterSpacing: '0.3px' }}>
                    RETO 5S · CULTURA MEDIPIEL
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', fontWeight: 600 }}>
                    Ficha Oficial de Respuestas y Reflexiones
                  </div>
                </div>
              </div>
            </div>

            {/* Header del Modal en Pantalla */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--gray-200)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Ficha de Respuestas del Colaborador
                </span>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--petrol)', margin: '4px 0' }}>
                  {selectedParticipant.nombre || 'Colaborador'}
                </h2>
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.86rem', color: 'var(--gray-600)', flexWrap: 'wrap' }}>
                  <span>📍 <strong>Tienda:</strong> {selectedParticipant.tienda || 'Sin sede'}</span>
                  <span>📊 <strong>Avance:</strong> {selectedParticipant.porcentaje_avance || 0}% ({(selectedParticipant.dias_completados || []).length}/30 días)</span>
                  <span>🕒 <strong>Última fecha:</strong> {selectedParticipant.fecha_ultima_actualizacion ? new Date(selectedParticipant.fecha_ultima_actualizacion).toLocaleString() : '—'}</span>
                </div>
              </div>

              {/* Botones de acción (Ocultos en impresión) */}
              <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => window.print()}
                  style={{ gap: '4px' }}
                  title="Imprimir o guardar como PDF"
                >
                  <Printer size={15} />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedParticipant(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: '4px' }}
                  title="Cerrar modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Contenido de las Respuestas por Bloque */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.88rem' }}>
              {/* Intención 30 Días */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: 'var(--petrol)', display: 'block', marginBottom: '4px' }}>🎯 Intención para los 30 Días:</strong>
                <p style={{ margin: 0, color: 'var(--gray-700)' }}>
                  {selectedParticipant.intencion_30_dias || <em>No registrada aún.</em>}
                </p>
              </div>

              {/* SER */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#01606D', display: 'block', marginBottom: '6px' }}>1. SER (Días 1 al 5) — Mi Sello Personal:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Cualidad 1:</strong> {selectedParticipant.ser_caracteristica_1 || '—'}</li>
                  <li><strong>Cualidad 2:</strong> {selectedParticipant.ser_caracteristica_2 || '—'}</li>
                  <li><strong>Cualidad 3:</strong> {selectedParticipant.ser_caracteristica_3 || '—'}</li>
                  <li><strong>Acción concreta demostrada:</strong> {selectedParticipant.ser_accion || '—'}</li>
                  <li><strong>Qué descubrió de sí mismo:</strong> {selectedParticipant.ser_descubrimiento || '—'}</li>
                </ul>
              </div>

              {/* SERVIR */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#037C8D', display: 'block', marginBottom: '6px' }}>2. SERVIR (Días 6 al 10) — La Ayuda Inesperada:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Tipos de ayuda brindados:</strong> {(selectedParticipant.servir_tipos_ayuda || []).join(', ') || '—'}</li>
                  <li><strong>A quién apoyó:</strong> {selectedParticipant.servir_a_quien || '—'}</li>
                  <li><strong>Necesidad observada:</strong> {selectedParticipant.servir_necesidad || '—'}</li>
                  <li><strong>Qué hizo concretamente:</strong> {selectedParticipant.servir_que_hice || '—'}</li>
                  <li><strong>Qué cambió gracias a su ayuda:</strong> {selectedParticipant.servir_cambio || '—'}</li>
                </ul>
              </div>

              {/* SABER */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#0F9D7A', display: 'block', marginBottom: '6px' }}>3. SABER (Días 11 al 14) — Te Enseño en 5 Minutos:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Qué enseñó:</strong> {selectedParticipant.saber_que_ensene || '—'}</li>
                  <li><strong>A quién se lo compartió:</strong> {selectedParticipant.saber_a_quien || '—'}</li>
                  <li><strong>Qué aprendió de otra persona:</strong> {selectedParticipant.saber_que_aprendi || '—'}</li>
                  <li><strong>Dónde lo aplicará en tienda:</strong> {selectedParticipant.saber_donde_aplicar || '—'}</li>
                </ul>
              </div>

              {/* DÍA 15 */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#D97706', display: 'block', marginBottom: '6px' }}>4. DÍA 15 — Encuentro de Avances:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Historia en 1 minuto:</strong> {selectedParticipant.dia15_historia || '—'}</li>
                  <li><strong>Semáforo Rojo:</strong> {selectedParticipant.dia15_rojo || '—'}</li>
                  <li><strong>Semáforo Amarillo:</strong> {selectedParticipant.dia15_amarillo || '—'}</li>
                  <li><strong>Semáforo Verde:</strong> {selectedParticipant.dia15_verde || '—'}</li>
                  <li><strong>Termómetro 5S (1-5):</strong> SER: {selectedParticipant.dia15_ser || '—'} | SERVIR: {selectedParticipant.dia15_servir || '—'} | SABER: {selectedParticipant.dia15_saber || '—'} | SONREÍR: {selectedParticipant.dia15_sonreir || '—'} | SORPRENDER: {selectedParticipant.dia15_sorprender || '—'}</li>
                  <li><strong>S a fortalecer en Etapa 2:</strong> {selectedParticipant.dia15_s_fortalecer || '—'}</li>
                  <li><strong>Comportamiento visible:</strong> {selectedParticipant.dia15_comportamiento || '—'}</li>
                  <li><strong>Meta para la Etapa 2:</strong> {selectedParticipant.meta_etapa2 || '—'}</li>
                </ul>
              </div>

              {/* SONREÍR */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#E67E22', display: 'block', marginBottom: '6px' }}>5. SONREÍR (Días 16 al 20) — 24 Horas de Buena Energía:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Reconocí y agradecí:</strong> {selectedParticipant.sonreir_reconocimiento ? 'Sí' : 'No'}</li>
                  <li><strong>Transformé queja en propuesta:</strong> {selectedParticipant.sonreir_queja ? 'Sí' : 'No'}</li>
                  <li><strong>Cuidé el ambiente positivo:</strong> {selectedParticipant.sonreir_ambiente ? 'Sí' : 'No'}</li>
                  <li><strong>Situación difícil:</strong> {selectedParticipant.sonreir_situacion || '—'}</li>
                  <li><strong>Cómo reaccionó antes vs ahora:</strong> {selectedParticipant.sonreir_reaccion || '—'}</li>
                  <li><strong>Efecto en equipo o clientes:</strong> {selectedParticipant.sonreir_efecto || '—'}</li>
                </ul>
              </div>

              {/* SORPRENDER */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#8E44AD', display: 'block', marginBottom: '6px' }}>6. SORPRENDER (Días 21 al 25) — El 1% Extra:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Oportunidad observada:</strong> {selectedParticipant.sorprender_oportunidad || '—'}</li>
                  <li><strong>Idea del 1% extra:</strong> {selectedParticipant.sorprender_idea || '—'}</li>
                  <li><strong>Prueba realizada en tienda:</strong> {selectedParticipant.sorprender_prueba || '—'}</li>
                  <li><strong>Resultado de la prueba:</strong> {selectedParticipant.sorprender_resultado || '—'}</li>
                  <li><strong>Banco de Ideas (¿Y si nosotros...?):</strong> {selectedParticipant.sorprender_y_si || '—'}</li>
                </ul>
              </div>

              {/* RETO INTEGRADO */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#01606D', display: 'block', marginBottom: '6px' }}>7. RETO INTEGRADO (Días 26 al 29) — Mi Reto 5S Completo:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>S integradas:</strong> {(selectedParticipant.reto_integrado_s || []).join(', ') || '—'}</li>
                  <li><strong>Acción concreta:</strong> {selectedParticipant.reto_integrado_accion || '—'}</li>
                  <li><strong>Beneficiario:</strong> {selectedParticipant.reto_integrado_beneficiario || '—'}</li>
                  <li><strong>Resultado:</strong> {selectedParticipant.reto_integrado_resultado || '—'}</li>
                  <li><strong>Aprendizaje:</strong> {selectedParticipant.reto_integrado_aprendizaje || '—'}</li>
                </ul>
              </div>

              {/* DÍA 30 CIERRE */}
              <div className="print-section" style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: '#059669', display: 'block', marginBottom: '6px' }}>8. DÍA 30 CIERRE — De Reto a Hábito:</strong>
                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <li><strong>Historia final:</strong> {selectedParticipant.cierre_resultado || '—'}</li>
                  <li><strong>Reconocimiento a compañero(a):</strong> {selectedParticipant.reconocimiento_persona || '—'} ({(selectedParticipant.reconocimiento_s || []).join(', ')})</li>
                  <li><strong>Motivo del reconocimiento:</strong> {selectedParticipant.reconocimiento_motivo || '—'}</li>
                  <li><strong>Compromiso SER:</strong> {selectedParticipant.compromiso_ser || '—'}</li>
                  <li><strong>Compromiso SERVIR:</strong> {selectedParticipant.compromiso_servir || '—'}</li>
                  <li><strong>Compromiso SABER:</strong> {selectedParticipant.compromiso_saber || '—'}</li>
                  <li><strong>Compromiso SONREÍR:</strong> {selectedParticipant.compromiso_sonreir || '—'}</li>
                  <li><strong>Compromiso SORPRENDER:</strong> {selectedParticipant.compromiso_sorprender || '—'}</li>
                  <li><strong>Compromiso para los 30 días siguientes:</strong> {selectedParticipant.compromiso_30_dias || '—'}</li>
                </ul>
              </div>

              {/* Pie de Página Oficial en Impresión */}
              <div className="print-footer" style={{ display: 'none' }}>
                Reto 5S · Cultura Medipiel · Documento oficial de seguimiento individual · Generado el {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
