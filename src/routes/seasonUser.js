const express = require("express");
const {
  getUserInfo,
  updateNickName,
  uploadProfilePicture,
  resetProfilePicture,
  upload,
  getUserCourses,
  getUserMileage,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/info", authenticateToken, getUserInfo);
router.post("/update-nickname", authenticateToken, updateNickName);
router.post(
  "/upload-profile-picture",
  authenticateToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.delete("/reset-profile-picture", authenticateToken, resetProfilePicture);
// 사용자 코스 불러오기 라우트
router.get("/courses", authenticateToken, getUserCourses);
router.get("/mileage", authenticateToken, getUserMileage); // 새로운 라우트 추가

module.exports = router;
