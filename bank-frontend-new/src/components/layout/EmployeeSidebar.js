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
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  AccountBalanceWallet,
  ReceiptLong,
  Store,
  Assessment,
  AddCircle,
  Search,
  Assignment,
  ListAlt,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const employeeMenuItems = [
    {
      section: 'Основное',
      items: [
        {
          path: '/employee/dashboard',
          label: 'Дашборд',
          icon: React.createElement(Dashboard),
          badge: null
        },
        {
          path: '/employee/clients',
          label: 'Клиенты',
          icon: React.createElement(People),
          badge: 12
        },
      ]
    },
    {
      section: 'Операции',
      items: [
        {
          path: '/employee/accounts',
          label: 'Управление счетами',
          icon: React.createElement(AccountBalanceWallet),
          badge: 3
        },
        {
          path: '/employee/transactions',
          label: 'Транзакции',
          icon: React.createElement(ReceiptLong),
          badge: 8
        },
        {
          path: '/employee/products',
          label: 'Банковские продукты',
          icon: React.createElement(Store),
          badge: null
        },
      ]
    },
    {
      section: 'Отчёты',
      items: [
        {
          path: '/employee/reports',
          label: 'Финансовые отчёты',
          icon: React.createElement(Assessment),
          badge: null
        },
      ]
    },
  ];

  const quickActions = [
    { label: 'Новый клиент', icon: React.createElement(AddCircle), path: '#' },
    { label: 'Поиск клиента', icon: React.createElement(Search), path: '#' },
    { label: 'Заявки на кредит', icon: React.createElement(Assignment), path: '#' },
    { label: 'Список операций', icon: React.createElement(ListAlt), path: '#' },
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
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
        bgcolor: 'background.paper',
        pt: 10,
      },
    },
  },
    // Профиль сотрудника
    React.createElement(Box, {
      sx: { p: 3, textAlign: 'center', bgcolor: '#f0f7ff' }
    },
      React.createElement(Avatar, {
        sx: {
          width: 70,
          height: 70,
          mx: 'auto',
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: '1.8rem',
        }
      }, user?.fullName?.charAt(0).toUpperCase() || 'С'),
      React.createElement(Typography, {
        variant: "h6",
        sx: { fontWeight: 600, mb: 0.5 }
      }, user?.fullName || 'Сотрудник'),
      React.createElement(Typography, {
        variant: "body2",
        color: "text.secondary",
        sx: { mb: 1 }
      }, user?.position || 'Специалист'),
      React.createElement(Chip, {
        label: `Отдел: ${user?.department || 'Обслуживание'}`,
        size: "small",
        sx: {
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          fontSize: '0.75rem',
        }
      })
    ),

    React.createElement(Divider),

    // Меню навигации
    React.createElement(List, { sx: { p: 2 } },
      employeeMenuItems.map((section) => [
        React.createElement(Typography, {
          key: `section-${section.section}`,
          variant: "caption",
          sx: {
            color: 'text.secondary',
            fontWeight: 600,
            display: 'block',
            mt: 2,
            mb: 1,
            pl: 2,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
          }
        }, section.section),
        ...section.items.map((item) =>
          React.createElement(ListItem, {
            key: item.path,
            button: true,
            onClick: () => navigate(item.path),
            sx: {
              mb: 0.5,
              borderRadius: 2,
              px: 2,
              bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: location.pathname === item.path ? 'primary.main' : 'action.hover',
              },
            }
          },
            React.createElement(ListItemIcon, {
              sx: {
                color: location.pathname === item.path ? 'white' : 'text.secondary',
                minWidth: 40
              }
            },
              item.badge ?
                React.createElement(Badge, {
                  badgeContent: item.badge,
                  color: "error",
                  sx: { '& .MuiBadge-badge': { fontSize: '0.6rem', height: 18, minWidth: 18 } }
                }, item.icon)
                : item.icon
            ),
            React.createElement(ListItemText, {
              primary: item.label,
              primaryTypographyProps: {
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: '0.9rem'
              }
            })
          )
        )
      ])
    ),

    React.createElement(Divider, { sx: { my: 2 } }),

    // Быстрые действия
    React.createElement(Box, { sx: { p: 3 } },
      React.createElement(Typography, {
        variant: "subtitle2",
        color: "text.secondary",
        sx: { mb: 2, fontWeight: 600 }
      }, 'Быстрые действия'),
      React.createElement(List, { sx: { p: 0 } },
        quickActions.map((action, index) =>
          React.createElement(ListItem, {
            key: index,
            button: true,
            onClick: () => navigate(action.path),
            sx: {
              mb: 1,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
              },
            }
          },
            React.createElement(ListItemIcon, { sx: { color: 'primary.main', minWidth: 40 } }, action.icon),
            React.createElement(ListItemText, {
              primary: action.label,
              primaryTypographyProps: { fontSize: '0.9rem', fontWeight: 500 }
            })
          )
        )
      )
    ),

    // Статистика за день
    React.createElement(Box, {
      sx: {
        p: 3,
        mt: 'auto',
        bgcolor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0'
      }
    },
      React.createElement(Typography, {
        variant: "subtitle2",
        color: "text.secondary",
        sx: { mb: 2, fontWeight: 600 }
      }, 'Статистика за сегодня'),
      React.createElement(Box, {
        sx: { display: 'flex', flexDirection: 'column', gap: 1.5 }
      },
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          React.createElement(Typography, { variant: "caption" }, 'Обработано операций'),
          React.createElement(Chip, {
            label: "24",
            size: "small",
            sx: { fontWeight: 600, bgcolor: 'success.light', color: 'success.dark' }
          })
        ),
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          React.createElement(Typography, { variant: "caption" }, 'Новых клиентов'),
          React.createElement(Chip, {
            label: "3",
            size: "small",
            sx: { fontWeight: 600, bgcolor: 'primary.light', color: 'primary.dark' }
          })
        ),
        React.createElement(Box, {
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          React.createElement(Typography, { variant: "caption" }, 'Общая сумма операций'),
          React.createElement(Typography, {
            variant: "caption",
            sx: { fontWeight: 700, color: 'success.main' }
          }, '2 450 000 ₽')
        )
      )
    )
  );
};

export default EmployeeSidebar;
