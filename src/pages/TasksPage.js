import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Typography } from "@mui/material";
import CreateTask from "../components/CreateTask";
import DailyTaskPanel from "../components/DailyTaskPanel";
import WeeklyTaskPanel from "../components/WeeklyTaskPanel";
import axios from "axios";
import { UserContext } from "../components/UserContext";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext); // Get the logged-in user's info

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          withCredentials: true,
        });
        setTasks(response.data); // Set the fetched tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks.");
      }
    };

    fetchTasks();
  }, []);

  // Handle the addition of a new task
  const handleNewTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add the new task to the list
  };

  // Handle task deletion
  const handleDeleteTask = async (taskID) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskID}`, {
        withCredentials: true,
      });
      // Remove the deleted task from the UI
      setTasks(tasks.filter((task) => task.taskID !== taskID));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete the task.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Apartment Tasks
        </Typography>

        {/* Task creation form */}
        <CreateTask onTaskCreated={handleNewTask} />

        {/* Display daily tasks */}
        <DailyTaskPanel
          tasks={tasks.filter((task) => !task.isWeekly)}
          user={user}
          handleDeleteTask={handleDeleteTask}
        />

        {/* Display weekly tasks */}
        <WeeklyTaskPanel
          tasks={tasks.filter((task) => task.isWeekly)}
          user={user}
          handleDeleteTask={handleDeleteTask}
        />

        {/* Display error messages */}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default TasksPage;
