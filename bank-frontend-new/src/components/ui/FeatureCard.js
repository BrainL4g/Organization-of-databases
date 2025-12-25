import React from 'react';
import { Card, Avatar, Typography } from '@mui/material';

function FeatureCard({ icon, title, text }) {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        textAlign: 'center',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(30,136,229,0.2)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          mx: 'auto',
          mb: 2,
          bgcolor: 'primary.light',
          color: 'primary.main',
        }}
      >
        {icon}
      </Avatar>

      <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ lineHeight: 1.5 }}>
        {text}
      </Typography>
    </Card>
  );
}

export default FeatureCard;