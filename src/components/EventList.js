import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

const EventList = ({ events, user, handleDeleteEvent }) => {
  const theme = useTheme(); // Access the MUI theme
  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: "center",
          justifyContent: "center", // Center the text horizontally
          alignItems: "center", // Vertically center the text
        }}
      >
        Scheduled Events
      </Typography>

      {events.length > 0 ? (
        events.map((event) => (
          <Box
            key={event.eventID}
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: theme.palette.secondary.main, // Use theme color for task background
              color: theme.palette.secondary.contrastText, // Ensure text contrasts with background
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between", // Align content with space between
              alignItems: "center", // Align vertically
            }}
          >
            <Box>
              <Typography variant="body1">
                <EventIcon sx={{ mr: 1 }} />
                {event.eventDesc}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Event Date: {new Date(event.eventDate).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted by: {event.email}
              </Typography>
            </Box>

            {/* Show delete button only for the event owner */}
            {user && user.email === event.email && (
              <IconButton
                onClick={() => handleDeleteEvent(event.eventID)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No events scheduled.
        </Typography>
      )}
    </Box>
  );
};

export default EventList;
