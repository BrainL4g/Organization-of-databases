import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Alert,
  IconButton,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  Save,
  Security,
  Notifications,
  Language,
  Person,
  Phone,
  Email,
  LocationOn,
  VerifiedUser,
  QrCode,
  CameraAlt,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '+7 (999) 123-45-67',
    address: user?.address || 'г. Москва, ул. Примерная, д. 1',
    birthDate: '15.03.1990',
    passport: '4512 123456',
    taxId: '123-456-789 01',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: true,
    biometricAuth: false,
    currency: 'RUB',
    language: 'ru',
    darkMode: false,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSettingChange = (name) => (e) => {
    setSettings({ ...settings, [name]: e.target.checked });
  };

  const handleSave = () => {
    // Здесь будет логика сохранения данных
    console.log('Сохранение данных:', profileData);
    setEditMode(false);
  };

  const tabs = [
    { label: 'Личные данные', icon: React.createElement(Person) },
    { label: 'Безопасность', icon: React.createElement(Security) },
    { label: 'Уведомления', icon: React.createElement(Notifications) },
    { label: 'Настройки', icon: React.createElement(Language) },
  ];

  const securityLog = [
    { id: 1, action: 'Вход в систему', date: '23.12.2025 15:30', ip: '192.168.1.1', device: 'Chrome, Windows' },
    { id: 2, action: 'Изменение пароля', date: '22.12.2025 10:15', ip: '192.168.1.1', device: 'Chrome, Windows' },
    { id: 3, action: 'Перевод средств', date: '21.12.2025 14:20', ip: '192.168.1.2', device: 'Mobile App, iOS' },
    { id: 4, action: 'Вход с нового устройства', date: '20.12.2025 09:45', ip: '95.31.18.123', device: 'Firefox, macOS' },
  ];

  // Создаем содержимое для каждой вкладки
  const getTabContent = (tabIndex) => {
    switch(tabIndex) {
      case 0: // Личные данные
        return React.createElement(Card, { key: 'personal' },
          React.createElement(CardContent, { sx: { p: 4 } },
            React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, mb: 4 } }, 'Личная информация'),
            React.createElement(Grid, { container: true, spacing: 3 },
              // ФИО
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "ФИО",
                  name: "fullName",
                  value: profileData.fullName,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode,
                  InputProps: {
                    startAdornment: React.createElement(Person, { sx: { mr: 1, color: 'text.secondary' } })
                  }
                })
              ),
              // Email
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "Email",
                  name: "email",
                  type: "email",
                  value: profileData.email,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode,
                  InputProps: {
                    startAdornment: React.createElement(Email, { sx: { mr: 1, color: 'text.secondary' } })
                  }
                })
              ),
              // Телефон
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "Телефон",
                  name: "phone",
                  value: profileData.phone,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode,
                  InputProps: {
                    startAdornment: React.createElement(Phone, { sx: { mr: 1, color: 'text.secondary' } })
                  }
                })
              ),
              // Дата рождения
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "Дата рождения",
                  name: "birthDate",
                  value: profileData.birthDate,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode
                })
              ),
              // Адрес
              React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(TextField, {
                  label: "Адрес",
                  name: "address",
                  value: profileData.address,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode,
                  InputProps: {
                    startAdornment: React.createElement(LocationOn, { sx: { mr: 1, color: 'text.secondary' } })
                  }
                })
              ),
              // Паспорт
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "Паспортные данные",
                  name: "passport",
                  value: profileData.passport,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode
                })
              ),
              // ИНН
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  label: "ИНН",
                  name: "taxId",
                  value: profileData.taxId,
                  onChange: handleInputChange,
                  fullWidth: true,
                  disabled: !editMode
                })
              )
            ),
            !editMode && React.createElement(Alert, {
              severity: "info",
              sx: { mt: 3 }
            }, 'Для изменения данных нажмите кнопку "Редактировать профиль"')
          )
        );

      case 1: // Безопасность
        return React.createElement(Grid, { container: true, spacing: 3, key: 'security' },
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(Card, {},
              React.createElement(CardContent, {},
                React.createElement(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 3 } }, 'Настройки безопасности'),
                React.createElement(Stack, { spacing: 3 },
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: settings.twoFactorAuth,
                      onChange: handleSettingChange('twoFactorAuth')
                    }),
                    label: React.createElement(Box, {},
                      React.createElement(Typography, { variant: "body1", sx: { fontWeight: 600 } }, 'Двухфакторная аутентификация'),
                      React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Дополнительная защита входа')
                    )
                  }),
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: settings.biometricAuth,
                      onChange: handleSettingChange('biometricAuth')
                    }),
                    label: React.createElement(Box, {},
                      React.createElement(Typography, { variant: "body1", sx: { fontWeight: 600 } }, 'Биометрическая аутентификация'),
                      React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Face ID / Touch ID')
                    )
                  }),
                  React.createElement(Button, {
                    variant: "contained",
                    fullWidth: true,
                    sx: { mt: 2 }
                  }, 'Изменить пароль')
                )
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(Card, {},
              React.createElement(CardContent, {},
                React.createElement(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 3 } }, 'История входа'),
                React.createElement(Stack, { spacing: 2 },
                  securityLog.map((log) =>
                    React.createElement(Box, {
                      key: log.id,
                      sx: {
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }
                    },
                      React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 } },
                        React.createElement(Typography, { variant: "subtitle2", sx: { fontWeight: 600 } }, log.action),
                        React.createElement(Typography, { variant: "caption", color: "text.secondary" }, log.date)
                      ),
                      React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                        React.createElement(Typography, { variant: "caption" }, log.device),
                        React.createElement(Typography, { variant: "caption", color: "text.secondary" }, log.ip)
                      )
                    )
                  )
                )
              )
            )
          )
        );

      case 2: // Уведомления
        return React.createElement(Card, { key: 'notifications' },
          React.createElement(CardContent, { sx: { p: 4 } },
            React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, mb: 4 } }, 'Настройки уведомлений'),
            React.createElement(Grid, { container: true, spacing: 3 },
              React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(FormControlLabel, {
                  control: React.createElement(Switch, {
                    checked: settings.emailNotifications,
                    onChange: handleSettingChange('emailNotifications')
                  }),
                  label: React.createElement(Box, {},
                    React.createElement(Typography, { variant: "body1", sx: { fontWeight: 600 } }, 'Email уведомления'),
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Получать уведомления на почту')
                  )
                })
              ),
              React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(FormControlLabel, {
                  control: React.createElement(Switch, {
                    checked: settings.smsNotifications,
                    onChange: handleSettingChange('smsNotifications')
                  }),
                  label: React.createElement(Box, {},
                    React.createElement(Typography, { variant: "body1", sx: { fontWeight: 600 } }, 'SMS уведомления'),
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Получать SMS на телефон')
                  )
                })
              )
            )
          )
        );

      case 3: // Настройки
        return React.createElement(Card, { key: 'settings' },
          React.createElement(CardContent, { sx: { p: 4 } },
            React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, mb: 4 } }, 'Общие настройки'),
            React.createElement(Grid, { container: true, spacing: 3 },
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  select: true,
                  label: "Язык интерфейса",
                  value: settings.language,
                  onChange: (e) => setSettings({ ...settings, language: e.target.value }),
                  fullWidth: true
                },
                  React.createElement(MenuItem, { value: "ru" }, 'Русский'),
                  React.createElement(MenuItem, { value: "en" }, 'English')
                )
              ),
              React.createElement(Grid, { item: true, xs: 12, md: 6 },
                React.createElement(TextField, {
                  select: true,
                  label: "Валюта отображения",
                  value: settings.currency,
                  onChange: (e) => setSettings({ ...settings, currency: e.target.value }),
                  fullWidth: true
                },
                  React.createElement(MenuItem, { value: "RUB" }, 'Рубли (RUB)'),
                  React.createElement(MenuItem, { value: "USD" }, 'Доллары (USD)'),
                  React.createElement(MenuItem, { value: "EUR" }, 'Евро (EUR)')
                )
              ),
              React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(FormControlLabel, {
                  control: React.createElement(Switch, {
                    checked: settings.darkMode,
                    onChange: handleSettingChange('darkMode')
                  }),
                  label: React.createElement(Box, {},
                    React.createElement(Typography, { variant: "body1", sx: { fontWeight: 600 } }, 'Тёмная тема'),
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, 'Включить тёмный режим интерфейса')
                  )
                })
              )
            )
          )
        );

      default:
        return null;
    }
  };

  return React.createElement(Container, { maxWidth: "xl", sx: { py: 4 } },
    // Заголовок
    React.createElement(Box, { sx: { mb: 5 } },
      React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 } },
        React.createElement(Box, {},
          React.createElement(Typography, {
            variant: "h3",
            sx: { fontWeight: 700, color: 'primary.main', mb: 0.5 }
          }, `Мой профиль, ${user?.fullName?.split(' ')[0] || user?.login || ''}`),
          React.createElement(Typography, {
            variant: "h6",
            color: "text.secondary"
          }, 'Управление личными данными и настройками')
        ),
        React.createElement(Button, {
          variant: editMode ? "contained" : "outlined",
          startIcon: editMode ? React.createElement(Save) : React.createElement(Edit),
          onClick: editMode ? handleSave : handleEditToggle,
          sx: {
            fontWeight: 700,
            px: 4,
          }
        }, editMode ? 'Сохранить изменения' : 'Редактировать профиль')
      ),

      // Табы
      React.createElement(Box, { sx: { borderBottom: 1, borderColor: 'divider' } },
        React.createElement(Tabs, {
          value: activeTab,
          onChange: handleTabChange,
          variant: "scrollable",
          scrollButtons: "auto"
        },
          tabs.map((tab, index) =>
            React.createElement(Tab, {
              key: index,
              label: tab.label,
              icon: tab.icon,
              iconPosition: "start"
            })
          )
        )
      )
    ),

    // Содержимое вкладок
    React.createElement(Grid, { container: true, spacing: 4 },
      // Левая колонка - профиль
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, { sx: { height: '100%' } },
          React.createElement(CardContent, { sx: { p: 4, textAlign: 'center' } },
            // Аватар
            React.createElement(Box, { sx: { position: 'relative', mb: 3 } },
              React.createElement(Avatar, {
                sx: {
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  border: '4px solid',
                  borderColor: 'primary.light',
                }
              }, user?.fullName?.charAt(0).toUpperCase() || 'К'),
              React.createElement(IconButton, {
                sx: {
                  position: 'absolute',
                  bottom: 10,
                  right: 'calc(50% - 70px)',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }
              }, React.createElement(CameraAlt))
            ),

            // Информация о клиенте
            React.createElement(Box, { sx: { mb: 4 } },
              React.createElement(Typography, { variant: "h5", sx: { fontWeight: 700, mb: 1 } }, user?.fullName || 'Клиент'),
              React.createElement(Chip, {
                label: "ПРЕМИУМ КЛИЕНТ",
                color: "primary",
                sx: {
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '0.9rem',
                  py: 1
                }
              }),
              React.createElement(Typography, {
                variant: "body2",
                color: "text.secondary",
                sx: { mb: 1 }
              }, `ID клиента: #${user?.id?.toString().padStart(6, '0') || '000001'}`),
              React.createElement(Chip, {
                icon: React.createElement(VerifiedUser),
                label: "Верифицирован",
                color: "success",
                size: "small",
                sx: { mb: 3 }
              })
            ),

            // QR код аккаунта
            React.createElement(Box, {
              sx: {
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 3,
                mb: 3
              }
            },
              React.createElement(Box, {
                sx: {
                  width: 150,
                  height: 150,
                  bgcolor: 'white',
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }
              },
                React.createElement(QrCode, { sx: { fontSize: 100, color: 'primary.main' } })
              ),
              React.createElement(Typography, {
                variant: "caption",
                color: "text.secondary",
                sx: { display: 'block' }
              }, 'QR-код для быстрого доступа')
            ),

            // Статистика
            React.createElement(Stack, { spacing: 2 },
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "body2", color: "text.secondary" }, 'Клиент с'),
                React.createElement(Typography, { variant: "body2", sx: { fontWeight: 700 } }, '15.01.2023')
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "body2", color: "text.secondary" }, 'Статус аккаунта'),
                React.createElement(Chip, { label: "Активен", size: "small", color: "success" })
              ),
              React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement(Typography, { variant: "body2", color: "text.secondary" }, 'Кредитный рейтинг'),
                React.createElement(Chip, { label: "850", size: "small", color: "warning" })
              )
            )
          )
        )
      ),

      // Правая колонка - контент вкладок
      React.createElement(Grid, { item: true, xs: 12, md: 8 },
        React.createElement(Box, { sx: { minHeight: 500 } },
          getTabContent(activeTab)
        )
      )
    )
  );
};

export default Profile;