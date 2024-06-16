import React from 'react';
import { Container, Typography } from '@mui/material';
import './styles/App.css';
import Header from './components/Header.js';

function App() {
  return (
    <><Header />
    <Container>
      <Typography variant="h1">Roommates Management App</Typography>
      <Typography variant="body1">
        Welcome to your roommates management app. Here you can manage all tasks and activities.
      </Typography>
    </Container></>
  );
}


export default App;