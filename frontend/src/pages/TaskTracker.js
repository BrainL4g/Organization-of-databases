// src/pages/TaskTracker.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, ProgressBar, Alert } from 'react-bootstrap';

const tasks = [
  {
    section: '1.1. Регистрация и вход',
    items: [
      'Регистрация клиента',
      'Форма: ФИО, дата рождения, адрес, телефон, почта, паспортные данные',
      'Авторизация по логину/паролю',
      'Восстановление доступа'
    ]
  },
  {
    section: '1.2. Просмотр информации',
    items: [
      'Список счетов клиента',
      'Баланс, валюта, статус',
      'Карты',
      'История операций',
      'Фильтр по дате, типу операции',
      'Вывод: дата, сумма, тип, статус'
    ]
  },
  {
    section: '1.3. Операции со счетами',
    items: [
      'Перевод между своими счетами',
      'Перевод другому клиенту',
      'Пополнение счёта',
      'Снятие средств'
    ]
  },
  {
    section: '1.4. Заявки на продукты',
    items: [
      'Подача заявки на кредит',
      'Подача заявки на депозит',
      'Подача заявки на карту'
    ]
  },
  {
    section: '1.5. Депозиты и кредиты',
    items: [
      'Просмотр действующих депозитов',
      'Сумма, процент, срок, начисленные проценты',
      'Просмотр кредитов'
    ]
  }
];

const TaskTracker = () => {
  const [checked, setChecked] = useState({});

  // Загружаем состояние из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('taskProgress');
    if (saved) {
      setChecked(JSON.parse(saved));
    }
  }, []);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('taskProgress', JSON.stringify(checked));
  }, [checked]);

  const handleCheck = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setChecked(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Подсчёт прогресса
  let totalTasks = 0;
  let completedTasks = 0;

  tasks.forEach((section, sIdx) => {
    section.items.forEach((_, iIdx) => {
      totalTasks++;
      const key = `${sIdx}-${iIdx}`;
      if (checked[key]) completedTasks++;
    });
  });

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white text-center">
          <h2>Прогресс по техническому заданию — Раздел "Клиент"</h2>
        </Card.Header>
        <Card.Body>
          <Alert variant="success" className="text-center">
            <strong>Готово: {completedTasks} из {totalTasks} ({progress}%)</strong>
          </Alert>

          <ProgressBar
            animated
            now={progress}
            label={`${progress}%`}
            variant="success"
            className="mb-4"
            style={{ height: '30px' }}
          />

          {tasks.map((section, sIdx) => (
            <div key={sIdx} className="mb-4">
              <h4 className="text-primary">{section.section}</h4>
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isChecked = checked[key] || false;

                return (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    id={key}
                    label={item}
                    checked={isChecked}
                    onChange={() => handleCheck(sIdx, iIdx)}
                    className="mb-2"
                    style={{ fontSize: '1.1rem' }}
                  />
                );
              })}
            </div>
          ))}
        </Card.Body>
        <Card.Footer className="text-muted text-center">
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TaskTracker;