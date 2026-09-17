import React from 'react';
import { useReto } from '../context/RetoContext';
import { CINCO_S, DIAS_DATA, RETO_INFO, getBlockForDay } from '../data/cartillaContent';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Award,
  BookOpen,
  HeartHandshake,
  UserCheck,
  Smile,
  ShieldCheck,
  Check
} from 'lucide-react';

export function InicioView() {
  const { participant, isUserLoggedIn, setActiveTab, goToBlock, setIsOnboardingOpen } = useReto();

  const currentDayNum = participant.dia_actual || 1;
  const currentBlock = getBlockForDay(currentDayNum);
  const todayData = DIAS_DATA.find(d => d.dia === currentDayNum) || DIAS_DATA[0];
  const completados = participant.dias_completados || [];
  const isTodayCompleted = completados.includes(currentDayNum);

  const getIconForS = (iconName) => {
    switch (iconName) {
      case 'UserCheck': return UserCheck;
      case 'HeartHandshake': return HeartHandshake;
      case 'BookOpen': return BookOpen;
      case 'Smile': return Smile;
      case 'Sparkles': return Sparkles;
      default: return Sparkles;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Banner */}
      <section className="card-hero">
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '16px', backdropFilter: 'blur(6px)' }}>
            <Sparkles size={15} color="var(--turquoise)" />
            <span>30 días para vivir nuestra cultura</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--white)', marginBottom: '12px', lineHeight: 1.15 }}>
            {isUserLoggedIn
              ? `Bienvenido(a), ${participant.nombre.split(' ')[0]}`
              : '¡Bienvenido(a) al Reto 5S!'}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5, marginBottom: '24px' }}>
            {isUserLoggedIn
              ? RETO_INFO.tagline
              : 'Una experiencia práctica para transformar las 5S en hábitos diarios que se ven, se sienten y se repiten. Para iniciar tu reto y registrar tus reflexiones, ingresa con tu nombre y sede.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {isUserLoggedIn ? (
              <>
                <button
                  className="btn btn-accent btn-lg"
                  onClick={() => goToBlock(currentBlock.id)}
                >
                  <span>Continuar en Bloque {currentBlock.id}: {currentBlock.sName} ({currentBlock.diasRango})</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn btn-outline"
                  style={{ color: 'var(--white)', borderColor: 'rgba(255, 255, 255, 0.35)' }}
                  onClick={() => setActiveTab('pasaporte')}
                >
                  <Award size={18} />
                  <span>Ver mi pasaporte</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-accent btn-lg"
                  onClick={() => setIsOnboardingOpen(true)}
                  style={{ gap: '8px' }}
                >
                  <UserCheck size={18} />
                  <span>Iniciar mi Reto 5S</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn btn-outline"
                  style={{ color: 'var(--white)', borderColor: 'rgba(255, 255, 255, 0.35)', gap: '8px' }}
                  onClick={() => setActiveTab('admin')}
                >
                  <ShieldCheck size={18} />
                  <span>Acceso Administrador</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Progress & Participant Status Card */}
      <section className="card" style={{ padding: '24px 28px' }}>
        {isUserLoggedIn ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-500)', fontWeight: 700 }}>
                  Tienda / Sede
                </span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--petrol)' }}>
                  {participant.tienda || 'Sin sede'}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>Día actual</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--petrol)' }}>
                    Día {currentDayNum} <span style={{ fontSize: '0.9rem', color: 'var(--gray-400)', fontWeight: 500 }}>/ 30</span>
                  </div>
                </div>

                <div style={{ width: '1px', height: '36px', background: 'var(--gray-200)' }}></div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>Días completados</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--turquoise-hover)' }}>
                    {completados.length} <span style={{ fontSize: '0.9rem', color: 'var(--gray-400)', fontWeight: 500 }}>({participant.porcentaje_avance || 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="progress-container">
              <div className="progress-header">
                <span style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>Progreso del reto de 30 días</span>
                <span style={{ color: 'var(--petrol)', fontWeight: 800 }}>{participant.porcentaje_avance || 0}%</span>
              </div>
              <div className="progress-track" style={{ height: '12px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${participant.porcentaje_avance || 0}%` }}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-500)', fontWeight: 700 }}>
                Estado del Colaborador
              </span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)', margin: '4px 0' }}>
                No has iniciado sesión
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                Identifícate con tu nombre y tienda para registrar tus reflexiones y ver tu progreso diario.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsOnboardingOpen(true)}
              style={{ gap: '6px' }}
            >
              <UserCheck size={16} />
              <span>Ingresar / Registrarme</span>
            </button>
          </div>
        )}
      </section>

      {/* "Tu reto de hoy" Highlight Card */}
      <section className="card" style={{ borderLeft: `6px solid ${todayData.sColor}`, background: 'var(--white)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'var(--petrol-soft)', color: todayData.sColor }}>
                Día {todayData.dia} · {todayData.sName}
              </span>
              {isTodayCompleted && (
                <span className="badge badge-green">
                  <Check size={12} /> Completado
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.45rem', color: 'var(--petrol-dark)' }}>
              {todayData.tema}
            </h2>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => isUserLoggedIn ? goToBlock(currentBlock.id) : setIsOnboardingOpen(true)}
          >
            <span>{isTodayCompleted ? 'Revisar mi bloque' : 'Ir al bloque de hoy'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          border: '1px solid var(--gray-200)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: 700 }}>
              Misión de hoy
            </span>
            <p style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: '1rem', marginTop: '2px' }}>
              "{todayData.mision}"
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: 700 }}>
              Evidencia esperada
            </span>
            <p style={{ color: 'var(--gray-700)', fontSize: '0.92rem', marginTop: '2px' }}>
              {todayData.evidencia}
            </p>
          </div>
        </div>
      </section>

      {/* The 5S Pillars Modules */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--petrol)' }}>Nuestras 5S en Acción</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Los 5 pilares culturales que viviremos durante los 30 días
            </p>
          </div>
        </div>

        <div className="grid-5s">
          {CINCO_S.map(s => {
            const Icon = getIconForS(s.icono);
            return (
              <div
                key={s.id}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderTop: `4px solid ${s.color}`,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (!isUserLoggedIn) {
                    setIsOnboardingOpen(true);
                    return;
                  }
                  if (s.id === 'SER') goToBlock(1);
                  else if (s.id === 'SERVIR') goToBlock(2);
                  else if (s.id === 'SABER') goToBlock(3);
                  else if (s.id === 'SONREIR') goToBlock(5);
                  else if (s.id === 'SORPRENDER') goToBlock(6);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: s.colorLight,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                    {s.dias}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: s.color, marginBottom: '2px' }}>
                    {s.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>
                    {s.tag}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.45, flex: 1 }}>
                  {s.proposito}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700, color: s.color, marginTop: 'auto' }}>
                  <span>Ir al bloque</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Regla de Oro Banner */}
      <section className="golden-rule-card">
        <div className="golden-rule-icon">
          <ShieldCheck size={24} />
        </div>
        <div className="golden-rule-text">
          <h4>Regla de Oro del Reto 5S</h4>
          <p>
            {RETO_INFO.reglaDeOro}
          </p>
        </div>
      </section>
    </div>
  );
}
