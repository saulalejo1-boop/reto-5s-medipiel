import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Check } from 'lucide-react';

export function SonreirForm({ block }) {
  const { participant, updateField } = useReto();

  const checkboxes = [
    { key: 'sonreir_reconocimiento', label: 'Reconocí algo positivo' },
    { key: 'sonreir_queja', label: 'Transformé una queja en propuesta' },
    { key: 'sonreir_ambiente', label: 'Hice algo para mejorar el ambiente' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ background: 'var(--white)' }}>
        {/* Propósito */}
        <div style={{
          background: 'var(--petrol-soft)',
          borderLeft: '4px solid var(--s-sonreir)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--s-sonreir)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>
            Propósito
          </strong>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
            {block.proposito}
          </p>
        </div>

        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '16px' }}>
          {block.subtitulo}
        </p>

        {/* Checkboxes de Acciones de Buena Energía */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {checkboxes.map(item => {
            const isChecked = Boolean(participant[item.key]);
            return (
              <div
                key={item.key}
                className={`checkbox-card ${isChecked ? 'checked' : ''}`}
                onClick={() => updateField(item.key, !isChecked)}
                style={{ padding: '10px 14px' }}
              >
                <div className="custom-checkbox">
                  {isChecked && <Check size={14} />}
                </div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Campos de texto */}
        <div className="form-group">
          <label className="form-label" htmlFor="sonreir-situacion">
            La situación que decidí transformar
          </label>
          <input
            id="sonreir-situacion"
            type="text"
            className="form-input"
            placeholder="Ej. Un momento de tensión por un pedido demorado..."
            value={participant.sonreir_situacion || ''}
            onChange={(e) => updateField('sonreir_situacion', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sonreir-reaccion">
            ¿Cómo habría reaccionado antes y cómo respondí esta vez?
          </label>
          <textarea
            id="sonreir-reaccion"
            className="form-textarea"
            rows={2}
            placeholder="Describe tu cambio de actitud y lenguaje..."
            value={participant.sonreir_reaccion || ''}
            onChange={(e) => updateField('sonreir_reaccion', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" htmlFor="sonreir-efecto">
            ¿Qué efecto tuvo?
          </label>
          <textarea
            id="sonreir-efecto"
            className="form-textarea"
            rows={2}
            placeholder="¿Cómo reaccionó la otra persona o el equipo?"
            value={participant.sonreir_efecto || ''}
            onChange={(e) => updateField('sonreir_efecto', e.target.value)}
          />
        </div>

        {/* Tabla de Misiones del Bloque (Días 16 al 20) */}
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
