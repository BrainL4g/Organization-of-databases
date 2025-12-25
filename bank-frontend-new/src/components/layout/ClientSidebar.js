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
  Button,
  Stack,
} from '@mui/material';
import {
  Dashboard,
  AccountBalanceWallet,
  Savings,
  CreditCard,
  Receipt,
  CompareArrows,
  Person,
  History,
  RequestQuote,
  AccountTree,
  Notifications,
  Help,
  Security,
  Assessment,
  ContactSupport,
  CardGiftcard,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 300;

const ClientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const clientMenuItems = [
    {
      section: 'Финансы',
      items: [
        {
          path: '/dashboard',
          label: 'Финансовая панель',
          icon: React.createElement(Dashboard),
          description: 'Обзор всех счетов'
        },
        {
          path: '/accounts',
          label: 'Мои счета',
          icon: React.createElement(AccountBalanceWallet),
          description: 'Управление счетами',
          badge: 3
        },
        {
          path: '/deposits',
          label: 'Вклады и инвестиции',
          icon: React.createElement(Savings),
          description: 'Депозиты, ПИФы, ИИС'
        },
        {
          path: '/cards',
          label: 'Банковские карты',
          icon: React.createElement(CreditCard),
          description: 'Кредитные и дебетовые',
          badge: 2
        },
        {
          path: '/loans',
          label: 'Кредиты и займы',
          icon: React.createElement(Receipt),
          description: 'Ипотека, автокредиты'
        },
      ]
    },
    {
      section: 'Операции',
      items: [
        {
          path: '/transfer',
          label: 'Переводы и платежи',
          icon: React.createElement(CompareArrows),
          description: 'Межбанк, по реквизитам'
        },
        {
          path: '/transactions',
          label: 'История операций',
          icon: React.createElement(History),
          description: 'Все транзакции'
        },
        {
          path: '#',
          label: 'Шаблоны платежей',
          icon: React.createElement(AccountTree),
          description: 'Автоматические платежи'
        },
        {
          path: '#',
          label: 'Валютные операции',
          icon: React.createElement(RequestQuote),
          description: 'Обмен валюты'
        },
      ]
    },
    {
      section: 'Документы и отчёты',
      items: [
        {
          path: '#',
          label: 'Выписки и отчёты',
          icon: React.createElement(Assessment),
          description: 'Финансовые отчёты'
        },
        {
          path: '#',
          label: 'Налоговая отчётность',
          icon: React.createElement(Receipt),
          description: 'НДФЛ, справки'
        },
      ]
    },
    {
      section: 'Сервисы',
      items: [
        {
          path: '/profile',
          label: 'Настройки профиля',
          icon: React.createElement(Person),
          description: 'Личные данные'
        },
        {
          path: '#',
          label: 'Безопасность',
          icon: React.createElement(Security),
          description: 'Пароли, 2FA'
        },
        {
          path: '#',
          label: 'Уведомления',
          icon: React.createElement(Notifications),
          description: 'Настройка оповещений',
          badge: 5
        },
        {
          path: '#',
          label: 'Поддержка',
          icon: React.createElement(ContactSupport),
          description: 'Помощь и чат'
        },
      ]
    },
  ];

  const quickServices = [
    { label: 'Открыть депозит', rate: 'до 12%', color: 'success' },
    { label: 'Оформить кредит', rate: 'от 5.9%', color: 'primary' },
    { label: 'Заказать карту', rate: 'премиум', color: 'secondary' },
    { label: 'Инвестиции', rate: 'ПИФы', color: 'warning' },
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
        boxShadow: '4px 0 30px rgba(0,0,0,0.08)',
        bgcolor: 'background.paper',
        pt: 8,
        overflowX: 'hidden',
      },
    },
  },
    // Профиль клиента с расширенной информацией
    React.createElement(Box, {
      sx: {
        p: 3,
        bgcolor: 'primary.dark',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }
      }
    },
      React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mb: 3 } },
        React.createElement(Avatar, {
          sx: {
            width: 70,
            height: 70,
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '2rem',
            fontWeight: 'bold',
            mr: 2,
            border: '3px solid rgba(255,255,255,0.3)',
          }
        }, user?.fullName?.charAt(0).toUpperCase() || 'К'),
        React.createElement(Box, null,
          React.createElement(Typography, {
            variant: "h6",
            sx: { fontWeight: 700, mb: 0.5 }
          }, user?.fullName || 'Клиент'),
          React.createElement(Chip, {
            label: "ПРЕМИУМ КЛИЕНТ",
            size: "small",
            sx: {
              bgcolor: '#ff9800',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }
          })
        )
      ),
      React.createElement(Stack, { spacing: 1.5 },
        React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
          React.createElement(Typography, { variant: "caption", sx: { opacity: 0.9 } }, 'Клиентский ID'),
          React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, `#${user?.id?.toString().padStart(6, '0') || '000001'}`)
        ),
        React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
          React.createElement(Typography, { variant: "caption", sx: { opacity: 0.9 } }, 'Статус'),
          React.createElement(Chip, {
            label: "Верифицирован",
            size: "small",
            sx: {
              bgcolor: '#4caf50',
              color: 'white',
              fontSize: '0.7rem',
              height: 20
            }
          })
        ),
        React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
          React.createElement(Typography, { variant: "caption", sx: { opacity: 0.9 } }, 'Общий баланс'),
          React.createElement(Typography, {
            variant: "h6",
            sx: {
              fontWeight: 700,
              background: 'linear-gradient(90deg, #ffffff 0%, #bbdefb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
          }, '1 248 500 ₽')
        )
      )
    ),

    React.createElement(Divider),

    // Банковские сервисы
    React.createElement(Box, { sx: { p: 3 } },
      React.createElement(Typography, {
        variant: "subtitle1",
        sx: {
          fontWeight: 700,
          mb: 2,
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }
      }, React.createElement(CardGiftcard, { fontSize: "small" }), 'Банковские сервисы'),
      React.createElement(Stack, { spacing: 1.5 },
        quickServices.map((service, index) =>
          React.createElement(Button, {
            key: index,
            variant: "outlined",
            fullWidth: true,
            onClick: () => navigate('#'),
            sx: {
              justifyContent: 'space-between',
              py: 1.5,
              borderRadius: 2,
              borderColor: `${service.color}.main`,
              color: `${service.color}.main`,
              '&:hover': {
                bgcolor: `${service.color}.light`,
                borderColor: `${service.color}.dark`,
              },
            }
          },
            React.createElement(Typography, { variant: "body2", sx: { fontWeight: 600 } }, service.label),
            React.createElement(Chip, {
              label: service.rate,
              size: "small",
              sx: {
                bgcolor: `${service.color}.main`,
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700
              }
            })
          )
        )
      )
    ),

    React.createElement(Divider),

    // Основное меню навигации
    React.createElement(Box, {
      sx: {
        flexGrow: 1,
        overflowY: 'auto',
        height: 'calc(100vh - 500px)',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: '#f5f5f5' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 3 },
      }
    },
      clientMenuItems.map((section, sectionIndex) =>
        React.createElement(Box, {
          key: sectionIndex,
          sx: { p: 2 }
        },
          React.createElement(Typography, {
            variant: "overline",
            sx: {
              color: 'text.secondary',
              fontWeight: 700,
              display: 'block',
              mb: 1.5,
              px: 1,
              fontSize: '0.75rem',
              letterSpacing: '1px',
            }
          }, section.section),
          React.createElement(List, { sx: { p: 0 } },
            section.items.map((item) =>
              React.createElement(ListItem, {
                key: item.path,
                button: true,
                onClick: () => navigate(item.path),
                sx: {
                  mb: 1,
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                  color: location.pathname === item.path ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? 'primary.main' : 'action.hover',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease',
                  },
                  transition: 'all 0.2s ease',
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
                      sx: {
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          height: 18,
                          minWidth: 18,
                          top: -5,
                          right: -5
                        }
                      }
                    }, item.icon)
                    : item.icon
                ),
                React.createElement(Box, { sx: { flexGrow: 1 } },
                  React.createElement(ListItemText, {
                    primary: item.label,
                    secondary: item.description,
                    primaryTypographyProps: {
                      fontWeight: location.pathname === item.path ? 700 : 600,
                      fontSize: '0.95rem'
                    },
                    secondaryTypographyProps: {
                      variant: "caption",
                      color: location.pathname === item.path ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                      fontSize: '0.8rem'
                    }
                  })
                )
              )
            )
          )
        )
      )
    ),

    // Служба поддержки
    React.createElement(Box, {
      sx: {
        p: 3,
        bgcolor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0'
      }
    },
      React.createElement(Button, {
        variant: "contained",
        fullWidth: true,
        startIcon: React.createElement(Help),
        onClick: () => navigate('#'),
        sx: {
          bgcolor: 'primary.main',
          color: 'white',
          py: 1.5,
          borderRadius: 3,
          fontWeight: 700,
          mb: 2,
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(13, 71, 161, 0.3)',
          },
          transition: 'all 0.3s ease',
        }
      }, 'Служба поддержки 24/7'),
      React.createElement(Typography, {
        variant: "caption",
        color: "text.secondary",
        sx: {
          display: 'block',
          textAlign: 'center',
          fontSize: '0.75rem'
        }
      }, 'Телефон: 8 (800) 555-35-35')
    )
  );
};

export default ClientSidebar;
