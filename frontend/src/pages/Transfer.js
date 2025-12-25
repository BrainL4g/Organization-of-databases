import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  Alert,
} from '@mui/material';
import { SwapHoriz } from '@mui/icons-material';

const mockAccounts = [
  { id: 1, number: '40817...2345', balance: 398500 },
  { id: 2, number: '40817...4321', balance: 850000 },
];

const Transfer = () => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromAccount && toAccount && amount > 0) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setAmount('');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        Перевод между своими счетами
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Перевод на сумму {amount} ₽ успешно выполнен!
        </Alert>
      )}

      <Paper sx={{ p: 5, borderRadius: 5 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Со счёта"
            fullWidth
            margin="normal"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
          >
            {mockAccounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.number} — {acc.balance.toLocaleString('ru-RU')} ₽
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <SwapHoriz sx={{ fontSize: 40, color: 'primary.main', mx: 2 }} />
          </Box>

          <TextField
            select
            label="На счёт"
            fullWidth
            margin="normal"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          >
            {mockAccounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.number} — {acc.balance.toLocaleString('ru-RU')} ₽
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Сумма перевода"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{ inputProps: { min: 1 } }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 4, py: 2, fontSize: '1.2rem' }}
          >
            Перевести деньги
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Transfer;