import React, { useRef, useEffect, useState } from 'react';
import { useReto } from '../context/RetoContext';
import { BLOQUES_DATA, ETAPAS } from '../data/cartillaContent';
import { validateBlockRequirements, isBlockUnlocked } from '../utils/blockValidation';
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
  UserCheck,
  Lock,
  AlertCircle,
  X
} from 'lucide-react';

export function MiRetoView() {
  const {
    currentBlockId,
    setCurrentBlockId,
    setCurrentDay,
    participant,
    isUserLoggedIn,
    setIsOnboardingOpen,
    toggleBlockCompletion,
    showToast
  } = useReto();

  const blockPillsRef = useRef(null);
  const [validationAlert, setValidationAlert] = useState(null);

  const activeBlock = BLOQUES_DATA.find(b => b.id === currentBlockId) || BLOQUES_DATA[0];
  const completados = participant.dias_completados || [];

  // Validación estricta del bloque activo (preguntas y días marcados)
  const activeValidation = validateBlockRequirements(activeBlock.id, participant);
  const isBlockFullyCompleted = activeValidation.isComplete;

  // Días completados en este bloque
  const diasEnBloque = activeBlock.dias || [];
  const diasCompletadosEnBloque = diasEnBloque.filter(d => completados.includes(d));
  const blockPercent = Math.round((diasCompletadosEnBloque.length / diasEnBloque.length) * 100);

  const etapaActual = activeBlock.etapa === 1 ? ETAPAS[0] : ETAPAS[1];

  // Auto-scroll del carrusel de bloques y limpiar alertas al cambiar de bloque
  useEffect(() => {
    setValidationAlert(null);
    if (blockPillsRef.current) {
      const activeBtn = blockPillsRef.current.querySelector('.block-pill.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentBlockId]);

  const handlePrevBlock = () => {
    if (currentBlockId > 1) {
      setValidationAlert(null);
      setCurrentBlockId(currentBlockId - 1);
      const prevBlock = BLOQUES_DATA.find(b => b.id === currentBlockId - 1);
      if (prevBlock && prevBlock.dias.length > 0) {
        setCurrentDay(prevBlock.dias[0]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextBlock = () => {
    // Validar rigurosamente que el bloque actual esté 100% respondido y marcado
    const validation = validateBlockRequirements(currentBlockId, participant);
    if (!validation.isComplete) {
      setValidationAlert({
        blockId: currentBlockId,
        blockName: activeBlock.sName,
        missingDays: validation.missingDays,
        missingFields: validation.missingFields
      });
      showToast(
        `Para avanzar al siguiente bloque, debes completar todas las respuestas y marcar los días del bloque ${activeBlock.sName}.`,
        'warning'
      );
      setTimeout(() => {
        const el = document.getElementById('block-validation-alert');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setValidationAlert(null);
    if (currentBlockId < BLOQUES_DATA.length) {
      const nextId = currentBlockId + 1;
      setCurrentBlockId(nextId);
      const nextBlock = BLOQUES_DATA.find(b => b.id === nextId);
      if (nextBlock && nextBlock.dias.length > 0) {
        setCurrentDay(nextBlock.dias[0]);
      }
      showToast(`¡Excelente! Avanzaste al bloque ${nextBlock?.sName || nextId}.`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectBlock = (targetId) => {
    // Permitir navegar a bloques previos o al actual
    if (targetId <= currentBlockId) {
      setValidationAlert(null);
      setCurrentBlockId(targetId);
      const b = BLOQUES_DATA.find(item => item.id === targetId);
      if (b && b.dias.length > 0) setCurrentDay(b.dias[0]);
      return;
    }

    // Si intenta saltar a un bloque posterior, verificar que todos los bloques anteriores estén completos
    for (let i = 1; i < targetId; i++) {
      const v = validateBlockRequirements(i, participant);
      if (!v.isComplete) {
        const blocked = BLOQUES_DATA.find(item => item.id === i);
        setValidationAlert({
          blockId: i,
          blockName: blocked?.sName,
          missingDays: v.missingDays,
          missingFields: v.missingFields
        });
        showToast(
          `Bloque bloqueado. Debes completar primero el bloque ${blocked?.sName || i} para continuar.`,
          'warning'
        );
        setCurrentBlockId(i);
        setTimeout(() => {
          const el = document.getElementById('block-validation-alert');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
    }

    setValidationAlert(null);
    setCurrentBlockId(targetId);
    const b = BLOQUES_DATA.find(item => item.id === targetId);
    if (b && b.dias.length > 0) setCurrentDay(b.dias[0]);
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
            const bValidation = validateBlockRequirements(b.id, participant);
            const isDone = bValidation.isComplete;
            const isActive = b.id === currentBlockId;
            const completedCount = b.dias.filter(d => completados.includes(d)).length;
            const isUnlocked = isBlockUnlocked(b.id, participant) || b.id <= currentBlockId;

            return (
              <button
                key={b.id}
                type="button"
                className={`block-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectBlock(b.id)}
                title={!isUnlocked ? `Bloque bloqueado. Completa los bloques anteriores para desbloquearlo.` : `Ir a ${b.sName}`}
                style={{
                  flexShrink: 0,
                  minWidth: '130px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? `2.5px solid ${b.color}` : isUnlocked ? '1.5px solid var(--gray-200)' : '1.5px dashed var(--gray-300)',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--petrol) 0%, var(--petrol-light) 100%)'
                    : isDone
                    ? 'var(--turquoise-soft)'
                    : isUnlocked
                    ? 'var(--white)'
                    : 'var(--gray-50)',
                  color: isActive ? 'var(--white)' : isDone ? 'var(--petrol)' : isUnlocked ? 'var(--gray-700)' : 'var(--gray-400)',
                  opacity: !isUnlocked ? 0.75 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
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
                    color: isActive ? 'var(--turquoise-light)' : isUnlocked ? b.color : 'var(--gray-400)'
                  }}>
                    {b.diasRango}
                  </span>
                  {!isUnlocked ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      color: 'var(--gray-400)',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      <Lock size={12} />
                    </div>
                  ) : isDone ? (
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
                  <CheckCircle2 size={13} /> Bloque Completado al 100%
                </span>
              ) : (
                <span className="badge badge-gold">
                  {diasCompletadosEnBloque.length} de {diasEnBloque.length} días marcados ({blockPercent}%)
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--petrol-dark)' }}>
              {activeBlock.titulo}
            </h2>
          </div>

          {/* Botón para marcar los días del bloque */}
          <button
            type="button"
            className={`btn ${diasCompletadosEnBloque.length === diasEnBloque.length ? 'btn-success' : 'btn-primary'}`}
            onClick={() => isUserLoggedIn ? toggleBlockCompletion(activeBlock.id) : setIsOnboardingOpen(true)}
            style={{ gap: '8px' }}
          >
            <CheckCircle2 size={18} />
            <span>
              {diasCompletadosEnBloque.length === diasEnBloque.length ? '✓ Días del bloque marcados' : 'Marcar días como completados'}
            </span>
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

      {/* Alerta Destacada de Requisitos Faltantes */}
      {validationAlert && (
        <div
          id="block-validation-alert"
          className="card"
          style={{
            background: '#FEF2F2',
            border: '2px solid #EF4444',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#DC2626',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#991B1B', margin: '0 0 6px 0', fontWeight: 800 }}>
                  Requisitos pendientes para avanzar desde el bloque {validationAlert.blockName}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#7F1D1D', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                  Para continuar al siguiente bloque, debes completar todas las respuestas y marcar los días requeridos en este bloque:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                  {validationAlert.missingDays && validationAlert.missingDays.length > 0 && (
                    <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                      <strong>📅 Días pendientes por marcar en la tabla:</strong>{' '}
                      {validationAlert.missingDays.map(d => `Día ${d}`).join(', ')}
                    </div>
                  )}

                  {validationAlert.missingFields && validationAlert.missingFields.length > 0 && (
                    <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                      <strong>✍️ Preguntas o reflexiones pendientes por responder:</strong>
                      <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                        {validationAlert.missingFields.map((field, idx) => (
                          <li key={idx} style={{ marginBottom: '3px' }}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setValidationAlert(null)}
              style={{ background: 'transparent', border: 'none', color: '#991B1B', cursor: 'pointer', padding: '4px' }}
              title="Cerrar advertencia"
            >
              <X size={20} />
            </button>
          </div>
        </div>
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
          <span>{isBlockFullyCompleted ? 'Bloque 100% Listo ✓' : 'Marcar Días del Bloque'}</span>
        </button>

        <button
          type="button"
          className="btn btn-primary reto-btn-next"
          onClick={handleNextBlock}
          disabled={currentBlockId >= BLOQUES_DATA.length}
          style={{
            opacity: currentBlockId >= BLOQUES_DATA.length ? 0.4 : 1,
            cursor: currentBlockId >= BLOQUES_DATA.length ? 'default' : 'pointer'
          }}
        >
          <span>{currentBlockId >= BLOQUES_DATA.length ? 'Último Bloque (Día 30)' : 'Siguiente bloque'}</span>
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}
