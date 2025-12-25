// src/pages/Products/ProductList.js
import React from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { mockProducts } from '../../data/mockData';

const ProductList = () => {
  const handleApply = (productName) => {
    alert(`Заявка на продукт "${productName}" успешно подана и ожидает рассмотрения сотрудником банка`);
  };

  return (
    <div>
      <h2 className="mb-4">Банковские продукты</h2>

      <div className="row">
        {mockProducts.length === 0 ? (
          <div className="col-12">
            <Alert variant="info">
              Продукты пока не настроены администратором.
            </Alert>
          </div>
        ) : (
          mockProducts.map(product => (
            <div key={product.id_product} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <strong>Процентная ставка:</strong> {product.interest_rate}% годовых<br />
                    <strong>Срок:</strong> {product.term_months} месяцев<br />
                    <strong>Минимальная сумма:</strong>{' '}
                    {product.min_amount ? product.min_amount.toLocaleString('ru-RU') + ' ₽' : '—'}<br />
                    <strong>Максимальная сумма:</strong>{' '}
                    {product.max_amount ? product.max_amount.toLocaleString('ru-RU') + ' ₽' : '—'}<br />
                    <strong>Валюта:</strong> {product.currency_code}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => handleApply(product.name)}
                  >
                    Подать заявку
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;