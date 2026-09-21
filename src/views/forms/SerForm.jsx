import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { UserCheck, Heart } from 'lucide-react';

export function SerForm({ block }) {
  const { participant, updateField } = useReto();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Propósito y Subtítulo de la Cartilla */}
      <div className="card" style={{ background: 'var(--white)' }}>
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

        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '16px' }}>
          {block.subtitulo}
        </p>

        {/* Mi intención para estos 30 días */}
        <div style={{
          marginBottom: '22px',
          padding: '16px',
          background: 'var(--petrol-soft)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--turquoise-light)'
        }}>
          <label className="form-label" htmlFor="ser-intencion" style={{ color: 'var(--petrol-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={16} color="var(--petrol)" />
            <span>Mi intención para estos 30 días:</span>
            <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <small style={{ color: 'var(--gray-600)', display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>
            ¿Qué propósito personal y de servicio te motiva en este reto? (Obligatorio para avanzar)
          </small>
          <textarea
            id="ser-intencion"
            className="form-textarea"
            rows={2}
            placeholder="Ej. Conectar genuinamente con mis compañeros, escuchar con empatía a cada cliente y aportar el 1% extra cada día."
            value={participant.intencion_30_dias || ''}
            onChange={(e) => updateField('intencion_30_dias', e.target.value)}
            required
          />
        </div>

        {/* Las 3 Características */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" htmlFor="ser-c1">
              Quiero que me reconozcan como...
            </label>
            <input
              id="ser-c1"
              type="text"
              className="form-input"
              placeholder="Escribe aquí tu primera cualidad..."
              value={participant.ser_caracteristica_1 || ''}
              onChange={(e) => updateField('ser_caracteristica_1', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="ser-c2">
              Segunda característica:
            </label>
            <input
              id="ser-c2"
              type="text"
              className="form-input"
              placeholder="Escribe aquí tu segunda cualidad..."
              value={participant.ser_caracteristica_2 || ''}
              onChange={(e) => updateField('ser_caracteristica_2', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="ser-c3">
              Tercera característica:
            </label>
            <input
              id="ser-c3"
              type="text"
              className="form-input"
              placeholder="Escribe aquí tu tercera cualidad..."
              value={participant.ser_caracteristica_3 || ''}
              onChange={(e) => updateField('ser_caracteristica_3', e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de Misiones del Bloque (Días 1 al 5) */}
        <MisionesTable misiones={block.misiones} sColor={block.color} />

        {/* Campos de Reflexión Posterior */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label" htmlFor="ser-accion">
            La acción concreta que voy a demostrar
          </label>
          <textarea
            id="ser-accion"
            className="form-textarea"
            rows={2}
            placeholder="Describe la acción diaria visible que vas a poner en práctica..."
            value={participant.ser_accion || ''}
            onChange={(e) => updateField('ser_accion', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="ser-descubrimiento">
            ¿Qué descubrí de mí?
          </label>
          <textarea
            id="ser-descubrimiento"
            className="form-textarea"
            rows={3}
            placeholder="Anota tus reflexiones, descubrimientos o retroalimentación recibida..."
            value={participant.ser_descubrimiento || ''}
            onChange={(e) => updateField('ser_descubrimiento', e.target.value)}
          />
        </div>
      </div>

      {/* Frase ME LLEVO ESTO */}
      {block.fraseMeLlevo && (
        <div className="quote-banner">
          <strong>ME LLEVO ESTO</strong>
          "{block.fraseMeLlevo}"
        </div>
      )}
    </div>
  );
}
