// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authLogin(login, password)) {
      navigate('/dashboard');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '450px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Вход в систему</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control value={login} onChange={e => setLogin(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100 mb-3">Войти</Button>
          </Form>

          <Alert variant="light" className="mb-0">
            <strong>Для демонстрации используйте:</strong><br />
            • Клиент: <code>client1</code> / <code>123</code><br />
            • Сотрудник: <code>emp1</code> / <code>123</code><br />
            • Администратор: <code>admin</code> / <code>admin</code>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;