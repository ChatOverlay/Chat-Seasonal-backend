const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ChatMessage = require('./src/models/ChatMessage');
const SeasonalUser = require('./src/models/SeasonalUser');
const SeasonCourse = require('./src/models/SeasonCourse');
const MileageLog = require('./src/models/MileageLog');

const initializeWebSocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('joinRoom', async (titleName) => {
      try {
        const course = await SeasonCourse.findOne({ lectureRoom: titleName });
        if (!course) {
          socket.emit("error", { message: "존재하지 않는 강의실입니다." });
          return;
        }

        socket.join(titleName);
        console.log(`A user joined room: ${titleName}`);

        socket.emit("roomJoined", {
          lectureTime: course.lectureTime,
          courseName: course.courseName,
        });

        const messages = await ChatMessage.find({ roomId: titleName })
          .sort({ createdAt: 1 })
          .populate('userId', 'nickName profilePictureUrl');

        for (const message of messages) {
          if (!message.userId) {
            console.warn('Message with null userId found:', message);
            continue; // userId가 null인 경우 건너뛰기
          }
    
          socket.emit("message", {
            text: message.text,
            userId: message.userId._id,
            userName: message.userId.nickName,
            profilePictureUrl: message.userId.profilePictureUrl,
            timestamp: message.createdAt.toISOString(),
            expiresAt: message.expiresAt.toISOString(),
            isCurrentUser: message.userId._id.toString() === socket.decoded.id,
          });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("message", async (messageObject, titleName) => {
      jwt.verify(messageObject.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err);
          return;
        }

        const userInfo = await SeasonalUser.findById(decoded.id);
        if (!userInfo) {
          console.error("User not found");
          return;
        }

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const chatMessage = new ChatMessage({
          roomId: titleName,
          userId: userInfo._id,
          text: messageObject.text,
          createdAt: new Date(),
          expiresAt,
        });

        await chatMessage.save();

        const messageToSend = {
          text: messageObject.text,
          userId: userInfo._id,
          userName: userInfo.nickName,
          profilePictureUrl: userInfo.profilePictureUrl,
          timestamp: chatMessage.createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          isCurrentUser: true,
        };

        socket.emit("message", messageToSend);

        messageToSend.isCurrentUser = false;
        socket.to(titleName).emit("message", messageToSend);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mileageLog = await MileageLog.findOneAndUpdate(
          { userId: decoded.id, date: today },
          { $inc: { totalMileage: 10 } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        let mileageToAdd = 10;
        if (mileageLog.totalMileage + mileageToAdd > 110) {
          mileageLog.totalMileage = 100;
        } else {
          userInfo.totalMileage += mileageToAdd;
        }

        await mileageLog.save();
        await userInfo.save();

        socket.emit("mileageUpdated", {
          newMileage: mileageLog.totalMileage,
          totalMileage: userInfo.totalMileage,
        });
      });
    });

    socket.on("getInitialMileage", async (data) => {
      jwt.verify(data.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err);
          return;
        }

        const userInfo = await SeasonalUser.findById(decoded.id);
        if (!userInfo) {
          console.error("User not found");
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mileageLog = await MileageLog.findOne({
          userId: decoded.id,
          date: today,
        });

        socket.emit("mileageUpdated", {
          newMileage: mileageLog ? mileageLog.totalMileage : 0,
          totalMileage: userInfo.totalMileage,
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

module.exports = initializeWebSocketServer;
