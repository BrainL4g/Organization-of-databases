import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import EmployeeHeader from './EmployeeHeader';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeLayout = () => {
  return React.createElement(Box, {
    sx: {
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f8fbff'
    }
  },
    React.createElement(EmployeeHeader),
    React.createElement(EmployeeSidebar),
    React.createElement(Box, {
      sx: {
        flexGrow: 1,
        pt: 10,
        pl: { xs: 0, md: 32 },
        transition: 'all 0.3s ease'
      }
    },
      React.createElement(Container, {
        maxWidth: "xl",
        sx: { p: 3 }
      },
        React.createElement(Outlet)
      )
    )
  );
};

export default EmployeeLayout;
