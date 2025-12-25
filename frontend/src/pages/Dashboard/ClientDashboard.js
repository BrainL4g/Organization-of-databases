// src/pages/Dashboard/ClientDashboard.js
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { mockAccounts, mockTransactions, mockCreditApplications, mockCredits, saveData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { currentUser } = useAuth();

  const clientId = 1; // Для демонстрации — client1
  const clientAccounts = mockAccounts.filter(acc => acc.id_client === clientId);

  const clientTransactions = mockTransactions.filter(t =>
    clientAccounts.some(acc => acc.id_account === t.sender_account_id || acc.id_account === t.receiver_account_id)
  );

  const clientCredits = mockCredits.filter(c => c.client_id === clientId);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyType, setApplyType] = useState('');

  const [application, setApplication] = useState({ amount: '', term_months: '' });
  const [transfer, setTransfer] = useState({ sender: '', receiver: '', amount: '', description: '' });

  const [message, setMessage] = useState({ text: '', variant: '' });

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 6000);
  };

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
    saveData(); // Сохраняем

    showMessage(`Заявка на ${applyType} на сумму ${parseFloat(application.amount).toLocaleString('ru-RU')} ₽ успешно отправлена`);
    setApplication({ amount: '', term_months: '' });
    setShowApplyModal(false);
  };

  const handleTransferChange = (e) => {
    setTransfer({ ...transfer, [e.target.name]: e.target.value });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();

    const senderId = parseInt(transfer.sender);
    const receiverId = parseInt(transfer.receiver);
    const amount = parseFloat(transfer.amount);

    if (isNaN(senderId) || isNaN(receiverId) || isNaN(amount) || amount <= 0) {
      showMessage('Проверьте правильность заполнения полей', 'danger');
      return;
    }

    const senderAccount = mockAccounts.find(acc => acc.id_account === senderId);
    const receiverAccount = mockAccounts.find(acc => acc.id_account === receiverId);

    if (!senderAccount || !receiverAccount) {
      showMessage('Один из счетов не найден', 'danger');
      return;
    }

    if (senderAccount.balance < amount) {
      showMessage('Недостаточно средств на счёте отправителя', 'danger');
      return;
    }

    // Реальный перевод: меняем балансы
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    // Добавляем транзакцию
    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: senderId,
      receiver_account_id: receiverId,
      amount: amount,
      description: transfer.description || 'Перевод между счетами',
      created_at: new Date().toISOString(),
      status_code: 'completed'
    };

    mockTransactions.push(newTransaction);

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: сохраняем все данные в localStorage
    saveData();

    showMessage(`Перевод ${amount.toLocaleString('ru-RU')} ₽ успешно выполнен. Баланс обновлён.`);
    setTransfer({ sender: '', receiver: '', amount: '', description: '' });
    setShowTransferModal(false);
  };

  const openApplyModal = (type) => {
    setApplyType(type);
    setShowApplyModal(true);
  };

  return (
    <div>
      <h2 className="mb-5 text-center text-primary fw-bold">
        Личный кабинет клиента: {currentUser?.full_name || 'Клиент'}
      </h2>

      {message.text && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
          {message.text}
        </Alert>
      )}

      <Tabs defaultActiveKey="accounts" id="client-tabs" className="mb-5" justify>
        <Tab eventKey="accounts" title="Мои счета">
          <Row className="g-4">
            {clientAccounts.length === 0 ? (
              <Col>
                <Alert variant="info" className="text-center">
                  У вас пока нет открытых счетов. Обратитесь к сотруднику банка.
                </Alert>
              </Col>
            ) : (
              clientAccounts.map(acc => (
                <Col md={6} lg={4} key={acc.id_account}>
                  <Card className="h-100 shadow border-0 rounded-3">
                    <Card.Header className="bg-primary text-white text-center">
                      <h5 className="mb-0">Счёт № {acc.account_number}</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <h3 className="text-success fw-bold">
                        {acc.balance.toLocaleString('ru-RU')} {acc.currency_code}
                      </h3>
                      <p className="mb-2">
                        <strong>Валюта:</strong> {acc.currency_code}
                      </p>
                      <p className={acc.is_blocked ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                        Статус: {acc.is_blocked ? 'Заблокирован' : 'Активен'}
                      </p>
                      <Button variant="primary" className="w-100 mt-3" onClick={() => setShowTransferModal(true)}>
                        Перевести средства
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Tab>

        <Tab eventKey="credits" title="Кредиты и заявки">
          <h4 className="mb-4">Одобренные кредиты</h4>
          {clientCredits.length === 0 ? (
            <Alert variant="info">У вас нет активных кредитов</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Сумма</th>
                  <th>Срок</th>
                  <th>Дата одобрения</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {clientCredits.map(c => (
                  <tr key={c.id}>
                    <td>{c.amount.toLocaleString('ru-RU')} ₽</td>
                    <td>{c.term_months} месяцев</td>
                    <td>{new Date(c.approved_at).toLocaleDateString('ru-RU')}</td>
                    <td><span className="badge bg-success">Активен</span></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <h4 className="mt-5 mb-4 text-center">Подать новую заявку на продукт</h4>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Button variant="outline-success" size="lg" className="w-100 py-4" onClick={() => openApplyModal('кредит')}>
                <strong>Кредит</strong>
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-success" size="lg" className="w-100 py-4" onClick={() => openApplyModal('депозит')}>
                <strong>Депозит</strong>
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-success" size="lg" className="w-100 py-4" onClick={() => openApplyModal('карту')}>
                <strong>Карта</strong>
              </Button>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="transactions" title="История операций">
          <h4 className="mb-4">Все операции по счетам</h4>
          {clientTransactions.length === 0 ? (
            <Alert variant="info">Операций пока не проводилось</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Дата и время</th>
                  <th>Сумма</th>
                  <th>Описание</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {clientTransactions.map(t => (
                  <tr key={t.id_transaction}>
                    <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                    <td className={t.amount > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td>{t.description}</td>
                    <td><span className="badge bg-success">Завершена</span></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>

      {/* Модалка перевода */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Перевод средств</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Со счёта (отправитель)</Form.Label>
              <Form.Select name="sender" value={transfer.sender} onChange={handleTransferChange} required>
                <option value="">Выберите свой счёт</option>
                {clientAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} (баланс: {acc.balance.toLocaleString('ru-RU')} ₽)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>На счёт (получатель)</Form.Label>
              <Form.Select name="receiver" value={transfer.receiver} onChange={handleTransferChange} required>
                <option value="">Выберите счёт получателя</option>
                {mockAccounts.map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} (владелец ID: {acc.id_client}, баланс: {acc.balance.toLocaleString('ru-RU')} ₽)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Сумма</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={transfer.amount}
                onChange={handleTransferChange}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание (необязательно)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={transfer.description}
                onChange={handleTransferChange}
                placeholder="Например: оплата услуг"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Выполнить перевод
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модалка заявки */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Заявка на {applyType}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApplySubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Сумма (в рублях)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={application.amount}
                onChange={handleApplicationChange}
                min="1000"
                placeholder="Например: 500000"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Срок (в месяцах)</Form.Label>
              <Form.Control
                type="number"
                name="term_months"
                value={application.term_months}
                onChange={handleApplicationChange}
                min="1"
                max="120"
                placeholder="Например: 48"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
              Отмена
            </Button>
            <Button variant="success" type="submit">
              Отправить заявку
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientDashboard;