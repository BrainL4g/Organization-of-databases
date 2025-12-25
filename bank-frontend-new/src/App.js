import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Общие страницы
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Клиентские страницы
const ClientLayout = lazy(() => import('./components/layout/ClientLayout'));
const Dashboard = lazy(() => import('./pages/client/Dashboard'));
const Accounts = lazy(() => import('./pages/client/Accounts'));
const Deposits = lazy(() => import('./pages/client/Deposits'));
const Transfer = lazy(() => import('./pages/client/Transfer'));
const Cards = lazy(() => import('./pages/client/Cards'));
const Loans = lazy(() => import('./pages/client/Loans'));
const Transactions = lazy(() => import('./pages/client/Transactions'));
const Profile = lazy(() => import('./pages/client/Profile'));

// Страницы сотрудника
const EmployeeLayout = lazy(() => import('./components/layout/EmployeeLayout'));
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'));
const ClientsManagement = lazy(() => import('./pages/employee/ClientsManagement'));
const AccountsManagement = lazy(() => import('./pages/employee/AccountsManagement'));
const TransactionsManagement = lazy(() => import('./pages/employee/TransactionsManagement'));
const ProductsManagement = lazy(() => import('./pages/employee/ProductsManagement'));
const Reports = lazy(() => import('./pages/employee/Reports'));

// Админские страницы
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const SystemLogs = lazy(() => import('./pages/admin/SystemLogs'));

const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Защищённые маршруты для клиентов */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route element={<ClientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/deposits" element={<Deposits />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Защищённые маршруты для сотрудников */}
          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/clients" element={<ClientsManagement />} />
              <Route path="/employee/accounts" element={<AccountsManagement />} />
              <Route path="/employee/transactions" element={<TransactionsManagement />} />
              <Route path="/employee/products" element={<ProductsManagement />} />
              <Route path="/employee/reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Защищённые маршруты для администраторов */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
              <Route path="/admin/logs" element={<SystemLogs />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
