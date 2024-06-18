import React from 'react';
import { Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import './styles/globalStyles.css';

function App() {
  return (
    <>
      <Header />
      <Container sx={{position:'relative', zIndex:'1'}} style={{ minHeight: 'calc(100vh - 64px - 64px)', padding: '2rem' }}>
        <Login/>
      </Container>
      <Footer />
    </>
  );
}

export default App;
