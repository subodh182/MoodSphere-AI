import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: 'var(--toast-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontFamily: "'Nunito', sans-serif", fontWeight: 700 },
              success: { iconTheme: { primary: '#6bcb77', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ff6b6b', secondary: '#fff' } }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
