import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Threats from './pages/Threats';
import Incidents from './pages/Incidents';
import Devices from './pages/Devices';
import Logs from './pages/Logs';
import Admin from './pages/Admin';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen bg-cyber-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/threats" element={<PrivateRoute><Threats /></PrivateRoute>} />
          <Route path="/incidents" element={<PrivateRoute><Incidents /></PrivateRoute>} />
          <Route path="/devices" element={<PrivateRoute><Devices /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
