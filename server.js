const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./src/config/db");
const initializeWebSocketServer = require("./webSocketServer"); // WebSocket 서버 초기화 함수 임포트

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
connectDB();

// 라우트 설정
const authRoutes = require("./src/routes/auth");
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

// WebSocket 서버 초기화
initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
