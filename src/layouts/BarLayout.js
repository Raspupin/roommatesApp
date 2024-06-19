import React from 'react'
import { NavLink,Outlet } from 'react-router-dom';

//Mui
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventIcon from '@mui/icons-material/Event';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';


export default function BarLayout() {
    const theme = useTheme();

    return (
        <div>
    <header>
      <AppBar sx={{zIndex:'1300'}} position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{border:'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'}}}>
            <AccountBoxIcon/>
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            #UserName #ApartmentName
            </Typography>
            <NavLink to="notes"><Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit"><EmailIcon sx={{mr:0.5}}/>Notes</Button></NavLink>
          <NavLink to='myTasks'><Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit"><AddTaskIcon sx={{mr:0.5}}/>Tasks</Button></NavLink>
          <NavLink to='events'><Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit"><EventIcon sx={{mr:0.5}}/>Events</Button></NavLink>
          <NavLink to='myHome'><Button sx={{m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit"><HomeIcon sx={{mr:0.5}}/>My Home</Button></NavLink>
        </Toolbar>
      </AppBar>
    </header>
    <main>
        <Outlet/>
    </main>
    </div>
    
    );
}
