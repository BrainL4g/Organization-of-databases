import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return React.createElement(Box, {
    sx: { 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#f5f7fa' 
    }
  },
    React.createElement(AdminHeader),
    React.createElement(AdminSidebar),
    React.createElement(Box, { 
      sx: { 
        flexGrow: 1, 
        pt: 10, 
        pl: { xs: 0, md: 35 },
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

export default AdminLayout;
