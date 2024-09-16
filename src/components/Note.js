import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

export default function Note({ onNoteCreated }) {
  const [noteDesc, setNoteDesc] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNoteSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccessMessage("");

    try {
      // Send the note data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/notes",
        {
          noteDesc, // Send the note description entered by the user
        },
        {
          withCredentials: true, // Ensure the cookies are sent with the request
        }
      );

      if (response.status === 201) {
        const newNote = response.data.note; // Get the newly created note from the backend response
        setNoteDesc(""); // Clear the input field
        setSuccessMessage("Note posted successfully!");

        // Call the onNoteCreated callback to update the notes list in the parent component
        onNoteCreated(newNote);
      }
    } catch (error) {
      console.error("Error creating note:", error);
      setError("Failed to post the note. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleNoteSubmit}
      sx={{
        mt: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create a New Note
      </Typography>

      <TextField
        label="Note Description"
        fullWidth
        margin="normal"
        multiline
        minRows={3}
        value={noteDesc}
        onChange={(e) => setNoteDesc(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Post Note
      </Button>

      {/* Success message */}
      {successMessage && (
        <Typography color="green" variant="body1" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}

      {/* Error message */}
      {error && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
