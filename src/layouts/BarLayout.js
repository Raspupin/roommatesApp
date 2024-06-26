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
      <AppBar sx={{zIndex:'1300'}} position="sticky">
        <Toolbar>
          <IconButton LinkComponent={NavLink} to="login" edge="start" color="inherit" aria-label="menu" sx={{border:'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'}}}>
            <AccountBoxIcon/>
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            #UserName #ApartmentName
            </Typography>
            <Button LinkComponent={NavLink} to="notes" sx={{'&.active': {backgroundColor: '#66cef773',fontWeight:800},m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit">
              <EmailIcon sx={{mr:0.5}}/>Notes</Button>
            <Button LinkComponent={NavLink} to='myTasks' sx={{'&.active': {backgroundColor: '#66cef773',fontWeight:800},m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit">
              <AddTaskIcon sx={{mr:0.5}}/>Tasks</Button>
            <Button LinkComponent={NavLink} to='events' sx={{'&.active': {backgroundColor: '#66cef773',fontWeight:800},m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit">
              <EventIcon sx={{mr:0.5}}/>Events</Button>
            <Button LinkComponent={NavLink} to='myHome' sx={{'&.active': {backgroundColor: '#66cef773',fontWeight:800},m:0.5,borderLeft: 'rgba(192, 192, 192, 0.854) 2px solid','&:hover':{backgroundColor:'#66cef773'} }} color="inherit">
              <HomeIcon sx={{mr:0.5}}/>My Home</Button>
        </Toolbar>
      </AppBar>
    <main>
        <Outlet />
    </main>
    </div>
    
    );
}
