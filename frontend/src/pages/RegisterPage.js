// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockClients, saveData } from '../data/mockData';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !login || !password || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (mockUsers.some(u => u.login === login || u.email === email)) {
      setError('Логин или email уже занят');
      return;
    }

    // Добавляем в mockUsers для логина
    const newUser = {
      id: mockUsers.length + 1,
      login,
      password,
      full_name: fullName,
      role: 'client',
      email
    };
    mockUsers.push(newUser);

    // Добавляем в mockClients для справочника сотрудника
    const newClient = {
      id_client: mockClients.length + 1,
      login,
      full_name: fullName,
      email,
      created_at: new Date().toISOString().split('T')[0]
    };
    mockClients.push(newClient);

    saveData(); // Сохраняем оба массива

    setSuccess('Регистрация успешна! Теперь войдите в систему.');
    setError('');
    setTimeout(() => navigate('/login'), 2000);
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
          <Col lg={7} md={9}>
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div
                className="p-4 text-white text-center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <h2 className="fw-bold mb-0">Регистрация нового клиента</h2>
              </div>

              <Card.Body className="p-5">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>ФИО</Form.Label>
                    <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required size="lg" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required size="lg" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} required size="lg" />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required size="lg" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Подтвердите пароль</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required size="lg" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="success" type="submit" size="lg" className="w-100 py-3 shadow">
                    Зарегистрироваться
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;