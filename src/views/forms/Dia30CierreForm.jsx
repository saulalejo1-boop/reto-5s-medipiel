import React from 'react';
import { useReto } from '../../context/RetoContext';
import { MisionesTable } from '../../components/MisionesTable';
import { Award, Heart, Sparkles, Check, BookmarkCheck } from 'lucide-react';

export function Dia30CierreForm({ block }) {
  const { participant, updateField, setIsCelebrationOpen } = useReto();

  const cincoSList = [
    { id: 'SER', label: 'SER', color: '#01606D' },
    { id: 'SERVIR', label: 'SERVIR', color: '#037C8D' },
    { id: 'SABER', label: 'SABER', color: '#0F9D7A' },
    { id: 'SONREIR', label: 'SONREÍR', color: '#E67E22' },
    { id: 'SORPRENDER', label: 'SORPRENDER', color: '#8E44AD' }
  ];

  const currentReconS = Array.isArray(participant.reconocimiento_s)
    ? participant.reconocimiento_s
    : [];

  const handleToggleReconS = (sId) => {
    let updated;
    if (currentReconS.includes(sId)) {
      updated = currentReconS.filter(s => s !== sId);
    } else {
      updated = [...currentReconS, sId];
    }
    updateField('reconocimiento_s', updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner de Cierre */}
      <div style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        border: '1px solid #A7F3D0',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: '#065F46'
      }}>
        <h3 style={{ fontSize: '1.25rem', color: '#047857', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={22} color="#059669" />
          <span>DÍA 30 · CIERRE — DE RETO A HÁBITO</span>
        </h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
          {block.proposito}
        </p>
      </div>

      {/* Tabla de Misión Día 30 */}
      <MisionesTable misiones={block.misiones} sColor={block.color} />

      {/* 1. Historias que dejan huella */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '16px' }}>
          Historias que dejan huella
        </h3>

        <div className="form-group">
          <label className="form-label" htmlFor="cierre-situacion">
            Situación · ¿Qué estaba pasando?
          </label>
          <input
            id="cierre-situacion"
            type="text"
            className="form-input"
            placeholder="Describe el contexto o situación inicial..."
            value={participant.cierre_situacion || ''}
            onChange={(e) => updateField('cierre_situacion', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cierre-accion">
            Acción · ¿Qué hice diferente?
          </label>
          <textarea
            id="cierre-accion"
            className="form-textarea"
            rows={2}
            placeholder="La acción 5S que decidiste implementar conscientemente..."
            value={participant.cierre_accion || ''}
            onChange={(e) => updateField('cierre_accion', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cierre-resultado">
            Resultado · ¿Qué cambió?
          </label>
          <textarea
            id="cierre-resultado"
            className="form-textarea"
            rows={2}
            placeholder="La transformación visible en el cliente, en el equipo o en ti..."
            value={participant.cierre_resultado || ''}
            onChange={(e) => updateField('cierre_resultado', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="cierre-aprendizaje">
            Aprendizaje · ¿Qué me llevo?
          </label>
          <input
            id="cierre-aprendizaje"
            type="text"
            className="form-input"
            placeholder="Tu principal lección de vida y cultura corporativa..."
            value={participant.cierre_aprendizaje || ''}
            onChange={(e) => updateField('cierre_aprendizaje', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Reconocimiento 5S */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={20} color="#E11D48" />
          <span>Reconocimiento 5S</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
          Reconoce a un compañero(a) de tu tienda o equipo que haya sido ejemplo de las 5S:
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="rec-persona">
            Reconozco a:
          </label>
          <input
            id="rec-persona"
            type="text"
            className="form-input"
            placeholder="Nombre de tu compañero(a)..."
            value={participant.reconocimiento_persona || ''}
            onChange={(e) => updateField('reconocimiento_persona', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            En la(s) S que más destacó:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {cincoSList.map(s => {
              const isChecked = currentReconS.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`checkbox-card ${isChecked ? 'checked' : ''}`}
                  onClick={() => handleToggleReconS(s.id)}
                  style={{ justifyContent: 'center', padding: '10px' }}
                >
                  <div
                    className="custom-checkbox"
                    style={{
                      borderColor: isChecked ? s.color : 'var(--gray-300)',
                      backgroundColor: isChecked ? s.color : 'transparent',
                      color: '#fff'
                    }}
                  >
                    {isChecked && <Check size={14} />}
                  </div>
                  <strong style={{ color: isChecked ? s.color : 'var(--gray-700)', fontSize: '0.9rem' }}>
                    {s.label}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="rec-motivo">
            Porque durante este mes...
          </label>
          <textarea
            id="rec-motivo"
            className="form-textarea"
            rows={2}
            placeholder="Escribe el motivo de tu reconocimiento sincero..."
            value={participant.reconocimiento_motivo || ''}
            onChange={(e) => updateField('reconocimiento_motivo', e.target.value)}
          />
        </div>
      </div>

      {/* 3. Mi Compromiso 5S */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--petrol)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookmarkCheck size={20} color="var(--petrol)" />
          <span>Mi Compromiso 5S</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
          De cara al futuro, ¿qué vas a seguir viviendo en cada una de las 5S?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label className="form-label" htmlFor="comp-ser" style={{ color: '#01606D' }}>
              SER · Voy a seguir...
            </label>
            <input
              id="comp-ser"
              type="text"
              className="form-input"
              placeholder="Siendo coherente con mi sello personal..."
              value={participant.compromiso_ser || ''}
              onChange={(e) => updateField('compromiso_ser', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="comp-servir" style={{ color: '#037C8D' }}>
              SERVIR · Voy a seguir...
            </label>
            <input
              id="comp-servir"
              type="text"
              className="form-input"
              placeholder="Anticipándome a las necesidades de clientes y equipo..."
              value={participant.compromiso_servir || ''}
              onChange={(e) => updateField('compromiso_servir', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="comp-saber" style={{ color: '#0F9D7A' }}>
              SABER · Voy a seguir...
            </label>
            <input
              id="comp-saber"
              type="text"
              className="form-input"
              placeholder="Aprendiendo sobre dermatología y enseñando a mis compañeros..."
              value={participant.compromiso_saber || ''}
              onChange={(e) => updateField('compromiso_saber', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="comp-sonreir" style={{ color: '#E67E22' }}>
              SONREÍR · Voy a seguir...
            </label>
            <input
              id="comp-sonreir"
              type="text"
              className="form-input"
              placeholder="Cuidando la energía positiva y transformando quejas en soluciones..."
              value={participant.compromiso_sonreir || ''}
              onChange={(e) => updateField('compromiso_sonreir', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="comp-sorprender" style={{ color: '#8E44AD' }}>
              SORPRENDER · Voy a seguir...
            </label>
            <input
              id="comp-sorprender"
              type="text"
              className="form-input"
              placeholder="Dando ese 1% extra en cada atención..."
              value={participant.compromiso_sorprender || ''}
              onChange={(e) => updateField('compromiso_sorprender', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="comp-30d" style={{ color: '#047857', fontWeight: 800 }}>
            Mi compromiso concreto para los próximos 30 días:
          </label>
          <textarea
            id="comp-30d"
            className="form-textarea"
            rows={3}
            style={{ borderColor: '#6EE7B7' }}
            placeholder="Escribe tu compromiso central que mantendrás como hábito permanente..."
            value={participant.compromiso_30_dias || ''}
            onChange={(e) => updateField('compromiso_30_dias', e.target.value)}
          />
        </div>
      </div>

      {/* Quote Banner */}
      <div className="quote-banner" style={{ background: '#ECFDF5', borderColor: '#10B981', color: '#065F46' }}>
        <strong style={{ color: '#047857' }}>CIERRE</strong>
        "{block.fraseMeLlevo}"
      </div>

      {/* Botón de Celebración */}
      <div style={{ textAlign: 'center', margin: '16px 0 24px' }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => setIsCelebrationOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            gap: '10px'
          }}
        >
          <Sparkles size={20} />
          <span>¡Celebrar y Culminar Reto 5S!</span>
        </button>
      </div>
    </div>
  );
}
