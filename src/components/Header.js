import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Roommates Management App
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Features</Button>
        <Button color="inherit">Contact</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
