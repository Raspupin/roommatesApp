import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const WeeklyTaskPanel = ({ tasks, user, handleDeleteTask }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Weekly Tasks
      </Typography>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Box
            key={task.taskID}
            sx={{
              mb: 2,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <Box>
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
                sx={{ alignSelf: "flex-end" }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No weekly tasks assigned.
        </Typography>
      )}
    </Box>
  );
};

export default WeeklyTaskPanel;
