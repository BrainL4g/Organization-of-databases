// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockClients, saveData } from '../data/mockData';
import CryptoJS from 'crypto-js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    phone: '',
    passport: '',
    email: '',
    login: '',
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const required = ['fullName', 'birthDate', 'address', 'phone', 'passport', 'email', 'login', 'password', 'confirmPassword'];
    for (let field of required) {
      if (!formData[field]) {
        setError('Заполните все поля');
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (mockUsers.some(u => u.login === formData.login || u.email === formData.email)) {
      setError('Логин или email уже занят');
      return;
    }

    const newUserId = mockUsers.length + 1;
    const newClientId = mockClients.length + 1;

    // Добавляем в mockUsers
    const newUser = {
      id: newUserId,
      login: formData.login,
      password: CryptoJS.SHA256(formData.password).toString(), // хэшируем, как в AuthContext
      full_name: formData.fullName,
      role: 'client',
      email: formData.email
    };
    mockUsers.push(newUser);

    // Расширенные данные клиента в mockClients
    const newClient = {
      id_client: newClientId,
      login: formData.login,
      full_name: formData.fullName,
      email: formData.email,
      birth_date: formData.birthDate,
      address: formData.address,
      phone: formData.phone,
      passport: formData.passport,
      created_at: new Date().toISOString().split('T')[0]
    };
    mockClients.push(newClient);

    saveData();
    setSuccess('Регистрация успешна! Теперь войдите в систему.');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-2xl border-0">
              <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h2 className="fw-bold">Регистрация нового клиента</h2>
              </div>
              <Card.Body className="p-5">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>ФИО</Form.Label>
                        <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Дата рождения</Form.Label>
                        <Form.Control type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Адрес проживания</Form.Label>
                    <Form.Control name="address" value={formData.address} onChange={handleChange} required />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (999) 999-99-99" required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Паспорт (серия и номер)</Form.Label>
                        <Form.Control name="passport" value={formData.passport} onChange={handleChange} placeholder="0000 000000" required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control name="login" value={formData.login} onChange={handleChange} required />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Подтвердите пароль</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
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