import React, { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Note from "../components/Note";

const NotesPage = () => {
  const [notes, setNotes] = useState([]); // State to hold notes data
  const [error, setError] = useState(""); // State to handle errors

  // Fetch notes from the backend when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes") // API call to your backend
      .then((response) => {
        setNotes(response.data); // Store fetched notes in state
      })
      .catch((error) => {
        setError("Error fetching notes data");
        console.error(error);
      });
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Notes Page
      </Typography>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <Note />

      <List>
        {notes.map((note) => (
          <ListItem key={note.noteID}>
            <ListItemText primary={note.email} secondary={note.noteDesc} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default NotesPage;
