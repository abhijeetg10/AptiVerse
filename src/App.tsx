import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Games from './pages/Games';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import MotionChallenge from './games/MotionChallenge';
import GeoSudoku from './games/GeoSudoku';
import GridChallenge from './games/GridChallenge';
import SwitchChallenge from './games/switch/SwitchChallenge';
import InductiveChallenge from './games/inductive/InductiveChallenge';
import DIChallenge from './games/di/DIChallenge';
import RCChallenge from './games/rc/RCChallenge';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages with Navbar */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
