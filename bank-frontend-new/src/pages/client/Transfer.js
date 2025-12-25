import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  SwapHoriz,
  AccountBalanceWallet,
  CreditCard,
  Person,
  QrCode,
  History,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Transfer = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    category: 'transfer',
  });

  const steps = ['Выбор счетов', 'Ввод суммы', 'Подтверждение'];

  const mockAccounts = [
    { id: 1, number: '40817810000000012345', name: 'Основной расчётный', balance: 398500, currency: 'RUB', type: 'current' },
    { id: 2, number: '40817810800000054321', name: 'Сберегательный счёт', balance: 850000, currency: 'RUB', type: 'savings' },
    { id: 3, number: '40817840900000098765', name: 'Долларовый счёт', balance: 5200, currency: 'USD', type: 'currency' },
  ];

  const recentTransfers = [
    { id: 1, name: 'Иванов И.И.', account: '40817810000000011111', amount: 15000, date: '22.12.2025' },
    { id: 2, name: 'ООО "Ромашка"', account: '40702810000000022222', amount: 45000, date: '20.12.2025' },
    { id: 3, name: 'Петрова А.С.', account: '40817810800000033333', amount: 25000, date: '18.12.2025' },
  ];

  const transferCategories = [
    { value: 'transfer', label: 'Перевод между счетами' },
    { value: 'payment', label: 'Оплата услуг' },
    { value: 'loan', label: 'Погашение кредита' },
    { value: 'family', label: 'Семейный перевод' },
    { value: 'business', label: 'Бизнес-платеж' },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.fromAccount && formData.toAccount && formData.amount > 0 && formData.fromAccount !== formData.toAccount) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveStep(0);
        setFormData({
          fromAccount: '',
          toAccount: '',
          amount: '',
          description: '',
          category: 'transfer',
        });
      }, 3000);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return React.createElement(Box, { sx: { mt: 4 } },
          React.createElement(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 } }, 'Выберите счета для перевода'),
          React.createElement(Grid, { container: true, spacing: 3 },
            React.createElement(Grid, { item: true, xs: 12, md: 6 },
              React.createElement(TextField, {
                select: true,
                label: "Со счёта",
                name: "fromAccount",
                fullWidth: true,
                value: formData.fromAccount,
                onChange: handleChange,
                required: true,
                InputProps: {
                  startAdornment: React.createElement(InputAdornment, { position: "start" },
                    React.createElement(AccountBalanceWallet, { color: "primary" })
                  ),
                }
              },
                mockAccounts.map((acc) =>
                  React.createElement(MenuItem, { key: acc.id, value: acc.id },
                    React.createElement(Box, { sx: { width: '100%' } },
                      React.createElement(Typography, { variant: "subtitle2", sx: { fontWeight: 600 } }, acc.name),
                      React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                        `${acc.number.slice(0, 4)} **** ${acc.number.slice(-4)}`
                      ),
                      React.createElement(Typography, { variant: "body2", sx: { mt: 0.5, color: 'primary.main', fontWeight: 600 } },
                        `${acc.balance.toLocaleString('ru-RU')} ${acc.currency}`
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(Grid, { item: true, xs: 12, md: 6 },
              React.createElement(TextField, {
                select: true,
                label: "На счёт",
                name: "toAccount",
                fullWidth: true,
                value: formData.toAccount,
                onChange: handleChange,
                required: true,
                InputProps: {
                  startAdornment: React.createElement(InputAdornment, { position: "start" },
                    React.createElement(CreditCard, { color: "primary" })
                  ),
                }
              },
                mockAccounts.map((acc) =>
                  React.createElement(MenuItem, { key: acc.id, value: acc.id },
                    React.createElement(Box, { sx: { width: '100%' } },
                      React.createElement(Typography, { variant: "subtitle2", sx: { fontWeight: 600 } }, acc.name),
                      React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                        `${acc.number.slice(0, 4)} **** ${acc.number.slice(-4)}`
                      ),
                      React.createElement(Typography, { variant: "body2", sx: { mt: 0.5, color: 'primary.main', fontWeight: 600 } },
                        `${acc.balance.toLocaleString('ru-RU')} ${acc.currency}`
                      )
                    )
                  )
                )
              )
            )
          ),
          React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', my: 3 } },
            React.createElement(SwapHoriz, { sx: { fontSize: 45, color: 'primary.main' } })
          ),
          React.createElement(Button, {
            variant: "outlined",
            startIcon: React.createElement(QrCode),
            fullWidth: true,
            sx: { mt: 2 }
          }, 'Сканировать QR-код для перевода')
        );
      case 1:
        return React.createElement(Box, { sx: { mt: 4 } },
          React.createElement(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 } }, 'Введите сумму и описание перевода'),
          React.createElement(TextField, {
            label: "Сумма перевода",
            name: "amount",
            type: "number",
            fullWidth: true,
            value: formData.amount,
            onChange: handleChange,
            required: true,
            InputProps: {
              endAdornment: React.createElement(InputAdornment, { position: "end" },
                React.createElement(Typography, { color: "text.secondary" }, '₽')
              ),
            },
            sx: { mb: 3 }
          }),
          React.createElement(TextField, {
            label: "Назначение платежа",
            name: "description",
            fullWidth: true,
            value: formData.description,
            onChange: handleChange,
            multiline: true,
            rows: 3,
            sx: { mb: 3 }
          }),
          React.createElement(TextField, {
            select: true,
            label: "Категория перевода",
            name: "category",
            fullWidth: true,
            value: formData.category,
            onChange: handleChange
          },
            transferCategories.map((category) =>
              React.createElement(MenuItem, { key: category.value, value: category.value }, category.label)
            )
          )
        );
      case 2:
        const fromAccount = mockAccounts.find(acc => acc.id.toString() === formData.fromAccount);
        const toAccount = mockAccounts.find(acc => acc.id.toString() === formData.toAccount);

        const descriptionElement = formData.description
          ? React.createElement(Box, {
              key: 'description',
              sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }
            },
              React.createElement(Typography, { color: "text.secondary" }, 'Назначение:'),
              React.createElement(Typography, { sx: { fontWeight: 600, textAlign: 'right' } }, formData.description)
            )
          : null;

        return React.createElement(Box, { sx: { mt: 4 } },
          React.createElement(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 } }, 'Подтвердите данные перевода'),
          React.createElement(Card, { variant: "outlined", sx: { mb: 3 } },
            React.createElement(CardContent, {},
              React.createElement(Typography, { variant: "subtitle1", sx: { fontWeight: 700, mb: 2, color: 'primary.main' } }, 'Детали перевода'),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 } },
                React.createElement(Typography, { color: "text.secondary" }, 'Отправитель:'),
                React.createElement(Typography, { sx: { fontWeight: 600 } }, fromAccount?.name || 'Не выбран')
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 } },
                React.createElement(Typography, { color: "text.secondary" }, 'Получатель:'),
                React.createElement(Typography, { sx: { fontWeight: 600 } }, toAccount?.name || 'Не выбран')
              ),
              React.createElement(Divider, { sx: { my: 2 } }),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 } },
                React.createElement(Typography, { color: "text.secondary" }, 'Сумма:'),
                React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, color: 'primary.main' } },
                  `${formData.amount ? parseInt(formData.amount).toLocaleString('ru-RU') : '0'} ₽`
                )
              ),
              descriptionElement
            )
          ),
          React.createElement(Alert, {
            severity: "info",
            sx: { mb: 3 }
          }, 'Комиссия за перевод не взимается. Средства поступят в течение нескольких минут.'),
          React.createElement(TextField, {
            label: "Код подтверждения",
            placeholder: "Введите SMS-код",
            fullWidth: true,
            sx: { mb: 2 }
          })
        );
      default:
        return 'Неизвестный шаг';
    }
  };

  return React.createElement(Container, { maxWidth: "lg", sx: { py: 5 } },
    // Заголовок
    React.createElement(Box, { sx: { mb: 5, textAlign: 'center' } },
      React.createElement(Typography, {
        variant: "h3",
        sx: { fontWeight: 700, color: 'primary.main', mb: 0.5 }
      }, `Перевод средств, ${user?.fullName?.split(' ')[0] || user?.login || ''}`),
      React.createElement(Typography, {
        variant: "h6",
        color: "text.secondary"
      }, 'Безопасный перевод между счетами')
    ),

    // Успешное сообщение
    success && React.createElement(Alert, {
      severity: "success",
      sx: { mb: 3 }
    }, `Перевод ${formData.amount} ₽ успешно выполнен!`),

    React.createElement(Grid, { container: true, spacing: 4 },
      // Основная форма
      React.createElement(Grid, { item: true, xs: 12, lg: 8 },
        React.createElement(Paper, { sx: { p: 5, borderRadius: 4, boxShadow: 3 } },
          // Степпер
          React.createElement(Stepper, { activeStep: activeStep, sx: { mb: 5 } },
            steps.map((label) =>
              React.createElement(Step, { key: label },
                React.createElement(StepLabel, {}, label)
              )
            )
          ),

          getStepContent(activeStep),

          // Кнопки навигации
          React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 4 } },
            React.createElement(Button, {
              disabled: activeStep === 0,
              onClick: handleBack,
              variant: "outlined"
            }, 'Назад'),
            React.createElement(Button, {
              variant: "contained",
              onClick: handleNext,
              disabled: !formData.fromAccount || !formData.toAccount || !formData.amount || formData.fromAccount === formData.toAccount,
              sx: {
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3
              }
            }, activeStep === steps.length - 1 ? 'Подтвердить перевод' : 'Далее')
          )
        )
      ),

      // Боковая панель
      React.createElement(Grid, { item: true, xs: 12, lg: 4 },
        // Быстрые переводы
        React.createElement(Card, { sx: { mb: 3 } },
          React.createElement(CardContent, {},
            React.createElement(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 } },
              React.createElement(History, { fontSize: "small" }),
              'Последние переводы'
            ),
            React.createElement(Stack, { spacing: 2 },
              recentTransfers.map((transfer) =>
                React.createElement(Box, {
                  key: transfer.id,
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                  }
                },
                  React.createElement(Avatar, { sx: { bgcolor: 'primary.light', color: 'primary.main' } },
                    React.createElement(Person)
                  ),
                  React.createElement(Box, { sx: { flexGrow: 1 } },
                    React.createElement(Typography, { variant: "subtitle2", sx: { fontWeight: 600 } }, transfer.name),
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                      `${transfer.account.slice(0, 4)} **** ${transfer.account.slice(-4)}`
                    )
                  ),
                  React.createElement(Chip, {
                    label: `${transfer.amount.toLocaleString('ru-RU')} ₽`,
                    size: "small",
                    sx: { fontWeight: 700 }
                  })
                )
              )
            ),
            React.createElement(Button, {
              startIcon: React.createElement(Bookmark),
              fullWidth: true,
              sx: { mt: 2 }
            }, 'Сохранить как шаблон')
          )
        ),

        // Информация
        React.createElement(Card, {},
          React.createElement(CardContent, {},
            React.createElement(Typography, { variant: "h6", sx: { mb: 2, fontWeight: 700 } }, 'Информация о переводе'),
            React.createElement(Stack, { spacing: 2 },
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Комиссия'),
                React.createElement(Chip, { label: "0 ₽", size: "small", color: "success" })
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Лимит перевода'),
                React.createElement(Typography, { variant: "caption", sx: { fontWeight: 700 } }, '500 000 ₽ в день')
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Время зачисления'),
                React.createElement(Typography, { variant: "caption", sx: { fontWeight: 700 } }, 'До 5 минут')
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Безопасность'),
                React.createElement(Chip, { label: "SSL-шифрование", size: "small", color: "info" })
              )
            )
          )
        )
      )
    )
  );
};

export default Transfer;