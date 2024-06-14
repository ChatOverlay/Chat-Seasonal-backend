const express = require('express');
const router = express.Router();
const { registerSeasonalUser, loginSeasonalUser } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authenticateToken');

// 회원가입 라우트
router.post('/seasonal/signup', registerSeasonalUser);

// 로그인 라우트
router.post('/seasonal/login', loginSeasonalUser);

module.exports = router;
