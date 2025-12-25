// src/pages/Settings/SettingsPage.js
import React from 'react';
import { Button, Container } from 'react-bootstrap';

const SettingsPage = () => {
  const handleResetDatabase = () => {
    if (window.confirm('Перезагрузить базу данных?\nВсе данные (пользователи, счета, переводы, продукты и т.д.) будут сброшены к исходному состоянию.')) {
      localStorage.clear();
      alert('База данных успешно перезагружена!\nСтраница обновится автоматически.');
      window.location.reload();
    }
  };

  return (
    <Container className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="mb-5 text-danger fw-bold display-4">
        Перезагрузка базы данных
      </h1>

      <Button
        variant="danger"
        size="lg"
        className="px-5 py-4 shadow-lg"
        style={{ fontSize: '1.8rem', minWidth: '400px' }}
        onClick={handleResetDatabase}
      >
        Перезагрузить базу данных
      </Button>

    </Container>
  );
};

export default SettingsPage;