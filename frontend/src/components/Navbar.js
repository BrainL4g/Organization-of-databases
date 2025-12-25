// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Банковская система</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser ? (
              <>
                {currentUser.role === ROLES.CLIENT && (
                  <>
                    <Nav.Link as={Link} to="/client">Мой кабинет</Nav.Link>
                    <Nav.Link as={Link} to="/transactions">Операции</Nav.Link>
                    <Nav.Link as={Link} to="/products">Продукты</Nav.Link>
                  </>
                )}
                {currentUser.role === ROLES.EMPLOYEE && (
                  <>
                    <Nav.Link as={Link} to="/employee">Кабинет сотрудника</Nav.Link>
                    <Nav.Link as={Link} to="/clients">Клиенты</Nav.Link>
                    <Nav.Link as={Link} to="/accounts">Счета</Nav.Link>
                    <Nav.Link as={Link} to="/transactions">Транзакции</Nav.Link>
                  </>
                )}
                {currentUser.role === ROLES.ADMIN && (
                  <>
                    <Nav.Link as={Link} to="/admin">Админ-панель</Nav.Link>
                    <Nav.Link as={Link} to="/clients">Клиенты</Nav.Link>
                    <Nav.Link as={Link} to="/products">Продукты</Nav.Link>
                    <Nav.Link as={Link} to="/accounts">Счета</Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
          {currentUser && (
            <Nav>
              <Navbar.Text className="text-light me-3">
                {currentUser.full_name} ({currentUser.role})
              </Navbar.Text>
              <Nav.Link onClick={logout} style={{ color: 'white' }}>Выйти</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;