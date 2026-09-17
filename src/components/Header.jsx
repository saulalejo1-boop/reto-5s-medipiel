import React from 'react';
import { useReto } from '../context/RetoContext';
import { RefreshCw, User, LogOut, ShieldCheck } from 'lucide-react';

export function Header() {
  const { participant, activeTab, setActiveTab, syncStatus, setIsOnboardingOpen, forceSync, logout } = useReto();

  const tabTitles = {
    inicio: "Inicio · Panel Principal",
    reto: "Mi Reto · 30 Días",
    pasaporte: "Pasaporte 5S · Mis 30 Días",
    progreso: "Mi Progreso & Reflexiones",
    admin: "Portal de Administrador · Reportes y Control"
  };

  const isUserLoggedIn = Boolean(participant && participant.nombre && participant.nombre.trim().length > 0);

  const handleLogout = () => {
    if (window.confirm("¿Deseas salir de tu reto? Tu progreso quedará guardado para que puedas continuar después.")) {
      logout();
    }
  };

  return (
    <header className="app-header">
      {/* Mobile Brand */}
      <div className="header-mobile-brand">
        <img src="/medipiel-logo.png" alt="Medipiel" className="header-mobile-logo" />
        <span className="header-title-text">RETO 5S</span>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="header-desktop-breadcrumbs">
        <span>Cultura Medipiel</span>
        <span>/</span>
        <strong>{tabTitles[activeTab] || "Reto 5S"}</strong>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Sync Indicator Pill */}
        <button
          className={`sync-indicator ${syncStatus}`}
          onClick={forceSync}
          title="Clic para sincronizar con Google Sheets"
        >
          {syncStatus === 'saving' ? (
            <>
              <RefreshCw size={13} className="sync-dot pulse" />
              <span>Guardando...</span>
            </>
          ) : syncStatus === 'synced' ? (
            <>
              <span className="sync-dot"></span>
              <span>Sincronizado</span>
            </>
          ) : (
            <>
              <span className="sync-dot" style={{ backgroundColor: '#F59E0B' }}></span>
              <span>Modo Local</span>
            </>
          )}
        </button>

        {/* Botón Acceso Administrador */}
        <button
          className="btn btn-outline btn-sm"
          style={{
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            gap: '5px',
            color: activeTab === 'admin' ? 'var(--white)' : 'var(--petrol)',
            background: activeTab === 'admin' ? 'var(--petrol)' : 'transparent',
            borderColor: activeTab === 'admin' ? 'var(--petrol)' : 'var(--gray-300)'
          }}
          onClick={() => setActiveTab(activeTab === 'admin' ? 'inicio' : 'admin')}
          title="Panel de Administrador"
        >
          <ShieldCheck size={14} />
          <span>Admin</span>
        </button>

        {/* User Card Pill */}
        <button
          className="btn btn-outline btn-sm"
          style={{ padding: '6px 14px', borderRadius: '9999px', fontSize: '0.82rem', gap: '6px' }}
          onClick={() => setIsOnboardingOpen(true)}
          title="Editar perfil o tienda"
        >
          <User size={14} />
          <span>{isUserLoggedIn ? participant.nombre.split(' ')[0] : 'Ingresar'}</span>
        </button>

        {/* Botón Salir / Cerrar Sesión */}
        {isUserLoggedIn && (
          <button
            className="btn btn-outline btn-sm"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              gap: '6px',
              color: 'var(--gray-600)',
              borderColor: 'var(--gray-300)'
            }}
            onClick={handleLogout}
            title="Cerrar sesión / Salir"
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        )}
      </div>
    </header>
  );
}
