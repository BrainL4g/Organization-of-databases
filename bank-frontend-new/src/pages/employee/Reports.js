import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          Отчёты, {user?.fullName?.split(' ')[0] || user?.login || ''}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Финансовые отчёты и аналитика
        </Typography>
      </Box>
    </Container>
  );
};

export default Reports;