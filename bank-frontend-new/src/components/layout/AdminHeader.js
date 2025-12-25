import React, { useState } from 'react';
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
  IconButton,
  Badge,
} from '@mui/material';
import {
  AdminPanelSettings,
  Logout,
  Notifications,
  Settings,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        bgcolor: '#1a237e',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Логотип админ-панели */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1.2,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Административная панель
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Управление банковской системой
              </Typography>
            </Box>
          </Box>

          {/* Пространство */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Иконки уведомлений и настроек */}
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <IconButton sx={{ color: 'white' }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => navigate('/admin/settings')}
            >
              <Settings />
            </IconButton>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => navigate('/admin/logs')}
            >
              <Security />
            </IconButton>
          </Stack>

          {/* Профиль администратора */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                {user?.fullName || 'Администратор'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {user?.position || 'Системный администратор'}
              </Typography>
            </Box>

            <Chip
              label="ADMIN"
              color="error"
              size="small"
              sx={{
                bgcolor: '#d32f2f',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.8rem',
                height: 28,
              }}
            />

            <Avatar
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                fontWeight: 'bold',
                width: 42,
                height: 42,
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {user?.fullName?.charAt(0).toUpperCase() || 'A'}
            </Avatar>

            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              size="small"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Выйти
            </Button>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;