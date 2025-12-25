// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';

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
    // Мок: добавляем нового пользователя
    const newUser = {
      id: mockUsers.length + 1,
      login,
      password,
      full_name: fullName,
      role: 'client',
      email
    };
    mockUsers.push(newUser); // Мутируем mock для демонстрации
    setSuccess('Регистрация успешна! Теперь войдите.');
    setError('');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '450px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Регистрация клиента</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ФИО</Form.Label>
              <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Подтвердите пароль</Form.Label>
              <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100">Зарегистрироваться</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage;