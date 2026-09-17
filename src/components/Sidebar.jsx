import React from 'react';
import { useReto } from '../context/RetoContext';
import { Home, Compass, Award, BarChart3, ChevronRight, User, LogOut, ShieldCheck } from 'lucide-react';

export function Sidebar() {
  const { activeTab, setActiveTab, participant, setIsOnboardingOpen, logout } = useReto();

  const isUserLoggedIn = Boolean(participant && participant.nombre && participant.nombre.trim().length > 0);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'reto', label: 'Mi Reto', icon: Compass, badge: `Bloque ${participant.dia_actual ? Math.ceil(participant.dia_actual / 4) : 1}` },
    { id: 'pasaporte', label: 'Pasaporte 5S', icon: Award, badge: `${(participant.dias_completados || []).length}/30` },
    { id: 'progreso', label: 'Mi Progreso', icon: BarChart3 }
  ];

  const initials = isUserLoggedIn
    ? participant.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'MP';

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("¿Deseas salir de tu reto? Tu progreso quedará guardado para que puedas continuar después.")) {
      logout();
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <img src="/medipiel-logo.png" alt="Medipiel Logo" className="sidebar-logo" />
        <div className="sidebar-title-box">
          <span className="sidebar-app-name">RETO 5S</span>
          <span className="sidebar-app-tag">Cultura Medipiel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}

        {/* Acceso al Portal de Administrador */}
        <button
          type="button"
          className={`sidebar-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
          style={{
            marginTop: '8px',
            borderTop: '1px solid var(--gray-200)',
            paddingTop: '12px'
          }}
          title="Panel exclusivo para líderes y administradores"
        >
          <ShieldCheck size={19} className="nav-icon" color={activeTab === 'admin' ? '#fff' : 'var(--petrol)'} />
          <span>Portal Administrador</span>
        </button>

        {/* Mini Progress Card in Sidebar */}
        <div style={{ marginTop: 'auto', padding: '16px', background: 'var(--petrol-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--turquoise-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--petrol)' }}>
            <span>Avance general</span>
            <span>{participant.porcentaje_avance || 0}%</span>
          </div>
          <div className="progress-track" style={{ height: '8px', background: 'var(--white)' }}>
            <div
              className="progress-fill"
              style={{ width: `${participant.porcentaje_avance || 0}%` }}
            ></div>
          </div>
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
            {(participant.dias_completados || []).length} de 30 días completados
          </p>
        </div>
      </nav>

      {/* Footer User Info */}
      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="sidebar-user-card"
          onClick={() => setIsOnboardingOpen(true)}
          style={{ width: '100%', textAlign: 'left' }}
          title="Editar perfil"
        >
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {participant.nombre || 'Colaborador Medipiel'}
            </div>
            <div className="sidebar-user-store">
              {participant.tienda || 'Seleccionar tienda'}
            </div>
          </div>
          <ChevronRight size={16} color="var(--gray-400)" />
        </button>

        {isUserLoggedIn && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
            style={{
              width: '100%',
              gap: '6px',
              color: 'var(--gray-600)',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-200)',
              background: 'var(--white)',
              justifyContent: 'center',
              padding: '8px'
            }}
            title="Cerrar sesión y permitir que otro colaborador ingrese"
          >
            <LogOut size={14} />
            <span>Cerrar sesión / Salir</span>
          </button>
        )}
      </div>
    </aside>
  );
}
