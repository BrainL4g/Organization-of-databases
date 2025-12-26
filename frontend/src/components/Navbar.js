// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>Банковская система</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
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
                <Nav.Link as={Link} to="/currency">Курсы валют</Nav.Link>
                <Nav.Link as={Link} to="/classifiers">Справочники</Nav.Link>
                <Nav.Link as={Link} to="/reports">Отчёты</Nav.Link>
                <Nav.Link as={Link} to="/logs">Логи операций</Nav.Link>  {/* Новая ссылка */}
              </>
            )}
          </Nav>

          <Nav>
            <Navbar.Text className="text-light me-4">
              {currentUser.full_name}
              <small className="text-light ms-2">
                ({currentUser.role === 'client' ? 'Клиент' : currentUser.role === 'employee' ? 'Сотрудник' : 'Администратор'})
              </small>
            </Navbar.Text>
            <Nav.Link onClick={logout} className="text-danger fw-bold">
              Выйти
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;