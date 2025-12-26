// src/pages/Admin/CurrencySettings.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const CurrencySettings = () => {
  const [usdRate, setUsdRate] = useState(localStorage.getItem('usdRate') || '80');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    localStorage.setItem('usdRate', usdRate);
    setMessage('Курс USD/RUB успешно сохранён');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white text-center">
          <h3>Настройка курсов валют</h3>
        </Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Курс USD к RUB (1 USD = ? RUB)</Form.Label>
              <Form.Control
                type="number"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                min="1"
                step="0.01"
              />
              <Form.Text>Текущий курс используется при конвертации в переводах</Form.Text>
            </Form.Group>
            <Button variant="primary" onClick={handleSave}>Сохранить курс</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CurrencySettings;