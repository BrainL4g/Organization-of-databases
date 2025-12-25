import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { People, AccountBalanceWallet, ReceiptLong, Assessment, Add } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  return React.createElement(Container, { maxWidth: "xl", sx: { py: 4 } },
    React.createElement(Box, { sx: { mb: 5 } },
      React.createElement(Typography, {
        variant: "h3",
        sx: { fontWeight: 700, color: 'primary.main', mb: 0.5 }
      }, `Рабочая панель, ${user?.fullName?.split(' ')[0] || user?.login || ''}`),
      React.createElement(Typography, {
        variant: "h6",
        color: "text.secondary"
      }, 'Обзор рабочей статистики и активных задач')
    )
  );
};

export default EmployeeDashboard;
