// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            <Card className="shadow-2xl border-0 overflow-hidden">
              {/* Градиентная шапка */}
              <div
                className="p-5 text-white text-center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <h1 className="display-4 fw-bold mb-3">
                  Автоматизированная банковская система
                </h1>
                <p className="lead fs-4 opacity-90">
                  Современное решение для управления финансами
                </p>
              </div>

              <Card.Body className="p-5">
                {/* Кнопки входа */}
                <div className="text-center mt-4">
                  <Link to="/login">
                    <Button
                      variant="primary"
                      size="lg"
                      className="px-5 py-3 me-4 shadow"
                      style={{ minWidth: '220px' }}
                    >
                      Войти в систему
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="px-5 py-3 shadow"
                      style={{ minWidth: '220px' }}
                    >
                      Регистрация клиента
                    </Button>
                  </Link>
                </div>

                <div className="text-center mt-5">
                  <small className="text-muted">
                    Курсовой проект • Шевченко Егор • ТУСУР • 2025
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;