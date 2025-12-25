// src/pages/Accounts/AccountList.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { mockAccounts } from '../../data/mockData';

const AccountList = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Счета клиентов</h2>
        <Button>Открыть новый счёт</Button>
      </div>

      <Table striped bordered hover>
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
          {mockAccounts.map(acc => (
            <tr key={acc.id_account}>
              <td>{acc.account_number}</td>
              <td>{acc.id_client}</td>
              <td>{acc.balance.toLocaleString('ru-RU')} ₽</td>
              <td>{acc.currency_code}</td>
              <td>{acc.is_blocked ? <span className="text-danger">Заблокирован</span> : <span className="text-success">Активен</span>}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">История</Button>
                {acc.is_blocked ?
                  <Button variant="success" size="sm">Разблок.</Button> :
                  <Button variant="warning" size="sm">Заблок.</Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AccountList;