import React from 'react';
import { useReto } from '../context/RetoContext';
import { Home, Compass, Award, BarChart3 } from 'lucide-react';

export function MobileNav() {
  const { activeTab, setActiveTab, participant } = useReto();

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'reto', label: 'Mi Reto', icon: Compass },
    { id: 'pasaporte', label: 'Pasaporte', icon: Award },
    { id: 'progreso', label: 'Progreso', icon: BarChart3 }
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
          >
            <div className="mobile-nav-active-bar"></div>
            <Icon size={22} className="mobile-nav-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
