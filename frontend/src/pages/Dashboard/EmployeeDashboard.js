// src/pages/Dashboard/EmployeeDashboard.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Alert,
  Table,
  Badge,
} from 'react-bootstrap';
import {
  mockAccounts,
  mockClients,
  mockCreditApplications,
  mockCredits,
  mockCards,
  mockDeposits,
  saveData,
} from '../../data/mockData';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);
  const [showAccrueInterestModal, setShowAccrueInterestModal] = useState(false);

  const [newAccount, setNewAccount] = useState({
    id_client: '',
    account_number: '',
    currency_code: 'RUB',
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
      balance: 0.0,
      is_blocked: false,
      created_at: new Date().toISOString(),
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

  // Основная функция одобрения заявки — обрабатывает кредит, депозит и карту
  const handleApproveApplication = (app) => {
    app.status = 'approved';

    if (app.product_type === 'кредит') {
      // Создаём кредит и зачисляем деньги
      const newCredit = {
        id: mockCredits.length + 1,
        client_id: app.client_id,
        amount: app.amount,
        term_months: app.term_months,
        approved_at: new Date().toISOString(),
        status: 'active',
      };
      mockCredits.push(newCredit);

      const clientAccount = mockAccounts.find((acc) => acc.id_client === app.client_id);
      if (clientAccount) {
        clientAccount.balance += app.amount;
      }

      showMessage(`Кредит на сумму ${app.amount.toLocaleString('ru-RU')} ₽ одобрен и зачислен клиенту ${app.client_name}`);
    }
    else if (app.product_type === 'депозит') {
      // Создаём депозит и списываем деньги со счёта клиента
      const newDeposit = {
        id: mockDeposits.length + 1,
        client_id: app.client_id,
        amount: app.amount,
        interest_rate: 7.5, // Можно улучшить — брать из продукта
        term_months: app.term_months,
        approved_at: new Date().toISOString(),
        status: 'active',
      };
      mockDeposits.push(newDeposit);

      const clientAccount = mockAccounts.find(
        (acc) => acc.id_client === app.client_id && acc.currency_code === 'RUB'
      );

      if (clientAccount && clientAccount.balance >= app.amount) {
        clientAccount.balance -= app.amount;
        showMessage(`Депозит на сумму ${app.amount.toLocaleString('ru-RU')} ₽ открыт. Деньги списаны со счёта клиента ${app.client_name}`);
      } else {
        showMessage('Недостаточно средств на счёте клиента для открытия депозита', 'danger');
        app.status = 'declined'; // Откатываем статус
      }
    }
    else if (app.product_type === 'карта') {
      // Выпускаем карту
      const newCard = {
        id_card: mockCards.length + 1,
        id_client: app.client_id,
        card_number: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
        card_type: 'Debit Visa',
        expiry_date: '12/' + (new Date().getFullYear() + 5).toString().slice(-2),
        status: 'active',
      };
      mockCards.push(newCard);
      showMessage(`Карта успешно выпущена клиенту ${app.client_name}`);
    }

    saveData();
  };

  const handleDeclineApplication = (app) => {
    app.status = 'declined';
    saveData();
    showMessage(`Заявка клиента ${app.client_name} отклонена`, 'warning');
  };

  const pendingApplications = mockCreditApplications.filter((app) => app.status === 'pending');

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">Кабинет сотрудника банка</h2>

      {message.text && (
        <Alert
          variant={message.variant}
          dismissible
          onClose={() => setMessage({ text: '', variant: '' })}
        >
          {message.text}
        </Alert>
      )}

      <div className="d-flex justify-content-around mb-5 flex-wrap gap-3">
        <Button
          variant="primary"
          size="lg"
          className="px-5 py-3 shadow flex-grow-1"
          style={{ maxWidth: '300px' }}
          onClick={() => setShowOpenAccountModal(true)}
        >
          Открыть новый счёт
        </Button>

        <Link to="/transactions">
          <Button
            variant="outline-primary"
            size="lg"
            className="px-5 py-3 shadow flex-grow-1"
            style={{ maxWidth: '300px' }}
          >
            Мониторинг транзакций
          </Button>
        </Link>

        <Button
          variant="info"
          size="lg"
          className="px-5 py-3 shadow flex-grow-1"
          style={{ maxWidth: '300px' }}
          onClick={() => setShowAccrueInterestModal(true)}
        >
          Начислить проценты по депозитам
        </Button>
      </div>

      <h3 className="mb-4 text-secondary">Заявки на продукты (кредиты, депозиты, карты)</h3>

      {pendingApplications.length === 0 ? (
        <Alert variant="info">Нет новых заявок на рассмотрение</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Клиент</th>
              <th>Тип продукта</th>
              <th>Сумма</th>
              <th>Срок (мес.)</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((app) => (
              <tr key={app.id}>
                <td>{app.client_name}</td>
                <td className="text-capitalize">{app.product_type}</td>
                <td>{app.amount ? app.amount.toLocaleString('ru-RU') + ' ₽' : '—'}</td>
                <td>{app.term_months || '—'}</td>
                <td>
                  <Badge bg="warning">На рассмотрении</Badge>
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApproveApplication(app)}
                  >
                    Одобрить
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeclineApplication(app)}
                  >
                    Отклонить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальное окно открытия нового счёта */}
      <Modal show={showOpenAccountModal} onHide={() => setShowOpenAccountModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Открытие нового счёта</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleOpenAccount}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Клиент</Form.Label>
              <Form.Select name="id_client" value={newAccount.id_client} onChange={handleAccountChange} required>
                <option value="">Выберите клиента</option>
                {mockClients.map((client) => (
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

      {/* Модальное окно начисления процентов */}
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