import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import ParticlesBg from './components/Shared/ParticlesBg';
import SurpriseButton from './components/Mood/SurpriseButton';
import { useMoodState } from './hooks/useMoodState';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  const { selectedMood } = useMoodState();

  return (
    <div className="app-root">
      <ParticlesBg mood={selectedMood} />
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SurpriseButton />
    </div>
  );
}

export default App;
