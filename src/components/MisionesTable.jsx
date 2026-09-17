import React from 'react';
import { useReto } from '../context/RetoContext';
import { Check } from 'lucide-react';

export function MisionesTable({ misiones = [], sColor = '#01606D' }) {
  const { participant, toggleDayCompletion } = useReto();
  const completados = participant.dias_completados || [];

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--gray-200)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.9rem',
          background: 'var(--white)'
        }}>
          <thead>
            <tr style={{
              background: 'linear-gradient(135deg, #2DCCD3 0%, #01606D 100%)',
              color: 'var(--white)',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              letterSpacing: '0.8px'
            }}>
              <th style={{ padding: '12px 14px', width: '70px', textAlign: 'center' }}>Día</th>
              <th style={{ padding: '12px 16px', width: '28%' }}>Misión</th>
              <th style={{ padding: '12px 16px' }}>Evidencia</th>
              <th style={{ padding: '12px 16px', width: '110px', textAlign: 'center' }}>Completar</th>
            </tr>
          </thead>
          <tbody>
            {misiones.map((item, idx) => {
              const isDone = completados.includes(item.dia);
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={item.dia}
                  style={{
                    backgroundColor: isDone ? 'var(--turquoise-soft)' : isEven ? '#FFFFFF' : 'var(--gray-50)',
                    borderTop: '1px solid var(--gray-200)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {/* Número de Día */}
                  <td style={{
                    padding: '12px 14px',
                    textAlign: 'center',
                    fontWeight: 800,
                    color: sColor,
                    fontSize: '0.95rem'
                  }}>
                    {item.dia}
                  </td>

                  {/* Misión */}
                  <td style={{
                    padding: '12px 16px',
                    fontWeight: 700,
                    color: 'var(--gray-800)'
                  }}>
                    {item.mision}
                  </td>

                  {/* Evidencia */}
                  <td style={{
                    padding: '12px 16px',
                    color: 'var(--gray-600)',
                    lineHeight: 1.45
                  }}>
                    {item.evidencia}
                  </td>

                  {/* Botón de Check-in interactivo */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => toggleDayCompletion(item.dia)}
                      title={isDone ? `Día ${item.dia} completado (clic para desmarcar)` : `Marcar Día ${item.dia} como completado`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: isDone ? `1.5px solid ${sColor}` : '1.5px solid var(--gray-300)',
                        background: isDone ? sColor : '#FFFFFF',
                        color: isDone ? '#FFFFFF' : 'var(--gray-600)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {isDone ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Listo</span>
                        </>
                      ) : (
                        <span>Marcar</span>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
