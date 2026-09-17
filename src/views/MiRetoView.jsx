import React, { useRef, useEffect } from 'react';
import { useReto } from '../context/RetoContext';
import { BLOQUES_DATA, ETAPAS } from '../data/cartillaContent';
import { SerForm } from './forms/SerForm';
import { ServirForm } from './forms/ServirForm';
import { SaberForm } from './forms/SaberForm';
import { Dia15AvancesForm } from './forms/Dia15AvancesForm';
import { SonreirForm } from './forms/SonreirForm';
import { SorprenderForm } from './forms/SorprenderForm';
import { RetoCompletoForm } from './forms/RetoCompletoForm';
import { Dia30CierreForm } from './forms/Dia30CierreForm';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  Layers,
  Sparkles,
  UserCheck
} from 'lucide-react';

export function MiRetoView() {
  const {
    currentBlockId,
    setCurrentBlockId,
    participant,
    isUserLoggedIn,
    setIsOnboardingOpen,
    toggleBlockCompletion
  } = useReto();

  const blockPillsRef = useRef(null);

  const activeBlock = BLOQUES_DATA.find(b => b.id === currentBlockId) || BLOQUES_DATA[0];
  const completados = participant.dias_completados || [];

  // Días completados en este bloque
  const diasEnBloque = activeBlock.dias || [];
  const diasCompletadosEnBloque = diasEnBloque.filter(d => completados.includes(d));
  const isBlockFullyCompleted = diasEnBloque.length > 0 && diasEnBloque.every(d => completados.includes(d));
  const blockPercent = Math.round((diasCompletadosEnBloque.length / diasEnBloque.length) * 100);

  const etapaActual = activeBlock.etapa === 1 ? ETAPAS[0] : ETAPAS[1];

  // Auto-scroll del carrusel de bloques
  useEffect(() => {
    if (blockPillsRef.current) {
      const activeBtn = blockPillsRef.current.querySelector('.block-pill.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentBlockId]);

  const handlePrevBlock = () => {
    if (currentBlockId > 1) {
      setCurrentBlockId(currentBlockId - 1);
    }
  };

  const handleNextBlock = () => {
    if (currentBlockId < BLOQUES_DATA.length) {
      setCurrentBlockId(currentBlockId + 1);
    }
  };

  const renderActiveBlockForm = () => {
    switch (activeBlock.tipoForm) {
      case 'ser':
        return <SerForm block={activeBlock} />;
      case 'servir':
        return <ServirForm block={activeBlock} />;
      case 'saber':
        return <SaberForm block={activeBlock} />;
      case 'dia15':
        return <Dia15AvancesForm block={activeBlock} />;
      case 'sonreir':
        return <SonreirForm block={activeBlock} />;
      case 'sorprender':
        return <SorprenderForm block={activeBlock} />;
      case 'reto_integrado':
        return <RetoCompletoForm block={activeBlock} />;
      case 'cierre':
        return <Dia30CierreForm block={activeBlock} />;
      default:
        return <SerForm block={activeBlock} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Etapa Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${etapaActual.color} 0%, #00454F 100%)`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: 'var(--white)',
        boxShadow: '0 8px 24px rgba(1, 96, 109, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
              {etapaActual.nombre} · {etapaActual.diasRango}
            </span>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--white)', marginTop: '2px' }}>
              {etapaActual.pilares}
            </h2>
          </div>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
            Etapa {etapaActual.numero} de 2
          </span>
        </div>
      </div>

      {/* Selector de los 8 Bloques de la Cartilla */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-600)' }}>
            Bloques de trabajo de la Cartilla 5S:
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--petrol)', fontWeight: 700 }}>
            Bloque {activeBlock.id} de 8
          </span>
        </div>

        <div
          ref={blockPillsRef}
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}
        >
          {BLOQUES_DATA.map(b => {
            const isDone = b.dias.every(d => completados.includes(d));
            const isActive = b.id === currentBlockId;
            const completedCount = b.dias.filter(d => completados.includes(d)).length;

            return (
              <button
                key={b.id}
                type="button"
                className={`block-pill ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentBlockId(b.id)}
                style={{
                  flexShrink: 0,
                  minWidth: '130px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? `2.5px solid ${b.color}` : '1.5px solid var(--gray-200)',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--petrol) 0%, var(--petrol-light) 100%)'
                    : isDone
                    ? 'var(--turquoise-soft)'
                    : 'var(--white)',
                  color: isActive ? 'var(--white)' : isDone ? 'var(--petrol)' : 'var(--gray-700)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  boxShadow: isActive ? '0 4px 14px rgba(1, 96, 109, 0.25)' : 'none',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--turquoise-light)' : b.color
                  }}>
                    {b.diasRango}
                  </span>
                  {isDone ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: isActive ? 'rgba(255, 255, 255, 0.3)' : 'var(--petrol)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem'
                    }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      {completedCount}/{b.dias.length}
                    </span>
                  )}
                </div>

                <strong style={{ fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
                  {b.sName}
                </strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabecera del Bloque Activo */}
      <div className="card" style={{ borderLeft: `6px solid ${activeBlock.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: activeBlock.colorLight, color: activeBlock.color, fontWeight: 800 }}>
                {activeBlock.sName} · {activeBlock.diasRango}
              </span>
              {isBlockFullyCompleted ? (
                <span className="badge badge-green">
                  <CheckCircle2 size={13} /> Bloque Completado
                </span>
              ) : (
                <span className="badge badge-gold">
                  {diasCompletadosEnBloque.length} de {diasEnBloque.length} días completados ({blockPercent}%)
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--petrol-dark)' }}>
              {activeBlock.titulo}
            </h2>
          </div>

          {/* Botón para marcar todo el bloque */}
          <button
            type="button"
            className={`btn ${isBlockFullyCompleted ? 'btn-success' : 'btn-primary'}`}
            onClick={() => isUserLoggedIn ? toggleBlockCompletion(activeBlock.id) : setIsOnboardingOpen(true)}
            style={{ gap: '8px' }}
          >
            <CheckCircle2 size={18} />
            <span>{isBlockFullyCompleted ? '✓ Bloque Completado' : 'Marcar bloque como completado'}</span>
          </button>
        </div>

        {/* Barra de Progreso del Bloque */}
        <div style={{ marginTop: '16px' }}>
          <div className="progress-track" style={{ height: '8px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${blockPercent}%`,
                background: activeBlock.color
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Formulario del Bloque Activo (con su tabla de misiones en el medio) */}
      {!isUserLoggedIn ? (
        <div className="card" style={{ padding: '44px 28px', textAlign: 'center', background: 'var(--white)', border: '1.5px solid var(--turquoise-light)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--petrol-soft)',
            color: 'var(--petrol)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <UserCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--petrol)', marginBottom: '8px' }}>
            Inicia sesión para diligenciar el Reto 5S
          </h3>
          <p style={{ color: 'var(--gray-600)', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.5, fontSize: '0.94rem' }}>
            Para registrar tus reflexiones, completar misiones y guardar tu avance asociado a tu nombre y sede, por favor identifícate.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => setIsOnboardingOpen(true)}
            style={{ margin: '0 auto', gap: '8px' }}
          >
            <UserCheck size={18} />
            <span>Ingresar con mi nombre y sede</span>
          </button>
        </div>
      ) : (
        renderActiveBlockForm()
      )}

      {/* Barra de Navegación de Bloques */}
      <div className="card reto-nav-card">
        <button
          type="button"
          className="btn btn-outline reto-btn-prev"
          onClick={handlePrevBlock}
          disabled={currentBlockId <= 1}
          style={{ opacity: currentBlockId <= 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={18} />
          <span>Bloque anterior</span>
        </button>

        <button
          type="button"
          className={`btn reto-btn-complete ${isBlockFullyCompleted ? 'btn-success' : 'btn-secondary'}`}
          onClick={() => isUserLoggedIn ? toggleBlockCompletion(activeBlock.id) : setIsOnboardingOpen(true)}
        >
          <Check size={16} />
          <span>{isBlockFullyCompleted ? 'Bloque Listo ✓' : 'Marcar Bloque Listo'}</span>
        </button>

        <button
          type="button"
          className="btn btn-primary reto-btn-next"
          onClick={handleNextBlock}
          disabled={currentBlockId >= BLOQUES_DATA.length}
          style={{ opacity: currentBlockId >= BLOQUES_DATA.length ? 0.4 : 1 }}
        >
          <span>Siguiente bloque</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
