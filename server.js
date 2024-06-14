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
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static('uploads')); // 업로드된 파일 제공

// MongoDB 연결
connectDB();

// 라우트 설정
const authRoutes = require("./src/routes/auth");
const seasonCourseRoutes = require("./src/routes/seasoncourse"); // 추가된 코스 라우트
const userRoutes = require("./src/routes/user"); // 추가된 사용자 라우트

app.use("/auth", authRoutes);
app.use("/seasoncourses", seasonCourseRoutes); // 코스 라우트 사용
app.use("/user", userRoutes); // 사용자 라우트 사용

const server = http.createServer(app);

// WebSocket 서버 초기화
initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
