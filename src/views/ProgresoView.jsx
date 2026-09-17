import React from 'react';
import { useReto } from '../context/RetoContext';
import {
  BarChart3,
  Cloud,
  Printer,
  Layers,
  User,
  MapPin,
  Heart
} from 'lucide-react';

export function ProgresoView() {
  const {
    participant,
    lastSaved
  } = useReto();

  const completados = participant.dias_completados || [];

  // Calcular avance por pilar
  const pilarMetrics = [
    { name: 'SER', range: [1, 2, 3, 4, 5], color: '#01606D' },
    { name: 'SERVIR', range: [6, 7, 8, 9, 10], color: '#037C8D' },
    { name: 'SABER', range: [11, 12, 13, 14], color: '#0F9D7A' },
    { name: 'DÍA 15', range: [15], color: '#D97706' },
    { name: 'SONREÍR', range: [16, 17, 18, 19, 20], color: '#E67E22' },
    { name: 'SORPRENDER', range: [21, 22, 23, 24, 25], color: '#8E44AD' },
    { name: 'INTEGRACIÓN', range: [26, 27, 28, 29], color: '#01606D' },
    { name: 'DÍA 30 CIERRE', range: [30], color: '#059669' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card-hero" style={{ background: 'linear-gradient(135deg, #00454F 0%, #01606D 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
          <BarChart3 size={15} color="var(--turquoise)" />
          <span>Seguimiento y Resultados</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--white)', marginBottom: '8px' }}>
          Mi Progreso y Reflexiones
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '640px', lineHeight: 1.5 }}>
          Consulta el balance de tus 30 días, el cumplimiento de cada una de las 5S y el historial de tus aprendizajes.
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid-3">
        <div className="card">
          <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Porcentaje General
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--petrol)', margin: '6px 0' }}>
            {participant.porcentaje_avance || 0}%
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${participant.porcentaje_avance || 0}%` }}></div>
          </div>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Días Completados
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--turquoise-hover)', margin: '6px 0' }}>
            {completados.length} <span style={{ fontSize: '1.2rem', color: 'var(--gray-400)', fontWeight: 500 }}>/ 30</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
            {30 - completados.length} días pendientes por completar
          </p>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>
            Colaborador y Sede
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-800)', marginTop: '8px' }}>
            {participant.nombre || 'Sin registrar'}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--petrol)', fontWeight: 600, margin: 0 }}>
            {participant.tienda || 'Sin sede'}
          </p>
        </div>
      </div>

      {/* Progress Breakdown per 5S Pillar */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--petrol)" />
          <span>Avance por Pilar Cultural</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {pilarMetrics.map(p => {
            const doneInPilar = p.range.filter(dia => completados.includes(dia)).length;
            const pct = Math.round((doneInPilar / p.range.length) * 100);
            return (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 700, color: p.color }}>
                    {p.name} ({doneInPilar}/{p.range.length} días)
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--gray-700)' }}>
                    {pct}%
                  </span>
                </div>
                <div className="progress-track" style={{ height: '8px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: p.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bitácora de Respuestas y Reflexiones Registradas */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--petrol)' }}>
            Bitácora de Reflexiones Registradas
          </h3>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handlePrint}
            style={{ gap: '6px' }}
          >
            <Printer size={16} />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Intención inicial */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: 'var(--petrol)', fontSize: '0.92rem' }}>Mi Intención para los 30 Días:</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', marginTop: '4px' }}>
              {participant.intencion_30_dias || <em>No registrada aún.</em>}
            </p>
          </div>

          {/* SER */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#01606D', fontSize: '0.92rem' }}>SER · Mi Sello Personal:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Cualidad 1:</strong> {participant.ser_caracteristica_1 || '—'}</li>
              <li><strong>Cualidad 2:</strong> {participant.ser_caracteristica_2 || '—'}</li>
              <li><strong>Cualidad 3:</strong> {participant.ser_caracteristica_3 || '—'}</li>
              <li><strong>Acción concreta:</strong> {participant.ser_accion || '—'}</li>
              <li><strong>Descubrimiento:</strong> {participant.ser_descubrimiento || '—'}</li>
            </ul>
          </div>

          {/* SERVIR */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#037C8D', fontSize: '0.92rem' }}>SERVIR · La Ayuda Inesperada:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Tipos de ayuda:</strong> {(participant.servir_tipos_ayuda || []).join(', ') || '—'}</li>
              <li><strong>A quién apoyé:</strong> {participant.servir_a_quien || '—'}</li>
              <li><strong>Qué hice:</strong> {participant.servir_que_hice || '—'}</li>
              <li><strong>Qué cambió:</strong> {participant.servir_cambio || '—'}</li>
            </ul>
          </div>

          {/* SABER */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#0F9D7A', fontSize: '0.92rem' }}>SABER · Te Enseño en 5 Minutos:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Qué enseñé:</strong> {participant.saber_que_ensene || '—'}</li>
              <li><strong>Qué aprendí:</strong> {participant.saber_que_aprendi || '—'}</li>
              <li><strong>Dónde aplicar:</strong> {participant.saber_donde_aplicar || '—'}</li>
            </ul>
          </div>

          {/* DÍA 15 */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#D97706', fontSize: '0.92rem' }}>Día 15 · Encuentro de Avances:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Historia 1 min:</strong> {participant.dia15_historia || '—'}</li>
              <li><strong>Rojo (Dejar de hacer):</strong> {participant.dia15_rojo || '—'}</li>
              <li><strong>Amarillo (Mejorar):</strong> {participant.dia15_amarillo || '—'}</li>
              <li><strong>Verde (Mantener):</strong> {participant.dia15_verde || '—'}</li>
              <li><strong>S a fortalecer:</strong> {participant.dia15_s_fortalecer || '—'}</li>
              <li><strong>Comportamiento:</strong> {participant.dia15_comportamiento || '—'}</li>
            </ul>
          </div>

          {/* SONREÍR */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#E67E22', fontSize: '0.92rem' }}>SONREÍR · 24 Horas de Buena Energía:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Situación:</strong> {participant.sonreir_situacion || '—'}</li>
              <li><strong>Respuesta antes vs ahora:</strong> {participant.sonreir_reaccion || '—'}</li>
              <li><strong>Efecto:</strong> {participant.sonreir_efecto || '—'}</li>
            </ul>
          </div>

          {/* SORPRENDER */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#8E44AD', fontSize: '0.92rem' }}>SORPRENDER · El 1% Extra:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Oportunidad:</strong> {participant.sorprender_oportunidad || '—'}</li>
              <li><strong>Idea 1%:</strong> {participant.sorprender_idea || '—'}</li>
              <li><strong>Prueba y resultado:</strong> {participant.sorprender_prueba || '—'} ({participant.sorprender_resultado || 'Sin estado'})</li>
              <li><strong>¿Y si nosotros...?:</strong> {participant.sorprender_y_si || '—'}</li>
            </ul>
          </div>

          {/* RETO INTEGRADO */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#01606D', fontSize: '0.92rem' }}>Reto Integrado (3+ S):</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>S Combinadas:</strong> {(participant.reto_integrado_s || []).join(', ') || '—'}</li>
              <li><strong>Acción:</strong> {participant.reto_integrado_accion || '—'}</li>
              <li><strong>Beneficiario:</strong> {participant.reto_integrado_beneficiario || '—'}</li>
              <li><strong>Resultado y enseñanza:</strong> {participant.reto_integrado_resultado || '—'}</li>
            </ul>
          </div>

          {/* DÍA 30 */}
          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <strong style={{ color: '#059669', fontSize: '0.92rem' }}>Día 30 · Cierre y Compromisos:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
              <li><strong>Historia final:</strong> {participant.cierre_resultado || '—'}</li>
              <li><strong>Reconocimiento a:</strong> {participant.reconocimiento_persona || '—'} ({(participant.reconocimiento_s || []).join(', ')})</li>
              <li><strong>Compromiso 30 días:</strong> {participant.compromiso_30_dias || '—'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estado del Guardado Automático */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(45, 204, 211, 0.08) 0%, rgba(1, 96, 109, 0.05) 100%)', border: '1px solid var(--turquoise-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--turquoise-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--petrol)',
            flexShrink: 0
          }}>
            <Cloud size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.96rem', color: 'var(--petrol)', display: 'block' }}>
              Guardado y Sincronización Automática
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: '3px 0 0 0', lineHeight: 1.4 }}>
              Tus reflexiones, compromisos y sellos del pasaporte se guardan automáticamente en este dispositivo y se respaldan en la plataforma corporativa de Medipiel cada vez que avanzas.
              {lastSaved && ` · Última sincronización: ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
