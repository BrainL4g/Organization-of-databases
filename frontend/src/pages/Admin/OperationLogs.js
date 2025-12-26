// src/pages/Admin/OperationLogs.js
import React, { useState } from 'react';
import { Container, Card, Table, Form, Row, Col, Button } from 'react-bootstrap';
import { mockTransactions, mockAccounts } from '../../data/mockData';

const OperationLogs = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    type: '',
    clientId: '',
    description: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      type: '',
      clientId: '',
      description: ''
    });
  };

  // Умное определение типа операции (с защитой от старых/неправильных данных)
  const getOperationType = (t) => {
    // Сначала по описанию — переопределяем, если явно указано
    if (t.description) {
      if (t.description.includes('Снятие наличных') || t.description.includes('Снятие средств')) {
        return 'Снятие';
      }
      if (t.description.includes('Пополнение')) {
        return 'Пополнение';
      }
      if (t.description.includes('Перевод')) {
        return 'Перевод';
      }
    }

    // Основная логика по ID счетов
    if (t.sender_account_id === null && t.receiver_account_id !== null) {
      return 'Пополнение';
    }
    if (t.sender_account_id !== null && t.receiver_account_id === null) {
      return 'Снятие';
    }
    if (t.sender_account_id !== null && t.receiver_account_id !== null) {
      return 'Перевод';
    }
    return 'Неизвестно';
  };

  // Фильтрация
  const filteredLogs = mockTransactions.filter(t => {
    const itemDate = new Date(t.created_at);

    // Дата от
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    // Дата до (включая весь день)
    const to = filters.toDate ? new Date(filters.toDate) : null;
    const toAdjusted = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999) : null;

    const dateMatch = (!from || itemDate >= from) && (!toAdjusted || itemDate <= toAdjusted);

    // Клиент
    const clientAcc = mockAccounts.find(a =>
      a.id_account === t.sender_account_id || a.id_account === t.receiver_account_id
    );
    const clientId = clientAcc ? clientAcc.id_client : null;
    const clientMatch = !filters.clientId || (clientId && clientId === parseInt(filters.clientId));

    // Тип
    const type = getOperationType(t);
    const typeMatch = !filters.type || type === filters.type;

    // Описание
    const descMatch = !filters.description ||
      (t.description && t.description.toLowerCase().includes(filters.description.toLowerCase()));

    return dateMatch && clientMatch && typeMatch && descMatch;
  });

  // Сортировка: новые сверху
  const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white text-center">
          <h3>Логи операций</h3>
        </Card.Header>
        <Card.Body>
          <Form className="mb-4 p-3 bg-light rounded">
            <Row className="g-3 align-items-end">
              <Col md={2}>
                <Form.Label>Дата от</Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Дата до</Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Тип операции</Form.Label>
                <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">Все</option>
                  <option value="Пополнение">Пополнение</option>
                  <option value="Снятие">Снятие</option>
                  <option value="Перевод">Перевод</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>ID клиента</Form.Label>
                <Form.Control
                  type="number"
                  name="clientId"
                  value={filters.clientId}
                  onChange={handleFilterChange}
                  placeholder="Например: 1"
                />
              </Col>
              <Col md={2}>
                <Form.Label>Описание</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={filters.description}
                  onChange={handleFilterChange}
                  placeholder="Снятие наличных..."
                />
              </Col>
              <Col md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Button variant="outline-danger" onClick={handleReset} className="w-100">
                  Сбросить
                </Button>
              </Col>
            </Row>
          </Form>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Дата и время</th>
                <th>Тип операции</th>
                <th>Сумма</th>
                <th>Валюта</th>
                <th>Описание</th>
                <th>Счёт отправ.</th>
                <th>Счёт получ.</th>
                <th>Клиент ID</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Нет операций по заданным фильтрам
                  </td>
                </tr>
              ) : (
                sortedLogs.map(t => {
                  const clientAcc = mockAccounts.find(a =>
                    a.id_account === t.sender_account_id || a.id_account === t.receiver_account_id
                  );
                  const clientId = clientAcc ? clientAcc.id_client : '—';
                  const type = getOperationType(t);

                  return (
                    <tr key={t.id_transaction}>
                      <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                      <td><strong>{type}</strong></td>
                      <td>{t.amount.toLocaleString('ru-RU')}</td>
                      <td>{t.currency_code}</td>
                      <td>{t.description || '-'}</td>
                      <td>{t.sender_account_id || '-'}</td>
                      <td>{t.receiver_account_id || '-'}</td>
                      <td>{clientId}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OperationLogs;