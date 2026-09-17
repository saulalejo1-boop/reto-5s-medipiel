import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Check } from 'lucide-react';

export function ServirForm({ block }) {
  const { participant, updateField } = useReto();

  const ayudaOptions = [
    "Enseñé algo",
    "Facilité una tarea",
    "Escuché y acompañé",
    "Me anticipé",
    "Ayudé a resolver"
  ];

  const currentAyudas = Array.isArray(participant.servir_tipos_ayuda)
    ? participant.servir_tipos_ayuda
    : [];

  const handleToggleAyuda = (opt) => {
    let updated;
    if (currentAyudas.includes(opt)) {
      updated = currentAyudas.filter(item => item !== opt);
    } else {
      updated = [...currentAyudas, opt];
    }
    updateField('servir_tipos_ayuda', updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ background: 'var(--white)' }}>
        {/* Propósito */}
        <div style={{
          background: 'var(--petrol-soft)',
          borderLeft: '4px solid var(--s-servir)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--s-servir)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>
            Propósito
          </strong>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
            {block.proposito}
          </p>
        </div>

        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '16px' }}>
          {block.subtitulo}
        </p>

        {/* Checkboxes de Tipos de Ayuda */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {ayudaOptions.map(opt => {
            const isChecked = currentAyudas.includes(opt);
            return (
              <div
                key={opt}
                className={`checkbox-card ${isChecked ? 'checked' : ''}`}
                onClick={() => handleToggleAyuda(opt)}
                style={{ padding: '10px 14px' }}
              >
                <div className="custom-checkbox">
                  {isChecked && <Check size={14} />}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                  {opt}
                </span>
              </div>
            );
          })}
        </div>

        {/* Campos de texto antes de la tabla */}
        <div className="form-group">
          <label className="form-label" htmlFor="servir-a-quien">
            ¿A quién apoyé y qué necesidad observé?
          </label>
          <input
            id="servir-a-quien"
            type="text"
            className="form-input"
            placeholder="Anota a quién decidiste apoyar..."
            value={participant.servir_a_quien || ''}
            onChange={(e) => updateField('servir_a_quien', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="servir-que-hice">
            ¿Qué hice?
          </label>
          <input
            id="servir-que-hice"
            type="text"
            className="form-input"
            placeholder="Describe brevemente tu acción de ayuda..."
            value={participant.servir_que_hice || ''}
            onChange={(e) => updateField('servir_que_hice', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" htmlFor="servir-cambio">
            ¿Qué cambió gracias a mi ayuda?
          </label>
          <input
            id="servir-cambio"
            type="text"
            className="form-input"
            placeholder="Describe el cambio o alivio generado..."
            value={participant.servir_cambio || ''}
            onChange={(e) => updateField('servir_cambio', e.target.value)}
          />
        </div>

        {/* Tabla de Misiones del Bloque (Días 6 al 10) */}
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
