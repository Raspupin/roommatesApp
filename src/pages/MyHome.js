import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Box } from "@mui/material";

function MyHome() {
  const [roommates, setRoommates] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [latestNotes, setLatestNotes] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch roommates
        const roommatesResponse = await axios.get(
          "http://localhost:5000/api/home/roommates",
          {
            withCredentials: true,
          }
        );
        setRoommates(roommatesResponse.data);

        // Fetch today's tasks
        const tasksResponse = await axios.get(
          "http://localhost:5000/api/home/tasks/today",
          {
            withCredentials: true,
          }
        );
        setTodayTasks(tasksResponse.data);

        // Fetch today's events
        const eventsResponse = await axios.get(
          "http://localhost:5000/api/home/events/today",
          {
            withCredentials: true,
          }
        );
        setTodayEvents(eventsResponse.data);

        // Fetch the latest notes
        const notesResponse = await axios.get(
          "http://localhost:5000/api/home/notes/latest",
          {
            withCredentials: true,
          }
        );
        setLatestNotes(notesResponse.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Home Overview
        </Typography>

        {/* Roommates Section */}
        <Typography variant="h6">Roommates:</Typography>
        <ul>
          {roommates.map((mate) => (
            <li key={mate.email}>
              {mate.fName} {mate.lName} ({mate.email})
            </li>
          ))}
        </ul>

        {/* Today's Tasks Section */}
        <Typography variant="h6">Today's Tasks:</Typography>
        <ul>
          {todayTasks.map((task) => (
            <li key={task.taskID}>
              {task.taskDesc} (Due: {task.startDate})
            </li>
          ))}
        </ul>

        {/* Today's Events Section */}
        <Typography variant="h6">Today's Events:</Typography>
        <ul>
          {todayEvents.map((event) => (
            <li key={event.eventID}>
              {event.eventDesc} (Event Date: {event.eventDate})
            </li>
          ))}
        </ul>

        {/* Latest Notes Section */}
        <Typography variant="h6">Latest Notes:</Typography>
        <ul>
          {latestNotes.map((note) => (
            <li key={note.noteID}>
              {note.noteDesc} (Posted by {note.email})
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
}

export default MyHome;
