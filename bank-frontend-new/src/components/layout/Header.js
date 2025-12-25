import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Box,
  Container,
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  Dashboard,
  AccountBalanceWallet,
  CompareArrows,
  Savings,
  Person,
  CreditCard,
  History,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Главная', icon: <Dashboard fontSize="small" /> },
    { path: '/accounts', label: 'Счета', icon: <AccountBalanceWallet fontSize="small" /> },
    { path: '/deposits', label: 'Вклады', icon: <Savings fontSize="small" /> },
    { path: '/transfer', label: 'Переводы', icon: <CompareArrows fontSize="small" /> },
    { path: '/profile', label: 'Профиль', icon: <Person fontSize="small" /> },
    { path: '/cards', label: 'Карты', icon: <CreditCard fontSize="small" /> },
    { path: '/transactions', label: 'История', icon: <History fontSize="small" /> },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Логотип */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            <AccountBalance sx={{
              fontSize: 40,
              color: 'primary.main',
              bgcolor: 'primary.light',
              p: 1,
              borderRadius: 2,
            }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  background: 'linear-gradient(45deg, #0d47a1 0%, #1565c0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Автоматизированная банковская система
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 500,
                }}
              >
                Безопасные финансовые решения
              </Typography>
            </Box>
          </Box>

          {/* Пространство */}
          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <>
              {/* Навигация */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    variant={location.pathname === item.path ? "contained" : "text"}
                    sx={{
                      color: location.pathname === item.path ? 'white' : 'text.primary',
                      bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
                      borderRadius: 2,
                      px: 2,
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      '&:hover': {
                        bgcolor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>

              {/* Профиль пользователя */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {user?.fullName || user?.login}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {user?.role === 'employee' ? 'Сотрудник' : 'Клиент'}
                  </Typography>
                </Box>

                <Chip
                  label="1 248 500 ₽"
                  color="success"
                  size="small"
                  sx={{
                    bgcolor: 'success.light',
                    color: 'success.dark',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    height: 32,
                    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.2)',
                  }}
                />

                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    width: 44,
                    height: 44,
                    border: '3px solid',
                    borderColor: 'primary.light',
                    boxShadow: '0 3px 10px rgba(13, 71, 161, 0.2)',
                  }}
                >
                  {user?.fullName?.charAt(0).toUpperCase() || user?.login?.charAt(0).toUpperCase() || 'U'}
                </Avatar>

                <Button
                  variant="outlined"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    borderColor: 'error.light',
                    borderWidth: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'error.light',
                      color: 'error.dark',
                    },
                  }}
                >
                  Выйти
                </Button>
              </Stack>
            </>
          ) : (
            /* Кнопки авторизации */
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  borderWidth: 2,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.light',
                  },
                }}
              >
                Войти
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  color: 'white',
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(13, 71, 161, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0a3570 0%, #0d47a1 100%)',
                    boxShadow: '0 6px 20px rgba(13, 71, 161, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Открыть счёт
              </Button>
            </Stack>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;