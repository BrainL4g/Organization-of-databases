import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Container,
  IconButton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, AccountBalance } from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    full_name: '',
    password: '',
  });
  const [role, setRole] = useState('client');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(formData, role)) {
      navigate('/dashboard');
    } else {
      alert('Логин или email уже существует');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <AccountBalance sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Автоматизированная банковская система
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Открытие нового счёта
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            position: 'relative',
          }}
        >
          {/* Кнопка назад внутри формы */}
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              Открытие счёта
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Заполните форму для создания нового аккаунта
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Роль</InputLabel>
              <Select
                value={role}
                onChange={handleRoleChange}
                label="Роль"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="client">Клиент</MenuItem>
                <MenuItem value="employee">Сотрудник</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Логин"
              name="login"
              fullWidth
              margin="normal"
              value={formData.login}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="ФИО"
              name="full_name"
              fullWidth
              margin="normal"
              value={formData.full_name}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Подтвердите пароль"
              type="password"
              fullWidth
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(13, 71, 161, 0.3)',
                },
              }}
            >
              Открыть счёт
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть счёт?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  Войдите в систему
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Открывая счёт, вы соглашаетесь с{' '}
            <Link href="#" sx={{ color: 'primary.main' }}>
              условиями использования
            </Link>{' '}
            и{' '}
            <Link href="#" sx={{ color: 'primary.main' }}>
              политикой конфиденциальности
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;