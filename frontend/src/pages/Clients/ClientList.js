// src/pages/Clients/ClientList.js
import React, { useState } from 'react';
import { Table, Form, Container, Row, Col, Card, Button, Modal, Badge } from 'react-bootstrap';
import { mockClients, mockUsers, saveData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

const ClientList = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const [search, setSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = mockClients.filter(client =>
    client.full_name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.login.toLowerCase().includes(search.toLowerCase()) ||
    (client.phone && client.phone.includes(search))
  );

  const handleEdit = (client) => {
    setEditingClient({ ...client });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Обновляем в mockClients
    const indexC = mockClients.findIndex(c => c.id_client === editingClient.id_client);
    if (indexC !== -1) mockClients[indexC] = editingClient;

    // Обновляем в mockUsers (если есть)
    const user = mockUsers.find(u => u.login === editingClient.login);
    if (user) {
      user.full_name = editingClient.full_name;
      user.email = editingClient.email;
    }

    saveData();
    setShowEditModal(false);
    alert('Данные клиента обновлены');
  };

  const handleToggleBlockUser = (client) => {
    const user = mockUsers.find(u => u.login === client.login);
    if (user) {
      user.is_blocked = !user.is_blocked;
      saveData();
      alert(`Пользователь ${client.full_name} ${user.is_blocked ? 'заблокирован' : 'разблокирован'}`);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={11}>
            <Card className="shadow-2xl border-0">
              <div className="p-4 text-white text-center rounded-top" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h2 className="fw-bold mb-0">Справочник клиентов и сотрудников</h2>
              </div>

              <Card.Body className="p-5">
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Поиск по ФИО, логину, email или телефону..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      size="lg"
                    />
                  </Col>
                </Row>

                <Table striped bordered hover responsive className="shadow-sm">
                  <thead className="table-primary">
                    <tr>
                      <th>ID</th>
                      <th>ФИО</th>
                      <th>Логин</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Роль</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr><td colSpan="8" className="text-center py-4">Клиенты не найдены</td></tr>
                    ) : (
                      filteredClients.map(client => {
                        const user = mockUsers.find(u => u.login === client.login);
                        const role = user?.role === 'admin' ? 'Администратор' : user?.role === 'employee' ? 'Сотрудник' : 'Клиент';
                        const blocked = user?.is_blocked;

                        return (
                          <tr key={client.id_client}>
                            <td>{client.id_client}</td>
                            <td>{client.full_name}</td>
                            <td>{client.login}</td>
                            <td>{client.email}</td>
                            <td>{client.phone || 'Не указан'}</td>
                            <td>{role}</td>
                            <td>
                              <Badge bg={blocked ? 'danger' : 'success'}>
                                {blocked ? 'Заблокирован' : 'Активен'}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(client)}>
                                Редактировать
                              </Button>
                              {isAdmin && user?.role !== 'admin' && (
                                <Button
                                  variant={blocked ? 'success' : 'danger'}
                                  size="sm"
                                  onClick={() => handleToggleBlockUser(client)}
                                >
                                  {blocked ? 'Разблок.' : 'Заблок.'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Модалка редактирования */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>Редактирование данных</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingClient && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ФИО</Form.Label>
                <Form.Control
                  value={editingClient.full_name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, full_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingClient.email || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  value={editingClient.phone || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientList;