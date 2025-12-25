import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const mockDeposits = [
  { id: 1, name: 'Накопительный+', amount: 500000, rate: 8.5, term: 12, status: 'ACTIVE' },
  { id: 2, name: 'Срочный', amount: 300000, rate: 9.0, term: 6, status: 'ACTIVE' },
  { id: 3, name: 'Пенсионный', amount: 50000, rate: 7.2, term: 36, status: 'CLOSED' },
];

const Deposits = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Мои депозиты
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Открыть депозит
        </Button>
      </Box>

      <Grid container spacing={4}>
        {mockDeposits.map((deposit) => (
          <Grid item xs={12} md={6} key={deposit.id}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {deposit.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Срок: {deposit.term} месяцев
                    </Typography>
                  </Box>
                  <Chip
                    label={deposit.status === 'ACTIVE' ? 'Активен' : 'Закрыт'}
                    color={deposit.status === 'ACTIVE' ? 'success' : 'default'}
                  />
                </Box>

                <Typography variant="h4" sx={{ mt: 3, fontWeight: 700 }}>
                  {deposit.amount.toLocaleString('ru-RU')} ₽
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2">Ставка</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {deposit.rate}% годовых
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={(12 / deposit.term) * 100}
                  sx={{ mt: 3, height: 10, borderRadius: 5 }}
                />

                <Typography variant="caption" sx={{ mt: 1 }}>
                  Ожидаемый доход: +{(deposit.amount * deposit.rate / 100).toFixed(0)} ₽
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Deposits;