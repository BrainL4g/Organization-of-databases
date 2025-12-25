// src/pages/Accounts/AccountList.js
import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Badge, Alert } from 'react-bootstrap';
import { mockAccounts, saveData, mockTransactions } from '../../data/mockData';

const AccountList = () => {
  const [filterClientId, setFilterClientId] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAccounts = mockAccounts.filter(acc => {
    if (filterClientId && acc.id_client !== parseInt(filterClientId)) return false;
    if (filterCurrency && acc.currency_code !== filterCurrency) return false;
    if (filterStatus === 'active' && acc.is_blocked) return false;
    if (filterStatus === 'blocked' && !acc.is_blocked) return false;
    return true;
  });

  const handleToggleBlock = (account) => {
    account.is_blocked = !account.is_blocked;
    saveData();
    alert(`Счёт ${account.account_number} теперь ${account.is_blocked ? 'заблокирован' : 'разблокирован'}`);
  };

  const handleCloseAccount = (account) => {
    if (account.balance < 0) {
      alert('Нельзя закрыть счёт с отрицательным балансом! Сначала погасите задолженность.');
      return;
    }

    if (account.balance === 0) {
      if (window.confirm(`Закрыть счёт ${account.account_number} с нулевым балансом?`)) {
        mockAccounts.splice(mockAccounts.findIndex(a => a.id_account === account.id_account), 1);
        saveData();
        alert('Счёт успешно закрыт');
      }
      return;
    }

    // Баланс > 0 — ищем другой счёт клиента для перевода остатка
    const otherAccounts = mockAccounts.filter(
      a => a.id_client === account.id_client &&
           a.id_account !== account.id_account &&
           !a.is_blocked &&
           a.currency_code === account.currency_code
    );

    if (otherAccounts.length === 0) {
      alert('Нельзя закрыть счёт с положительным балансом! У клиента нет другого активного счёта в той же валюте для перевода остатка.');
      return;
    }

    // Выбираем первый подходящий счёт (можно потом сделать выбор, но для простоты — первый)
    const targetAccount = otherAccounts[0];

    if (window.confirm(
      `На счёте ${account.account_number} остаток ${account.balance.toLocaleString('ru-RU')} ${account.currency_code}.\n` +
      `Перевести остаток на счёт ${targetAccount.account_number} и закрыть текущий?`
    )) {
      // Переводим деньги
      targetAccount.balance += account.balance;

      // Создаём запись в транзакциях
      const newTransaction = {
        id_transaction: mockTransactions.length + 1,
        sender_account_id: account.id_account,
        receiver_account_id: targetAccount.id_account,
        amount: account.balance,
        currency_code: account.currency_code,
        created_at: new Date().toISOString(),
        description: `Автоматический перевод остатка при закрытии счёта ${account.account_number}`
      };
      mockTransactions.push(newTransaction);

      // Удаляем счёт
      mockAccounts.splice(mockAccounts.findIndex(a => a.id_account === account.id_account), 1);

      saveData();
      alert(`Остаток переведён на счёт ${targetAccount.account_number}. Счёт ${account.account_number} закрыт.`);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Счета клиентов</h2>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="ID клиента"
            value={filterClientId}
            onChange={(e) => setFilterClientId(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={filterCurrency} onChange={(e) => setFilterCurrency(e.target.value)}>
            <option value="">Все валюты</option>
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="secondary" onClick={() => {
            setFilterClientId('');
            setFilterCurrency('');
            setFilterStatus('all');
          }}>
            Сбросить
          </Button>
        </Col>
      </Row>

      {filteredAccounts.length === 0 ? (
        <Alert variant="info">Счета не найдены</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Номер счёта</th>
              <th>Клиент ID</th>
              <th>Баланс</th>
              <th>Валюта</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(acc => (
              <tr key={acc.id_account}>
                <td>{acc.account_number}</td>
                <td>{acc.id_client}</td>
                <td>{acc.balance.toLocaleString('ru-RU')} {acc.currency_code}</td>
                <td>{acc.currency_code}</td>
                <td>
                  <Badge bg={acc.is_blocked ? 'danger' : 'success'}>
                    {acc.is_blocked ? 'Заблокирован' : 'Активен'}
                  </Badge>
                </td>
                <td>
                  <Button variant="info" size="sm" className="me-2">История</Button>
                  <Button
                    variant={acc.is_blocked ? 'success' : 'warning'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleToggleBlock(acc)}
                  >
                    {acc.is_blocked ? 'Разблок.' : 'Заблок.'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCloseAccount(acc)}
                  >
                    Закрыть
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AccountList;