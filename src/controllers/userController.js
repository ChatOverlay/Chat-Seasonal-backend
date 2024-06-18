const SeasonalUser = require("../models/SeasonalUser");
const SeasonCourse = require("../models/SeasonCourse");
const MileageLog = require('../models/MileageLog');

const multer = require("multer");
const path = require("path");
const getLectureStatus = require("../utils/getLectureStatus"); // 추가된 부분

// 프로필 사진 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const getUserInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await SeasonalUser.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error });
  }
};

const updateNickName = async (req, res) => {
  const userId = req.user.id;
  const { nickName } = req.body;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { nickName },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating nickname", error });
  }
};

const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { profilePictureUrl },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};

const resetProfilePicture = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await SeasonalUser.findByIdAndUpdate(
      userId,
      { profilePictureUrl: "" },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error resetting profile picture", error });
  }
};

const getUserCourses = async (req, res) => {
  const { studentNumber } = req.user;

  try {
    const user = await SeasonalUser.findOne({ studentNumber });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // Fetch the course details
    const courseDetails = await SeasonCourse.findOne({
      courseName: user.course,
    });
    if (!courseDetails) {
      return res.status(404).json({ message: "코스를 찾을 수 없습니다." });
    }

    // Extract only necessary details
    const { courseCode, courseName, lectureRoom, lectureTime } = courseDetails;

    // Determine lecture status
    const { inSession, nearestLecture } = getLectureStatus(lectureTime);

    res.json({
      userCourse: user.course,
      courseDetails: {
        courseCode,
        courseName,
        lectureRoom,
        lectureTime,
        inSession,
        nearestLecture,
      },
    });
  } catch (error) {
    console.error("사용자 코스를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({
        message: "사용자 코스를 가져오는 중 오류가 발생했습니다.",
        error,
      });
  }
};


const getUserMileage = async (req, res) => {
  try {
    const userId = req.user.id;

    const mileageLog = await MileageLog.findOne({ userId });
    if (!mileageLog) {
      return res.status(404).json({ message: '마일리지 정보를 찾을 수 없습니다.' });
    }

    res.json({ totalMileage: mileageLog.totalMileage });
  } catch (error) {
    console.error('마일리지 정보를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

module.exports = {
  getUserInfo,
  updateNickName,
  uploadProfilePicture,
  resetProfilePicture,
  upload,
  getUserCourses,
  getUserMileage,
};
