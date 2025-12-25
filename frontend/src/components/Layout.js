// src/components/Layout.js
import React, { useEffect } from 'react';
import CustomNavbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <CustomNavbar />
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;