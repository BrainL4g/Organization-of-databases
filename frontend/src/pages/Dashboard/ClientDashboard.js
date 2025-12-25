// src/pages/Dashboard/ClientDashboard.js
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import {
  mockAccounts,
  mockTransactions,
  mockCreditApplications,
  mockCredits,
  mockCards,
  mockDeposits,
  mockClients,
  mockInterestPayments,
  saveData
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

// Склонение месяцев
const getMonthWord = (num) => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'месяцев';
  if (lastDigit === 1) return 'месяц';
  if (lastDigit >= 2 && lastDigit <= 4) return 'месяца';
  return 'месяцев';
};

const ClientDashboard = () => {
  const { currentUser } = useAuth();

  const currentClient = mockClients.find(c => c.login === currentUser.login);
  const clientId = currentClient ? currentClient.id_client : 1;

  const clientAccounts = mockAccounts.filter(acc => acc.id_client === clientId);
  const clientCards = mockCards.filter(card => card.id_client === clientId);
  const clientDeposits = mockDeposits.filter(dep => dep.client_id === clientId);
  const clientCredits = mockCredits.filter(c => c.client_id === clientId);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [applyType, setApplyType] = useState('');
  const [application, setApplication] = useState({ amount: '', term_months: '' });
  const [transfer, setTransfer] = useState({ sender: '', receiver: '', amount: '', description: '' });
  const [operationData, setOperationData] = useState({ account: '', amount: '' });

  const [message, setMessage] = useState({ text: '', variant: '' });
  const [transferError, setTransferError] = useState('');

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 6000);
  };

  const handleApplicationChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();

    if (applyType !== 'карта') {
      if (!application.amount || !application.term_months || parseFloat(application.amount) <= 0 || parseInt(application.term_months) <= 0) {
        showMessage('Заполните корректно сумму и срок', 'danger');
        return;
      }
    }

    const newApp = {
      id: mockCreditApplications.length + 1,
      client_id: clientId,
      client_name: currentUser.full_name,
      amount: parseFloat(application.amount) || 0,
      term_months: parseInt(application.term_months) || 0,
      product_type: applyType,
      status: 'pending'
    };

    mockCreditApplications.push(newApp);
    saveData();
    showMessage(`Заявка на ${applyType} подана успешно`);
    setApplication({ amount: '', term_months: '' });
    setShowApplyModal(false);
  };

  const handleApplyClick = (type) => {
    setApplyType(type);
    setShowApplyModal(true);
  };

  const handleOperationChange = (e) => {
    setOperationData({ ...operationData, [e.target.name]: e.target.value });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const account = clientAccounts.find(acc => acc.id_account === parseInt(operationData.account));
    const amountNum = parseFloat(operationData.amount);

    if (!account || amountNum <= 0) {
      showMessage('Неверные данные', 'danger');
      return;
    }

    account.balance += amountNum;

    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: null,
      receiver_account_id: account.id_account,
      amount: amountNum,
      currency_code: account.currency_code,
      created_at: new Date().toISOString(),
      description: 'Пополнение счёта'
    };
    mockTransactions.push(newTransaction);
    saveData();

    showMessage(`Счёт пополнен на ${amountNum.toLocaleString('ru-RU')} ${account.currency_code}`);
    setOperationData({ account: '', amount: '' });
    setShowDepositModal(false);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const account = clientAccounts.find(acc => acc.id_account === parseInt(operationData.account));
    const amountNum = parseFloat(operationData.amount);

    if (!account || amountNum <= 0 || account.balance < amountNum) {
      showMessage('Недостаточно средств или неверные данные', 'danger');
      return;
    }

    account.balance -= amountNum;

    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: account.id_account,
      receiver_account_id: null,
      amount: amountNum,
      currency_code: account.currency_code,
      created_at: new Date().toISOString(),
      description: 'Снятие средств'
    };
    mockTransactions.push(newTransaction);
    saveData();

    showMessage(`Снятие на сумму ${amountNum.toLocaleString('ru-RU')} ${account.currency_code} выполнено`);
    setOperationData({ account: '', amount: '' });
    setShowWithdrawModal(false);
  };

  const handleTransferChange = (e) => {
    setTransfer({ ...transfer, [e.target.name]: e.target.value });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    setTransferError('');

    const sender = clientAccounts.find(acc => acc.id_account === parseInt(transfer.sender));
    const receiver = mockAccounts.find(acc => acc.id_account === parseInt(transfer.receiver));
    const amountNum = parseFloat(transfer.amount);

    if (!sender || !receiver || sender.id_account === receiver.id_account) {
      setTransferError('Неверные счета');
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0 || sender.balance < amountNum) {
      setTransferError('Недостаточно средств или неверная сумма');
      return;
    }

    let finalAmount = amountNum;
    let description = transfer.description || 'Перевод средств';

    if (sender.currency_code !== receiver.currency_code) {
      const EXCHANGE_RATE = 80;
      if (sender.currency_code === 'RUB' && receiver.currency_code === 'USD') {
        finalAmount = amountNum / EXCHANGE_RATE;
      } else if (sender.currency_code === 'USD' && receiver.currency_code === 'RUB') {
        finalAmount = amountNum * EXCHANGE_RATE;
      } else {
        setTransferError('Конвертация между этими валютами не поддерживается');
        return;
      }
      finalAmount = Math.round(finalAmount * 100) / 100;

      if (!window.confirm(
        `Валюты разные! Курс: 1 USD = ${EXCHANGE_RATE} RUB.\n` +
        `Отправляете: ${amountNum.toLocaleString('ru-RU')} ${sender.currency_code}\n` +
        `Получатель получит: ${finalAmount.toLocaleString('ru-RU')} ${receiver.currency_code}\n` +
        `Продолжить?`
      )) {
        return;
      }
      description = 'Перевод с конвертацией';
    }

    sender.balance -= amountNum;
    receiver.balance += finalAmount;

    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: sender.id_account,
      receiver_account_id: receiver.id_account,
      amount: amountNum,
      currency_code: sender.currency_code,
      converted_amount: sender.currency_code !== receiver.currency_code ? finalAmount : null,
      converted_currency: sender.currency_code !== receiver.currency_code ? receiver.currency_code : null,
      created_at: new Date().toISOString(),
      description
    };
    mockTransactions.push(newTransaction);
    saveData();

    showMessage(`Перевод выполнен`);
    setTransfer({ sender: '', receiver: '', amount: '', description: '' });
    setShowTransferModal(false);
  };

  return (
    <div>
      {message.text && <Alert variant={message.variant} className="mb-4">{message.text}</Alert>}

      <h2 className="mb-4">Мой кабинет</h2>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">Счета</Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Номер счёта</th>
                    <th>Баланс</th>
                    <th>Валюта</th>
                  </tr>
                </thead>
                <tbody>
                  {clientAccounts.map(acc => (
                    <tr key={acc.id_account}>
                      <td>{acc.account_number}</td>
                      <td>{acc.balance.toLocaleString('ru-RU')}</td>
                      <td>{acc.currency_code}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-info text-white">Карты</Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Номер карты</th>
                    <th>Тип</th>
                    <th>Срок</th>
                  </tr>
                </thead>
                <tbody>
                  {clientCards.map(card => (
                    <tr key={card.id_card}>
                      <td>{card.card_number}</td>
                      <td>{card.card_type}</td>
                      <td>{card.expiry_date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">Депозиты</Card.Header>
            <Card.Body>
              {clientDeposits.length === 0 ? (
                <Alert variant="info">Нет активных депозитов</Alert>
              ) : (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Сумма</th>
                      <th>Ставка</th>
                      <th>Срок</th>
                      <th>Начислено процентов</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientDeposits.map(dep => {
                      const accrued = mockInterestPayments
                        .filter(p => p.deposit_id === dep.id_deposit)
                        .reduce((sum, p) => sum + p.amount, 0);

                      return (
                        <tr key={dep.id_deposit}>
                          <td>{dep.amount.toLocaleString('ru-RU')} ₽</td>
                          <td>{dep.interest_rate}%</td>
                          <td>{dep.term_months} {getMonthWord(dep.term_months)}</td>
                          <td>{accrued.toLocaleString('ru-RU')} ₽</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-warning text-white">Кредиты</Card.Header>
            <Card.Body>
              {clientCredits.length === 0 ? (
                <Alert variant="info">Нет активных кредитов</Alert>
              ) : (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Сумма</th>
                      <th>Ставка</th>
                      <th>Срок</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientCredits.map(cred => (
                      <tr key={cred.id_credit}>
                        <td>{cred.amount.toLocaleString('ru-RU')} ₽</td>
                        <td>{cred.interest_rate}%</td>
                        <td>{cred.term_months} {getMonthWord(cred.term_months)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-around gap-3 mb-5">
        <Button variant="primary" size="lg" onClick={() => setShowTransferModal(true)}>Перевод</Button>
        <Button variant="success" size="lg" onClick={() => setShowDepositModal(true)}>Пополнить</Button>
        <Button variant="warning" size="lg" onClick={() => setShowWithdrawModal(true)}>Снять</Button>
        <Button variant="info" size="lg" onClick={() => handleApplyClick('кредит')}>Заявка на кредит</Button>
        <Button variant="secondary" size="lg" onClick={() => handleApplyClick('депозит')}>Заявка на депозит</Button>
        <Button variant="dark" size="lg" onClick={() => handleApplyClick('карта')}>Заявка на карту</Button>
      </div>

      {/* Модалка перевода */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Перевод средств</Modal.Title></Modal.Header>
        <Form onSubmit={handleTransfer}>
          <Modal.Body>
            {transferError && <Alert variant="danger">{transferError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Счёт отправителя</Form.Label>
              <Form.Select name="sender" value={transfer.sender} onChange={handleTransferChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} {acc.currency_code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Счёт получателя</Form.Label>
              <Form.Select name="receiver" value={transfer.receiver} onChange={handleTransferChange} required>
                <option value="">Выберите счёт</option>
                {mockAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} (ID клиента: {acc.id_client})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Сумма</Form.Label>
              <Form.Control type="number" name="amount" value={transfer.amount} onChange={handleTransferChange} min="0.01" step="0.01" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control name="description" value={transfer.description} onChange={handleTransferChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Отмена</Button>
            <Button variant="primary" type="submit">Перевести</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модалка заявки — с условием для карты */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            {applyType === 'карта' ? 'Заявка на выпуск карты' : `Заявка на ${applyType}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApplySubmit}>
          <Modal.Body>
            {applyType !== 'карта' ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Сумма</Form.Label>
                  <Form.Control type="number" name="amount" value={application.amount} onChange={handleApplicationChange} min="1000" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Срок (месяцев)</Form.Label>
                  <Form.Control type="number" name="term_months" value={application.term_months} onChange={handleApplicationChange} min="1" required />
                </Form.Group>
              </>
            ) : (
              <Alert variant="info">
                Заявка на выпуск банковской карты Visa Classic.<br />
                Плата за выпуск — бесплатно.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Отмена</Button>
            <Button variant="primary" type="submit">
              Подать заявку
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Остальные модалки (пополнение, снятие) — без изменений */}
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white"><Modal.Title>Пополнение счёта</Modal.Title></Modal.Header>
        <Form onSubmit={handleDeposit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Счёт для пополнения</Form.Label>
              <Form.Select name="account" value={operationData.account} onChange={handleOperationChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} {acc.currency_code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Сумма пополнения</Form.Label>
              <Form.Control type="number" name="amount" value={operationData.amount} onChange={handleOperationChange} min="1" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDepositModal(false)}>Отмена</Button>
            <Button variant="success" type="submit">Пополнить</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white"><Modal.Title>Снятие средств</Modal.Title></Modal.Header>
        <Form onSubmit={handleWithdraw}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Счёт для снятия</Form.Label>
              <Form.Select name="account" value={operationData.account} onChange={handleOperationChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} {acc.currency_code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Сумма снятия</Form.Label>
              <Form.Control type="number" name="amount" value={operationData.amount} onChange={handleOperationChange} min="1" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>Отмена</Button>
            <Button variant="warning" type="submit">Снять</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientDashboard;