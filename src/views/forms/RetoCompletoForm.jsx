import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Layers, Check, AlertCircle } from 'lucide-react';

export function RetoCompletoForm({ block }) {
  const { participant, updateField } = useReto();

  const cincoSList = [
    { id: 'SER', label: 'SER', color: '#01606D' },
    { id: 'SERVIR', label: 'SERVIR', color: '#037C8D' },
    { id: 'SABER', label: 'SABER', color: '#0F9D7A' },
    { id: 'SONREIR', label: 'SONREÍR', color: '#E67E22' },
    { id: 'SORPRENDER', label: 'SORPRENDER', color: '#8E44AD' }
  ];

  const currentSelected = Array.isArray(participant.reto_integrado_s)
    ? participant.reto_integrado_s
    : [];

  const handleToggleS = (sId) => {
    let updated;
    if (currentSelected.includes(sId)) {
      updated = currentSelected.filter(item => item !== sId);
    } else {
      updated = [...currentSelected, sId];
    }
    updateField('reto_integrado_s', updated);
  };

  const hasMinimumThree = currentSelected.length >= 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ background: 'var(--white)' }}>
        {/* Propósito */}
        <div style={{
          background: 'var(--petrol-soft)',
          borderLeft: '4px solid var(--s-ser)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--s-ser)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>
            Propósito
          </strong>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
            {block.proposito}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            {block.subtitulo}
          </span>
          <span className={`badge ${hasMinimumThree ? 'badge-green' : 'badge-gold'}`}>
            {currentSelected.length} de 3 mín. seleccionadas
          </span>
        </div>

        {/* Checkboxes de 5S */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {cincoSList.map(item => {
            const isChecked = currentSelected.includes(item.id);
            return (
              <div
                key={item.id}
                className={`checkbox-card ${isChecked ? 'checked' : ''}`}
                onClick={() => handleToggleS(item.id)}
                style={{
                  borderColor: isChecked ? item.color : 'var(--gray-200)',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                <div
                  className="custom-checkbox"
                  style={{
                    borderColor: isChecked ? item.color : 'var(--gray-300)',
                    backgroundColor: isChecked ? item.color : 'transparent',
                    color: '#fff'
                  }}
                >
                  {isChecked && <Check size={14} />}
                </div>
                <strong style={{ color: isChecked ? item.color : 'var(--gray-700)', fontSize: '0.95rem' }}>
                  {item.label}
                </strong>
              </div>
            );
          })}
        </div>

        {!hasMinimumThree && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            color: '#B45309',
            background: 'var(--warning-light)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>Por favor selecciona al menos 3 S para integrar en este reto.</span>
          </div>
        )}

        {/* Campos de la Acción */}
        <div className="form-group">
          <label className="form-label" htmlFor="reto-accion">
            Mi acción integrada será
          </label>
          <textarea
            id="reto-accion"
            className="form-textarea"
            rows={2}
            placeholder="Describe cómo se unen las 3 o más S elegidas en una acción concreta..."
            value={participant.reto_integrado_accion || ''}
            onChange={(e) => updateField('reto_integrado_accion', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reto-beneficiario">
            ¿A quién o qué beneficiará?
          </label>
          <input
            id="reto-beneficiario"
            type="text"
            className="form-input"
            placeholder="Anota el impacto positivo generado..."
            value={participant.reto_integrado_beneficiario || ''}
            onChange={(e) => updateField('reto_integrado_beneficiario', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" htmlFor="reto-resultado">
            ¿Qué ocurrió y qué enseñanza quiero conservar?
          </label>
          <textarea
            id="reto-resultado"
            className="form-textarea"
            rows={2}
            placeholder="El resultado vivido y el aprendizaje que mantendrás..."
            value={participant.reto_integrado_resultado || ''}
            onChange={(e) => updateField('reto_integrado_resultado', e.target.value)}
          />
        </div>

        {/* Tabla de Misiones del Bloque (Días 26 al 29) */}
        <MisionesTable misiones={block.misiones} sColor={block.color} />
      </div>
    </div>
  );
}
