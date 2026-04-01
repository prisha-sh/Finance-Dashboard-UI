import React from 'react';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <>
      <Toaster 
        theme={isDarkMode ? 'dark' : 'light'} 
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDarkMode ? 'var(--bg-card)' : 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Dashboard />
    </>
  );
}

export default App;
