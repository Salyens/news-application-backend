const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketManager = require("./utils/socket");

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:3001", "http://127.0.0.1:5500", "http://127.0.0.1:5501"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public/uploads'));
app.use(require("./routes"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((e) => console.log(e));

const server = http.createServer(app);
const io = socketManager.init(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
