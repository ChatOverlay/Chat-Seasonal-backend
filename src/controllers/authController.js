const registerSeasonalUser = require("../services/registerService");
const loginSeasonalUser = require("../services/loginService");
const sendVerificationCode = require("../services/sendVerificationCodeService");
const checkEmail = require("../services/checkEmailService");
const adminLoginService = require("../services/adminLoginService");
const { verificationCodes } = require("../services/verificationCodes");
const AdminUser = require('../models/AdminUser'); // AdminUser 모델을 불러옵니다.

const registerUser = async (req, res) => {
  try {
    const { studentNumber, name, password, email, course, nickName } = req.body;
    const response = await registerSeasonalUser({
      studentNumber,
      name,
      password,
      email,
      course,
      nickName,
    });
    res.status(201).json(response);
  } catch (error) {
    console.error("회원가입 처리 중 오류 발생:", error);
    if (error.message.includes("이미 존재하는 학번입니다.") || error.message.includes("이미 사용 중인 이메일입니다.")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }
  }
};

const loginUser = async (req, res) => {
  const { studentNumber, password } = req.body;

  try {
    const result = await loginSeasonalUser({ studentNumber, password });
    res.json(result);
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
};

const sendCode = (req, res) => {
  const { email } = req.body;

  try {
    sendVerificationCode(email);
    res.json({ message: "Verification code sent successfully." });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Error sending verification code." });
  }
};

const adminLogin = async (req, res) => {
  const { password } = req.body;

  try {
    const response = await adminLoginService(password);
    res.json(response);
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyAdmin = (req, res) => {
  res.json({ success: true, message: "Admin is authenticated" });
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await checkEmail(email);
    res.json(result);
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Error checking email." });
  }
};

const verifyToken = (req, res) => {
  res.json({ success: true, message: "Token is valid" });
};

const getUserCourses = async (req, res) => {
  const { email } = req.user;

  try {
    const user = await SeasonalUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json({ course: user.course });
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

const verifyEmailCode = (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] === verificationCode) {
    delete verificationCodes[email]; // 사용된 인증 코드를 삭제
    res.json({ message: "Email verified successfully." });
  } else {
    res.status(400).json({ message: "Invalid verification code." });
  }
};

module.exports = {
  registerSeasonalUser: registerUser,
  loginSeasonalUser: loginUser,
  adminLogin,
  verifyAdmin,
  sendVerificationCode: sendCode,
  verifyEmailCode,
  verifyEmail,
  verifyToken,
  getUserCourses,
};
