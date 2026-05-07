import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Layout from './components/Layout';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/purchases" element={
        <ProtectedRoute allowedRoles={['Admin', 'Logistics']}>
          <Purchases />
        </ProtectedRoute>
      } />
      <Route path="/transfers" element={
        <ProtectedRoute allowedRoles={['Admin', 'Logistics']}>
          <Transfers />
        </ProtectedRoute>
      } />
      <Route path="/assignments" element={
        <ProtectedRoute allowedRoles={['Admin', 'Commander']}>
          <Assignments />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
