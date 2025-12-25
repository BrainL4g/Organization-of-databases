// src/pages/Transactions/TransactionList.js
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { mockAccounts, mockTransactions } from '../../data/mockData'; // Исправлено: добавлен mockTransactions, удалён неиспользуемый mockClients
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
    description: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Фильтрация транзакций для клиента (только связанные с его счетами)
  const clientAccountIds = mockAccounts
    .filter(acc => acc.id_client === 1) // Мок: клиент с id_client = 1
    .map(acc => acc.id_account);

  const filteredTransactions = isClient
    ? mockTransactions.filter(t =>
        clientAccountIds.includes(t.sender_account_id) ||
        clientAccountIds.includes(t.receiver_account_id)
      )
    : mockTransactions; // Для сотрудника/админа — все транзакции

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferData.senderAccount || !transferData.receiverAccount || !transferData.amount) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (parseFloat(transferData.amount) <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }

    // Мок: добавляем новую транзакцию
    const newTransaction = {
      id_transaction: mockTransactions.length + 1,
      sender_account_id: parseInt(transferData.senderAccount),
      receiver_account_id: parseInt(transferData.receiverAccount),
      amount: parseFloat(transferData.amount),
      description: transferData.description || 'Перевод между счетами',
      created_at: new Date().toISOString(),
      status_code: 'completed'
    };

    mockTransactions.push(newTransaction);
    setSuccess('Перевод успешно выполнен!');
    setError('');
    setTransferData({ senderAccount: '', receiverAccount: '', amount: '', description: '' });
    setShowTransferModal(false);
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

      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>№</th>
            <th>Дата и время</th>
            <th>Счёт отправителя</th>
            <th>Счёт получателя</th>
            <th>Сумма</th>
            <th>Описание</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Транзакций не найдено
              </td>
            </tr>
          ) : (
            filteredTransactions.map((t, index) => (
              <tr key={t.id_transaction}>
                <td>{index + 1}</td>
                <td>{new Date(t.created_at).toLocaleString('ru-RU')}</td>
                <td>{t.sender_account_id || '-'}</td>
                <td>{t.receiver_account_id || '-'}</td>
                <td className="text-end fw-bold">
                  {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('ru-RU')} ₽
                </td>
                <td>{t.description}</td>
                <td>
                  <span className="badge bg-success">Завершена</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Модальное окно для перевода — только для клиента */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Новый перевод средств</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
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
                  .filter(acc => acc.id_client === 1) // Только счета текущего клиента
                  .map(acc => (
                    <option key={acc.id_account} value={acc.id_account}>
                      {acc.account_number} (баланс: {acc.balance} ₽)
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
                {mockAccounts.map(acc => (
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
                placeholder="Например: Оплата услуг"
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