const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const socketManager = require("./utils/socket");
const { FILES_FOLDER } = require("./common/constants");

dotenv.config(); // Load environment variables from .env file

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
  "http://localhost:3002",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "https://news-application-frontend.onrender.com"
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

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(express.static(FILES_FOLDER)); // Serve static files
app.use(require("./routes")); // Use routes defined in the routes directory

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
io.of('/news').on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Handle incoming messages
  socket.on("message", (data) => {
    io.of('/news').emit("message", `${socket.id.substring(0, 5)}: ${data}`);
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
