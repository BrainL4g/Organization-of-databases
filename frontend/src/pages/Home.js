// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>Добро пожаловать в Автоматизированную банковскую систему!</h1>
          <p className="lead mt-4">
            Это современная платформа для управления банковскими услугами: счета, транзакции, депозиты и многое другое.
          </p>
          <div className="mt-5">
            <Link to="/login">
              <Button variant="primary" size="lg" className="me-3">Войти</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline-primary" size="lg">Зарегистрироваться</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;