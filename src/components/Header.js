import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventIcon from "@mui/icons-material/Event";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

function Header() {
  const theme = useTheme();
  const [user, setUser] = useState(null); // State to store user information

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // Send cookies with the request
        });

        if (response.status === 200 && response.data.loggedIn) {
          setUser(response.data.user); // Store user data if logged in
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppBar sx={{ zIndex: "1300" }} position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            border: "rgba(192, 192, 192, 0.854) 2px solid",
            "&:hover": { backgroundColor: "#66cef773" },
          }}
        >
          <AccountBoxIcon />
        </IconButton>

        {/* Conditionally render the welcome message */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {user ? `Welcome, ${user.firstName}` : "Welcome, Guest"}
        </Typography>

        <Button
          sx={{
            m: 0.5,
            borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
            "&:hover": { backgroundColor: "#66cef773" },
          }}
          color="inherit"
        >
          <EmailIcon sx={{ mr: 0.5 }} /> Notes
        </Button>
        <Button
          sx={{
            m: 0.5,
            borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
            "&:hover": { backgroundColor: "#66cef773" },
          }}
          color="inherit"
        >
          <AddTaskIcon sx={{ mr: 0.5 }} /> Tasks
        </Button>
        <Button
          sx={{
            m: 0.5,
            borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
            "&:hover": { backgroundColor: "#66cef773" },
          }}
          color="inherit"
        >
          <EventIcon sx={{ mr: 0.5 }} /> Events
        </Button>
        <Button
          sx={{
            m: 0.5,
            borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
            "&:hover": { backgroundColor: "#66cef773" },
          }}
          color="inherit"
        >
          <HomeIcon sx={{ mr: 0.5 }} /> My Home
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
