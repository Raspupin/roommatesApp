import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const EventForm = ({ onEventCreated }) => {
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme(); // Access the MUI theme

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        {
          eventDesc,
          eventDate,
        },
        { withCredentials: true }
      );

      // Pass the new event back to the parent component
      onEventCreated(response.data.event);
      setEventDesc("");
      setEventDate("");
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to schedule the event.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        mb: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,

        color: theme.palette.secondary.contrastText, // Ensure text contrasts with background
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Shadow for the task box
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Schedule an Event
      </Typography>

      <TextField
        fullWidth
        label="Event Description"
        value={eventDesc}
        onChange={(e) => setEventDesc(e.target.value)}
        sx={{ mb: 2, maxWidth: 400 }} // Limit the width of the text field for better centering
        required
      />
      <TextField
        fullWidth
        type="datetime-local"
        label="Event Date"
        InputLabelProps={{ shrink: true }}
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        sx={{ mb: 2, maxWidth: 400 }} // Limit the width of the text field for better centering
        required
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ maxWidth: 200 }}
      >
        Schedule Event
      </Button>
    </Box>
  );
};

export default EventForm;
