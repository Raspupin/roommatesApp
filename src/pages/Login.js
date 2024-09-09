import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios"; // Import axios for making API calls
import { NavLink, useNavigate } from "react-router-dom";
import CompanyLogo from "../components/CompanyLogo";
import { UserContext } from "../components/UserContext";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // React Router hook for redirecting

  const { setUser } = useContext(UserContext); // Access setUser from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle error messages

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // After successful login, get the user details and update the context
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });

        if (userResponse.data.loggedIn) {
          setUser(userResponse.data.user); // Update the UserContext with the new user
        }

        // Redirect to the home page or another route after successful login
        navigate("/myHome");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          padding: isMobile ? 2 : 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          borderTop: "#78d0ff 40px solid",
        }}
      >
        <CompanyLogo />
        <Typography variant="h3" component="h1" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Display error message if login fails */}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "blue" }}
            component={NavLink}
            to="/register"
          >
            Don't have an account? Register here
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
