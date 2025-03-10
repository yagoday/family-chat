import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import Chat from './components/Chat/Chat';
import { auth } from './services/api';
import { ThemeProvider, createTheme, Direction } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
}) as any; // Type assertion needed for emotion cache with stylis plugins

// Create a theme instance
const theme = createTheme({
  direction: 'rtl' as Direction,
  palette: {
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#82c91e',
    },
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    allVariants: {
      direction: 'rtl',
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const handleLogin = async (username: string, password: string) => {
    await auth.login(username, password);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App; 