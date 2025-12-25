import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  alpha,
} from '@mui/material';
import {
  AccountBalance,
  Security,
  Speed,
  Savings,
  PhoneIphone,
  SupportAgent,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Безопасность',
      description: 'Многоуровневая защита данных и транзакций',
      color: '#0d47a1',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Скорость',
      description: 'Мгновенные переводы и операции',
      color: '#1565c0',
    },
    {
      icon: <Savings sx={{ fontSize: 40 }} />,
      title: 'Выгода',
      description: 'Доходные вклады и низкие ставки',
      color: '#2e7d32',
    },
    {
      icon: <PhoneIphone sx={{ fontSize: 40 }} />,
      title: 'Удобство',
      description: 'Управление финансами с любого устройства',
      color: '#43a047',
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      title: 'Поддержка',
      description: 'Круглосуточная помощь клиентам',
      color: '#1976d2',
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Надёжность',
      description: 'Лицензия ЦБ РФ и страхование вкладов',
      color: '#0a3570',
    },
  ];

  const advantages = [
    'Онлайн-открытие счёта за 5 минут',
    'Мгновенные переводы без комиссии',
    'Высокие ставки по вкладам',
    'Круглосуточная поддержка',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      {/* Герой-секция */}
      <Box
        sx={{
          pt: 20,
          pb: 15,
          background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}
              >
                Банк нового поколения
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 5,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                Все банковские услуги онлайн — безопасно, быстро и удобно.
                Управляйте финансами в одном приложении.
              </Typography>

              {/* Центрированные кнопки */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mb: 6,
                flexWrap: 'wrap',
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    minWidth: '200px',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Открыть счёт
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    minWidth: '200px',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Войти в систему
                </Button>
              </Box>

              {/* Блок Преимущества системы - под кнопками */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4
              }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 4,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    width: '100%',
                    maxWidth: '500px',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: 700,
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    Преимущества системы:
                  </Typography>
                  <Stack spacing={2}>
                    {advantages.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <CheckCircle sx={{ color: '#4caf50', fontSize: 28, flexShrink: 0 }} />
                        <Typography sx={{
                          flex: 1,
                          fontSize: '1.1rem',
                          fontWeight: 500,
                        }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Особенности */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: 'primary.dark',
            fontWeight: 700,
          }}
        >
          Почему выбирают нас
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 8,
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Современные технологии и надёжность в каждом решении
        </Typography>

        {/* Фиксированная сетка 2x3 */}
        <Grid container spacing={4} justifyContent="center">
          {features.slice(0, 3).map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                  border: `2px solid ${alpha(feature.color, 0.2)}`,
                  borderRadius: 3,
                  bgcolor: alpha(feature.color, 0.03),
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '280px',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(feature.color, 0.15)}`,
                    borderColor: alpha(feature.color, 0.4),
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(feature.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: feature.color,
                    transition: 'transform 0.4s ease',
                  }}
                  className="feature-icon"
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: 'primary.dark',
                    fontSize: '1.4rem',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Вторая строка из 3 блоков */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {features.slice(3, 6).map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                  border: `2px solid ${alpha(feature.color, 0.2)}`,
                  borderRadius: 3,
                  bgcolor: alpha(feature.color, 0.03),
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '280px',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(feature.color, 0.15)}`,
                    borderColor: alpha(feature.color, 0.4),
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(feature.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: feature.color,
                    transition: 'transform 0.4s ease',
                  }}
                  className="feature-icon"
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: 'primary.dark',
                    fontSize: '1.4rem',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA секция */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #f5f9ff 0%, #e8f2ff 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(13, 71, 161, 0.2), transparent)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 800,
              color: 'primary.dark',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Начните управлять финансами уже сегодня
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 300,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            Присоединяйтесь к тысячам довольных клиентов. Откройте счёт онлайн за 5 минут
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            endIcon={<ArrowForward />}
            sx={{
              px: 8,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
              boxShadow: '0 10px 30px rgba(13, 71, 161, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 35px rgba(13, 71, 161, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Начать сейчас
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;