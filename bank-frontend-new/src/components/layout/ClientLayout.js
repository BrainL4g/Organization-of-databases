import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';

const ClientLayout = () => {
  return React.createElement(Box, {
    sx: { 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: 'background.default' 
    }
  },
    React.createElement(ClientHeader),
    React.createElement(ClientSidebar),
    React.createElement(Box, {
      sx: { 
        flexGrow: 1, 
        pt: 8, 
        pl: { xs: 0, md: 35 },
        transition: 'all 0.3s ease'
      }
    },
      React.createElement(Container, {
        maxWidth: "xl",
        sx: { 
          p: 3,
          maxWidth: '1400px !important'
        }
      },
        React.createElement(Outlet)
      )
    )
  );
};

export default ClientLayout;
