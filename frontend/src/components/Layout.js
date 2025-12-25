// src/components/Layout.js
import React from 'react';
import CustomNavbar from './Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <CustomNavbar /> {/* Хедер сам решает, показываться ли */}
      <Container className="mt-4 pb-5">
        {children}
      </Container>
    </>
  );
};

export default Layout;