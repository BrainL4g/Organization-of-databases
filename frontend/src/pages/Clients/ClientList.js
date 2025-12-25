// src/pages/Clients/ClientList.js
import React, { useState } from 'react';
import { Table, Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { mockClients } from '../../data/mockData';

const ClientList = () => {
  const [search, setSearch] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.full_name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.login.toLowerCase().includes(search.toLowerCase()) ||
    (client.phone && client.phone.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-2xl border-0">
              <div
                className="p-4 text-white text-center rounded-top"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <h2 className="fw-bold mb-0">Справочник клиентов</h2>
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
                      <th>Телефон</th> {/* ← Исправлено: комментарий в фигурных скобках */}
                      <th>Дата регистрации</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">Клиенты не найдены</td>
                      </tr>
                    ) : (
                      filteredClients.map(client => (
                        <tr key={client.id_client}>
                          <td>{client.id_client}</td>
                          <td>{client.full_name}</td>
                          <td>{client.login}</td>
                          <td>{client.email}</td>
                          <td>{client.phone || 'Не указан'}</td> {/* ← Исправлено */}
                          <td>{new Date(client.created_at).toLocaleDateString('ru-RU')}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2">
                              Просмотр
                            </Button>
                            <Button variant="warning" size="sm">
                              Редактировать
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientList;