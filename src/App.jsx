import React from 'react';
import { useReto } from './context/RetoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { OnboardingModal } from './components/OnboardingModal';
import { CelebrationModal } from './components/CelebrationModal';
import { InicioView } from './views/InicioView';
import { MiRetoView } from './views/MiRetoView';
import { PasaporteView } from './views/PasaporteView';
import { ProgresoView } from './views/ProgresoView';
import { AdminPortalView } from './views/AdminPortalView';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export function App() {
  const { activeTab, toast } = useReto();

  // Si está en el Portal de Administrador, mostrar la experiencia ejecutiva independiente (sin sidebar de colaborador)
  if (activeTab === 'admin') {
    return (
      <div className="admin-app-root" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <AdminPortalView />

        {/* Floating Toast Notification */}
        {toast && (
          <div className="toast-container">
            <div className="toast">
              {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
              {toast.type === 'warning' && <AlertCircle size={18} color="var(--warning)" />}
              {toast.type === 'info' && <Info size={18} color="var(--turquoise)" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Experiencia de Reto 5S para Colaboradores
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inicio':
        return <InicioView />;
      case 'reto':
        return <MiRetoView />;
      case 'pasaporte':
        return <PasaporteView />;
      case 'progreso':
        return <ProgresoView />;
      default:
        return <InicioView />;
    }
  };

  return (
    <div className="app-container">
      {/* Lateral Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header />

        <main className="app-content">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals */}
      <OnboardingModal />
      <CelebrationModal />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
            {toast.type === 'warning' && <AlertCircle size={18} color="var(--warning)" />}
            {toast.type === 'info' && <Info size={18} color="var(--turquoise)" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
