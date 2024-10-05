import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook
import CompanyLogo from "../components/CompanyLogo";

function MyHome() {
  const [roommates, setRoommates] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [latestNotes, setLatestNotes] = useState([]);
  const theme = useTheme(); // Use MUI theme

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const roommatesResponse = await axios.get(
          "http://localhost:5000/api/home/roommates",
          { withCredentials: true }
        );
        setRoommates(roommatesResponse.data);

        const tasksResponse = await axios.get(
          "http://localhost:5000/api/home/tasks/today",
          { withCredentials: true }
        );
        setTodayTasks(tasksResponse.data);

        const eventsResponse = await axios.get(
          "http://localhost:5000/api/home/events/today",
          { withCredentials: true }
        );
        setTodayEvents(eventsResponse.data);

        const notesResponse = await axios.get(
          "http://localhost:5000/api/home/notes/latest",
          { withCredentials: true }
        );
        setLatestNotes(notesResponse.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          border: `5px solid ${theme.palette.secondary.main}`, // Thicker border for 3D effect
          borderRadius: "20px", // Slightly more rounded corners for a smoother look
          padding: "30px", // Increased padding for more space inside
          backgroundColor: theme.palette.background.default, // Background color of the control panel
          boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.3)", // Stronger shadow for 3D effect
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <CompanyLogo />
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            My Home Overview
          </Typography>
        </Container>
        {/* Grid Layout to organize sections */}
        <Grid container spacing={3}>
          {/* Roommates Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Roommates
                </Typography>
                <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                  {roommates.length > 0 ? (
                    <ul>
                      {roommates.map((mate) => (
                        <li key={mate.email}>
                          {mate.fName} {mate.lName} ({mate.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No roommates found.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Tasks Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Tasks
                </Typography>
                <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                  {todayTasks.length > 0 ? (
                    <ul>
                      {todayTasks.map((task) => (
                        <li key={task.taskID}>
                          {task.taskDesc} (Due: {task.startDate})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No tasks for today.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Events Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Events
                </Typography>
                <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                  {todayEvents.length > 0 ? (
                    <ul>
                      {todayEvents.map((event) => (
                        <li key={event.eventID}>
                          {event.eventDesc} (Event Date: {event.eventDate})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No events for today.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Notes Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Notes
                </Typography>
                <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                  {latestNotes.length > 0 ? (
                    <ul>
                      {latestNotes.map((note) => (
                        <li key={note.noteID}>
                          {note.noteDesc} (Posted by {note.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No recent notes.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default MyHome;
