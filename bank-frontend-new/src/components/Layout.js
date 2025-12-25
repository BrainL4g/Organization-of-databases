import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './layout/Header';

const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box sx={{ pt: 12 }}>
        <Container maxWidth="xl" sx={{ pb: 8 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;