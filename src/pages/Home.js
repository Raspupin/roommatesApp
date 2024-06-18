import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import '../styles/home.css';

function Home() {
  return (
    <Container sx={{position:'relative',zIndex:'-1'}} className="content" >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Roommates Management App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Manage your tasks, expenses, and communications effortlessly.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  );
}

export default Home;
