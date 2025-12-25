import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import {
  Security,
  DevicesOther,
  AutoAwesome,
  VerifiedUser,
  Support,
  Speed,
} from '@mui/icons-material';
import Layout from '../components/layout/Layout';
import FeatureCard from '../components/ui/FeatureCard';

function About() {
  return (
    <Layout>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            О нашем банке
          </Typography>
          <Typography sx={{ fontSize: 17, opacity: 0.9 }}>
            Удобные и безопасные финансовые решения
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 7 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Кто мы
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
          Digital Bank — современный онлайн-банк, сочетающий надёжность и технологии.
        </Typography>

        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Более 10 лет развиваем продукты для клиентов.
        </Typography>
      </Container>

      <Divider />

      <Container maxWidth="lg" sx={{ py: 9 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, mb: 5, textAlign: 'center' }}
        >
          Преимущества
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<Security />}
              title="Безопасность"
              text="Защита данных клиентов"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<DevicesOther />}
              title="Удобство"
              text="Доступ 24/7 с любого устройства"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<AutoAwesome />}
              title="Инновации"
              text="Передовые технологии"
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', py: 9 }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} textAlign="center">
            <Grid item xs={12} md={4}>
              <VerifiedUser sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="h6" fontWeight={500}>
                Лицензированный банк
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Лицензия ЦБ РФ
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Support sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="h6" fontWeight={500}>
                Поддержка 24/7
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Помощь клиентам
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Speed sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="h6" fontWeight={500}>
                Мгновенные операции
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Переводы за секунды
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 9, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Банк будущего
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Миллионы клиентов доверяют нам.
        </Typography>
      </Container>
    </Layout>
  );
}

export default About;