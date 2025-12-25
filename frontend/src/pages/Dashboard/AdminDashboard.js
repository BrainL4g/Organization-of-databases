// src/pages/Dashboard/AdminDashboard.js
import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { mockUsers, saveData } from '../../data/mockData';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ full_name: '', email: '', login: '', password: '' });
  const [message, setMessage] = useState({ text: '', variant: '' });

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 6000);
  };

  const handleRegisterChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newEmployee.full_name || !newEmployee.email || !newEmployee.login || !newEmployee.password) {
      showMessage('Заполните все поля', 'danger');
      return;
    }
    if (mockUsers.some(u => u.login === newEmployee.login || u.email === newEmployee.email)) {
      showMessage('Логин или email уже занят', 'danger');
      return;
    }

    const newUser = {
      id: mockUsers.length + 1,
      full_name: newEmployee.full_name,
      email: newEmployee.email,
      login: newEmployee.login,
      password: newEmployee.password,
      role: 'employee'
    };

    mockUsers.push(newUser);
    saveData();
    showMessage(`Сотрудник ${newEmployee.full_name} успешно зарегистрирован`);
    setNewEmployee({ full_name: '', email: '', login: '', password: '' });
    setShowRegisterModal(false);
  };

  const handleBlockToggle = (user) => {
    user.is_blocked = !user.is_blocked ?? true; // Добавляем поле, если его нет
    saveData();
    showMessage(`Учётная запись ${user.full_name} ${user.is_blocked ? 'заблокирована' : 'разблокирована'}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Удалить пользователя ${user.full_name}? Это действие необратимо.`)) {
      const index = mockUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        saveData();
        showMessage(`Пользователь ${user.full_name} успешно удалён из системы`);
      }
    }
  };

  // Фильтруем админа из списка
  const users = mockUsers.filter(u => u.role !== 'admin');

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">Административная панель</h2>

      {message.text && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
          {message.text}
        </Alert>
      )}

      <div className="text-center mb-5">
        <Button variant="success" size="lg" onClick={() => setShowRegisterModal(true)}>
          Зарегистрировать нового сотрудника
        </Button>
      </div>

      <h4 className="mb-4">Управление пользователями системы</h4>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Роль</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">Пользователей нет</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td className="text-center">{user.id}</td>
                <td>{user.full_name}</td>
                <td className="text-center">
                  <Badge bg={user.role === 'employee' ? 'info' : 'secondary'}>
                    {user.role === 'employee' ? 'Сотрудник' : 'Клиент'}
                  </Badge>
                </td>
                <td>{user.email}</td>
                <td className="text-center">
                  <Badge bg={user.is_blocked ? 'danger' : 'success'}>
                    {user.is_blocked ? 'Заблокирован' : 'Активен'}
                  </Badge>
                </td>
                <td className="text-center">
                  <Button variant="warning" size="sm" className="me-2">
                    Редактировать
                  </Button>
                  <Button
                    variant={user.is_blocked ? 'success' : 'secondary'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleBlockToggle(user)}
                  >
                    {user.is_blocked ? 'Разблокировать' : 'Блокировать'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="mt-5 text-center">
        <Link to="/products">
          <Button variant="outline-primary" size="lg" className="me-4">
            Управление банковскими продуктами
          </Button>
        </Link>
        <Link to="/clients">
          <Button variant="outline-primary" size="lg">
            Справочники
          </Button>
        </Link>
      </div>

      {/* Модалка регистрации сотрудника */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Регистрация нового сотрудника</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRegisterSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ФИО</Form.Label>
              <Form.Control name="full_name" value={newEmployee.full_name} onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newEmployee.email} onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control name="login" value={newEmployee.login} onChange={handleRegisterChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" name="password" value={newEmployee.password} onChange={handleRegisterChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
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