// Import required modules
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Create an Express app
const app = express();

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS to allow requests from the React frontend

// MySQL database connection configuration
const db = mysql.createConnection({
  host: "localhost", // Replace with your MySQL host (usually localhost)
  user: "root", // Replace with your MySQL username
  password: "879988", // Replace with your MySQL password
  database: "room8_db", // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Define a test route to check the connection
app.get("/", (req, res) => {
  res.send("Hello, the backend is connected to MySQL!");
});

// API route to fetch note from the database
app.get("/api/notes", (req, res) => {
  const sqlQuery = "SELECT * FROM note"; // Assuming 'notes' is your table name
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error fetching note:", err);
      res.status(500).send("Server error");
    } else {
      res.json(result); // Send the fetched data as a JSON response
    }
  });
});

// Start the server
const PORT = 5000; // The port the server will run on
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
