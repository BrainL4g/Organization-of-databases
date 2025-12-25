// src/components/Layout.js
import React from 'react';
import CustomNavbar from './Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  // Убрали useAuth и useEffect — загрузка теперь в AuthProvider
  return (
    <>
      <CustomNavbar />
      <Container fluid="lg" className="py-4">
        {children}
      </Container>
    </>
  );
};

export default Layout;