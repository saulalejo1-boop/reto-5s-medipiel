import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Compass, Flame } from 'lucide-react';

export function Dia15AvancesForm({ block }) {
  const { participant, updateField } = useReto();

  const termometros = [
    { id: 'dia15_ser', label: 'SER', color: '#01606D' },
    { id: 'dia15_servir', label: 'SERVIR', color: '#037C8D' },
    { id: 'dia15_saber', label: 'SABER', color: '#0F9D7A' },
    { id: 'dia15_sonreir', label: 'SONREÍR', color: '#E67E22' },
    { id: 'dia15_sorprender', label: 'SORPRENDER', color: '#8E44AD' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Introduction Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        border: '1px solid #FCD34D',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: '#78350F'
      }}>
        <h3 style={{ fontSize: '1.25rem', color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={22} color="#D97706" />
          <span>DÍA 15 · ENCUENTRO DE AVANCES</span>
        </h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
          {block.proposito}
        </p>
      </div>

      {/* Tabla de Misión Día 15 */}
      <MisionesTable misiones={block.misiones} sColor={block.color} />

      {/* 1. Historia en 1 minuto */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '8px' }}>
          1. Historia en 1 minuto
        </h3>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="d15-historia">
            ¿Qué hice? ¿Qué pasó? ¿Qué aprendí?
            <small>Resume una experiencia vivida durante estos primeros 15 días.</small>
          </label>
          <textarea
            id="d15-historia"
            className="form-textarea"
            rows={3}
            placeholder="Cuenta brevemente tu anécdota más significativa de la primera mitad del reto..."
            value={participant.dia15_historia || ''}
            onChange={(e) => updateField('dia15_historia', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Semáforo 5S */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '16px' }}>
          2. Semáforo 5S
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Rojo */}
          <div style={{
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <label className="form-label" htmlFor="d15-rojo" style={{ color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626' }}></span>
              <strong>ROJO · Algo que debo dejar de hacer</strong>
            </label>
            <input
              id="d15-rojo"
              type="text"
              className="form-input"
              placeholder="Un hábito o actitud que frena mi servicio o coherencia..."
              value={participant.dia15_rojo || ''}
              onChange={(e) => updateField('dia15_rojo', e.target.value)}
            />
          </div>

          {/* Amarillo */}
          <div style={{
            background: '#FFFBEB',
            border: '1.5px solid #FDE68A',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <label className="form-label" htmlFor="d15-amarillo" style={{ color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span>
              <strong>AMARILLO · Algo que necesito mejorar</strong>
            </label>
            <input
              id="d15-amarillo"
              type="text"
              className="form-input"
              placeholder="Un aspecto que realizo pero que puede ser más constante o cálido..."
              value={participant.dia15_amarillo || ''}
              onChange={(e) => updateField('dia15_amarillo', e.target.value)}
            />
          </div>

          {/* Verde */}
          <div style={{
            background: '#ECFDF5',
            border: '1.5px solid #6EE7B7',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <label className="form-label" htmlFor="d15-verde" style={{ color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span>
              <strong>VERDE · Algo que quiero mantener</strong>
            </label>
            <input
              id="d15-verde"
              type="text"
              className="form-input"
              placeholder="Una fortaleza o acción positiva que voy a seguir cuidando..."
              value={participant.dia15_verde || ''}
              onChange={(e) => updateField('dia15_verde', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 3. Termómetro Personal */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={20} color="#E67E22" />
          <span>3. Termómetro Personal (1 a 5)</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '20px' }}>
          Evalúa con honestidad tu nivel actual de vivencia en cada una de las 5S:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {termometros.map(t => {
            const val = participant[t.id] || 4;
            return (
              <div
                key={t.id}
                style={{
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: t.color, fontSize: '0.95rem' }}>{t.label}</strong>
                  <span className="badge" style={{ background: 'var(--white)', color: t.color, border: '1px solid var(--gray-200)' }}>
                    {val} / 5
                  </span>
                </div>
                <div className="rating-pills">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`rating-pill-btn ${val === num ? 'active' : ''}`}
                      onClick={() => updateField(t.id, num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="d15-fortalecer">
            La S que quiero fortalecer y qué haré diferente:
          </label>
          <input
            id="d15-fortalecer"
            type="text"
            className="form-input"
            placeholder="Ej. Quiero fortalecer SORPRENDER, proponiendo una mejora semanal en la exhibición..."
            value={participant.dia15_s_fortalecer || ''}
            onChange={(e) => updateField('dia15_s_fortalecer', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="d15-comportamiento" style={{ color: '#B45309' }}>
            PREGUNTA DE SALIDA: ¿Qué comportamiento quiero que los demás noten en mí durante los próximos 15 días?
          </label>
          <textarea
            id="d15-comportamiento"
            className="form-textarea"
            rows={2}
            placeholder="Un cambio visible en tu actitud, escucha o proactividad que todos en la tienda notarán..."
            value={participant.dia15_comportamiento || ''}
            onChange={(e) => updateField('dia15_comportamiento', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
