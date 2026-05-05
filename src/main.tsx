import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import './index.css';

const RootComponent = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <AuthScreen />;
  }

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  </StrictMode>
);
