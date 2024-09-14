// Import required modules
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const jwtSecret = "your_jwt_secret_key"; // Keep secret key safe

// Middleware to handle JSON requests
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Update origin to match frontend

// MySQL database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "879988",
  database: "room8_db",
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
  const sqlQuery = "SELECT * FROM note";
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).send("Server error");
    }
    res.json(result);
  });
});

// API route for user login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  const sqlQuery = "SELECT * FROM user WHERE email = ?";
  db.query(sqlQuery, [email], (err, result) => {
    if (err) {
      console.error("Error fetching user from database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0]; // Get user details, including apartmentId

    // Verify password
    if (password === user.password) {
      // Fetch the apartmentName using the user's apartmentId
      const sqlApartmentQuery =
        "SELECT apartmentName FROM apartment WHERE apartmentId = ?";
      db.query(
        sqlApartmentQuery,
        [user.apartmentId],
        (err, apartmentResult) => {
          if (err) {
            console.error("Error fetching apartment name:", err);
            return res
              .status(500)
              .json({ error: "Database error while fetching apartment" });
          }

          const apartmentName =
            apartmentResult.length > 0
              ? apartmentResult[0].apartmentName
              : null;

          // Generate the JWT token, including apartmentName in the token payload
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              firstName: user.fName,
              apartmentId: user.apartmentId,
              apartmentName: apartmentName, // Add apartmentName to token
            },
            jwtSecret,
            { expiresIn: "1h" }
          );
          console.log("User Info:", token); // Check if apartmentName is included
          // Send the token as a cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true for HTTPS in production
            sameSite: "Strict",
          });

          return res.status(200).json({ message: "Login successful" });
        }
      );
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

// Middleware to authenticate using JWT from cookies
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API request to retrieve user's first name, apartmentId, and apartmentName
app.get("/api/user", authenticateToken, (req, res) => {
  const { firstName, apartmentId } = req.user; // Retrieve firstName and apartmentId from JWT payload

  // Fetch the apartmentName using apartmentId from the 'apartment' table
  const sqlApartmentQuery =
    "SELECT apartmentName FROM apartment WHERE apartmentId = ?";
  db.query(sqlApartmentQuery, [apartmentId], (err, apartmentResult) => {
    if (err) {
      console.error("Error fetching apartment name:", err);
      return res
        .status(500)
        .json({ error: "Database error while fetching apartment" });
    }

    const apartmentName =
      apartmentResult.length > 0 ? apartmentResult[0].apartmentName : null;

    // Respond with the user's firstName, apartmentId, and apartmentName
    res.json({
      loggedIn: true,
      user: { firstName, apartmentId, apartmentName },
    });
  });
});

// Example protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// API route for sign-out
app.post("/api/logout", (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS in production
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// API route for user registration
app.post("/api/register", (req, res) => {
  const { fName, lName, email, password, dateJoined } = req.body;

  // Check if email already exists
  const sqlCheckUser = "SELECT * FROM user WHERE email = ?";
  db.query(sqlCheckUser, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Insert new user into the database without password hashing (as plain text for now)
    const sqlInsertUser = `
  INSERT INTO user (fName, lName, email, password, dateJoined, apartmentId) 
  VALUES (?, ?, ?, ?, ?, NULL)
`;

    db.query(
      sqlInsertUser,
      [fName, lName, email, password, dateJoined],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error registering user" });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// API route to join an existing apartment
app.post("/api/join-apartment", (req, res) => {
  const { apartmentId, email } = req.body; // Receive email from frontend

  // Update the user's apartmentId based on their email
  const sqlUpdateUser = "UPDATE user SET apartmentId = ? WHERE email = ?";
  db.query(sqlUpdateUser, [apartmentId, email], (err, result) => {
    if (err) {
      console.error("Error updating user's apartment:", err);
      return res.status(500).json({ message: "Error joining apartment" });
    }
    res.status(200).json({ message: "Joined apartment successfully" });
  });
});

// API route to create a new apartment
app.post("/api/create-apartment", (req, res) => {
  const { apartmentName, address, email, city } = req.body; // Receive email and apartment details from frontend

  // Insert the new apartment into the apartment table
  const sqlInsertApartment =
    "INSERT INTO apartment (apartmentName, address, city) VALUES (?, ?, ?)";

  db.query(
    sqlInsertApartment,
    [apartmentName, address, city],
    (err, result) => {
      if (err) {
        console.error("Error creating apartment:", err);
        return res.status(500).json({ message: "Error creating apartment" });
      }

      // Get the newly created apartmentId from the result.insertId
      const newApartmentId = result.insertId;

      // Now update the user's apartmentId in the user table using the email
      const sqlUpdateUser = "UPDATE user SET apartmentId = ? WHERE email = ?";
      db.query(sqlUpdateUser, [newApartmentId, email], (err, result) => {
        if (err) {
          console.error("Error updating user's apartmentId:", err);
          return res
            .status(500)
            .json({ message: "Error updating user's apartmentId" });
        }

        res
          .status(200)
          .json({ message: "Apartment created and user updated successfully" });
      });
    }
  );
});

//---------------------------Notes API-------------------------------------------
// API route to create a new note
app.post("/api/notes", authenticateToken, (req, res) => {
  const { noteDesc } = req.body;
  const { email, apartmentId } = req.user; // Extract email and apartmentId from the JWT token

  if (!noteDesc || !email || !apartmentId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const dateNotePosted = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Current date in MySQL format

  // Insert note into the database
  const sqlInsertNote = `
    INSERT INTO note (email, apartmentId, dateNotePosted, noteDesc)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sqlInsertNote,
    [email, apartmentId, dateNotePosted, noteDesc],
    (err, result) => {
      if (err) {
        console.error("Error inserting note into the database:", err);
        return res.status(500).json({ message: "Server error." });
      }
      res.status(201).json({ message: "Note created successfully!" });
    }
  );
});

// API route to fetch notes for the current user's apartment
app.get("/api/notes", authenticateToken, (req, res) => {
  const { apartmentId } = req.user; // Extract apartmentId from the JWT token

  if (!apartmentId) {
    return res.status(400).json({ message: "Missing apartment ID." });
  }

  const sqlFetchNotes = `
    SELECT noteID, email, apartmentId, dateNotePosted, noteDesc
    FROM note
    WHERE apartmentId = ?
    ORDER BY dateNotePosted DESC
  `;

  db.query(sqlFetchNotes, [apartmentId], (err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result); // Return the fetched notes
  });
});

// API route to delete a user's note
app.delete("/api/notes/:noteID", authenticateToken, (req, res) => {
  const { noteID } = req.params;
  const { email } = req.user; // User's email from the JWT token

  if (!noteID) {
    return res.status(400).json({ message: "Missing note ID." });
  }

  const sqlDeleteNote = `
    DELETE FROM note
    WHERE noteID = ? AND email = ?
  `;

  db.query(sqlDeleteNote, [noteID, email], (err, result) => {
    if (err) {
      console.error("Error deleting note:", err);
      return res.status(500).json({ message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or note not found." });
    }
    res.status(200).json({ message: "Note deleted successfully." });
  });
});
//---------------------------Notes API END-------------------------------------------

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); //test
});
