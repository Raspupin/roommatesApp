import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const RealisticNote = ({ note, user, handleDeleteNote }) => {
  return (
    <Box
      key={note.noteID}
      sx={{
        width: "250px", // Paper-like width
        minHeight: "300px", // Minimum height for note appearance
        mb: 2,
        p: 3, // Padding inside the note
        display: "flex",
        flexDirection: "column", // Vertical layout
        justifyContent: "space-between",
        border: "2px solid rgba(0, 0, 0, 0.1)", // Light border
        borderRadius: "8px",
        backgroundColor: "#fffde7", // Light yellow background like paper
        boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a pop effect
        fontFamily: "Courier, monospace", // Handwritten look
        backgroundImage: `
          repeating-linear-gradient(
            to bottom,
            transparent, 
            transparent 29px, 
            rgba(173, 216, 230, 0.3) 30px, 
            rgba(173, 216, 230, 0.3) 31px 
          )
        `, // Creates horizontal lines spaced 30px apart
        backgroundSize: "100% 100%", // Full coverage
        position: "relative", // So we can position the pin absolutely
      }}
    >
      {/* Pin effect at the top center of the note */}
      <Box
        sx={{
          position: "absolute",
          top: "-10px", // Position above the note
          left: "50%", // Center the pin horizontally
          transform: "translateX(-50%)", // Perfect centering
          width: "20px", // Pin size
          height: "20px", // Pin size
          border: "1px solid black", // Pin border
          borderRadius: "50%", // Circle shape
          backgroundColor: "#CEEEFF", // Silver color for the pin
          boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.3)", // Shadow leaning towards southeast
          display: "flex", // Flex to position the lines inside
          justifyContent: "center", // Center the lines horizontally
          alignItems: "center", // Center the lines vertically
          "::before": {
            content: '""',
            position: "absolute",
            width: "1px",
            height: "60%", // Vertical line
            backgroundColor: "black",
          },
          "::after": {
            content: '""',
            position: "absolute",
            width: "60%", // Horizontal line
            height: "1px",
            backgroundColor: "black",
          },
        }}
      />
      {/* Note content */}
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
          <DeleteForeverIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default RealisticNote;
