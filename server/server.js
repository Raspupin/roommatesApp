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
              lastName: user.lName,
              apartmentId: user.apartmentId,
              apartmentName: apartmentName, // Add apartmentName to token
            },
            jwtSecret,
            { expiresIn: "1h" }
          );
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

// API request to retrieve user's first name, apartmentId, and apartmentName and username(primary key for user)
app.get("/api/user", authenticateToken, (req, res) => {
  const { firstName, lastName, apartmentId, email } = req.user; // Retrieve firstName and apartmentId from JWT payload

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
      user: { firstName, lastName, apartmentId, apartmentName, email },
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
//---------------------------Events API-------------------------------------------
// API route to create a new event
app.post("/api/events", authenticateToken, (req, res) => {
  const { eventDesc, eventDate } = req.body;
  const { email, apartmentId } = req.user; // Extract email and apartmentId from the JWT token

  if (!eventDesc || !eventDate || !email || !apartmentId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const postedDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date in MySQL format

  const sqlInsertEvent = `
    INSERT INTO event (email, apartmentID, postedDate, eventDate, eventDesc)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sqlInsertEvent,
    [email, apartmentId, postedDate, eventDate, eventDesc],
    (err, result) => {
      if (err) {
        console.error("Error inserting event into the database:", err);
        return res.status(500).json({ message: "Server error." });
      }

      const newEvent = {
        eventID: result.insertId, // Get the newly created eventID
        email,
        apartmentId,
        postedDate,
        eventDate,
        eventDesc,
      };

      res
        .status(201)
        .json({ message: "Event created successfully!", event: newEvent });
    }
  );
});

// API route to fetch events for the current user's apartment
app.get("/api/events", authenticateToken, (req, res) => {
  const { apartmentId } = req.user; // Extract apartmentId from the JWT token

  if (!apartmentId) {
    return res.status(400).json({ message: "Missing apartment ID." });
  }

  const sqlFetchEvents = `
    SELECT eventID, email, apartmentID, postedDate, eventDate, eventDesc
    FROM event
    WHERE apartmentID = ?
    ORDER BY eventDate DESC
  `;

  db.query(sqlFetchEvents, [apartmentId], (err, result) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result); // Return the fetched events
  });
});

// API route to delete a user's event
app.delete("/api/events/:eventID", authenticateToken, (req, res) => {
  const { eventID } = req.params;
  const { email } = req.user; // User's email from the JWT token

  if (!eventID) {
    return res.status(400).json({ message: "Missing event ID." });
  }

  const sqlDeleteEvent = `
    DELETE FROM event
    WHERE eventID = ? AND email = ?
  `;

  db.query(sqlDeleteEvent, [eventID, email], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or event not found." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  });
});

//---------------------------HomePage API-------------------------------------------
// API route to get roommate information (users in the same apartment)
app.get("/api/home/roommates", authenticateToken, (req, res) => {
  const { apartmentId } = req.user;

  const sqlFetchRoommates = `
    SELECT email, fName, lName
    FROM user
    WHERE apartmentId = ?
  `;

  db.query(sqlFetchRoommates, [apartmentId], (err, result) => {
    if (err) {
      console.error("Error fetching roommates:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result);
  });
});

// API route to get today's daily tasks for the current user's apartment
app.get("/api/home/tasks/today", authenticateToken, (req, res) => {
  const { apartmentId } = req.user;
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const sqlFetchDailyTasks = `
    SELECT taskID, email, apartmentId, taskDesc, startDate, endDate, isWeekly
    FROM task
    WHERE apartmentId = ? AND isWeekly = 0 AND DATE(startDate) = ?
  `;

  db.query(sqlFetchDailyTasks, [apartmentId, today], (err, result) => {
    if (err) {
      console.error("Error fetching daily tasks:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result);
  });
});
// API route to fetch today's events for the current user's apartment
app.get("/api/home/events/today", authenticateToken, (req, res) => {
  const { apartmentId } = req.user;
  const today = new Date().toISOString().split("T")[0]; // Get only the date part

  const sqlFetchTodayEvents = `
    SELECT eventID, email, apartmentID, postedDate, eventDate, eventDesc
    FROM event
    WHERE apartmentID = ? AND DATE(eventDate) = ?
    ORDER BY eventDate DESC
  `;

  db.query(sqlFetchTodayEvents, [apartmentId, today], (err, result) => {
    if (err) {
      console.error("Error fetching today's events:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result);
  });
});
// API route to fetch the last 3 notes for the current user's apartment
app.get("/api/home/notes/latest", authenticateToken, (req, res) => {
  const { apartmentId } = req.user;

  const sqlFetchLatestNotes = `
    SELECT noteID, email, apartmentId, dateNotePosted, noteDesc
    FROM note
    WHERE apartmentId = ?
    ORDER BY dateNotePosted DESC
    LIMIT 3
  `;

  db.query(sqlFetchLatestNotes, [apartmentId], (err, result) => {
    if (err) {
      console.error("Error fetching latest notes:", err);
      return res.status(500).json({ message: "Server error." });
    }
    res.json(result);
  });
});
//---------------------------Tasks API-------------------------------------------
//post to server tasks
app.post("/api/tasks", authenticateToken, (req, res) => {
  const { taskDesc, isWeekly, startDate, endDate } = req.body;
  const { email, apartmentId } = req.user;

  const sqlInsertTask = `
    INSERT INTO task (email, apartmentId, isWeekly, taskDesc, startDate, endDate, isCompleted)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(
    sqlInsertTask,
    [email, apartmentId, isWeekly, taskDesc, startDate, endDate],
    (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).json({ message: "Server error." });
      }

      const newTask = {
        taskID: result.insertId,
        email,
        apartmentId,
        isWeekly,
        taskDesc,
        startDate,
        endDate,
        isCompleted: false,
      };

      res
        .status(201)
        .json({ message: "Task created successfully!", task: newTask });
    }
  );
});
//fetch from server tasks
app.get("/api/tasks", authenticateToken, (req, res) => {
  const { apartmentId } = req.user;

  const sqlFetchTasks = `
    SELECT taskID, email, apartmentId, isCompleted, taskDesc, startDate, endDate, isWeekly
    FROM task
    WHERE apartmentId = ?
    ORDER BY startDate DESC
  `;

  db.query(sqlFetchTasks, [apartmentId], (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "Server error." });
    }

    res.json(result);
  });
});
// API route to delete a user's task
app.delete("/api/tasks/:taskID", authenticateToken, (req, res) => {
  const { taskID } = req.params;
  const { email } = req.user; // User's email from the JWT token

  if (!taskID) {
    return res.status(400).json({ message: "Missing task ID." });
  }

  const sqlDeleteTask = `
    DELETE FROM task
    WHERE taskID = ? AND email = ?
  `;

  db.query(sqlDeleteTask, [taskID, email], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or task not found." });
    }
    res.status(200).json({ message: "Task deleted successfully." });
  });
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

      const newNote = {
        noteID: result.insertId, // Get the newly created noteID
        email,
        apartmentId,
        dateNotePosted,
        noteDesc,
      };

      res
        .status(201)
        .json({ message: "Note created successfully!", note: newNote });
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
