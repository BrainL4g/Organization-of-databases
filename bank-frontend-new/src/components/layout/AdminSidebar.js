import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  AccountBalanceWallet,
  ReceiptLong,
  Settings,
  Security,
  Analytics,
  Store,
  Description,
  History,
  Backup,
  DeviceHub,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const adminMenuItems = [
    {
      section: 'Основное',
      items: [
        { path: '/admin/dashboard', label: 'Дашборд', icon: React.createElement(Dashboard) },
        { path: '/admin/users', label: 'Пользователи', icon: React.createElement(People) },
      ]
    },
    {
      section: 'Управление данными',
      items: [
        { path: '/employee/accounts', label: 'Счета', icon: React.createElement(AccountBalanceWallet) },
        { path: '/employee/transactions', label: 'Транзакции', icon: React.createElement(ReceiptLong) },
        { path: '/employee/products', label: 'Продукты', icon: React.createElement(Store) },
      ]
    },
    {
      section: 'Система',
      items: [
        { path: '/admin/settings', label: 'Настройки', icon: React.createElement(Settings) },
        { path: '/admin/logs', label: 'Логи системы', icon: React.createElement(History) },
        { path: '#', label: 'Резервное копирование', icon: React.createElement(Backup) },
      ]
    },
    {
      section: 'Мониторинг',
      items: [
        { path: '/employee/reports', label: 'Отчёты', icon: React.createElement(Analytics) },
        { path: '#', label: 'Безопасность', icon: React.createElement(Security) },
        { path: '#', label: 'Системные метрики', icon: React.createElement(DeviceHub) },
      ]
    },
  ];

  return React.createElement(Drawer, {
    variant: "permanent",
    sx: {
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        border: 'none',
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
        bgcolor: '#ffffff',
        pt: 10,
      },
    },
  },
    // Профиль администратора
    React.createElement(Box, {
      sx: { p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }
    },
      React.createElement(Avatar, {
        sx: {
          width: 80,
          height: 80,
          mx: 'auto',
          mb: 2,
          bgcolor: '#1a237e',
          fontSize: '2rem',
        }
      }, user?.fullName?.charAt(0).toUpperCase() || 'A'),
      React.createElement(Typography, {
        variant: "h6",
        sx: { fontWeight: 700, mb: 0.5 }
      }, user?.fullName || 'Администратор'),
      React.createElement(Chip, {
        label: "СИСТЕМНЫЙ АДМИНИСТРАТОР",
        size: "small",
        sx: {
          bgcolor: '#1a237e',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.7rem',
          height: 24,
          mb: 1
        }
      }),
      React.createElement(Typography, {
        variant: "caption",
        color: "text.secondary"
      }, user?.department || 'IT-отдел')
    ),

    React.createElement(Divider),

    // Меню навигации
    React.createElement(Box, {
      sx: { overflowY: 'auto', height: 'calc(100vh - 200px)' }
    },
      adminMenuItems.map((section, sectionIndex) =>
        React.createElement(Box, {
          key: sectionIndex,
          sx: { p: 2 }
        },
          React.createElement(Typography, {
            variant: "caption",
            sx: {
              color: 'text.secondary',
              fontWeight: 600,
              display: 'block',
              mb: 1,
              px: 2,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }
          }, section.section),
          React.createElement(List, { sx: { p: 0 } },
            section.items.map((item) =>
              React.createElement(ListItem, {
                key: item.path,
                button: true,
                onClick: () => navigate(item.path),
                sx: {
                  mb: 0.5,
                  borderRadius: 2,
                  px: 2,
                  bgcolor: location.pathname === item.path ? '#e8eaf6' : 'transparent',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? '#d1d9ff' : '#f5f5f5',
                  },
                }
              },
                React.createElement(ListItemIcon, {
                  sx: {
                    color: location.pathname === item.path ? '#1a237e' : 'text.secondary',
                    minWidth: 40
                  }
                }, item.icon),
                React.createElement(ListItemText, {
                  primary: item.label,
                  primaryTypographyProps: {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? '#1a237e' : 'text.primary',
                    fontSize: '0.9rem'
                  }
                })
              )
            )
          )
        )
      )
    ),

    // Статус системы
    React.createElement(Box, {
      sx: { p: 3, mt: 'auto', bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }
    },
      React.createElement(Typography, {
        variant: "subtitle2",
        color: "text.secondary",
        sx: { mb: 2 }
      }, 'Статус системы'),
      React.createElement(Box, {
        sx: { display: 'flex', flexDirection: 'column', gap: 1 }
      },
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between' }
        },
          React.createElement(Typography, { variant: "caption" }, 'Сервер'),
          React.createElement(Chip, { label: "Online", size: "small", color: "success" })
        ),
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between' }
        },
          React.createElement(Typography, { variant: "caption" }, 'База данных'),
          React.createElement(Chip, { label: "Active", size: "small", color: "success" })
        ),
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between' }
        },
          React.createElement(Typography, { variant: "caption" }, 'Пользователи онлайн'),
          React.createElement(Chip, { label: "42", size: "small" })
        )
      )
    )
  );
};

export default AdminSidebar;
