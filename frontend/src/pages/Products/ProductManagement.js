// src/pages/Products/ProductManagement.js
import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Table} from 'react-bootstrap';
import { mockProducts, saveData } from '../../data/mockData';

const ProductManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    interest_rate: '',
    term_months: '',
    min_amount: '',
    max_amount: '',
    currency_code: 'RUB'
  });
  const [message, setMessage] = useState({ text: '', variant: '' });

  const showMessage = (text, variant = 'success') => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: '', variant: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        interest_rate: product.interest_rate,
        term_months: product.term_months,
        min_amount: product.min_amount || '',
        max_amount: product.max_amount || '',
        currency_code: product.currency_code
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        interest_rate: '',
        term_months: '',
        min_amount: '',
        max_amount: '',
        currency_code: 'RUB'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rate = parseFloat(formData.interest_rate);
    const term = parseInt(formData.term_months);
    if (isNaN(rate) || isNaN(term) || rate < 0 || term <= 0) {
      showMessage('Проверьте ставку и срок', 'danger');
      return;
    }

    if (editingProduct) {
      // Редактирование
      Object.assign(editingProduct, {
        name: formData.name,
        interest_rate: rate,
        term_months: term,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
        currency_code: formData.currency_code
      });
      showMessage(`Продукт "${formData.name}" обновлён`);
    } else {
      // Добавление нового
      const newProduct = {
        id_product: mockProducts.length + 1,
        name: formData.name,
        interest_rate: rate,
        term_months: term,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
        currency_code: formData.currency_code
      };
      mockProducts.push(newProduct);
      showMessage(`Продукт "${formData.name}" добавлен`);
    }

    saveData();
    setShowModal(false);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Удалить продукт "${product.name}"?`)) {
      const index = mockProducts.findIndex(p => p.id_product === product.id_product);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        saveData();
        showMessage(`Продукт "${product.name}" удалён`);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Управление банковскими продуктами</h2>
        <Button variant="success" onClick={() => openModal()}>
          Добавить продукт
        </Button>
      </div>

      {message.text && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
          {message.text}
        </Alert>
      )}

      {mockProducts.length === 0 ? (
        <Alert variant="info">Продукты не настроены</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Название</th>
              <th>Ставка (%)</th>
              <th>Срок (мес.)</th>
              <th>Мин. сумма</th>
              <th>Макс. сумма</th>
              <th>Валюта</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map(product => (
              <tr key={product.id_product}>
                <td><strong>{product.name}</strong></td>
                <td>{product.interest_rate}%</td>
                <td>{product.term_months}</td>
                <td>{product.min_amount ? product.min_amount.toLocaleString('ru-RU') + ' ₽' : '—'}</td>
                <td>{product.max_amount ? product.max_amount.toLocaleString('ru-RU') + ' ₽' : '—'}</td>
                <td>{product.currency_code}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => openModal(product)}>
                    Редактировать
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальное окно добавления/редактирования */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{editingProduct ? 'Редактировать продукт' : 'Добавить новый продукт'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Название продукта</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Процентная ставка (% годовых)</Form.Label>
              <Form.Control type="number" step="0.1" name="interest_rate" value={formData.interest_rate} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Срок (в месяцах)</Form.Label>
              <Form.Control type="number" name="term_months" value={formData.term_months} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Минимальная сумма (опционально)</Form.Label>
              <Form.Control type="number" name="min_amount" value={formData.min_amount} onChange={handleChange} placeholder="Оставить пустым — без ограничения" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Максимальная сумма (опционально)</Form.Label>
              <Form.Control type="number" name="max_amount" value={formData.max_amount} onChange={handleChange} placeholder="Оставить пустым — без ограничения" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Валюта</Form.Label>
              <Form.Select name="currency_code" value={formData.currency_code} onChange={handleChange}>
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Сохранить изменения' : 'Добавить продукт'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;