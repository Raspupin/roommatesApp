import React from 'react';
import { Container, Typography, useTheme } from '@mui/material';

function Footer() {
  const theme = useTheme();

  return (
    <footer style={{ marginTop: 'auto', padding: '1rem 0', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, textAlign: 'center' }}>
      <Container>
        <Typography variant="body1">
          &copy; 2024 Roommates Management App. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
