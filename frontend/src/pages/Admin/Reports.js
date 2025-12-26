// src/pages/Admin/Reports.js
import React, { useState } from 'react';
import { Container, Card, Button, Table, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import {
  mockTransactions,
  mockAccounts,
  mockClients,
  mockCredits,
  mockDeposits,
  mockCards,
  mockCreditApplications
} from '../../data/mockData';

const Reports = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: '',
    type: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      status: '',
      type: ''
    });
  };

  const applyFilters = (items, dateField = 'created_at', statusField = null, typeField = null) => {
    return items.filter(item => {
      const itemDate = new Date(item[dateField] || item.created_at || item.application_date);
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;
      const toAdjusted = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999) : null;

      const dateMatch = (!from || itemDate >= from) && (!toAdjusted || itemDate <= toAdjusted);
      const statusMatch = !filters.status || (statusField && item[statusField] === filters.status);
      const typeMatch = !filters.type || (typeField && item[typeField] === filters.type);

      return dateMatch && statusMatch && typeMatch;
    });
  };

  // Транзакции
  const filteredTransactions = applyFilters(mockTransactions);
  const getTransactionType = (t) => {
    if (t.sender_account_id === null) return 'Пополнение';
    if (t.receiver_account_id === null) return 'Снятие';
    return 'Перевод';
  };

  // Клиенты
  const filteredClients = mockClients; // Можно добавить фильтр по дате регистрации позже

  // Продукты (кредиты, депозиты, карты, заявки)
  const allProducts = [
    ...mockCredits.map(p => ({ ...p, product_type: 'кредит' })),
    ...mockDeposits.map(p => ({ ...p, product_type: 'депозит' })),
    ...mockCards.map(p => ({ ...p, product_type: 'карта' })),
    ...mockCreditApplications.map(p => ({ ...p, product_type: p.product_type }))
  ];
  const filteredProducts = applyFilters(allProducts, 'created_at', 'status', 'product_type');

  // Экспорт в CSV
  const downloadCSV = (headers, rows, filename) => {
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const exportTransactions = () => {
    const headers = ['Дата', 'Тип', 'Сумма', 'Валюта', 'Описание', 'Клиент ID'];
    const rows = filteredTransactions.map(t => {
      const clientAcc = mockAccounts.find(a => a.id_account === t.sender_account_id || a.id_account === t.receiver_account_id);
      const clientId = clientAcc ? clientAcc.id_client : '—';
      return [
        new Date(t.created_at).toLocaleString('ru-RU'),
        getTransactionType(t),
        t.amount,
        t.currency_code,
        t.description || '',
        clientId
      ];
    });
    downloadCSV(headers, rows, 'transactions');
  };

  const exportClients = () => {
    const headers = ['ID', 'ФИО', 'Email', 'Телефон', 'Логин'];
    const rows = filteredClients.map(c => [c.id_client, c.full_name, c.email, c.phone || '-', c.login]);
    downloadCSV(headers, rows, 'clients');
  };

  const exportProducts = () => {
    const headers = ['Тип', 'Клиент ID', 'Сумма', 'Срок (мес)', 'Статус', 'Дата'];
    const rows = filteredProducts.map(p => [
      p.product_type || '—',
      p.client_id || p.client_id,
      p.amount || '—',
      p.term_months || '—',
      p.status || '—',
      new Date(p.created_at || p.application_date).toLocaleString('ru-RU')
    ]);
    downloadCSV(headers, rows, 'products');
  };

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white text-center">
          <h3>Отчёты</h3>
        </Card.Header>
        <Card.Body>
          <Form className="mb-4 p-3 bg-light rounded">
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Label>Дата от</Form.Label>
                <Form.Control type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <Form.Label>Дата до</Form.Label>
                <Form.Control type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
              </Col>
              <Col md={2}>
                <Form.Label>Статус</Form.Label>
                <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">Все</option>
                  <option value="pending">В обработке</option>
                  <option value="completed">Выполнена</option>
                  <option value="rejected">Отклонена</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Тип</Form.Label>
                <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">Все</option>
                  <option value="кредит">Кредит</option>
                  <option value="депозит">Депозит</option>
                  <option value="карта">Карта</option>
                  <option value="Пополнение">Пополнение</option>
                  <option value="Снятие">Снятие</option>
                  <option value="Перевод">Перевод</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Button variant="outline-danger" onClick={handleReset} className="w-100">
                  Сбросить
                </Button>
              </Col>
            </Row>
          </Form>

          <Tabs defaultActiveKey="transactions" className="mb-3">
            <Tab eventKey="transactions" title="Транзакции">
              <Button variant="success" onClick={exportTransactions} className="mb-3">Экспорт в CSV</Button>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr><th>Дата</th><th>Тип</th><th>Сумма</th><th>Валюта</th><th>Описание</th><th>Клиент ID</th></tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(-20).reverse().map(t => {  // Показываем последние 20
                    const clientAcc = mockAccounts.find(a => a.id_account === t.sender_account_id || a.id_account === t.receiver_account_id);
                    const clientId = clientAcc ? clientAcc.id_client : '—';
                    return (
                      <tr key={t.id_transaction}>
                        <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                        <td>{getTransactionType(t)}</td>
                        <td>{t.amount.toLocaleString('ru-RU')}</td>
                        <td>{t.currency_code}</td>
                        <td>{t.description || '-'}</td>
                        <td>{clientId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="clients" title="Клиенты">
              <Button variant="success" onClick={exportClients} className="mb-3">Экспорт в CSV</Button>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr><th>ID</th><th>ФИО</th><th>Логин</th><th>Email</th><th>Телефон</th></tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c.id_client}>
                      <td>{c.id_client}</td>
                      <td>{c.full_name}</td>
                      <td>{c.login}</td>
                      <td>{c.email}</td>
                      <td>{c.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="products" title="Продукты и заявки">
              <Button variant="success" onClick={exportProducts} className="mb-3">Экспорт в CSV</Button>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr><th>Тип</th><th>Клиент ID</th><th>Сумма</th><th>Срок (мес)</th><th>Статус</th><th>Дата</th></tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id_credit || p.id_deposit || p.id_card || p.id}>
                      <td>{p.product_type || '—'}</td>
                      <td>{p.client_id}</td>
                      <td>{p.amount || '—'}</td>
                      <td>{p.term_months || '—'}</td>
                      <td>{p.status || '—'}</td>
                      <td>{new Date(p.created_at || p.application_date).toLocaleString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;