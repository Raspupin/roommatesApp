import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, IconButton, Container } from "@mui/material";
import Note from "../components/Note"; // Import the Note.js component
import axios from "axios";
import { UserContext } from "../components/UserContext"; // Access user context
import RealisticNote from "../components/RealisticNote";
import CompanyLogo from "../components/CompanyLogo";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const { user, setUser } = useContext(UserContext); // Access user from context

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.data.loggedIn) {
          setUser(response.data.user); // Set the user's firstName if logged in
        }
      } catch (error) {
        console.log("User not logged in");
        setUser(null); // If no user is logged in, reset to null
      }
    };

    fetchUser();
  }, [setUser]);

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes", {
          withCredentials: true,
        });
        setNotes(response.data); // Set the fetched notes
        console.log("Fetched Notes:", response.data); // Log fetched notes
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes.");
      }
    };

    fetchNotes();
  }, []);

  // Function to handle the addition of a new note
  const handleNewNote = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]); // Add the new note to the top of the list
  };

  // Function to delete a note
  const handleDeleteNote = async (noteID) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteID}`, {
        withCredentials: true,
      });
      // Remove the deleted note from the UI
      setNotes(notes.filter((note) => note.noteID !== noteID));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete the note.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CompanyLogo />
        <Typography variant="h4" gutterBottom>
          Apartment Notes
        </Typography>
        {/* Display note creation form */}
        <Container maxWidth="md">
          <Note onNoteCreated={handleNewNote} />
        </Container>
        {/* Display notes */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            justifyContent: "center",
            p: 4, // Padding inside the board
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625496235025-d783abf061c8?q=80&w=2040&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            backgroundSize: "auto", // Ensures the texture covers the entire area
            backgroundPosition: "center", // Center the image
            backgroundRepeat: "auto",
            borderRadius: "12px", // Rounded corners for a more realistic board look

            // Updated: Lighter wooden-like border
            border: "12px solid #DEB887", // Lightened wood color (BurlyWood)

            // Updated: More pronounced shadow for 3D effect
            boxShadow:
              "inset 0 0 10px rgba(0, 0, 0, 0.2), 5px 5px 15px rgba(0, 0, 0, 0.5)", // Stronger external shadow for depth
          }}
        >
          {notes.length > 0 ? (
            notes.map((note) => (
              <RealisticNote
                key={note.noteID}
                note={note}
                user={user} // Pass user from context to the RealisticNote component
                handleDeleteNote={handleDeleteNote} // Pass the delete handler
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No notes available.
            </Typography>
          )}

          {/* Display error messages */}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
