import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Chip, Button, Stack } from '@mui/material';
import { CreditCard, Add, VisibilityOff, Block, ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Cards = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          Банковские карты, {user?.fullName?.split(' ')[0] || user?.login || ''}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Управление кредитными и дебетовыми картами
        </Typography>
      </Box>
    </Container>
  );
};

export default Cards;