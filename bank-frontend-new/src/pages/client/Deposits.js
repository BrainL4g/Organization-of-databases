import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { Add, TrendingUp, History, Receipt } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Deposits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const mockDeposits = [
    {
      id: 1,
      name: 'Накопительный+',
      amount: 500000,
      rate: 8.5,
      term: 12,
      status: 'ACTIVE',
      startDate: '15.01.2025',
      endDate: '15.01.2026',
      currency: 'RUB',
      accrued: 35416,
      contract: 'Д-2025-001'
    },
    {
      id: 2,
      name: 'Срочный Премиум',
      amount: 300000,
      rate: 9.0,
      term: 6,
      status: 'ACTIVE',
      startDate: '01.03.2025',
      endDate: '01.09.2025',
      currency: 'RUB',
      accrued: 13500,
      contract: 'Д-2025-002'
    },
    {
      id: 3,
      name: 'Пенсионный',
      amount: 50000,
      rate: 7.2,
      term: 36,
      status: 'CLOSED',
      startDate: '10.10.2022',
      endDate: '10.10.2025',
      currency: 'RUB',
      accrued: 10800,
      contract: 'Д-2022-045'
    },
    {
      id: 4,
      name: 'Валютный Депозит',
      amount: 10000,
      rate: 3.5,
      term: 24,
      status: 'ACTIVE',
      startDate: '05.05.2024',
      endDate: '05.05.2026',
      currency: 'USD',
      accrued: 350,
      contract: 'Д-2024-078'
    },
  ];

  const availableProducts = [
    { name: 'Накопительный', rate: 8.0, term: 12, min: 50000, features: ['Капитализация', 'Досрочное снятие'] },
    { name: 'Премиум Вклад', rate: 9.5, term: 24, min: 300000, features: ['Повышенная ставка', 'Страхование'] },
    { name: 'Срочный+', rate: 7.5, term: 6, min: 10000, features: ['Гибкие условия', 'Онлайн управление'] },
  ];

  const calculateProgress = (deposit) => {
    const start = new Date(deposit.startDate.split('.').reverse().join('-'));
    const end = new Date(deposit.endDate.split('.').reverse().join('-'));
    const now = new Date();
    const total = end - start;
    const passed = now - start;
    return Math.min(Math.max((passed / total) * 100, 0), 100);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'CLOSED': return 'default';
      case 'PENDING': return 'warning';
      default: return 'error';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ACTIVE': return 'Активен';
      case 'CLOSED': return 'Закрыт';
      case 'PENDING': return 'Ожидание';
      default: return 'Проблема';
    }
  };

  return React.createElement(Container, { maxWidth: "xl", sx: { py: 4 } },
    // Заголовок
    React.createElement(Box, { sx: { mb: 5 } },
      React.createElement(Typography, {
        variant: "h3",
        sx: { fontWeight: 700, color: 'primary.main', mb: 0.5 }
      }, `Мои депозиты, ${user?.fullName?.split(' ')[0] || user?.login || ''}`),
      React.createElement(Typography, {
        variant: "h6",
        color: "text.secondary"
      }, 'Управление вкладами и накоплениями')
    ),

    // Панель действий
    React.createElement(Box, {
      sx: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }
    },
      React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 } },
        React.createElement(Button, {
          variant: "outlined",
          startIcon: React.createElement(History),
          size: "small"
        }, 'История операций'),
        React.createElement(Button, {
          variant: "outlined",
          startIcon: React.createElement(Receipt),
          size: "small"
        }, 'Выписки')
      ),
      React.createElement(Button, {
        variant: "contained",
        startIcon: React.createElement(Add),
        sx: {
          bgcolor: 'primary.main',
          color: 'white',
          fontWeight: 700,
          px: 4,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        },
        onClick: () => navigate('/deposits/new')
      }, 'Открыть новый депозит')
    ),

    // Карточки депозитов
    React.createElement(Grid, { container: true, spacing: 3, sx: { mb: 4 } },
      mockDeposits.map((deposit) => (
        React.createElement(Grid, { item: true, xs: 12, md: 6, lg: 4, key: deposit.id },
          React.createElement(Card, {
            sx: {
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              },
            }
          },
            React.createElement(CardContent, { sx: { p: 3 } },
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 } },
                React.createElement(Typography, { variant: "h6", sx: { fontWeight: 700 } }, deposit.name),
                React.createElement(Chip, {
                  label: getStatusText(deposit.status),
                  size: "small",
                  color: getStatusColor(deposit.status),
                  sx: { fontWeight: 600 }
                })
              ),
              React.createElement(Box, { sx: { mb: 3 } },
                React.createElement(Typography, { variant: "h4", sx: { fontWeight: 700, color: 'primary.main' } },
                  deposit.currency === 'RUB'
                    ? `${deposit.amount.toLocaleString('ru-RU')} ₽`
                    : `$${deposit.amount.toLocaleString('en-US')}`
                ),
                React.createElement(Typography, { variant: "body2", color: "text.secondary" },
                  `Доход: ${deposit.accrued.toLocaleString('ru-RU')} ${deposit.currency === 'RUB' ? '₽' : '$'}`
                )
              ),
              React.createElement(Box, { sx: { mb: 2 } },
                React.createElement(Typography, { variant: "caption", color: "text.secondary", sx: { display: 'block', mb: 0.5 } }, 'Срок депозита'),
                React.createElement(LinearProgress, {
                  variant: "determinate",
                  value: calculateProgress(deposit),
                  sx: {
                    height: 8,
                    borderRadius: 4,
                    mb: 1
                  }
                }),
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, deposit.startDate),
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, deposit.endDate)
                )
              ),
              React.createElement(Stack, { spacing: 1, sx: { mb: 3 } },
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Ставка'),
                  React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, `${deposit.rate}%`)
                ),
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Срок'),
                  React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, `${deposit.term} мес.`)
                ),
                React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Договор'),
                  React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, deposit.contract)
                )
              ),
              React.createElement(Button, {
                variant: "outlined",
                fullWidth: true,
                size: "small"
              }, 'Детали')
            )
          )
        )
      ))
    ),

    // Таблица депозитов
    React.createElement(Card, { sx: { mb: 4 } },
      React.createElement(CardContent, { sx: { p: 0 } },
        React.createElement(Box, { sx: { p: 3, borderBottom: '1px solid', borderColor: 'divider' } },
          React.createElement(Typography, { variant: "h5", sx: { fontWeight: 600 } }, 'Детальная информация по депозитам')
        ),
        React.createElement(TableContainer, { component: Paper },
          React.createElement(Table, {},
            React.createElement(TableHead, {},
              React.createElement(TableRow, {},
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Название'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Сумма'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Ставка'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Срок'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Начислено'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Статус'),
                React.createElement(TableCell, { sx: { fontWeight: 700 } }, 'Действия')
              )
            ),
            React.createElement(TableBody, {},
              mockDeposits.map((deposit) => (
                React.createElement(TableRow, {
                  key: deposit.id,
                  sx: {
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }
                },
                  React.createElement(TableCell, { sx: { fontWeight: 600 } }, deposit.name),
                  React.createElement(TableCell, { sx: { fontWeight: 700 } },
                    deposit.currency === 'RUB'
                      ? `${deposit.amount.toLocaleString('ru-RU')} ₽`
                      : `$${deposit.amount.toLocaleString('en-US')}`
                  ),
                  React.createElement(TableCell, { sx: { fontWeight: 600, color: 'success.main' } }, `${deposit.rate}%`),
                  React.createElement(TableCell, {}, `${deposit.term} мес.`),
                  React.createElement(TableCell, { sx: { fontWeight: 600 } },
                    deposit.currency === 'RUB'
                      ? `${deposit.accrued.toLocaleString('ru-RU')} ₽`
                      : `$${deposit.accrued.toLocaleString('en-US')}`
                  ),
                  React.createElement(TableCell, {},
                    React.createElement(Chip, {
                      label: getStatusText(deposit.status),
                      size: "small",
                      color: getStatusColor(deposit.status)
                    })
                  ),
                  React.createElement(TableCell, {},
                    React.createElement(Stack, { direction: "row", spacing: 1 },
                      React.createElement(Button, {
                        variant: "outlined",
                        size: "small",
                        startIcon: React.createElement(TrendingUp)
                      }, 'Пополнить'),
                      React.createElement(Button, {
                        variant: "outlined",
                        size: "small",
                        color: "error"
                      }, 'Закрыть')
                    )
                  )
                )
              ))
            )
          )
        )
      )
    ),

    // Доступные продукты
    React.createElement(Box, { sx: { mb: 4 } },
      React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, mb: 3 } }, 'Доступные вклады'),
      React.createElement(Grid, { container: true, spacing: 3 },
        availableProducts.map((product, index) => (
          React.createElement(Grid, { item: true, xs: 12, md: 4, key: index },
            React.createElement(Card, {
              sx: {
                height: '100%',
                border: '2px solid',
                borderColor: 'primary.light',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }
            },
              React.createElement(CardContent, { sx: { p: 3 } },
                React.createElement(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 } }, product.name),
                React.createElement(Box, { sx: { display: 'flex', alignItems: 'baseline', mb: 2 } },
                  React.createElement(Typography, { variant: "h3", sx: { fontWeight: 700, color: 'success.main', mr: 1 } },
                    `${product.rate}%`
                  ),
                  React.createElement(Typography, { color: "text.secondary" }, 'годовых')
                ),
                React.createElement(Stack, { spacing: 1, sx: { mb: 3 } },
                  React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Срок'),
                    React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, `${product.term} мес.`)
                  ),
                  React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Мин. сумма'),
                    React.createElement(Typography, { variant: "caption", sx: { fontWeight: 600 } }, `${product.min.toLocaleString('ru-RU')} ₽`)
                  )
                ),
                React.createElement(Box, { sx: { mb: 3 } },
                  product.features.map((feature, idx) => (
                    React.createElement(Chip, {
                      key: idx,
                      label: feature,
                      size: "small",
                      sx: { mr: 1, mb: 1, bgcolor: 'primary.light', color: 'primary.main' }
                    })
                  ))
                ),
                React.createElement(Button, {
                  variant: "contained",
                  fullWidth: true,
                  startIcon: React.createElement(Add)
                }, 'Открыть вклад')
              )
            )
          )
        ))
      )
    ),

    // Статистика
    React.createElement(Grid, { container: true, spacing: 3 },
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, {},
          React.createElement(CardContent, { sx: { textAlign: 'center' } },
            React.createElement(Typography, { variant: "h6", color: "text.secondary", sx: { mb: 1 } }, 'Всего депозитов'),
            React.createElement(Typography, { variant: "h3", sx: { fontWeight: 700, color: 'primary.main' } },
              mockDeposits.length
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, {},
          React.createElement(CardContent, { sx: { textAlign: 'center' } },
            React.createElement(Typography, { variant: "h6", color: "text.secondary", sx: { mb: 1 } }, 'Общая сумма'),
            React.createElement(Typography, { variant: "h3", sx: { fontWeight: 700, color: 'success.main' } },
              `${mockDeposits.reduce((sum, dep) => sum + (dep.currency === 'USD' ? dep.amount * 75 : dep.amount), 0).toLocaleString('ru-RU')} ₽`
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, {},
          React.createElement(CardContent, { sx: { textAlign: 'center' } },
            React.createElement(Typography, { variant: "h6", color: "text.secondary", sx: { mb: 1 } }, 'Средняя ставка'),
            React.createElement(Typography, { variant: "h3", sx: { fontWeight: 700, color: 'warning.main' } },
              `${(mockDeposits.reduce((sum, dep) => sum + dep.rate, 0) / mockDeposits.length).toFixed(2)}%`
            )
          )
        )
      )
    )
  );
};

export default Deposits;