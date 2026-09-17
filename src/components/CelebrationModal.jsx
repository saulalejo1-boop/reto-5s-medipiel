import React, { useEffect } from 'react';
import { useReto } from '../context/RetoContext';
import confetti from 'canvas-confetti';
import { Award, Sparkles, CheckCircle2, Heart, X, ArrowRight } from 'lucide-react';

export function CelebrationModal() {
  const { isCelebrationOpen, setIsCelebrationOpen, participant, setActiveTab } = useReto();

  useEffect(() => {
    if (isCelebrationOpen) {
      // Fire confetti bursts
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isCelebrationOpen]);

  if (!isCelebrationOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <button
          onClick={() => setIsCelebrationOpen(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--gray-400)' }}
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>

        {/* Celebration Trophy Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 12px 28px rgba(217, 119, 6, 0.35)'
        }}>
          <Award size={44} />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> ¡Reto Completado!
        </span>

        <h2 style={{ fontSize: '2rem', color: 'var(--petrol)', marginBottom: '8px' }}>
          ¡Felicitaciones, {participant.nombre ? participant.nombre.split(' ')[0] : 'Líder'}!
        </h2>

        <h3 style={{ fontSize: '1.2rem', color: 'var(--turquoise-hover)', fontWeight: 700, marginBottom: '16px' }}>
          Completaste tu Reto 5S
        </h3>

        <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
          "Las 5S no se aprenden de memoria. Se viven: <strong>SER</strong> desde nuestra esencia, <strong>SERVIR</strong> con disposición, <strong>SABER</strong> para crecer, <strong>SONREÍR</strong> para transformar y <strong>SORPRENDER</strong> para superar lo esperado."
        </p>

        {/* Summary Card */}
        <div style={{
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--gray-200)',
          textAlign: 'left',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <strong style={{ fontSize: '0.92rem', color: 'var(--gray-800)' }}>
              Pasaporte 5S culminado con éxito
            </strong>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0 }}>
            Has convertido las 5S en acciones que se ven, se sienten y se repiten en tu tienda <strong>{participant.tienda || 'Medipiel'}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn btn-outline"
            onClick={() => setIsCelebrationOpen(false)}
          >
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsCelebrationOpen(false);
              setActiveTab('progreso');
            }}
          >
            <span>Ver mi progreso y reflexiones</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
