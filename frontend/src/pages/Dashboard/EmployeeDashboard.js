// src/pages/Dashboard/EmployeeDashboard.js
import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { mockAccounts, mockClients, mockCreditApplications, mockCredits, saveData } from '../../data/mockData';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);
  const [showAccrueInterestModal, setShowAccrueInterestModal] = useState(false);

  const [newAccount, setNewAccount] = useState({
    id_client: '',
    account_number: '',
    currency_code: 'RUB'
  });

  const [message, setMessage] = useState({ text: '', variant: '' });

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 6000);
  };

  const handleAccountChange = (e) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  const handleOpenAccount = (e) => {
    e.preventDefault();
    if (!newAccount.id_client || !newAccount.account_number) {
      showMessage('Заполните все обязательные поля', 'danger');
      return;
    }

    const newAcc = {
      id_account: mockAccounts.length + 1,
      id_client: parseInt(newAccount.id_client),
      account_number: newAccount.account_number,
      currency_code: newAccount.currency_code,
      balance: 0.00,
      is_blocked: false,
      created_at: new Date().toISOString()
    };

    mockAccounts.push(newAcc);
    saveData();
    showMessage(`Счёт ${newAccount.account_number} успешно открыт для клиента`);
    setNewAccount({ id_client: '', account_number: '', currency_code: 'RUB' });
    setShowOpenAccountModal(false);
  };

  const handleAccrueInterest = () => {
    showMessage('Проценты по всем активным депозитам успешно начислены клиентам');
    setShowAccrueInterestModal(false);
  };

  const handleApproveCredit = (app) => {
    app.status = 'approved';
    const newCredit = {
      id: mockCredits.length + 1,
      client_id: app.client_id,
      amount: app.amount,
      term_months: app.term_months,
      approved_at: new Date().toISOString(),
      status: 'active'
    };
    mockCredits.push(newCredit);
    saveData();
    showMessage(`Кредит на сумму ${app.amount.toLocaleString('ru-RU')} ₽ одобрен клиенту ${app.client_name}`);
  };

  const handleDeclineCredit = (app) => {
    app.status = 'declined';
    saveData();
    showMessage(`Заявка клиента ${app.client_name} отклонена`, 'warning');
  };

  const pendingApplications = mockCreditApplications.filter(app => app.status === 'pending');

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">Панель сотрудника банка</h2>

      {message.text && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
          {message.text}
        </Alert>
      )}

      <div className="text-center mb-5">
        <Button variant="primary" size="lg" className="me-4" onClick={() => setShowOpenAccountModal(true)}>
          Открыть новый счёт клиенту
        </Button>
        <Button variant="info" size="lg" onClick={() => setShowAccrueInterestModal(true)}>
          Начислить проценты по депозитам
        </Button>
      </div>

      <h4 className="mb-4">Заявки на кредит (на рассмотрении)</h4>
      {pendingApplications.length === 0 ? (
        <Alert variant="info" className="text-center">Новых заявок на кредит нет</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm mb-5">
          <thead className="table-primary text-center">
            <tr>
              <th>№</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Срок</th>
              <th>Тип продукта</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((app, index) => (
              <tr key={app.id}>
                <td className="text-center">{index + 1}</td>
                <td>{app.client_name}</td>
                <td className="text-end fw-bold">{app.amount.toLocaleString('ru-RU')} ₽</td>
                <td className="text-center">{app.term_months} мес.</td>
                <td className="text-center"><Badge bg="secondary">{app.product_type || 'кредит'}</Badge></td>
                <td className="text-center">
                  <Button variant="success" size="sm" className="me-2" onClick={() => handleApproveCredit(app)}>
                    Одобрить
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeclineCredit(app)}>
                    Отклонить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mb-4">Счета клиентов</h4>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-primary text-center">
          <tr>
            <th>ID</th>
            <th>Клиент ID</th>
            <th>Номер счёта</th>
            <th>Баланс</th>
            <th>Валюта</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {mockAccounts.map(acc => (
            <tr key={acc.id_account}>
              <td className="text-center">{acc.id_account}</td>
              <td className="text-center">{acc.id_client}</td>
              <td>{acc.account_number}</td>
              <td className="text-end fw-bold">{acc.balance.toLocaleString('ru-RU')} ₽</td>
              <td className="text-center">{acc.currency_code}</td>
              <td className="text-center">
                <Badge bg={acc.is_blocked ? 'danger' : 'success'}>
                  {acc.is_blocked ? 'Заблокирован' : 'Активен'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-5 text-center">
        <Link to="/clients">
          <Button variant="outline-secondary" size="lg" className="me-4">
            Справочник клиентов
          </Button>
        </Link>
        <Link to="/transactions">
          <Button variant="outline-secondary" size="lg">
            Все транзакции
          </Button>
        </Link>
      </div>

      {/* Модалка открытия счёта */}
      <Modal show={showOpenAccountModal} onHide={() => setShowOpenAccountModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Открытие нового счёта</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleOpenAccount}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Клиент</Form.Label>
              <Form.Select name="id_client" value={newAccount.id_client} onChange={handleAccountChange} required>
                <option value="">Выберите клиента</option>
                {mockClients.map(client => (
                  <option key={client.id_client} value={client.id_client}>
                    {client.full_name} (ID: {client.id_client})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Номер счёта</Form.Label>
              <Form.Control
                name="account_number"
                value={newAccount.account_number}
                onChange={handleAccountChange}
                placeholder="Например: 40817810000000000001"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Валюта</Form.Label>
              <Form.Select name="currency_code" value={newAccount.currency_code} onChange={handleAccountChange}>
                <option value="RUB">Российский рубль (RUB)</option>
                <option value="USD">Доллар США (USD)</option>
                <option value="EUR">Евро (EUR)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowOpenAccountModal(false)}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Открыть счёт
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модалка начисления процентов */}
      <Modal show={showAccrueInterestModal} onHide={() => setShowAccrueInterestModal(false)} centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Начисление процентов по депозитам</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Будет выполнено начисление процентов по всем активным депозитным договорам за текущий период.</p>
          <Alert variant="warning">
            Операция необратима. Рекомендуется выполнять в конце расчётного периода.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAccrueInterestModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleAccrueInterest}>
            Начислить проценты
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;