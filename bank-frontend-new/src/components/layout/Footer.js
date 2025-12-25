import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'primary.dark',
        color: 'white',
        pt: 8,
        pb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* О банке */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Автоматизированная банковская система
              </Typography>
              <Typography sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Современные финансовые решения для жизни и бизнеса.
                Безопасность, удобство и инновации в каждом сервисе.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  bgcolor: alpha('#ffffff', 0.1),
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: alpha('#ffffff', 0.1),
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: alpha('#ffffff', 0.1),
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: alpha('#ffffff', 0.1),
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Навигация */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Навигация
            </Typography>
            <Stack spacing={2}>
              <Link
                href="/"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.9,
                  '&:hover': { opacity: 1, color: 'primary.light' },
                  transition: 'color 0.3s ease',
                }}
              >
                Главная
              </Link>
              <Link
                href="/about"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.9,
                  '&:hover': { opacity: 1, color: 'primary.light' },
                  transition: 'color 0.3s ease',
                }}
              >
                О банке
              </Link>
              <Link
                href="/login"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.9,
                  '&:hover': { opacity: 1, color: 'primary.light' },
                  transition: 'color 0.3s ease',
                }}
              >
                Вход в систему
              </Link>
              <Link
                href="/register"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.9,
                  '&:hover': { opacity: 1, color: 'primary.light' },
                  transition: 'color 0.3s ease',
                }}
              >
                Открыть счёт
              </Link>
            </Stack>
          </Grid>

          {/* Контакты */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Контакты
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Телефон</Typography>
                  <Typography sx={{ opacity: 0.9 }}>8 (800) 555-35-35</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Email</Typography>
                  <Typography sx={{ opacity: 0.9 }}>support@digitalbank.ru</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Адрес</Typography>
                  <Typography sx={{ opacity: 0.9 }}>г. Томск, ул. Федера Лыткина, 10</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Копирайт */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid',
            borderColor: alpha('#ffffff', 0.1),
            textAlign: 'center',
          }}
        >
          <Typography sx={{ opacity: 0.7, fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} Автоматизированная банковская система.
            Лицензия ЦБ РФ № 1234 от 01.01.2020
          </Typography>
          <Typography sx={{ opacity: 0.5, fontSize: '0.8rem', mt: 1 }}>
            Все права защищены. Использование материалов сайта возможно только с письменного согласия.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;