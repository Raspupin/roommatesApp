// Import required modules
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Import JWT package
const cookieParser = require("cookie-parser");
// Secret key for signing JWTs (should be kept private and secure)
const jwtSecret = "your_jwt_secret_key";
//const bcrypt = require("bcrypt"); // Assuming passwords are hashed using bcrypt (recommended) FOR LATER US!!

// Middleware to handle JSON requests
const app = express();
app.use(express.json());
app.use(cookieParser()); // Add this middleware to parse cookies
app.use(cors({ origin: true, credentials: true })); // Enable CORS with credentials

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

// Example API route to get data from 'note' table
app.get("/api/notes", (req, res) => {
  const sqlQuery = "SELECT * FROM note"; // Correct table name 'note'
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      res.status(500).send("Server error");
    } else {
      res.json(result); // Send the fetched data as a JSON response
    }
  });
});

// API route for user login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  const sqlQuery = "SELECT * FROM user WHERE email = ?";
  db.query(sqlQuery, [email], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Server error" });
      return;
    }

    if (result.length === 0) {
      // User not found
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const user = result[0];

    // Verify password (you'll use bcrypt later for hashing)
    if (password === user.password) {
      // If password is correct, generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, firstName: user.fName },
        jwtSecret,
        {
          expiresIn: "1h", // Token expires in 1 hour
        }
      );

      // Send token in a cookie (HttpOnly for security)
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "Strict",
      });

      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

// Middleware to authenticate using JWT from cookies
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Attach user info to request
    next();
  });
};
//API request to retrive users first name
app.get("/api/user", authenticateToken, (req, res) => {
  // Now the JWT contains `firstName`, so retrieve it from req.user
  const { firstName } = req.user;

  // Respond with the user's firstName
  res.json({ loggedIn: true, user: { firstName } });
});
//API request to retrive users first name
app.get("/api/user", authenticateToken, (req, res) => {
  // Now the JWT contains `firstName`, so retrieve it from req.user
  const { firstName } = req.user;

  // Respond with the user's firstName
  res.json({ loggedIn: true, user: { firstName } });
});

// Example protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = 5000; // The port the server will run on
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
