import React, { useState, useEffect } from 'react';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { CustomerDetailView } from './views/CustomerDetailView';

// Simple Router Type
type ViewState = 
  | { type: 'LOGIN' }
  | { type: 'DASHBOARD' }
  | { type: 'CUSTOMER_DETAIL'; customerId: string };

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'LOGIN' });

  // Check if already logged in (simulated persistence)
  useEffect(() => {
    const user = localStorage.getItem('dukaan_user');
    if (user) {
      setView({ type: 'DASHBOARD' });
    }
  }, []);

  const handleLogin = (mobile: string) => {
    localStorage.setItem('dukaan_user', mobile);
    setView({ type: 'DASHBOARD' });
  };

  const handleLogout = () => {
    localStorage.removeItem('dukaan_user');
    setView({ type: 'LOGIN' });
  };

  const renderView = () => {
    switch (view.type) {
      case 'LOGIN':
        return <LoginView onLogin={handleLogin} />;
      
      case 'DASHBOARD':
        return (
          <DashboardView 
            onSelectCustomer={(id) => setView({ type: 'CUSTOMER_DETAIL', customerId: id })} 
            onLogout={handleLogout}
          />
        );
      
      case 'CUSTOMER_DETAIL':
        return (
          <CustomerDetailView 
            customerId={view.customerId} 
            onBack={() => setView({ type: 'DASHBOARD' })} 
          />
        );
        
      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <div className="antialiased text-slate-200 bg-slate-950 h-full min-h-screen">
      {renderView()}
    </div>
  );
};

export default App;