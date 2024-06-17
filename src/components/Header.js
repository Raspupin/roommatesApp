import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventIcon from '@mui/icons-material/Event';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EmailIcon from '@mui/icons-material/Email';

function Header() {
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          #ApartmentName #UserName
        </Typography>
        <Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid' }} color="inherit"><EmailIcon sx={{mr:0.5}}/>Notes</Button>
        <Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid' }} color="inherit"><AddTaskIcon sx={{mr:0.5}}/>Tasks</Button>
        <Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid' }} color="inherit"><EventIcon sx={{mr:0.5}}/>Events</Button>
        <Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid' }} color="inherit"><AccountBoxIcon sx={{mr:0.5}}/>Profile</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
