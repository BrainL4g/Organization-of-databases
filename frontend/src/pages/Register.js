import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    full_name: '',
    password: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(formData)) {
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Регистрация
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Логин"
            name="login"
            fullWidth
            margin="normal"
            value={formData.login}
            onChange={handleChange}
            required
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
          />
          <TextField
            label="ФИО"
            name="full_name"
            fullWidth
            margin="normal"
            value={formData.full_name}
            onChange={handleChange}
            required
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
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Зарегистрироваться
          </Button>
          <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>
            Уже есть аккаунт? Войти
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;