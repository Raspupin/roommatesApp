import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

const DailyTaskPanel = ({ tasks, user, handleDeleteTask }) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const theme = useTheme(); // Access the MUI theme

  // Filter tasks for the current date (daily tasks)
  const dailyTasks = tasks.filter(
    (task) => !task.isWeekly && task.startDate.slice(0, 10) === currentDate
  );

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        border: "2px solid #C0C0C0", // Bright silver border
        borderRadius: 3,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      <Typography variant="h5" gutterBottom>
        Today's Tasks
      </Typography>

      {dailyTasks.length > 0 ? (
        dailyTasks.map((task) => (
          <Box
            key={task.taskID}
            sx={{
              mb: 2,
              p: 2,
              position: "relative", // Enable absolute positioning for the delete button
              display: "flex",
              justifyContent: "center", // Horizontally center the text
              alignItems: "center", // Vertically center the text
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main, // Use theme color for task background
              color: theme.palette.primary.contrastText, // Ensure text contrasts with background
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Shadow for the task box
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center the text inside the inner box
                textAlign: "center", // Center text horizontally
              }}
            >
              <Typography variant="body1">{task.taskDesc}</Typography>
              <Typography variant="caption" color="text.secondary">
                Assigned to: {task.email}
              </Typography>
            </Box>

            {/* Show delete button only for the task owner */}
            {user && user.email === task.email && (
              <IconButton
                onClick={() => handleDeleteTask(task.taskID)}
                color="error"
                sx={{
                  position: "absolute", // Make delete button independent of the flex layout
                  right: 8, // Move it to the far right
                  top: "50%", // Center it vertically
                  transform: "translateY(-50%)", // Adjust to properly center
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tasks for today.
        </Typography>
      )}
    </Box>
  );
};

export default DailyTaskPanel;
