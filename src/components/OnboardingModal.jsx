import React, { useState, useEffect, useMemo } from 'react';
import { useReto } from '../context/RetoContext';
import { normalizeText, api, findBestProfileMatch } from '../services/api';
import {
  Sparkles,
  MapPin,
  User,
  Heart,
  ArrowRight,
  X,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Search,
  RefreshCw,
  Award,
  Calendar
} from 'lucide-react';

export function OnboardingModal() {
  const {
    participant,
    startParticipant,
    isOnboardingOpen,
    setIsOnboardingOpen,
    setActiveTab,
    logout,
    savedProfiles = [],
    remoteProfiles = [],
    isLoadingRemoteProfiles = false
  } = useReto();

  const isExistingUser = Boolean(participant.nombre && participant.nombre.trim().length > 0);

  const [nombre, setNombre] = useState(participant.nombre || '');
  const [tienda, setTienda] = useState(participant.tienda || '');
  const [intencion, setIntencion] = useState(participant.intencion_30_dias || '');
  const [error, setError] = useState('');
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sincronizar campos cuando cambia el participante activo o se abre el modal
  useEffect(() => {
    if (participant && participant.nombre) {
      setNombre(participant.nombre);
      setTienda(participant.tienda || '');
      setIntencion(participant.intencion_30_dias || '');
      setMatchedProfile(participant);
    } else {
      setNombre('');
      setTienda('');
      setIntencion('');
      setMatchedProfile(null);
    }
  }, [participant, isOnboardingOpen]);

  // Directorio unificado de búsqueda: perfiles en este equipo + todos los perfiles de Google Sheets
  const allProfiles = useMemo(() => {
    const map = new Map();

    // 1. Perfiles locales en el navegador
    if (Array.isArray(savedProfiles)) {
      savedProfiles.forEach(p => {
        if (p && p.nombre) {
          const key = normalizeText(p.nombre);
          if (key) map.set(key, p);
        }
      });
    }

    // 2. Perfiles descargados en vivo desde Google Sheets
    if (Array.isArray(remoteProfiles)) {
      remoteProfiles.forEach(p => {
        if (p && p.nombre) {
          const key = normalizeText(p.nombre);
          if (key) {
            const existing = map.get(key);
            if (!existing) {
              map.set(key, p);
            } else {
              // Conservar el que tenga respuestas o mayor porcentaje de avance
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

    return Array.from(map.values());
  }, [savedProfiles, remoteProfiles]);

  const normalizedInputName = normalizeText(nombre);

  // Reconocimiento y autocompletado en tiempo real al escribir o pegar el nombre
  useEffect(() => {
    if (isExistingUser) return;

    if (!normalizedInputName || normalizedInputName.length < 2) {
      setMatchedProfile(null);
      return;
    }

    // Buscar coincidencia inteligente (detecta exacto y rescata avance si hubo variaciones)
    const best = findBestProfileMatch(nombre, allProfiles);

    if (best) {
      setMatchedProfile(best);
      // Pre-llenar tienda e intención automáticamente si no han sido escritas o si están vacías
      if (best.tienda) {
        setTienda(best.tienda);
      }
      if (best.intencion_30_dias) {
        setIntencion(best.intencion_30_dias);
      }
    } else if (matchedProfile && normalizeText(matchedProfile.nombre) !== normalizedInputName) {
      // Si el usuario modificó el nombre y ya no coincide, desvincular el match exacto
      setMatchedProfile(null);
    }
  }, [normalizedInputName, allProfiles, isExistingUser]);



  // Búsqueda manual forzada en la nube por si Google Sheets tiene registros recientes
  const handleDeepSearch = async () => {
    if (!nombre.trim()) {
      setError('Por favor escribe tu nombre antes de buscar.');
      return;
    }
    setIsSearching(true);
    setError('');
    try {
      const found = await api.fetchParticipantByName(nombre);
      if (found) {
        setMatchedProfile(found);
        setNombre(found.nombre);
        if (found.tienda) setTienda(found.tienda);
        if (found.intencion_30_dias) setIntencion(found.intencion_30_dias);
      } else {
        setError(`No encontramos registros previos para "${nombre.trim()}". Iniciarás como participante nuevo.`);
      }
    } catch (err) {
      setError('Error al consultar en Google Sheets. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOnboardingOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre completo para comenzar.');
      return;
    }
    if (!tienda.trim()) {
      setError('Por favor escribe o pega el nombre de tu tienda o sede.');
      return;
    }
    if (!intencion.trim()) {
      setError('Por favor escribe tu intención para estos 30 días antes de comenzar.');
      return;
    }
    setError('');

    let profileToUse = matchedProfile;
    if (!profileToUse) {
      profileToUse = findBestProfileMatch(nombre, allProfiles);
    }
    if (!profileToUse) {
      try {
        setIsSearching(true);
        profileToUse = await api.fetchParticipantByName(nombre);
      } catch (err) {
      } finally {
        setIsSearching(false);
      }
    }

    startParticipant(nombre, tienda, intencion, profileToUse);
  };

  const handleLogout = () => {
    if (window.confirm("¿Deseas salir de tu reto? Tu progreso quedará guardado para que puedas continuar después.")) {
      logout();
      setNombre('');
      setTienda('');
      setIntencion('');
      setError('');
      setMatchedProfile(null);
    }
  };

  return (
    <div className="modal-overlay onboarding-overlay">
      {/* Decoración de fondo institucional */}
      <div className="onboarding-bg-decorations" aria-hidden="true">
        <div className="decor-orb decor-orb-1"></div>
        <div className="decor-orb decor-orb-2"></div>

        <svg className="decor-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="140" cy="180" r="90" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.1" strokeDasharray="5 5" />
          <circle cx="140" cy="180" r="180" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.08" />
          <circle cx="140" cy="180" r="280" stroke="#2DCCD3" strokeWidth="1" strokeOpacity="0.12" />
          <circle cx="1340" cy="760" r="140" stroke="#2DCCD3" strokeWidth="1.5" strokeOpacity="0.14" strokeDasharray="6 6" />
          <circle cx="1340" cy="760" r="250" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.08" />
          <circle cx="1340" cy="760" r="380" stroke="#2DCCD3" strokeWidth="1" strokeOpacity="0.06" />
          <path d="M-60,540 C280,440 460,740 840,620 C1140,520 1340,680 1520,590" stroke="#01606D" strokeWidth="1.5" strokeOpacity="0.08" />
          <path d="M-60,580 C320,480 500,780 880,660 C1180,560 1380,720 1560,630" stroke="#2DCCD3" strokeWidth="1.2" strokeOpacity="0.1" />
        </svg>

        <div className="decor-pill decor-pill-1">
          <Sparkles size={13} color="var(--turquoise-hover)" />
          <span>Cultura Medipiel</span>
        </div>
      </div>

      <div className="modal-card">
        {/* Barra superior del modal */}
        <div className="onboarding-modal-top-bar">
          <button
            type="button"
            className="btn-onboarding-admin"
            onClick={() => {
              setIsOnboardingOpen(false);
              setActiveTab('admin');
            }}
            title="Acceso directo al Portal de Administrador"
          >
            <ShieldCheck size={14} />
            <span>Acceso Admin</span>
          </button>

          {isExistingUser ? (
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="btn-onboarding-close"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          ) : (
            <span style={{ width: '28px' }}></span>
          )}
        </div>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src="/medipiel-logo.png"
            alt="Medipiel"
            style={{ height: '42px', width: 'auto', marginBottom: '10px' }}
          />
          <h2 style={{ fontSize: '1.45rem', color: 'var(--petrol)', marginBottom: '4px' }}>
            {isExistingUser ? 'Mi Perfil Reto 5S' : '¡Bienvenido(a) al Reto 5S!'}
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 10px auto', lineHeight: '1.4' }}>
            30 días para vivir nuestra cultura mediante acciones prácticas que se ven, se sienten y se repiten.
          </p>

          <div className="modal-5s-banner">
            <span>Ser</span>
            <span className="dot">•</span>
            <span>Servir</span>
            <span className="dot">•</span>
            <span>Saber</span>
            <span className="dot">•</span>
            <span>Sonreír</span>
            <span className="dot">•</span>
            <span>Sorprender</span>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.86rem',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre Completo */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label className="form-label" htmlFor="input-nombre" style={{ marginBottom: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} color="var(--petrol)" />
                  Nombre completo:
                </span>
              </label>

              {/* Botón de búsqueda rápida en Google Sheets */}
              {!isExistingUser && normalizedInputName.length >= 2 && !matchedProfile && (
                <button
                  type="button"
                  onClick={handleDeepSearch}
                  disabled={isSearching}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--turquoise-hover)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px'
                  }}
                  title="Buscar avance en Google Sheets"
                >
                  {isSearching ? <RefreshCw size={12} className="spin" /> : <Search size={12} />}
                  <span>{isSearching ? 'Buscando...' : 'Buscar mi avance'}</span>
                </button>
              )}
            </div>

            {!isExistingUser && (
              <small style={{ display: 'block', color: 'var(--gray-500)', fontSize: '0.78rem', marginBottom: '6px' }}>
                Copia o escribe tu nombre tal como lo registraste para recuperar tus respuestas y porcentaje de avance.
              </small>
            )}

            <div style={{ position: 'relative' }}>
              <input
                id="input-nombre"
                type="text"
                className="form-input"
                placeholder="Ej. María Camila Gómez o pega tu nombre..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="name"
              />
              {isLoadingRemoteProfiles && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.72rem',
                  color: 'var(--gray-400)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <RefreshCw size={12} className="spin" />
                  <span>Conectando...</span>
                </span>
              )}
            </div>



            {/* Banner de reconocimiento de progreso previo en tiempo real */}
            {matchedProfile && (
              <div className="matched-profile-banner">
                <div className="matched-profile-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={22} color="var(--petrol)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong className="matched-profile-name">
                        ¡Hola de nuevo, {matchedProfile.nombre}!
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                        Progreso recuperado exitosamente desde la base de datos
                      </span>
                    </div>
                  </div>
                  <span className="matched-badge-pill">
                    {matchedProfile.porcentaje_avance || 0}% AVANCE
                  </span>
                </div>

                <div className="matched-stats-pills">
                  <span className="matched-stat-chip">
                    🏆 <strong>{matchedProfile.porcentaje_avance || 0}%</strong> de avance
                  </span>
                  <span className="matched-stat-chip">
                    📅 <strong>{matchedProfile.dias_completados?.length || 0}</strong> de 30 días completados
                  </span>
                  <span className="matched-stat-chip">
                    📍 {matchedProfile.tienda ? matchedProfile.tienda : 'Sede asignada'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--petrol)', fontWeight: 600 }}>
                  ✓ Tus respuestas, reflexiones y compromisos previos están seguros y listos para continuar.
                </p>
              </div>
            )}
          </div>

          {/* Tienda / Sede */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-tienda">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--petrol)" />
                Tienda o Sede:
              </span>
              <small>Copia y pega o escribe el nombre de tu tienda, punto de venta o sede.</small>
            </label>
            <input
              id="input-tienda"
              type="text"
              className="form-input"
              placeholder="Escribe o pega aquí tu tienda o sede..."
              value={tienda}
              onChange={(e) => setTienda(e.target.value)}
              required
            />
          </div>

          {/* Mi intención para estos 30 días */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-intencion">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} color="var(--petrol)" />
                Mi intención para estos 30 días:
                <span style={{ color: 'var(--danger)' }}>*</span>
              </span>
              <small>¿Qué propósito personal y de servicio te motiva en este reto? (Obligatorio)</small>
            </label>
            <textarea
              id="input-intencion"
              className="form-textarea"
              rows={2}
              placeholder="Ej. Conectar genuinamente con mis compañeros, escuchar con empatía a cada cliente y aportar el 1% extra cada día."
              value={intencion}
              onChange={(e) => setIntencion(e.target.value)}
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '10px' }}
          >
            <span>
              {isExistingUser
                ? 'Guardar y Continuar'
                : matchedProfile
                  ? (Number(matchedProfile.porcentaje_avance || 0) > 0
                      ? `Continuar mi Reto (${matchedProfile.porcentaje_avance}% de avance)`
                      : 'Continuar mi Reto 5S')
                  : 'Comenzar mi Reto 5S'}
            </span>
            <ArrowRight size={18} />
          </button>

          {/* Botón Cerrar Sesión / Salir si el usuario ya está autenticado */}
          {isExistingUser && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{
                  width: '100%',
                  color: 'var(--danger)',
                  borderColor: 'var(--gray-300)',
                  gap: '8px'
                }}
              >
                <LogOut size={16} />
                <span>Cerrar sesión / Salir de este perfil</span>
              </button>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '6px' }}>
                Tu progreso se guardará automáticamente antes de salir.
              </p>
            </div>
          )}
        </form>

        {/* Enlace para Administradores / Líderes */}
        <div style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px dashed var(--gray-200)',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={() => {
              setIsOnboardingOpen(false);
              setActiveTab('admin');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--petrol)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--turquoise-hover)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--petrol)';
              e.currentTarget.style.textDecoration = 'none';
            }}
            title="Ingresar directamente al panel administrativo sin registrarse como participante"
          >
            <ShieldCheck size={16} color="var(--turquoise)" />
            <span>¿Eres líder o administrador? Ingresar al Portal Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
