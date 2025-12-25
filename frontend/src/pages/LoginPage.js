// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockUsers, saveData } from '../data/mockData';
import CryptoJS from 'crypto-js'; // Для хэширования нового пароля при сбросе

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authLogin(login, password)) {
      navigate('/dashboard');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleForgotPassword = () => {
    const userLogin = prompt('Введите ваш логин для восстановления пароля:');
    if (!userLogin) return;

    const user = mockUsers.find(u => u.login === userLogin);
    if (!user) {
      alert('Пользователь с таким логином не найден.');
      return;
    }

    // Мок-сброс: устанавливаем простой пароль "123"
    const newPassword = '1234';
    user.password = CryptoJS.SHA256(newPassword).toString();
    saveData();

    alert(`Пароль успешно сброшен!\nНовый пароль: ${newPassword}\nТеперь вы можете войти.`);
  };

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
          <Col lg={6} md={8} sm={10}>
            <Card className="shadow-2xl border-0 overflow-hidden">
              {/* Градиентная шапка */}
              <div
                className="p-4 text-white text-center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <h2 className="fw-bold mb-0">Вход в систему</h2>
              </div>

              <Card.Body className="p-5">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Логин</Form.Label>
                    <Form.Control
                      type="text"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="Введите логин"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Пароль</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" size="lg" className="w-100 py-3 shadow mb-3">
                    Войти
                  </Button>
                </Form>

                {/* Кнопка восстановления пароля */}
                <div className="text-center">
                  <Button variant="link" className="text-muted" onClick={handleForgotPassword}>
                    Забыли пароль?
                  </Button>
                </div>

                <Alert variant="light" className="mt-4 text-center border">
                  <strong>Для демонстрации:</strong><br />
                  <small>
                    • Клиент: <code>client1</code> / <code>123</code><br />
                    • Клиент: <code>client2</code> / <code>123</code><br />
                    • Сотрудник: <code>emp1</code> / <code>123</code><br />
                    • Администратор: <code>admin</code> / <code>admin</code>
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;