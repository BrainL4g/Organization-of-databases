// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="text-center mt-5 pt-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-lg border-0 p-5">
            <Card.Body>
              <h1 className="display-4 mb-4 text-primary fw-bold">
                Добро пожаловать в Автоматизированную банковскую систему
              </h1>
              <p className="lead mb-5 text-muted">
                Современная платформа для управления счетами, переводами, кредитами, депозитами и другими банковскими услугами.
              </p>
              <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                <Link to="/login">
                  <Button variant="primary" size="lg" className="px-5">
                    Войти в систему
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-primary" size="lg" className="px-5">
                    Зарегистрироваться
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;