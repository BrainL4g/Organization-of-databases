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
  mockCards,  // Добавили для создания карт
  mockDeposits,
  mockProducts,
  mockTransactions,
  mockInterestPayments,
  saveData,
} from '../../data/mockData';
import { Link } from 'react-router-dom';

// Функция склонения месяцев
const getMonthWord = (num) => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'месяцев';
  if (lastDigit === 1) return 'месяц';
  if (lastDigit >= 2 && lastDigit <= 4) return 'месяца';
  return 'месяцев';
};

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

  // Начисление процентов
  const handleAccrueInterest = () => {
    let totalAccrued = 0;

    mockDeposits.forEach((dep) => {
      if (dep.status === 'active') {
        const monthlyInterest = (dep.amount * dep.interest_rate / 100) / 12;
        const roundedInterest = Math.round(monthlyInterest * 100) / 100;

        const clientAccount = mockAccounts.find(
          acc => acc.id_client === dep.client_id && acc.currency_code === dep.currency_code
        );

        if (clientAccount) {
          clientAccount.balance += roundedInterest;

          const newTransaction = {
            id_transaction: mockTransactions.length + 1,
            sender_account_id: null,
            receiver_account_id: clientAccount.id_account,
            amount: roundedInterest,
            currency_code: dep.currency_code,
            created_at: new Date().toISOString(),
            description: `Начисление процентов по депозиту №${dep.id_deposit} (${dep.interest_rate}%)`
          };
          mockTransactions.push(newTransaction);

          totalAccrued += roundedInterest;
        }

        mockInterestPayments.push({
          id_payment: mockInterestPayments.length + 1,
          deposit_id: dep.id_deposit,
          amount: roundedInterest,
          payment_date: new Date().toISOString(),
        });
      }
    });

    saveData();
    showMessage(`Проценты начислены на сумму ${totalAccrued.toLocaleString('ru-RU')} ₽ и записаны в историю операций`);
    setShowAccrueInterestModal(false);
  };

  // Одобрение заявки
  const handleApproveApplication = (app) => {
    app.status = 'approved';
    showMessage(`Заявка №${app.id} (${app.product_type}) одобрена`);

    if (app.product_type === 'кредит') {
      const creditProduct = mockProducts.find(p => p.name.toLowerCase().includes('кредит'));
      const rate = creditProduct ? creditProduct.interest_rate : 15.0;

      const newCredit = {
        id_credit: mockCredits.length + 1,
        client_id: app.client_id,
        amount: app.amount,
        term_months: app.term_months,
        interest_rate: rate,
        status: 'active',
        issued_at: new Date().toISOString(),
      };
      mockCredits.push(newCredit);

      const clientAccount = mockAccounts.find(acc => acc.id_client === app.client_id && acc.currency_code === 'RUB');
      if (clientAccount) {
        clientAccount.balance += app.amount;

        const newTransaction = {
          id_transaction: mockTransactions.length + 1,
          sender_account_id: null,
          receiver_account_id: clientAccount.id_account,
          amount: app.amount,
          currency_code: 'RUB',
          created_at: new Date().toISOString(),
          description: `Зачисление кредита на сумму ${app.amount} ₽ (${rate}%)`
        };
        mockTransactions.push(newTransaction);
      }
    } else if (app.product_type === 'депозит') {
      const depositProduct = mockProducts.find(p => p.name.toLowerCase().includes('депозит'));
      const rate = depositProduct ? depositProduct.interest_rate : 7.5;

      const clientAccount = mockAccounts.find(acc => acc.id_client === app.client_id && acc.currency_code === 'RUB');

      if (!clientAccount || clientAccount.balance < app.amount) {
        app.status = 'rejected';
        saveData();
        showMessage(`Заявка №${app.id} на депозит отклонена: недостаточно средств на счёте клиента`, 'danger');
        return;
      }

      clientAccount.balance -= app.amount;

      const newTransaction = {
        id_transaction: mockTransactions.length + 1,
        sender_account_id: clientAccount.id_account,
        receiver_account_id: null,
        amount: app.amount,
        currency_code: 'RUB',
        created_at: new Date().toISOString(),
        description: `Открытие депозита на сумму ${app.amount.toLocaleString('ru-RU')} ₽ (${rate}%, ${app.term_months} ${getMonthWord(app.term_months)})`
      };
      mockTransactions.push(newTransaction);

      const newDeposit = {
        id_deposit: mockDeposits.length + 1,
        client_id: app.client_id,
        amount: app.amount,
        term_months: app.term_months,
        interest_rate: rate,
        status: 'active',
        opened_at: new Date().toISOString(),
        currency_code: 'RUB'
      };
      mockDeposits.push(newDeposit);

      showMessage(`Депозит на сумму ${app.amount.toLocaleString('ru-RU')} ₽ успешно открыт (${rate}%, ${app.term_months} ${getMonthWord(app.term_months)})`);
    } else if (app.product_type === 'карта') {
      // Создание карты при одобрении
      const last4 = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
      const cardNumber = `XXXX XXXX XXXX ${last4}`;

      const expiryMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const expiryYear = String(new Date().getFullYear() + 5).slice(-2);
      const expiry = `${expiryMonth}/${expiryYear}`;

      const newCard = {
        id_card: mockCards.length + 1,
        id_client: app.client_id,
        card_number: cardNumber,
        card_type: 'Visa Classic',
        expiry_date: expiry,
        status: 'active',
      };
      mockCards.push(newCard);

      showMessage(`Карта Visa Classic выпущена для клиента ${app.client_name}`);
    }

    saveData();
  };

  const handleRejectApplication = (app) => {
    app.status = 'rejected';
    saveData();
    showMessage(`Заявка №${app.id} отклонена`, 'warning');
  };

  return (
    <div>
      {message.text && <Alert variant={message.variant} className="mb-4">{message.text}</Alert>}

      <h2 className="mb-4">Кабинет сотрудника</h2>

      <div className="d-flex justify-content-between mb-4">
        <Button variant="primary" onClick={() => setShowOpenAccountModal(true)}>Открыть счёт клиенту</Button>
        <Button variant="success" onClick={() => setShowAccrueInterestModal(true)}>Начислить проценты</Button>
        <Link to="/clients"><Button variant="info">Справочник клиентов</Button></Link>
      </div>

      {/* Таблица заявок */}
      <h3 className="mb-3">Заявки на продукты</h3>
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Срок</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {mockCreditApplications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.client_name}</td>
              <td>{app.product_type}</td>
              <td>{app.amount.toLocaleString('ru-RU')} ₽</td>
              <td>{app.term_months} {getMonthWord(app.term_months)}</td>
              <td>
                <Badge variant={app.status === 'pending' ? 'warning' : app.status === 'approved' ? 'success' : 'danger'}>
                  {app.status === 'pending' ? 'В ожидании' : app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </Badge>
              </td>
              <td>
                {app.status === 'pending' && (
                  <>
                    <Button variant="success" size="sm" onClick={() => handleApproveApplication(app)} className="me-2">Одобрить</Button>
                    <Button variant="danger" size="sm" onClick={() => handleRejectApplication(app)}>Отклонить</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно открытия счёта */}
      <Modal show={showOpenAccountModal} onHide={() => setShowOpenAccountModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Открытие нового счёта</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleOpenAccount}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ID клиента</Form.Label>
              <Form.Select name="id_client" value={newAccount.id_client} onChange={handleAccountChange} required>
                <option value="">Выберите клиента</option>
                {mockClients.map(client => (
                  <option key={client.id_client} value={client.id_client}>
                    {client.id_client}: {client.full_name}
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