/**
 * @fileoverview Entry point of the server application.
 * Configures environment variables, sets up Express server, connects to MongoDB, 
 * initializes Socket.IO, and defines the server routes.
 */

const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketManager = require("./utils/socket");
const { FILES_FOLDER } = require("./common/constants");

// Initialize Express app
const app = express();

/**
 * Port number for the server to listen on.
 * @const {number}
 */
const PORT = process.env.PORT || 3000;

/**
 * Array of allowed origins for CORS.
 * @const {string[]}
 */
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
];

/**
 * CORS options configuration.
 * @const {Object}
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow requests with no origin or from allowed origins
    } else {
      callback(new Error("Not allowed by CORS")); // Reject other origins
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// Apply CORS middleware with specified options
app.use(cors(corsOptions));

// Serve static files from the specified folder
app.use(express.static(path.join(__dirname, FILES_FOLDER)));

// Use routes defined in the routes directory
app.use(require("./routes"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((e) => console.log(e));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketManager.init(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Handle Socket.IO connection event
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Handle incoming messages
  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  // Handle disconnection event
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
