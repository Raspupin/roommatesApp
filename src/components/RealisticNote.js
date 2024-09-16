import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const RealisticNote = ({ note, user, handleDeleteNote }) => {
  return (
    <Box
      key={note.noteID}
      sx={{
        width: "250px", // Narrow width to make it vertical
        minHeight: "300px", // Minimum height for a paper-like note
        mb: 2,
        p: 3, // Increased padding for better spacing
        display: "flex",
        flexDirection: "column", // Make the layout vertical
        justifyContent: "space-between", // Align content
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#fffde7", // Light yellow background to mimic paper
        boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
        fontFamily: "Courier, monospace", // Courier font for a hand-written feel
      }}
    >
      <Box>
        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
          {note.noteDesc}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          Posted by {note.email} on{" "}
          {new Date(note.dateNotePosted).toLocaleString()}
        </Typography>
      </Box>

      {/* Show delete button only for the note owner */}
      {user && user.email === note.email && (
        <IconButton
          onClick={() => handleDeleteNote(note.noteID)}
          color="error"
          sx={{ alignSelf: "flex-end" }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default RealisticNote;
