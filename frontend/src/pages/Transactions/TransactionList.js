// src/pages/Transactions/TransactionList.js
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import { mockAccounts, mockTransactions, saveData, mockClients } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

const TransactionList = () => {
  const { currentUser } = useAuth();
  const isClient = currentUser?.role === ROLES.CLIENT;

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    senderAccount: '',
    receiverAccount: '',
    amount: '',
    description: '',
  });
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Фильтры
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterClientId, setFilterClientId] = useState('');

  // ID клиента для демонстрации (для клиентов)
  const currentClient = mockClients.find(c => c.login === currentUser.login);
  const clientId = currentClient ? currentClient.id_client : null;
  if (isClient && !clientId) {
    return <Alert variant="danger">Ошибка: клиент не найден</Alert>;
  }

  const clientAccountIds = mockAccounts
    .filter((acc) => acc.id_client === clientId)
    .map((acc) => acc.id_account);

  let transactions = mockTransactions
    .filter(t => {
      // Фильтр по дате
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        if (new Date(t.created_at) < fromDate) return false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (new Date(t.created_at) > toDate) return false;
      }

      // Фильтр по типу
      if (filterType !== 'all') {
        const type = t.sender_account_id === null ? 'deposit' : t.receiver_account_id === null ? 'withdraw' : 'transfer';
        if (type !== filterType) return false;
      }

      // Фильтр по ID клиента (для сотрудника/админа)
      if (!isClient && filterClientId) {
        const filterAccounts = mockAccounts.filter(acc => acc.id_client === parseInt(filterClientId)).map(acc => acc.id_account);
        if (!filterAccounts.includes(t.sender_account_id) && !filterAccounts.includes(t.receiver_account_id)) return false;
      }

      return true;
    });

  if (isClient) {
    transactions = transactions.filter(
      (t) =>
        clientAccountIds.includes(t.sender_account_id) ||
        (t.receiver_account_id && clientAccountIds.includes(t.receiver_account_id))
    );
  }

  const handleInputChange = (e) => {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    const sender = mockAccounts.find(acc => acc.id_account === parseInt(transferData.senderAccount));
    const receiver = mockAccounts.find(acc => acc.id_account === parseInt(transferData.receiverAccount));
    const amountNum = parseFloat(transferData.amount);

    if (!sender || !receiver || amountNum <= 0 || sender.balance < amountNum) {
      setModalError('Неверные данные или недостаточно средств');
      return;
    }

    if (sender.currency_code !== receiver.currency_code) {
      setModalError('Валюты счетов не совпадают');
      return;
    }

    sender.balance -= amountNum;
    receiver.balance += amountNum;

    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: sender.id_account,
      receiver_account_id: receiver.id_account,
      amount: amountNum,
      currency_code: sender.currency_code,
      created_at: new Date().toISOString(),
      description: transferData.description || 'Перевод средств'
    };
    mockTransactions.push(newTransaction);
    saveData();

    setModalSuccess('Перевод выполнен успешно');
    setTransferData({ senderAccount: '', receiverAccount: '', amount: '', description: '' });
  };

  return (
    <>
      <h2 className="mb-4">История транзакций</h2>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Label>Дата от</Form.Label>
          <Form.Control type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Label>Дата до</Form.Label>
          <Form.Control type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Label>Тип операции</Form.Label>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Все типы</option>
            <option value="deposit">Пополнение</option>
            <option value="withdraw">Снятие</option>
            <option value="transfer">Перевод</option>
          </Form.Select>
        </Col>
        {!isClient && (
          <Col md={3}>
            <Form.Label>ID клиента</Form.Label>
            <Form.Control type="number" value={filterClientId} onChange={(e) => setFilterClientId(e.target.value)} placeholder="Фильтр по ID клиента" />
          </Col>
        )}
      </Row>

      <Button variant="primary" onClick={() => setShowTransferModal(true)} className="mb-4">Выполнить перевод</Button>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Дата</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">Транзакций не найдено</td>
            </tr>
          ) : (
            transactions.map(t => {
              const type = t.sender_account_id === null ? 'Пополнение' : t.receiver_account_id === null ? 'Снятие' : 'Перевод';
              return (
                <tr key={t.id_transaction}>
                  <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                  <td>{type}</td>
                  <td>{t.amount.toLocaleString('ru-RU')} {t.currency_code}</td>
                  <td>{t.description}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* Модалка перевода */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Выполнить перевод</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            {modalSuccess && <Alert variant="success">{modalSuccess}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Счёт отправителя</Form.Label>
              <Form.Select name="senderAccount" value={transferData.senderAccount} onChange={handleInputChange} required>
                <option value="">Выберите счёт</option>
                {mockAccounts.map((acc) => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} (владелец ID: {acc.id_client})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Счёт получателя</Form.Label>
              <Form.Select name="receiverAccount" value={transferData.receiverAccount} onChange={handleInputChange} required>
                <option value="">Выберите счёт</option>
                {mockAccounts.map((acc) => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_number} (владелец ID: {acc.id_client})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Сумма</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleInputChange}
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
                value={transferData.description}
                onChange={handleInputChange}
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
    </>
  );
};

export default TransactionList;