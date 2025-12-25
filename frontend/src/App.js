// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import ClientDashboard from './pages/Dashboard/ClientDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

import ClientList from './pages/Clients/ClientList';
import AccountList from './pages/Accounts/AccountList';
import TransactionList from './pages/Transactions/TransactionList';
import ProductList from './pages/Products/ProductList';

import { ROLES } from './utils/roles';

// Компонент для редиректа после логина в зависимости от роли
const RedirectAfterLogin = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case ROLES.CLIENT:
      return <Navigate to="/client" replace />;
    case ROLES.EMPLOYEE:
      return <Navigate to="/employee" replace />;
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Главная страница только для неавторизованных
const HomeWrapper = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <RedirectAfterLogin />;
  }

  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Главная страница — только для гостей */}
            <Route path="/" element={<HomeWrapper />} />

            {/* Публичные страницы */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* После логина — автоматический редирект на нужную панель */}
            <Route path="/dashboard" element={<RedirectAfterLogin />} />

            {/* Защищённые маршруты по ролям */}
            <Route path="/client" element={
              <PrivateRoute allowedRoles={[ROLES.CLIENT]}>
                <ClientDashboard />
              </PrivateRoute>
            } />

            <Route path="/employee" element={
              <PrivateRoute allowedRoles={[ROLES.EMPLOYEE]}>
                <EmployeeDashboard />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </PrivateRoute>
            } />

            {/* Общие защищённые страницы */}
            <Route path="/clients" element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <ClientList />
              </PrivateRoute>
            } />

            <Route path="/accounts" element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <AccountList />
              </PrivateRoute>
            } />

            <Route path="/transactions" element={
              <PrivateRoute allowedRoles={[ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.ADMIN]}>
                <TransactionList />
              </PrivateRoute>
            } />

            <Route path="/products" element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.CLIENT]}>
                <ProductList />
              </PrivateRoute>
            } />

            {/* Любые другие пути — редирект */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;