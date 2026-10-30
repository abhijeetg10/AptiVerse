import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Games from './pages/Games';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy-load heavier routes & games to keep AptiVerse lightweight
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MotionChallenge = lazy(() => import('./games/MotionChallenge'));
const GeoSudoku = lazy(() => import('./games/GeoSudoku'));
const GridChallenge = lazy(() => import('./games/GridChallenge'));
const SwitchChallenge = lazy(() => import('./games/switch/SwitchChallenge'));
const InductiveChallenge = lazy(() => import('./games/inductive/InductiveChallenge'));
const DIChallenge = lazy(() => import('./games/di/DIChallenge'));
const RCChallenge = lazy(() => import('./games/rc/RCChallenge'));

const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public Pages with Navbar */}
              <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="progress" element={<Progress />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="about" element={<AboutUs />} />
              
              {/* Admin Route */}
              <Route path="admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Route>

            {/* Protected Game Routes (full screen) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/games/motion" element={<MotionChallenge />} />
              <Route path="/games/sudoku" element={<GeoSudoku />} />
              <Route path="/games/grid" element={<GridChallenge />} />
              <Route path="/games/switch" element={<SwitchChallenge />} />
              <Route path="/games/inductive" element={<InductiveChallenge />} />
              <Route path="/games/di" element={<DIChallenge />} />
              <Route path="/games/rc" element={<RCChallenge />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;
