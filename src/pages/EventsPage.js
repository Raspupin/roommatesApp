import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Typography } from "@mui/material";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import GoogleCalendar from "../components/GoogleCalendar";
import axios from "axios";
import { UserContext } from "../components/UserContext"; // Import UserContext to get the logged-in user
import CompanyLogo from "../components/CompanyLogo";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext); // Get the logged-in user's info

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          withCredentials: true,
        });
        setEvents(response.data); // Set the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  // Function to handle the addition of a new event
  const handleNewEvent = (newEvent) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]); // Add the new event to the top of the list
  };

  // Function to delete an event
  const handleDeleteEvent = async (eventID) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventID}`, {
        withCredentials: true,
      });
      // Remove the deleted event from the UI
      setEvents(events.filter((event) => event.eventID !== eventID));
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete the event.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <CompanyLogo />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Apartment Events
          </Typography>
          {/* Event scheduling form */}
          <EventForm onEventCreated={handleNewEvent} />
        </Box>
        {/* Display scheduled events */}
        <EventList
          events={events}
          user={user}
          handleDeleteEvent={handleDeleteEvent}
        />

        {/* Display error messages */}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
      {/* <GoogleCalendar /> */}
    </Container>
  );
}

export default EventsPage;
