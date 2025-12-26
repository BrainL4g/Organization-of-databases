// src/pages/Admin/Classifiers.js
import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';

const productTypes = [
  { code: 'кредит', name: 'Кредит' },
  { code: 'депозит', name: 'Депозит' },
  { code: 'карта', name: 'Карта' }
];

const transactionStatuses = [
  { code: 'pending', name: 'В обработке' },
  { code: 'completed', name: 'Выполнена' },
  { code: 'rejected', name: 'Отклонена' }
];

const Classifiers = () => {
  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white">
          <h3>Справочники-классификаторы</h3>
        </Card.Header>
        <Card.Body>
          <h5>Типы продуктов</h5>
          <Table striped bordered>
            <thead><tr><th>Код</th><th>Название</th></tr></thead>
            <tbody>
              {productTypes.map(t => <tr key={t.code}><td>{t.code}</td><td>{t.name}</td></tr>)}
            </tbody>
          </Table>

          <h5 className="mt-4">Статусы транзакций</h5>
          <Table striped bordered>
            <thead><tr><th>Код</th><th>Название</th></tr></thead>
            <tbody>
              {transactionStatuses.map(t => <tr key={t.code}><td>{t.code}</td><td>{t.name}</td></tr>)}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Classifiers;