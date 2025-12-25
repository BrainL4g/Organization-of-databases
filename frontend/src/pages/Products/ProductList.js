// src/pages/Products/ProductList.js
import React from 'react';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { mockProducts } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';
import ProductManagement from './ProductManagement';

const ProductList = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const handleApply = (productName) => {
    alert(`Заявка на продукт "${productName}" успешно подана!`);
  };

  // Если админ — показываем управление продуктами
  if (isAdmin) {
    return <ProductManagement />;
  }

  // Для клиентов — карточки с кнопкой заявки
  return (
    <div>
      <h2 className="mb-4">Доступные банковские продукты</h2>

      {mockProducts.length === 0 ? (
        <Alert variant="info">В настоящее время продукты не доступны.</Alert>
      ) : (
        <Row>
          {mockProducts.map(product => (
            <Col md={6} lg={4} className="mb-4" key={product.id_product}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <strong>Ставка:</strong> {product.interest_rate}% годовых<br />
                    <strong>Срок:</strong> {product.term_months} месяцев<br />
                    <strong>Мин. сумма:</strong> {product.min_amount ? product.min_amount.toLocaleString('ru-RU') + ' ₽' : '—'}<br />
                    <strong>Макс. сумма:</strong> {product.max_amount ? product.max_amount.toLocaleString('ru-RU') + ' ₽' : '—'}<br />
                    <strong>Валюта:</strong> {product.currency_code}
                  </Card.Text>
                  <Button variant="primary" className="mt-auto" onClick={() => handleApply(product.name)}>
                    Подать заявку
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;