const express = require('express');
const { registerSeasonalUser, loginSeasonalUser, sendVerificationCode, verifyEmail, verifyToken, getUserCourses } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

// 회원가입 라우트
router.post('/seasonal/signup', registerSeasonalUser);

// 로그인 라우트
router.post('/seasonal/login', loginSeasonalUser);

// 이메일 인증 코드 전송 라우트
router.post('/sendVerificationCode', sendVerificationCode);

// 이메일 중복 확인 라우트
router.post('/checkEmail', verifyEmail);

// 토큰 검증 라우트
router.get('/verifyToken', authenticateToken, verifyToken);

// 사용자 코스 불러오기 라우트
router.get('/user/courses', authenticateToken, getUserCourses); // 추가된 부분

module.exports = router;
