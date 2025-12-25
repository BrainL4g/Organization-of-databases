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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  InputBase,
  alpha,
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  Notifications,
  Search,
  Dashboard,
  People,
  ReceiptLong,
  Assessment,
  Settings,
  Help,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployeeHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const stats = [
    { label: 'Обработано сегодня', value: '24', unit: 'оп.' },
    { label: 'Новых клиентов', value: '3', unit: 'чел.' },
    { label: 'Сумма операций', value: '2.45', unit: 'млн ₽' },
  ];

  const notifications = [
    { id: 1, text: 'Новая заявка на кредит', time: '5 мин назад', priority: 'high' },
    { id: 2, text: 'Клиент запросил выписку', time: '1 час назад', priority: 'medium' },
    { id: 3, text: 'Истекает срок верификации', time: '2 часа назад', priority: 'high' },
    { id: 4, text: 'Обновление регламента', time: '1 день назад', priority: 'low' },
  ];

  return React.createElement(AppBar, {
    position: "fixed",
    sx: { 
      zIndex: 1300,
      bgcolor: '#0d47a1',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      borderBottom: '3px solid',
      borderColor: '#1565c0',
    }
  },
    React.createElement(Toolbar, { sx: { py: 1.5 } },
      React.createElement(Container, {
        maxWidth: "xl",
        sx: { 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2 
        }
      },
        // Логотип с текущей датой
        React.createElement(Box, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 },
          },
          onClick: () => navigate('/employee/dashboard')
        },
          React.createElement(Box, {
            sx: {
              bgcolor: 'white',
              color: 'primary.main',
              p: 1,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
            }
          },
            React.createElement(Typography, { variant: "caption", sx: { fontWeight: 700 } }, '23'),
            React.createElement(Typography, { variant: "caption", sx: { fontSize: '0.6rem' } }, 'ДЕК')
          ),
          React.createElement(Box, null,
            React.createElement(Typography, {
              variant: "h6",
              sx: {
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                fontSize: { xs: '1rem', md: '1.3rem' },
              }
            }, 'БАНКОВСКАЯ СИСТЕМА'),
            React.createElement(Typography, {
              variant: "caption",
              sx: {
                color: 'rgba(255,255,255,0.9)',
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
              }
            }, 'Профессиональная панель сотрудника')
          )
        ),

        // Статистика за день
        React.createElement(Stack, {
          direction: "row",
          spacing: 3,
          sx: { 
            display: { xs: 'none', lg: 'flex' },
            ml: 4,
          }
        },
          stats.map((stat, index) =>
            React.createElement(Box, {
              key: index,
              sx: {
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                p: 1.5,
                minWidth: 100,
                backdropFilter: 'blur(10px)',
              }
            },
              React.createElement(Typography, {
                variant: "h5",
                sx: { 
                  fontWeight: 800, 
                  color: 'white',
                  lineHeight: 1 
                }
              }, `${stat.value}`),
              React.createElement(Typography, {
                variant: "caption",
                sx: { 
                  color: 'rgba(255,255,255,0.8)',
                  display: 'block',
                  mt: 0.5
                }
              }, stat.label)
            )
          )
        ),

        React.createElement(Box, { sx: { flexGrow: 1 } }),

        // Поиск
        React.createElement(Box, {
          sx: {
            display: { xs: 'none', xl: 'flex' },
            position: 'relative',
            mr: 2,
          }
        },
          React.createElement(Box, {
            sx: {
              padding: '8px 12px',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }
          },
            React.createElement(Search, { sx: { color: 'rgba(255,255,255,0.7)', fontSize: 20 } })
          ),
          React.createElement(InputBase, {
            placeholder: "Поиск клиента, счета...",
            sx: {
              color: 'white',
              width: 200,
              pl: 5,
              pr: 2,
              py: 1,
              fontSize: '0.9rem',
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              },
            }
          })
        ),

        // Время и дата
        React.createElement(Box, {
          sx: {
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            color: 'white',
            mr: 2,
          }
        },
          React.createElement(AccessTime, { sx: { fontSize: 20 } }),
          React.createElement(Typography, { variant: "body2", sx: { fontWeight: 600 } }, '15:42'),
          React.createElement(CalendarToday, { sx: { fontSize: 20, ml: 1 } }),
          React.createElement(Typography, { variant: "body2", sx: { fontWeight: 600 } }, '23.12.2025')
        ),

        // Уведомления
        React.createElement(IconButton, {
          onClick: handleNotificationsOpen,
          sx: {
            color: 'white',
            position: 'relative'
          }
        },
          React.createElement(Badge, {
            badgeContent: notifications.filter(n => n.priority === 'high').length,
            color: "error",
            sx: {
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                height: 18,
                minWidth: 18,
              }
            }
          }, React.createElement(Notifications)),
          React.createElement(Menu, {
            anchorEl: notificationsAnchor,
            open: Boolean(notificationsAnchor),
            onClose: handleNotificationsClose,
            PaperProps: {
              sx: {
                mt: 1.5,
                width: 350,
                maxHeight: 400,
              }
            }
          },
            React.createElement(Box, { sx: { p: 2 } },
              React.createElement(Typography, {
                variant: "h6",
                sx: { fontWeight: 700, mb: 2, color: 'primary.main' }
              }, 'Рабочие уведомления'),
              notifications.map((notification) =>
                React.createElement(MenuItem, {
                  key: notification.id,
                  sx: {
                    mb: 1,
                    borderRadius: 2,
                    borderLeft: `4px solid ${
                      notification.priority === 'high' ? '#d32f2f' :
                      notification.priority === 'medium' ? '#ff9800' : '#4caf50'
                    }`,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }
                },
                  React.createElement(Box, { sx: { flexGrow: 1 } },
                    React.createElement(Typography, {
                      variant: "body2",
                      sx: { fontWeight: 600 }
                    }, notification.text),
                    React.createElement(Typography, {
                      variant: "caption",
                      color: "text.secondary",
                      sx: { display: 'block', mt: 0.5 }
                    }, notification.time)
                  ),
                  React.createElement(Chip, {
                    label: notification.priority === 'high' ? 'Срочно' :
                           notification.priority === 'medium' ? 'Важно' : 'Инфо',
                    size: "small",
                    sx: {
                      bgcolor: notification.priority === 'high' ? '#d32f2f' :
                              notification.priority === 'medium' ? '#ff9800' : '#4caf50',
                      color: 'white',
                      fontSize: '0.6rem',
                      height: 18,
                      fontWeight: 700
                    }
                  })
                )
              )
            )
          )
        ),

        // Профиль сотрудника
        React.createElement(Box, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            p: 1,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          },
          onClick: handleProfileMenuOpen
        },
          React.createElement(Avatar, {
            sx: {
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              width: 42,
              height: 42,
              border: '2px solid',
              borderColor: 'rgba(255,255,255,0.3)',
            }
          }, user?.fullName?.charAt(0).toUpperCase() || 'С'),

          React.createElement(Box, { sx: { textAlign: 'left' } },
            React.createElement(Typography, {
              variant: "subtitle2",
              sx: {
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2
              }
            }, user?.fullName?.split(' ')[0] || 'Сотрудник'),
            React.createElement(Typography, {
              variant: "caption",
              sx: {
                color: 'rgba(255,255,255,0.9)',
                display: 'block'
              }
            }, user?.position || 'Специалист')
          ),

          React.createElement(Menu, {
            anchorEl: anchorEl,
            open: Boolean(anchorEl),
            onClose: handleProfileMenuClose,
            PaperProps: {
              sx: {
                mt: 1.5,
                width: 250,
              }
            }
          },
            React.createElement(MenuItem, { onClick: () => navigate('/employee/dashboard') },
              React.createElement(ListItemIcon, {}, React.createElement(Dashboard, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Рабочая панель" })
            ),
            React.createElement(MenuItem, { onClick: () => navigate('/employee/clients') },
              React.createElement(ListItemIcon, {}, React.createElement(People, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Управление клиентами" })
            ),
            React.createElement(MenuItem, { onClick: () => navigate('/employee/reports') },
              React.createElement(ListItemIcon, {}, React.createElement(Assessment, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Отчёты" })
            ),
            React.createElement(MenuItem, { onClick: () => navigate('#') },
              React.createElement(ListItemIcon, {}, React.createElement(Settings, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Настройки" })
            ),
            React.createElement(MenuItem, { onClick: () => navigate('#') },
              React.createElement(ListItemIcon, {}, React.createElement(Help, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Помощь" })
            ),
            React.createElement(MenuItem, {
              onClick: handleLogout,
              sx: {
                color: 'error.main',
                borderTop: '1px solid',
                borderColor: 'divider',
                mt: 1
              }
            },
              React.createElement(ListItemIcon, { sx: { color: 'error.main' } }, React.createElement(Logout, { fontSize: "small" })),
              React.createElement(ListItemText, { primary: "Выйти из системы" })
            )
          )
        )
      )
    )
  );
};

export default EmployeeHeader;
