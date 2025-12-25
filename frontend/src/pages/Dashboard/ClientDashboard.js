// src/pages/Dashboard/ClientDashboard.js
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col, Tabs, Tab, Badge } from 'react-bootstrap';
import {
  mockAccounts,
  mockTransactions,
  mockCreditApplications,
  mockCredits,
  mockCards,
  mockDeposits,
  saveData
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { currentUser } = useAuth();

  const clientId = 1; // Для демонстрации — client1 (в будущем можно брать из currentUser)

  const clientAccounts = mockAccounts.filter(acc => acc.id_client === clientId);
  const clientCards = mockCards.filter(card => card.id_client === clientId);
  const clientDeposits = mockDeposits.filter(dep => dep.client_id === clientId);
  const clientCredits = mockCredits.filter(c => c.client_id === clientId);


  // Состояния модалок
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

  // Заявка на продукт
  const handleApplicationChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();

    if (!application.amount || !application.term_months || parseFloat(application.amount) <= 0 || parseInt(application.term_months) <= 0) {
      showMessage('Заполните корректно сумму и срок', 'danger');
      return;
    }

    const newApplication = {
      id: mockCreditApplications.length + 1,
      client_id: clientId,
      client_name: currentUser?.full_name || 'Иванов Иван Иванович',
      amount: parseFloat(application.amount),
      term_months: parseInt(application.term_months),
      product_type: applyType,
      status: 'pending'
    };

    mockCreditApplications.push(newApplication);
    saveData();

    showMessage(`Заявка на ${applyType} на сумму ${parseFloat(application.amount).toLocaleString('ru-RU')} ₽ успешно отправлена`);
    setApplication({ amount: '', term_months: '' });
    setShowApplyModal(false);
  };

  // Перевод между счетами
  const handleTransferChange = (e) => {
    setTransfer({ ...transfer, [e.target.name]: e.target.value });
    setTransferError('');
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setTransferError('');

    const senderId = parseInt(transfer.sender);
    const receiverId = parseInt(transfer.receiver);
    const amount = parseFloat(transfer.amount);

    if (!senderId || !receiverId || !amount || amount <= 0) {
      setTransferError('Заполните все поля корректно');
      return;
    }

    const senderAcc = mockAccounts.find(acc => acc.id_account === senderId);
    const receiverAcc = mockAccounts.find(acc => acc.id_account === receiverId);

    if (!senderAcc || !receiverAcc) {
      setTransferError('Один из счетов не найден');
      return;
    }

    if (senderAcc.balance < amount) {
      setTransferError('Недостаточно средств на счёте отправителя');
      return;
    }

    senderAcc.balance -= amount;
    receiverAcc.balance += amount;

    mockTransactions.push({
      id_transaction: mockTransactions.length + 1,
      sender_account_id: senderId,
      receiver_account_id: receiverId,
      amount,
      description: transfer.description || 'Перевод между счетами',
      created_at: new Date().toISOString(),
      status_code: 'completed'
    });

    saveData();
    showMessage('Перевод успешно выполнен');
    setShowTransferModal(false);
    setTransfer({ sender: '', receiver: '', amount: '', description: '' });
  };

  // Пополнение и снятие
  const handleOperationChange = (e) => {
    setOperationData({ ...operationData, [e.target.name]: e.target.value });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const acc = mockAccounts.find(a => a.id_account === parseInt(operationData.account));
    const amount = parseFloat(operationData.amount);

    if (!acc || amount <= 0) {
      showMessage('Проверьте данные', 'danger');
      return;
    }

    acc.balance += amount;

    mockTransactions.push({
      id_transaction: mockTransactions.length + 1,
      sender_account_id: null,
      receiver_account_id: acc.id_account,
      amount,
      description: 'Пополнение счёта',
      created_at: new Date().toISOString(),
      status_code: 'completed'
    });

    saveData();
    showMessage(`Счёт пополнен на ${amount.toLocaleString('ru-RU')} ₽`);
    setShowDepositModal(false);
    setOperationData({ account: '', amount: '' });
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const acc = mockAccounts.find(a => a.id_account === parseInt(operationData.account));
    const amount = parseFloat(operationData.amount);

    if (!acc || amount <= 0) {
      showMessage('Проверьте данные', 'danger');
      return;
    }
    if (acc.balance < amount) {
      showMessage('Недостаточно средств', 'danger');
      return;
    }

    acc.balance -= amount;

    mockTransactions.push({
      id_transaction: mockTransactions.length + 1,
      sender_account_id: acc.id_account,
      receiver_account_id: null,
      amount,
      description: 'Снятие средств',
      created_at: new Date().toISOString(),
      status_code: 'completed'
    });

    saveData();
    showMessage(`Снято ${amount.toLocaleString('ru-RU')} ₽ со счёта`);
    setShowWithdrawModal(false);
    setOperationData({ account: '', amount: '' });
  };

  // Расчёт процентов по депозиту (простой годовой)
  const calculateInterest = (dep) => {
    const yearsPassed = (Date.now() - new Date(dep.approved_at)) / (365 * 24 * 60 * 60 * 1000);
    return (dep.amount * (dep.interest_rate / 100) * yearsPassed).toFixed(2);
  };

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">Мой кабинет</h2>

      {message.text && <Alert variant={message.variant} dismissible>{message.text}</Alert>}

      <Tabs defaultActiveKey="accounts" className="mb-4">
        <Tab eventKey="accounts" title="Счета">
          <Row>
            {clientAccounts.map(acc => (
              <Col md={6} lg={4} key={acc.id_account} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>Счёт {acc.account_number}</Card.Title>
                    <Card.Text>
                      <strong>Баланс:</strong> {acc.balance.toLocaleString('ru-RU')} {acc.currency_code}<br />
                      <strong>Статус:</strong> {acc.is_blocked ? 'Заблокирован' : 'Активен'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Button variant="success" className="me-3" onClick={() => setShowDepositModal(true)}>
              Пополнить счёт
            </Button>
            <Button variant="warning" className="me-3" onClick={() => setShowWithdrawModal(true)}>
              Снять средства
            </Button>
            <Button variant="primary" onClick={() => setShowTransferModal(true)}>
              Перевод между счетами
            </Button>
          </div>
        </Tab>

        <Tab eventKey="cards" title="Карты">
          {clientCards.length === 0 ? (
            <Alert variant="info">У вас нет выпущенных карт. Подайте заявку в разделе "Продукты".</Alert>
          ) : (
            <Row>
              {clientCards.map(card => (
                <Col md={6} lg={4} key={card.id_card} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title>{card.card_type}</Card.Title>
                      <Card.Text>
                        <strong>Номер:</strong> {card.card_number}<br />
                        <strong>Действует до:</strong> {card.expiry_date}<br />
                        <strong>Статус:</strong> <Badge bg={card.status === 'active' ? 'success' : 'danger'}>{card.status === 'active' ? 'Активна' : 'Неактивна'}</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="deposits" title="Депозиты">
          {clientDeposits.length === 0 ? (
            <Alert variant="info">Нет активных депозитов</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Сумма</th>
                  <th>Ставка (%)</th>
                  <th>Срок (мес.)</th>
                  <th>Начислено процентов</th>
                  <th>Дата открытия</th>
                </tr>
              </thead>
              <tbody>
                {clientDeposits.map(dep => (
                  <tr key={dep.id}>
                    <td>{dep.amount.toLocaleString('ru-RU')} ₽</td>
                    <td>{dep.interest_rate}%</td>
                    <td>{dep.term_months}</td>
                    <td>{calculateInterest(dep)} ₽</td>
                    <td>{new Date(dep.approved_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="credits" title="Кредиты">
          {clientCredits.length === 0 ? (
            <Alert variant="info">Нет активных кредитов</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Сумма</th>
                  <th>Срок (мес.)</th>
                  <th>Дата выдачи</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {clientCredits.map(c => (
                  <tr key={c.id}>
                    <td>{c.amount.toLocaleString('ru-RU')} ₽</td>
                    <td>{c.term_months}</td>
                    <td>{new Date(c.approved_at).toLocaleDateString('ru-RU')}</td>
                    <td><Badge bg="success">Активен</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="products" title="Продукты">
          <div className="text-center py-5">
            <h4>Подать заявку на банковский продукт</h4>
            <Button variant="primary" size="lg" className="me-3" onClick={() => { setApplyType('кредит'); setShowApplyModal(true); }}>
              Заявка на кредит
            </Button>
            <Button variant="primary" size="lg" className="me-3" onClick={() => { setApplyType('депозит'); setShowApplyModal(true); }}>
              Заявка на депозит
            </Button>
            <Button variant="primary" size="lg" onClick={() => { setApplyType('карта'); setShowApplyModal(true); }}>
              Заявка на карту
            </Button>
          </div>
        </Tab>
      </Tabs>

      {/* Модалка перевода */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Перевод между счетами</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            {transferError && <Alert variant="danger">{transferError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Счёт отправителя</Form.Label>
              <Form.Select name="sender" value={transfer.sender} onChange={handleTransferChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} ₽)
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
                    {acc.account_number} (владелец ID: {acc.id_client})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Сумма</Form.Label>
              <Form.Control type="number" name="amount" value={transfer.amount} onChange={handleTransferChange} min="0.01" step="0.01" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание (необязательно)</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={transfer.description} onChange={handleTransferChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Отмена</Button>
            <Button variant="primary" type="submit">Выполнить перевод</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модалка заявки на продукт */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Заявка на {applyType}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApplySubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Сумма (в рублях)</Form.Label>
              <Form.Control type="number" name="amount" value={application.amount} onChange={handleApplicationChange} min="1000" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Срок (в месяцах)</Form.Label>
              <Form.Control type="number" name="term_months" value={application.term_months} onChange={handleApplicationChange} min="1" max="120" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Отмена</Button>
            <Button variant="success" type="submit">Отправить заявку</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модалка пополнения */}
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Пополнение счёта</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleDeposit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Счёт для пополнения</Form.Label>
              <Form.Select name="account" value={operationData.account} onChange={handleOperationChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} ₽)
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

      {/* Модалка снятия */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>Снятие средств</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleWithdraw}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Счёт для снятия</Form.Label>
              <Form.Select name="account" value={operationData.account} onChange={handleOperationChange} required>
                <option value="">Выберите счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} ({acc.balance.toLocaleString('ru-RU')} ₽)
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