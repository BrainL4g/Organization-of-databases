import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const UsersManagement = () => {
  const { user } = useAuth();

  return React.createElement(Container, { maxWidth: "xl", sx: { py: 4 } },
    React.createElement(Box, { sx: { mb: 5 } },
      React.createElement(Typography, {
        variant: "h3",
        sx: { fontWeight: 700, color: 'primary.main', mb: 0.5 }
      }, `Управление пользователями, ${user?.fullName?.split(' ')[0] || user?.login || ''}`),
      React.createElement(Typography, {
        variant: "h6",
        color: "text.secondary"
      }, 'Управление пользователями системы')
    )
  );
};

export default UsersManagement;
