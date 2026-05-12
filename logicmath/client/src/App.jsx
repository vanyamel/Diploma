import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './shared/useAuthStore';
import Layout from './shared/Layout';
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import SolvePage from './pages/SolvePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AuthPage from './pages/AuthPage';
import ProgressPage from './pages/ProgressPage';
import NotFoundPage from './pages/NotFoundPage';
import FavoritesPage from './pages/FavoritesPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './shared/ProtectedRoute';

function App() {
  const { user, token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token && !user) fetchMe();
  }, [token, user, fetchMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="solve/:category" element={<SolvePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route 
            path="progress" 
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="favorites" 
            element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} 
          />
          <Route 
            path="admin" 
            element={<ProtectedRoute><AdminPage /></ProtectedRoute>} 
          />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="auth" element={user ? <Navigate to="/progress" /> : <AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
