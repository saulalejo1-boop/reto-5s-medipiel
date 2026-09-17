import React, { useState, useEffect } from 'react';
import { useReto } from '../context/RetoContext';
import { normalizeText } from '../services/api';
import {
  Sparkles,
  MapPin,
  User,
  Heart,
  ArrowRight,
  X,
  LogOut,
  Users,
  PlusCircle,
  Trash2,
  CheckCircle2,
  ShieldCheck
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
    switchProfile,
    deleteProfile
  } = useReto();

  const isExistingUser = Boolean(participant.nombre && participant.nombre.trim().length > 0);

  const [activeMode, setActiveMode] = useState(() => {
    return isExistingUser ? 'editar' : savedProfiles.length > 0 ? 'seleccionar' : 'nuevo';
  });

  const [nombre, setNombre] = useState(participant.nombre || '');
  const [tienda, setTienda] = useState(participant.tienda || '');
  const [intencion, setIntencion] = useState(participant.intencion_30_dias || '');
  const [error, setError] = useState('');

  // Detección automática en tiempo real del perfil según el nombre escrito
  const normalizedInputName = normalizeText(nombre);
  const matchedProfile = !isExistingUser && normalizedInputName.length >= 2
    ? savedProfiles.find(p => p.nombre && normalizeText(p.nombre) === normalizedInputName)
    : null;

  // Si encontramos un perfil guardado con ese nombre y el usuario aún no ha escrito tienda/intención, las pre-llenamos
  useEffect(() => {
    if (matchedProfile && !isExistingUser) {
      if (!tienda.trim() && matchedProfile.tienda) {
        setTienda(matchedProfile.tienda);
      }
      if (!intencion.trim() && matchedProfile.intencion_30_dias) {
        setIntencion(matchedProfile.intencion_30_dias);
      }
    }
  }, [matchedProfile, isExistingUser]);

  if (!isOnboardingOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre completo para comenzar.');
      return;
    }
    if (!tienda.trim()) {
      setError('Por favor escribe o pega el nombre de tu tienda o sede.');
      return;
    }
    setError('');
    startParticipant(nombre, tienda, intencion);
  };

  const handleLogout = () => {
    if (window.confirm("¿Deseas salir de tu reto? Tu progreso quedará guardado para que puedas continuar después.")) {
      logout();
      setActiveMode('seleccionar');
    }
  };

  return (
    <div className="modal-overlay onboarding-overlay">
      {/* Decoración de fondo sobria, elegante e institucional */}
      <div className="onboarding-bg-decorations" aria-hidden="true">
        <div className="decor-orb decor-orb-1"></div>
        <div className="decor-orb decor-orb-2"></div>

        <svg className="decor-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Círculos concéntricos sutiles inspirados en ondas y gotas */}
          <circle cx="140" cy="180" r="90" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.1" strokeDasharray="5 5" />
          <circle cx="140" cy="180" r="180" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.08" />
          <circle cx="140" cy="180" r="280" stroke="#2DCCD3" strokeWidth="1" strokeOpacity="0.12" />

          {/* Círculos y arcos en esquina inferior derecha */}
          <circle cx="1340" cy="760" r="140" stroke="#2DCCD3" strokeWidth="1.5" strokeOpacity="0.14" strokeDasharray="6 6" />
          <circle cx="1340" cy="760" r="250" stroke="#01606D" strokeWidth="1.2" strokeOpacity="0.08" />
          <circle cx="1340" cy="760" r="380" stroke="#2DCCD3" strokeWidth="1" strokeOpacity="0.06" />

          {/* Líneas geométricas curvas y fluidas */}
          <path d="M-60,540 C280,440 460,740 840,620 C1140,520 1340,680 1520,590" stroke="#01606D" strokeWidth="1.5" strokeOpacity="0.08" />
          <path d="M-60,580 C320,480 500,780 880,660 C1180,560 1380,720 1560,630" stroke="#2DCCD3" strokeWidth="1.2" strokeOpacity="0.1" />

          {/* Puntos y gotas sutiles decorativas */}
          <circle cx="260" cy="340" r="5" fill="#2DCCD3" fillOpacity="0.35" />
          <circle cx="1180" cy="220" r="7" fill="#01606D" fillOpacity="0.2" />
          <circle cx="1100" cy="290" r="4" fill="#2DCCD3" fillOpacity="0.4" />
          <circle cx="1240" cy="460" r="5" fill="#01606D" fillOpacity="0.22" />
          <circle cx="210" cy="580" r="4" fill="#01606D" fillOpacity="0.25" />
        </svg>

        {/* Sello discreto superior */}
        <div className="decor-pill decor-pill-1">
          <Sparkles size={13} color="var(--turquoise-hover)" />
          <span>Cultura Medipiel</span>
        </div>
      </div>

      <div className="modal-card">
        {/* Barra superior del modal: Acceso Admin y botón Cerrar (evita solaparse con el logo en móvil) */}
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
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <img
            src="/medipiel-logo.png"
            alt="Medipiel"
            style={{ height: '42px', width: 'auto', marginBottom: '10px' }}
          />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--petrol)', marginBottom: '4px' }}>
            {isExistingUser ? 'Mi Perfil Reto 5S' : '¡Bienvenido(a) al Reto 5S!'}
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 12px auto', lineHeight: '1.4' }}>
            30 días para vivir nuestra cultura mediante acciones prácticas que se ven, se sienten y se repiten.
          </p>

          {/* Píldora destacada de las 5S integrada en la tarjeta */}
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

        {/* Selector de modo si no hay sesión activa y hay perfiles guardados */}
        {!isExistingUser && savedProfiles.length > 0 && (
          <div style={{
            display: 'flex',
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setActiveMode('seleccionar')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                background: activeMode === 'seleccionar' ? 'var(--white)' : 'transparent',
                color: activeMode === 'seleccionar' ? 'var(--petrol)' : 'var(--gray-600)',
                boxShadow: activeMode === 'seleccionar' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} />
              <span>Continuar mi Reto</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('nuevo');
                setNombre('');
                setTienda('');
                setIntencion('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                background: activeMode === 'nuevo' ? 'var(--white)' : 'transparent',
                color: activeMode === 'nuevo' ? 'var(--petrol)' : 'var(--gray-600)',
                boxShadow: activeMode === 'nuevo' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={16} />
              <span>Ingresar con mi nombre</span>
            </button>
          </div>
        )}

        {/* MODO SELECCIONAR PERFIL GUARDADO */}
        {!isExistingUser && activeMode === 'seleccionar' && savedProfiles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-600)' }}>
              Selecciona tu nombre para continuar donde quedaste:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {savedProfiles.map(p => {
                const initials = p.nombre
                  ? p.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'MP';

                return (
                  <div
                    key={p.participant_id}
                    onClick={() => switchProfile(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--gray-200)',
                      background: 'var(--white)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--turquoise)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--turquoise) 0%, var(--petrol) 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      {initials}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--gray-800)', display: 'block' }}>
                        {p.nombre}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        {p.tienda || 'Medipiel'} · {p.porcentaje_avance || 0}% completado
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Eliminar el perfil de ${p.nombre} de este dispositivo?`)) {
                          deleteProfile(p.participant_id);
                        }
                      }}
                      title="Eliminar perfil"
                      style={{
                        padding: '6px',
                        color: 'var(--gray-400)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ color: 'var(--petrol)', display: 'flex', alignItems: 'center' }}>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setActiveMode('nuevo');
                setNombre('');
                setTienda('');
                setIntencion('');
              }}
              style={{ marginTop: '8px', gap: '8px' }}
            >
              <PlusCircle size={16} />
              <span>Ingresar como otro colaborador</span>
            </button>
          </div>
        )}

        {/* MODO FORMULARIO (NUEVO O EDITAR) */}
        {(isExistingUser || activeMode === 'nuevo' || savedProfiles.length === 0) && (
          <>
            {error && (
              <div style={{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                marginBottom: '16px',
                fontWeight: 600
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nombre Completo */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-nombre">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} color="var(--petrol)" />
                    Nombre completo:
                  </span>
                  {!isExistingUser && (
                    <small>Si ya habías comenzado, escribe tu nombre para recuperar tu progreso automáticamente.</small>
                  )}
                </label>
                <input
                  id="input-nombre"
                  type="text"
                  className="form-input"
                  placeholder="Ej. María Camila Gómez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

                {/* Banner de reconocimiento de progreso previo en tiempo real */}
                {matchedProfile && (
                  <div style={{
                    marginTop: '10px',
                    padding: '12px 14px',
                    background: 'linear-gradient(135deg, rgba(45, 204, 211, 0.14) 0%, rgba(1, 96, 109, 0.08) 100%)',
                    border: '1.5px solid var(--turquoise)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <CheckCircle2 size={20} color="var(--petrol)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.86rem' }}>
                      <strong style={{ color: 'var(--petrol)', display: 'block' }}>
                        ¡Hola de nuevo, {matchedProfile.nombre}!
                      </strong>
                      <span style={{ color: 'var(--gray-700)', display: 'block', marginTop: '2px' }}>
                        Encontramos tu progreso: <strong>{matchedProfile.porcentaje_avance || 0}% de avance</strong> ({matchedProfile.dias_completados?.length || 0} de 30 días completados).
                      </span>
                      <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem', display: 'block', marginTop: '4px' }}>
                        {matchedProfile.tienda ? `Tienda asociada: "${matchedProfile.tienda}". Puedes cambiarla o dejarla igual.` : 'Al continuar recuperarás todas tus respuestas y sellos.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tienda / Sede (Campo abierto para copiar/pegar o escribir libremente sin desplegable) */}
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
                  </span>
                  <small>¿Qué propósito personal y de servicio te motiva en este reto?</small>
                </label>
                <textarea
                  id="input-intencion"
                  className="form-textarea"
                  rows={2}
                  placeholder="Ej. Conectar genuinamente con mis compañeros, escuchar con empatía a cada cliente y aportar el 1% extra cada día."
                  value={intencion}
                  onChange={(e) => setIntencion(e.target.value)}
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
                      ? `Continuar mi Reto (${matchedProfile.porcentaje_avance || 0}% de avance)`
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
          </>
        )}

        {/* Enlace para Administradores / Líderes */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
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
