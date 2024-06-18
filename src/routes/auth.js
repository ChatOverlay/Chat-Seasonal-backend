const express = require('express');
const { registerSeasonalUser, loginSeasonalUser,adminLogin, verifyAdmin, sendVerificationCode, verifyEmailCode,verifyEmail, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

// 회원가입 라우트
router.post('/seasonal/signup', registerSeasonalUser);

// 로그인 라우트
router.post('/seasonal/login', loginSeasonalUser);

// 관리자 로그인 라우트
router.post('/adminLogin', adminLogin);

// 관리자 인증 확인 라우트
router.get('/verifyAdmin', authenticateToken, verifyAdmin);

// 이메일 인증 코드 전송 라우트
router.post('/sendVerificationCode', sendVerificationCode);

// 이메일 인증 코드 검증 라우트
router.post('/verifyEmailCode', verifyEmailCode);

// 이메일 중복 확인 라우트
router.post('/checkEmail', verifyEmail);

// 토큰 검증 라우트
router.get('/verifyToken', authenticateToken, verifyToken);

module.exports = router;
