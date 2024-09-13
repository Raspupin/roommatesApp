import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Use useLocation to access passed data
import CompanyLogo from "../components/CompanyLogo";

const ChooseApartment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const { email } = location.state || {}; // Extract the email from the passed state
  console.log("Email passed to choose-apartment:", email);

  const [joinOrCreate, setJoinOrCreate] = useState("join");
  const [apartmentId, setApartmentId] = useState(""); // For joining
  const [apartmentName, setApartmentName] = useState(""); // For creating
  const [address, setAddress] = useState(""); // For creating
  const [city, setCity] = useState(""); // For creating
  const [error, setError] = useState("");

  // Ensure email is available
  if (!email) {
    setError("Email is missing. Please go back to registration.");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Email is missing.");
      return;
    }

    try {
      if (joinOrCreate === "join") {
        // API call to join existing apartment
        const response = await axios.post(
          "http://localhost:5000/api/join-apartment",
          { apartmentId, email }
        );
        if (response.status === 200) {
          navigate("/login");
        }
      } else {
        // API call to create a new apartment
        const response = await axios.post(
          "http://localhost:5000/api/create-apartment",
          {
            apartmentName,
            address,
            email,
            city,
          }
        );
        if (response.status === 200) {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during apartment selection:", error);
      setError("Failed to proceed. Please try again.");
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
        <Typography variant="h4" component="h1" gutterBottom>
          Join or Create an Apartment
        </Typography>

        <RadioGroup
          value={joinOrCreate}
          onChange={(e) => setJoinOrCreate(e.target.value)}
          row
        >
          <FormControlLabel
            value="join"
            control={<Radio />}
            label="Join Existing Apartment"
          />
          <FormControlLabel
            value="create"
            control={<Radio />}
            label="Create New Apartment"
          />
        </RadioGroup>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          {joinOrCreate === "join" ? (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Apartment ID"
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
            />
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Apartment Name"
                value={apartmentName}
                onChange={(e) => setApartmentName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </>
          )}

          {error && <Typography color="error">{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {joinOrCreate === "join" ? "Join Apartment" : "Create Apartment"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChooseApartment;
