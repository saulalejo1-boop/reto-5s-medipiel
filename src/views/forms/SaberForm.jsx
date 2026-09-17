import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';

export function SaberForm({ block }) {
  const { participant, updateField } = useReto();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ background: 'var(--white)' }}>
        {/* Propósito */}
        <div style={{
          background: 'var(--petrol-soft)',
          borderLeft: '4px solid var(--s-saber)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--s-saber)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>
            Propósito
          </strong>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
            {block.proposito}
          </p>
        </div>

        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '16px' }}>
          {block.subtitulo}
        </p>

        {/* Campos antes de la tabla */}
        <div className="form-group">
          <label className="form-label" htmlFor="saber-ensene">
            Lo que enseñé y a quién se lo compartí
          </label>
          <input
            id="saber-ensene"
            type="text"
            className="form-input"
            placeholder="Anota qué práctica o conocimiento útil compartiste..."
            value={participant.saber_que_ensene || ''}
            onChange={(e) => updateField('saber_que_ensene', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="saber-aprendi">
            Lo que aprendí de otra persona
          </label>
          <input
            id="saber-aprendi"
            type="text"
            className="form-input"
            placeholder="Anota la idea o aprendizaje nuevo que recibiste..."
            value={participant.saber_que_aprendi || ''}
            onChange={(e) => updateField('saber_que_aprendi', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" htmlFor="saber-aplicar">
            ¿Dónde lo voy a aplicar?
          </label>
          <input
            id="saber-aplicar"
            type="text"
            className="form-input"
            placeholder="En qué situación real de tienda o trabajo lo usarás..."
            value={participant.saber_donde_aplicar || ''}
            onChange={(e) => updateField('saber_donde_aplicar', e.target.value)}
          />
        </div>

        {/* Tabla de Misiones del Bloque (Días 11 al 14) */}
        <MisionesTable misiones={block.misiones} sColor={block.color} />
      </div>

      {/* Quote Banner */}
      {block.fraseMeLlevo && (
        <div className="quote-banner">
          <strong>ME LLEVO ESTO</strong>
          "{block.fraseMeLlevo}"
        </div>
      )}
    </div>
  );
}
