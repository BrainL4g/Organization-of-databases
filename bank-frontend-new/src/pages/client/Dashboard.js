import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
  Stack,
  alpha,
  Button,
  Toolbar, // Добавляем Toolbar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Savings,
  CreditCard,
  ArrowUpward,
  ArrowDownward,
  AccountBalance,
  Add,
  History,
  Receipt,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Если Header и Footer находятся в той же директории, измените пути
import Header from './Header'; // или '../../components/Header'
import Footer from './Footer'; // или '../../components/Footer'

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Общий баланс',
      value: '1 248 500 ₽',
      change: '+12.5%',
      trend: 'up',
      icon: <AccountBalance sx={{ fontSize: 30 }} />,
      color: 'primary',
    },
    {
      title: 'Доступные средства',
      value: '398 500 ₽',
      change: '+5.2%',
      trend: 'up',
      icon: <CreditCard sx={{ fontSize: 30 }} />,
      color: 'success',
    },
    {
      title: 'В депозитах',
      value: '850 000 ₽',
      change: '+8.1%',
      trend: 'up',
      icon: <Savings sx={{ fontSize: 30 }} />,
      color: 'secondary',
    },
    {
      title: 'Месячный доход',
      value: '48 750 ₽',
      change: '+15.3%',
      trend: 'up',
      icon: <TrendingUp sx={{ fontSize: 30 }} />,
      color: 'warning',
    },
  ];

  const transactions = [
    {
      id: 1,
      description: 'Перевод на счёт №1234',
      amount: -50000,
      date: '23.12.2025',
      type: 'out',
      category: 'Перевод',
    },
    {
      id: 2,
      description: 'Начисление процентов по депозиту',
      amount: 12500,
      date: '22.12.2025',
      type: 'in',
      category: 'Проценты',
    },
    {
      id: 3,
      description: 'Пополнение с карты',
      amount: 100000,
      date: '20.12.2025',
      type: 'in',
      category: 'Пополнение',
    },
    {
      id: 4,
      description: 'Оплата коммунальных услуг',
      amount: -8500,
      date: '19.12.2025',
      type: 'out',
      category: 'Платежи',
    },
  ];

  const quickActions = [
    { label: 'Быстрый перевод', icon: <ArrowUpward />, path: '/transfer' },
    { label: 'Открыть депозит', icon: <Add />, path: '/deposits' },
    { label: 'История операций', icon: <History />, path: '/transactions' },
    { label: 'Выписка по счёту', icon: <Receipt />, path: '#' },
  ];

  // Если Header и Footer не найдены, создайте временные компоненты
  const TempHeader = () => (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
      <Typography variant="h6">Автоматизированная банковская система</Typography>
    </Box>
  );

  const TempFooter = () => (
    <Box sx={{ bgcolor: 'grey.100', p: 3, mt: 4 }}>
      <Typography variant="body2" align="center">
        © 2024 Банковская система
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Используем TempHeader если Header не найден */}
      {Header ? <Header /> : <TempHeader />}

      {/* Отступ для фиксированного хедера */}
      <Toolbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Заголовок страницы */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: 'primary.dark',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              background: 'linear-gradient(45deg, #0d47a1 0%, #1565c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Добро пожаловать, {user?.fullName || user?.login}!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 400,
              maxWidth: '800px',
              lineHeight: 1.6,
            }}
          >
            Обзор ваших финансов и последних операций. Здесь вы можете управлять счетами,
            отслеживать расходы и выполнять банковские операции.
          </Typography>
        </Box>

        {/* Быстрые действия */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: 'primary.light',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(13, 71, 161, 0.15)',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: 'primary.dark' }}
                  >
                    {action.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Быстрый доступ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Статистика */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(
                          stat.color === 'primary' ? '#0d47a1' :
                          stat.color === 'success' ? '#2e7d32' :
                          stat.color === 'secondary' ? '#43a047' : '#ff9800',
                          0.1
                        ),
                        color: stat.color === 'primary' ? '#0d47a1' :
                               stat.color === 'success' ? '#2e7d32' :
                               stat.color === 'secondary' ? '#43a047' : '#ff9800',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {stat.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: stat.trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {stat.change} за месяц
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Основной контент */}
        <Grid container spacing={4}>
          {/* Последние операции */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Последние операции
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Последние транзакции по вашим счетам
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {transactions.map((tx, index) => (
                    <React.Fragment key={tx.id}>
                      <ListItem
                        sx={{
                          px: 3,
                          py: 2.5,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: tx.type === 'in' ? alpha('#2e7d32', 0.1) : alpha('#d32f2f', 0.1),
                              color: tx.type === 'in' ? 'success.main' : 'error.main',
                            }}
                          >
                            {tx.type === 'in' ? <ArrowDownward /> : <ArrowUpward />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {tx.description}
                            </Typography>
                          }
                          secondary={
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                {tx.date}
                              </Typography>
                              <Chip
                                label={tx.category}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha('#0d47a1', 0.1),
                                  color: 'primary.dark',
                                  fontWeight: 500,
                                }}
                              />
                            </Stack>
                          }
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: tx.type === 'in' ? 'success.main' : 'error.main',
                          }}
                        >
                          {tx.type === 'in' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('ru-RU')} ₽
                        </Typography>
                      </ListItem>
                      {index < transactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    endIcon={<ArrowDownward />}
                    sx={{ fontWeight: 600 }}
                    onClick={() => navigate('/transactions')}
                  >
                    Показать все операции
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Финансовая активность */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.dark' }}>
                  Финансовая активность
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Ежемесячный лимит
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      75%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha('#0d47a1', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Цель накоплений
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      42%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha('#2e7d32', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'success.main',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Депозитная программа
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      68%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha('#43a047', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'secondary.main',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    boxShadow: '0 4px 12px rgba(13, 71, 161, 0.2)',
                  }}
                  onClick={() => navigate('/deposits')}
                >
                  Установить новые цели
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Используем TempFooter если Footer не найден */}
      {Footer ? <Footer /> : <TempFooter />}
    </Box>
  );
};

export default Dashboard;