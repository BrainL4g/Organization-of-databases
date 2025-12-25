import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { AccountBalanceWallet, Add } from '@mui/icons-material';

const mockAccounts = [
  { id: 1, number: '40817810000000012345', type: 'Расчётный', currency: 'RUB', balance: 398500, blocked: false },
  { id: 2, number: '40817810800000054321', type: 'Сберегательный', currency: 'RUB', balance: 850000, blocked: false },
  { id: 3, number: '40817840900000098765', type: 'Валютный', currency: 'USD', balance: 5200, blocked: true },
];

const Accounts = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Мои счета
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Открыть новый счёт
        </Button>
      </Box>

      <Grid container spacing={4}>
        {mockAccounts.map((account) => (
          <Grid item xs={12} md={6} lg={4} key={account.id}>
            <Card sx={{ borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ bgcolor: account.blocked ? 'error.light' : 'primary.light', color: 'white', p: 3 }}>
                <Typography variant="h6">{account.type} счёт</Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {account.number.replace(/(.{4})/g, '$1 ')}
                </Typography>
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {account.currency === 'RUB'
                    ? account.balance.toLocaleString('ru-RU') + ' ₽'
                    : '$' + account.balance.toLocaleString('en-US')}
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={<AccountBalanceWallet />}
                    label={account.currency}
                    size="small"
                  />
                  {account.blocked && (
                    <Chip label="Заблокирован" color="error" size="small" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Accounts;