import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Container,
  Stack,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home,
  AccountBalanceWallet,
  Savings,
  SwapHoriz,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Дашборд', icon: <Home />, path: '/' },
    { text: 'Счета', icon: <AccountBalanceWallet />, path: '/accounts' },
    { text: 'Депозиты', icon: <Savings />, path: '/deposits' },
    { text: 'Переводы', icon: <SwapHoriz />, path: '/transfer' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Хедер */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 32 }} />
            Автоматизированная банковская система
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <Stack alignItems="end">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.fullName || user?.login}
              </Typography>
              <Chip
                label="Общий баланс: 1 248 500 ₽"
                color="success"
                variant="outlined"
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </Stack>

            <Avatar
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                width: 48,
                height: 48,
              }}
            >
              {user?.fullName?.[0] || user?.login?.[0] || 'U'}
            </Avatar>

            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Stack>
        </Toolbar>

        {/* Нижняя панель навигации */}
        <Box sx={{ bgcolor: 'primary.dark', px: 4, py: 1.5 }}>
          <Stack direction="row" spacing={4} justifyContent="center">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 1,
                  px: 3,
                  borderRadius: 3,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Stack>
        </Box>
      </AppBar>

      {/* Основной контент */}
      <Container maxWidth="xl" sx={{ mt: 6, pb: 8 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;