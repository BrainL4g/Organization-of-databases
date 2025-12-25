import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Link,
  Container,
  Stack,
  IconButton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, AccountBalance } from '@mui/icons-material';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const { login: authLogin, recoverAccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authLogin(login, password)) {
      navigate('/dashboard');
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    if (recoverAccess(recoveryEmail)) {
      alert('Инструкции отправлены на email');
    } else {
      alert('Email не найден');
    }
    setShowRecovery(false);
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
            Вход в личный кабинет
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
              {showRecovery ? 'Восстановление доступа' : 'Вход в систему'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {showRecovery
                ? 'Введите email для восстановления пароля'
                : 'Введите ваши данные для входа'}
            </Typography>
          </Box>

          {!showRecovery ? (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Логин"
                fullWidth
                margin="normal"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Link
                component="button"
                variant="body2"
                onClick={() => setShowRecovery(true)}
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 1,
                  mb: 3,
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Забыли пароль?
              </Link>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(13, 71, 161, 0.25)',
                  },
                }}
              >
                Войти
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography color="text.secondary">или</Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderWidth: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Открыть счёт
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRecovery}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  }}
                >
                  Восстановить
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => setShowRecovery(false)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                  }}
                >
                  Назад ко входу
                </Button>
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Впервые в нашем банке?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                Откройте счёт бесплатно
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;