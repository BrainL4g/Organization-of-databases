// src/pages/Transactions/TransactionList.js
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Row,
  Col,
} from 'react-bootstrap';
import { mockAccounts, mockTransactions, saveData } from '../../data/mockData';
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

  // ID клиента для демонстрации
  const clientId = 1;
  const clientAccountIds = mockAccounts
    .filter((acc) => acc.id_client === clientId)
    .map((acc) => acc.id_account);

  let transactions = isClient
    ? mockTransactions.filter(
        (t) =>
          clientAccountIds.includes(t.sender_account_id) ||
          (t.receiver_account_id && clientAccountIds.includes(t.receiver_account_id))
      )
    : mockTransactions;

  // Исправленная фильтрация по дате
  if (filterDateFrom) {
    const fromDate = new Date(filterDateFrom);
    fromDate.setHours(0, 0, 0, 0); // Начало дня
    transactions = transactions.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= fromDate;
    });
  }

  if (filterDateTo) {
    const toDate = new Date(filterDateTo);
    toDate.setHours(23, 59, 59, 999); // Конец дня
    transactions = transactions.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate <= toDate;
    });
  }

  // Фильтр по типу (описанию)
  if (filterType !== 'all') {
    transactions = transactions.filter((t) =>
      t.description.toLowerCase().includes(filterType.toLowerCase())
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
    setModalError('');
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    const senderId = parseInt(transferData.senderAccount);
    const receiverId = parseInt(transferData.receiverAccount);
    const amount = parseFloat(transferData.amount);

    if (!senderId || !receiverId || !amount || amount <= 0) {
      setModalError('Заполните все обязательные поля корректно');
      return;
    }

    const senderAccount = mockAccounts.find((acc) => acc.id_account === senderId);
    const receiverAccount = mockAccounts.find((acc) => acc.id_account === receiverId);

    if (!senderAccount || !receiverAccount) {
      setModalError('Не найден один из счетов');
      return;
    }

    if (senderAccount.balance < amount) {
      setModalError('Недостаточно средств на счёте отправителя');
      return;
    }

    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: senderId,
      receiver_account_id: receiverId,
      amount: amount,
      description: transferData.description || 'Перевод между счетами',
      created_at: new Date().toISOString(),
      status_code: 'completed',
    };

    mockTransactions.push(newTransaction);
    saveData();

    setModalSuccess('Перевод успешно выполнен!');
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferData({ senderAccount: '', receiverAccount: '', amount: '', description: '' });
      setModalSuccess('');
    }, 2000);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>История транзакций</h2>
        {isClient && (
          <Button variant="success" onClick={() => setShowTransferModal(true)}>
            Новый перевод
          </Button>
        )}
      </div>

      {/* Фильтры */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Дата от</Form.Label>
            <Form.Control
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Дата до</Form.Label>
            <Form.Control
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Тип операции</Form.Label>
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Все</option>
              <option value="перевод">Перевод</option>
              <option value="пополнение">Пополнение</option>
              <option value="снятие">Снятие</option>
              <option value="депозит">Депозит</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFilterDateFrom('');
              setFilterDateTo('');
              setFilterType('all');
            }}
          >
            Сбросить фильтры
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Счёт отправителя</th>
            <th>Счёт получателя</th>
            <th>Сумма</th>
            <th>Описание</th>
            <th>Дата и время</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id_transaction}>
              <td>{t.id_transaction}</td>
              <td>{t.sender_account_id || '—'}</td>
              <td>{t.receiver_account_id || '—'}</td>
              <td>{t.amount.toLocaleString('ru-RU')} ₽</td>
              <td>{t.description}</td>
              <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
              <td>
                <Badge bg="success">Завершено</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно перевода — оставляем как было */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Новый перевод средств</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            {modalSuccess && <Alert variant="success">{modalSuccess}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Счёт отправителя</Form.Label>
              <Form.Select
                name="senderAccount"
                value={transferData.senderAccount}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите счёт</option>
                {mockAccounts
                  .filter((acc) => acc.id_client === clientId)
                  .map((acc) => (
                    <option key={acc.id_account} value={acc.id_account}>
                      {acc.account_number} (баланс: {acc.balance.toLocaleString('ru-RU')} ₽)
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Счёт получателя</Form.Label>
              <Form.Select
                name="receiverAccount"
                value={transferData.receiverAccount}
                onChange={handleInputChange}
                required
              >
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