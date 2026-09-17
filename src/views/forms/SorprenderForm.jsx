import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export function SorprenderForm({ block }) {
  const { participant, updateField } = useReto();

  const resultados = [
    "Funcionó",
    "Funcionó parcialmente",
    "No funcionó, pero dejó aprendizaje"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ background: 'var(--white)' }}>
        {/* Propósito */}
        <div style={{
          background: 'var(--petrol-soft)',
          borderLeft: '4px solid var(--s-sorprender)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--s-sorprender)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.6px', display: 'block', marginBottom: '4px' }}>
            Propósito
          </strong>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
            {block.proposito}
          </p>
        </div>

        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '16px' }}>
          {block.subtitulo}
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="sorprender-cotidiano">
            Algo cotidiano que podemos mejorar
          </label>
          <input
            id="sorprender-cotidiano"
            type="text"
            className="form-input"
            placeholder="Ej. El empaque de muestras o la bienvenida al cliente..."
            value={participant.sorprender_oportunidad || ''}
            onChange={(e) => updateField('sorprender_oportunidad', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sorprender-idea">
            Mi idea del 1% extra
          </label>
          <input
            id="sorprender-idea"
            type="text"
            className="form-input"
            placeholder="Ej. Entregar una nota manuscrita con un tip de skincare..."
            value={participant.sorprender_idea || ''}
            onChange={(e) => updateField('sorprender_idea', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sorprender-prueba">
            ¿Cómo la puse a prueba y qué pasó?
          </label>
          <textarea
            id="sorprender-prueba"
            className="form-textarea"
            rows={2}
            placeholder="Describe la prueba en tienda y la respuesta..."
            value={participant.sorprender_prueba || ''}
            onChange={(e) => updateField('sorprender_prueba', e.target.value)}
          />
        </div>

        {/* Resultado del experimento */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">
            Resultado de la prueba:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {resultados.map(res => {
              const isSelected = participant.sorprender_resultado === res;
              return (
                <div
                  key={res}
                  className={`checkbox-card ${isSelected ? 'checked' : ''}`}
                  onClick={() => updateField('sorprender_resultado', res)}
                  style={{
                    borderColor: isSelected ? 'var(--s-sorprender)' : 'var(--gray-200)',
                    background: isSelected ? 'var(--petrol-soft)' : 'var(--white)',
                    padding: '10px 14px'
                  }}
                >
                  <div
                    className="custom-checkbox"
                    style={{
                      borderRadius: '50%',
                      borderColor: isSelected ? 'var(--s-sorprender)' : 'var(--gray-300)',
                      backgroundColor: isSelected ? 'var(--s-sorprender)' : 'transparent'
                    }}
                  >
                    {isSelected && <CheckCircle2 size={13} color="#fff" />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                    {res}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabla de Misiones del Bloque (Días 21 al 25) */}
        <MisionesTable misiones={block.misiones} sColor={block.color} />
      </div>

      {/* Banco de Ideas */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)', border: '1px solid #E9D5FF' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#6B21A8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={20} color="#8E44AD" />
          <span>Banco de Ideas · ¿Y si...?</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#7E22CE', marginBottom: '14px' }}>
          Una gran mejora puede empezar con una pregunta pequeña. Escribe una idea que empiece con <strong>"¿Y si nosotros...?"</strong>:
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="sorprender-y-si" style={{ color: '#581C87' }}>
            ¿Y si nosotros...?
          </label>
          <textarea
            id="sorprender-y-si"
            className="form-textarea"
            rows={2}
            style={{ borderColor: '#D8B4FE', background: 'var(--white)' }}
            placeholder="¿Y si nosotros creamos un espacio de recomendación rápida para piel sensible...?"
            value={participant.sorprender_y_si || ''}
            onChange={(e) => updateField('sorprender_y_si', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
