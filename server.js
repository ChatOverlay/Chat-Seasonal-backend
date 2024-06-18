const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./src/config/db");
const initializeWebSocketServer = require("./socketHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware settings
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
connectDB();

// Routes
const authRoutes = require("./src/routes/auth");
const seasonCourseRoutes = require("./src/routes/seasoncourse");
const userRoutes = require("./src/routes/seasonUser");
const seasonalReportRoutes = require("./src/routes/seasonalReport"); // Added seasonal report routes

app.use("/auth", authRoutes);
app.use("/seasoncourses", seasonCourseRoutes);
app.use("/user", userRoutes);
app.use("/report", seasonalReportRoutes); // Use seasonal report routes

const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
