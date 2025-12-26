// src/pages/TaskTracker.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, ProgressBar, Alert } from 'react-bootstrap';

const tasks = [
  {
    section: '1. Клиент',
    subsections: [
      {
        title: '1.1. Регистрация и вход',
        items: [
          'Регистрация клиента',
          'Форма: ФИО, дата рождения, адрес, телефон, почта, паспортные данные',
          'Авторизация по логину/паролю',
          'Восстановление доступа'
        ]
      },
      {
        title: '1.2. Просмотр информации',
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
        title: '1.3. Операции со счетами',
        items: [
          'Перевод между своими счетами',
          'Перевод другому клиенту',
          'Пополнение счёта',
          'Снятие средств'
        ]
      },
      {
        title: '1.4. Заявки на продукты',
        items: [
          'Подача заявки на кредит',
          'Подача заявки на депозит',
          'Подача заявки на карту'
        ]
      },
      {
        title: '1.5. Депозиты и кредиты',
        items: [
          'Просмотр действующих депозитов',
          'Сумма, процент, срок, начисленные проценты',
          'Просмотр кредитов'
        ]
      }
    ]
  },
  {
    section: '2. Сотрудник банка',
    subsections: [
      {
        title: '2.1. Работа с клиентами',
        items: [
          'Открытие/закрытие счетов',
          'Выбор типа счёта, валюты, генерация номера счёта',
          'Блокировка/разблокировка счетов'
        ]
      },
      {
        title: '2.2. Обработка заявок',
        items: [
          'Рассмотрение заявок на продукты',
          'Одобрение/отклонение',
          'Подписание договора'
        ]
      },
      {
        title: '2.3. Проведение операций по заявке клиента',
        items: [
          'Ручное проведение транзакций',
          'Подтверждение транзакции',
          'Начисление процентов по депозитам',
          'Автоматическое или ручное начисление'
        ]
      },
      {
        title: '2.4. Просмотр справочников',
        items: [
          'Клиенты',
          'Поиск по ФИО, телефону, email',
          'Счета',
          'Фильтр по клиенту, валюте, статусу',
          'Транзакции',
          'История операций по клиенту/счёту'
        ]
      }
    ]
  },
  {
    section: '3. Администратор системы',
    subsections: [
      {
        title: '3.1. Управление пользователями',
        items: [
          'Создание учётных записей сотрудников',
          'Изменение данных пользователей (логин, пароль, контакты)',
          'Блокировка/разблокировка учётных записей (клиентов и сотрудников)'
        ]
      },
      {
        title: '3.2. Управление банковскими продуктами',
        items: [
          'Создание/редактирование/удаление продуктов (кредиты, депозиты, карты)',
          'Настройка процентных ставок, сроков, лимитов',
          'Настройка типов счетов',
          'Настройка валют и курсов'
        ]
      },
      {
        title: '3.3. Ведение справочников-классификаторов',
        items: [
          'Статусы транзакций',
          'Типы продуктов'
        ]
      },
      {
        title: '3.4. Мониторинг и отчётность',
        items: [
          'Просмотр логов операций',
          'Формирование отчётов по клиентам',
          'Формирование отчётов по продуктам',
          'Формирование отчётов по транзакциям',
          'Фильтр по дате, статусу, типу операции'
        ]
      }
    ]
  }
];

const TaskTracker = () => {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('taskProgress');
    if (saved) {
      setChecked(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskProgress', JSON.stringify(checked));
  }, [checked]);

  const handleCheck = (sectionIndex, subIndex, itemIndex) => {
    const key = `${sectionIndex}-${subIndex}-${itemIndex}`;
    setChecked(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Подсчёт прогресса
  let totalTasks = 0;
  let completedTasks = 0;

  tasks.forEach((section, sIdx) => {
    section.subsections.forEach((sub, subIdx) => {
      sub.items.forEach((_, iIdx) => {
        totalTasks++;
        const key = `${sIdx}-${subIdx}-${iIdx}`;
        if (checked[key]) completedTasks++;
      });
    });
  });

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-gradient text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #0d6efd, #6610f2)' }}>
          <h2 className="mb-0 fw-bold">Прогресс по техническому заданию</h2>
        </Card.Header>
        <Card.Body className="p-5">
          <Alert variant={progress === 100 ? 'success' : progress >= 70 ? 'info' : 'warning'} className="text-center fs-4">
            <strong>Общий прогресс: {completedTasks} из {totalTasks} задач ({progress}%)</strong>
          </Alert>

          <ProgressBar
            animated
            now={progress}
            label={`${progress}% завершено`}
            variant={progress === 100 ? 'success' : progress >= 70 ? 'info' : 'warning'}
            className="mb-5 shadow-sm"
            style={{ height: '50px', fontSize: '1.4rem', fontWeight: 'bold' }}
            striped
          />

          {tasks.map((section, sIdx) => (
            <div key={sIdx} className="mb-5 p-4 rounded" style={{ backgroundColor: '#f8f9fa', borderLeft: '5px solid #0d6efd' }}>
              <h3 className="text-primary border-bottom pb-3 fw-bold">{section.section}</h3>
              {section.subsections.map((sub, subIdx) => (
                <div key={subIdx} className="mb-4 ms-4">
                  <h5 className="text-dark fw-semibold">{sub.title}</h5>
                  {sub.items.map((item, iIdx) => {
                    const key = `${sIdx}-${subIdx}-${iIdx}`;
                    const isChecked = checked[key] || false;

                    return (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={key}
                        label={item}
                        checked={isChecked}
                        onChange={() => handleCheck(sIdx, subIdx, iIdx)}
                        className="mb-3 fs-5"
                        style={{ fontSize: '1.1rem' }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskTracker;