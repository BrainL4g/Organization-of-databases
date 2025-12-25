import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  CreditCard,
  Savings,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

const mockTransactions = [
  { id: 1, description: 'Перевод на счёт №1234', amount: -50000, date: '23.12.2025', type: 'out' },
  { id: 2, description: 'Начисление процентов по депозиту', amount: 12500, date: '22.12.2025', type: 'in' },
  { id: 3, description: 'Пополнение с карты', amount: 100000, date: '20.12.2025', type: 'in' },
  { id: 4, description: 'Оплата услуг', amount: -8500, date: '19.12.2025', type: 'out' },
];

const Dashboard = () => {
  const totalBalance = 1248500;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Добро пожаловать в личный кабинет!
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 5 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Общий баланс по всем счетам
              </Typography>
              <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>
                {totalBalance.toLocaleString('ru-RU')} ₽
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="body2">+12.5% за месяц</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Savings sx={{ verticalAlign: 'middle', mr: 1 }} />
                Активные депозиты
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                3
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                На сумму 850 000 ₽
              </Typography>
              <LinearProgress variant="determinate" value={68} sx={{ mt: 3, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" sx={{ mt: 1 }}>Ожидаемая доходность: +48 750 ₽</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CreditCard sx={{ verticalAlign: 'middle', mr: 1 }} />
                Доступно к снятию
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                398 500 ₽
              </Typography>
              <Chip label="Готово к использованию" color="success" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        Последние операции
      </Typography>
      <Card>
        <CardContent>
          <List>
            {mockTransactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: tx.type === 'in' ? 'success.main' : 'error.main' }}>
                      {tx.type === 'in' ? <ArrowDownward /> : <ArrowUpward />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={tx.description}
                    secondary={tx.date}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: tx.type === 'in' ? 'success.main' : 'error.main',
                    }}
                  >
                    {tx.type === 'in' ? '+' : '-'}
                    {Math.abs(tx.amount).toLocaleString('ru-RU')} ₽
                  </Typography>
                </ListItem>
                {index < mockTransactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;