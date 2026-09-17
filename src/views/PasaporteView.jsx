import React from 'react';
import { useReto } from '../context/RetoContext';
import { DIAS_DATA, getBlockForDay } from '../data/cartillaContent';
import { Award, Check, Calendar, ArrowRight, Heart, Sparkles } from 'lucide-react';

export function PasaporteView() {
  const { participant, toggleDayCompletion, goToBlock, updateField } = useReto();

  const completados = participant.dias_completados || [];

  const handleOpenDay = (dayNum) => {
    const blk = getBlockForDay(dayNum);
    if (blk) {
      goToBlock(blk.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card-hero" style={{ background: 'linear-gradient(135deg, #01606D 0%, #037C8D 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
          <Award size={15} color="var(--turquoise)" />
          <span>Pasaporte Cultural Medipiel</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--white)', marginBottom: '8px' }}>
          Pasaporte 5S · Mis 30 Días
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '640px', lineHeight: 1.5 }}>
          "Marca los días en que hiciste una acción consciente. La meta no es la perfección: es mantener el movimiento y aprender."
        </p>

        {/* Counter Pill */}
        <div style={{
          marginTop: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '10px 20px',
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Sellos acumulados:</span>
          <strong style={{ fontSize: '1.2rem', color: 'var(--turquoise-light)' }}>
            {completados.length} / 30 días ({participant.porcentaje_avance || 0}%)
          </strong>
        </div>
      </div>

      {/* Grid of 30 Stamps */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--petrol)' }}>
            Tablero de Sellos 5S
          </h2>

          {/* Color Legend */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#01606D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#01606D' }}></span> SER (1-5)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#037C8D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#037C8D' }}></span> SERVIR (6-10)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0F9D7A' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F9D7A' }}></span> SABER (11-14)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }}></span> D15
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E67E22' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E67E22' }}></span> SONREÍR (16-20)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8E44AD' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8E44AD' }}></span> SORPRENDER (21-25)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span> CIERRE (30)
            </span>
          </div>
        </div>

        {/* 30 Stamp Grid (5 columns on desktop, 3 on tablet, 2 on mobile) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '14px'
        }}>
          {DIAS_DATA.map(d => {
            const isCompleted = completados.includes(d.dia);
            const isCurrent = d.dia === participant.dia_actual;

            return (
              <div
                key={d.dia}
                style={{
                  border: isCompleted
                    ? `2px solid ${d.sColor}`
                    : isCurrent
                    ? '2px dashed var(--petrol)'
                    : '1.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 12px',
                  background: isCompleted ? 'var(--petrol-soft)' : 'var(--white)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'var(--transition-fast)',
                  boxShadow: isCompleted ? '0 4px 12px rgba(1, 96, 109, 0.08)' : 'none'
                }}
              >
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: d.sColor,
                    textTransform: 'uppercase'
                  }}>
                    {d.dia === 15 ? 'DÍA 15' : d.dia === 30 ? 'DÍA 30' : `DÍA ${d.dia}`}
                  </span>

                  {/* Stamp Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDayCompletion(d.dia);
                    }}
                    title={isCompleted ? 'Desmarcar día' : 'Marcar como completado'}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: isCompleted ? `2px solid ${d.sColor}` : '2px solid var(--gray-300)',
                      backgroundColor: isCompleted ? d.sColor : '#fff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {isCompleted && <Check size={14} strokeWidth={3} />}
                  </button>
                </div>

                {/* S Pill & Mission Title */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                    {d.sName}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--gray-800)',
                    lineHeight: 1.25,
                    marginTop: '2px',
                    minHeight: '34px'
                  }}>
                    {d.mision}
                  </div>
                </div>

                {/* Go to Day Link */}
                <button
                  type="button"
                  onClick={() => handleOpenDay(d.dia)}
                  style={{
                    marginTop: 'auto',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: d.sColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0'
                  }}
                >
                  <span>{isCompleted ? 'Ver registro' : 'Realizar'}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Reflection Box (From Cartilla PDF) */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={20} color="#E11D48" />
          <span>Reflexión Final del Pasaporte</span>
        </h3>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="pasaporte-fav">
            Mi momento favorito del reto y la S que más fortalecí:
            <small>Anota el momento que más recuerdas y la S que ahora forma parte de tu día a día.</small>
          </label>
          <textarea
            id="pasaporte-fav"
            className="form-textarea"
            rows={3}
            placeholder="Ej. Mi momento favorito fue el día que enseñé en 5 minutos a mi compañera... La S que más fortalecí fue SONREÍR..."
            value={participant.pasaporte_momento_favorito || ''}
            onChange={(e) => updateField('pasaporte_momento_favorito', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
