import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const EventForm = ({ onEventCreated }) => {
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6">Schedule an Event</Typography>

      <TextField
        fullWidth
        label="Event Description"
        value={eventDesc}
        onChange={(e) => setEventDesc(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        fullWidth
        type="datetime-local"
        label="Event Date"
        InputLabelProps={{ shrink: true }}
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary">
        Schedule Event
      </Button>
    </Box>
  );
};

export default EventForm;
