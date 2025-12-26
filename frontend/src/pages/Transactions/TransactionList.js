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
  Card
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

  const handleResetFilters = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterType('all');
    setFilterClientId('');
  };

  const getOperationType = (t) => {
    if (t.description) {
      if (t.description.includes('Снятие наличных') || t.description.includes('Снятие средств')) {
        return 'Снятие';
      }
      if (t.description.includes('Пополнение')) {
        return 'Пополнение';
      }
    }

    if (t.sender_account_id === null && t.receiver_account_id !== null) return 'Пополнение';
    if (t.sender_account_id !== null && t.receiver_account_id === null) return 'Снятие';
    if (t.sender_account_id !== null && t.receiver_account_id !== null) return 'Перевод';
    return 'Неизвестно';
  };

  const currentClient = mockClients.find(c => c.login === currentUser.login);
  const clientId = currentClient ? currentClient.id_client : null;
  if (isClient && !clientId) {
    return <Alert variant="danger">Ошибка: клиент не найден</Alert>;
  }

  const clientAccountIds = mockAccounts
    .filter(acc => acc.id_client === clientId)
    .map(acc => acc.id_account);

  let transactions = mockTransactions.filter(t => {
    const tDate = new Date(t.created_at);

    if (filterDateFrom && tDate < new Date(filterDateFrom)) return false;
    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      if (tDate > toDate) return false;
    }

    if (filterType !== 'all') {
      const type = getOperationType(t);
      const map = { deposit: 'Пополнение', withdraw: 'Снятие', transfer: 'Перевод' };
      if (type !== map[filterType]) return false;
    }

    if (!isClient && filterClientId) {
      const filterAccounts = mockAccounts
        .filter(acc => acc.id_client === parseInt(filterClientId))
        .map(acc => acc.id_account);
      if (
        (t.sender_account_id && !filterAccounts.includes(t.sender_account_id)) &&
        (t.receiver_account_id && !filterAccounts.includes(t.receiver_account_id))
      ) return false;
    }

    return true;
  });

  if (isClient) {
    transactions = transactions.filter(t =>
      (t.sender_account_id && clientAccountIds.includes(t.sender_account_id)) ||
      (t.receiver_account_id && clientAccountIds.includes(t.receiver_account_id))
    );
  }

  transactions = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
    <Card className="shadow">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">История транзакций</h3>
      </Card.Header>
      <Card.Body>
        {/* Фильтры — улучшенная адаптивность */}
        <Row className="mb-4 g-3 align-items-end">
          <Col xs={12} sm={6} md={2}>
            <Form.Label>Дата от</Form.Label>
            <Form.Control type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Label>Дата до</Form.Label>
            <Form.Control type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Label>Тип операции</Form.Label>
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="deposit">Пополнение</option>
              <option value="withdraw">Снятие</option>
              <option value="transfer">Перевод</option>
            </Form.Select>
          </Col>
          {!isClient && (
            <Col xs={12} sm={6} md={2}>
              <Form.Label>ID клиента</Form.Label>
              <Form.Control type="number" value={filterClientId} onChange={(e) => setFilterClientId(e.target.value)} />
            </Col>
          )}
          <Col xs={12} md={isClient ? 3 : 3}>
            <Form.Label className="visually-hidden">Сброс</Form.Label>
            <Button
              variant="outline-danger"
              onClick={handleResetFilters}
              className="w-100"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.95rem'
              }}
            >
              Сбросить фильтры
            </Button>
          </Col>
        </Row>

        {!isClient && (
          <Button variant="success" onClick={() => setShowTransferModal(true)} className="mb-4">
            Выполнить перевод от имени клиента
          </Button>
        )}

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Дата и время</th>
              <th>Тип</th>
              <th>Сумма</th>
              <th>Валюта</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Транзакций не найдено</td>
              </tr>
            ) : (
              transactions.map(t => {
                const type = getOperationType(t);
                return (
                  <tr key={t.id_transaction}>
                    <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                    <td><strong>{type}</strong></td>
                    <td>{t.amount.toLocaleString('ru-RU')}</td>
                    <td>{t.currency_code}</td>
                    <td>{t.description || '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card.Body>

      {/* Модалка перевода */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Выполнить перевод от имени клиента</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            {modalSuccess && <Alert variant="success">{modalSuccess}</Alert>}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Счёт отправителя</Form.Label>
                  <Form.Select name="senderAccount" value={transferData.senderAccount} onChange={handleInputChange} required>
                    <option value="">Выберите счёт</option>
                    {mockAccounts.map(acc => (
                      <option key={acc.id_account} value={acc.id_account}>
                        {acc.account_number} (ID: {acc.id_client})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Счёт получателя</Form.Label>
                  <Form.Select name="receiverAccount" value={transferData.receiverAccount} onChange={handleInputChange} required>
                    <option value="">Выберите счёт</option>
                    {mockAccounts.map(acc => (
                      <option key={acc.id_account} value={acc.id_account}>
                        {acc.account_number} (ID: {acc.id_client})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Сумма</Form.Label>
              <Form.Control type="number" name="amount" value={transferData.amount} onChange={handleInputChange} min="0.01" step="0.01" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={transferData.description} onChange={handleInputChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Отмена</Button>
            <Button variant="success" type="submit">Выполнить</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default TransactionList;