import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { state } = useApp();

  useEffect(() => {
    // Apply dark mode class to html element
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  if (!state.auth.isAuthenticated) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
