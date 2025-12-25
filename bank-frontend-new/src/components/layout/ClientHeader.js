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
  IconButton,
  Badge,
  InputBase,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  Notifications,
  Search,
  Settings,
  AccountBalanceWallet,
  CreditCard,
  Receipt,
  Help,
  DarkMode,
  LightMode,
  Language,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const ClientHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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

  const quickActions = [
    { icon: React.createElement(AccountBalanceWallet), label: 'Открыть счёт', path: '#' },
    { icon: React.createElement(CreditCard), label: 'Заказать карту', path: '#' },
    { icon: React.createElement(Receipt), label: 'Оформить кредит', path: '#' },
    { icon: React.createElement(PersonAdd), label: 'Пригласить друга', path: '#' },
  ];

  const notifications = [
    { id: 1, text: 'Начислены проценты по депозиту', time: '10 мин назад', read: false },
    { id: 2, text: 'Кредитная карта одобрена', time: '2 часа назад', read: false },
    { id: 3, text: 'Завершена верификация', time: 'Вчера', read: true },
    { id: 4, text: 'Обновление тарифов', time: '2 дня назад', read: true },
  ];

  return React.createElement(AppBar, {
    position: "fixed",
    sx: {
      zIndex: 1300,
      bgcolor: 'background.paper',
      color: 'text.primary',
      boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
      borderBottom: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(10px)',
    }
  },
    React.createElement(Toolbar, { sx: { py: 1 } },
      React.createElement(Container, {
        maxWidth: "xl",
        sx: {
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }
      },
        // Логотип банка
        React.createElement(Box, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 },
          },
          onClick: () => navigate('/dashboard')
        },
          React.createElement(AccountBalance, {
            sx: {
              fontSize: 40,
              color: 'primary.main',
              bgcolor: 'primary.light',
              p: 0.5,
              borderRadius: 2
            }
          }),
          React.createElement(Box, null,
            React.createElement(Typography, {
              variant: "h6",
              sx: {
                fontWeight: 800,
                color: 'primary.main',
                lineHeight: 1.2,
                fontSize: { xs: '1rem', md: '1.3rem' },
                background: 'linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }, 'ДИДЖИТАЛ БАНК'),
            React.createElement(Typography, {
              variant: "caption",
              sx: {
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
              }
            }, 'Персональный банкинг')
          )
        ),

        // Поиск
        React.createElement(Box, {
          sx: {
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            maxWidth: 400,
            ml: 4,
          }
        },
          React.createElement(Box, {
            sx: {
              position: 'relative',
              borderRadius: 3,
              bgcolor: alpha('#000', 0.03),
              '&:hover': {
                bgcolor: alpha('#000', 0.05),
              },
              width: '100%',
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
              }
            },
              React.createElement(Search, { sx: { color: 'text.secondary', fontSize: 20 } })
            ),
            React.createElement(InputBase, {
              placeholder: "Поиск услуг, операций...",
              sx: {
                color: 'inherit',
                width: '100%',
                pl: 5,
                pr: 2,
                py: 1,
                fontSize: '0.9rem',
              }
            })
          )
        ),

        React.createElement(Box, { sx: { flexGrow: 1 } }),

        // Быстрые действия
        React.createElement(Stack, {
          direction: "row",
          spacing: 1,
          sx: {
            display: { xs: 'none', lg: 'flex' },
            mr: 2
          }
        },
          quickActions.map((action, index) =>
            React.createElement(Button, {
              key: index,
              variant: "outlined",
              size: "small",
              startIcon: action.icon,
              onClick: () => navigate(action.path),
              sx: {
                borderRadius: 3,
                borderColor: 'primary.light',
                color: 'primary.main',
                fontSize: '0.8rem',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                },
              }
            }, action.label)
          )
        ),

        // Кнопки управления
        React.createElement(Stack, {
          direction: "row",
          spacing: 1,
          alignItems: "center"
        },
          // Уведомления
          React.createElement(IconButton, {
            onClick: handleNotificationsOpen,
            sx: {
              color: 'text.secondary',
              position: 'relative'
            }
          },
            React.createElement(Badge, {
              badgeContent: notifications.filter(n => !n.read).length,
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
                  width: 320,
                  maxHeight: 400,
                }
              }
            },
              React.createElement(Box, { sx: { p: 2 } },
                React.createElement(Typography, {
                  variant: "h6",
                  sx: { fontWeight: 700, mb: 2 }
                }, 'Уведомления'),
                notifications.map((notification) =>
                  React.createElement(MenuItem, {
                    key: notification.id,
                    sx: {
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: notification.read ? 'transparent' : 'primary.light',
                      '&:hover': {
                        bgcolor: notification.read ? 'action.hover' : 'primary.main',
                        color: notification.read ? 'inherit' : 'white',
                      },
                    }
                  },
                    React.createElement(Box, { sx: { flexGrow: 1 } },
                      React.createElement(Typography, { variant: "body2" }, notification.text),
                      React.createElement(Typography, {
                        variant: "caption",
                        color: "text.secondary",
                        sx: { display: 'block', mt: 0.5 }
                      }, notification.time)
                    ),
                    !notification.read &&
                      React.createElement(Chip, {
                        label: "Новое",
                        size: "small",
                        sx: {
                          bgcolor: 'error.main',
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 18
                        }
                      })
                  )
                )
              )
            )
          ),

          // Настройки темы
          React.createElement(IconButton, {
            onClick: () => setDarkMode(!darkMode),
            sx: { color: 'text.secondary' }
          }, darkMode ? React.createElement(LightMode) : React.createElement(DarkMode)),

          // Язык
          React.createElement(IconButton, {
            sx: { color: 'text.secondary' }
          }, React.createElement(Language)),

          // Помощь
          React.createElement(IconButton, {
            onClick: () => navigate('#'),
            sx: { color: 'text.secondary' }
          }, React.createElement(Help)),

          // Профиль пользователя
          React.createElement(Box, {
            sx: {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              p: 1,
              borderRadius: 3,
              '&:hover': { bgcolor: 'action.hover' }
            },
            onClick: handleProfileMenuOpen
          },
            React.createElement(Box, { sx: { textAlign: 'right', display: { xs: 'none', md: 'block' } } },
              React.createElement(Typography, {
                variant: "subtitle2",
                sx: { fontWeight: 700, color: 'text.primary' }
              }, user?.fullName?.split(' ')[0] || 'Клиент'),
              React.createElement(Typography, {
                variant: "caption",
                sx: { color: 'text.secondary' }
              }, 'Клиентский статус: Премиум')
            ),

            React.createElement(Avatar, {
              sx: {
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                width: 40,
                height: 40,
                border: '2px solid',
                borderColor: 'primary.light',
              }
            }, user?.fullName?.charAt(0).toUpperCase() || 'К'),

            React.createElement(Menu, {
              anchorEl: anchorEl,
              open: Boolean(anchorEl),
              onClose: handleProfileMenuClose,
              PaperProps: {
                sx: {
                  mt: 1.5,
                  width: 220,
                }
              }
            },
              React.createElement(MenuItem, { onClick: () => navigate('/profile') },
                React.createElement(ListItemIcon, {}, React.createElement(Settings, { fontSize: "small" })),
                React.createElement(ListItemText, { primary: "Настройки профиля" })
              ),
              React.createElement(MenuItem, { onClick: () => navigate('/dashboard') },
                React.createElement(ListItemIcon, {}, React.createElement(AccountBalanceWallet, { fontSize: "small" })),
                React.createElement(ListItemText, { primary: "Финансовая панель" })
              ),
              React.createElement(MenuItem, { onClick: () => navigate('#') },
                React.createElement(ListItemIcon, {}, React.createElement(Help, { fontSize: "small" })),
                React.createElement(ListItemText, { primary: "Помощь и поддержка" })
              ),
              React.createElement(MenuItem, { onClick: handleLogout, sx: { color: 'error.main' } },
                React.createElement(ListItemIcon, { sx: { color: 'error.main' } }, React.createElement(Logout, { fontSize: "small" })),
                React.createElement(ListItemText, { primary: "Выйти" })
              )
            )
          ),

          // Кнопка выхода
          React.createElement(Button, {
            variant: "contained",
            onClick: handleLogout,
            size: "small",
            sx: {
              display: { xs: 'none', md: 'flex' },
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 700,
              px: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }
          }, 'Выйти')
        )
      )
    )
  );
};

export default ClientHeader;
