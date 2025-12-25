// src/pages/Dashboard/AdminDashboard.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Alert,
  Table,
  Badge,
} from 'react-bootstrap';
import { mockUsers, saveData } from '../../data/mockData';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    login: '',
    password: '',
  });
  const [message, setMessage] = useState({ text: '', variant: '' });

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 6000);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const { full_name, email, login, password } = newEmployee;

    if (!full_name || !email || !login || !password) {
      showMessage('Заполните все поля', 'danger');
      return;
    }

    if (mockUsers.some((u) => u.login === login || u.email === email)) {
      showMessage('Логин или email уже занят', 'danger');
      return;
    }

    const newUser = {
      id: mockUsers.length + 1,
      full_name,
      email,
      login,
      password, // В реальном проекте пароль хэшируется!
      role: 'employee',
      is_blocked: false,
    };

    mockUsers.push(newUser);
    saveData();
    showMessage(`Сотрудник ${full_name} успешно зарегистрирован`);
    setNewEmployee({ full_name: '', email: '', login: '', password: '' });
    setShowRegisterModal(false);
  };

  const handleBlockToggle = (user) => {
    user.is_blocked = !user.is_blocked;
    saveData();
    showMessage(
      `Учётная запись ${user.full_name} ${user.is_blocked ? 'заблокирована' : 'разблокирована'}`,
      user.is_blocked ? 'warning' : 'success'
    );
  };

  const handleDelete = (user) => {
    if (window.confirm(`Удалить пользователя ${user.full_name}? Это действие необратимо!`)) {
      const index = mockUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        saveData();
        showMessage(`Пользователь ${user.full_name} удалён из системы`, 'info');
      }
    }
  };

  // Все пользователи кроме администратора
  const users = mockUsers.filter((u) => u.role !== 'admin');

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">
        Административная панель
      </h2>

      {message.text && (
        <Alert
          variant={message.variant}
          dismissible
          onClose={() => setMessage({ text: '', variant: '' })}
        >
          {message.text}
        </Alert>
      )}

      <div className="text-center mb-5">
        <Button
          variant="success"
          size="lg"
          className="me-4 px-5 py-3 shadow"
          onClick={() => setShowRegisterModal(true)}
        >
          Зарегистрировать сотрудника
        </Button>
      </div>

      <h3 className="mb-4 text-secondary">Управление пользователями системы</h3>

      {users.length === 0 ? (
        <Alert variant="info">Пользователи отсутствуют</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'employee' ? 'info' : 'secondary'}>
                    {user.role === 'employee' ? 'Сотрудник' : 'Клиент'}
                  </Badge>
                </td>
                <td>
                  <Badge bg={user.is_blocked ? 'danger' : 'success'}>
                    {user.is_blocked ? 'Заблокирован' : 'Активен'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant={user.is_blocked ? 'success' : 'warning'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleBlockToggle(user)}
                  >
                    {user.is_blocked ? 'Разблокировать' : 'Блокировать'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-5 text-center">
        <Link to="/products">
          <Button variant="outline-primary" size="lg" className="me-4 px-5">
            Управление банковскими продуктами
          </Button>
        </Link>
        <Link to="/clients">
          <Button variant="outline-primary" size="lg" className="px-5">
            Справочник клиентов
          </Button>
        </Link>
      </div>

      {/* Модальное окно регистрации нового сотрудника */}
      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Регистрация нового сотрудника</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRegisterSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ФИО</Form.Label>
              <Form.Control
                name="full_name"
                value={newEmployee.full_name}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                name="login"
                value={newEmployee.login}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newEmployee.password}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRegisterModal(false)}
            >
              Отмена
            </Button>
            <Button variant="success" type="submit">
              Зарегистрировать
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;