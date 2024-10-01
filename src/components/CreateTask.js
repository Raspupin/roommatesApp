import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const CreateTask = ({ onTaskCreated }) => {
  const [taskDesc, setTaskDesc] = useState("");
  const [isWeekly, setIsWeekly] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Only needed for weekly tasks
  const [error, setError] = useState("");

  // Handle task submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!taskDesc || !startDate) {
      setError("Please fill out all required fields.");
      return;
    }

    // Prepare the end date: if the task is not weekly, the end date will be the same as the start date
    const finalEndDate = isWeekly ? endDate : startDate;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          taskDesc,
          isWeekly,
          startDate,
          endDate: finalEndDate,
        },
        { withCredentials: true }
      );

      onTaskCreated(response.data.task); // Pass the newly created task to the parent component
      setTaskDesc("");
      setStartDate("");
      setEndDate("");
      setError("");
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Task
      </Typography>
      <TextField
        label="Task Description"
        fullWidth
        value={taskDesc}
        onChange={(e) => setTaskDesc(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Start Date"
        type="date"
        fullWidth
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        required
      />

      {/* Show end date picker only if it's a weekly task */}
      {isWeekly && (
        <TextField
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={isWeekly}
            onChange={(e) => setIsWeekly(e.target.checked)}
            color="primary"
          />
        }
        label="Is this a weekly task?"
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Task
      </Button>
    </Box>
  );
};

export default CreateTask;
