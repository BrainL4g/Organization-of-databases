// src/pages/Dashboard/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
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

  // Автоматическая генерация номера счёта при выборе клиента и валюты
  useEffect(() => {
    if (newAccount.id_client && newAccount.currency_code) {
      // Генерация номера: 40817 (расчётный счёт) + код валюты + 9 случайных цифр + контрольная цифра
      const base = '40817';
      const currencyCode = newAccount.currency_code === 'RUB' ? '810' : newAccount.currency_code === 'USD' ? '840' : '978';
      const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      const fullNumber = base + currencyCode + randomDigits;

      // Простая контрольная цифра (сумма цифр mod 10)
      let sum = 0;
      for (let i = 0; i < fullNumber.length; i++) {
        sum += parseInt(fullNumber[i]);
      }
      const checkDigit = (10 - (sum % 10)) % 10;

      setNewAccount(prev => ({ ...prev, account_number: fullNumber + checkDigit }));
    } else {
      setNewAccount(prev => ({ ...prev, account_number: '' }));
    }
  }, [newAccount.id_client, newAccount.currency_code]);

  const handleOpenAccount = (e) => {
    e.preventDefault();
    if (!newAccount.id_client || !newAccount.account_number) {
      showMessage('Выберите клиента и валюту для генерации номера', 'danger');
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
    showMessage(`Счёт ${newAccount.account_number} успешно открыт`);
    setNewAccount({ id_client: '', account_number: '', currency_code: 'RUB' });
    setShowOpenAccountModal(false);
  };

  // Начисление процентов + запись в транзакции
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
    showMessage(`Проценты начислены на сумму ${totalAccrued.toLocaleString('ru-RU')} ₽`);
    setShowAccrueInterestModal(false);
  };

  // Одобрение заявки
  const handleApproveApplication = (app) => {
    app.status = 'approved';
    app.signed_by_bank = true;  // Добавили подписание договора

    showMessage(`Заявка №${app.id} одобрена и подписана`);

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
        app.signed_by_bank = false;
        saveData();
        showMessage(`Заявка отклонена: недостаточно средств`, 'danger');
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
        description: `Открытие депозита на сумму ${app.amount} ₽ (${rate}%)`
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
    } else if (app.product_type === 'карта') {
      const last4 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const cardNumber = `XXXX XXXX XXXX ${last4}`;

      const expiryMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const expiryYear = (new Date().getFullYear() + 5).toString().slice(-2);
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
    }

    saveData();
  };

  const handleRejectApplication = (app) => {
    app.status = 'rejected';
    app.signed_by_bank = false;
    saveData();
    showMessage(`Заявка №${app.id} отклонена`, 'warning');
  };

  return (
    <div>
      {message.text && <Alert variant={message.variant} className="mb-4">{message.text}</Alert>}

      <h2 className="mb-4">Кабинет сотрудника</h2>

      <div className="d-flex justify-content-between mb-4 flex-wrap gap-3">
        <Button variant="primary" onClick={() => setShowOpenAccountModal(true)}>Открыть счёт клиенту</Button>
        <Button variant="success" onClick={() => setShowAccrueInterestModal(true)}>Начислить проценты</Button>
        <Link to="/clients"><Button variant="info">Клиенты</Button></Link>
        <Link to="/accounts"><Button variant="secondary">Счета</Button></Link>
      </div>

      <h3 className="mb-3">Заявки на продукты</h3>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Срок</th>
            <th>Статус</th>
            <th>Подписан банком</th>
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
                <Badge bg={app.status === 'pending' ? 'warning' : app.status === 'approved' ? 'success' : 'danger'}>
                  {app.status === 'pending' ? 'В ожидании' : app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </Badge>
              </td>
              <td>
                <Badge bg={app.signed_by_bank ? 'success' : 'secondary'}>
                  {app.signed_by_bank ? 'Да' : 'Нет'}
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

      {/* Модалка открытия счёта с автогенерацией номера */}
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
              <Form.Label>Номер счёта (сгенерирован автоматически)</Form.Label>
              <Form.Control
                name="account_number"
                value={newAccount.account_number}
                readOnly
                placeholder="Выберите клиента и валюту для генерации"
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
            <Button variant="secondary" onClick={() => setShowOpenAccountModal(false)}>Отмена</Button>
            <Button variant="primary" type="submit" disabled={!newAccount.account_number}>Открыть счёт</Button>
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