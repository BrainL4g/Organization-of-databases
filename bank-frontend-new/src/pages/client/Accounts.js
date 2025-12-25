import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Visibility,
  Edit,
  Block,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Search,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Accounts = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const mockAccounts = [
    { 
      id: 1, 
      number: '40817810000000012345', 
      type: 'Расчётный', 
      currency: 'RUB', 
      balance: 398500, 
      blocked: false,
      openingDate: '15.01.2023',
      interestRate: 0.5,
      lastTransaction: '22.12.2025'
    },
    { 
      id: 2, 
      number: '40817810800000054321', 
      type: 'Сберегательный', 
      currency: 'RUB', 
      balance: 850000, 
      blocked: false,
      openingDate: '03.03.2024',
      interestRate: 8.5,
      lastTransaction: '21.12.2025'
    },
    { 
      id: 3, 
      number: '40817840900000098765', 
      type: 'Валютный', 
      currency: 'USD', 
      balance: 5200, 
      blocked: true,
      openingDate: '10.10.2024',
      interestRate: 1.2,
      lastTransaction: '10.12.2025'
    },
    { 
      id: 4, 
      number: '40817878900000045678', 
      type: 'Кредитный', 
      currency: 'RUB', 
      balance: -150000, 
      blocked: false,
      openingDate: '05.05.2025',
      interestRate: 12.9,
      lastTransaction: '20.12.2025'
    },
  ];

  const accountTypes = [
    { value: 'all', label: 'Все счета' },
    { value: 'current', label: 'Расчётные' },
    { value: 'savings', label: 'Сберегательные' },
    { value: 'credit', label: 'Кредитные' },
    { value: 'currency', label: 'Валютные' },
  ];

  const filteredAccounts = filter === 'all' 
    ? mockAccounts 
    : mockAccounts.filter(acc => {
        if (filter === 'current') return acc.type === 'Расчётный';
        if (filter === 'savings') return acc.type === 'Сберегательный';
        if (filter === 'credit') return acc.type === 'Кредитный';
        if (filter === 'currency') return acc.type === 'Валютный';
        return true;
      });

  const formatAccountNumber = (number) => {
    return `${number.slice(0, 4)} ${number.slice(4, 8)} **** ${number.slice(-4)}`;
  };

  const getAccountColor = (type) => {
    switch(type) {
      case 'Расчётный': return 'primary';
      case 'Сберегательный': return 'success';
      case 'Кредитный': return 'error';
      case 'Валютный': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          Мои счета, {user?.fullName?.split(' ')[0] || user?.login || ''}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Управление всеми банковскими счетами
        </Typography>
      </Box>

      {/* Панель управления */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {accountTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            size="small"
          >
            Фильтры
          </Button>
          <Button
            variant="outlined"
            startIcon={<Search />}
            size="small"
          >
            Поиск
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 700,
            px: 4,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Открыть новый счёт
        </Button>
      </Box>

      {/* Карточки счетов */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredAccounts.map((account) => (
          <Grid item xs={12} md={6} lg={3} key={account.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ 
                bgcolor: account.blocked ? 'error.main' : `${getAccountColor(account.type)}.main`,
                color: 'white', 
                p: 2.5,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{`${account.type} счёт`}</Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px'
                }}>
                  {formatAccountNumber(account.number)}
                </Typography>
                {account.blocked && (
                  <Chip
                    label="ЗАБЛОКИРОВАН"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'white',
                      color: 'error.main',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ pt: 3 }}>
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: account.balance < 0 ? 'error.main' : 'text.primary'
                  }}
                >
                  {account.currency === 'RUB' 
                    ? `${account.balance.toLocaleString('ru-RU')} ₽`
                    : `$${account.balance.toLocaleString('en-US')}`}
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Ставка</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{`${account.interestRate}%`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Открыт</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{account.openingDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Последняя операция</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{account.lastTransaction}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'primary.light', color: 'primary.main' }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'success.light', color: 'success.main' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: account.blocked ? 'success.light' : 'error.light', color: account.blocked ? 'success.main' : 'error.main' }}
                  >
                    <Block />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Детальная таблица */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Детальная информация по счетам</Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Номер счёта</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Тип</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Валюта</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Баланс</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ставка</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow
                    key={account.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 600 
                    }}>
                      {formatAccountNumber(account.number)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={account.type}
                        size="small"
                        sx={{ 
                          bgcolor: `${getAccountColor(account.type)}.light`,
                          color: `${getAccountColor(account.type)}.main`,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<AccountBalanceWallet />}
                        label={account.currency}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700,
                      color: account.balance < 0 ? 'error.main' : 'success.main'
                    }}>
                      {account.currency === 'RUB' 
                        ? `${account.balance.toLocaleString('ru-RU')} ₽`
                        : `$${account.balance.toLocaleString('en-US')}`}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{`${account.interestRate}%`}</TableCell>
                    <TableCell>
                      {account.blocked ? (
                        <Chip label="Заблокирован" color="error" size="small" />
                      ) : (
                        <Chip label="Активен" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ArrowUpward />}
                        >
                          Пополнить
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ArrowDownward />}
                        >
                          Снять
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Общая статистика */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Всего счетов</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>{filteredAccounts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Общий баланс</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                {`${filteredAccounts.reduce((sum, acc) => sum + (acc.currency === 'USD' ? acc.balance * 75 : acc.balance), 0).toLocaleString('ru-RU')} ₽`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Средняя ставка</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {`${(filteredAccounts.reduce((sum, acc) => sum + acc.interestRate, 0) / filteredAccounts.length).toFixed(2)}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Accounts;