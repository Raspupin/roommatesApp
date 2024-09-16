import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";
//Mui
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventIcon from "@mui/icons-material/Event";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";

export default function BarLayout() {
  const { user, setUser } = useContext(UserContext); // Access user and setUser from context
  const navigate = useNavigate(); // For redirecting the user

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.data.loggedIn) {
          setUser(response.data.user); // Set the user's firstName if logged in
        }
      } catch (error) {
        console.log("User not logged in");
        setUser(null); // If no user is logged in, reset to null
      }
    };

    fetchUser();
  }, [setUser]); // Empty dependency array ensures this runs once on component mount
  const handleSignOut = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
      setUser(null); // Reset the user state to null
      navigate("/login"); // Redirect to login or home page
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };
  return (
    <div>
      <AppBar sx={{ zIndex: "1300" }} position="sticky">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 0,
            position: "relative",
          }}
        >
          {/* Left side - Welcome message and apartment name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              LinkComponent={NavLink}
              to="login"
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
            <Typography variant="h6" sx={{ mx: 2 }}>
              {user ? `Welcome, ${user.firstName}` : "Welcome, Guest"}
            </Typography>
          </Box>

          {/* Center - Navigation links */}
          <Box
            sx={{
              position: "absolute", // Fix the center box in the middle of the screen
              left: "50%", // Move to 50% from the left
              transform: "translateX(-50%)", // Translate it back to perfectly center
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              LinkComponent={NavLink}
              to="myHome"
              sx={{
                "&.active": { backgroundColor: "#66cef773", fontWeight: 800 },
                m: 0.5,
                borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
                "&:hover": { backgroundColor: "#66cef773" },
              }}
              color="inherit"
            >
              <HomeIcon sx={{ mr: 0.5 }} />
              My Home
            </Button>
            <Button
              LinkComponent={NavLink}
              to="notes"
              sx={{
                "&.active": { backgroundColor: "#66cef773", fontWeight: 800 },
                m: 0.5,
                borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
                "&:hover": { backgroundColor: "#66cef773" },
              }}
              color="inherit"
            >
              <EmailIcon sx={{ mr: 0.5 }} />
              Notes
            </Button>
            <Button
              LinkComponent={NavLink}
              to="myTasks"
              sx={{
                "&.active": { backgroundColor: "#66cef773", fontWeight: 800 },
                m: 0.5,
                borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
                "&:hover": { backgroundColor: "#66cef773" },
              }}
              color="inherit"
            >
              <AddTaskIcon sx={{ mr: 0.5 }} />
              Tasks
            </Button>
            <Button
              LinkComponent={NavLink}
              to="events"
              sx={{
                "&.active": { backgroundColor: "#66cef773", fontWeight: 800 },
                m: 0.5,
                borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
                "&:hover": { backgroundColor: "#66cef773" },
              }}
              color="inherit"
            >
              <EventIcon sx={{ mr: 0.5 }} />
              Events
            </Button>
          </Box>

          {/* Right side - Sign out button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {user && (
              <Typography variant="h6" sx={{ mx: 2 }}>
                {`${user.apartmentName}`} ({`${user.apartmentId}`})
              </Typography>
            )}
            {user && (
              <Button
                onClick={handleSignOut}
                sx={{
                  m: 0.5,
                  borderLeft: "rgba(192, 192, 192, 0.854) 2px solid",
                  "&:hover": { backgroundColor: "#66cef773" },
                  color: "red",
                }}
                color="inherit"
              >
                Sign Out
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
